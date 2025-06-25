
"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { AppHeader } from '@/components/app-header';
import { ResumeForm } from '@/components/features/resume-builder/resume-form';
import { ResumePreview } from '@/components/features/resume-builder/resume-preview';
import { ResumeScore } from '@/components/features/resume-builder/resume-score';
import { phraseContentAction, generateWebResumeAction, parseResumeTextAction } from '@/app/actions';
import type { ResumeData } from '@/lib/types';
import { initialResumeData } from '@/lib/types';
import type { GenerateWebResumeOutput } from '@/ai/flows/generate-web-resume';
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Target, Loader2 as PageLoader } from 'lucide-react';

export default function HomePage() {
  const [resumeData, setResumeData] = useState<ResumeData>(initialResumeData);
  const [phrasedResumeData, setPhrasedResumeData] = useState<ResumeData | null>(null);
  const [webResumeContent, setWebResumeContent] = useState<GenerateWebResumeOutput | null>(null);
  const [uploadedResumeText, setUploadedResumeText] = useState<string | null>(null);
  
  const [isPhrasing, setIsPhrasing] = useState(false);
  const [isGeneratingWebResume, setIsGeneratingWebResume] = useState(false);
  const [isParsingUploaded, setIsParsingUploaded] = useState(false);
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const [isClient, setIsClient] = useState(false);
  
  const { toast } = useToast();

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
    setIsClient(true);
  }, []);

  const activeResumeData = phrasedResumeData || resumeData;

  const handleResumeDataChange = useCallback((fieldName: keyof ResumeData, value: string) => {
    setResumeData(prev => ({ ...prev, [fieldName]: value }));
    if (fieldName !== 'template' && phrasedResumeData) { // Don't clear phrased data if only template changes
        setPhrasedResumeData(null); 
    }
     // Clear preview if any relevant field changes
    if (fieldName !== 'template') {
        setWebResumeContent(null);
    }
  }, [phrasedResumeData]);

  const handleUploadedResumeTextChange = useCallback((text: string) => {
    setUploadedResumeText(text);
  }, []);

  const handlePhraseContent = async () => {
    setIsPhrasing(true);
    setWebResumeContent(null); // Clear old preview
    const result = await phraseContentAction(activeResumeData); 
    if ('error' in result) {
      toast({
        variant: "destructive",
        title: "AI Phrasing Failed",
        description: result.error,
      });
    } else {
      setPhrasedResumeData(result); 
      setResumeData(result); 
      toast({
        title: "Content Enhanced by AI",
        description: "Your resume content has been professionally phrased.",
      });
    }
    setIsPhrasing(false);
  };

  const handleGenerateWebResume = async () => {
    setIsGeneratingWebResume(true);
    const result = await generateWebResumeAction(activeResumeData);
    if ('error' in result) {
      toast({
        variant: "destructive",
        title: "Resume Generation Failed",
        description: result.error,
      });
      setWebResumeContent(null); 
    } else {
      setWebResumeContent(result);
      toast({
        title: "Resume Preview Generated",
        description: "Your formatted resume is ready for preview.",
      });
    }
    setIsGeneratingWebResume(false);
  };

  const handleClearForm = () => {
    setResumeData(initialResumeData);
    setPhrasedResumeData(null);
    setWebResumeContent(null);
    setUploadedResumeText(null);
    const fileInput = document.getElementById('resume-upload-input') as HTMLInputElement;
    if (fileInput) fileInput.value = "";

    toast({
      title: "Form Cleared",
      description: "All fields have been reset.",
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setUploadedResumeText(text);
        toast({
          title: "File Uploaded",
          description: `${file.name} has been loaded. You can use its content for scoring or import it into the form.`,
        });
      };
      reader.readAsText(file);
    }
  };

  const handleParseUploadedResume = async () => {
    if (!uploadedResumeText) {
      toast({
        variant: "destructive",
        title: "No Uploaded Text",
        description: "Please upload a resume file first.",
      });
      return;
    }
    setIsParsingUploaded(true);
    setWebResumeContent(null); // Clear old preview
    const result = await parseResumeTextAction(uploadedResumeText);
    if ('error' in result) {
      toast({
        variant: "destructive",
        title: "Parsing Failed",
        description: result.error,
      });
    } else {
      // Preserve current template or default to 'classic' if parsed data doesn't have one
      const currentTemplate = resumeData.template;
      setResumeData({...result, template: result.template || currentTemplate }); 
      setPhrasedResumeData(null); 
      toast({
        title: "Resume Imported",
        description: "Uploaded resume content has been imported into the form.",
      });
    }
    setIsParsingUploaded(false);
  };

  if (!isClient) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <AppHeader className="print-hidden" />
        <main className="flex-grow container mx-auto p-4 md:p-8 flex justify-center items-center">
          <PageLoader className="h-12 w-12 animate-spin text-primary" />
        </main>
        <footer className="text-center p-4 text-muted-foreground text-sm border-t print-hidden">
          Loading year...
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <AppHeader className="print-hidden" />
      <main className="flex-grow container mx-auto p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="lg:col-span-1 print-hidden">
            <ResumeForm
              resumeData={resumeData}
              onResumeDataChange={handleResumeDataChange}
              onPhraseContent={handlePhraseContent}
              onGenerateWebResume={handleGenerateWebResume}
              onClearForm={handleClearForm}
              isPhrasing={isPhrasing}
              isGenerating={isGeneratingWebResume}
              uploadedResumeText={uploadedResumeText}
              onUploadedResumeTextChange={handleUploadedResumeTextChange}
              handleFileUpload={handleFileUpload}
              onParseUploadedResume={handleParseUploadedResume}
              isParsingUploaded={isParsingUploaded}
            />
          </div>

          <div className="lg:col-span-1"> 
            <Tabs defaultValue="preview" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-4 print-hidden"> 
                <TabsTrigger value="preview" className="text-sm">
                  <FileText className="mr-2 h-4 w-4"/> Preview
                </TabsTrigger>
                <TabsTrigger value="score" className="text-sm">
                  <Target className="mr-2 h-4 w-4"/> Score
                </TabsTrigger>
              </TabsList>
              <TabsContent value="preview"> 
                <ResumePreview 
                  resumeContent={webResumeContent} 
                  isLoading={isGeneratingWebResume}
                  template={activeResumeData.template} // Pass selected template
                />
              </TabsContent>
              <TabsContent value="score" className="print-hidden"> 
                <ResumeScore resumeData={activeResumeData} uploadedResumeText={uploadedResumeText} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-muted-foreground text-sm border-t print-hidden">
        {currentYear !== null ? `© ${currentYear} Reimagine Vitae. Powered by AI.` : 'Loading year...'}
      </footer>
    </div>
  );
}
