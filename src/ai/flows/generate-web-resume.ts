
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

const GenerateWebResumeInputSchema = z.object({
  name: z.string().describe('The full name of the resume owner.'),
  email: z.string().describe('The email address.'),
  phone: z.string().describe('The phone number.'),
  address: z.string().describe('The mailing address (optional).'),
  linkedinUrl: z.string().describe('URL to LinkedIn profile (optional).'),
  githubUrl: z.string().describe('URL to GitHub profile (optional).'),
  portfolioUrl: z.string().describe('URL to personal portfolio or website (optional).'),
  summary: z.string().describe('A brief summary or objective statement (optional).'),
  education: z.string().describe('Educational qualifications, potentially with newlines for multiple entries or details.'),
  experience: z.string().describe('Work experiences, potentially with newlines for multiple roles or bullet points.'),
  projects: z.string().describe('Personal projects, potentially with newlines for multiple projects or bullet points.'),
  skills: z.string().describe('Skills, potentially a comma-separated list or newline-separated.'),
  certifications: z.string().describe('Professional certifications or licenses (optional), potentially with newlines.'),
  awards: z.string().describe('Awards or honors received (optional), potentially with newlines.'),
  templateId: z.string().describe('The ID of the resume template to consider for minor thematic adjustments if applicable (e.g., "classic", "modern"). The core content structure should remain consistent.').optional(),
});
export type GenerateWebResumeInput = z.infer<typeof GenerateWebResumeInputSchema>;

const GenerateWebResumeOutputSchema = z.object({
  nameFormatted: z.string().describe('The full name, formatted very prominently for a resume header (e.g., large, bold font, possibly all caps). Example: "JOHN DOE".'),
  contactInfoFormatted: z.string().describe('A consolidated string of contact information (Email, Phone, Address, LinkedIn, GitHub, Portfolio URLs), formatted clearly for a resume header. Use labels like "Email: ", "Phone: ", "LinkedIn: " etc. Only include fields if they have values. Information should be separated by newlines or " | " if appropriate for a single line presentation. Example for multi-line: "Email: john.doe@email.com\\nPhone: (555) 123-4567\\nLinkedIn: linkedin.com/in/johndoe".'),
  summaryContent: z.string().describe('The entire summary/objective section, formatted professionally as a paragraph. If no summary input, this should be an empty string.'),
  educationContent: z.string().describe('The entire education section, formatted professionally. Each distinct qualification (degree, institution, dates) should be on a new line or clearly separated. Details within a qualification should also be on new lines if appropriate. Example: "M.S. in Computer Science - Tech University - 2022\\nB.S. in Software Engineering - Code College - 2020".'),
  experienceContent: z.string().describe('The entire work experience section. Each job (company, role, dates) should be distinct. Responsibilities and achievements under each role MUST start with a "• " (bullet character followed by a space) and each be on a new line. Example: "Software Engineer - Innovate Corp (Jan 2021 - Present)\\n• Developed feature X achieving Y result.\\n• Led a team of Z developers."'),
  projectsContent: z.string().describe('The entire projects section. Each project should be distinct. Descriptions or bullet points under each project MUST start with a "• " (bullet character followed by a space) and each be on a new line. Example: "AI Resume Builder (Personal Project)\\n• Designed and implemented the front-end using React.\\n• Integrated AI models for content generation."'),
  skillsContent: z.string().describe('The entire skills section, formatted clearly. If input is a list, present as a list (comma-separated on one line, or each skill/category on a new line). Example: "Languages: Python, JavaScript, Java\\nTools: Docker, Kubernetes, Git".'),
  certificationsContent: z.string().describe('The entire certifications section, formatted professionally. Each certification should be on a new line. Example: "AWS Certified Developer - Associate - 2023\\nCertified Scrum Master - 2022". If none, an empty string.'),
  awardsContent: z.string().describe('The entire awards section, formatted professionally. Each award should be on a new line. Example: "Dean\'s List - Tech University - 2021\\nEmployee of the Month - Innovate Corp - Feb 2022". If none, an empty string.'),
});
export type GenerateWebResumeOutput = z.infer<typeof GenerateWebResumeOutputSchema>;

export async function generateWebResume(input: GenerateWebResumeInput): Promise<GenerateWebResumeOutput> {
  return generateWebResumeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateWebResumePrompt',
  input: {schema: GenerateWebResumeInputSchema},
  output: {schema: GenerateWebResumeOutputSchema},
  prompt: `You are an expert resume formatter.
  You will be provided with information for a person's resume, including an optional template ID like '{{{templateId}}}'.
  Your task is to format this information into clean, professional, and readable content suitable for a web page or PDF resume, strictly adhering to the output schema and formatting guidelines.
  The template ID is a hint and should not drastically change the core information structure but can inform subtle choices if applicable (though primary visual styling is handled client-side).

  Formatting Guidelines:
  - Name (nameFormatted): Present the name very prominently (e.g., large, bold, "JOHN DOE").
  - Contact Information (contactInfoFormatted):
    - Consolidate Email, Phone, Address (if any), LinkedIn URL, GitHub URL, and Portfolio URL.
    - Only include a piece of information if it's provided in the input.
    - Format clearly for a resume header. Use labels like "Email: ", "Phone: ", "LinkedIn: ". Separate items with newlines or " | " if suitable for a single line. For example: "Email: name@domain.com\\nPhone: (555) 123-4567" or "Email: name@domain.com | Phone: (555) 123-4567".
  - Summary/Objective (summaryContent): If provided, format it as a professional paragraph. If empty, return an empty string.
  - Education (educationContent): Format each entry clearly (e.g., "Degree Name - Institution Name - Graduation Year"). Use newlines to separate distinct educational qualifications.
  - Experience (experienceContent): For each role: "Job Title - Company Name (Dates of Employment)".
    - Responsibilities/Achievements: Under each role, EACH bullet point MUST start with "• " (a bullet character followed by a space) and be on its OWN NEW LINE.
  - Projects (projectsContent): For each project: "Project Name (Dates/Context if any)".
    - Description/Bullet Points: Under each project, EACH bullet point MUST start with "• " (a bullet character followed by a space) and be on its OWN NEW LINE.
  - Skills (skillsContent): Format the skills list clearly. Can be comma-separated, or use newlines for categories/groups (e.g., "Programming: Java, Python\\nDatabases: SQL, MongoDB").
  - Certifications (certificationsContent): List each certification on a new line (e.g., "Certification Name - Issuing Body - Year"). If empty, return an empty string.
  - Awards (awardsContent): List each award on a new line (e.g., "Award Name - Institution - Year"). If empty, return an empty string.

  Raw Resume Information:
  Name: {{{name}}}
  Email: {{{email}}}
  Phone: {{{phone}}}
  Address: {{{address}}}
  LinkedIn URL: {{{linkedinUrl}}}
  GitHub URL: {{{githubUrl}}}
  Portfolio URL: {{{portfolioUrl}}}
  Summary: {{{summary}}}
  Education: {{{education}}}
  Experience: {{{experience}}}
  Projects: {{{projects}}}
  Skills: {{{skills}}}
  Certifications: {{{certifications}}}
  Awards: {{{awards}}}
  (Template hint: {{{templateId}}})

  Based on this information, generate the formatted content for each section according to the output schema.
  CRITICALLY: For 'experienceContent' and 'projectsContent', ensure every line that represents a responsibility, achievement, or project detail starts with "• " and is on a new line. Do not group multiple bullet points on the same line.

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
