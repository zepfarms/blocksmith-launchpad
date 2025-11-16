import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Trash2, Edit, ExternalLink, Plus, Upload, Link as LinkIcon, Eye, EyeOff, BarChart3 } from "lucide-react";

interface AffiliateBlock {
  id: string;
  name: string;
  subtitle: string | null;
  category: string;
  description: string;
  logo_url: string | null;
  affiliate_link: string | null;
  is_affiliate: boolean;
  is_active: boolean;
  tags: string[] | null;
  click_count: number;
  created_at: string;
  updated_at: string;
}

const AffiliateBlocks = () => {
  const { toast } = useToast();
  const [blocks, setBlocks] = useState<AffiliateBlock[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingBlock, setEditingBlock] = useState<AffiliateBlock | null>(null);
  const [deleteBlock, setDeleteBlock] = useState<AffiliateBlock | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [fetchingLogo, setFetchingLogo] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    subtitle: "",
    category: "",
    description: "",
    logo_url: "",
    affiliate_link: "",
    tags: "",
    is_active: true,
    company_url: "",
  });

  useEffect(() => {
    loadBlocks();
    loadCategories();
  }, []);

  const loadBlocks = async () => {
    try {
      const { data, error } = await supabase
        .from("affiliate_blocks")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBlocks(data || []);
    } catch (error: any) {
      toast({
        title: "Error loading blocks",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const { data, error } = await supabase
        .from("block_categories")
        .select("name")
        .order("display_order");

      if (error) throw error;
      setCategories(data?.map(c => c.name) || []);
    } catch (error: any) {
      console.error("Error loading categories:", error);
    }
  };

  const handleFetchLogo = async () => {
    if (!formData.company_url) {
      toast({
        title: "Company URL required",
        description: "Please enter a company URL to fetch the logo",
        variant: "destructive",
      });
      return;
    }

    setFetchingLogo(true);
    try {
      const { data, error } = await supabase.functions.invoke("fetch-logo-from-url", {
        body: { companyUrl: formData.company_url },
      });

      if (error) throw error;

      setFormData(prev => ({ ...prev, logo_url: data.logoUrl }));
      toast({
        title: "Logo fetched",
        description: `Logo found from ${data.source}`,
      });
    } catch (error: any) {
      toast({
        title: "Error fetching logo",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setFetchingLogo(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const blockData = {
      name: formData.name,
      subtitle: formData.subtitle || null,
      category: formData.category,
      description: formData.description,
      logo_url: formData.logo_url || null,
      affiliate_link: formData.affiliate_link || null,
      tags: formData.tags ? formData.tags.split(",").map(t => t.trim()) : null,
      is_active: formData.is_active,
    };

    try {
      if (editingBlock) {
        const { error } = await supabase
          .from("affiliate_blocks")
          .update(blockData)
          .eq("id", editingBlock.id);

        if (error) throw error;
        toast({ title: "Block updated successfully" });
      } else {
        const { error } = await supabase
          .from("affiliate_blocks")
          .insert([blockData]);

        if (error) throw error;
        toast({ title: "Block created successfully" });
      }

      resetForm();
      loadBlocks();
    } catch (error: any) {
      toast({
        title: editingBlock ? "Error updating block" : "Error creating block",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleEdit = (block: AffiliateBlock) => {
    setEditingBlock(block);
    setFormData({
      name: block.name,
      subtitle: block.subtitle || "",
      category: block.category,
      description: block.description,
      logo_url: block.logo_url || "",
      affiliate_link: block.affiliate_link || "",
      tags: block.tags?.join(", ") || "",
      is_active: block.is_active,
      company_url: "",
    });
  };

  const handleDelete = async () => {
    if (!deleteBlock) return;

    try {
      const { error } = await supabase
        .from("affiliate_blocks")
        .delete()
        .eq("id", deleteBlock.id);

      if (error) throw error;

      toast({ title: "Block deleted successfully" });
      loadBlocks();
      setDeleteBlock(null);
    } catch (error: any) {
      toast({
        title: "Error deleting block",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      subtitle: "",
      category: "",
      description: "",
      logo_url: "",
      affiliate_link: "",
      tags: "",
      is_active: true,
      company_url: "",
    });
    setEditingBlock(null);
  };

  const filteredBlocks = blocks.filter(block => {
    const matchesSearch = block.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         block.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || block.category === filterCategory;
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "active" && block.is_active) ||
                         (filterStatus === "inactive" && !block.is_active);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Affiliate Blocks Management</h1>
        <p className="text-muted-foreground">Manage your affiliate partnerships with click tracking</p>
      </div>

      {/* Form */}
      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingBlock ? "Edit Block" : "Add New Block"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Company Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="subtitle">Subtitle/Tagline</Label>
              <Input
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="e.g., Payment processing made easy"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="payment, fintech, startup"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company_url">Company URL (for auto logo fetch)</Label>
              <div className="flex gap-2">
                <Input
                  id="company_url"
                  value={formData.company_url}
                  onChange={(e) => setFormData({ ...formData, company_url: e.target.value })}
                  placeholder="https://stripe.com"
                />
                <Button type="button" onClick={handleFetchLogo} disabled={fetchingLogo}>
                  {fetchingLogo ? "Fetching..." : "Fetch"}
                </Button>
              </div>
            </div>
            <div>
              <Label htmlFor="logo_url">Logo URL (or manual entry)</Label>
              <Input
                id="logo_url"
                value={formData.logo_url}
                onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                placeholder="https://example.com/logo.png"
              />
            </div>
          </div>

          {formData.logo_url && (
            <div className="flex items-center gap-4">
              <Label>Logo Preview:</Label>
              <img src={formData.logo_url} alt="Logo preview" className="h-12 w-12 object-contain" />
            </div>
          )}

          <div>
            <Label htmlFor="affiliate_link">Affiliate Link</Label>
            <Input
              id="affiliate_link"
              value={formData.affiliate_link}
              onChange={(e) => setFormData({ ...formData, affiliate_link: e.target.value })}
              placeholder="https://partner.com/ref/yourcode"
            />
          </div>

          <div className="flex items-center gap-2">
            <Switch
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
            />
            <Label>Active (visible to users)</Label>
          </div>

          <div className="flex gap-2">
            <Button type="submit">
              {editingBlock ? "Update Block" : "Create Block"}
            </Button>
            {editingBlock && (
              <Button type="button" variant="outline" onClick={resetForm}>
                Cancel Edit
              </Button>
            )}
          </div>
        </form>
      </Card>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <Input
          placeholder="Search blocks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-xs"
        />
        <Select value={filterCategory} onValueChange={setFilterCategory}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Blocks Table */}
      <div className="bg-card rounded-lg overflow-hidden border">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-left">Logo</th>
                <th className="px-4 py-3 text-left">Name</th>
                <th className="px-4 py-3 text-left">Category</th>
                <th className="px-4 py-3 text-left">Clicks</th>
                <th className="px-4 py-3 text-left">Affiliate Link</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBlocks.map((block) => (
                <tr key={block.id} className="border-t hover:bg-muted/50">
                  <td className="px-4 py-3">
                    {block.logo_url ? (
                      <img src={block.logo_url} alt={block.name} className="h-10 w-10 object-contain" />
                    ) : (
                      <div className="h-10 w-10 bg-muted rounded flex items-center justify-center text-xs">
                        No Logo
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div>
                      <div className="font-medium">{block.name}</div>
                      {block.subtitle && (
                        <div className="text-sm text-muted-foreground">{block.subtitle}</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline">{block.category}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <BarChart3 className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{block.click_count || 0}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {block.affiliate_link ? (
                      <a 
                        href={block.affiliate_link} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-primary hover:underline"
                      >
                        <LinkIcon className="h-3 w-3" />
                        <span className="text-sm">Link</span>
                      </a>
                    ) : (
                      <span className="text-muted-foreground text-sm">No link</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {block.is_active ? (
                      <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20">
                        <Eye className="h-3 w-3 mr-1" />
                        Active
                      </Badge>
                    ) : (
                      <Badge variant="secondary">
                        <EyeOff className="h-3 w-3 mr-1" />
                        Inactive
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleEdit(block)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setDeleteBlock(block)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredBlocks.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No blocks found. Create your first affiliate block above.
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteBlock} onOpenChange={() => setDeleteBlock(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Affiliate Block</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteBlock?.name}"? This action cannot be undone and will remove all click tracking data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AffiliateBlocks;