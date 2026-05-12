'use client';

import { useState } from 'react';
import { Ruler, ArrowRightLeft } from 'lucide-react';
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

export function UnitConverter() {
  const [type, setType] = useState<string>(UNIT_TYPES.LENGTH);
  const [value, setValue] = useState<string>('1');
  const [fromUnit, setFromUnit] = useState<string>('meters');
  const [toUnit, setToUnit] = useState<string>('kilometers');

  const unitsForType = type === UNIT_TYPES.TEMPERATURE 
    ? ['celsius', 'fahrenheit', 'kelvin'] 
    : Object.keys(UNITS[type as keyof typeof UNITS] || {});

  const result = convertUnits(parseFloat(value) || 0, fromUnit, toUnit, type);

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
            Unit Conversion
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 mt-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Category</label>
            <Select value={type} onValueChange={(v) => {
              setType(v);
              const newUnits = v === UNIT_TYPES.TEMPERATURE 
                ? ['celsius', 'fahrenheit', 'kelvin'] 
                : Object.keys(UNITS[v as keyof typeof UNITS]);
              setFromUnit(newUnits[0]);
              setToUnit(newUnits[1]);
            }}>
              <SelectTrigger className="bg-accent/20 border-border">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(UNIT_TYPES).map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
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
                  onChange={(e) => setValue(e.target.value)}
                  className="bg-accent/20 border-border"
                />
                <Select value={fromUnit} onValueChange={setFromUnit}>
                  <SelectTrigger className="w-[140px] bg-accent/20 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {unitsForType.map((u) => (
                      <SelectItem key={u} value={u}>{u}</SelectItem>
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
                <div className="flex-1 px-3 py-2 bg-accent/10 border border-border rounded-md font-medium text-lg">
                  {result.toLocaleString(undefined, { maximumFractionDigits: 6 })}
                </div>
                <Select value={toUnit} onValueChange={setToUnit}>
                  <SelectTrigger className="w-[140px] bg-accent/20 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {unitsForType.map((u) => (
                      <SelectItem key={u} value={u}>{u}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
