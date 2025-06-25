
'use server';
/**
 * @fileOverview A flow to parse raw resume text into structured ResumeData.
 *
 * - parseResumeText - A function that handles parsing resume text.
 * - ParseResumeTextInput - The input type for the parseResumeText function.
 * - ParseResumeTextOutput - The return type for the parseResumeText function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ParsedResumeDataSchema = z.object({
  name: z.string().describe('The full name of the resume owner. If not found, leave empty.'),
  email: z.string().describe('The primary email address. If not found, leave empty.'),
  phone: z.string().describe('The primary phone number. If not found, leave empty.'),
  address: z.string().describe('The mailing address (optional). If not found, leave empty.'),
  linkedinUrl: z.string().describe('URL to LinkedIn profile (optional). If not found, leave empty.'),
  githubUrl: z.string().describe('URL to GitHub profile (optional). If not found, leave empty.'),
  portfolioUrl: z.string().describe('URL to personal portfolio or website (optional). If not found, leave empty.'),
  summary: z.string().describe('A brief summary or objective statement (optional). If not found, leave empty.'),
  education: z.string().describe('Educational qualifications, each on a new line. If not found, leave empty.'),
  experience: z.string().describe('Work experiences, each on a new line, including responsibilities and achievements. If not found, leave empty.'),
  projects: z.string().describe('Personal or academic projects, each on a new line. If not found, leave empty.'),
  skills: z.string().describe('Technical and soft skills, comma-separated or each on a new line. If not found, leave empty.'),
  certifications: z.string().describe('Professional certifications or licenses, each on a new line (optional). If not found, leave empty.'),
  awards: z.string().describe('Awards or honors received, each on a new line (optional). If not found, leave empty.'),
});

const ParseResumeTextInputSchema = z.object({
  resumeText: z.string().describe('The raw text content of the resume.'),
});
export type ParseResumeTextInput = z.infer<typeof ParseResumeTextInputSchema>;

const ParseResumeTextOutputSchema = z.object({
  parsedData: ParsedResumeDataSchema.describe("The structured data extracted from the resume text."),
});
export type ParseResumeTextOutput = z.infer<typeof ParseResumeTextOutputSchema>;

export async function parseResumeText(input: ParseResumeTextInput): Promise<ParseResumeTextOutput> {
  return parseResumeTextFlow(input);
}

const prompt = ai.definePrompt({
  name: 'parseResumeTextPrompt',
  input: {schema: ParseResumeTextInputSchema},
  output: {schema: ParseResumeTextOutputSchema},
  prompt: `You are an expert resume parser. Your task is to meticulously extract information from the provided raw resume text and structure it according to the output schema.
Iterate through EACH field in the output schema (name, email, phone, address, linkedinUrl, githubUrl, portfolioUrl, summary, education, experience, projects, skills, certifications, awards).
For each field, diligently search the resume text for corresponding information.

Key instructions:
- Identify common section headers like 'Education', 'Work Experience', 'Professional Experience', 'Projects', 'Skills', 'Summary', 'Objective', 'Contact Information', 'Personal Details', etc.
- Extract contact details (name, email, phone, address, LinkedIn/GitHub/Portfolio URLs) which are often found at the top of the resume or in a dedicated contact section.
- For 'education', 'experience', and 'projects' sections, try to capture all listed items. Preserve newlines or bullet points found in the original text to separate distinct entries or responsibilities/achievements within an entry. For example, if experience is listed with bullet points, try to retain that structure in the extracted string for that field, with each bullet point on a new line.
- For 'skills', capture lists of skills. These might be comma-separated or in distinct categories.
- If a specific piece of information for any field (e.g., 'githubUrl', 'awards', 'address') is not clearly present after a thorough search, return an empty string for that field.
- CRITICALLY: DO NOT omit any fields from the output structure. The 'parsedData' object in your response MUST contain all keys defined in its schema (name, email, phone, etc.), even if their values are empty strings.

Resume Text:
{{{resumeText}}}

Output the parsed data strictly according to this Zod schema:
{{{outputSchema}}}
Ensure the output is a valid JSON object matching the schema.
`,
});

const parseResumeTextFlow = ai.defineFlow(
  {
    name: 'parseResumeTextFlow',
    inputSchema: ParseResumeTextInputSchema,
    outputSchema: ParseResumeTextOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI failed to parse the resume text.");
    }
    return output;
  }
);

