import { readFile } from 'fs/promises';
import { join } from 'path';

const locales = ['de', 'en'];

async function loadMessages(locale) {
  const filePath = join(process.cwd(), 'src', 'app', 'messages', `${locale}.json`);
  const raw = await readFile(filePath, 'utf8');
  return JSON.parse(raw);
}

async function debugLocale(locale) {
  const messages = await loadMessages(locale);
  console.log(`\n=== ${locale} ===`);
  console.log('Keys:', Object.keys(messages).length);
  console.log('title.sentiment:', messages['title.sentiment']);
  console.log('home.detailsFor:', messages['home.detailsFor']);
}

async function main() {
  for (const locale of locales) {
    try {
      await debugLocale(locale);
    } catch (error) {
      console.error(`Could not load messages for ${locale}:`, error);
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
