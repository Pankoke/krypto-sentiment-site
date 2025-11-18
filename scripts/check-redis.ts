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
      const parsed = JSON.parse(snapshot);
      console.log(`  assets: ${parsed.assets?.length ?? 'n/a'}`, `generatedAt: ${parsed.generatedAt}`);
    }
  }
  console.log('Done.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
