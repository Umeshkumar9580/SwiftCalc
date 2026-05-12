'use client';

import { cn } from '@/lib/utils';

interface DisplayProps {
  expression: string;
  result: string;
}

export function Display({ expression, result }: DisplayProps) {
  return (
    <div className="glass-display rounded-3xl p-8 mb-6 flex flex-col items-end justify-end min-h-[160px] gap-2">
      <div className="text-muted-foreground font-display text-xl h-8 overflow-hidden text-ellipsis whitespace-nowrap w-full text-right">
        {expression}
      </div>
      <div className="text-foreground font-display text-5xl font-medium tracking-tighter break-all text-right w-full">
        {result || '0'}
      </div>
    </div>
  );
}
