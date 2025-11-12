import { redirect } from 'next/navigation';
import { buildLocalePath, isTickerAllowed } from 'lib/assets';

export default function Page({ params }: { params: { locale: string; ticker: string } }) {
  const localeRoot = buildLocalePath(params.locale);
  if (!isTickerAllowed(params.ticker)) {
    redirect(`${localeRoot}?redirect=invalid-asset`);
  }
  redirect(localeRoot);
}
