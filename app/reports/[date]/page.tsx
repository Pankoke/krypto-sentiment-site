import { redirect } from 'next/navigation';

export default function Page({ params }: { params: { date: string } }) {
  redirect(`/de/reports/${params.date}`);
}

