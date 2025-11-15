import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2, Loader2, Search, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface WebsiteWithProfile {
  id: string;
  domain_name: string;
  template_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  profiles: {
    email: string;
  };
  edited_by_admin: boolean;
  last_admin_edit_at: string | null;
}

export default function AdminWebsites() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [websites, setWebsites] = useState<WebsiteWithProfile[]>([]);
  const [filteredWebsites, setFilteredWebsites] = useState<WebsiteWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteWebsiteId, setDeleteWebsiteId] = useState<string | null>(null);
  const [aiEditWebsite, setAiEditWebsite] = useState<WebsiteWithProfile | null>(null);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    checkAdminAccess();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = websites.filter(w => 
        w.domain_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        w.profiles.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredWebsites(filtered);
    } else {
      setFilteredWebsites(websites);
    }
  }, [searchTerm, websites]);

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

      loadWebsites();
    } catch (error) {
      console.error("Error checking admin access:", error);
      navigate("/dashboard");
    }
  };

  const loadWebsites = async () => {
    try {
      const { data, error } = await supabase
        .from("user_websites")
        .select(`
          *,
          profiles!user_websites_user_id_fkey (
            email
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setWebsites(data || []);
      setFilteredWebsites(data || []);
    } catch (error) {
      console.error("Error loading websites:", error);
      toast({
        title: "Error",
        description: "Failed to load websites",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWebsite = async () => {
    if (!deleteWebsiteId) return;

    try {
      const { error } = await supabase
        .from("user_websites")
        .delete()
        .eq("id", deleteWebsiteId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Website deleted successfully",
      });

      loadWebsites();
      setDeleteWebsiteId(null);
    } catch (error) {
      console.error("Error deleting website:", error);
      toast({
        title: "Error",
        description: "Failed to delete website",
        variant: "destructive",
      });
    }
  };

  const handleAiEdit = async () => {
    if (!aiEditWebsite || !aiPrompt.trim()) {
      toast({
        title: "Error",
        description: "Please describe the changes you want to make",
        variant: "destructive",
      });
      return;
    }

    setAiLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('admin-ai-website-edit', {
        body: {
          websiteId: aiEditWebsite.id,
          prompt: aiPrompt,
          currentContent: {}, // Will be loaded in edge function
        }
      });

      if (error) throw error;

      // Log admin action
      const { data: { user } } = await supabase.auth.getUser();
      await supabase.from("admin_audit_log").insert({
        admin_user_id: user!.id,
        website_id: aiEditWebsite.id,
        action_type: "ai_edit",
        changes_made: { prompt: aiPrompt, result: data },
        notes: `AI edit: ${aiPrompt}`,
      });

      toast({
        title: "Success",
        description: "AI edits applied successfully",
      });

      setAiEditWebsite(null);
      setAiPrompt("");
      loadWebsites();
    } catch (error) {
      console.error("Error applying AI edit:", error);
      toast({
        title: "Error",
        description: "Failed to apply AI edits",
        variant: "destructive",
      });
    } finally {
      setAiLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Customer Websites</h1>
          <p className="text-muted-foreground">Manage all customer websites</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Websites</CardTitle>
                <CardDescription>{filteredWebsites.length} total websites</CardDescription>
              </div>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search domain or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Domain</TableHead>
                  <TableHead>Customer Email</TableHead>
                  <TableHead>Template</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Admin Edited</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWebsites.map((website) => (
                  <TableRow key={website.id}>
                    <TableCell className="font-medium">{website.domain_name}</TableCell>
                    <TableCell>{website.profiles.email}</TableCell>
                    <TableCell>{website.template_id}</TableCell>
                    <TableCell>
                      <Badge variant={website.status === 'live' ? 'default' : 'secondary'}>
                        {website.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(website.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {website.edited_by_admin && (
                        <Badge variant="outline">Yes</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/dashboard/website-editor/${website.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate(`/dashboard/website-editor/${website.id}`)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setAiEditWebsite(website)}
                        >
                          <Sparkles className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteWebsiteId(website.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <AlertDialog open={!!deleteWebsiteId} onOpenChange={() => setDeleteWebsiteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Customer Website</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this website? This action cannot be undone and will affect the customer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteWebsite} className="bg-destructive text-destructive-foreground">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <Dialog open={!!aiEditWebsite} onOpenChange={() => setAiEditWebsite(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Website Editor
              </DialogTitle>
              <DialogDescription>
                Describe the changes you want to make to {aiEditWebsite?.domain_name}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="aiPrompt">Edit Instructions</Label>
                <Textarea
                  id="aiPrompt"
                  placeholder="Example: Change the hero headline to 'Welcome to Our Amazing Service' and update the contact email to support@example.com"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  rows={6}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                💡 Tip: Be specific about what you want to change. The AI will update the content accordingly.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAiEditWebsite(null)}>
                Cancel
              </Button>
              <Button onClick={handleAiEdit} disabled={aiLoading || !aiPrompt.trim()}>
                {aiLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Applying Changes...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Apply AI Edits
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}