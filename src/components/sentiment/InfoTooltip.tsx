import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface InfoTooltipProps {
  content: React.ReactNode;
  'aria-label'?: string;
}
export function InfoTooltip({ content, ...rest }: InfoTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger aria-label={rest['aria-label'] ?? 'Info'}>
          <Info className="w-4 h-4 opacity-70" />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs text-sm leading-snug">
          {content}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

