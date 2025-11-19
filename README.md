# Krypto Sentiment Site - Quickstart

Die Repo nutzt Next.js 14 (App Router) mit TypeScript strict und i18n (de/en). Die Startseite zeigt den aktuellen News-Score für BTC/ETH/SOL/XRP aus persistierten Snapshots; eine eigene `/reports/[date]`-Detailseite gibt es nicht mehr, die Daten liegen weiterhin als JSON unter `data/reports/YYYY-MM-DD.json`. Secrets (News- und Sentiment-APIs) laufen ausschließlich serverseitig.

## Voraussetzungen

- Node.js 18.18 LTS oder neuer
- npm (pnpm/yarn/bun funktionieren ebenfalls)
- `.env.local` mit den Secrets aus dem Abschnitt weiter unten

## Installation & Betrieb

```bash
npm install
npm run dev         # http://localhost:3000
npm run build
npm run start
```

Tests:

```bash
npm run lint
npm run score:test   # führt `vitest tests/scoring.test.tsx` (ohne Watch) aus
npx vitest run tests/news-page.test.tsx
```

## Architektur & Routing

- `app/` enthält die App-Router-Struktur: `/[locale]` ist die News-Startseite, `app/[locale]/(pages)/news/page.tsx` liest den Tages-Snapshot, `app/[locale]/methodik` zeigt die Methodik-Page. Die Navigation (LocaleNav) respektiert das Locale und liefert nur noch Home/Methodik.
- Die News-Seite ist eine Server Component mit ISR (revalidate=86400) und nutzt das Cache-Tag `news-daily`, das nach jedem Snapshot-Refresh invalidiert wird.
- Die Daily-Report-Detailseiten unter `/reports` wurden entfernt; die UI arbeitet direkt mit den gepersistierten JSON-Snapshots.

## Daten & Persistenz

- `data/reports/` enthält die täglichen Sentiment-Berichte (Format `YYYY-MM-DD.json`) für Backfills und Admin-Checks.
- `data/news/` speichert locale-spezifische News-Snapshots `YYYY-MM-DD.{locale}.json`, aus denen die News-Startseite und andere statische Seiten lesen. Fehlt eine Datei, zeigt die Seite einen sanften Empty-State ("Kein Report gespeichert").
- Die Snapshot-Dateien orientieren sich am Europe/Berlin-Datum; vor 06:00 Uhr fällt die Seite auf den letzten verfügbaren Stand zurück und zeigt ein Hinweis-Banner. Jeder Snapshot-Zugriff loggt Pfad, Größe, Deduplizierung und Adapter-Warnungen.
- **Hinweis für Serverless:** Alle Persistenz erfolgt über den Snapshot-Dump im GitHub-Workflow; Dateien liegen im Repository `data/{news,reports,metrics}`. Schreibe nicht direkt ins Dateisystem auf Vercel.

## Daily APIs & Cron

- `GET /api/daily/generate` (internes Secret über `DAILY_API_SECRET`) löst das Scoring und die Snapshot-Persistenz aus. Standardmäßig überschreibt `mode=overwrite`; mit `mode=skip` bleiben bestehende Tage unangetastet. Die Route liefert `{ ok, date, locales, assets }` plus Logs (Adapter-Fehler, Dedupe).
- `GET /api/news/generate` aggregiert einmal täglich die News, schreibt die locale-spezifischen Dateien und ruft `revalidateTag('news-daily')` auf.
- Cron (z. B. Vercel) ruft `/api/news/generate` plus optional `/api/daily/generate` (06:00 CET empfohlen) ab; danach ist die News-Home-Seite über ISR bzw. den `news-daily`-Tag frisch.

## Admin-Tool (DEV)

