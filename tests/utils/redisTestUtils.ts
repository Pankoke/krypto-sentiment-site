import redis from '../../lib/cache/redis';

const SNAPSHOT_PREFIXES = ['news:', 'reports:', 'metrics:', 'daily-run-lock:'];

export async function clearRedisTestData(): Promise<void> {
  const keysToDelete: string[] = [];
  for (const prefix of SNAPSHOT_PREFIXES) {
    const found = await redis.keys(`${prefix}*`);
    keysToDelete.push(...found);
  }
  if (keysToDelete.length) {
    const validKeys = keysToDelete.filter((key): key is string => Boolean(key));
    if (!validKeys.length) {
      return;
    }
    const keysTuple = validKeys as [string, ...string[]];
    await redis.del(...keysTuple);
  }
}
