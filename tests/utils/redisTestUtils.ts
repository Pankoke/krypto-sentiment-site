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
    if (validKeys.length === 1) {
      await redis.del(validKeys[0]);
    } else {
      await redis.del(validKeys[0], ...validKeys.slice(1));
    }
  }
}
