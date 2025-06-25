
import { config } from 'dotenv';
config();

import '@/ai/flows/score-resume.ts';
import '@/ai/flows/generate-web-resume.ts';
import '@/ai/flows/phrase-resume-content.ts';
import '@/ai/flows/parse-resume-text.ts';
// Removed generate-latex-resume.ts as it's replaced by generate-web-resume.ts
