'use client';

import { useState, useCallback, useEffect } from 'react';
import { 
  Settings, 
  MoreVertical, 
  Delete, 
  X, 
  Minus, 
  Plus, 
  Divide, 
  Equal,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Display } from './Display';
import { HistoryDrawer } from './HistoryDrawer';
import { AISolver } from './AISolver';
import { UnitConverter } from './UnitConverter';
import { saveToHistory, HistoryItem } from '@/lib/calculator-utils';
import { cn } from '@/lib/utils';

export function Calculator() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('0');
  const [isScientific, setIsScientific] = useState(false);
  const [shouldReset, setShouldReset] = useState(false);

  const calculate = useCallback(() => {
    try {
      // Replace symbols for evaluation
      const evalExpression = expression
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/\^/g, '**')
        .replace(/π/g, 'Math.PI')
        .replace(/e/g, 'Math.E')
        .replace(/sin\(/g, 'Math.sin(')
        .replace(/cos\(/g, 'Math.cos(')
        .replace(/tan\(/g, 'Math.tan(')
        .replace(/log\(/g, 'Math.log10(')
        .replace(/ln\(/g, 'Math.log(')
        .replace(/√\(/g, 'Math.sqrt(');

      // Handle simple math expression evaluation
      // Warning: Function is used for calculation engine only.
      const evaluated = new Function(`return ${evalExpression}`)();
      const finalResult = Number.isFinite(evaluated) 
        ? evaluated.toLocaleString(undefined, { maximumFractionDigits: 8 }) 
        : 'Error';
      
      setResult(finalResult.toString());
      saveToHistory(expression, finalResult.toString());
      setShouldReset(true);
    } catch (e) {
      setResult('Error');
    }
  }, [expression]);

  const handleInput = (val: string) => {
    if (shouldReset && !['+', '-', '×', '÷', '^'].includes(val)) {
      setExpression(val);
      setShouldReset(false);
      return;
    }
    setShouldReset(false);
    setExpression(prev => prev + val);
  };

  const handleClear = () => {
    setExpression('');
    setResult('0');
  };

  const handleDelete = () => {
    setExpression(prev => prev.slice(0, -1));
  };

  const onHistorySelect = (item: HistoryItem) => {
    setExpression(item.expression);
    setResult(item.result);
  };

  // Basic keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') handleInput(e.key);
      if (e.key === '.') handleInput('.');
      if (e.key === '+') handleInput('+');
      if (e.key === '-') handleInput('-');
      if (e.key === '*') handleInput('×');
      if (e.key === '/') handleInput('÷');
      if (e.key === 'Enter' || e.key === '=') calculate();
      if (e.key === 'Backspace') handleDelete();
      if (e.key === 'Escape') handleClear();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleInput, calculate]);

  return (
    <div className="w-full max-w-md mx-auto flex flex-col h-full max-h-[850px] p-4 bg-background border border-border rounded-[2.5rem] shadow-2xl relative overflow-hidden">
      {/* Header Tools */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-1">
          <HistoryDrawer onSelect={onHistorySelect} />
          <AISolver />
          <UnitConverter />
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsScientific(!isScientific)}
          className="text-primary font-semibold hover:text-primary/80 flex items-center gap-1"
        >
          {isScientific ? 'Standard' : 'Scientific'}
          {isScientific ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        </Button>
      </div>

      {/* Result Display */}
      <Display expression={expression} result={result} />

      {/* Keypad */}
      <div className="grid grid-cols-4 gap-3 flex-1 overflow-hidden">
        {/* Scientific Row (Conditional) */}
        {isScientific && (
          <div className="col-span-4 grid grid-cols-4 gap-3 animate-slide-in mb-3">
            {['sin(', 'cos(', 'tan(', 'log('].map(fn => (
              <button key={fn} onClick={() => handleInput(fn)} className="calc-btn calc-btn-secondary text-base">
                {fn.replace('(', '')}
              </button>
            ))}
            {['^', '√(', 'π', 'e'].map(sym => (
              <button key={sym} onClick={() => handleInput(sym)} className="calc-btn calc-btn-secondary text-base">
                {sym.replace('(', '')}
              </button>
            ))}
          </div>
        )}

        {/* Standard Pad */}
        <button onClick={handleClear} className="calc-btn calc-btn-secondary text-destructive">AC</button>
        <button onClick={handleDelete} className="calc-btn calc-btn-secondary"><Delete className="w-5 h-5" /></button>
        <button onClick={() => handleInput('%')} className="calc-btn calc-btn-secondary">%</button>
        <button onClick={() => handleInput('÷')} className="calc-btn calc-btn-operator"><Divide className="w-6 h-6" /></button>

        {[7, 8, 9].map(n => (
          <button key={n} onClick={() => handleInput(n.toString())} className="calc-btn calc-btn-number">{n}</button>
        ))}
        <button onClick={() => handleInput('×')} className="calc-btn calc-btn-operator"><X className="w-6 h-6" /></button>

        {[4, 5, 6].map(n => (
          <button key={n} onClick={() => handleInput(n.toString())} className="calc-btn calc-btn-number">{n}</button>
        ))}
        <button onClick={() => handleInput('-')} className="calc-btn calc-btn-operator"><Minus className="w-6 h-6" /></button>

        {[1, 2, 3].map(n => (
          <button key={n} onClick={() => handleInput(n.toString())} className="calc-btn calc-btn-number">{n}</button>
        ))}
        <button onClick={() => handleInput('+')} className="calc-btn calc-btn-operator"><Plus className="w-6 h-6" /></button>

        <button onClick={() => handleInput('0')} className="calc-btn calc-btn-number col-span-2 text-left px-12">0</button>
        <button onClick={() => handleInput('.')} className="calc-btn calc-btn-number">.</button>
        <button onClick={calculate} className="calc-btn calc-btn-operator"><Equal className="w-6 h-6" /></button>
      </div>
    </div>
  );
}
