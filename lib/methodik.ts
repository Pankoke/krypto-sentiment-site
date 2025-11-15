export type MethodikSection = {
  title: string;
  description: string;
  bullets: string[];
};

export type MethodikContent = {
  title: string;
  description: string;
  sections: MethodikSection[];
  disclaimer: string;
  expansion: string;
};

export const methodikContent: Record<'de' | 'en', MethodikContent> = {
  de: {
    title: 'Methodik',
    description:
      'Wir zeigen auf, aus welchen Quellen die Signale kommen, wie der Score entsteht und welche Grenzen die Darstellung hat.',
    sections: [
      {
        title: 'Eingangsdaten',
        description:
          'Social-Signale, Nachrichten, On-Chain-Metriken, Derivate und Preisentwicklung werden ausgewertet und auf die vier Assets gemappt.',
        bullets: [
          'Jeder Feed wird auf UTF-8 geprüft und auf BTC/ETH/SOL/XRP normalisiert.',
          'Artikel, Tweets, Chain-Metriken und Derivate-Ströme fließen als kategorisierte Features ein.',
          'Nur erlaubte Assets gelangen weiter ins Scoring – der Rest wird ignoriert.',
        ],
      },
      {
        title: 'Score / Confidence / Label',
        description:
          'Fünf Subscores werden zu einem Gesamtwert (0–100) kombiniert. Die Confidence zeigt an, wie vollständig die Datenlage ist.',
        bullets: [
          'Score = aggregierter Trendwert (0..100).',
          'Confidence = Prozent der tatsächlich vorliegenden Kategorien.',
          'Label (bullish/neutral/bearish) visualisiert die Stimmung.',
        ],
      },
    ],
    disclaimer:
      'Die Ampel wechselt erst, wenn der Score die Schwellen (55/45) deutlich verlässt, damit Mini-Schwankungen nicht flackern. Keine Finanzberatung, Daten können ausfallen oder später nachkorrigiert werden.',
    expansion:
      'Neue Assets kommen über data/assets.json, neue Quellen als Adapter in lib/sources. Sobald ein Feed sauber anbindet, erweitert er automatisiert Score, News und Archiv.',
  },
  en: {
    title: 'Methodology',
    description:
      'We outline which feeds feed into the report, how the score is composed, and what the limitations are.',
    sections: [
      {
        title: 'Input data',
        description:
          'Social media signals, news, on-chain indicators, derivatives flow and price action are normalized and whitelisted.',
        bullets: [
          'Each feed is checked for UTF-8 and mapped to BTC/ETH/SOL/XRP.',
          'Articles, tweets, chain metrics and derivatives flows become categorical features.',
          'Only approved assets reach the scoring pipeline; everything else is skipped.',
        ],
      },
      {
        title: 'Score / Confidence / Label',
        description:
          'Five subscores form a 0-100 score, Confidence shows how many signal categories were available.',
        bullets: [
          'Score is the aggregated change indicator (0..100).',
          'Confidence is the percent of categories with data.',
          'Label (bullish/neutral/bearish) describes the sentiment band.',
        ],
      },
    ],
    disclaimer:
      'The label only flips after the score decisively crosses the 55/45 thresholds to avoid flicker. Not financial advice—data can drop out, AI outputs can be fuzzy, and archives freeze snapshots.',
    expansion:
      'Add new tickers via data/assets.json and plug adapters into lib/sources. Once a feed follows the schema, it feeds Score, News and Archive automatically.',
  },
};
