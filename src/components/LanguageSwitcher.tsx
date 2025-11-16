"use client";
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export function LanguageSwitcher() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const segments = pathname.split('/');
  const hasLocale = segments[1] === 'de' || segments[1] === 'en';
  const current = hasLocale ? segments[1] : 'de';
  const targetLocale = current === 'de' ? 'en' : 'de';
  const restSegments = (hasLocale ? segments.slice(2) : segments.slice(1)).filter(Boolean);
  const targetPath = `/${targetLocale}${restSegments.length ? `/${restSegments.join('/')}` : ''}`;
  const query = searchParams.toString();
  const href = query ? `${targetPath}?${query}` : targetPath;
  return (
    <Link href={href} className="text-sm underline">
      {current === 'de' ? 'EN' : 'DE'}
    </Link>
  );
}
