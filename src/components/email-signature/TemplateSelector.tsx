import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TemplateSelectorProps {
  selected: string;
  onChange: (template: string) => void;
}

const templates = [
  { id: 'classic', name: 'Classic Professional', description: 'Traditional layout with photo and contact details' },
  { id: 'modern', name: 'Modern Minimal', description: 'Clean and contemporary design' },
  { id: 'creative', name: 'Creative Card', description: 'Eye-catching card-style layout' },
  { id: 'compact', name: 'Compact', description: 'Space-efficient single-line format' },
  { id: 'banner', name: 'Banner Style', description: 'Bold header with branded banner' },
];

export const TemplateSelector = ({ selected, onChange }: TemplateSelectorProps) => {
  return (
    <div className="grid grid-cols-1 gap-3">
      {templates.map((template) => (
        <Card
          key={template.id}
          className={cn(
            "p-4 cursor-pointer transition-all hover:shadow-md",
            selected === template.id && "border-primary shadow-md"
          )}
          onClick={() => onChange(template.id)}
        >
          <h3 className="font-semibold">{template.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
        </Card>
      ))}
    </div>
  );
};