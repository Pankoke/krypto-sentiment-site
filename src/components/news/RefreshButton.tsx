"use client";
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';

export interface RefreshButtonProps {
  label?: string;
}

export function RefreshButton({ label = 'Refresh' }: RefreshButtonProps) {
  const router = useRouter();
  return (
    <Button onClick={() => router.refresh()} className="px-4">
      {label}
    </Button>
  );
}
