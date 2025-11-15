import { methodikContent } from './methodik';

export const methodPageSlug: Record<'de' | 'en', string> = {
  de: 'methodik',
  en: 'methodology',
};

export function getMethodContent(locale: 'de' | 'en') {
  return methodikContent[locale];
}
