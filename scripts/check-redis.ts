import path from 'path';
import dotenv from 'dotenv';
import { berlinDateString } from '../lib/timezone';

import { Redis } from '@upstash/redis';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const url = process.env.KV_REST_API_URL ?? process.env.REDIS_URL;
const token =
  process.env.KV_REST_API_TOKEN ??
  process.env.REDIS_TOKEN ??
  process.env.REDIS_URL?.split('://')[1]?.split('@')[0];

if (!url) {
  throw new Error('REDIS_URL fehlt');
}

const redis = new Redis({
  url,
  token,
});

const locales: Array<'de' | 'en'> = ['de', 'en'];
const today = berlinDateString();

async function main() {
  for (const locale of locales) {
    const key = `news:${locale}:${today}`;
    const snapshot = await redis.get<string>(key);
    console.log({ locale, key, hasSnapshot: !!snapshot });
    if (snapshot) {
      let parsed: unknown = snapshot;
      if (typeof snapshot === 'string') {
        try {
          parsed = JSON.parse(snapshot);
        } catch {
          console.warn('Snapshot payload is not valid JSON, showing raw value');
        }
      }
      const parsedSnapshot =
        typeof parsed === 'object' && parsed !== null
          ? (parsed as { assets?: unknown[]; generatedAt?: string })
          : {};
      const assetCount = Array.isArray(parsedSnapshot.assets) ? parsedSnapshot.assets.length : 'n/a';
      const generatedAt = typeof parsedSnapshot.generatedAt === 'string' ? parsedSnapshot.generatedAt : null;
      if (!generatedAt) {
        console.warn('  WARN: Snapshot ohne generatedAt');
      }
      console.log(
        `  assets: ${assetCount}`,
        `generatedAt: ${generatedAt ?? 'missing'}`
      );
    }
  }
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
