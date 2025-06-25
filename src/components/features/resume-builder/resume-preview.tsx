
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Printer, Loader2, Info } from "lucide-react";
import type { GenerateWebResumeOutput } from "@/ai/flows/generate-web-resume";
import { cn } from "@/lib/utils";
import type { ResumeData } from "@/lib/types";

interface ResumePreviewProps {
  resumeContent: GenerateWebResumeOutput | null;
  isLoading: boolean;
  template: ResumeData['template']; // Receive selected template
}

const ResumeSection = ({ title, content, template }: { title: string; content: string | undefined; template: ResumeData['template'] }) => {
  if (!content || content.trim() === "") return null;

  const renderContent = () => {
    // Basic link detection - replace http(s):// strings with <a> tags
    const linkify = (text: string) => {
      const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
      let linkedText = text.replace(urlRegex, (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">${url}</a>`);
      if (template === 'creative') {
        linkedText = text.replace(urlRegex, (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-accent hover:underline">${url}</a>`);
      }
      return linkedText;
    };
    

    return content.split('\n').map((line, index) => {
       const isBullet = line.trim().startsWith("• ");
       const lineContent = isBullet ? line.trim().substring(2) : line.trim();
       const dangerousHtml = linkify(lineContent);

      if (isBullet) {
        return (
          <div key={index} className="flex print:text-xs print:mb-px">
            <span className="mr-2 print:mr-1">•</span>
            <p className="text-sm mb-0.5 print:text-xs print:mb-px flex-1" dangerouslySetInnerHTML={{ __html: dangerousHtml }} />
          </div>
        );
      }
      return (
        <p key={index} className="text-sm mb-0.5 print:text-xs print:mb-px" dangerouslySetInnerHTML={{ __html: dangerousHtml }} />
      );
    });
  };

  return (
    // Section title styling is now primarily handled by global CSS template classes
    <section className="mb-4 print:mb-3">
      <h2 className={cn(
        // Common base styles for section titles, specific styles in global.css per template
        "pb-1 mb-2 print:text-base print:border-gray-600 print:text-black",
      )}>
        {title} 
      </h2>
      <div className={cn(
          "prose prose-sm max-w-none print:prose-xs",
        )}>
        {renderContent()}
      </div>
    </section>
  );
};

export function ResumePreview({ resumeContent, isLoading, template }: ResumePreviewProps) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <Card className={cn(
        "shadow-xl h-full flex flex-col",
        "printable-area", 
        "print:shadow-none print:border-none print:m-0 print:p-0 print:bg-white" 
      )}>
      <CardHeader className="print-hidden card-header-print-hidden">
        <CardTitle className="text-2xl font-headline">Resume Preview</CardTitle>
        <CardDescription>
          {isLoading 
            ? "Generating your resume preview..." 
            : resumeContent 
            ? "Your formatted resume is below. Use 'Print to PDF' to save or print it."
            : "Fill the form and click 'Preview Resume' to see your formatted resume here."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col overflow-hidden print:p-0 print:m-0 print:overflow-visible">
        {resumeContent && !isLoading && (
          <Button onClick={handlePrint} className="mb-4 w-full print-hidden bg-primary hover:bg-primary/90">
            <Printer className="mr-2 h-4 w-4" /> Print to PDF
          </Button>
        )}
        <ScrollArea className="flex-grow rounded-md border bg-muted/20 print:border-none print:bg-transparent scroll-area-print-expanded print:overflow-visible">
          {isLoading ? (
            <div className="flex items-center justify-center h-full p-6">
              <Loader2 className="h-16 w-16 text-primary animate-spin" />
              <p className="ml-4 text-muted-foreground">Generating preview...</p>
            </div>
          ) : resumeContent ? (
            <div className={cn(
                "p-6 bg-white printable-resume", // Base class for printing
                `template-${template}` // Apply template class dynamically for specific styles
              )}
            >
              <header className="text-center mb-6 print:mb-4">
                {resumeContent.nameFormatted && (
                  // Specific h1 styling now comes from global .template-X h1 rules
                  <h1 className={cn(
                    "font-headline" // Keep this as a base if needed, or rely purely on globals
                  )}>{resumeContent.nameFormatted}</h1>
                )}
                {resumeContent.contactInfoFormatted && (
                  // Specific contact div styling from global .template-X header > div
                  <div className={cn(
                    "mt-1 space-y-0.5 print:text-xs print:text-black",
                  )}>
                     {resumeContent.contactInfoFormatted.split('\\n').map((line, index)=>(
                        <p key={index} dangerouslySetInnerHTML={{ __html: line.trim().replace(/ \| /g, ' <span class="mx-1 print:mx-0.5">|</span> ') }} />
                     ))}
                  </div>
                )}
              </header>
              
              <ResumeSection title="Summary" content={resumeContent.summaryContent} template={template} />
              <ResumeSection title="Experience" content={resumeContent.experienceContent} template={template} />
              <ResumeSection title="Education" content={resumeContent.educationContent} template={template} />
              <ResumeSection title="Projects" content={resumeContent.projectsContent} template={template} />
              <ResumeSection title="Skills" content={resumeContent.skillsContent} template={template} />
              <ResumeSection title="Certifications" content={resumeContent.certificationsContent} template={template} />
              <ResumeSection title="Awards" content={resumeContent.awardsContent} template={template} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-10 text-center">
              <Info className="h-16 w-16 mb-4 text-primary/50" />
              <p className="font-semibold text-lg">Resume Preview Area</p>
              <p className="text-sm">Your generated resume will appear here.</p>
              <p className="text-xs mt-2">Fill in the form on the left and click "Preview Resume".</p>
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
