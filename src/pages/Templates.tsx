import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, Eye, ExternalLink, Sparkles, Zap } from "lucide-react";
import { websiteTemplates, WebsiteTemplate } from "@/data/websiteTemplates";
import { Header } from "@/components/Header";
import { TemplatePreviewModal } from "@/components/website-builder/TemplatePreviewModal";

export default function Templates() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [previewTemplate, setPreviewTemplate] = useState<WebsiteTemplate | null>(null);
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);
  const navigate = useNavigate();
  
  const categories = ["all", ...Array.from(new Set(websiteTemplates.map(t => t.category)))];
  const filteredTemplates = selectedCategory === "all" 
    ? websiteTemplates 
    : websiteTemplates.filter(t => t.category === selectedCategory);

  const handleUseTemplate = (templateId: string) => {
    navigate(`/dashboard/website-builder?template=${templateId}`);
  };

  const handleViewLive = (template: WebsiteTemplate) => {
    if (template.livePreviewUrl) {
      window.open(template.livePreviewUrl, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Premium Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Ambient background effects */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>
        
        <div className="relative max-w-7xl mx-auto">
          <Button
            variant="outline"
            onClick={() => navigate('/dashboard')}
            className="mb-8 rounded-full glass-card hover:shadow-neon transition-all"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          <div className="text-center space-y-6">
            <Badge variant="outline" className="mb-4 px-4 py-2 text-sm rounded-full border-primary/50 bg-primary/10">
              <Sparkles className="w-4 h-4 mr-2 inline" />
              Premium React Templates
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-slide-up-fade">
              Professional Website Templates
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Production-ready, fully responsive, industry-specific designs built with modern React
            </p>

            <div className="flex flex-wrap justify-center gap-8 pt-8 text-sm">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground">10 Premium Templates</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-accent" />
                <span className="text-muted-foreground">50+ Pre-built Sections</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                <span className="text-muted-foreground">Unlimited Customization</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Category Filter */}
      <section className="px-4 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={`rounded-full px-6 py-6 text-base transition-all duration-300 ${
                  selectedCategory === category 
                    ? "shadow-neon scale-105" 
                    : "hover:scale-105 glass-card"
                }`}
              >
                {category === "all" ? "All Templates" : category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Templates Grid */}
      <section className="px-4 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTemplates.map((template, idx) => (
              <Card 
                key={template.id}
                className="group relative hover:shadow-premium transition-all duration-500 border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col"
                onMouseEnter={() => setHoveredTemplate(template.id)}
                onMouseLeave={() => setHoveredTemplate(null)}
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
                    onClick={() => handleViewLive(template)}
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
                      handleViewLive(template);
                    }}
                    className="flex-1 rounded-full hover:shadow-neon transition-all"
                    disabled={!template.livePreviewUrl}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    {template.livePreviewUrl ? 'View Live' : 'Coming Soon'}
                  </Button>
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUseTemplate(template.id);
                    }}
                    className="flex-1 rounded-full shadow-neon hover:shadow-neon hover:scale-105 transition-all"
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

      {/* Premium CTA Section */}
      <section className="relative py-32 px-4 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/30 rounded-full blur-3xl" />
        </div>
        
        <div className="relative max-w-4xl mx-auto text-center glass-card p-12 rounded-3xl">
          <Sparkles className="w-12 h-12 text-primary mx-auto mb-6 animate-pulse" />
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Ready to Launch Your Website?
          </h2>
          <p className="text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl mx-auto">
            Get started with our AI-powered website builder and customize your chosen template to perfection in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={() => navigate('/dashboard/website-builder')}
              size="lg"
              className="rounded-full shadow-neon hover:shadow-neon hover:scale-105 transition-all text-lg px-8"
            >
              Start Building Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              onClick={() => navigate('/dashboard')}
              variant="outline"
              size="lg"
              className="rounded-full glass-card hover:shadow-premium transition-all text-lg px-8"
            >
              Browse All Tools
            </Button>
          </div>
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
