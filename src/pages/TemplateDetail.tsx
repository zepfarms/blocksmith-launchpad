import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { DownloadButton } from "@/components/templates/DownloadButton";
import { RelatedTemplates } from "@/components/templates/RelatedTemplates";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, FileText, Star, Edit } from "lucide-react";

export default function TemplateDetail() {
  const { slug } = useParams();
  const [template, setTemplate] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadTemplate();
      trackView();
    }
  }, [slug]);

  const loadTemplate = async () => {
    try {
      const { data, error } = await supabase
        .from("document_templates")
        .select(`
          *,
          category:document_categories(id, name, slug)
        `)
        .eq("slug", slug)
        .single();

      if (error) throw error;

      setTemplate(data);
    } catch (error) {
      console.error("Error loading template:", error);
    } finally {
      setLoading(false);
    }
  };

  const trackView = async () => {
    try {
      const { data: templateData } = await supabase
        .from("document_templates")
        .select("id")
        .eq("slug", slug)
        .single();

      if (templateData) {
        const { data: { user } } = await supabase.auth.getUser();
        
        await supabase.from("document_analytics").insert({
          document_id: templateData.id,
          action_type: "view",
          user_id: user?.id || null,
        });

        // Increment view count
        await supabase
          .from("document_templates")
          .update({ view_count: (template?.view_count || 0) + 1 })
          .eq("id", templateData.id);
      }
    } catch (error) {
      console.error("Error tracking view:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <Skeleton className="h-10 w-32 mb-8" />
          <div className="grid lg:grid-cols-2 gap-12">
            <Skeleton className="aspect-[4/3] rounded-lg" />
            <div className="space-y-4">
              <Skeleton className="h-12 w-3/4" />
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Template not found</h1>
          <Button asChild>
            <Link to="/templates">Browse All Templates</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Back Button */}
      <div className="max-w-6xl mx-auto px-6 py-6">
        <Button variant="ghost" asChild>
          <Link to="/templates">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Templates
          </Link>
        </Button>
      </div>

      {/* Template Detail */}
      <section className="max-w-6xl mx-auto px-6 pb-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Thumbnail with Laptop Frame */}
          <div>
            {/* Computer/Browser Frame - Laptop proportions */}
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gradient-to-b from-slate-200 to-slate-300 p-2">
              {/* Browser Window Chrome - Compact */}
              <div className="bg-slate-100 rounded-t-md px-2 py-1.5 mb-1 flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
              </div>
              
              {/* Document Display Area - Tight fit */}
              <div className="bg-white rounded-b-md shadow-inner relative overflow-hidden" style={{ height: 'calc(100% - 26px)' }}>
                {template.thumbnail_url ? (
                  <div className="absolute inset-0 p-1">
                    <img
                      src={template.thumbnail_url}
                      alt={template.title}
                      className="object-contain w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <FileText className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>
              
              {template.is_featured && (
                <div className="absolute top-3 right-3 z-10">
                  <Badge variant="default" className="bg-primary/90 backdrop-blur-sm">
                    <Star className="h-4 w-4 mr-1 fill-current" />
                    Featured
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              {template.category && (
                <Badge variant="secondary" className="mb-4">
                  {template.category.name}
                </Badge>
              )}
              <h1 className="text-4xl font-bold mb-4">{template.title}</h1>
              {template.description && (
                <p className="text-lg text-muted-foreground">{template.description}</p>
              )}
            </div>

            <Separator />

            {/* Stats */}
            <div className="flex gap-6 text-sm text-muted-foreground">
              <div>
                <span className="font-semibold">{template.download_count}</span> downloads
              </div>
              <div>
                <span className="font-semibold">{template.view_count}</span> views
              </div>
            </div>

            <Separator />

            {/* Download Buttons */}
            <div className="space-y-4">
              <h3 className="font-semibold">Download Options:</h3>
              <div className="flex flex-col gap-3">
                {template.file_url && (
                  <DownloadButton
                    templateId={template.id}
                    fileUrl={template.file_url}
                    fileType={template.file_type}
                    title={template.title}
                    size="lg"
                  />
                )}
                {template.alternative_file_url && template.alternative_file_type && (
                  <DownloadButton
                    templateId={template.id}
                    fileUrl={template.alternative_file_url}
                    fileType={template.alternative_file_type}
                    title={template.title}
                    variant="outline"
                    size="lg"
                  />
                )}
              </div>

            </div>

            {/* Tags */}
            {template.tags && template.tags.length > 0 && (
              <>
                <Separator />
                <div>
                  <h3 className="font-semibold mb-3">Tags:</h3>
                  <div className="flex flex-wrap gap-2">
                    {template.tags.map((tag: string) => (
                      <Badge key={tag} variant="outline">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Related Templates */}
      {template.category_id && (
        <section className="max-w-6xl mx-auto px-6 pb-20">
          <RelatedTemplates
            categoryId={template.category_id}
            currentTemplateId={template.id}
          />
        </section>
      )}
    </div>
  );
}
