# Krypto Sentiment Site – Quickstart

Die Repo benutzt Next.js 14 (App Router) mit TypeScript strict und i18n (de/en). Die Startseite zeigt den aktuellen News-Score für BTC/ETH/SOL/XRP aus den persistierten Snapshots; eine eigene `/reports/[date]`-Detailseite gibt es nicht mehr, dafür sind die Daten weiterhin als JSON unter `data/reports/YYYY-MM-DD.json` verfügbar. Secrets (News- und Sentiment-APIs) laufen ausschließlich serverseitig.

## Voraussetzungen

- Node.js 18.18 LTS oder neuer
- npm (pnpm/yarn/bun funktionieren ebenfalls)
- `.env.local` mit den secrets aus dem Abschnitt unten

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

- `app/` enthält die App-Router-Struktur: `/[locale]` ist die News-Startseite, `app/[locale]/(pages)/news/page.tsx` liest den Tages-Snapshot, `app/[locale]/methodik` zeigt die Methodik-Page. Die Navigation (LocaleNav) respektiert das aktuelle Locale und liefert nur noch Home/Methodik.
- Die News-Seite ist eine Server Component mit ISR (revalidate=86400) und nutzt das Cache-Tag `news-daily`, das nach jedem Snapshot-Refresh invalidiert wird.
- Die Daily-Report-Detailseiten unter `/reports` wurden entfernt; der UI-Flow arbeitet direkt mit den gepersistierten JSON-Snapshots.

## Daten & Persistenz

- `data/reports/` enthält die täglichen Sentiment-Berichte (UUID `YYYY-MM-DD.json` für die Offline-Auswertung, etwa für Backfills oder Admin-Checks).
- `data/news/` speichert die locale-spezifischen News-Snapshots `YYYY-MM-DD.{locale}.json`, die die News-Startseite und andere statische Seiten lesen. Fehlt eine Datei, zeigt die Seite einen sanften Empty-State („Kein Report gespeichert“).
- Archiv-Seiten (z.?B. `app/[locale]/(pages)/reports`) wurden entfernt; das Archiv lebt nur noch in den persistierten Dateien und etwaigen externen Tools.

## Daily APIs & Cron

- `GET /api/daily/generate` (internes Secret über `DAILY_API_SECRET`) löst das Scoring und die Snapshot-Persistenz aus. Standardmäßig überschreibt `mode=overwrite`, mit `mode=skip` bleiben fertige Tage unverändert. Die Route liefert `{ ok, date, locales, assets }` plus Logs (Adapter-Fehler, Dedupe).
- `GET /api/news/generate` aggregiert die News einmal täglich, schreibt die locale-spezifischen Dateien und ruft `revalidateTag('news-daily')` auf.
- Cron (z.?B. Vercel) ruft `/api/news/generate` plus optional `/api/daily/generate` wie geplant ab (06:00 CET empfohlen). Die News-Home-Seite benutzt anschließend ISR bzw. das `news-daily`-Tag.

## Testing & Validation

- `npm run score:test` oder `npx vitest run tests/scoring.test.tsx` prüfen das Scoring-MVP (Confidence, Hysterese, Reasons).
- `npx vitest run tests/news-page.test.tsx` validiert News-UI, Snapshot-Metadaten und lokalisierten Text.
- Smoke-Tests: `/de` & `/en` liefern die News-Home; alte `/de/heute`-URLs sollten auf `/de` weiterleiten.

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

