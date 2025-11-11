/**
 * CLI zum lokalen Erstellen des News-Aggregationsreports.
 * Wird am besten mit z.B. `npx tsx scripts/fetch-news.mjs` ausgeführt, damit TypeScript-Dateien korrekt aufgelöst werden.
 */
import 'dotenv/config';
import fs from 'node:fs/promises';
import path from 'node:path';
// Note: use dynamic import to be resilient to runtime module formats (named vs default export).

function parseUniverseArg(value) {
  return value
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);
}

function buildOptions() {
  const opts = {};
  for (const arg of process.argv.slice(2)) {
    if (arg.startsWith('--universe=')) {
      opts.universe = parseUniverseArg(arg.split('=')[1] ?? '');
    } else if (arg.startsWith('--since=')) {
      opts.since = arg.split('=')[1] ?? undefined;
    } else if (arg === '--help' || arg === '-h') {
      console.log('Usage: npx tsx scripts/fetch-news.mjs [--universe=BTC,ETH] [--since=YYYY-MM-DD]');
      process.exit(0);
    } else {
      console.warn(`Unbekannter Parameter: ${arg}`);
    }
  }
  return opts;
}

const REPORTS_DIR = path.join(process.cwd(), 'data', 'reports');

async function main() {
  const options = buildOptions();
  // dynamically import aggregator to handle TS/ESM/CJS interop
  const mod = await import('../lib/news/aggregator');
  const aggregateNews =
    mod.aggregateNews ?? (mod.default && (mod.default.aggregateNews ?? mod.default));
  if (typeof aggregateNews !== 'function') {
    throw new Error('aggregateNews not found in ../lib/news/aggregator');
  }
  const report = await aggregateNews(options);
  await fs.mkdir(REPORTS_DIR, { recursive: true });
  const targetFile = path.join(REPORTS_DIR, `${report.date}-news.json`);
  await fs.writeFile(targetFile, JSON.stringify(report, null, 2), 'utf8');
  console.log(`Report gespeichert: ${targetFile}`);
}

main().catch((error) => {
  console.error('Fehler beim Erstellen des Reports:', error);
  process.exit(1);
});
