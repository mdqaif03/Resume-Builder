
"use client";

import type { ResumeData } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Bot, FileSignature, Eraser, Loader2, ScanText, LayoutGrid } from "lucide-react"; // Removed UploadCloud as direct file upload for parsing isn't the primary focus here.
import React from "react";

interface ResumeFormProps {
  resumeData: ResumeData;
  onResumeDataChange: (fieldName: keyof ResumeData, value: string) => void;
  onPhraseContent: () => Promise<void>;
  onGenerateWebResume: () => Promise<void>;
  onClearForm: () => void;
  isPhrasing: boolean;
  isGenerating: boolean;
  uploadedResumeText: string | null;
  onUploadedResumeTextChange: (text: string) => void;
  handleFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onParseUploadedResume: () => Promise<void>;
  isParsingUploaded: boolean;
}

const formSections: Array<{ id: keyof ResumeData; label: string; placeholder: string; isTextarea?: boolean; rows?: number }> = [
  { id: "name", label: "Full Name", placeholder: "e.g., Jane Doe" },
  { id: "email", label: "Email Address", placeholder: "e.g., jane.doe@email.com" },
  { id: "phone", label: "Phone Number", placeholder: "e.g., (555) 123-4567" },
  { id: "address", label: "Address (Optional)", placeholder: "e.g., 123 Main St, Anytown, USA", isTextarea: true, rows: 2 },
  { id: "linkedinUrl", label: "LinkedIn Profile URL (Optional)", placeholder: "e.g., linkedin.com/in/janedoe" },
  { id: "githubUrl", label: "GitHub Profile URL (Optional)", placeholder: "e.g., github.com/janedoe" },
  { id: "portfolioUrl", label: "Portfolio URL (Optional)", placeholder: "e.g., janedoe.com" },
  { id: "summary", label: "Summary / Objective (Optional)", placeholder: "e.g., Highly motivated software engineer seeking a challenging role...", isTextarea: true, rows: 4 },
  { id: "education", label: "Education", placeholder: "e.g., M.S. Computer Science, University of Example (2020-2022)\nB.S. Software Engineering, Example College (2016-2020)", isTextarea: true, rows: 5 },
  { id: "experience", label: "Work Experience", placeholder: "e.g., Software Engineer, Tech Corp (2022-Present)\n- Developed amazing features...\nIntern, Startup Inc (2019-2020)\n- Learned a lot...", isTextarea: true, rows: 7 },
  { id: "projects", label: "Projects", placeholder: "e.g., AI Resume Builder (2023)\n- Built a cool app with Next.js and AI...\nPersonal Portfolio Website (2022)\n- Showcased my skills...", isTextarea: true, rows: 5 },
  { id: "skills", label: "Skills", placeholder: "e.g., JavaScript, React, Next.js, Python, Tailwind CSS, Problem Solving, Teamwork", isTextarea: true, rows: 4 },
  { id: "certifications", label: "Certifications / Licenses (Optional)", placeholder: "e.g., Certified Kubernetes Administrator (CKA) - 2023\nAWS Certified Solutions Architect - Associate - 2022", isTextarea: true, rows: 3 },
  { id: "awards", label: "Awards / Honors (Optional)", placeholder: "e.g., Dean's List - Example College (2018, 2019)\nEmployee of the Month - Tech Corp (2023)", isTextarea: true, rows: 3 },
];

export function ResumeForm({
  resumeData,
  onResumeDataChange,
  onPhraseContent,
  onGenerateWebResume,
  onClearForm,
  isPhrasing,
  isGenerating,
  uploadedResumeText,
  onUploadedResumeTextChange,
  handleFileUpload,
  onParseUploadedResume,
  isParsingUploaded,
}: ResumeFormProps) {
  
  return (
    <Card className="w-full shadow-xl print:shadow-none">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Create Your Resume</CardTitle>
        <CardDescription>Fill in your details, or upload an existing resume. Use AI to enhance and preview with different templates.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Label htmlFor="template-select" className="font-semibold text-lg flex items-center mb-2">
            <LayoutGrid className="mr-2 h-5 w-5 text-primary" />
            Choose Template
          </Label>
          <Select
            value={resumeData.template}
            onValueChange={(value) => onResumeDataChange('template', value as ResumeData['template'])}
          >
            <SelectTrigger id="template-select" className="w-full text-sm">
              <SelectValue placeholder="Select a template" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="classic">Classic</SelectItem>
              <SelectItem value="modern">Modern</SelectItem>
              <SelectItem value="elegant">Elegant</SelectItem>
              <SelectItem value="creative">Creative</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
          {formSections.map((section, index) => (
            <AccordionItem value={`item-${index}`} key={section.id}>
              <AccordionTrigger className="text-lg hover:text-accent font-semibold">{section.label}</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 p-1">
                  <Label htmlFor={section.id} className="sr-only">
                    {section.label}
                  </Label>
                  {section.isTextarea ? (
                    <Textarea
                      id={section.id}
                      value={resumeData[section.id]}
                      onChange={(e) => onResumeDataChange(section.id, e.target.value)}
                      placeholder={section.placeholder}
                      rows={section.rows || 5}
                      className="text-sm"
                    />
                  ) : (
                    <Input
                      id={section.id}
                      type={section.id.includes("Url") ? "url" : section.id === "email" ? "email" : "text"}
                      value={resumeData[section.id]}
                      onChange={(e) => onResumeDataChange(section.id, e.target.value)}
                      placeholder={section.placeholder}
                      className="text-sm"
                    />
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-6 space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button onClick={onPhraseContent} disabled={isPhrasing || isParsingUploaded || isGenerating} className="flex-grow bg-accent hover:bg-accent/90">
              {isPhrasing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Bot className="mr-2 h-4 w-4" />}
              Enhance with AI
            </Button>
            <Button onClick={onGenerateWebResume} disabled={isGenerating || isParsingUploaded || isPhrasing} className="flex-grow">
              {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileSignature className="mr-2 h-4 w-4" />}
              Preview Resume
            </Button>
            <Button onClick={onClearForm} variant="outline" className="flex-grow" disabled={isPhrasing || isGenerating || isParsingUploaded}>
              <Eraser className="mr-2 h-4 w-4" /> Clear Form
            </Button>
          </div>

          <div className="mt-6 border-t pt-6">
            <h3 className="text-lg font-headline font-semibold mb-2">Upload Existing Resume (Text)</h3>
            <Input id="resume-upload-input" type="file" accept=".txt,.md,text/plain,text/markdown" onChange={handleFileUpload} className="mb-2 text-sm" />
            <p className="text-xs text-muted-foreground mb-2">
              For best results, upload plain text files (.txt, .md) or paste text copied from your existing resume.
              Direct Word/PDF parsing is not yet supported.
            </p>
            {uploadedResumeText && (
              <>
                <Textarea
                  value={uploadedResumeText}
                  onChange={(e) => onUploadedResumeTextChange(e.target.value)}
                  placeholder="Uploaded resume content will appear here. You can edit it or copy parts to the form above."
                  rows={8}
                  className="text-sm mt-2"
                  aria-label="Uploaded resume content"
                />
                <Button
                  onClick={onParseUploadedResume}
                  disabled={isParsingUploaded || !uploadedResumeText.trim() || isPhrasing || isGenerating}
                  className="w-full mt-2"
                  variant="secondary"
                >
                  {isParsingUploaded ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ScanText className="mr-2 h-4 w-4" />}
                  Import Uploaded Resume to Form
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
