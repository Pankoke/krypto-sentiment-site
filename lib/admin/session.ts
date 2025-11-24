import { randomUUID } from "crypto";
import redis from "../cache/redis";

const ADMIN_SESSION_PREFIX = "admin_session:";
const DEFAULT_TTL_SECONDS = 86_400;

export type AdminSession = {
  token: string;
};

export async function createAdminSession(ttlSeconds: number = DEFAULT_TTL_SECONDS): Promise<AdminSession> {
  const token = randomUUID();
  await redis.set(`${ADMIN_SESSION_PREFIX}${token}`, "1");
  await redis.expire(`${ADMIN_SESSION_PREFIX}${token}`, ttlSeconds);
  return { token };
}

export async function validateAdminSession(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const exists = await redis.get(`${ADMIN_SESSION_PREFIX}${token}`);
  return exists === "1";
}

export async function destroyAdminSession(token: string | undefined | null): Promise<void> {
  if (!token) return;
  await redis.del(`${ADMIN_SESSION_PREFIX}${token}`);
}
