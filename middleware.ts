import createMiddleware from 'next-intl/middleware';
import {locales, defaultLocale, localePrefix} from './i18n';

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix,
});

export const config = {
  // Match all paths except for the ones starting with:
  // - api (API routes)
  // - _next (Next.js internals)
  // - files with an extension (e.g. favicon.ico)
  matcher: ['/((?!api|_next|.*\\..*).*)'],
};

