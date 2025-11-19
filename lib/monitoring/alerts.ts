export type AlertLevel = 'info' | 'warning' | 'error';

interface AlertPayload {
  level: AlertLevel;
  message: string;
  details?: unknown;
}

export async function sendHealthAlert(payload: AlertPayload): Promise<void> {
  const url = process.env.ALERT_WEBHOOK_URL?.trim();
  if (!url) {
    return;
  }

  await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
}
