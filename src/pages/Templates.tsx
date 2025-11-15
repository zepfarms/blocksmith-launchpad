import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { websiteTemplates } from "@/data/websiteTemplates";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";

export default function Templates() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = ["all", ...Array.from(new Set(websiteTemplates.map(t => t.category)))];

  const filteredTemplates = selectedCategory === "all" 
    ? websiteTemplates 
    : websiteTemplates.filter(t => t.category === selectedCategory);

  const handleUseTemplate = (templateId: string) => {
    navigate(`/dashboard/website-builder?template=${templateId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent">
            Choose Your Perfect Template
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional website templates designed for your industry. Each template comes with AI-powered content generation and full customization.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
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

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTemplates.map((template) => (
            <Card 
              key={template.id}
              className="group hover:shadow-2xl hover:scale-105 transition-all duration-300 border-white/10 bg-gradient-to-br from-white/[0.02] to-white/[0.01] backdrop-blur-sm overflow-hidden"
            >
              <CardHeader>
                {/* Template Icon/Preview */}
                <div className="w-full h-48 rounded-lg bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 flex items-center justify-center text-6xl mb-4 group-hover:scale-110 transition-transform">
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

              <CardContent className="space-y-4">
                {/* Color Scheme Preview */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">Colors:</span>
                  <div className="flex gap-1">
                    <div 
                      className="w-6 h-6 rounded-full border border-white/20"
                      style={{ backgroundColor: template.colorScheme.primary }}
                    />
                    <div 
                      className="w-6 h-6 rounded-full border border-white/20"
                      style={{ backgroundColor: template.colorScheme.secondary }}
                    />
                    <div 
                      className="w-6 h-6 rounded-full border border-white/20"
                      style={{ backgroundColor: template.colorScheme.accent }}
                    />
                  </div>
                </div>

                {/* Features List */}
                <div className="space-y-1">
                  <span className="text-xs font-medium text-muted-foreground">Includes:</span>
                  <div className="grid grid-cols-2 gap-1">
                    {template.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-1 text-xs">
                        <Check className="h-3 w-3 text-primary shrink-0" />
                        <span className="truncate">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <Button
                  onClick={() => handleUseTemplate(template.id)}
                  className="w-full rounded-full group"
                >
                  Use This Template
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 border border-white/10">
          <h2 className="text-2xl font-bold mb-2">Ready to Launch Your Website?</h2>
          <p className="text-muted-foreground mb-4">
            Choose a template above or start from scratch in the website builder
          </p>
          <Button
            onClick={() => navigate('/dashboard/website-builder')}
            size="lg"
            className="rounded-full"
          >
            Go to Website Builder
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
