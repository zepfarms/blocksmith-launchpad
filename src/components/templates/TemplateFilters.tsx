import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface TemplateFiltersProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  selectedFileTypes: string[];
  onFileTypeChange: (fileType: string, checked: boolean) => void;
  showPremiumOnly: boolean;
  onPremiumToggle: (checked: boolean) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export function TemplateFilters({
  categories,
  selectedCategory,
  onCategoryChange,
  selectedFileTypes,
  onFileTypeChange,
  showPremiumOnly,
  onPremiumToggle,
  sortBy,
  onSortChange,
}: TemplateFiltersProps) {
  const fileTypes = [
    { value: "pdf", label: "PDF" },
    { value: "docx", label: "Word (DOCX)" },
    { value: "google-docs", label: "Google Docs" },
    { value: "html", label: "HTML" },
  ];

  const sortOptions = [
    { value: "downloads", label: "Most Downloaded" },
    { value: "newest", label: "Newest First" },
    { value: "title", label: "A-Z" },
  ];

  return (
    <div className="space-y-6">
      {/* Sort */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sort By</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={sortBy} onValueChange={onSortChange}>
            {sortOptions.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={`sort-${option.value}`} />
                <Label htmlFor={`sort-${option.value}`} className="cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={selectedCategory} onValueChange={onCategoryChange}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="category-all" />
              <Label htmlFor="category-all" className="cursor-pointer">
                All Categories
              </Label>
            </div>
            <Separator className="my-2" />
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <RadioGroupItem value={category.id} id={`category-${category.id}`} />
                <Label htmlFor={`category-${category.id}`} className="cursor-pointer">
                  {category.name}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </CardContent>
      </Card>

      {/* File Types */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">File Type</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {fileTypes.map((type) => (
            <div key={type.value} className="flex items-center space-x-2">
              <Checkbox
                id={`filetype-${type.value}`}
                checked={selectedFileTypes.includes(type.value)}
                onCheckedChange={(checked) => onFileTypeChange(type.value, checked as boolean)}
              />
              <Label htmlFor={`filetype-${type.value}`} className="cursor-pointer">
                {type.label}
              </Label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Premium Toggle */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Premium Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="premium-only"
              checked={showPremiumOnly}
              onCheckedChange={onPremiumToggle}
            />
            <Label htmlFor="premium-only" className="cursor-pointer">
              Show Premium Only
            </Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
