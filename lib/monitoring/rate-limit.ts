import redis from '../cache/redis';

export async function limitWithWindow(key: string, limit: number, windowSeconds: number): Promise<boolean> {
  const normalizedKey = `rate:${key}`;
  const count = await redis.incr(normalizedKey);
  if (count === 1) {
    await redis.expire(normalizedKey, windowSeconds);
  }
  return count <= limit;
}
