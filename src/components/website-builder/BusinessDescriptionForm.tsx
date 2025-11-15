import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface BusinessDescriptionFormProps {
  businessName: string;
  industry: string;
  description: string;
  onBusinessNameChange: (name: string) => void;
  onIndustryChange: (industry: string) => void;
  onDescriptionChange: (description: string) => void;
  onGenerateContent: (content: any) => void;
}

export const BusinessDescriptionForm = ({
  businessName,
  industry,
  description,
  onBusinessNameChange,
  onIndustryChange,
  onDescriptionChange,
  onGenerateContent,
}: BusinessDescriptionFormProps) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateContent = async () => {
    if (!businessName.trim() || !description.trim()) {
      toast.error("Please fill in your business name and description");
      return;
    }

    setIsGenerating(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        'generate-website-content',
        {
          body: {
            businessName,
            industry,
            businessDescription: description,
          },
        }
      );

      if (error) throw error;

      if (data?.content) {
        onGenerateContent(data.content);
        toast.success("Content generated successfully!");
      }
    } catch (error) {
      console.error('Error generating content:', error);
      toast.error("Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="space-y-2">
        <Label htmlFor="businessName">Business Name *</Label>
        <Input
          id="businessName"
          placeholder="e.g., ABC Plumbing Services"
          value={businessName}
          onChange={(e) => onBusinessNameChange(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="industry">Industry</Label>
        <Input
          id="industry"
          placeholder="e.g., Plumbing, Restaurant, Salon"
          value={industry}
          onChange={(e) => onIndustryChange(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Business Description *</Label>
        <Textarea
          id="description"
          placeholder="Tell us about your business in 2-3 sentences. What services do you offer? What makes you unique?"
          rows={5}
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
        />
        <p className="text-sm text-muted-foreground">
          Our AI will use this to create professional content for your website
        </p>
      </div>

      <Button
        onClick={handleGenerateContent}
        disabled={isGenerating || !businessName.trim() || !description.trim()}
        size="lg"
        className="w-full"
      >
        {isGenerating ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Generating Your Website Content...
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-5 w-5" />
            Generate Website Content with AI
          </>
        )}
      </Button>
    </div>
  );
};
