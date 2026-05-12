'use server';
/**
 * @fileOverview An AI tool that interprets natural language math problems, provides step-by-step solutions, and the final answer.
 *
 * - solveMathWordProblem - A function that handles the math word problem solving process.
 * - SolveMathWordProblemInput - The input type for the solveMathWordProblem function.
 * - SolveMathWordProblemOutput - The return type for the solveMathWordProblem function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SolveMathWordProblemInputSchema = z.object({
  problem: z.string().describe('The math word problem to solve in natural language.'),
});
export type SolveMathWordProblemInput = z.infer<typeof SolveMathWordProblemInputSchema>;

const SolveMathWordProblemOutputSchema = z.object({
  solution: z.string().describe('The step-by-step solution to the math word problem.'),
  finalAnswer: z.string().describe('The final answer to the math word problem.'),
});
export type SolveMathWordProblemOutput = z.infer<typeof SolveMathWordProblemOutputSchema>;

export async function solveMathWordProblem(
  input: SolveMathWordProblemInput
): Promise<SolveMathWordProblemOutput> {
  return solveMathWordProblemFlow(input);
}

const prompt = ai.definePrompt({
  name: 'solveMathWordProblemPrompt',
  input: {schema: SolveMathWordProblemInputSchema},
  output: {schema: SolveMathWordProblemOutputSchema},
  prompt: `You are an expert math word problem solver. Your task is to interpret the given math word problem, provide a clear and detailed step-by-step solution, and then state the final answer.

Here is the math word problem:
Problem: {{{problem}}}

Provide the solution as follows:
Solution: [Your step-by-step solution here]
FinalAnswer: [The final numerical or textual answer here]`,
});

const solveMathWordProblemFlow = ai.defineFlow(
  {
    name: 'solveMathWordProblemFlow',
    inputSchema: SolveMathWordProblemInputSchema,
    outputSchema: SolveMathWordProblemOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error('Failed to generate solution for the math word problem.');
    }
    return output;
  }
);
