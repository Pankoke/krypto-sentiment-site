import type { ReactNode } from "react";

type LocaleLayoutProps = {
  children: ReactNode;
  params: {
    locale: "de" | "en";
  };
};

export function generateStaticParams() {
  return [{ locale: "de" }, { locale: "en" }];
}

export default function LocaleLayout({ children }: LocaleLayoutProps) {
  // Das eigentliche Locale-Handling (Messages, NextIntl) passiert im Root-Layout (app/layout.tsx).
  // Dieses Segment-Layout sorgt nur dafür, dass die Route /[locale]/... existiert.
  return <>{children}</>;
}
