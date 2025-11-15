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
DAILY_API_SECRET=...               # Geheimnis für /api/daily/generate
DAILY_GENERATE_MODE=overwrite       # skip|overwrite; `skip` lässt bereits existierende Tage unangetastet
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

## Daily-API & ISR: Ablauf & Sicherheit

- **Internal trigger**: Cron/Automation ruft `GET /api/daily/generate?key=<DAILY_API_SECRET>` auf. Die Route nimmt optional `mode=skip|overwrite` entgegen (Standard `overwrite`, `skip` lässt bestehende Tagesdateien unangetastet) und gibt `{ ok, date, skipped, locales, assets }` zurück. Durch den Secret-Check (`DAILY_API_SECRET` oder fallback `CRON_SECRET`) bleibt der Endpunkt intern.
- **Manual trigger**: Für lokale Tests oder den Button auf der Startseite bleibt `GET /api/daily-report` aktiv; er nutzt dieselbe Persistenz und schreibt `data/reports/YYYY-MM-DD.json` inkl. Snapshots.
- **Snapshots & ISR**: Jeder Cron-Lauf schreibt JSON-Snapshots je Locale (`data/reports/YYYY-MM-DD.{locale}.json`). Die Startseite (`app/[locale]/page.tsx`) und die Archivliste (`/reports`) sind so konfiguriert, dass sie alle 60 Minuten revalidiert werden (`revalidate = 3600`), wodurch neue Tage nach einem Cron-Lauf innerhalb einer Stunde auftauchen. Archivdetailseiten lesen statisch die JSON-Snapshots (keine Neuberechnung), weshalb ein fehlender Snapshot sanft als „Kein Bericht gespeichert“/Badge „Unvollständig“ angezeigt wird.
- **News Snapshot**: Parallel entsteht bei jedem Cron-Lauf (plus optionaler 06:00-Trigger) ein JSON-File unter `data/news/YYYY-MM-DD.{locale}.json`. Die News-Seite (`/de/news`, `/en/news`) liest diese Datei serverseitig (Revalidate=86400) und zeigt den letzten Stand sowie einen Empty-State, falls keine Datei vorhanden ist.
- **News Generator & Cache-Tag**: Der neue interne Endpoint `GET /api/news/generate` führt die Aggregation einmal am Tag aus, überschreibt die Snapshot-Dateien gemäß `mode=overwrite|skip` und meldet `assets`, `deduped`, `warnings`. Nach dem Schreiben ruft er `revalidateTag('news-daily')` auf, wodurch die News-Seite (`next: { tags: ['news-daily'] }`) automatisch eine neue Version liefert. Der reguläre `GET /api/news?locale=de|en` liefert den Snapshot ohne erneute Aggregation.

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
## Aggregator - Schema & Fallbacks

- Die Aggregationsschicht (`lib/sources/*`) liefert ein einheitliches Schema pro Drittdaten-Entry und stellt sicher, dass nur `BTC`, `ETH`, `SOL` und `XRP` weitergereicht werden. Jeder Eintrag enthält `id`, `asset`, `type`, `summary`, `source`, `timestamp` (UTC) und `importance`; `title`/`url` sind optional (Beispiel unten).
- Die Normalisierung (`lib/sources/utils.ts`) erzeugt IDs aus `source+externalId+timestamp+asset`, normalisiert Zeitstempel auf ISO und berechnet eine Importance-Balance aus Engagement und Heuristik. Doppelte Inhalte (gleiche Kombination aus Asset + Titel/Summary) werden zusammengefasst; der Eintrag mit kompletteren Metadaten bleibt erhalten.
- Beispiel-Entry:
  ```json
  {
    "id": "a3f9f7f4c5b3e6d1f0a2",
    "asset": "ETH",
    "type": "news",
    "title": "Ethereum Layer-2 gewinnt Tempo",
    "summary": "Dencun reduziert L2-Gebühren, Rollups gewinnen an Boden.",
    "source": "news-wire",
    "url": "https://news.example.com/eth",
    "timestamp": "2025-11-12T08:30:00.000Z",
    "importance": 0.68
  }
  ```
- Neue Adapter werden unter `lib/sources/` angelegt und liefern `AdapterEntryInput`-Objekte. `fetchAllSources()` vereint die Daten, gibt verbliebene Einträge zurück und schreibt Warnungen in `getSourceWarnings()`, falls ein Adapter ausfällt.
- ENV-Variablen `NEWS_API_KEY`, `SOCIAL_API_KEY`, `ONCHAIN_API_KEY` (siehe `.env.example`) halten Provider-Schlüssel bereit. Timeouts/Retry regeln `SOURCE_TIMEOUT_MS`, `SOURCE_RETRY_LIMIT` und `SOURCE_BACKOFF_BASE_MS` in `lib/sources/utils.ts`.

## Tests

