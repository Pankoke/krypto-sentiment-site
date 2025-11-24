export class AdminAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AdminAuthError';
  }
}

export function requireAdminSecret(request: Request): void {
  const configuredSecret = process.env.ADMIN_SECRET;
  if (!configuredSecret) {
    throw new AdminAuthError('ADMIN_SECRET is not configured');
  }
  const incoming = request.headers.get('x-admin-secret');
  if (!incoming || incoming !== configuredSecret) {
    throw new AdminAuthError('Invalid admin secret');
  }
}

export function canAccessAdminInCurrentEnv(): boolean {
  if (process.env.NODE_ENV === 'development') {
    return true;
  }
  if (process.env.NODE_ENV === 'production') {
    return Boolean(process.env.ADMIN_SECRET);
  }
  return Boolean(process.env.ADMIN_SECRET);
}
