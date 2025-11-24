import { getOpenAIClient } from './openai';
import type { DailyCryptoSentiment, NormalizedSourceEntry } from './types';
import { isDailyCryptoSentiment } from './types';
import { isTickerAllowed } from './assets';
import { berlinDateString } from './timezone';
import { writeLog } from './monitoring/logs';
import schema from '../schema/sentiment.schema.json' assert { type: 'json' };

type JsonRecord = Record<string, unknown>;

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === 'object' && value !== null;
}

function findOutputJson(resp: unknown): unknown | undefined {
  if (!isRecord(resp)) return undefined;
  const output = (resp as JsonRecord).output;
  if (!Array.isArray(output)) return undefined;
  for (const item of output) {
    if (!isRecord(item)) continue;
    const content = (item as JsonRecord).content;
    if (!Array.isArray(content)) continue;
    for (const part of content) {
      if (!isRecord(part)) continue;
      const type = (part as JsonRecord).type;
      if (type === 'output_json' && 'json' in (part as JsonRecord)) {
        return (part as JsonRecord).json as unknown;
      }
      if (type === 'output_text' && 'text' in (part as JsonRecord)) {
        const text = (part as JsonRecord).text;
        if (typeof text === 'string') {
          try {
            return JSON.parse(text) as unknown;
          } catch {
            // ignore parse errors and continue searching
          }
        }
      }
    }
  }
  const outputText = (resp as JsonRecord).output_text;
  if (typeof outputText === 'string') {
    try {
      return JSON.parse(outputText) as unknown;
    } catch {
      return undefined;
    }
  }
  return undefined;
}

async function logOpenAIWarning(message: string, context?: unknown): Promise<void> {
  try {
    await writeLog({
      level: 'warn',
      message,
      context: typeof context === 'string' ? context : JSON.stringify(context),
    });
  } catch {
    console.warn(message, context);
  }
}

function buildFallbackReport(posts: ReadonlyArray<NormalizedSourceEntry>, reason: string): DailyCryptoSentiment {
  const date = berlinDateString(new Date());
  const symbols = Array.from(
    new Set(
      posts
        .filter((post) => isTickerAllowed(post.asset))
        .map((post) => post.asset.trim().toUpperCase())
    )
  );

  const assets = symbols.map((symbol) => ({
    symbol,
    sentiment: 'neutral' as const,
    score: 0,
    confidence: 0,
    rationale: `OpenAI fallback: ${reason || 'no rationale available'}`,
    top_signals: [],
  }));

  return {
    date,
    universe: symbols,
    assets,
    macro_summary: 'OpenAI fallback: neutral sentiment used.',
    method_note: `openai-fallback: ${reason || 'OpenAI unavailable'}`,
  };
}

export async function runDailySentiment(
  unified: ReadonlyArray<NormalizedSourceEntry>
): Promise<DailyCryptoSentiment> {
  const system =
    'Du bist eine Krypto-Analyse-KI. Aggregiere Signale aus Social, News und On-Chain, ' +
    'und erstelle einen t\u00e4glichen Bericht auf Asset-Ebene. Antworte ausschlie\u00dflich im JSON gem\u00e4\u00df Schema.';

  const allowedPosts = unified.filter((post) => isTickerAllowed(post.asset));
  const inputPosts = allowedPosts.slice(0, 500);

  const model = process.env.OPENAI_MODEL || 'gpt-4o-2024-08-06';

  try {
    const openai = getOpenAIClient();
    const response = await openai.responses.create({
      model,
      text: {
        format: {
          type: 'json_schema',
          name: 'DailyCryptoSentiment',
          schema: schema as unknown as JsonRecord,
          strict: true,
        },
      },
      input: [
        {
          role: 'system',
          content: [{ type: 'input_text', text: system }],
        },
        {
          role: 'user',
          content: [
            {
              type: 'input_text',
              text:
                'Erzeuge den Tagesbericht. Felder strikt gem\u00e4\u00df JSON-Schema. ' +
                'Setze sinnvolle Werte basierend auf den Posts und fasse pr\u00e4gnant zusammen.',
            },
            {
              type: 'input_text',
              text: 'POSTS_JSON:\n' + JSON.stringify({ posts: inputPosts }),
            },
          ],
        },
      ],
    });

    const parsed = findOutputJson(response);
    if (!parsed || !isDailyCryptoSentiment(parsed)) {
      throw new Error('OpenAI-Response ist leer oder entspricht nicht dem erwarteten Schema.');
    }
    return parsed;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await logOpenAIWarning('runDailySentiment fallback triggered', message);
    return buildFallbackReport(allowedPosts, message);
  }
}