- Zugriff über `/admin/snapshots` (nur während `NODE_ENV !== 'production'`), listet die letzten sieben Dateien pro Locale mit Pfad, Größe, mtime und Item-Anzahl.
- Buttons `Neu generieren` + `Validieren` nutzen `/api/news/generate` bzw. `/api/news/validate`, fordern `news-daily`-Revalidation an und zeigen die Antwort direkt an. Das `Anzeigen`-Details-Panel rendert eine kurze Vorschau der Assets.
- Nutze das Tool, um leere/fehlende Snapshots schnell zu identifizieren, bevor du den Dev-Button via Navbar oder Home benutzt.

## GitHub Action für Daily Run

### Ablauf täglich 06:00 Berlin (GitHub Actions)

- Zwei Cron-Trigger (UTC 05:00/CET + UTC 04:00/CEST) liefern 06:00 Europe/Berlin. Der Workflow ruft `/api/generate/daily-run` (TARGET_URL) mit Header `x-cron-secret` auf, erzeugt News- und Report-Snapshots für `de`/`en`, speichert Daily-Metriken und feuert `revalidateTag('news-daily')` sowie `revalidateTag('reports-daily')`.
- Bis zu drei Versuche (15/30/60 s Backoff) prüfen Status und `partial`. `partial=false` + `ok=false` oder HTTP 5xx führen direkt zum Fehler, `partial=true` bleibt grün mit Warnung. Danach wird `/api/health` (HEALTH_URL) gezogen: `newsItemsCount>0`, `assetsCount>0`, `lastRunStatus≠fail` müssen stimmen.

### Manuell auslösen (`workflow_dispatch`)

- Inputs: `mode` (`overwrite|skip`), `locale` (`de|en|both`), `dryRun` (`yes|no`). Sie landen als Query-Parameter in TARGET_URL (Header bleibt `x-cron-secret`).
- Beispiel: `mode=skip`, `locale=de`, `dryRun=yes` testet nur News-DE ohne Überschreiben.
- Logs zeigen Inputs plus `items`, `assets`, `partial`, `durationMs`, sodass du Fixes sofort verifizieren kannst.

### Fehler & Fallbacks

- `partial=true` bedeutet, ein Teil hat Probleme. Workflow bleibt grün, Health und Banner zeigen „Stand … (letzter Snapshot)“. `partial=false && ok=false` oder 5xx führt zu rotem Status.
- UI-Fallback: `/de/news` zeigt bei fehlendem heutigen Snapshot Banner + Retry-Link, bei echten Fehlern eine Fehlermeldung plus Button „Erneut versuchen“.
- Logs protokollieren `snapshotPath`, `itemsTotal`, `dedupeCount`, `adaptersFailed`, aber niemals Secrets.

### Security

- Secrets (`TARGET_URL`, `HEALTH_URL`, `CRON_SECRET`) leben in GitHub Secrets; sie werden nie `echo`t oder in JSON zurückgegeben.
- Der Workflow nutzt Header `x-cron-secret`, damit Monitoring-Tools nicht einfach Parameter auslesen.
- Bei Rotation neue Secrets setzen; kein Code-Change nötig.
## Redirects & SEO

- `next.config.mjs` verweist `/reports/*`, `/daily/*`, `/[locale]/reports/*`, `/[locale]/daily/*` sowie `/`, `/en` auf `/de/news`, damit der globale Home-Pfad immer die deutsche News-Startseite bleibt.
- `app/sitemap.ts` exportiert nur noch `/de`, `/en`, `/de/news`, `/en/news` und die Methodik-Slugs; Daily-Detail-URLs tauchen nicht mehr auf.
- `app/[locale]/page.tsx` und `app/[locale]/(pages)/news/page.tsx` teilen sich metadata-basierte Canonicals und hreflang-Alternates, daher ist `/de` (resp. `/en`) die eindeutige kanonische URL und die OpenGraph-Texte beschreiben den aktuellen Snapshot des jeweiligen Locale.

## Testing & Validation

- `npm run score:test` oder `npx vitest run tests/scoring.test.tsx` prüfen das Scoring-MVP (Confidence, Hysterese, Reasons).
- `npx vitest run tests/news-page.test.tsx` validiert News-UI, Snapshot-Metadaten und lokalisierten Text.

