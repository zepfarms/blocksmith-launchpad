import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/runtimeClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { FileText, Trash2, Star, Loader2, BarChart } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";

interface Template {
  id: string;
  title: string;
  category_id: string;
  file_type: string;
  is_featured: boolean;
  download_count: number;
  view_count: number;
  document_categories: { name: string } | null;
}

export default function DocumentLibrary() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTemplates, setSelectedTemplates] = useState<Set<string>>(new Set());
  const [isPerformingBulkAction, setIsPerformingBulkAction] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("document_templates")
      .select(`*, document_categories (name)`)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load templates");
      setLoading(false);
      return;
    }

    setTemplates(data || []);
    setLoading(false);
  };

  const toggleSelectTemplate = (id: string) => {
    const newSelection = new Set(selectedTemplates);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedTemplates(newSelection);
  };

  const toggleSelectAll = () => {
    if (selectedTemplates.size === templates.length) {
      setSelectedTemplates(new Set());
    } else {
      setSelectedTemplates(new Set(templates.map(t => t.id)));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedTemplates.size === 0) {
      toast.error("No templates selected");
      return;
    }

    if (!confirm(`Delete ${selectedTemplates.size} template(s)?`)) return;

    setIsPerformingBulkAction(true);
    const { error } = await supabase
      .from("document_templates")
      .delete()
      .in("id", Array.from(selectedTemplates));

    if (error) {
      toast.error("Failed to delete templates");
      setIsPerformingBulkAction(false);
      return;
    }

    toast.success(`Deleted ${selectedTemplates.size} template(s)`);
    setSelectedTemplates(new Set());
    setIsPerformingBulkAction(false);
    loadTemplates();
  };

  const handleBulkFeature = async (featured: boolean) => {
    if (selectedTemplates.size === 0) {
      toast.error("No templates selected");
      return;
    }

    setIsPerformingBulkAction(true);
    const { error } = await supabase
      .from("document_templates")
      .update({ is_featured: featured })
      .in("id", Array.from(selectedTemplates));

    if (error) {
      toast.error(`Failed to ${featured ? 'feature' : 'unfeature'} templates`);
      setIsPerformingBulkAction(false);
      return;
    }

    toast.success(`${featured ? 'Featured' : 'Unfeatured'} ${selectedTemplates.size} template(s)`);
    setSelectedTemplates(new Set());
    setIsPerformingBulkAction(false);
    loadTemplates();
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Document Library</h1>
          <p className="text-muted-foreground mt-1">
            Manage templates, forms, and documents
          </p>
        </div>
        <Button onClick={() => navigate("/admin/template-analytics")}>
          <BarChart className="mr-2 h-4 w-4" />
          View Analytics
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Templates ({templates.length})</CardTitle>
              <CardDescription>All document templates in the library</CardDescription>
            </div>
            {selectedTemplates.size > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {selectedTemplates.size} selected
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkFeature(true)}
                  disabled={isPerformingBulkAction}
                >
                  {isPerformingBulkAction && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                  <Star className="h-3 w-3 mr-1" />
                  Feature
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleBulkFeature(false)}
                  disabled={isPerformingBulkAction}
                >
                  {isPerformingBulkAction && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                  Unfeature
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={handleBulkDelete}
                  disabled={isPerformingBulkAction}
                >
                  {isPerformingBulkAction && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                  <Trash2 className="h-3 w-3 mr-1" />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No templates yet.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={selectedTemplates.size === templates.length && templates.length > 0}
                        onCheckedChange={toggleSelectAll}
                        aria-label="Select all"
                      />
                    </TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-center">Featured</TableHead>
                    <TableHead className="text-center">Downloads</TableHead>
                    <TableHead className="text-center">Views</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedTemplates.has(template.id)}
                          onCheckedChange={() => toggleSelectTemplate(template.id)}
                          aria-label={`Select ${template.title}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{template.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {template.document_categories?.name || "Uncategorized"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge>{template.file_type.toUpperCase()}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {template.is_featured ? (
                          <Star className="h-4 w-4 mx-auto fill-yellow-400 text-yellow-400" />
                        ) : "-"}
                      </TableCell>
                      <TableCell className="text-center">{template.download_count}</TableCell>
                      <TableCell className="text-center">{template.view_count}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
