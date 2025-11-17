import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/runtimeClient";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ArrowLeft, Save, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Category {
  id: string;
  name: string;
}

export default function BlogEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    featured_image_url: "",
    category_id: "",
    tags: [] as string[],
    status: "draft",
    meta_title: "",
    meta_description: "",
  });

  useEffect(() => {
    fetchCategories();
    if (id) fetchPost();
  }, [id]);

  const fetchCategories = async () => {
    const { data } = await supabase
      .from("blog_categories")
      .select("*")
      .order("name");
    
    if (data) setCategories(data);
  };

  const fetchPost = async () => {
    if (!id) return;

    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("id", id)
      .single();

    if (data) {
      setFormData({
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt || "",
        featured_image_url: data.featured_image_url || "",
        category_id: data.category_id || "",
        tags: data.tags || [],
        status: data.status,
        meta_title: data.meta_title || "",
        meta_description: data.meta_description || "",
      });
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  const calculateReadTime = (content: string) => {
    const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
    return Math.ceil(words / 200); // Average reading speed: 200 words/min
  };

  const handleSave = async (publish: boolean = false) => {
    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const postData = {
        ...formData,
        author_id: user.id,
        status: publish ? 'published' : formData.status,
        published_at: publish ? new Date().toISOString() : null,
        read_time_minutes: calculateReadTime(formData.content),
      };

      if (id) {
        const { error } = await supabase
          .from("blog_posts")
          .update(postData)
          .eq("id", id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("blog_posts")
          .insert(postData);

        if (error) throw error;
      }

      toast({
        title: publish ? "Post published!" : "Post saved!",
        description: `Your blog post has been ${publish ? 'published' : 'saved as draft'} successfully.`,
      });

      navigate("/admin/blog");
    } catch (error: any) {
      toast({
        title: "Failed to save post",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <main className="flex-1">
          <header className="h-16 border-b flex items-center justify-between px-6 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/admin/blog")}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Posts
              </Button>
              <h1 className="text-2xl font-bold">
                {id ? "Edit Post" : "New Post"}
              </h1>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleSave(false)}
                disabled={saving}
              >
                <Save className="w-4 h-4 mr-2" />
                Save Draft
              </Button>
              <Button
                onClick={() => handleSave(true)}
                disabled={saving}
              >
                <Eye className="w-4 h-4 mr-2" />
                Publish
              </Button>
            </div>
          </header>

          <div className="p-6">
            <div className="max-w-5xl mx-auto space-y-6">
              {/* Main Content */}
              <div className="glass-card p-6 space-y-6">
                <div>
                  <Label>Title *</Label>
                  <Input
                    placeholder="Enter post title..."
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    className="text-2xl font-bold h-auto py-3"
                  />
                </div>

                <div>
                  <Label>Slug</Label>
                  <Input
                    placeholder="post-url-slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  />
                </div>

                <div>
                  <Label>Featured Image URL</Label>
                  <Input
                    placeholder="https://..."
                    value={formData.featured_image_url}
                    onChange={(e) => setFormData({ ...formData, featured_image_url: e.target.value })}
                  />
                  {formData.featured_image_url && (
                    <img 
                      src={formData.featured_image_url} 
                      alt="Featured" 
                      className="mt-2 w-full max-w-sm rounded-lg"
                    />
                  )}
                </div>

                <div>
                  <Label>Excerpt</Label>
                  <Textarea
                    placeholder="Brief summary (2-3 sentences)..."
                    value={formData.excerpt}
                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                    rows={3}
                  />
                </div>

                <div>
                  <Label>Content *</Label>
                  <RichTextEditor
                    content={formData.content}
                    onChange={(content) => setFormData({ ...formData, content })}
                  />
                </div>
              </div>

              {/* Sidebar Meta */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="glass-card p-6 space-y-4">
                  <h3 className="font-semibold">Settings</h3>
                  
                  <div>
                    <Label>Category</Label>
                    <Select
                      value={formData.category_id}
                      onValueChange={(value) => setFormData({ ...formData, category_id: value })}
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

                  <div>
                    <Label>Status</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) => setFormData({ ...formData, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Tags (comma-separated)</Label>
                    <Input
                      placeholder="business, startup, tips"
                      value={formData.tags.join(', ')}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)
                      })}
                    />
                  </div>
                </div>

                <div className="glass-card p-6 space-y-4">
                  <h3 className="font-semibold">SEO</h3>
                  
                  <div>
                    <Label>Meta Title</Label>
                    <Input
                      placeholder="SEO title (max 60 chars)"
                      value={formData.meta_title}
                      onChange={(e) => setFormData({ ...formData, meta_title: e.target.value })}
                      maxLength={60}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.meta_title.length}/60
                    </p>
                  </div>

                  <div>
                    <Label>Meta Description</Label>
                    <Textarea
                      placeholder="SEO description (max 160 chars)"
                      value={formData.meta_description}
                      onChange={(e) => setFormData({ ...formData, meta_description: e.target.value })}
                      maxLength={160}
                      rows={3}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.meta_description.length}/160
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}