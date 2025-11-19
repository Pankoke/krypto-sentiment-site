import Redis, { type RedisOptions } from 'ioredis';

const redisUrl =
  process.env.REDIS_URL?.trim() ||
  process.env.KV_URL?.trim() ||
  process.env.UPSTASH_REDIS_URL?.trim();

let redisToken =
  process.env.REDIS_TOKEN ??
  process.env.KV_REDIS_TOKEN ??
  process.env.KV_REST_API_TOKEN;

const inferTokenFromUrl = (value?: string) => {
  if (!value) {
    return undefined;
  }
  const withoutProtocol = value.split('://')[1];
  if (!withoutProtocol) {
    return undefined;
  }
  const credentials = withoutProtocol.split('@')[0];
  if (!credentials || !credentials.includes(':')) {
    return undefined;
  }
  return credentials.split(':')[1];
};

redisToken = redisToken ?? inferTokenFromUrl(redisUrl);
const redisUsername = process.env.REDIS_USERNAME ?? 'default';

interface RedisClientInterface {
  set(key: string, value: string): Promise<'OK'>;
  get(key: string): Promise<string | null>;
  del(key: string): Promise<number>;
  zadd(key: string, score: number, member: string): Promise<number>;
  zrevrange(key: string, start: number, stop: number): Promise<string[]>;
  keys(pattern: string): Promise<string[]>;
  quit(): Promise<void>;
}

class MemoryRedis implements RedisClientInterface {
  private store = new Map<string, string>();
  async set(key: string, value: string): Promise<'OK'> {
    this.store.set(key, value);
    return 'OK';
  }
  async get(key: string): Promise<string | null> {
    return this.store.get(key) ?? null;
  }
  async del(key: string): Promise<number> {
    return this.store.delete(key) ? 1 : 0;
  }
  async zadd(key: string, score: number, member: string): Promise<number> {
    const setKey = `${key}:sorted`;
    const existing = this.store.get(setKey);
    const arr = existing ? JSON.parse(existing) : [];
    const filtered = arr.filter((entry: [number, string]) => entry[1] !== member);
    filtered.push([score, member]);
    this.store.set(setKey, JSON.stringify(filtered));
    return 1;
  }
  async zrevrange(key: string, start: number, stop: number): Promise<string[]> {
    const setKey = `${key}:sorted`;
    const existing = this.store.get(setKey);
    if (!existing) return [];
    const arr: [number, string][] = JSON.parse(existing);
    return arr
      .sort((a, b) => b[0] - a[0])
      .slice(start, stop + 1)
      .map((entry) => entry[1]);
  }
  async quit(): Promise<void> {
    this.store.clear();
  }
  async keys(pattern: string): Promise<string[]> {
    const regex = new RegExp(
      `^${pattern.replace(/\*/g, '.*').replace(/\?/g, '.')}$`
    );
    return Array.from(this.store.keys()).filter((key) => regex.test(key));
  }
}

const redis =
  redisUrl && redisUrl.length
    ? new Redis(redisUrl, (() => {
        const baseOpts: RedisOptions = {
          maxRetriesPerRequest: null,
          enableAutoPipelining: true,
        };
        if (redisToken) {
          baseOpts.username = redisUsername;
          baseOpts.password = redisToken;
        }
        return baseOpts;
      })())
    : new MemoryRedis();

export type SnapshotKey = string;

export function newsSnapshotKey(locale: string, date: string): SnapshotKey {
  return `news:${locale}:${date}`;
}

export function reportSnapshotKey(locale: string, date: string): SnapshotKey {
  return `reports:${locale}:${date}`;
}

export async function setSnapshot(key: SnapshotKey, payload: unknown): Promise<void> {
  const value = JSON.stringify(payload);
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

const dailyRunLockPrefix = 'daily-run-lock:';

export function dailyRunLockKey(date: string): string {
  return `${dailyRunLockPrefix}${date}`;
}

export function isIoredisClient(client: RedisClientInterface | Redis): client is Redis {
  return client instanceof Redis;
}

export async function acquireDailyRunLock(dateKey: string, ttlSeconds: number): Promise<boolean> {
  if (isIoredisClient(redis)) {
    const result = await redis.call('SET', dateKey, 'locked', 'NX', 'EX', ttlSeconds);
    return result === 'OK';
  }
  await redis.set(dateKey, 'locked');
  return true;
}

export async function releaseDailyRunLock(dateKey: string): Promise<void> {
  await redis.del(dateKey);
}

export default redis;
