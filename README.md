# Krypto Sentiment Site – Quickstart

Next.js 14 (App Router) + TypeScript strict. Täglicher Krypto-“Sentiment”-Bericht (bullish/neutral/bearish) aus Social/News/On-Chain, gespeichert als JSON unter `data/reports/YYYY-MM-DD.json`. Die Startseite zeigt den aktuellsten Report, das Archiv lebt unter `/reports/[date]`. Serverseitige Logik nutzt die OpenAI Responses API (GPT-4.1, JSON-Schema strikt). Secrets bleiben außerhalb des Clients – Konfiguration über `.env.local`.

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

- `app/` – App Router (Startseite zeigt neuesten Report, Archiv unter `/reports/[date]`, API-Endpoints unter `/api/*`).
- `lib/` – Serverlogik, OpenAI-Client, Ingestion und Normalisierung.
- `schema/` – JSON-Schema(s) für strikt typisierte OpenAI-Responses.
- `data/`
  - `data/raw/` – Rohdaten (z. B. Snapshots von Social/News/On-Chain).
  - `data/reports/` – Tägliche Berichte `YYYY-MM-DD.json` (Datenquelle für die UI).
- `public/` – Statische Assets.

## Environment (.env.local)

In der Projektwurzel eine Datei `.env.local` anlegen (wird nicht committet):

```ini
# OpenAI
OPENAI_API_KEY=sk-...           # niemals im Client verwenden
OPENAI_MODEL=gpt-4.1            # GPT-4.1 über Responses API

# Optional
APP_BASE_URL=http://localhost:3000  # für lokale Cron-Tests/Callbacks
# CRON_SECRET=...                   # falls /api/daily-report geschützt wird
```

Hinweise:

- Die OpenAI-Aufrufe erfolgen ausschließlich auf dem Server (API-Route), damit keine Secrets in Client-Bundles landen.
- TypeScript läuft strikt; ESLint verbietet `any`.

## Täglicher Bericht (CRON-Endpoint)

- Endpoint: `GET /api/daily-report`
  - Ablauf: Ingestion → KI-Auswertung (OpenAI Responses API, JSON-Schema strikt) → Speichern unter `data/reports/YYYY-MM-DD.json`.
  - Idempotent pro Tag: Ein bestehender Tagesreport wird überschrieben/aktualisiert.

Lokaler Test (manuell auslösen):

```bash
curl -sS "http://localhost:3000/api/daily-report"
```

### Cron-Konfiguration

- Vercel Cron: Täglich z. B. `0 0 * * *` (UTC) → `GET https://<your-deployment>/api/daily-report`.
- Eigenes Hosting (Linux):
  ```cron
  10 0 * * * curl -fsS https://<domain>/api/daily-report > /dev/null
  ```
- Windows Task Scheduler: Geplante Aufgabe, täglich, Aktion: `curl -fsS https://<domain>/api/daily-report`.

Optional: Endpoint mit `CRON_SECRET` schützen (z. B. `GET /api/daily-report?key=<secret>`); Secret nur serverseitig prüfen.

## Entwicklungshinweise

- Startseite rendert den neuesten Report aus `data/reports/`. Archivseiten agieren über dynamische Route `/reports/[date]`.
- Datenformat: strikt gemäß `schema/` und den TypeScript-Typen in `lib/`.
- Bei Änderungen am Schema: UI und Persistenz anpassen, Tests/Validierungen nachziehen.

## Assets verwalten

- Die Liste der verfügbaren Assets wird zentral in `data/assets.json` gepflegt. Nur Einträge mit `enabled: true` dürfen auf Dashboard, Archiv, News und APIs erscheinen; aktuell sind das `BTC`, `ETH`, `SOL` und `XRP`.
- Neue Assets kommen hinzu, indem du einfach einen Eintrag ergänzt und `enabled: true` setzt. Felder wie `category`, `displayOrder` oder `slug` steuern Sortierung, Navigation und Ziel-URLs, sodass die restliche App automatisch die aktualisierte Whitelist nutzt.
- Alle nicht erlaubten Pfade (z. B. `/asset/avax`) landen mit `redirect=invalid-asset` zurück auf die Lokalisierungshomepage; so erstellen Sitemaps, Navigation und Deep-Links nur noch die vier erlaubten Märkte.

## News – Datenfluss & Zustände

- Die News-Komponente fragt `/api/news` mit den Parametern `universe`, `page` und `limit` ab. Die API nutzt den zentralen Assets-Katalog, speichert den Report als JSON und liefert nur die gefilterten Einträge inkl. Pagination-Metadaten zurück.
- Auf der Seite erscheint ein Filter (Dropdown oder Tabs) für die vier erlaubten Assets; jede Änderung führt zu einem neuen Fetch, der nur Nachrichten für das ausgewählte Asset lädt.
- Pagination läuft über den Button „Mehr laden“, der so lange neue Seiten vom Server anfordert, wie `hasMore` true ist. Filter und Pagination arbeiten gemeinsam über die Query-Parameter.
- Zustände: Beim Laden erscheint ein Skeleton/Status, bei Fehlern zeigt die UI eine verständliche Fehlermeldung mit „Erneut versuchen“, bei leeren Ergebnissen wird ein Hinweis + Button zum Nachladen angezeigt. Damit bleibt die Seite immer bedienbar.
## Encoding

- **UTF-8 überall**: JSON, Locale- und Textdateien im `app`, `data`, `lib`, `public` etc. liegen als UTF-8 ohne BOM vor. Neue Datenquellen sollten beim Einlesen explizit als UTF-8 dekodiert werden; wenn der Content-Type fehlt, defensiv `TextDecoder('utf-8')` nutzen.
- **API-Responses**: Alle Route-Handler (z. B. `/api/sentiment`, `/api/daily-report`, `/api/news`) liefern `Content-Type: application/json; charset=utf-8`, damit DevTools und Clients die richtige Kodierung sehen.
- **HTML-Meta**: Das Root-Layout enthält `<meta charset="utf-8">`, damit Browser direkt wissen, dass die Seite in UTF-8 ausgeliefert wird.
- **Umlaut-Rendertest & Fonts**: Die Seite zeigt den Teststring `Änderungen, Gebühren, Überblick, größer, Schlagzeilen, Zusammenfassung` über eine kleine Komponente, die mit Systemfonts (`font-family: var(--font-geist-sans), 'Segoe UI', Arial, sans-serif`) ausgegeben wird. Damit sind ä/ö/ü/ß auch ohne Custom-Font abgedeckt.
- **Tests decken**: Vitest prüft, dass die Umlaut-Komponente korrekt gerendert wird, und dass `GET /api/sentiment` den `charset=utf-8` Header setzt.
- **Neue Datenquellen**: Beim Hinzufügen externer Feeds vor dem Parsen immer Dekodierung als UTF-8 erzwingen und BOM entfernen, damit keine Windows-1252-Artefakte ins System gelangen.


