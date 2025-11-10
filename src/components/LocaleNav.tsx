"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function LocaleNav() {
  const pathname = usePathname();
  const parts = pathname.split('/');
  const hasLocale = parts[1] === 'de' || parts[1] === 'en';
  const locale = hasLocale ? parts[1] : 'de';
  const t = (key: 'today' | 'archive') => {
    if (locale === 'en') return key === 'today' ? 'Today' : 'Archive';
    return key === 'today' ? 'Heute' : 'Archiv';
  };
  return (
    <nav className="text-sm flex items-center gap-4">
      <Link href={`/${locale}`} className="text-gray-700 hover:text-black">
        {t('today')}
      </Link>
      <Link href={`/${locale}/reports`} className="text-gray-700 hover:text-black">
        {t('archive')}
      </Link>
    </nav>
  );
}

