import type { NormalizedSourceEntry } from '../types';
import { fetchAllSources } from '../sources';
import { getAllowedTickerOrder, isTickerAllowed } from '../assets';

const DEFAULT_UNIVERSE = getAllowedTickerOrder();
const TOP_SIGNALS_COUNT = 5;
const OPENAI_MODEL = 'gpt-4o-mini';
const OPENAI_TIMEOUT_MS = 8_000;
const SYSTEM_PROMPT =
  'Du bist ein präziser Nachrichtenaggregator für Kryptowährungen. Analysiere die gegebenen Beispiele und liefere für jedes Asset ein JSON-Objekt mit keys: symbol, sentiment (bullish|bearish|neutral), score (0-1), confidence (0-1), rationale (2-4 Sätze), top_signals (Array von { source, evidence }).';

type OpenAIClient = {
  chat: {
    completions: {
      create(options: {
        model: string;
        messages: { role: 'system' | 'user'; content: string }[];
        signal?: AbortSignal;
        temperature?: number;
        max_tokens?: number;
      }): Promise<{
        choices?: Array<{ message?: { content?: string } }>;
      }>;
    };
  };
};

let cachedOpenAI: OpenAIClient | null | undefined;

type Signal = { source: string; evidence: string; score?: number };

export type AssetReport = {
  symbol: string;
  sentiment: 'bullish' | 'bearish' | 'neutral';
  score: number;
  confidence: number;
  rationale: string;
  top_signals: Signal[];
};

export type AggregatedReport = {
  date: string;
  universe: string[];
  assets: AssetReport[];
  method_note: string;
};

const positiveKeywords = ['pump', 'bull', 'rally', 'surge', 'auf', 'steig', 'ankünd', 'positiv', 'stark', 'erholt'];
const negativeKeywords = ['dump', 'bear', 'fall', 'drop', 'sink', 'schwäche', 'verlust', 'abfluss', 'skepsis'];

function clamp(value: number, min = 0, max = 1): number {
  return Math.max(min, Math.min(max, value));
}

function safeTime(ts: string): number {
  const parsed = Date.parse(ts);
  return Number.isNaN(parsed) ? 0 : parsed;
}

async function getOpenAIClient(): Promise<OpenAIClient | null> {
  if (cachedOpenAI !== undefined) {
    return cachedOpenAI;
  }
  try {
    const mod = await import('../openai');
    cachedOpenAI = mod.openai as OpenAIClient;
    return cachedOpenAI;
  } catch (error) {
    cachedOpenAI = null;
    if (error instanceof Error) {
      console.warn('OpenAI client not available:', error.message);
    }
    return null;
  }
}

function heuristicSentiment(signals: Signal[]): { score: number; sentiment: AssetReport['sentiment'] } {
  let bias = 0;
  for (const signal of signals) {
    const lower = signal.evidence.toLowerCase();
    for (const keyword of positiveKeywords) {
      if (lower.includes(keyword)) {
        bias += 0.08;
      }
    }
    for (const keyword of negativeKeywords) {
      if (lower.includes(keyword)) {
        bias -= 0.08;
      }
    }
  }
  const score = clamp(0.5 + bias, 0, 1);
  const sentiment: AssetReport['sentiment'] =
    score > 0.6 ? 'bullish' : score < 0.4 ? 'bearish' : 'neutral';
  return { score, sentiment };
}

function heuristicConfidence(posts: NormalizedSourceEntry[]): number {
  const engagement = posts.reduce((total, post) => total + (post.engagement ?? 0), 0);
  const uniqueSources = new Set(posts.map((post) => post.source)).size;
  const engagementFactor = clamp(engagement / 1500);
  const sourceFactor = clamp(uniqueSources / 3);
  return clamp(0.3 + engagementFactor * 0.55 + sourceFactor * 0.25);
}

