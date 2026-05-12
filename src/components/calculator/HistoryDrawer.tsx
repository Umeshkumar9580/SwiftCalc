'use client';

import { useEffect, useState } from 'react';
import { History, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { getHistory, clearHistory, HistoryItem } from '@/lib/calculator-utils';
import { format } from 'date-fns';

interface HistoryDrawerProps {
  onSelect: (item: HistoryItem) => void;
}

export function HistoryDrawer({ onSelect }: HistoryDrawerProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  const handleClear = () => {
    clearHistory();
    setHistory([]);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <History className="w-5 h-5 stroke-[1.5]" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="bg-card border-l border-border w-full sm:max-w-md">
        <SheetHeader className="flex flex-row items-center justify-between mb-6">
          <SheetTitle className="text-2xl font-bold">History</SheetTitle>
          {history.length > 0 && (
            <Button variant="ghost" size="sm" onClick={handleClear} className="text-destructive hover:text-destructive/80">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
          )}
        </SheetHeader>
        <div className="flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-120px)] pr-2">
          {history.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No calculations yet
            </div>
          ) : (
            history.map((item) => (
              <div 
                key={item.id} 
                className="group relative bg-accent/20 hover:bg-accent/40 rounded-xl p-4 cursor-pointer transition-colors"
                onClick={() => onSelect(item)}
              >
                <div className="text-xs text-muted-foreground mb-1">
                  {format(item.timestamp, 'MMM d, HH:mm')}
                </div>
                <div className="text-sm font-display text-muted-foreground mb-1">
                  {item.expression} =
                </div>
                <div className="text-lg font-display font-medium">
                  {item.result}
                </div>
              </div>
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
