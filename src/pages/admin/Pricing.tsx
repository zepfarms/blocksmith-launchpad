import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pencil, Save, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface BlockPricing {
  id: string;
  block_name: string;
  price_cents: number;
  is_free: boolean;
  pricing_type: 'free' | 'one_time' | 'monthly';
  monthly_price_cents: number;
  stripe_price_id: string | null;
  stripe_product_id: string | null;
  stripe_monthly_price_id: string | null;
  description: string | null;
}

interface BlockCategory {
  id: string;
  name: string;
}

interface CategoryAssignment {
  category_id: string;
  block_name: string;
}

export default function AdminPricing() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pricingData, setPricingData] = useState<BlockPricing[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [editMonthlyPrice, setEditMonthlyPrice] = useState("");
  const [editPricingType, setEditPricingType] = useState<'free' | 'one_time' | 'monthly'>('free');
  const [editDescription, setEditDescription] = useState("");
  const [categories, setCategories] = useState<BlockCategory[]>([]);
  const [blockCategories, setBlockCategories] = useState<Record<string, string[]>>({});
  const [editCategories, setEditCategories] = useState<string[]>([]);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadPricing();
      loadCategories();
    }
  }, [isAdmin]);

  const checkAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();

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

  const loadPricing = async () => {
    const { data, error } = await supabase
      .from("blocks_pricing")
      .select("*")
      .order("block_name");

    if (error) {
      console.error("Error loading pricing:", error);
      return;
    }

    // Map data to include new pricing fields
    const mappedData: BlockPricing[] = (data || []).map(item => ({
      id: item.id,
      block_name: item.block_name,
      price_cents: item.price_cents,
      is_free: item.is_free,
      pricing_type: (item as any).pricing_type || 'free',
      monthly_price_cents: (item as any).monthly_price_cents || 0,
      stripe_price_id: item.stripe_price_id,
      stripe_product_id: (item as any).stripe_product_id || null,
      stripe_monthly_price_id: (item as any).stripe_monthly_price_id || null,
      description: (item as any).description || null
    }));

    setPricingData(mappedData);
  };

  const loadCategories = async () => {
    const { data: categoriesData } = await supabase
      .from("block_categories")
      .select("id, name")
      .order("display_order", { ascending: true });

    const { data: assignmentsData } = await supabase
      .from("block_category_assignments")
      .select("block_name, category_id");

    if (categoriesData) {
      setCategories(categoriesData);
    }

    if (assignmentsData) {
      const assignments: Record<string, string[]> = {};
      assignmentsData.forEach((assignment) => {
        if (!assignments[assignment.block_name]) {
          assignments[assignment.block_name] = [];
        }
        assignments[assignment.block_name].push(assignment.category_id);
      });
      setBlockCategories(assignments);
    }
  };

  const handleEdit = (block: BlockPricing) => {
    setEditingId(block.id);
    setEditPrice((block.price_cents / 100).toFixed(2));
    setEditMonthlyPrice((block.monthly_price_cents / 100).toFixed(2));
    setEditPricingType(block.pricing_type);
    setEditDescription(block.description || "");
    setEditCategories(blockCategories[block.block_name] || []);
  };

  const handleSave = async (id: string, blockName: string) => {
    const priceCents = editPricingType === 'one_time' ? Math.round(parseFloat(editPrice || "0") * 100) : 0;
    const monthlyPriceCents = editPricingType === 'monthly' ? Math.round(parseFloat(editMonthlyPrice || "0") * 100) : 0;
    
    const { error: pricingError } = await supabase
      .from("blocks_pricing")
      .update({
        pricing_type: editPricingType,
        price_cents: priceCents,
        monthly_price_cents: monthlyPriceCents,
        is_free: editPricingType === 'free',
        description: editDescription || null
      })
      .eq("id", id);

    if (pricingError) {
      toast.error("Failed to update pricing");
      return;
    }

    // Update category assignments
    // First delete existing assignments
    await supabase
      .from("block_category_assignments")
      .delete()
      .eq("block_name", blockName);

    // Then insert new assignments
    if (editCategories.length > 0) {
      const assignments = editCategories.map(categoryId => ({
        block_name: blockName,
        category_id: categoryId
      }));

      const { error: assignmentError } = await supabase
        .from("block_category_assignments")
        .insert(assignments);

      if (assignmentError) {
        toast.error("Failed to update categories");
        return;
      }
    }

    setEditingId(null);
    loadPricing();
    loadCategories();
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditPrice("");
    setEditMonthlyPrice("");
    setEditPricingType('free');
    setEditDescription("");
    setEditCategories([]);
  };

  const toggleCategory = (categoryId: string) => {
    setEditCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <main className="flex-1">
          <header className="h-16 border-b flex items-center px-6 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
            <SidebarTrigger className="mr-4" />
            <h1 className="text-2xl font-bold">Block Pricing Management</h1>
          </header>
          <div className="p-6">
            <div className="mb-4 flex justify-between items-center">
              <p className="text-muted-foreground">
                Configure pricing for each block: <strong>Free</strong> (always accessible), <strong>One-Time</strong> (single payment), or <strong>Monthly</strong> (recurring subscription).
              </p>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Block Name</TableHead>
                  <TableHead>Pricing Type</TableHead>
                  <TableHead>One-Time Price</TableHead>
                  <TableHead>Monthly Price</TableHead>
                  <TableHead className="w-[200px]">Description</TableHead>
                  <TableHead>Categories</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pricingData.map((block) => (
                  <TableRow key={block.id}>
                    <TableCell className="font-medium">{block.block_name}</TableCell>
                    <TableCell>
                      {editingId === block.id ? (
                        <select
                          value={editPricingType}
                          onChange={(e) => setEditPricingType(e.target.value as 'free' | 'one_time' | 'monthly')}
                          className="px-3 py-2 rounded-md border bg-background"
                        >
                          <option value="free">Free</option>
                          <option value="one_time">One-Time</option>
                          <option value="monthly">Monthly</option>
                        </select>
                      ) : (
                        <Badge 
                          variant={
                            block.pricing_type === 'free' ? 'secondary' : 
                            block.pricing_type === 'monthly' ? 'default' : 
                            'outline'
                          }
                        >
                          {block.pricing_type === 'free' ? 'FREE' : 
                           block.pricing_type === 'monthly' ? 'MONTHLY' : 
                           'ONE-TIME'}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === block.id ? (
                        editPricingType === 'one_time' ? (
                          <Input
                            type="number"
                            step="0.01"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            className="w-24"
                            placeholder="0.00"
                          />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )
                      ) : (
                        block.pricing_type === 'one_time' ? 
                          `$${(block.price_cents / 100).toFixed(2)}` : 
                          <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === block.id ? (
                        editPricingType === 'monthly' ? (
                          <Input
                            type="number"
                            step="0.01"
                            value={editMonthlyPrice}
                            onChange={(e) => setEditMonthlyPrice(e.target.value)}
                            className="w-24"
                            placeholder="0.00"
                          />
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )
                      ) : (
                        block.pricing_type === 'monthly' ? 
                          `$${(block.monthly_price_cents / 100).toFixed(2)}/mo` : 
                          <span className="text-muted-foreground">—</span>
                      )}
                    </TableCell>
                    <TableCell className="max-w-[200px]">
                      {editingId === block.id ? (
                        <Textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          rows={2}
                          className="min-h-[60px]"
                          placeholder="Add description..."
                        />
                      ) : (
                        <div className="line-clamp-2 text-sm text-muted-foreground">
                          {block.description || "No description"}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === block.id ? (
                        <div className="flex flex-wrap gap-2 max-w-[200px]">
                          {categories.map(cat => (
                            <label key={cat.id} className="flex items-center gap-1 text-sm">
                              <Checkbox
                                checked={editCategories.includes(cat.id)}
                                onCheckedChange={() => toggleCategory(cat.id)}
                              />
                              <span>{cat.name}</span>
                            </label>
                          ))}
                          {categories.length === 0 && (
                            <span className="text-xs text-muted-foreground">No categories</span>
                          )}
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {(blockCategories[block.block_name] || []).map(catId => {
                            const cat = categories.find(c => c.id === catId);
                            return cat ? (
                              <Badge key={catId} variant="outline" className="text-xs">
                                {cat.name}
                              </Badge>
                            ) : null;
                          })}
                          {(!blockCategories[block.block_name] || blockCategories[block.block_name].length === 0) && (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {editingId === block.id ? (
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSave(block.id, block.block_name)}
                            className="rounded-full"
                          >
                            <Save className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancel}
                            className="rounded-full"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(block)}
                          className="rounded-full"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
