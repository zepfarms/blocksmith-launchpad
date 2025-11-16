import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { TemplateSearch } from "@/components/templates/TemplateSearch";
import { TemplateFilters } from "@/components/templates/TemplateFilters";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Filter } from "lucide-react";

export default function Templates() {
  const [templates, setTemplates] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFileTypes, setSelectedFileTypes] = useState<string[]>([]);
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);
  const [sortBy, setSortBy] = useState("downloads");

  useEffect(() => {
    loadCategories();
    loadTemplates();
  }, []);

  useEffect(() => {
    loadTemplates();
  }, [selectedCategory, selectedFileTypes, showPremiumOnly, sortBy, searchQuery]);

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("document_categories")
        .select("*")
        .order("display_order");

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error("Error loading categories:", error);
    }
  };

  const loadTemplates = async () => {
    try {
      let query = supabase
        .from("document_templates")
        .select(`
          *,
          category:document_categories(id, name, slug)
        `);

      // Filter by category
      if (selectedCategory !== "all") {
        query = query.eq("category_id", selectedCategory);
      }

      // Filter by file types
      if (selectedFileTypes.length > 0) {
        query = query.in("file_type", selectedFileTypes as ("pdf" | "docx" | "google-docs" | "html")[]);
      }

      // Filter premium
      if (showPremiumOnly) {
        query = query.eq("is_premium", true);
      }

      // Search
      if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }

      // Sort
      switch (sortBy) {
        case "downloads":
          query = query.order("download_count", { ascending: false });
          break;
        case "newest":
          query = query.order("created_at", { ascending: false });
          break;
        case "title":
          query = query.order("title");
          break;
      }

      const { data, error } = await query;

      if (error) throw error;

      setTemplates(data || []);
    } catch (error) {
      console.error("Error loading templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileTypeChange = (fileType: string, checked: boolean) => {
    setSelectedFileTypes((prev) =>
      checked ? [...prev, fileType] : prev.filter((t) => t !== fileType)
    );
  };

  const filtersSidebar = (
    <TemplateFilters
      categories={categories}
      selectedCategory={selectedCategory}
      onCategoryChange={setSelectedCategory}
      selectedFileTypes={selectedFileTypes}
      onFileTypeChange={handleFileTypeChange}
      showPremiumOnly={showPremiumOnly}
      onPremiumToggle={setShowPremiumOnly}
      sortBy={sortBy}
      onSortChange={setSortBy}
    />
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/5 to-background py-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Business Templates Library</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Download professional templates to kickstart your business. All templates are free and customizable.
          </p>
          <div className="max-w-2xl mx-auto">
            <TemplateSearch value={searchQuery} onChange={setSearchQuery} />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="lg:grid lg:grid-cols-[280px_1fr] lg:gap-8">
            {/* Desktop Filters Sidebar */}
            <aside className="hidden lg:block sticky top-6 h-fit">
              {filtersSidebar}
            </aside>

            {/* Templates Grid */}
            <div>
              {/* Mobile Filters */}
              <div className="lg:hidden mb-6">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters & Sort
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="overflow-y-auto">
                    <SheetHeader>
                      <SheetTitle>Filters</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                      {filtersSidebar}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>

              {/* Results Count */}
              <div className="mb-6">
                <p className="text-sm text-muted-foreground">
                  {loading ? "Loading..." : `${templates.length} template${templates.length !== 1 ? "s" : ""} found`}
                </p>
              </div>

              {/* Templates Grid */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <Skeleton key={i} className="h-96 rounded-lg" />
                  ))}
                </div>
              ) : templates.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-muted-foreground text-lg mb-4">No templates found</p>
                  <p className="text-sm text-muted-foreground">Try adjusting your filters or search query</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
