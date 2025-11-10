import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import type { SentimentItem } from '@/core/sentiment/types';

interface SentimentDetailDialogProps {
  open: boolean;
  item?: SentimentItem;
  onOpenChange: (o: boolean) => void;
}
export function SentimentDetailDialog({ open, item, onOpenChange }: SentimentDetailDialogProps) {
  if (!item) return null;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {item.symbol} – Details
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          {/* TODO: Score/Confidence Verlauf, vollständige Quellenliste, Kalibrierung */}
          <pre className="text-xs bg-muted rounded p-2 overflow-auto">{JSON.stringify(item, null, 2)}</pre>
        </div>
      </DialogContent>
    </Dialog>
  );
}