- `vitest.setup.ts` stellt `expect` global und lädt `@testing-library/jest-dom`, deshalb einfache Komponenten- und API-Tests ohne zusätzliches Bootstrapping funktionieren.
- Die neuen Suites `tests/assets-whitelist.test.tsx`, `tests/encoding.test.tsx`, `tests/sources.test.ts` und `tests/news-page.test.tsx` liegen getrennt und können einzeln mit `npx vitest tests/<file>.tsx --reporter=verbose` ausgeführt werden. Jeder Test gibt beim Laden einen `console.log` aus, so dass man im Verbose-Modus erkennt, welche Module geladen wurden.
- Für einen vollständigen Durchlauf aller vier Suites ohne Watch-Modus:

  ```
  npx vitest run tests/assets-whitelist.test.tsx tests/encoding.test.tsx tests/sources.test.ts tests/news-page.test.tsx --reporter=verbose
  ```

  Das Kommando liefert die CJS-Deprecation-Warnung, zeigt die Logs `module loaded`/`before describe` und verifiziert alle 12 Specs. Bei Bedarf `NODE_OPTIONS=--trace-warnings` ergänzen, um tiefere Startup-Details zu erhalten.

- `npx vitest tests/scoring.test.tsx` validiert die neuen Scoring-Regeln (Subscores + Event/Regime-Gewichte) und kann ebenfalls einzeln ausgeführt werden. Folge dem Watch-Modus mit `q`, wenn du fertig bist.
- **Erweitern des Scoring-MVPs:** Neue Features ergänzen `lib/scoring/types.ts`/`index.ts` und werden über `computeAssetScore` verarbeitet. Achte darauf, den Subscore-Wert auf [-1,1] zu clampen, neue Modulatoren in `buildWeights` zu integrieren und den Confidence-Wert über die tatsächlich vorhandenen Kategorien zu berechnen. Ergänze im Test `tests/scoring.test.tsx` einen weiteren `it`, sobald ein neues Regime oder eine neue Ebene hinzugefügt wird.

## Encoding

- **UTF-8 überall**: JSON, Locale- und Textdateien im `app`, `data`, `lib`, `public` etc. liegen als UTF-8 ohne BOM vor. Neue Datenquellen sollten beim Einlesen explizit als UTF-8 dekodiert werden; wenn der Content-Type fehlt, defensiv `TextDecoder('utf-8')` nutzen.
- **API-Responses**: Alle Route-Handler (z. B. `/api/sentiment`, `/api/daily-report`, `/api/news`) liefern `Content-Type: application/json; charset=utf-8`, damit DevTools und Clients die richtige Kodierung sehen.
- **HTML-Meta**: Das Root-Layout enthält `<meta charset="utf-8">`, damit Browser direkt wissen, dass die Seite in UTF-8 ausgeliefert wird.
- **Umlaut-Rendertest & Fonts**: Die Seite zeigt den Teststring `Änderungen, Gebühren, Überblick, größer, Schlagzeilen, Zusammenfassung` über eine kleine Komponente, die mit Systemfonts (`font-family: var(--font-geist-sans), 'Segoe UI', Arial, sans-serif`) ausgegeben wird. Damit sind ä/ö/ü/ß auch ohne Custom-Font abgedeckt.
- **Tests decken**: Vitest prüft, dass die Umlaut-Komponente korrekt gerendert wird, und dass `GET /api/sentiment` den `charset=utf-8` Header setzt.
- **Neue Datenquellen**: Beim Hinzufügen externer Feeds vor dem Parsen immer Dekodierung als UTF-8 erzwingen und BOM entfernen, damit keine Windows-1252-Artefakte ins System gelangen.

## UI-Komponenten & Reuse

- `ScoreBadge`: Zeigt Zahlen (0–100) plus optionalen Trendpfeil; mit `loading`-Flag liefert sie eine Skeleton-Variante. Texte wie Label/Helper können über `props` lokalisiert werden.
- `LabelPill`: Farbige Pillen für `bullish`, `neutral`, `bearish` mit Fokus-Akzent und eigener `aria-label`, damit dieselbe Komponente auf Startseite, Archiv und News wiederverwendet werden kann.
- `ConfidenceBar`: Visualisiert das Vertrauen (0–100) mit Prozentwert, farbigem Balken und Textstufe (`low/medium/high`). Labels lassen sich per Prop übersetzen.
- `ReasonChips`: Trennt bis zu drei Gründe in Chips (Trunkierung + Tooltip), optional mit Skeleton-Platzhaltern.
- `StatusBadges`: Markiert High-Impact-, Event-Window-, Low-Confidence- oder High-Vol-Regime-Zustände; Labels und Farben bleiben konsistent, der Fokus liegt auf Kontrast und Screenreader-Labels.
- `AssetScoreCard`: Kombiniert alle Bausteine (ScoreBadge, LabelPill, ConfidenceBar, ReasonChips, StatusBadges) in einer durchgehenden Asset-Card, die Startseite und Archiv-Detail in Layout und Datenpunkt abstimmt.

Alle Komponenten sind rein präsentational, erhalten Daten via Props und benötigen keine Business-Logik. Sie sind durch ihre `loading`/`aria`-Optionen für i18n und A11y vorbereitet.


