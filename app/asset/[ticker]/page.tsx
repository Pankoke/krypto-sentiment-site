import { redirect } from 'next/navigation';
import { buildLocalePath, isTickerAllowed } from 'lib/assets';

export default function Page({ params }: { params: { ticker: string } }) {
  const localeRoot = buildLocalePath();
  if (!isTickerAllowed(params.ticker)) {
    redirect(`${localeRoot}?redirect=invalid-asset`);
  }
  redirect(localeRoot);
}
