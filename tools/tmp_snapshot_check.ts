import { berlinDateString } from '../lib/timezone';
import { loadSnapshotForLocale } from '../lib/news/snapshot';
(async () => {
  console.log('Berlin today', berlinDateString(new Date()));
  console.log(await loadSnapshotForLocale('de'));
})();
