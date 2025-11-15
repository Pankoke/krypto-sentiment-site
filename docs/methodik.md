# Methodik / Methodology

## DE – Was steckt drin?

- **Eingangsdaten**: Wir vereinen Social-Media-Signale, Nachrichten, On-Chain-Indikatoren, Derivate-Metriken und Preisentwicklung. Jede Quelle wird vor dem Aggregieren auf UTF-8 geprüft, auf die erlaubten Assets (BTC, ETH, SOL, XRP) gemappt und nach Wichtigkeit gewichtet.
- **Score / Confidence / Label**: Aus den fünf Kategorien generieren wir Subscores, die zu einem Score zwischen `0` und `100` kombiniert werden. Die Anzeige „Score“ bildet diesen Wert ab, „Confidence“ beschreibt, wie vollständig die Datenlage ist, und das „Label“ (bullish/neutral/bearish) gibt die grobe Stimmung wieder.
- **Hysterese**: Die Ampel wechselt erst, wenn der Score deutlich über oder unter die Grenzwerte (55/45) hinausläuft. Mini-Schwankungen um diese Grenzen herum führen nicht sofort zu einem neuen Label, sodass die Anzeige stabil bleibt.
- **Grenzen & Disclaimer**: Kein Teil dieser Seite ist Finanzberatung. Quellen können ausfallen, die KI kann unscharfe Summaries liefern, und historische Aktualisierungen werden nicht rückwirkend angepasst. Vertraue nicht blind auf einzelne Signale, sondern nutze sie als Orientierung.
- **Wie wir erweitern**: Neue Assets kommen über `data/assets.json`, neue Quellen als Adapter in `lib/sources`. Sobald ein neuer Feed sauberen JSON-Normen folgt, erscheint er automatisch in Score, News und Archiv.

## EN – What’s the methodology?

- **Input data**: We merge social signals, news, on-chain metrics, derivatives flow and price change. Each feed is normalized (UTF-8, whitelisted assets) and expressed as categorical features before scoring.
- **Score / Confidence / Label**: Five subscores form a 0-100 `Score`. The UI shows that number plus a `Confidence` percentage (how complete the data was) and a `Label` (bullish / neutral / bearish) representing the sentiment band.
- **Hysteresis**: The label only flips after the `Score` crosses the soft thresholds (55/45) decisively; tiny swings near the boundary keep the previous label so the dashboard doesn’t flicker with noise.
- **Limits & Disclaimer**: Not financial advice. Data feeds can fail or lag, AI-generated rationale may be vague, and archived days are frozen snapshots—updating the scoring logic won’t rewrite the past. Use the dashboard as a trend signal, not an order ticket.
- **How we grow**: Add templates in `data/assets.json` for extra tickers, plug new adapters in `lib/sources`, and the pipeline will ingest, score and publish the asset across the site without manual touches.
