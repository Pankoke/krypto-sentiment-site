import redis from '../../lib/cache/redis';

const SNAPSHOT_PREFIXES = ['news:', 'reports:', 'metrics:', 'daily-run-lock:'];

export async function clearRedisTestData(): Promise<void> {
  const keysToDelete: string[] = [];
  for (const prefix of SNAPSHOT_PREFIXES) {
    const found = await redis.keys(`${prefix}*`);
    keysToDelete.push(...found);
  }
  if (keysToDelete.length) {
    await redis.del(...keysToDelete);
  }
}
