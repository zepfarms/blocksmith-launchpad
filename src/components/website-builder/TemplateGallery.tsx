import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, ExternalLink } from "lucide-react";
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
  const handlePreview = (livePreviewUrl?: string) => {
    if (livePreviewUrl) {
      window.open(livePreviewUrl, '_blank');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`transition-all hover:shadow-lg ${
              selectedTemplateId === template.id
                ? 'ring-2 ring-primary'
                : ''
            }`}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-semibold text-lg mb-1">{template.name}</h3>
                  <Badge variant="secondary" className="mb-2">
                    {template.category}
                  </Badge>
                </div>
                {selectedTemplateId === template.id && (
                  <div className="bg-primary text-primary-foreground rounded-full p-1">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">
                {template.description}
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {template.colorScheme.map((color, index) => (
                  <div
                    key={index}
                    className="w-6 h-6 rounded-full border border-border"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              <div className="text-xs text-muted-foreground mb-4">
                {template.features.length} features included
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePreview(template.livePreviewUrl);
                  }}
                  disabled={!template.livePreviewUrl}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Preview
                </Button>
                <Button
                  size="sm"
                  className="flex-1"
                  variant={selectedTemplateId === template.id ? "default" : "secondary"}
                  onClick={() => onSelectTemplate(template.id)}
                >
                  {selectedTemplateId === template.id ? "Selected" : "Select"}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
  );
};
