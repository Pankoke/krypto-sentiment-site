import type { ReactNode } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { NextIntlClientProvider } from "next-intl";
import { cookies } from "next/headers";
import { defaultLocale } from "../i18n";
import { LocaleNav } from "../src/components/LocaleNav";

export const metadata: Metadata = {
  title: "Krypto Sentiment",
  description: "Tägliche Krypto-Sentiment-Berichte"
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const cookieLocale = cookies().get("NEXT_LOCALE")?.value ?? defaultLocale;
  let messages: Record<string, string> = {};
  try {
    messages = (await import(`../src/app/messages/${cookieLocale}.json`)).default as Record<string, string>;
  } catch (e) {
    // ignore errors; provider can still render with empty messages
  }

  type FooterMessages = { footer?: { disclaimer?: string } };
  const footerMessages = messages as FooterMessages;
  const footerDisclaimer =
    typeof footerMessages.footer?.disclaimer === "string"
      ? footerMessages.footer!.disclaimer
      : "KI-generierter Inhalt; keine Finanzberatung.";

  return (
    <html lang={cookieLocale}>
      <head>
        <meta charSet="utf-8" />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900">
        <NextIntlClientProvider locale={cookieLocale} messages={messages}>
          <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
              <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
                <Link href="/" className="flex items-center gap-2">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-xs font-bold text-white">
                    KS
                  </span>
                  <div className="leading-tight">
                    <div className="text-sm font-semibold tracking-tight text-slate-900">Krypto Sentiment</div>
                    <div className="hidden text-[11px] text-slate-500 sm:block">Daily market mood for crypto assets</div>
                  </div>
                </Link>
                <div className="flex items-center gap-6">
                  <LocaleNav />
                </div>
              </div>
            </header>

            <main className="flex-1">
              <div className="mx-auto max-w-6xl px-4 py-6">{children}</div>
            </main>

            <footer className="border-t border-slate-200 bg-white">
              <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-4 text-xs text-slate-500">
                <span>© {new Date().getFullYear()} Krypto Sentiment</span>
                <span>{footerDisclaimer}</span>
              </div>
            </footer>
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
