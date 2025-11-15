import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { WebsiteTemplate } from "@/data/websiteTemplates";

interface TemplateGalleryProps {
  templates: WebsiteTemplate[];
  selectedTemplateId: string | null;
  onSelectTemplate: (templateId: string) => void;
}

export const TemplateGallery = ({
  templates,
  selectedTemplateId,
  onSelectTemplate,
}: TemplateGalleryProps) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {templates.map((template) => (
        <Card
          key={template.id}
          className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
            selectedTemplateId === template.id
              ? 'border-primary border-2 shadow-lg'
              : 'hover:border-primary/50'
          }`}
          onClick={() => onSelectTemplate(template.id)}
        >
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="text-6xl">{template.previewImage}</div>
              {selectedTemplateId === template.id && (
                <div className="bg-primary text-primary-foreground rounded-full p-1">
                  <Check className="h-4 w-4" />
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Badge variant="secondary">{template.category}</Badge>
              <h3 className="text-xl font-semibold">{template.name}</h3>
              <p className="text-sm text-muted-foreground">
                {template.description}
              </p>
            </div>

            <div className="pt-4 border-t">
              <p className="text-xs font-medium mb-2">Includes:</p>
              <div className="flex flex-wrap gap-1">
                {template.features.map((feature, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
