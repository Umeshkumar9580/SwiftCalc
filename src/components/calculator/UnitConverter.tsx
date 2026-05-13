'use client';

import { useState } from 'react';
import { Ruler, ArrowRightLeft, Loader2, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { UNIT_TYPES, convertUnits, UNITS } from '@/lib/calculator-utils';
import { convertCurrency } from '@/ai/flows/convert-currency';

const CURRENCIES = ['USD', 'INR', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'];

export function UnitConverter() {
  const [type, setType] = useState<string>(UNIT_TYPES.LENGTH);
  const [value, setValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<string>('meters');
  const [toUnit, setToUnit] = useState<string>('kilometers');
  
  // Currency specific state
  const [isCurrencyLoading, setIsCurrencyLoading] = useState(false);
  const [currencyResult, setCurrencyResult] = useState<{ amount: number; rate: number; hint: string } | null>(null);

  const isCurrency = type === 'Currency';

  const handleCurrencyConvert = async () => {
    setIsCurrencyLoading(true);
    try {
      const result = await convertCurrency({
        amount: parseFloat(value) || 0,
        fromCurrency: fromUnit,
        toCurrency: toUnit,
      });
      setCurrencyResult({
        amount: result.convertedAmount,
        rate: result.exchangeRate,
        hint: result.lastUpdatedHint
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsCurrencyLoading(false);
    }
  };

  const unitsForType = type === UNIT_TYPES.TEMPERATURE 
    ? ['celsius', 'fahrenheit', 'kelvin'] 
    : isCurrency 
    ? CURRENCIES
    : Object.keys(UNITS[type as keyof typeof UNITS] || {});

  const standardResult = !isCurrency ? convertUnits(parseFloat(value) || 0, fromUnit, toUnit, type) : 0;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
          <Ruler className="w-5 h-5 stroke-[1.5]" />
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-primary" />
            Unit & Currency Converter
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Category</label>
            <Select value={type} onValueChange={(v) => {
              setType(v);
              const newUnits = v === UNIT_TYPES.TEMPERATURE 
                ? ['celsius', 'fahrenheit', 'kelvin'] 
                : v === 'Currency'
                ? CURRENCIES
                : Object.keys(UNITS[v as keyof typeof UNITS] || {});
              setFromUnit(newUnits[0]);
              setToUnit(newUnits[1]);
              setCurrencyResult(null);
            }}>
              <SelectTrigger className="bg-accent/20 border-border">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(UNIT_TYPES).map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
                <SelectItem value="Currency">Currency (AI)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">From</label>
              <div className="flex gap-2">
                <Input 
                  type="number" 
                  value={value} 
                  onChange={(e) => {
                    setValue(e.target.value);
                    setCurrencyResult(null);
                  }}
                  className="bg-accent/20 border-border"
                />
                <Select value={fromUnit} onValueChange={(v) => { setFromUnit(v); setCurrencyResult(null); }}>
                  <SelectTrigger className="w-[140px] bg-accent/20 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {unitsForType.map((u) => (
                      <SelectItem key={u} value={u}>{u.toUpperCase()}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="bg-accent/20 p-2 rounded-full">
                <ArrowRightLeft className="w-4 h-4 text-muted-foreground rotate-90 sm:rotate-0" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">To</label>
              <div className="flex gap-2">
                <div className="flex-1 px-3 py-2 bg-accent/10 border border-border rounded-md font-medium text-lg flex items-center">
                  {isCurrency ? (
                    currencyResult ? currencyResult.amount.toLocaleString() : '---'
                  ) : (
                    standardResult.toLocaleString(undefined, { maximumFractionDigits: 6 })
                  )}
                </div>
                <Select value={toUnit} onValueChange={(v) => { setToUnit(v); setCurrencyResult(null); }}>
                  <SelectTrigger className="w-[140px] bg-accent/20 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {unitsForType.map((u) => (
                      <SelectItem key={u} value={u}>{u.toUpperCase()}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {isCurrency && (
            <div className="space-y-3">
              <Button 
                onClick={handleCurrencyConvert} 
                className="w-full gap-2" 
                disabled={isCurrencyLoading}
              >
                {isCurrencyLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Coins className="w-4 h-4" />}
                Convert with AI
              </Button>
              {currencyResult && (
                <p className="text-[10px] text-muted-foreground text-center italic">
                  {currencyResult.hint} (Rate: 1 {fromUnit.toUpperCase()} ≈ {currencyResult.rate} {toUnit.toUpperCase()})
                </p>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
