export const locales = ['de', 'en'] as const;
export type Locale = typeof locales[number];

export const defaultLocale: Locale = 'de';
// Show locale in path; change to 'as-needed' if you prefer hiding default
export const localePrefix = 'always' as const;

