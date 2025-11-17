import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/runtimeClient";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { TemplateSearch } from "@/components/templates/TemplateSearch";
import { TemplateFilters } from "@/components/templates/TemplateFilters";
import { PDFEditorPromo } from "@/components/templates/PDFEditorPromo";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  useEffect(() => {
    loadCategories();
    loadTemplates();
  }, []);

  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 when filters change
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

  // Pagination calculations
  const totalPages = Math.ceil(templates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTemplates = templates.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Always show first page
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => handlePageChange(1)}
            isActive={currentPage === 1}
            className="cursor-pointer"
          >
            1
          </PaginationLink>
        </PaginationItem>
      );

      if (currentPage > 3) {
        items.push(
          <PaginationItem key="ellipsis1">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={currentPage === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      if (currentPage < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis2">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }

      // Always show last page
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => handlePageChange(totalPages)}
            isActive={currentPage === totalPages}
            className="cursor-pointer"
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return items;
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
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 via-background to-background pt-32 pb-16 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-8">
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Business Document Templates
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Professional templates to streamline your business operations. Download and customize for your needs.
            </p>
          </div>
          
          <TemplateSearch value={searchQuery} onChange={setSearchQuery} />
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
              {/* PDF Editor Promo */}
              <div className="mb-8">
                <PDFEditorPromo />
              </div>
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
                  {loading ? "Loading..." : `${templates.length} template${templates.length !== 1 ? "s" : ""} found${totalPages > 1 ? ` (Page ${currentPage} of ${totalPages})` : ""}`}
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
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {paginatedTemplates.map((template) => (
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

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="mt-12">
                      <Pagination>
                        <PaginationContent>
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                              className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                          </PaginationItem>
                          
                          {renderPaginationItems()}
                          
                          <PaginationItem>
                            <PaginationNext
                              onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                              className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                            />
                          </PaginationItem>
                        </PaginationContent>
                      </Pagination>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
