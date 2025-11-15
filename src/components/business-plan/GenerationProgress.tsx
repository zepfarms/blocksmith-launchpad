import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Check, Loader2 } from "lucide-react";

interface GenerationProgressProps {
  sections: {
    name: string;
    status: 'pending' | 'generating' | 'complete';
  }[];
}

export const GenerationProgress = ({ sections }: GenerationProgressProps) => {
  const completedCount = sections.filter(s => s.status === 'complete').length;
  const progress = (completedCount / sections.length) * 100;

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">🤖 Generating Your Business Plan</CardTitle>
        <CardDescription>This may take 30-60 seconds...</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Progress value={progress} className="h-3" />
        
        <div className="space-y-3">
          {sections.map((section, index) => (
            <div key={index} className="flex items-center gap-3 p-3 rounded-lg border bg-card">
              {section.status === 'complete' ? (
                <Check className="h-5 w-5 text-acari-green flex-shrink-0" />
              ) : section.status === 'generating' ? (
                <Loader2 className="h-5 w-5 animate-spin text-acari-green flex-shrink-0" />
              ) : (
                <div className="h-5 w-5 rounded-full border-2 border-muted flex-shrink-0" />
              )}
              <span className={section.status === 'complete' ? 'text-muted-foreground' : 'font-medium'}>
                {section.name}
              </span>
            </div>
          ))}
        </div>

        <div className="text-center text-sm text-muted-foreground">
          {completedCount} of {sections.length} sections complete
        </div>
      </CardContent>
    </Card>
  );
};
