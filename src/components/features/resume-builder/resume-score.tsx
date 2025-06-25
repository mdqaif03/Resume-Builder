"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { AlertCircle, Target, Loader2, CheckCircle, TrendingUp } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { scoreResumeAction } from '@/app/actions';
import { concatenateResumeData } from '@/lib/utils';
import type { ResumeData } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface ResumeScoreProps {
  resumeData: ResumeData;
  uploadedResumeText: string | null;
}

export function ResumeScore({ resumeData, uploadedResumeText }: ResumeScoreProps) {
  const [jobDescription, setJobDescription] = useState("");
  const [score, setScore] = useState<number | null>(null);
  const [justification, setJustification] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleScoreResume = async () => {
    setIsLoading(true);
    setError(null);
    setScore(null);
    setJustification(null);

    const resumeTextToScore = uploadedResumeText || concatenateResumeData(resumeData);

    if (!resumeTextToScore.trim()) {
      toast({
        variant: "destructive",
        title: "Error Scoring Resume",
        description: "Resume content is empty. Please fill the form or upload a resume.",
      });
      setIsLoading(false);
      return;
    }

    if (!jobDescription.trim()) {
       toast({
        variant: "destructive",
        title: "Error Scoring Resume",
        description: "Job description cannot be empty.",
      });
      setIsLoading(false);
      return;
    }

    const result = await scoreResumeAction(resumeTextToScore, jobDescription);
    if ('error' in result) {
      setError(result.error);
      toast({
        variant: "destructive",
        title: "Scoring Failed",
        description: result.error,
      });
    } else {
      setScore(result.score);
      setJustification(result.justification);
    }
    setIsLoading(false);
  };

  return (
    <Card className="shadow-xl h-full flex flex-col">
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Score Your Resume</CardTitle>
        <CardDescription>
          Paste a job description to see how well your resume matches.
          Uses current form data or uploaded resume if available.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 flex-grow flex flex-col">
        <div>
          <Label htmlFor="jobDescription" className="font-semibold">Job Description</Label>
          <Textarea
            id="jobDescription"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste the job description here..."
            rows={8}
            className="mt-1 text-sm"
            aria-label="Job Description for Resume Scoring"
          />
        </div>
        <Button onClick={handleScoreResume} disabled={isLoading} className="w-full bg-accent hover:bg-accent/90">
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <TrendingUp className="mr-2 h-4 w-4" />}
          Score Resume
        </Button>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {score !== null && justification !== null && (
          <div className="space-y-3 pt-4 border-t mt-4 flex-grow">
            <h3 className="text-xl font-headline font-semibold flex items-center"><Target className="mr-2 h-5 w-5 text-primary"/>Match Score: {score}/100</h3>
            <Progress value={score} aria-label={`Resume score: ${score} out of 100`} className="w-full h-3 [&>div]:bg-primary" />
            
            <Alert variant="default" className="bg-primary/5 border-primary/20">
              <CheckCircle className="h-4 w-4 text-primary" />
              <AlertTitle className="text-primary font-semibold">AI Analysis</AlertTitle>
              <AlertDescription className="text-sm text-foreground/80">
                <p className="whitespace-pre-line">{justification}</p>
              </AlertDescription>
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
