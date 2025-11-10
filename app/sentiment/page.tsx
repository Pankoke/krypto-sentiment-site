import { redirect } from 'next/navigation';

export default function Page() {
  // Ensure i18n provider by redirecting to default locale route
  redirect('/de/sentiment');
}
