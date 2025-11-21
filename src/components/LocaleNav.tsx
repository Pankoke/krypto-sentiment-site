"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { methodPageSlug } from 'lib/methodPages';
import { LanguageSwitcher } from './LanguageSwitcher';

type NavKey = 'home' | 'news' | 'methodik' | 'coins' | 'data' | 'learn' | 'about' | 'contact' | 'sentiment';

const localePaths: Record<'de' | 'en', Record<NavKey, string>> = {
  de: {
    home: '/de',
    sentiment: '/de/sentiment',
    news: '/de/news',
    methodik: '/de/methodik',
    coins: '/de/coins',
    data: '/de/daten',
    learn: '/de/lernen',
    about: '/de/ueber-uns',
    contact: '/de/kontakt',
  },
  en: {
    home: '/en',
    sentiment: '/en/sentiment',
    news: '/en/news',
    methodik: `/en/${methodPageSlug.en}`,
    coins: '/en/coins',
    data: '/en/data',
    learn: '/en/learn',
    about: '/en/about',
    contact: '/en/contact',
  },
};

const keys: NavKey[] = ['home', 'sentiment', 'news', 'methodik', 'coins', 'data', 'learn', 'about', 'contact'];

export function LocaleNav() {
  const pathname = usePathname();
  const parts = pathname.split('/');
  const hasLocale = parts[1] === 'de' || parts[1] === 'en';
  const locale = (hasLocale ? parts[1] : 'de') as 'de' | 'en';
  const currentPath = pathname;
  const t = useTranslations('nav');

  return (
    <nav className="text-sm flex items-center gap-4">
      {keys.map((key) => (
        <Link
          key={key}
          href={localePaths[locale][key]}
          aria-current={currentPath === localePaths[locale][key] ? 'page' : undefined}
          className={
            currentPath === localePaths[locale][key]
              ? 'text-black font-semibold'
              : 'text-gray-700 hover:text-black'
          }
        >
          {t(key)}
        </Link>
      ))}
      <LanguageSwitcher />
    </nav>
  );
}
