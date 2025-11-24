import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { requireAdminSessionOrSecret, AdminAuthError } from '../../../../lib/admin/auth';

const JSON_HEADERS = { 'Content-Type': 'application/json; charset=utf-8' } as const;

export const runtime = 'nodejs';

interface RevalidateResponse {
  status: 'ok' | 'error';
  message?: string;
}

export async function POST(request: Request) {
  try {
    await requireAdminSessionOrSecret(request);
  } catch (error) {
    if (error instanceof AdminAuthError) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: JSON_HEADERS });
    }
    throw error;
  }
  try {
    await revalidatePath('/de/sentiment');
    await revalidatePath('/en/sentiment');
    const response: RevalidateResponse = { status: 'ok', message: 'Sentiment pages revalidated' };
    return NextResponse.json(response, { headers: JSON_HEADERS });
  } catch (error) {
    const response: RevalidateResponse = {
      status: 'error',
      message: error instanceof Error ? error.message : 'Revalidation failed',
    };
    return NextResponse.json(response, { status: 500, headers: JSON_HEADERS });
  }
}
