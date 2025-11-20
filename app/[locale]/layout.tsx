import type { ReactNode } from "react";

type LocaleLayoutProps = {
  children: ReactNode;
  params: {
    locale: string;
  };
};

export default function LocaleLayout({ children }: LocaleLayoutProps) {
  // Falls später lokales Layout-Verhalten nötig ist, kann es hier ergänzt werden.
  return <>{children}</>;
}