function fallbackRationale(symbol: string, signals: Signal[]): string {
  if (!signals.length) {
    return `Keine aktuellen Signale zu ${symbol}.`;
  }
  const samples = signals
    .slice(0, 3)
    .map((signal) => `${signal.source}: ${signal.evidence}`)
    .join(' | ');
  return `Heuristische Zusammenfassung für ${symbol}: ${samples}`;
}

function buildUserPrompt(symbol: string, signals: Signal[]): string {
  const evidenceList = signals
    .map((signal) => `${signal.source}: ${signal.evidence.replace(/\s+/g, ' ').trim()}`)
    .join(', ');
  return `Erzeuge pro Asset ein kurzes Summary basierend auf den folgenden Top-Signalen: [${evidenceList}]. Gib rein JSON zurück ohne zusätzliche Erklärungen.`;
}

type ParsedRationale = {
  sentiment?: AssetReport['sentiment'];
  score?: number;
  confidence?: number;
  rationale?: string;
};

type OpenAICompletionResponse = {
  choices?: Array<{ message?: { content?: string } }>;
};

async function summarizeRationale(symbol: string, signals: Signal[]): Promise<{ rationale: string; usedFallback: boolean; parsed?: ParsedRationale }> {
  const fallback = fallbackRationale(symbol, signals);
  if (!signals.length) {
    return { rationale: fallback, usedFallback: true };
  }
  const client = await getOpenAIClient();
  if (!client) {
    return { rationale: fallback, usedFallback: true };
  }
  // Use Promise.race to implement a timeout without relying on the OpenAI SDK
  // accepting an AbortSignal (some SDK versions return 400 for unknown args).
  try {
    const aiPromise = client.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: buildUserPrompt(symbol, signals) },
      ],
      temperature: 0.2,
      max_tokens: 220,
    });

    const response = (await Promise.race([
      aiPromise,
      new Promise((_, rej) => setTimeout(() => rej(new Error('openai-timeout')), OPENAI_TIMEOUT_MS)),
    ])) as OpenAICompletionResponse;

    let content = response.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error('OpenAI lieferte keine Antwort');
    }
    if (typeof content === 'string') {
      content = content.trim();
    }

    // strip markdown code fences if present
    if (typeof content === 'string') {
      content = content.replace(/```\s*json\s*/i, '').replace(/```/g, '').trim();
    }

    // try to extract a JSON substring and parse it
    let parsed: ParsedRationale | undefined = undefined;
    if (typeof content === 'string') {
      try {
        // find first { and last }
        const first = content.indexOf('{');
        const last = content.lastIndexOf('}');
        if (first !== -1 && last !== -1 && last > first) {
          const maybeJson = content.slice(first, last + 1);
          const parsedJson = JSON.parse(maybeJson);
          parsed = typeof parsedJson === 'object' && parsedJson !== null ? (parsedJson as ParsedRationale) : undefined;
        } else {
          const parsedJson = JSON.parse(content);
          parsed = typeof parsedJson === 'object' && parsedJson !== null ? (parsedJson as ParsedRationale) : undefined;
        }
      } catch (e) {
        // not valid JSON â€“ ignore parsed
        parsed = undefined;
      }
    }

    // prefer parsed.rationale if available, otherwise use the raw content
    const rationaleText = parsed?.rationale ?? content ?? fallback;
    return { rationale: String(rationaleText), usedFallback: false, parsed };
  } catch (error) {
    console.warn('OpenAI-Zusammenfassung fehlgeschlagen:', error instanceof Error ? error.message : error);
    return { rationale: fallback, usedFallback: true };
  }
}

function normalizeUniverse(options?: { universe?: string[] }): string[] {
  const provided = options?.universe
    ?.map((asset) => asset.trim().toUpperCase())
    .filter((asset) => asset)
    .filter((asset) => isTickerAllowed(asset));
  const preferred =
    provided && provided.length
      ? Array.from(new Set(provided))
      : Array.from(DEFAULT_UNIVERSE);
  return preferred;
}

