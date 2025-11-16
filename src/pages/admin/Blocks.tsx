import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Trash2, Plus, Upload } from "lucide-react";

interface BlockData {
  name: string;
  category: string;
  subtitle: string;
  description: string;
  is_free: boolean;
  typical_price: string;
  dependencies: string;
  tags: string;
  is_affiliate: boolean;
  affiliate_link: string;
  logo_url: string;
}

export default function Blocks() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [blocks, setBlocks] = useState<BlockData[]>([]);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [newBlock, setNewBlock] = useState<BlockData>({
    name: "",
    category: "Partnership",
    subtitle: "",
    description: "",
    is_free: true,
    typical_price: "Free",
    dependencies: "",
    tags: "",
    is_affiliate: true,
    affiliate_link: "",
    logo_url: "",
  });

  useEffect(() => {
    checkAdminAccess();
    loadBlocks();
  }, []);

  const checkAdminAccess = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/");
        return;
      }

      const { data: roleData } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!roleData) {
        navigate("/dashboard");
        return;
      }

      setIsAdmin(true);
    } catch (error) {
      console.error("Error checking admin access:", error);
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const loadBlocks = async () => {
    try {
      const response = await fetch("/data/blocks_catalog.csv");
      const text = await response.text();
      const lines = text.split("\n").filter((line) => line.trim());
      const headers = lines[0].split(",");

      const parsedBlocks: BlockData[] = lines.slice(1).map((line) => {
        const values = line.split(",");
        return {
          name: values[0] || "",
          category: values[1] || "",
          subtitle: values[2] || "",
          description: values[3] || "",
          is_free: values[4] === "TRUE",
          typical_price: values[5] || "Free",
          dependencies: values[6] || "",
          tags: values[7] || "",
          is_affiliate: values[8] === "TRUE",
          affiliate_link: values[9] || "",
          logo_url: values[10] || "",
        };
      });

      setBlocks(parsedBlocks);
    } catch (error) {
      console.error("Error loading blocks:", error);
      toast.error("Failed to load blocks");
    }
  };

  const handleLogoUpload = async (file: File): Promise<string> => {
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `block-logos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("business-assets")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("business-assets")
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error("Error uploading logo:", error);
      toast.error("Failed to upload logo");
      return "";
    }
  };

  const handleAddBlock = async () => {
    try {
      let logoUrl = newBlock.logo_url;

      if (logoFile) {
        logoUrl = await handleLogoUpload(logoFile);
        if (!logoUrl) return;
      }

      const updatedBlocks = [...blocks, { ...newBlock, logo_url: logoUrl }];
      await saveBlocksToCSV(updatedBlocks);

      toast.success("Block added successfully");
      setNewBlock({
        name: "",
        category: "Partnership",
        subtitle: "",
        description: "",
        is_free: true,
        typical_price: "Free",
        dependencies: "",
        tags: "",
        is_affiliate: true,
        affiliate_link: "",
        logo_url: "",
      });
      setLogoFile(null);
      loadBlocks();
    } catch (error) {
      console.error("Error adding block:", error);
      toast.error("Failed to add block");
    }
  };

  const handleDeleteBlock = async (blockName: string) => {
    try {
      const updatedBlocks = blocks.filter((b) => b.name !== blockName);
      await saveBlocksToCSV(updatedBlocks);
      toast.success("Block deleted successfully");
      loadBlocks();
    } catch (error) {
      console.error("Error deleting block:", error);
      toast.error("Failed to delete block");
    }
  };

  const saveBlocksToCSV = async (blocksData: BlockData[]) => {
    const headers = "name,category,subtitle,description,is_free,typical_price,dependencies,tags,is_affiliate,affiliate_link,logo_url";
    const rows = blocksData.map((block) =>
      [
        block.name,
        block.category,
        block.subtitle,
        block.description,
        block.is_free ? "TRUE" : "FALSE",
        block.typical_price,
        block.dependencies,
        block.tags,
        block.is_affiliate ? "TRUE" : "FALSE",
        block.affiliate_link,
        block.logo_url,
      ].join(",")
    );
    const csv = [headers, ...rows].join("\n");

    // Note: In production, you'd need a backend endpoint to write files
    console.log("CSV to save:", csv);
    toast.info("CSV updated (check console in dev mode)");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Verifying admin access...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Manage Affiliate Blocks</h1>

      {/* Add New Block Form */}
      <Card>
        <CardHeader>
          <CardTitle>Add New Affiliate Block</CardTitle>
          <CardDescription>Create a new partnership or affiliate block</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Company Name</Label>
              <Input
                id="name"
                value={newBlock.name}
                onChange={(e) => setNewBlock({ ...newBlock, name: e.target.value })}
                placeholder="e.g., Tailor Brands"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle (Short Description)</Label>
              <Input
                id="subtitle"
                value={newBlock.subtitle}
                onChange={(e) => setNewBlock({ ...newBlock, subtitle: e.target.value })}
                placeholder="e.g., Form LLC"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Full Description</Label>
            <Textarea
              id="description"
              value={newBlock.description}
              onChange={(e) => setNewBlock({ ...newBlock, description: e.target.value })}
              placeholder="Enter detailed description..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={newBlock.category}
                onValueChange={(value) => setNewBlock({ ...newBlock, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Partnership">Partnership</SelectItem>
                  <SelectItem value="Foundation">Foundation</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={newBlock.tags}
                onChange={(e) => setNewBlock({ ...newBlock, tags: e.target.value })}
                placeholder="e.g., llc,business,legal"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="affiliate_link">Affiliate Link</Label>
            <Input
              id="affiliate_link"
              value={newBlock.affiliate_link}
              onChange={(e) => setNewBlock({ ...newBlock, affiliate_link: e.target.value })}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo">Company Logo</Label>
            <div className="flex gap-2">
              <Input
                id="logo"
                type="file"
                accept="image/*"
                onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
              />
              {logoFile && (
                <Button variant="outline" size="sm" onClick={() => setLogoFile(null)}>
                  Clear
                </Button>
              )}
            </div>
          </div>

          <Button onClick={handleAddBlock} className="w-full">
            <Plus className="mr-2 h-4 w-4" />
            Add Block
          </Button>
        </CardContent>
      </Card>

      {/* Existing Blocks */}
      <Card>
        <CardHeader>
          <CardTitle>Existing Blocks</CardTitle>
          <CardDescription>Manage your affiliate and partnership blocks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {blocks
              .filter((block) => block.is_affiliate)
              .map((block) => (
                <div
                  key={block.name}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    {block.logo_url && (
                      <img
                        src={block.logo_url}
                        alt={block.name}
                        className="w-12 h-12 object-contain rounded"
                      />
                    )}
                    <div>
                      <h3 className="font-semibold">{block.name}</h3>
                      <p className="text-sm text-muted-foreground">{block.subtitle}</p>
                    </div>
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDeleteBlock(block.name)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
