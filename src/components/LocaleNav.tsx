"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

export function LocaleNav() {
  const pathname = usePathname();
  const parts = pathname.split('/');
  const hasLocale = parts[1] === 'de' || parts[1] === 'en';
  const locale = (hasLocale ? parts[1] : 'de') as 'de' | 'en';
  const t = useTranslations('nav');

  return (
    <nav className="text-sm flex items-center gap-4">
      <Link href={`/${locale}`} className="text-gray-700 hover:text-black">
        {t('today')}
      </Link>
      <Link href={`/${locale}/reports`} className="text-gray-700 hover:text-black">
        {t('archive')}
      </Link>
      <Link href={`/${locale}/news`} className="text-gray-700 hover:text-black">
        {t('news')}
      </Link>
      <Link
        href={
          locale === 'de'
            ? '/de/methodik'
            : '/en/methodology'
        }
        className="text-gray-700 hover:text-black"
      >
        {t('methodik')}
      </Link>
    </nav>
  );
}
