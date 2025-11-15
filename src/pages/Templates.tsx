import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, Eye } from "lucide-react";
import { websiteTemplates, WebsiteTemplate } from "@/data/websiteTemplates";
import { Header } from "@/components/Header";
import { TemplatePreviewModal } from "@/components/website-builder/TemplatePreviewModal";

export default function Templates() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [previewTemplate, setPreviewTemplate] = useState<WebsiteTemplate | null>(null);
  const navigate = useNavigate();
  
  const categories = ["all", ...Array.from(new Set(websiteTemplates.map(t => t.category)))];
  const filteredTemplates = selectedCategory === "all" 
    ? websiteTemplates 
    : websiteTemplates.filter(t => t.category === selectedCategory);

  const handleUseTemplate = (templateId: string) => {
    navigate(`/dashboard/website-builder?template=${templateId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        
        <div className="relative max-w-7xl mx-auto">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="mb-8 rounded-full"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
              Website Templates
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose from our professionally designed templates, each tailored for different industries and customizable to match your brand.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="px-4 pb-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className="rounded-full"
              >
                {category === "all" ? "All Templates" : category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template) => (
              <Card 
                key={template.id}
                className="group hover:shadow-2xl hover:scale-105 transition-all duration-300 border-border bg-card overflow-hidden flex flex-col"
              >
                <CardHeader>
                  {/* Template Icon/Preview */}
                  <div className="w-full h-48 rounded-lg bg-gradient-to-br from-muted/50 to-muted/20 border border-border flex items-center justify-center text-6xl mb-4 group-hover:scale-110 transition-transform">
                    {template.previewImage}
                  </div>

                  <div className="flex items-start justify-between gap-2 mb-2">
                    <CardTitle className="text-xl">{template.name}</CardTitle>
                    <Badge variant="outline" className="text-xs shrink-0">
                      {template.category}
                    </Badge>
                  </div>

                  <CardDescription className="text-sm">
                    {template.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 flex-1">
                  {/* Color Scheme Preview */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Colors:</span>
                    <div className="flex gap-1">
                      <div 
                        className="w-6 h-6 rounded-full border border-border"
                        style={{ backgroundColor: template.colorScheme.primary }}
                      />
                      <div 
                        className="w-6 h-6 rounded-full border border-border"
                        style={{ backgroundColor: template.colorScheme.secondary }}
                      />
                      <div 
                        className="w-6 h-6 rounded-full border border-border"
                        style={{ backgroundColor: template.colorScheme.accent }}
                      />
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground">Includes:</p>
                    <div className="flex flex-wrap gap-1">
                      {template.features.map((feature, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => setPreviewTemplate(template)}
                    className="flex-1 rounded-full"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                  <Button 
                    onClick={() => handleUseTemplate(template.id)}
                    className="flex-1 rounded-full"
                  >
                    Use Template
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Build Your Website?</h2>
          <p className="text-muted-foreground mb-8">
            Get started with our website builder and customize your chosen template to perfection.
          </p>
          <Button 
            onClick={() => navigate('/dashboard/website-builder')}
            size="lg"
            className="rounded-full"
          >
            Go to Website Builder
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Template Preview Modal */}
      <TemplatePreviewModal
        template={previewTemplate}
        isOpen={!!previewTemplate}
        onClose={() => setPreviewTemplate(null)}
      />
    </div>
  );
}
