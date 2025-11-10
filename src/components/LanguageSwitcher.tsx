"use client";
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export function LanguageSwitcher() {
  const pathname = usePathname();
  const parts = pathname.split('/');
  const current = parts[1] === 'en' ? 'en' : parts[1] === 'de' ? 'de' : 'de';
  const other = current === 'de' ? 'en' : 'de';
  if (parts[1] === 'de' || parts[1] === 'en') parts[1] = other; else parts.splice(1, 0, other);
  const target = parts.join('/');
  return (
    <Link href={target} className="text-sm underline">
      {current === 'de' ? 'EN' : 'DE'}
    </Link>
  );
}

