
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { ResumeData } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to concatenate resume data into a single string for scoring
export function concatenateResumeData(resumeData: ResumeData): string {
  const sections = [
    `Name: ${resumeData.name}`,
    `Email: ${resumeData.email}`,
    `Phone: ${resumeData.phone}`,
    resumeData.address ? `Address: ${resumeData.address}` : "",
    resumeData.linkedinUrl ? `LinkedIn: ${resumeData.linkedinUrl}` : "",
    resumeData.githubUrl ? `GitHub: ${resumeData.githubUrl}` : "",
    resumeData.portfolioUrl ? `Portfolio: ${resumeData.portfolioUrl}` : "",
    resumeData.summary ? `\nSummary:\n${resumeData.summary}` : "",
    `\nEducation:\n${resumeData.education}`,
    `\nExperience:\n${resumeData.experience}`,
    `\nProjects:\n${resumeData.projects}`,
    `\nSkills:\n${resumeData.skills}`,
    resumeData.certifications ? `\nCertifications:\n${resumeData.certifications}` : "",
    resumeData.awards ? `\nAwards:\n${resumeData.awards}` : "",
  ];
  return sections.filter(Boolean).join("\n").trim();
}
