import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { LanguageSwitcher } from '../src/components/LanguageSwitcher';
import { LocaleNav } from '../src/components/LocaleNav';
import './globals.css';

export const metadata: Metadata = {
  title: 'Krypto Sentiment',
  description: 'Tägliche Krypto-Sentiment Berichte'
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="border-b bg-white/70 backdrop-blur">
          <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-lg font-semibold">Krypto Sentiment</Link>
            <div className="text-sm flex items-center gap-4">
              <LocaleNav />
              <LanguageSwitcher />
            </div>
          </div>
        </header>
        <main className="max-w-5xl mx-auto p-6">{children}</main>
        <footer className="border-t bg-white/70 backdrop-blur">
          <div className="max-w-5xl mx-auto px-6 py-4 text-xs text-gray-500">
            KI‑generierter Inhalt; keine Finanzberatung.
          </div>
        </footer>
      </body>
    </html>
  );
}
