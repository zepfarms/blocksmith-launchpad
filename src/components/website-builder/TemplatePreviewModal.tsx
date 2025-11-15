import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, ArrowRight, Sparkles, Palette, Smartphone, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { WebsiteTemplate } from "@/data/websiteTemplates";

interface TemplatePreviewModalProps {
  template: WebsiteTemplate | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TemplatePreviewModal = ({
  template,
  isOpen,
  onClose,
}: TemplatePreviewModalProps) => {
  const navigate = useNavigate();

  if (!template) return null;

  const handleUseTemplate = () => {
    navigate(`/dashboard/website-builder?template=${template.id}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 gap-0 bg-background border-border overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-card">
          <div className="flex items-center gap-4">
            <div className="text-5xl">{template.previewImage}</div>
            <div>
              <Badge variant="secondary" className="mb-2">{template.category}</Badge>
              <h2 className="text-2xl font-bold">{template.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Template Mockup */}
          <div className="rounded-lg border border-border overflow-hidden bg-background mb-6">
            {/* Hero Section */}
            <div 
              className="p-12 text-center"
              style={{ 
                background: `linear-gradient(135deg, ${template.colorScheme.primary}, ${template.colorScheme.secondary})` 
              }}
            >
              <h1 className="text-4xl font-bold text-white mb-4">Your Business Name</h1>
              <p className="text-xl text-white/90 mb-6">Compelling headline that captures your unique value proposition</p>
              <div className="inline-block px-8 py-3 bg-white/20 backdrop-blur-sm rounded-full text-white font-semibold">
                Get Started
              </div>
            </div>

            {/* Services Section */}
            <div className="p-12 bg-card">
              <h2 className="text-3xl font-bold text-center mb-8">What We Offer</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div 
                    key={i} 
                    className="p-6 rounded-lg border border-border bg-background"
                  >
                    <div 
                      className="w-12 h-12 rounded-lg mb-4"
                      style={{ backgroundColor: template.colorScheme.accent }}
                    />
                    <h3 className="text-xl font-semibold mb-2">Service {i}</h3>
                    <p className="text-muted-foreground">Description of this service and how it benefits your customers.</p>
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Section */}
            <div 
              className="p-12 text-center"
              style={{ backgroundColor: template.colorScheme.accent }}
            >
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
              <p className="text-white/90 mb-6">Contact us today to learn more</p>
              <div className="inline-block px-8 py-3 bg-white rounded-full text-gray-900 font-semibold">
                Contact Us
              </div>
            </div>
          </div>

          {/* Features Included */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-lg bg-card border border-border">
              <div className="flex items-center gap-3 mb-2">
                <Sparkles className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">AI-Powered Content</h3>
              </div>
              <p className="text-sm text-muted-foreground">All templates include AI-generated content tailored to your business</p>
            </div>
            <div className="p-4 rounded-lg bg-card border border-border">
              <div className="flex items-center gap-3 mb-2">
                <Palette className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Fully Customizable</h3>
              </div>
              <p className="text-sm text-muted-foreground">Change text, images, colors, and layout after purchase</p>
            </div>
            <div className="p-4 rounded-lg bg-card border border-border">
              <div className="flex items-center gap-3 mb-2">
                <Smartphone className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Mobile-Responsive</h3>
              </div>
              <p className="text-sm text-muted-foreground">Looks perfect on all devices automatically</p>
            </div>
            <div className="p-4 rounded-lg bg-card border border-border">
              <div className="flex items-center gap-3 mb-2">
                <Zap className="h-5 w-5 text-primary" />
                <h3 className="font-semibold">Launch in Minutes</h3>
              </div>
              <p className="text-sm text-muted-foreground">Quick setup with domain + website package</p>
            </div>
          </div>

          {/* Template Features */}
          <div className="p-6 rounded-lg bg-primary/5 border border-primary/20">
            <h3 className="font-semibold mb-3">This Template Includes:</h3>
            <div className="flex flex-wrap gap-2">
              {template.features.map((feature, idx) => (
                <Badge key={idx} variant="outline" className="text-sm">
                  {feature}
                </Badge>
              ))}
            </div>
          </div>

          {/* Pricing Info */}
          <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
            <p className="text-sm text-muted-foreground">
              <strong>Pricing:</strong> $10/month with your own domain, or purchase a domain during setup for additional cost
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-border bg-card flex gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 rounded-full"
          >
            Close Preview
          </Button>
          <Button
            onClick={handleUseTemplate}
            className="flex-1 rounded-full"
          >
            Use This Template
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
