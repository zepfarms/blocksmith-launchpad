import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";

interface BlockCategory {
  id: string;
  name: string;
  description: string | null;
  display_order: number;
  created_at: string;
}

export default function AdminCategories() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<BlockCategory[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editOrder, setEditOrder] = useState(0);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  const checkAdminAccess = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      navigate("/");
      return;
    }

    const { data: hasAdminRole } = await supabase.rpc("has_role", {
      _user_id: user.id,
      _role: "admin",
    });

    if (!hasAdminRole) {
      navigate("/dashboard");
      return;
    }

    setIsAdmin(true);
    loadCategories();
  };

  const loadCategories = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("block_categories")
      .select("*")
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error loading categories:", error);
    } else {
      setCategories(data || []);
    }
    setLoading(false);
  };

  const handleEdit = (category: BlockCategory) => {
    setEditingId(category.id);
    setEditName(category.name);
    setEditDescription(category.description || "");
    setEditOrder(category.display_order);
  };

  const handleSave = async (id: string) => {
    const { error } = await supabase
      .from("block_categories")
      .update({
        name: editName,
        description: editDescription || null,
        display_order: editOrder,
      })
      .eq("id", id);

    if (error) {
      console.error("Error updating category:", error);
    } else {
      setEditingId(null);
      loadCategories();
    }
  };

  const handleCreate = async () => {
    if (!editName.trim()) return;

    const { error } = await supabase
      .from("block_categories")
      .insert({
        name: editName,
        description: editDescription || null,
        display_order: editOrder,
      });

    if (error) {
      console.error("Error creating category:", error);
    } else {
      setNewCategory(false);
      setEditName("");
      setEditDescription("");
      setEditOrder(0);
      loadCategories();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category? All block assignments will be removed.")) return;

    const { error } = await supabase
      .from("block_categories")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting category:", error);
    } else {
      loadCategories();
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setNewCategory(false);
    setEditName("");
    setEditDescription("");
    setEditOrder(0);
  };

  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-black text-white">
          <AdminSidebar />
          <main className="flex-1 p-8">
            <p>Loading...</p>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-black text-white">
        <AdminSidebar />
        <main className="flex-1 p-8">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Category Management</h1>
              <p className="text-muted-foreground">
                Create and manage up to 10 block categories ({categories.length}/10 used)
              </p>
            </div>
            {categories.length < 10 && !newCategory && (
              <Button onClick={() => setNewCategory(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            )}
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {newCategory && (
                <TableRow>
                  <TableCell>
                    <Input
                      type="number"
                      value={editOrder}
                      onChange={(e) => setEditOrder(parseInt(e.target.value) || 0)}
                      className="w-20"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Category name"
                      className="max-w-xs"
                    />
                  </TableCell>
                  <TableCell>
                    <Textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      placeholder="Description (optional)"
                      rows={2}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button size="sm" variant="ghost" onClick={handleCreate} className="mr-2">
                      <Check className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={handleCancel}>
                      <X className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )}
              {categories.map((category) => (
                <TableRow key={category.id}>
                  {editingId === category.id ? (
                    <>
                      <TableCell>
                        <Input
                          type="number"
                          value={editOrder}
                          onChange={(e) => setEditOrder(parseInt(e.target.value) || 0)}
                          className="w-20"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="max-w-xs"
                        />
                      </TableCell>
                      <TableCell>
                        <Textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          rows={2}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleSave(category.id)}
                          className="mr-2"
                        >
                          <Check className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={handleCancel}>
                          <X className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell>{category.display_order}</TableCell>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {category.description || "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(category)}
                          className="mr-2"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(category.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {categories.length === 0 && !newCategory && (
            <div className="text-center py-12 text-muted-foreground">
              <p>No categories yet. Click "Add Category" to create your first one.</p>
            </div>
          )}
        </main>
      </div>
    </SidebarProvider>
  );
}
