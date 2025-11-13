import { openai } from './openai';
import type { DailyCryptoSentiment, NormalizedSourceEntry } from './types';
import { isDailyCryptoSentiment } from './types';
import { isTickerAllowed } from './assets';
// Import des JSON-Schemas mit Import-Attribut (ESM)
// TS benötigt resolveJsonModule und unterstützt Import-Attribute in Bundlern
// (Next.js / TS5 + bundler Auflösung)
import schema from '../schema/sentiment.schema.json' assert { type: 'json' };

type JsonRecord = Record<string, unknown>;

function isRecord(v: unknown): v is JsonRecord {
  return typeof v === 'object' && v !== null;
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
        const t = (part as JsonRecord).text;
        if (typeof t === 'string') {
          try {
            return JSON.parse(t) as unknown;
          } catch {
            // ignore and continue searching
          }
        }
      }
    }
  }
  // Fallback auf aggregiertes Textfeld, falls vorhanden
  const output_text = (resp as JsonRecord).output_text;
  if (typeof output_text === 'string') {
    try {
      return JSON.parse(output_text) as unknown;
    } catch {
      return undefined;
    }
  }
  return undefined;
}

export async function runDailySentiment(
  unified: ReadonlyArray<NormalizedSourceEntry>
): Promise<DailyCryptoSentiment> {
  const system =
    'Du bist eine Krypto-Analyse-KI. Aggregiere Signale aus Social, News und On-Chain, ' +
    'und erstelle einen täglichen Bericht auf Asset-Ebene. Antworte ausschließlich im JSON gemäß Schema.';

  const allowedPosts = unified.filter((post) => isTickerAllowed(post.asset));
  const inputPosts = allowedPosts.slice(0, 500);

  const model = process.env.OPENAI_MODEL || 'gpt-4o-2024-08-06';
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
              'Erzeuge den Tagesbericht. Felder strikt gemäß JSON-Schema. ' +
              'Setze sinnvolle Werte basierend auf den Posts und fasse prägnant zusammen.',
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
}
