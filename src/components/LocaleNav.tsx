"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { methodPageSlug } from 'lib/methodPages';
import { LanguageSwitcher } from './LanguageSwitcher';

type NavKey = 'home' | 'news' | 'methodik' | 'coins' | 'data' | 'learn' | 'about' | 'contact';

const navLinks: { key: NavKey; getHref: (locale: 'de' | 'en') => string }[] = [
  { key: 'home', getHref: (locale) => `/${locale}` },
  { key: 'news', getHref: (locale) => `/${locale}/news` },
  { key: 'methodik', getHref: (locale) => `/${locale}/${methodPageSlug[locale]}` },
  { key: 'coins', getHref: (locale) => `/${locale}/coins` },
  { key: 'data', getHref: (locale) => `/${locale}/data` },
  { key: 'learn', getHref: (locale) => `/${locale}/learn` },
  { key: 'about', getHref: (locale) => `/${locale}/about` },
  { key: 'contact', getHref: (locale) => `/${locale}/contact` }
];

export function LocaleNav() {
  const pathname = usePathname();
  const parts = pathname.split('/');
  const hasLocale = parts[1] === 'de' || parts[1] === 'en';
  const locale = (hasLocale ? parts[1] : 'de') as 'de' | 'en';
  const t = useTranslations('nav');

  return (
    <nav className="text-sm flex items-center gap-4">
      {navLinks.map(({ key, getHref }) => (
        <Link key={key} href={getHref(locale)} className="text-gray-700 hover:text-black">
          {t(key)}
        </Link>
      ))}
      <LanguageSwitcher />
    </nav>
  );
}
