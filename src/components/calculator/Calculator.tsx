'use client';

import { useState, useCallback, useEffect } from 'react';
import { 
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

export function Calculator() {
  const [expression, setExpression] = useState('');
  const [result, setResult] = useState('0');
  const [isScientific, setIsScientific] = useState(false);
  const [shouldReset, setShouldReset] = useState(false);

  const calculate = useCallback(() => {
    if (!expression) return;
    try {
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
    <div className="w-full max-w-md mx-auto flex flex-col h-full max-h-[90vh] p-6 bg-card border border-border/50 rounded-[3rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] relative overflow-hidden">
      {/* Decorative Background Glow */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
      
      {/* Header Tools */}
      <div className="flex items-center justify-between mb-6 px-1 z-10">
        <div className="flex items-center gap-1.5">
          <HistoryDrawer onSelect={onHistorySelect} />
          <AISolver />
          <UnitConverter />
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setIsScientific(!isScientific)}
          className="text-primary font-bold hover:bg-primary/10 rounded-full px-4 h-8 transition-all"
        >
          {isScientific ? 'Standard' : 'Scientific'}
          {isScientific ? <ChevronLeft className="w-3.5 h-3.5 ml-1" /> : <ChevronRight className="w-3.5 h-3.5 ml-1" />}
        </Button>
      </div>

      {/* Result Display */}
      <Display expression={expression} result={result} />

      {/* Keypad */}
      <div className="grid grid-cols-4 gap-3.5 flex-1 overflow-hidden z-10">
        {isScientific && (
          <div className="col-span-4 grid grid-cols-4 gap-3 animate-slide-in mb-2">
            {['sin(', 'cos(', 'tan(', 'log('].map(fn => (
              <button key={fn} onClick={() => handleInput(fn)} className="calc-btn calc-btn-secondary !h-12 text-sm uppercase tracking-wider">
                {fn.replace('(', '')}
              </button>
            ))}
            {['^', '√(', 'π', 'e'].map(sym => (
              <button key={sym} onClick={() => handleInput(sym)} className="calc-btn calc-btn-secondary !h-12 text-sm font-display">
                {sym.replace('(', '')}
              </button>
            ))}
          </div>
        )}

        {/* Standard Pad */}
        <button onClick={handleClear} className="calc-btn calc-btn-secondary text-destructive font-bold">AC</button>
        <button onClick={handleDelete} className="calc-btn calc-btn-secondary"><Delete className="w-5 h-5" /></button>
        <button onClick={() => handleInput('%')} className="calc-btn calc-btn-secondary">%</button>
        <button onClick={() => handleInput('÷')} className="calc-btn calc-btn-operator"><Divide className="w-6 h-6 stroke-[2.5]" /></button>

        {[7, 8, 9].map(n => (
          <button key={n} onClick={() => handleInput(n.toString())} className="calc-btn calc-btn-number">{n}</button>
        ))}
        <button onClick={() => handleInput('×')} className="calc-btn calc-btn-operator"><X className="w-6 h-6 stroke-[2.5]" /></button>

        {[4, 5, 6].map(n => (
          <button key={n} onClick={() => handleInput(n.toString())} className="calc-btn calc-btn-number">{n}</button>
        ))}
        <button onClick={() => handleInput('-')} className="calc-btn calc-btn-operator"><Minus className="w-6 h-6 stroke-[2.5]" /></button>

        {[1, 2, 3].map(n => (
          <button key={n} onClick={() => handleInput(n.toString())} className="calc-btn calc-btn-number">{n}</button>
        ))}
        <button onClick={() => handleInput('+')} className="calc-btn calc-btn-operator"><Plus className="w-6 h-6 stroke-[2.5]" /></button>

        <button onClick={() => handleInput('0')} className="calc-btn calc-btn-number col-span-2 text-left px-12">0</button>
        <button onClick={() => handleInput('.')} className="calc-btn calc-btn-number">.</button>
        <button onClick={calculate} className="calc-btn calc-btn-operator"><Equal className="w-6 h-6 stroke-[2.5]" /></button>
      </div>
    </div>
  );
}
