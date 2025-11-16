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
        <div className="relative aspect-[4/3] overflow-hidden rounded-t-lg bg-muted">
          {thumbnailUrl ? (
            <img
              src={thumbnailUrl}
              alt={title}
              className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <FileText className="h-16 w-16 text-muted-foreground" />
            </div>
          )}
          {isFeatured && (
            <div className="absolute top-2 right-2">
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
            <Badge variant="secondary" className="text-xs">
              {category.name}
            </Badge>
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
