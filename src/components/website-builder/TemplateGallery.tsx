import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {templates.map((template, idx) => (
        <Card 
          key={template.id}
          className="group relative hover:shadow-premium transition-all duration-500 border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col"
          style={{ animationDelay: `${idx * 100}ms` }}
        >
          {/* Premium hover glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-accent/0 group-hover:from-primary/10 group-hover:via-accent/5 group-hover:to-primary/10 transition-all duration-500 pointer-events-none" />
          
          <CardHeader className="relative">
            {/* Live Preview Badge */}
            {template.livePreviewUrl && (
              <Badge 
                variant="outline" 
                className="absolute top-4 right-4 z-10 bg-primary/90 text-primary-foreground border-primary animate-pulse"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Live Demo
              </Badge>
            )}

            {/* Template Preview Area - Now with gradient placeholder */}
            <div 
              className="w-full h-56 rounded-lg border border-border overflow-hidden mb-4 cursor-pointer relative group/preview"
              onClick={() => handlePreview(template.livePreviewUrl)}
            >
              {/* Premium gradient background as placeholder */}
              <div 
                className="absolute inset-0 transition-all duration-700 group-hover/preview:scale-110"
                style={{
                  background: `linear-gradient(135deg, ${template.colorScheme[0]}20, ${template.colorScheme[1]}20, ${template.colorScheme[2] || template.colorScheme[0]}20)`
                }}
              />
              
              {/* Template name overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover/preview:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div className="text-white">
                  <p className="text-sm font-medium mb-1">Click to view live demo</p>
                  <p className="text-xs text-white/70">{template.livePreviewUrl || 'Preview coming soon'}</p>
                </div>
              </div>

              {/* Center icon hint */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/preview:opacity-100 transition-opacity duration-300">
                <div className="bg-primary text-primary-foreground rounded-full p-4 shadow-neon">
                  <ExternalLink className="w-8 h-8" />
                </div>
              </div>
            </div>

            <div className="flex items-start justify-between gap-2 mb-3">
              <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                {template.name}
              </CardTitle>
              <Badge variant="secondary" className="text-xs shrink-0 rounded-full">
                {template.category}
              </Badge>
            </div>

            <CardDescription className="text-base leading-relaxed">
              {template.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6 flex-1 relative">
            {/* Color Scheme Preview */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-muted-foreground">Colors:</span>
              <div className="flex gap-2">
                {template.colorScheme.map((color, colorIndex) => (
                  <div 
                    key={colorIndex}
                    className="w-8 h-8 rounded-full border-2 border-border shadow-md hover:scale-110 transition-transform cursor-pointer"
                    style={{ backgroundColor: color }}
                    title={color}
                  />
                ))}
              </div>
            </div>

            {/* Features List */}
            <div className="space-y-3">
              <p className="text-sm font-semibold text-foreground">Includes:</p>
              <div className="flex flex-wrap gap-2">
                {template.features.slice(0, 4).map((feature, idx) => (
                  <Badge 
                    key={idx} 
                    variant="outline" 
                    className="text-xs bg-muted/50 hover:bg-muted transition-colors"
                  >
                    {feature}
                  </Badge>
                ))}
                {template.features.length > 4 && (
                  <Badge variant="outline" className="text-xs bg-primary/10 text-primary">
                    +{template.features.length - 4} more
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col sm:flex-row gap-3 pt-6 relative">
            <Button 
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                handlePreview(template.livePreviewUrl);
              }}
              className="flex-1 rounded-full hover:shadow-neon transition-all"
              disabled={!template.livePreviewUrl}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              {template.livePreviewUrl ? 'View Live' : 'Coming Soon'}
            </Button>
            <Button 
              onClick={() => onSelectTemplate(template.id)}
              className="flex-1 rounded-full shadow-neon hover:shadow-neon hover:scale-105 transition-all"
              variant={selectedTemplateId === template.id ? "default" : "secondary"}
            >
              {selectedTemplateId === template.id ? (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  Selected
                </>
              ) : (
                'Use Template'
              )}
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
