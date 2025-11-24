import { notFound } from 'next/navigation';
import { listSnapshotMetadata, type SnapshotMetadata } from 'lib/news/snapshot';
import SnapshotActions from 'components/admin/SnapshotActions';
import { canAccessAdminInCurrentEnv } from '../../lib/admin/auth';

const LOCALES: Array<{ code: 'de' | 'en'; label: string }> = [
  { code: 'de', label: 'Deutsch' },
  { code: 'en', label: 'English' },
];

export const dynamic = 'force-dynamic';

type SnapshotMetadataRowProps = {
  snapshot: SnapshotMetadata;
};

function SnapshotRow({ snapshot }: SnapshotMetadataRowProps) {
  return (
    <tr>
      <td className="px-3 py-2 text-sm font-medium text-gray-900">{snapshot.date}</td>
      <td className="px-3 py-2 text-sm text-gray-600">{snapshot.path}</td>
      <td className="px-3 py-2 text-sm">{snapshot.size.toLocaleString()} B</td>
      <td className="px-3 py-2 text-sm">{snapshot.mtime}</td>
      <td className="px-3 py-2 text-sm">{snapshot.items}</td>
      <td className="px-3 py-2 text-sm">
        <details className="rounded-md border border-gray-200 bg-gray-50 p-2">
          <summary className="text-xs font-semibold text-gray-700 cursor-pointer">Anzeigen</summary>
          <pre className="text-[10px] text-left text-gray-800">
            {JSON.stringify(
              snapshot.snapshot.assets.map((asset) => ({
                symbol: asset.symbol,
                score: asset.score,
                sentiment: asset.sentiment,
              })),
              null,
              2
            )}
          </pre>
        </details>
      </td>
    </tr>
  );
}

export default async function AdminSnapshotsPage() {
  const allowAdmin = canAccessAdminInCurrentEnv();
  if (!allowAdmin && process.env.NODE_ENV === 'production') {
    notFound();
  }
  const metadata = await Promise.all(
    LOCALES.map((locale) => listSnapshotMetadata(locale.code, 7))
  );
  return (
    <main className="space-y-8 px-6 py-10 bg-slate-50 min-h-screen">
      <header className="space-y-3">
        <h1 className="text-3xl font-semibold text-slate-900">Admin: News Snapshots</h1>
        <p className="text-sm text-slate-600">
          Die letzten sieben Dateien pro Locale mit Pfad, Größe und Asset-Anzahl.
        </p>
        <SnapshotActions />
      </header>
      {LOCALES.map((locale, index) => (
        <section key={locale.code} className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100">
            <h2 className="text-xl font-semibold text-slate-800">{locale.label}</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
              <thead className="bg-slate-50 text-[11px] uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-3 py-2">Datum</th>
                  <th className="px-3 py-2">Pfad</th>
                  <th className="px-3 py-2">Größe</th>
                  <th className="px-3 py-2">mt</th>
                  <th className="px-3 py-2">Items</th>
                  <th className="px-3 py-2">Preview</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {(metadata[index] ?? []).map((snapshot) => (
                  <SnapshotRow key={snapshot.path} snapshot={snapshot} />
                ))}
                {(metadata[index] ?? []).length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-3 py-6 text-center text-xs text-slate-500">
                      Keine Snapshots gefunden.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      ))}
    </main>
  );
}
