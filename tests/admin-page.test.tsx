import React from 'react';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

vi.mock('@/components/ui', () => ({
  Badge: ({ children }: { children: React.ReactNode }) => <span>{children}</span>,
  Button: ({ children, ...rest }: { children: React.ReactNode }) => <button {...rest}>{children}</button>,
  Card: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  CardFooter: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Select: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectValue: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SelectItem: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Dialog: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogHeader: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  DialogTitle: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  Tooltip: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TooltipTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TooltipProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  TooltipContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));
vi.mock('next/navigation', () => {
  return {
    usePathname: () => '/de/admin',
    useRouter: () => ({
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      refresh: vi.fn(),
      back: vi.fn(),
    }),
  };
});
vi.mock('lib/admin/auth', () => ({
  canAccessAdminInCurrentEnv: () => true,
  ensureAdminPageSession: async () => true,
}));

import AdminPage from '../app/[locale]/admin/page';

type SwrDataMap = Map<string, unknown>;

vi.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => <a href={href}>{children}</a>,
}));

const swrData: SwrDataMap = new Map();

vi.mock('swr', () => ({
  __esModule: true,
  default: (key: string | null) => ({
    data: key ? swrData.get(key) ?? null : null,
    error: undefined,
    isValidating: false,
    isLoading: false,
    mutate: vi.fn(),
  }),
}));

describe('Admin page', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } })
    );
    swrData.clear();
    (global as unknown as { React: typeof React }).React = React;
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('rendert Admin-Übersicht und Buttons', async () => {
    swrData.set('/api/admin/logs?limit=50', []);
    swrData.set('/api/admin/snapshot-history?days=30', []);
    swrData.set('/api/sentiment', { items: [] });
    const ui = await AdminPage({ params: { locale: 'de' } });
    render(ui);
    expect(screen.getByText(/Maintenance/i)).toBeInTheDocument();
    expect(screen.getByText(/Daily-Run anstoßen/i)).toBeInTheDocument();
    expect(screen.getByText(/Snapshots leeren/i)).toBeInTheDocument();
    expect(screen.getByText(/revalidieren/i)).toBeInTheDocument();
  });

  it('zeigt Logs, wenn API Logs liefert', async () => {
    swrData.set('/api/admin/logs?limit=50', [
      { id: '1', level: 'info', message: 'test log', timestamp: new Date().toISOString() },
    ]);
    swrData.set('/api/admin/snapshot-history?days=30', []);
    swrData.set('/api/sentiment', { items: [] });
    const ui = await AdminPage({ params: { locale: 'de' } });
    render(ui);
    expect(screen.getByText(/test log/i)).toBeInTheDocument();
  });

  it('rendert Snapshot-History', async () => {
    swrData.set('/api/admin/logs?limit=50', []);
    swrData.set('/api/admin/snapshot-history?days=30', [
      { date: '2025-01-01', assetsWithData: 3 },
    ]);
    swrData.set('/api/sentiment', { items: [] });
    const ui = await AdminPage({ params: { locale: 'de' } });
    render(ui);
    expect(screen.getAllByText(/Snapshot-Historie/i).length).toBeGreaterThan(0);
    expect(screen.getByText('2025-01-01')).toBeInTheDocument();
  });
});
