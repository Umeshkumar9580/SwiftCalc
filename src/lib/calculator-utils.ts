export type HistoryItem = {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
};

export const UNIT_TYPES = {
  LENGTH: 'Length',
  WEIGHT: 'Weight',
  TEMPERATURE: 'Temperature',
};

export const UNITS = {
  [UNIT_TYPES.LENGTH]: {
    meters: 1,
    kilometers: 0.001,
    centimeters: 100,
    miles: 0.000621371,
    feet: 3.28084,
  },
  [UNIT_TYPES.WEIGHT]: {
    kilograms: 1,
    grams: 1000,
    pounds: 2.20462,
    ounces: 35.274,
  },
};

export function convertUnits(value: number, from: string, to: string, type: string): number {
  if (type === UNIT_TYPES.TEMPERATURE) {
    if (from === 'celsius' && to === 'fahrenheit') return (value * 9) / 5 + 32;
    if (from === 'fahrenheit' && to === 'celsius') return ((value - 32) * 5) / 9;
    if (from === 'celsius' && to === 'kelvin') return value + 273.15;
    if (from === 'kelvin' && to === 'celsius') return value - 273.15;
    return value;
  }

  const typeUnits = UNITS[type as keyof typeof UNITS];
  if (!typeUnits) return value;
  
  const inBase = value / (typeUnits as any)[from];
  return inBase * (typeUnits as any)[to];
}

export function saveToHistory(expression: string, result: string) {
  const history: HistoryItem[] = JSON.parse(localStorage.getItem('calc_history') || '[]');
  const newItem: HistoryItem = {
    id: Math.random().toString(36).substr(2, 9),
    expression,
    result,
    timestamp: Date.now(),
  };
  localStorage.setItem('calc_history', JSON.stringify([newItem, ...history].slice(0, 50)));
  return newItem;
}

export function getHistory(): HistoryItem[] {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem('calc_history') || '[]');
}

export function clearHistory() {
  localStorage.removeItem('calc_history');
}
