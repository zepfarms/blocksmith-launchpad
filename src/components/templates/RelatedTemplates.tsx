import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TemplateCard } from "./TemplateCard";
import { Skeleton } from "@/components/ui/skeleton";

interface RelatedTemplatesProps {
  categoryId: string | null;
  currentTemplateId: string;
  limit?: number;
}

export function RelatedTemplates({ categoryId, currentTemplateId, limit = 4 }: RelatedTemplatesProps) {
  const [templates, setTemplates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!categoryId) {
      setLoading(false);
      return;
    }

    loadRelatedTemplates();
  }, [categoryId, currentTemplateId]);

  const loadRelatedTemplates = async () => {
    try {
      let query = supabase
        .from("document_templates")
        .select(`
          *,
          category:document_categories(id, name, slug)
        `)
        .eq("category_id", categoryId)
        .neq("id", currentTemplateId)
        .limit(limit);

      const { data, error } = await query;

      if (error) throw error;

      setTemplates(data || []);
    } catch (error) {
      console.error("Error loading related templates:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: limit }).map((_, i) => (
          <Skeleton key={i} className="h-80 rounded-lg" />
        ))}
      </div>
    );
  }

  if (templates.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Related Templates</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
    </div>
  );
}