function parseSinceTimestamp(since?: string): number | undefined {
  if (!since) {
    return undefined;
  }
  const parsed = Date.parse(since);
  return Number.isNaN(parsed) ? undefined : parsed;
}

/** Erzeugt einen Report aus aggregierten Social/News/On-Chain-Signalen. */
export async function aggregateNews(options?: {
  universe?: string[];
  since?: string;
}): Promise<AggregatedReport> {
  const universe = normalizeUniverse(options);
  const sinceTimestamp = parseSinceTimestamp(options?.since);
  const reportDate = new Date().toISOString().slice(0, 10);
  const allPosts = await fetchAllSources();
  const allowedPosts = allPosts.filter((post) => isTickerAllowed(post.asset));
  const filtered = allowedPosts.filter((post) => {
    const symbol = post.asset.toUpperCase();
    if (!universe.includes(symbol)) {
      return false;
    }
    if (sinceTimestamp) {
      const postTime = safeTime(post.timestamp);
      return postTime >= sinceTimestamp;
    }
    return true;
  });
  if (!filtered.length) {
    return {
      date: reportDate,
      universe,
      assets: [],
      method_note: 'no source data',
    };
  }

  const buckets = new Map<string, NormalizedSourceEntry[]>();
  for (const post of filtered) {
    const symbol = post.asset.toUpperCase();
    const bucket = buckets.get(symbol) ?? [];
    bucket.push(post);
    buckets.set(symbol, bucket);
  }

  const reports: AssetReport[] = [];
  const fallbackAssets: string[] = [];

  for (const symbol of universe) {
    const posts = buckets.get(symbol);
    if (!posts?.length) {
      continue;
    }
    const topSignals = [...posts]
        .sort((a, b) => {
        const engagementDiff = (b.engagement ?? 0) - (a.engagement ?? 0);
        if (engagementDiff !== 0) {
          return engagementDiff;
        }
        return safeTime(b.timestamp) - safeTime(a.timestamp);
      })
      .slice(0, TOP_SIGNALS_COUNT)
      .map((post) => ({
        source: post.source,
        evidence: post.summary.trim(),
      }));

    let { sentiment, score } = heuristicSentiment(topSignals);
    let confidence = heuristicConfidence(posts);
    const { rationale, usedFallback, parsed } = await summarizeRationale(symbol, topSignals);
    if (usedFallback) {
      fallbackAssets.push(symbol);
    }
    // if the model returned structured data, prefer those numeric/label values
    if (parsed && typeof parsed === 'object') {
      if (parsed.sentiment && (parsed.sentiment === 'bullish' || parsed.sentiment === 'bearish' || parsed.sentiment === 'neutral')) {
        sentiment = parsed.sentiment;
      }
      if (typeof parsed.score === 'number' && !Number.isNaN(parsed.score)) {
        score = clamp(parsed.score, 0, 1);
      }
      if (typeof parsed.confidence === 'number' && !Number.isNaN(parsed.confidence)) {
        confidence = clamp(parsed.confidence, 0, 1);
      }
    }
    reports.push({
      symbol,
      sentiment,
      score,
      confidence,
      rationale,
      top_signals: topSignals,
    });
  }

  const allowedReports = reports.filter((report) => isTickerAllowed(report.symbol));
  if (!allowedReports.length) {
    return {
      date: reportDate,
      universe,
      assets: [],
      method_note: 'no source data',
    };
  }

  const methodNoteParts = ['Aggregierte Signale aus Social, News und Onchain.'];
if (fallbackAssets.length) {
  methodNoteParts.push(
    `OpenAI-Fallback für ${fallbackAssets.join(', ')}; heuristische Rationale verwendet.`
  );
}

  return {
    date: reportDate,
    universe,
    assets: allowedReports.sort((a, b) => b.score - a.score),
    method_note: methodNoteParts.join(' '),
  };
}
