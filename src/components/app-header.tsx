import { FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AppHeaderProps {
  className?: string;
}

export function AppHeader({ className }: AppHeaderProps) {
  return (
    <header className={cn("bg-primary text-primary-foreground p-4 shadow-md", className)}>
      <div className="container mx-auto flex items-center">
        <FileText className="h-8 w-8 mr-3" />
        <h1 className="text-3xl font-headline font-bold">PrepOrbit-ResumeBuilder</h1>
      </div>
    </header>
  );
}
