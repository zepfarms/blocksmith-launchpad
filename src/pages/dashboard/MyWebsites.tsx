import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Globe, Edit, Settings, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

interface UserWebsite {
  id: string;
  domain_name: string;
  template_id: string;
  status: string;
  created_at: string;
  updated_at: string;
  cloudflare_pages_url: string | null;
  site_content: any;
  customization_data: any;
  domain_verified: boolean;
}

export const MyWebsites = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [websites, setWebsites] = useState<UserWebsite[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteWebsiteId, setDeleteWebsiteId] = useState<string | null>(null);

  useEffect(() => {
    loadWebsites();
  }, []);

  const loadWebsites = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/");
        return;
      }

      const { data, error } = await supabase
        .from("user_websites")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setWebsites(data || []);
    } catch (error) {
      console.error("Error loading websites:", error);
      toast({
        title: "Error",
        description: "Failed to load your websites",
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

      setWebsites(websites.filter(w => w.id !== deleteWebsiteId));
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

  const getStatusBadge = (status: string, verified: boolean) => {
    if (status === 'live' && verified) {
      return <Badge className="bg-green-500">Live</Badge>;
    } else if (status === 'published') {
      return <Badge variant="secondary">Published</Badge>;
    } else {
      return <Badge variant="outline">Draft</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (websites.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Websites</CardTitle>
          <CardDescription>You haven't created any websites yet</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => navigate('/dashboard/website-builder')}>
            Create Your First Website
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">My Websites</h2>
          <p className="text-muted-foreground">Manage and edit your websites</p>
        </div>
        <Button onClick={() => navigate('/dashboard/website-builder')}>
          Create New Website
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {websites.map((website) => (
          <Card key={website.id} className="overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    {website.domain_name}
                  </CardTitle>
                  <CardDescription>
                    Last updated: {new Date(website.updated_at).toLocaleDateString()}
                  </CardDescription>
                </div>
                {getStatusBadge(website.status, website.domain_verified)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {website.cloudflare_pages_url && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(website.cloudflare_pages_url!, '_blank')}
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Live Site
                  </Button>
                )}
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => navigate(`/dashboard/website-editor/${website.id}`)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Content
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate(`/dashboard/website-editor/${website.id}?tab=domain`)}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setDeleteWebsiteId(website.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AlertDialog open={!!deleteWebsiteId} onOpenChange={() => setDeleteWebsiteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Website</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this website? This action cannot be undone.
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
    </div>
  );
};