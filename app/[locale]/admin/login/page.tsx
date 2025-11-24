"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui";

type LoginPageProps = { params: { locale: "de" | "en" } };

export default function AdminLoginPage({ params }: LoginPageProps) {
  const { locale } = params;
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isDe = locale === "de";

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const payload = (await res.json().catch(() => ({}))) as { error?: string };
        const message =
          payload.error ??
          (isDe ? "Unbekannter Fehler. Bitte später erneut versuchen." : "Unknown error. Please try again.");
        setError(message);
        return;
      }
      router.push(`/${locale}/admin`);
    } catch {
      setError(isDe ? "Netzwerkfehler. Bitte erneut versuchen." : "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 py-16">
      <section className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-900">
          {isDe ? "Admin-Login" : "Admin login"}
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          {isDe
            ? "Melde dich an, um den Admin-Bereich zu öffnen."
            : "Sign in to access the admin area."}
        </p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
            {isDe ? "Passwort" : "Password"}
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-200"
              required
            />
          </label>
          {error && <p className="text-sm text-rose-700">{error}</p>}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (isDe ? "Lädt..." : "Loading...") : isDe ? "Anmelden" : "Sign in"}
          </Button>
        </form>
      </section>
    </main>
  );
}
