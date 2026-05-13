'use server';
/**
 * @fileOverview An AI flow to estimate currency conversion rates based on general knowledge.
 * 
 * - convertCurrency - Handles the conversion logic.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const ConvertCurrencyInputSchema = z.object({
  amount: z.number().describe('The amount to convert'),
  fromCurrency: z.string().describe('The source currency code (e.g., USD, INR, EUR)'),
  toCurrency: z.string().describe('The target currency code (e.g., USD, INR, EUR)'),
});

const ConvertCurrencyOutputSchema = z.object({
  convertedAmount: z.number().describe('The converted amount'),
  exchangeRate: z.number().describe('The approximate exchange rate used'),
  lastUpdatedHint: z.string().describe('A disclaimer about the data freshness'),
});

export async function convertCurrency(input: z.infer<typeof ConvertCurrencyInputSchema>) {
  return convertCurrencyFlow(input);
}

const prompt = ai.definePrompt({
  name: 'convertCurrencyPrompt',
  input: { schema: ConvertCurrencyInputSchema },
  output: { schema: ConvertCurrencyOutputSchema },
  prompt: `You are a financial assistant. Convert {{amount}} {{fromCurrency}} to {{toCurrency}}. 
  Use your latest training data for the approximate exchange rate. 
  Provide a converted amount, the rate used, and a short disclaimer that rates are approximate.`,
});

const convertCurrencyFlow = ai.defineFlow(
  {
    name: 'convertCurrencyFlow',
    inputSchema: ConvertCurrencyInputSchema,
    outputSchema: ConvertCurrencyOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    if (!output) throw new Error('Failed to convert currency');
    return output;
  }
);
