'use client';

import { useState } from 'react';
import { Sparkles, Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { solveMathWordProblem } from '@/ai/flows/solve-math-word-problem';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

export function AISolver() {
  const [problem, setProblem] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [solution, setSolution] = useState<{ stepByStep: string; final: string } | null>(null);

  const handleSolve = async () => {
    if (!problem.trim()) return;
    setIsLoading(true);
    try {
      const result = await solveMathWordProblem({ problem });
      setSolution({
        stepByStep: result.solution,
        final: result.finalAnswer
      });
    } catch (error) {
      console.error('Failed to solve:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Sparkles className="w-5 h-5 stroke-[1.5]" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="w-6 h-6 text-primary" />
            AI Word Problem Solver
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-6 mt-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Describe your math problem</label>
            <div className="relative">
              <Textarea 
                placeholder="Example: If John has 5 apples and gives 2 to Mary, how many does he have left?"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                className="min-h-[120px] bg-accent/20 border-border resize-none focus-visible:ring-primary pr-12"
              />
              <Button 
                size="icon" 
                className="absolute bottom-3 right-3 rounded-full"
                onClick={handleSolve}
                disabled={isLoading || !problem.trim()}
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {solution && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <ScrollArea className="max-h-[300px] w-full bg-accent/10 rounded-xl p-6 border border-border">
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-2">Step-by-Step Reasoning</h4>
                    <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                      {solution.stepByStep}
                    </p>
                  </div>
                  <div className="pt-4 border-t border-border">
                    <h4 className="text-sm font-semibold uppercase tracking-wider text-primary mb-1">Final Answer</h4>
                    <p className="text-2xl font-display font-medium">
                      {solution.final}
                    </p>
                  </div>
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
