# Krypto Sentiment Site – Quickstart

Next.js 14 (App Router) + TypeScript strict. Täglicher Krypto‑Sentiment‑Bericht (bullish/neutral/bearish) aus Social/News/On‑Chain, Speicherung als JSON unter `data/reports/YYYY-MM-DD.json`. Startseite zeigt den neuesten Bericht, Archiv unter `/reports/[date]`. Serverseitige Verarbeitung nutzt OpenAI Responses API (GPT‑4, JSON‑Schema strikt). Keine Secrets im Client – Konfiguration über `.env.local`.

## Voraussetzungen

- Node.js ≥ 18.18 (empfohlen LTS)
- npm (oder pnpm/yarn/bun)

## Installation

```bash
npm install
```

Projekt starten (Entwicklung):

```bash
npm run dev
# läuft unter http://localhost:3000
```

Build & Start (Produktion):

```bash
npm run build
npm run start
```

Linting:

```bash
npm run lint
```

## Verzeichnisstruktur

- `app/` – App Router (Startseite zeigt neuesten Report, Archiv unter `/reports/[date]`, API unter `/api/*`).
- `lib/` – Server‑Logik, OpenAI‑Client, Ingestion/Normalisierung.
- `schema/` – JSON‑Schema(s) für strikt typisierte OpenAI‑Responses.
- `data/`
  - `data/raw/` – Rohdaten (z. B. Social/News/On‑Chain Snapshots).
  - `data/reports/` – tägliche Berichte `YYYY-MM-DD.json` (Quelle für UI).
- `public/` – statische Assets.

## Environment (.env.local)

In der Projektwurzel eine Datei `.env.local` anlegen (wird nicht committet):

```ini
# OpenAI
OPENAI_API_KEY=sk-...           # niemals im Client verwenden
OPENAI_MODEL=gpt-4.1            # GPT‑4 über Responses API

# Optional
APP_BASE_URL=http://localhost:3000  # für lokale Cron-Tests/Callbacks
# CRON_SECRET=...                   # falls /api/daily-report geschützt wird
```

Hinweise:

- Die OpenAI‑Aufrufe erfolgen ausschließlich serverseitig (API‑Route), damit keine Secrets in Client‑Bundles landen.
- TypeScript läuft strikt; ESLint verbietet `any`.

## Täglicher Bericht (CRON‑Endpoint)

- Endpoint: `GET /api/daily-report`
  - Ablauf: Ingestion → KI‑Auswertung (OpenAI Responses API, JSON‑Schema strikt) → Speichern unter `data/reports/YYYY-MM-DD.json`.
  - Idempotent pro Tag: Ein bestehender Tagesreport wird überschrieben/aktualisiert.

Lokaler Test (manuell auslösen):

```bash
curl -sS "http://localhost:3000/api/daily-report"
```

### Cron‑Konfiguration

- Vercel Cron: Täglich z. B. `0 0 * * *` (UTC) → `GET https://<your-deployment>/api/daily-report`.
- Eigenes Hosting (Linux):
  ```cron
  10 0 * * * curl -fsS https://<domain>/api/daily-report > /dev/null
  ```
- Windows Task Scheduler: Geplante Aufgabe, täglich, Aktion: `curl -fsS https://<domain>/api/daily-report`.

Optional: Endpoint mit `CRON_SECRET` schützen (z. B. `GET /api/daily-report?key=<secret>`); Secret nur serverseitig prüfen.

## Entwicklungshinweise

- Startseite rendert den neuesten Report aus `data/reports/`. Archivseiten laufen über dynamische Route `/reports/[date]`.
- Datenformat: strikt gemäß `schema/` und TypeScript‑Typen in `lib/`.
- Bei Änderungen am Schema: UI und Persistenz anpassen, Tests/Validierungen nachziehen.
