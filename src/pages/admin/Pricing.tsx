import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

interface BlockPricing {
  id: string;
  block_name: string;
  price_cents: number;
  is_free: boolean;
  stripe_price_id: string | null;
}

export default function AdminPricing() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pricingData, setPricingData] = useState<BlockPricing[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [editIsFree, setEditIsFree] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    if (isAdmin) {
      loadPricing();
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

    setPricingData(data || []);
  };

  const handleEdit = (block: BlockPricing) => {
    setEditingId(block.id);
    setEditPrice((block.price_cents / 100).toFixed(2));
    setEditIsFree(block.is_free);
  };

  const handleSave = async (id: string) => {
    const priceCents = Math.round(parseFloat(editPrice) * 100);
    
    const { error } = await supabase
      .from("blocks_pricing")
      .update({
        price_cents: priceCents,
        is_free: editIsFree
      })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update pricing");
      return;
    }

    setEditingId(null);
    loadPricing();
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditPrice("");
    setEditIsFree(false);
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
                Set individual pricing for each block. Free blocks can be used without payment.
              </p>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Block Name</TableHead>
                  <TableHead>Price (USD)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Stripe Price ID</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pricingData.map((block) => (
                  <TableRow key={block.id}>
                    <TableCell className="font-medium">{block.block_name}</TableCell>
                    <TableCell>
                      {editingId === block.id ? (
                        <Input
                          type="number"
                          step="0.01"
                          value={editPrice}
                          onChange={(e) => setEditPrice(e.target.value)}
                          className="w-24"
                        />
                      ) : (
                        `$${(block.price_cents / 100).toFixed(2)}`
                      )}
                    </TableCell>
                    <TableCell>
                      {editingId === block.id ? (
                        <select
                          value={editIsFree ? "free" : "paid"}
                          onChange={(e) => setEditIsFree(e.target.value === "free")}
                          className="px-2 py-1 rounded-md border"
                        >
                          <option value="free">Free</option>
                          <option value="paid">Paid</option>
                        </select>
                      ) : (
                        <Badge variant={block.is_free ? "secondary" : "default"}>
                          {block.is_free ? "FREE" : "PAID"}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {block.stripe_price_id || "N/A"}
                    </TableCell>
                    <TableCell className="text-right">
                      {editingId === block.id ? (
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleSave(block.id)}
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
