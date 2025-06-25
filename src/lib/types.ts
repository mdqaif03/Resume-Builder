
export interface ResumeData {
  name: string;
  email: string;
  phone: string;
  address: string;
  linkedinUrl: string;
  githubUrl: string;
  portfolioUrl: string;
  summary: string;
  education: string;
  experience: string;
  projects: string;
  skills: string;
  certifications: string;
  awards: string;
  template: 'classic' | 'modern' | 'elegant' | 'creative'; // Added template options
}

// PhrasedResumeData can remain the same as ResumeData for simplicity,
// as the phrasing action will return an object with the same keys.
export type PhrasedResumeData = ResumeData;

export const initialResumeData: ResumeData = {
  name: '',
  email: '',
  phone: '',
  address: '',
  linkedinUrl: '',
  githubUrl: '',
  portfolioUrl: '',
  summary: '',
  education: '',
  experience: '',
  projects: '',
  skills: '',
  certifications: '',
  awards: '',
  template: 'classic', // Default template
};

