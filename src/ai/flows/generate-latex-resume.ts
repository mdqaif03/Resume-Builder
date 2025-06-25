'use server';
/**
 * @fileOverview Formatted web resume content generator flow.
 *
 * - generateWebResume - A function that generates formatted content for a web/PDF resume.
 * - GenerateWebResumeInput - The input type for the generateWebResume function.
 * - GenerateWebResumeOutput - The return type for the generateWebResume function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input schema remains similar, taking basic resume data strings
const GenerateWebResumeInputSchema = z.object({
  name: z.string().describe('The full name of the resume owner.'),
  contactDetails: z.string().describe('Contact details like email, phone, LinkedIn. Ensure these are presented clearly, perhaps on one line separated by pipes or on multiple lines if appropriate.'),
  education: z.string().describe('Educational qualifications. Each distinct qualification (e.g., degree, institution, dates) should be clearly formatted, potentially starting new lines for readability.'),
  experience: z.string().describe('Work experiences. Each job should be distinct, with company, role, dates, and responsibilities/achievements. Use newlines for bullet points or distinct achievements under each role.'),
  projects: z.string().describe('Personal projects. Each project should be distinct, with title, dates (if any), and a brief description or bullet points. Use newlines for clarity.'),
  skills: z.string().describe('Skills. This could be a comma-separated list or categorized skills. Format for readability.'),
});
export type GenerateWebResumeInput = z.infer<typeof GenerateWebResumeInputSchema>;

const GenerateWebResumeOutputSchema = z.object({
  nameFormatted: z.string().describe('The full name, formatted prominently for a resume header.'),
  contactDetailsFormatted: z.string().describe('Contact details, formatted clearly for a resume header.'),
  educationContent: z.string().describe('The entire education section, formatted professionally with newlines separating distinct entries or details.'),
  experienceContent: z.string().describe('The entire work experience section, formatted professionally with newlines separating distinct roles or bullet points.'),
  projectsContent: z.string().describe('The entire projects section, formatted professionally with newlines separating distinct projects or bullet points.'),
  skillsContent: z.string().describe('The entire skills section, formatted clearly.'),
});
export type GenerateWebResumeOutput = z.infer<typeof GenerateWebResumeOutputSchema>;

export async function generateWebResume(input: GenerateWebResumeInput): Promise<GenerateWebResumeOutput> {
  return generateWebResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWebResumePrompt',
  input: {schema: GenerateWebResumeInputSchema},
  output: {schema: GenerateWebResumeOutputSchema},
  prompt: `You are an expert resume writer and formatter.
  You will be provided with raw information for a person's resume, including their name, contact details, education, experience, projects, and skills.
  Your task is to format this information into clean, professional, and readable content suitable for a web page or PDF resume.

  Guidelines for formatting:
  - Name: Present the name prominently.
  - Contact Details: Format clearly, suitable for a resume header. Can be a single line with separators (e.g., " | ") or multiple lines.
  - Education, Experience, Projects: For each of these sections, format the content provided. If there are multiple entries (e.g., multiple degrees or jobs), ensure they are distinct. Use newlines to separate individual entries or bullet points within an entry (e.g., achievements under a job).
  - Skills: Format the skills list clearly. If it's a long list, consider how it might be best presented.

  Raw Resume Information:
  Name: {{{name}}}
  Contact Details: {{{contactDetails}}}
  Education: {{{education}}}
  Experience: {{{experience}}}
  Projects: {{{projects}}}
  Skills: {{{skills}}}

  Based on this information, generate the formatted content for each section according to the output schema.
  For the 'educationContent', 'experienceContent', 'projectsContent', and 'skillsContent' fields, ensure that individual items, bullet points, or details are separated by newlines within the string for that section.
  Example for experienceContent:
  "Software Engineer, Tech Corp (Jan 2020 - Present)
  - Developed new features for the main product.
  - Led a team of 3 developers.
  Intern, Startup LLC (May 2019 - Aug 2019)
  - Assisted senior developers with various tasks."

  Return a JSON object matching this schema:
  {{{outputSchema}}}
`,
});

const generateWebResumeFlow = ai.defineFlow(
  {
    name: 'generateWebResumeFlow',
    inputSchema: GenerateWebResumeInputSchema,
    outputSchema: GenerateWebResumeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI failed to generate formatted resume content.");
    }
    return output;
  }
);
