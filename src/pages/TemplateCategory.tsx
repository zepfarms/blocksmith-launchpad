import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { TemplateCard } from "@/components/templates/TemplateCard";
import { TemplateFilters } from "@/components/templates/TemplateFilters";
import { TemplateSearch } from "@/components/templates/TemplateSearch";
import { PDFEditorPromo } from "@/components/templates/PDFEditorPromo";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { ChevronRight, Home } from "lucide-react";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
}

interface Template {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  file_type: string;
  thumbnail_url: string | null;
  is_premium: boolean;
  is_featured: boolean;
  download_count: number;
  tags: string[] | null;
  document_categories: {
    name: string;
    slug: string;
  } | null;
}

export default function TemplateCategory() {
  const { categorySlug } = useParams<{ categorySlug: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [filteredTemplates, setFilteredTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFileTypes, setSelectedFileTypes] = useState<string[]>([]);
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24;

  useEffect(() => {
    loadCategory();
  }, [categorySlug]);

  useEffect(() => {
    if (category) {
      loadTemplates();
    }
  }, [category]);

  useEffect(() => {
    setCurrentPage(1); // Reset to page 1 when filters change
    applyFilters();
  }, [templates, searchQuery, selectedFileTypes, showPremiumOnly, sortBy]);

  const loadCategory = async () => {
    if (!categorySlug) return;

    const { data, error } = await supabase
      .from("document_categories")
      .select("*")
      .eq("slug", categorySlug)
      .maybeSingle();

    if (error) {
      console.error("Error loading category:", error);
      setLoading(false);
      return;
    }

    setCategory(data);
  };

  const loadTemplates = async () => {
    if (!category) return;

    setLoading(true);
    const { data, error } = await supabase
      .from("document_templates")
      .select(`
        id,
        title,
        slug,
        description,
        file_type,
        thumbnail_url,
        is_premium,
        is_featured,
        download_count,
        tags,
        document_categories!inner (
          name,
          slug
        )
      `)
      .eq("category_id", category.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading templates:", error);
      setLoading(false);
      return;
    }

    setTemplates(data || []);
    setLoading(false);
  };

  const applyFilters = () => {
    let filtered = [...templates];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (template) =>
          template.title.toLowerCase().includes(query) ||
          template.description?.toLowerCase().includes(query) ||
          template.tags?.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // File type filter
    if (selectedFileTypes.length > 0) {
      filtered = filtered.filter((template) =>
        selectedFileTypes.includes(template.file_type)
      );
    }

    // Premium filter
    if (showPremiumOnly) {
      filtered = filtered.filter((template) => template.is_premium);
    }

    // Sorting
    switch (sortBy) {
      case "popular":
        filtered.sort((a, b) => b.download_count - a.download_count);
        break;
      case "alphabetical":
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "newest":
      default:
        // Already sorted by created_at desc from query
        break;
    }

    setFilteredTemplates(filtered);
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredTemplates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTemplates = filteredTemplates.slice(startIndex, endIndex);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-96 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-80" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold mb-4">Category Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The category you're looking for doesn't exist.
          </p>
          <Button asChild>
            <Link to="/templates">Browse All Templates</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground transition-colors">
              <Home className="h-4 w-4" />
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link to="/templates" className="hover:text-foreground transition-colors">
              Templates
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">{category.name}</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="border-b bg-gradient-to-b from-muted/50 to-background">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-3">{category.name}</h1>
          {category.description && (
            <p className="text-lg text-muted-foreground max-w-2xl">
              {category.description}
            </p>
          )}
          <p className="text-sm text-muted-foreground mt-4">
            {filteredTemplates.length} {filteredTemplates.length === 1 ? 'template' : 'templates'} available{totalPages > 1 ? ` (Page ${currentPage} of ${totalPages})` : ""}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="sticky top-4">
              <TemplateFilters
                categories={[]}
                selectedCategory={category.id}
                onCategoryChange={() => {}}
                selectedFileTypes={selectedFileTypes}
                onFileTypeChange={(fileType, checked) => {
                  if (checked) {
                    setSelectedFileTypes([...selectedFileTypes, fileType]);
                  } else {
                    setSelectedFileTypes(selectedFileTypes.filter(ft => ft !== fileType));
                  }
                }}
                showPremiumOnly={showPremiumOnly}
                onPremiumToggle={setShowPremiumOnly}
                sortBy={sortBy}
                onSortChange={setSortBy}
              />
            </div>
          </aside>

          {/* Templates Grid */}
          <div className="flex-1">
            {/* PDF Editor Promo */}
            <div className="mb-8">
              <PDFEditorPromo />
            </div>
            
            <div className="mb-6">
              <TemplateSearch value={searchQuery} onChange={setSearchQuery} />
            </div>

            {filteredTemplates.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground mb-4">
                  No templates found matching your criteria.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedFileTypes([]);
                    setShowPremiumOnly(false);
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginatedTemplates.map((template) => (
                    <TemplateCard
                      key={template.id}
                      id={template.id}
                      title={template.title}
                      description={template.description}
                      slug={template.slug}
                      thumbnailUrl={template.thumbnail_url}
                      category={template.document_categories}
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
    </div>
  );
}
