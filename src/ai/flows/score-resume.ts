// This is an AI-powered resume scoring agent.
//
// It allows users to assess the suitability of their resume for a specific job description.
// It uses Gemini API to extract key information and determine a suitability score.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScoreResumeInputSchema = z.object({
  resumeText: z.string().describe('The text content of the resume to be scored.'),
  jobDescription: z.string().describe('The job description to score the resume against.'),
});

export type ScoreResumeInput = z.infer<typeof ScoreResumeInputSchema>;

const ScoreResumeOutputSchema = z.object({
  score: z.number().describe('A numerical score (0-100) representing the resume suitability for the job description.'),
  justification: z.string().describe('Explanation of the score, highlighting strengths and weaknesses.'),
});

export type ScoreResumeOutput = z.infer<typeof ScoreResumeOutputSchema>;

export async function scoreResume(input: ScoreResumeInput): Promise<ScoreResumeOutput> {
  return scoreResumeFlow(input);
}

const scoreResumePrompt = ai.definePrompt({
  name: 'scoreResumePrompt',
  input: {schema: ScoreResumeInputSchema},
  output: {schema: ScoreResumeOutputSchema},
  prompt: `You are an AI resume scoring tool. Given a resume and a job description, assess how well the resume matches the job.

  Provide a score between 0 and 100, where 100 is a perfect match. Provide a justification for the score, highlighting the resume's strengths and weaknesses in relation to the job description.

  Resume:
  {{resumeText}}

  Job Description:
  {{jobDescription}}`,
});

const scoreResumeFlow = ai.defineFlow(
  {
    name: 'scoreResumeFlow',
    inputSchema: ScoreResumeInputSchema,
    outputSchema: ScoreResumeOutputSchema,
  },
  async input => {
    const {output} = await scoreResumePrompt(input);
    return output!;
  }
);
