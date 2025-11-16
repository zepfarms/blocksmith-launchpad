import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TemplateCard } from "./TemplateCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function FeaturedTemplates() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFeaturedTemplates();
  }, []);

  const loadFeaturedTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from("document_templates")
        .select(`
          *,
          category:document_categories(id, name, slug)
        `)
        .eq("is_featured", true)
        .order("download_count", { ascending: false })
        .limit(6);

      if (error) throw error;

      setTemplates(data || []);
    } catch (error) {
      console.error("Error loading featured templates:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 px-6 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-96 mx-auto mb-4" />
            <Skeleton className="h-6 w-[600px] mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (templates.length === 0) {
    return null;
  }

  return (
    <section className="py-20 px-6 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Free Business Templates</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Professional templates to help you start and grow your business. Download instantly and customize to your needs.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              id={template.id}
              title={template.title}
              description={template.description}
              slug={template.slug}
              thumbnailUrl={template.thumbnail_url}
              category={template.category}
              fileType={template.file_type}
              downloadCount={template.download_count}
              isFeatured={template.is_featured}
              isPremium={template.is_premium}
            />
          ))}
        </div>

        <div className="text-center">
          <Button asChild size="lg" variant="neon">
            <Link to="/templates">
              Browse All Templates
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
