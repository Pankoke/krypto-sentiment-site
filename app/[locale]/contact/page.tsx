import type { Metadata } from 'next';

const BASE_URL = 'https://krypto-sentiment-site.vercel.app';
const DESCRIPTION =
  'Krypto Marktstimmung, Sentiment-Analysen, On-Chain Daten und News auf Deutsch.';

const formCopy = {
  de: {
    label: 'Kontakt',
    title: 'Kontakt',
    subtitle: 'Für Fragen, Feedback oder Kooperationsanfragen können Sie uns jederzeit kontaktieren.',
    note: 'Dieses Formular ist rein visuell; es wird keine Nachricht gesendet.',
    submit: 'Nachricht senden',
    placeholders: {
      name: 'Ihr Name',
      email: 'you@example.com',
      message: 'Ihre Nachricht'
    }
  },
  en: {
    label: 'Contact',
    title: 'Contact',
    subtitle: 'For questions, feedback or collaboration requests, feel free to reach out via email.',
    note: 'This form is purely visual; it does not submit data.',
    submit: 'Send message',
    placeholders: {
      name: 'Your name',
      email: 'you@example.com',
      message: 'Your message'
    }
  }
};

export const generateMetadata = ({ params }: { params: { locale: 'de' | 'en' } }): Metadata => ({
  title: params.locale === 'de' ? 'Krypto Sentiment – Kontakt' : 'Krypto Sentiment – Contact',
  description: params.locale === 'de' ? DESCRIPTION : 'Contact the team for questions, feedback or collaborations.',
  alternates: {
    canonical: `${BASE_URL}/${params.locale}/${params.locale === 'de' ? 'kontakt' : 'contact'}`
  }
});

export default function ContactPage({ params }: { params: { locale: 'de' | 'en' } }) {
  const localeCopy = formCopy[params.locale];

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <section className="mx-auto max-w-3xl space-y-8 rounded-2xl border border-gray-200 bg-white/80 p-8 shadow-sm">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-gray-400">{localeCopy.label}</p>
          <h1 className="text-4xl font-semibold text-gray-900">{localeCopy.title}</h1>
          <p className="text-base text-gray-600">{localeCopy.subtitle}</p>
        </header>
        <form className="space-y-6">
          <label className="space-y-1 text-sm font-medium text-gray-700">
            Name
            <input
              type="text"
              name="name"
              placeholder={localeCopy.placeholders.name}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 focus:border-black focus:outline-none"
            />
          </label>
          <label className="space-y-1 text-sm font-medium text-gray-700">
            {params.locale === 'de' ? 'E-Mail' : 'Email'}
            <input
              type="email"
              name="email"
              placeholder={localeCopy.placeholders.email}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 focus:border-black focus:outline-none"
            />
          </label>
          <label className="space-y-1 text-sm font-medium text-gray-700">
            {params.locale === 'de' ? 'Nachricht' : 'Message'}
            <textarea
              name="message"
              rows={5}
              placeholder={localeCopy.placeholders.message}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-base text-gray-900 focus:border-black focus:outline-none"
            />
          </label>
          <button
            type="submit"
            className="w-full rounded-md bg-black px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-gray-800"
          >
            {localeCopy.submit}
          </button>
        </form>
        <p className="text-sm text-gray-500">{localeCopy.note}</p>
      </section>
    </main>
  );
}
