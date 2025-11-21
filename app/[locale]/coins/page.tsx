import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Coins",
  description: "Coin-Übersicht und Detailseiten folgen in Kürze.",
};

type CoinsPageProps = { params: { locale: "de" | "en" } };

export default function CoinsPage({ params }: CoinsPageProps) {
  const isGerman = params.locale === "de";

  return (
    <main className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="mb-3 text-sm text-muted-foreground">
        {isGerman ? "Krypto-Sentiment" : "Crypto Sentiment"}
      </p>
      <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
        {isGerman ? "Coins" : "Coins"}
      </h1>
      <p className="mt-4 max-w-2xl text-base text-muted-foreground">
        {isGerman
          ? "Hier findest du bald detaillierte Coin-Profile mit Sentiment- und On-Chain-Daten. Wir arbeiten daran, diese Seite zeitnah bereitzustellen."
          : "Detailed coin profiles with sentiment and on-chain data will be available here soon. We are working on bringing this page online shortly."}
      </p>
    </main>
  );
}
