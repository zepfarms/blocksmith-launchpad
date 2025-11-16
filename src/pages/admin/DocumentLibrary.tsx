import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Upload, FileText, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Template {
  id: string;
  title: string;
  slug: string;
  description: string;
  category_id: string;
  file_type: string;
  file_url: string;
  thumbnail_url: string;
  is_premium: boolean;
  is_editable_online: boolean;
  download_count: number;
  view_count: number;
  created_at: string;
  document_categories: {
    name: string;
  } | null;
}

export default function DocumentLibrary() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    category_id: "",
    file_type: "pdf" as "pdf" | "docx" | "google-docs" | "html",
    file_url: "",
    google_docs_link: "",
    is_premium: false,
    is_editable_online: true,
    tags: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  useEffect(() => {
    loadCategories();
    loadTemplates();
  }, []);

  const loadCategories = async () => {
    const { data, error } = await supabase
      .from("document_categories")
      .select("*")
      .order("display_order");

    if (error) {
      toast.error("Failed to load categories");
      return;
    }

    setCategories(data || []);
  };

  const loadTemplates = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("document_templates")
      .select(`
        *,
        document_categories (name)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load templates");
      setLoading(false);
      return;
    }

    setTemplates(data || []);
    setLoading(false);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  const uploadFile = async (file: File, path: string): Promise<string> => {
    const { data, error } = await supabase.storage
      .from("document-templates")
      .upload(path, file, {
        upsert: true,
        contentType: file.type,
      });

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from("document-templates")
      .getPublicUrl(data.path);

    return publicUrl;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      let fileUrl = formData.file_url;
      let thumbnailUrl = "";

      // Upload main file if selected
      if (selectedFile && formData.file_type !== "google-docs") {
        const ext = selectedFile.name.split(".").pop();
        const filePath = `${formData.slug}-${Date.now()}.${ext}`;
        fileUrl = await uploadFile(selectedFile, filePath);
      } else if (formData.file_type === "google-docs") {
        fileUrl = formData.google_docs_link;
      }

      // Upload thumbnail if selected
      if (thumbnailFile) {
        const ext = thumbnailFile.name.split(".").pop();
        const thumbPath = `thumbnails/${formData.slug}-${Date.now()}.${ext}`;
        thumbnailUrl = await uploadFile(thumbnailFile, thumbPath);
      }

      const tagsArray = formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t);

      const { error } = await supabase.from("document_templates").insert({
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        category_id: formData.category_id,
        file_type: formData.file_type,
        file_url: fileUrl,
        thumbnail_url: thumbnailUrl,
        is_premium: formData.is_premium,
        is_editable_online: formData.is_editable_online,
        tags: tagsArray,
        created_by: user.id,
      });

      if (error) throw error;

      toast.success("Template uploaded successfully!");
      setIsDialogOpen(false);
      resetForm();
      loadTemplates();
    } catch (error: any) {
      toast.error(error.message || "Failed to upload template");
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      description: "",
      category_id: "",
      file_type: "pdf",
      file_url: "",
      google_docs_link: "",
      is_premium: false,
      is_editable_online: true,
      tags: "",
    });
    setSelectedFile(null);
    setThumbnailFile(null);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this template?")) return;

    const { error } = await supabase
      .from("document_templates")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete template");
      return;
    }

    toast.success("Template deleted");
    loadTemplates();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Document Library</h1>
          <p className="text-muted-foreground mt-1">
            Manage templates, forms, and documents
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg">
              <Upload className="mr-2 h-4 w-4" />
              Upload Template
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Upload New Template</DialogTitle>
              <DialogDescription>
                Add a new document template to the library
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  required
                  placeholder="e.g., Service Agreement Template"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  required
                  placeholder="service-agreement-template"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Brief description of the template..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category_id}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category_id: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="file_type">File Type *</Label>
                <Select
                  value={formData.file_type}
                  onValueChange={(value: any) =>
                    setFormData({ ...formData, file_type: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="docx">DOCX</SelectItem>
                    <SelectItem value="google-docs">Google Docs</SelectItem>
                    <SelectItem value="html">HTML</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.file_type === "google-docs" ? (
                <div className="space-y-2">
                  <Label htmlFor="google_docs_link">Google Docs Link *</Label>
                  <Input
                    id="google_docs_link"
                    type="url"
                    value={formData.google_docs_link}
                    onChange={(e) =>
                      setFormData({ ...formData, google_docs_link: e.target.value })
                    }
                    required
                    placeholder="https://docs.google.com/document/d/..."
                  />
                  <p className="text-xs text-muted-foreground">
                    Make sure the link is set to "Anyone with the link can view"
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label htmlFor="file">Upload File *</Label>
                  <Input
                    id="file"
                    type="file"
                    accept={formData.file_type === "pdf" ? ".pdf" : ".docx,.doc"}
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    required={!formData.file_url}
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="thumbnail">Thumbnail (optional)</Label>
                <Input
                  id="thumbnail"
                  type="file"
                  accept="image/*"
                  onChange={(e) =>
                    setThumbnailFile(e.target.files?.[0] || null)
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (comma separated)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  placeholder="contract, legal, service"
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_premium"
                  checked={formData.is_premium}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_premium: checked })
                  }
                />
                <Label htmlFor="is_premium">Premium Template</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_editable_online"
                  checked={formData.is_editable_online}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, is_editable_online: checked })
                  }
                />
                <Label htmlFor="is_editable_online">
                  Can be edited online
                </Label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={uploading}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={uploading}>
                  {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Upload Template
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Templates ({templates.length})</CardTitle>
          <CardDescription>
            All document templates in the library
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No templates yet. Upload your first template!</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-center">Downloads</TableHead>
                    <TableHead className="text-center">Views</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {templates.map((template) => (
                    <TableRow key={template.id}>
                      <TableCell className="font-medium">
                        {template.title}
                      </TableCell>
                      <TableCell>
                        {template.document_categories?.name || "N/A"}
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{template.file_type}</Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {template.download_count}
                      </TableCell>
                      <TableCell className="text-center">
                        {template.view_count}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {template.is_premium && (
                            <Badge variant="secondary">Premium</Badge>
                          )}
                          {template.is_editable_online && (
                            <Badge variant="outline">Editable</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {template.file_url && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                window.open(template.file_url, "_blank")
                              }
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDelete(template.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
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
