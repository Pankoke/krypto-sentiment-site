export function isPersistenceAllowed(): boolean {
  return process.env.NODE_ENV !== 'production' || process.env.ALLOW_PERSISTENCE === 'true';
}

export function ensurePersistenceAllowed(): void {
  if (!isPersistenceAllowed()) {
    throw new Error('Persistenz erfolgt via GitHub Action Commit');
  }
}
