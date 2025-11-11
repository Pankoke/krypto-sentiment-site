"use client";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "../ui/card";
import { useTranslations } from 'next-intl';

type Signal = {
  id?: string;
  source?: string;
  text?: string;
  timestamp?: string;
  engagement?: number;
};

type AssetReport = {
  symbol: string;
  sentiment: "bullish" | "bearish" | "neutral" | string;
  score?: number;
  confidence?: number;
  rationale?: string;
  top_signals?: Signal[];
};

type AggregatedReport = {
  date: string;
  universe?: string[];
  assets: AssetReport[];
  method_note?: string;
};

export default function NewsList({ className = "" }: { className?: string }) {
  const t = useTranslations('news');
  const [report, setReport] = useState<AggregatedReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let aborted = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/news");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!aborted) setReport(json as AggregatedReport);
      } catch (error) {
        if (!aborted) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          setError(errorMessage);
        }
      } finally {
        if (!aborted) setLoading(false);
      }
    }
    load();
    return () => {
      aborted = true;
    };
  }, []);

  if (loading) {
    return <div className={className}>{t('loading')}</div>;
  }

  if (error) {
    return (
      <div className={className}>
        <p className="text-red-600">{t('errorLoading', { error })}</p>
      </div>
    );
  }

  if (!report) {
    return <div className={className}>{t('noData')}</div>;
  }

  return (
    <div className={className}>
  <p className="text-sm text-gray-500 mb-4">{t('reportLabel')} {report.date}</p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {report.assets.map((a) => (
          <Card key={a.symbol} className="p-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{a.symbol}</CardTitle>
                  <div className="text-sm text-gray-600">{a.sentiment ?? "—"}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{t('label.score')}</div>
                  <div className="text-lg font-semibold">{typeof a.score === 'number' ? a.score.toFixed(2) : '—'}</div>
                  <div className="text-xs text-gray-500">{t('label.confidence')}: {typeof a.confidence === 'number' ? `${Math.round(a.confidence * 100)}%` : '—'}</div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {a.rationale ? (
                <details>
                  <summary className="cursor-pointer text-sm text-gray-700">{t('showRationale')}</summary>
                  <p className="mt-2 text-sm text-gray-700 whitespace-pre-wrap">{a.rationale}</p>
                </details>
              ) : (
                <p className="text-sm text-gray-600">{t('noRationale')}</p>
              )}

              {a.top_signals && a.top_signals.length > 0 && (
                <div className="mt-3">
                  <div className="text-xs text-gray-500 mb-1">{t('topSignals')}</div>
                  <ul className="list-disc list-inside text-sm text-gray-700">
                    {a.top_signals.slice(0, 3).map((s, i) => (
                      <li key={s.id ?? i} className="truncate">{s.text ?? `${s.source ?? 'signal'} ${s.timestamp ?? ''}`}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {report.method_note && (
        <div className="mt-6 text-xs text-gray-500">Hinweis: {report.method_note}</div>
      )}
    </div>
  );
}
