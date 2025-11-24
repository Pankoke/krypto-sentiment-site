export class AdminAuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AdminAuthError';
  }
}

import { cookies } from 'next/headers';
import { validateAdminSession } from './session';

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

export async function requireAdminSessionOrSecret(request: Request): Promise<void> {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('admin_session')?.value ?? null;
  const hasValidSession = await validateAdminSession(sessionToken);
  if (hasValidSession) {
    return;
  }
  try {
    requireAdminSecret(request);
    return;
  } catch (error) {
    throw new AdminAuthError('Admin session or secret required');
  }
}

export async function ensureAdminPageSession(): Promise<boolean> {
  const cookieStore = cookies();
  const sessionToken = cookieStore.get('admin_session')?.value ?? null;
  return validateAdminSession(sessionToken);
}