### Smoke-Tests

1. `curl -I http://localhost:3000/de/news` bzw. `/en/news`: 200 OK, Inhalte sichtbar (Server-Components), keine zusätzlichen Aggregations-Requests.
2. `curl -I http://localhost:3000/de/reports/2025-11-12` oder `/en/daily/2025-11-12`: permanente Redirect-Antwort (301/308) zur jeweils passenden News-Startseite, die Locale bleibt erhalten.
3. Sitemap prüfen (`http://localhost:3000/sitemap.xml`): nur `/de`, `/en`, `/de/news`, `/en/news` und Methodik-Links enthalten; keine Daily-Details.
4. DevTools Network während `/de/news`: max. ein schneller Server-Load (Snapshot-Read), keine wiederholten Fetches beim Reload oder Tab-Fokus.
5. In Entwicklung erscheint auf der News-Seite der Button „News neu generieren“, der `GET /api/news/generate` aufruft und das Cache-Tag `news-daily` revalidiert.

## Environment (`.env.local`)

```ini
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4.1
APP_BASE_URL=https://your-domain.com
DAILY_API_SECRET=...
DAILY_GENERATE_MODE=overwrite  # skip|overwrite
NEWS_GENERATE_SECRET=...
```

Secrets bleiben auf dem Server und dürfen nie in den Client gebunden werden. Die News-Startseite, die Daily-API und Persistenz-Logik laufen ausschließlich auf dem Server.
## Overview

- **What it is:** Next.js 14 App Router frontend plus backend APIs that deliver daily crypto sentiment reports with snapshots stored in `data/{reports,news,metrics}` and Upstash Redis (`news:{locale}:{date}`, `reports:{locale}:{date}`).
- **Data flow:** Social, news and on-chain adapters feed the aggregator ? daily run persists JSON + Redis snapshots and revalidates `news-daily`/`reports-daily`.

## Local development

1. `npm install`
2. Copy `.env.example` ? `.env.local`
3. `npm run dev` (http://localhost:3000/de/news).
4. Optional: `npm run build`, `npm run lint`, `npm run test`.

## Environment variables

- `OPENAI_API_KEY`, `OPENAI_MODEL`
- `CRON_SECRET`, `TARGET_URL`, `HEALTH_URL`, `DAILY_API_SECRET`, `NEWS_GENERATE_SECRET`
- Redis: `REDIS_URL` + `REDIS_TOKEN` or Upstash `KV_URL`/`KV_REST_API_URL`/`KV_REST_API_TOKEN`/`KV_REST_API_READ_ONLY_TOKEN`.
- Tunables: `GENERATE_DATA_DIR`, `ASSET_WHITELIST_PATH`, `SENTIMENT_STALE_THRESHOLD_MS`, `NEWS_STALE_THRESHOLD_MS`, `APP_BASE_URL`.

Set the same keys as GitHub/Vercel secrets in production.

## Cron & production run

1. GitHub workflow `.github/workflows/daily-run.yml` at UTC 05:00/04:00 (� 06:00 CET/CEST) calls `/api/generate/daily-run`, dumps snapshots to Redis, and runs `/api/health` (tolerant statuses: `warming_up`, `stale`, `partial`, `ok`, `fail`).
2. Manual trigger:

```
curl -L "https://krypto-sentiment-site.vercel.app/api/generate/daily-run?key=SuperLongSecret`&mode=overwrite`&locale=both"
```

3. Verify via `npx tsx scripts/check-redis.ts`.

## Monitoring & debugging

- `/api/health` reports `status`, `latestGeneratedAt`, `staleThresholdMs`, `warnings`, and per-topic counts.
- `scripts/check-redis.ts` shows `generatedAt` plus warm/stale state.
- `SentimentHeader` and `NewsList` expose the same badges and refresh buttons.

## Tests

- `npm run lint`
- `npm run test`
- `npx vitest run tests/news-page.test.tsx`
