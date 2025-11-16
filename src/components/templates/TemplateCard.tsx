import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, FileText, Star } from "lucide-react";
import { Link } from "react-router-dom";

interface TemplateCardProps {
  id: string;
  title: string;
  description: string | null;
  slug: string;
  thumbnailUrl: string | null;
  category: {
    name: string;
    slug: string;
  } | null;
  fileType: string;
  downloadCount: number;
  isFeatured: boolean;
  isPremium: boolean;
}

export function TemplateCard({
  title,
  description,
  slug,
  thumbnailUrl,
  category,
  fileType,
  downloadCount,
  isFeatured,
  isPremium,
}: TemplateCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-300 h-full flex flex-col">
      <CardHeader className="p-0">
        {/* Computer/Browser Frame - Laptop proportions */}
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg bg-gradient-to-b from-slate-200 to-slate-300 p-2">
          {/* Browser Window Chrome - Compact */}
          <div className="bg-slate-100 rounded-t-md px-2 py-1.5 mb-1 flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-500"></div>
            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
          </div>
          
          {/* Document Display Area - Tight fit */}
          <div className="bg-white rounded-b-md shadow-inner relative overflow-hidden" style={{ height: 'calc(100% - 26px)' }}>
            {thumbnailUrl ? (
              <div className="absolute inset-0 p-1">
                <img
                  src={thumbnailUrl}
                  alt={title}
                  className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <FileText className="h-12 w-12 text-muted-foreground" />
              </div>
            )}
          </div>
          
          {isFeatured && (
            <div className="absolute top-3 right-3 z-10">
              <Badge variant="default" className="bg-primary/90 backdrop-blur-sm">
                <Star className="h-3 w-3 mr-1 fill-current" />
                Featured
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-4">
        <div className="space-y-2">
          {category && (
            <Link to={`/templates/category/${category.slug}`}>
              <Badge variant="secondary" className="text-xs hover:bg-secondary/80 transition-colors cursor-pointer">
                {category.name}
              </Badge>
            </Link>
          )}
          <CardTitle className="line-clamp-2 text-lg">{title}</CardTitle>
          {description && (
            <CardDescription className="line-clamp-2 text-sm">
              {description}
            </CardDescription>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Download className="h-4 w-4" />
          <span>{downloadCount} downloads</span>
        </div>
        <Button asChild size="sm">
          <Link to={`/templates/${slug}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
