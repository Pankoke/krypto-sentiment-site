#!/usr/bin/env node

import { sendHealthAlert } from '../lib/monitoring/alerts';

type HealthStatus = 'ok' | 'partial' | 'stale' | 'warming_up' | 'fail';

interface HealthTopic {
  lastSnapshotDate: string | null;
  generatedAt: string | null;
  itemsCount: number;
  resolvedFilePath: string | null;
}

interface HealthResponse {
  status: HealthStatus;
  news: HealthTopic;
  reports: HealthTopic;
  latestGeneratedAt: string | null;
  staleThresholdMs: number;
  warnings: string[];
}

const fetchHealth = async (): Promise<HealthResponse> => {
  const healthUrl = process.env.HEALTH_URL ?? 'https://krypto-sentiment-site.vercel.app/api/health';
  const response = await fetch(healthUrl, {
    headers: {
      Accept: 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error(`health fetch failed (${response.status})`);
  }
  return (await response.json()) as HealthResponse;
};

const shouldAlert = (status: HealthStatus): boolean => status !== 'ok';

const levelForStatus = (status: HealthStatus): 'warning' | 'error' => {
  if (status === 'fail') return 'error';
  return 'warning';
};

async function main() {
  const health = await fetchHealth();
  if (!shouldAlert(health.status)) {
    console.info('Health OK, no alert sent.');
    return;
  }
  await sendHealthAlert({
    level: levelForStatus(health.status),
    message: `Health ${health.status} – latestGeneratedAt=${health.latestGeneratedAt ?? 'unknown'}`,
    details: health,
  });
  console.info('Health alert sent for status', health.status);
}

main().catch((error) => {
  console.error('Health check failed', error);
  process.exit(1);
});
