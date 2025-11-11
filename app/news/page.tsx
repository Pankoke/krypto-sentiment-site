import NewsList from "../../src/components/news/NewsList";

export default function NewsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-2">News & Signals</h1>
      <p className="text-sm text-gray-600 mb-6">Aggregated signals and short rationale per asset.</p>
      <NewsList />
    </main>
  );
}
