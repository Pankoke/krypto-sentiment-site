export function ensurePersistenceAllowed(): void {
  if (process.env.NODE_ENV === 'production') {
    throw new Error('Persistenz erfolgt via GitHub Action Commit');
  }
}
