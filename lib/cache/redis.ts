import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL;
const redisToken = process.env.REDIS_TOKEN;
if (!redisUrl) {
  throw new Error('REDIS_URL is not configured');
}

const redisOptions: Parameters<typeof Redis>[1] = {
  maxRetriesPerRequest: null,
  enableAutoPipelining: true,
};

if (redisToken) {
  redisOptions.username = 'default';
  redisOptions.password = redisToken;
}

const redis = new Redis(redisUrl, redisOptions);

export type SnapshotKey = string;

export function newsSnapshotKey(locale: string, date: string): SnapshotKey {
  return `news:${locale}:${date}`;
}

export function reportSnapshotKey(locale: string, date: string): SnapshotKey {
  return `reports:${locale}:${date}`;
}

export async function setSnapshot(key: SnapshotKey, payload: unknown, ttlSeconds?: number): Promise<void> {
  const value = JSON.stringify(payload);
  if (typeof ttlSeconds === 'number') {
    await redis.set(key, value, 'EX', ttlSeconds);
    return;
  }
  await redis.set(key, value);
}

export async function getSnapshot<T = unknown>(key: SnapshotKey): Promise<T | null> {
  const raw = await redis.get(key);
  if (!raw) {
    return null;
  }
  return JSON.parse(raw) as T;
}

export async function deleteSnapshot(key: SnapshotKey): Promise<void> {
  await redis.del(key);
}

const newsDateKey = (locale: string) => `news:dates:${locale}`;

export async function registerNewsDate(locale: string, date: string): Promise<void> {
  const score = Date.parse(date) || 0;
  await redis.zadd(newsDateKey(locale), score, date);
}

export async function listNewsDates(locale: string, limit = 10): Promise<string[]> {
  return redis.zrevrange(newsDateKey(locale), 0, limit - 1);
}

export async function clearNewsDates(locale: string): Promise<void> {
  await redis.del(newsDateKey(locale));
}

export async function closeRedis(): Promise<void> {
  await redis.quit();
}

export default redis;
