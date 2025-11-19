import redis from 'lib/cache/redis';

export type LogLevel = 'info' | 'warn' | 'error';

export interface LogEntry {
  id: string;
  level: LogLevel;
  message: string;
  context?: string;
  timestamp: string;
}

const LOG_KEY = 'logs:system';

function createLogId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export async function writeLog(entry: Omit<LogEntry, 'id' | 'timestamp'>): Promise<void> {
  const payload: LogEntry = {
    ...entry,
    id: createLogId(),
    timestamp: new Date().toISOString(),
  };
  await redis.lpush(LOG_KEY, JSON.stringify(payload));
  await redis.ltrim(LOG_KEY, 0, 199);
}

export async function getRecentLogs(limit: number): Promise<LogEntry[]> {
  const stop = Math.max(limit - 1, 0);
  const raw = await redis.lrange(LOG_KEY, 0, stop);
  return raw.map((item) => {
    try {
      return JSON.parse(item) as LogEntry;
    } catch {
      return null;
    }
  }).filter((entry): entry is LogEntry => entry !== null);
}
