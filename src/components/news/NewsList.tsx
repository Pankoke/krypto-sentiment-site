"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useTranslations } from "next-intl";
import type { AssetReport } from "lib/news/aggregator";

type Props = {
  assets: AssetReport[];
  reportDate: string;
  generatedAt?: string;
  methodNote?: string;
};

export default function NewsList({ assets, reportDate, generatedAt, methodNote }: Props) {
  const t = useTranslations("news");
  const displayDate = generatedAt ?? reportDate;

  if (!assets.length) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-600">
        {t("emptySnapshot")}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-gray-500">
          {t("generatedAt", { date: displayDate })}
        </p>
        {methodNote ? (
          <p className="text-xs text-gray-500 mt-1">{methodNote}</p>
        ) : null}
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {assets.map((asset) => {
          const confidence = typeof asset.confidence === "number" ? Math.round(asset.confidence * 100) : 0;
          const score = typeof asset.score === "number" ? asset.score.toFixed(2) : "--";
          return (
            <Card key={`${asset.symbol}-${asset.sentiment}-${score}`}>
              <CardHeader>
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <CardTitle>{asset.symbol}</CardTitle>
                    <p className="text-xs text-gray-500">{asset.sentiment ?? "—"}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{t("label.score")}</div>
                    <div className="text-lg font-bold">{score}</div>
                    <div className="text-xs text-gray-500">
                      {t("label.confidence")}: {confidence}%
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {asset.rationale ? (
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">{asset.rationale}</p>
                ) : (
                  <p className="text-sm text-gray-500">{t("noRationale")}</p>
                )}
                {asset.top_signals && asset.top_signals.length > 0 ? (
                  <div className="mt-3">
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                      {t("topSignals")}
                    </p>
                      <ul className="mt-1 list-disc list-inside text-sm text-gray-700 space-y-1">
                        {asset.top_signals.slice(0, 3).map((signal, index) => (
                          <li
                            key={`${signal.source ?? 'signal'}-${signal.evidence ?? ''}-${index}`}
                            className="truncate"
                          >
                          <span className="font-semibold">{signal.source ?? "signal"}:</span>{" "}
                          {signal.evidence ?? "–"}
                        </li>
                        ))}
                    </ul>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
