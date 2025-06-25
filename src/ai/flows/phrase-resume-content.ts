
'use server';

/**
 * @fileOverview A flow that uses AI to phrase the content of resume sections with detail and professionalism.
 *
 * - phraseResumeContent - A function that handles the phrasing of resume content.
 * - PhraseResumeContentInput - The input type for the phraseResumeContent function.
 * - PhraseResumeContentOutput - The return type for the phraseResumeContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PhraseResumeContentInputSchema = z.object({
  name: z.string().describe('The full name of the resume owner.'),
  email: z.string().describe('The email address.'),
  phone: z.string().describe('The phone number.'),
  address: z.string().describe('The mailing address (optional).'),
  linkedinUrl: z.string().describe('URL to LinkedIn profile (optional).'),
  githubUrl: z.string().describe('URL to GitHub profile (optional).'),
  portfolioUrl: z.string().describe('URL to personal portfolio or website (optional).'),
  summary: z.string().describe('A brief summary or objective statement (optional). If brief, the AI should elaborate.'),
  education: z.string().describe('Educational qualifications. The AI should ensure professional phrasing and complete details like institution, degree, and dates, using newlines for distinct entries.'),
  experience: z.string().describe('Work experiences, including responsibilities and achievements. The AI should elaborate on these, use strong action verbs, quantify achievements, and format as detailed bullet points using newlines.'),
  projects: z.string().describe('Personal or academic projects. The AI should elaborate, highlight technologies, quantify impact, and format as detailed bullet points using newlines.'),
  skills: z.string().describe('Technical and soft skills. The AI should organize and present these professionally, possibly grouping them.'),
  certifications: z.string().describe('Professional certifications or licenses (optional). The AI should list them clearly with issuing body and date if available, using newlines for distinct entries.'),
  awards: z.string().describe('Awards or honors received (optional). The AI should list them clearly with context, using newlines for distinct entries.'),
});
export type PhraseResumeContentInput = z.infer<typeof PhraseResumeContentInputSchema>;

const PhraseResumeContentOutputSchema = z.object({
  phrasedContent: z.object({
    name: z.string().describe('The phrased name (usually no change needed, but ensure professional presentation).'),
    email: z.string().describe('The phrased email (usually no change).'),
    phone: z.string().describe('The phrased phone number (usually no change).'),
    address: z.string().describe('The phrased address (ensure clarity if provided).'),
    linkedinUrl: z.string().describe('The phrased LinkedIn URL (ensure it is just the URL).'),
    githubUrl: z.string().describe('The phrased GitHub URL (ensure it is just the URL).'),
    portfolioUrl: z.string().describe('The phrased portfolio URL (ensure it is just the URL).'),
    summary: z.string().describe('A professionally phrased summary or objective, elaborated to be concise yet impactful (2-4 sentences). Highlight key strengths and career goals.'),
    education: z.string().describe('Professionally phrased education details. Each entry should be clear: "Degree Name, Major - University Name, City, State - Graduation Date (or Expected Date)". Use newlines for separate degrees/institutions. Elaborate if input is brief.'),
    experience: z.string().describe('Detailed and professionally phrased work experience. For each role: "Job Title - Company Name, City, State - Dates of Employment (Month Year – Month Year)". Responsibilities/Achievements MUST be detailed bullet points starting with strong action verbs. Quantify achievements (e.g., "Led a team of 5 engineers to deliver project X, resulting in a 15% increase in Y"). Elaborate on brief descriptions. Ensure consistent formatting with newlines for distinct roles and for each bullet point within roles.'),
    projects: z.string().describe('Professionally phrased project descriptions. For each project: "Project Name - Dates (if applicable)". Descriptions MUST be detailed bullet points. Describe the project\'s purpose, your role, technologies used, and any notable outcomes. Use action verbs and quantify impact. Elaborate on brief descriptions. Use newlines for distinct projects and for each bullet point within projects.'),
    skills: z.string().describe('Well-organized and professionally presented skills. Group related skills if appropriate (e.g., "Programming Languages: Java, Python, C++"). Elaborate on skill applications if context allows.'),
    certifications: z.string().describe('Professionally phrased certifications. List clearly: "Certification Name - Issuing Organization - Date Obtained." Use newlines for multiple certifications. Elaborate if input is brief.'),
    awards: z.string().describe('Professionally phrased awards and honors. List clearly: "Award Name - Granting Institution/Organization - Date Received." Use newlines for multiple awards. Elaborate if input is brief.'),
  }).describe('The professionally phrased content for each section of the resume, elaborated for detail and impact.'),
});
export type PhraseResumeContentOutput = z.infer<typeof PhraseResumeContentOutputSchema>;

export async function phraseResumeContent(input: PhraseResumeContentInput): Promise<PhraseResumeContentOutput> {
  return phraseResumeContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'phraseResumeContentPrompt',
  input: {schema: PhraseResumeContentInputSchema},
  output: {schema: PhraseResumeContentOutputSchema},
  prompt: `You are an expert resume writer and career coach. Your task is to take the raw resume information provided and rephrase EACH section to be highly professional, DETAILED, impactful, and tailored for a modern resume. If the provided information for a section is brief, ELABORATE on it to add substance and clarity.

General Guidelines for Phrasing:
- Tone: Maintain a confident, professional, and positive tone throughout.
- ELABORATION: If input fields (like summary, experience, projects) are brief, expand on them with relevant professional details or common best practices for that section.
- Conciseness within Detail: While elaborating, remain concise and avoid fluff. Every detail should add value.
- Action Verbs: Start ALL bullet points in Experience and Projects with strong, varied action verbs (e.g., "Spearheaded," "Engineered," "Orchestrated," "Maximized," "Innovated").
- Quantification: Wherever possible, add quantifiable achievements or suggest adding them (e.g., "Increased user engagement by 25%," "Reduced server costs by 15%," "Managed a budget of $X," "Improved efficiency by [specific metric]%"). If raw data has numbers, make sure they are highlighted.
- Clarity: Ensure all information is clear, unambiguous, and easy to understand.
- Keywords: Naturally incorporate industry-relevant keywords.

Specific Section Phrasing Instructions:
- Name, Email, Phone, Address, URLs: Ensure these are presented cleanly. URLs should be just the links.
- Summary/Objective: Craft a compelling 2-4 sentence summary or objective. If the input is brief (e.g., one phrase), expand it. Highlight key strengths, years of experience (if inferable), and career goals.
- Education: Format each entry clearly: "Degree Name, Major - University Name, City, State - Graduation Date (or Expected Date)." Use newlines for separate degrees/institutions. Ensure all key details are present.
- Experience: For each role: "Job Title - Company Name, City, State - Dates of Employment (Month Year – Month Year)".
    - Responsibilities/Achievements: MUST be detailed bullet points, each starting with an action verb and on its own newline. Focus on accomplishments and contributions. ELABORATE on each point to showcase skills and impact. Quantify impact.
- Projects: For each project: "Project Name - Dates (if applicable)".
    - Description: MUST be detailed bullet points, each starting with an action verb and on its own newline. Describe the project's purpose, your specific role and contributions, technologies used, and notable outcomes or learnings. ELABORATE on each point.
- Skills: Organize skills logically. Consider categories (e.g., Programming Languages, Software & Tools, Methodologies, Soft Skills). Briefly explain proficiency or context if appropriate (e.g., "Python (Advanced, 5+ years)", "Agile Methodologies (Scrum Master)").
- Certifications: "Certification Name - Issuing Organization - Date Obtained (Month Year)." Use newlines for multiple certifications. Include full names.
- Awards: "Award Name - Granting Institution/Organization - Date Received (Month Year)." Use newlines for multiple awards. Provide brief context if needed.

Raw Resume Information:
Name: {{{name}}}
Email: {{{email}}}
Phone: {{{phone}}}
Address: {{{address}}}
LinkedIn URL: {{{linkedinUrl}}}
GitHub URL: {{{githubUrl}}}
Portfolio URL: {{{portfolioUrl}}}
Summary/Objective: {{{summary}}}
Education: {{{education}}}
Experience: {{{experience}}}
Projects: {{{projects}}}
Skills: {{{skills}}}
Certifications: {{{certifications}}}
Awards: {{{awards}}}

Based on this information, generate the professionally phrased and DETAILED content for each section according to the output schema.
Ensure that bullet points within sections like Experience and Projects are implicitly understood to be separated by newlines in the output string for that section and that each bullet point is elaborated upon.

Return a JSON object matching this schema:
{{{outputSchema}}}
`,
});

const phraseResumeContentFlow = ai.defineFlow(
  {
    name: 'phraseResumeContentFlow',
    inputSchema: PhraseResumeContentInputSchema,
    outputSchema: PhraseResumeContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI failed to generate phrased resume content. The AI model might have returned an empty or invalid response.");
    }
    return output;
  }
);
