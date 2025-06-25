
"use server";

import { phraseResumeContent, type PhraseResumeContentInput, type PhraseResumeContentOutput } from "@/ai/flows/phrase-resume-content";
import { generateWebResume, type GenerateWebResumeInput, type GenerateWebResumeOutput } from "@/ai/flows/generate-web-resume";
import { scoreResume, type ScoreResumeInput } from "@/ai/flows/score-resume";
import { parseResumeText, type ParseResumeTextInput, type ParseResumeTextOutput } from "@/ai/flows/parse-resume-text";
import type { ResumeData } from "@/lib/types";

export async function phraseContentAction(input: ResumeData): Promise<ResumeData | { error: string }> {
  try {
    // Validate and prepare input for the AI flow
    const flowInput: PhraseResumeContentInput = {
      name: input.name || "",
      email: input.email || "",
      phone: input.phone || "",
      address: input.address || "",
      linkedinUrl: input.linkedinUrl || "",
      githubUrl: input.githubUrl || "",
      portfolioUrl: input.portfolioUrl || "",
      summary: input.summary || "",
      education: input.education || "",
      experience: input.experience || "",
      projects: input.projects || "",
      skills: input.skills || "",
      certifications: input.certifications || "",
      awards: input.awards || "",
      // template is not directly phrased, but other fields are
    };
    const result: PhraseResumeContentOutput = await phraseResumeContent(flowInput);
    if (result.phrasedContent) {
      // Preserve template from original input
      return { ...result.phrasedContent, template: input.template };
    }
    return { error: "Failed to get phrased content from AI." };
  } catch (e) {
    console.error("Error in phraseContentAction:", e);
    return { error: e instanceof Error ? e.message : "An unknown error occurred while phrasing content." };
  }
}

export async function generateWebResumeAction(input: ResumeData): Promise<GenerateWebResumeOutput | { error: string }> {
  try {
    const flowInput: GenerateWebResumeInput = {
      name: input.name || "",
      email: input.email || "",
      phone: input.phone || "",
      address: input.address || "",
      linkedinUrl: input.linkedinUrl || "",
      githubUrl: input.githubUrl || "",
      portfolioUrl: input.portfolioUrl || "",
      summary: input.summary || "",
      education: input.education || "",
      experience: input.experience || "",
      projects: input.projects || "",
      skills: input.skills || "",
      certifications: input.certifications || "",
      awards: input.awards || "",
      templateId: input.template || "classic", // Pass template to AI flow
    };
    const result = await generateWebResume(flowInput);
    return result; 
  } catch (e) {
    console.error("Error in generateWebResumeAction:", e);
    return { error: e instanceof Error ? e.message : "An unknown error occurred while generating resume content." };
  }
}

export async function scoreResumeAction(resumeText: string, jobDescription: string): Promise<{ score: number; justification: string } | { error: string }> {
  try {
    if (!resumeText.trim()) return { error: "Resume content cannot be empty for scoring." };
    if (!jobDescription.trim()) return { error: "Job description cannot be empty for scoring." };
    
    const input: ScoreResumeInput = { resumeText, jobDescription };
    const result = await scoreResume(input);
    if (typeof result.score === 'number' && result.justification) {
      return { score: result.score, justification: result.justification };
    }
    return { error: "Failed to get score from AI. Ensure API quotas are not exceeded." };
  } catch (e) {
    console.error("Error in scoreResumeAction:", e);
    return { error: e instanceof Error ? e.message : "An unknown error occurred while scoring resume." };
  }
}

export async function parseResumeTextAction(resumeText: string): Promise<ResumeData | { error: string }> {
  try {
    if (!resumeText.trim()) {
      return { error: "Uploaded resume text cannot be empty for parsing." };
    }
    const input: ParseResumeTextInput = { resumeText };
    const result: ParseResumeTextOutput = await parseResumeText(input);

    if (result.parsedData) {
      const ensureString = (value: unknown): string => (typeof value === 'string' ? value : "");
      return {
        name: ensureString(result.parsedData.name),
        email: ensureString(result.parsedData.email),
        phone: ensureString(result.parsedData.phone),
        address: ensureString(result.parsedData.address),
        linkedinUrl: ensureString(result.parsedData.linkedinUrl),
        githubUrl: ensureString(result.parsedData.githubUrl),
        portfolioUrl: ensureString(result.parsedData.portfolioUrl),
        summary: ensureString(result.parsedData.summary),
        education: ensureString(result.parsedData.education),
        experience: ensureString(result.parsedData.experience),
        projects: ensureString(result.parsedData.projects),
        skills: ensureString(result.parsedData.skills),
        certifications: ensureString(result.parsedData.certifications),
        awards: ensureString(result.parsedData.awards),
        template: 'classic', // Default template when parsing
      };
    }
    return { error: "Failed to get parsed data from AI." };
  } catch (e) {
    console.error("Error in parseResumeTextAction:", e);
    return { error: e instanceof Error ? e.message : "An unknown error occurred while parsing resume text." };
  }
}
