import { useEffect, useState } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Save, Loader2, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface WebsiteData {
  id: string;
  domain_name: string;
  template_id: string;
  site_content: any;
  customization_data: any;
  status: string;
  cloudflare_pages_url: string | null;
  edited_by_admin: boolean;
  admin_notes: string | null;
}

export const WebsiteEditor = () => {
  const { websiteId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [website, setWebsite] = useState<WebsiteData | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Content fields
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [aboutText, setAboutText] = useState("");
  const [servicesText, setServicesText] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  useEffect(() => {
    loadWebsite();
    checkAdminStatus();
  }, [websiteId]);

  const checkAdminStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();

    setIsAdmin(!!data);
  };

  const loadWebsite = async () => {
    try {
      const { data, error } = await supabase
        .from("user_websites")
        .select("*")
        .eq("id", websiteId)
        .single();

      if (error) throw error;

      setWebsite(data);
      
      // Load content into form fields
      const content = (data.site_content as Record<string, any>) || {};
      setHeroTitle(content.heroTitle || "");
      setHeroSubtitle(content.heroSubtitle || "");
      setAboutText(content.aboutText || "");
      setServicesText(content.servicesText || "");
      setContactEmail(content.contactEmail || "");
      setContactPhone(content.contactPhone || "");
    } catch (error) {
      console.error("Error loading website:", error);
      toast({
        title: "Error",
        description: "Failed to load website",
        variant: "destructive",
      });
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!website) return;

    setSaving(true);
    try {
      const updatedContent = {
        heroTitle,
        heroSubtitle,
        aboutText,
        servicesText,
        contactEmail,
        contactPhone,
      };

      const updateData: any = {
        site_content: updatedContent,
        updated_at: new Date().toISOString(),
      };

      if (isAdmin) {
        updateData.edited_by_admin = true;
        updateData.last_admin_edit_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from("user_websites")
        .update(updateData)
        .eq("id", websiteId);

      if (error) throw error;

      // Log admin action if admin
      if (isAdmin) {
        const { data: { user } } = await supabase.auth.getUser();
        await supabase.from("admin_audit_log").insert({
          admin_user_id: user!.id,
          customer_user_id: website.id,
          website_id: websiteId,
          action_type: "edit",
          changes_made: { updatedContent },
        });
      }

      toast({
        title: "Success",
        description: "Website updated successfully",
      });

      loadWebsite();
    } catch (error) {
      console.error("Error saving website:", error);
      toast({
        title: "Error",
        description: "Failed to save changes",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!website) {
    return null;
  }

  const defaultTab = searchParams.get("tab") || "content";

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{website.domain_name}</h1>
              <p className="text-muted-foreground">Edit your website content</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && website.edited_by_admin && (
              <Badge variant="secondary">Admin Edited</Badge>
            )}
            {website.cloudflare_pages_url && (
              <Button variant="outline" onClick={() => window.open(website.cloudflare_pages_url!, '_blank')}>
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </Button>
            )}
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </div>

        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="domain">Domain Settings</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Hero Section</CardTitle>
                <CardDescription>The main headline visitors see first</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="heroTitle">Main Headline</Label>
                  <Input
                    id="heroTitle"
                    value={heroTitle}
                    onChange={(e) => setHeroTitle(e.target.value)}
                    placeholder="Welcome to Our Business"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="heroSubtitle">Subtitle</Label>
                  <Input
                    id="heroSubtitle"
                    value={heroSubtitle}
                    onChange={(e) => setHeroSubtitle(e.target.value)}
                    placeholder="Providing quality services since 2024"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>About Section</CardTitle>
                <CardDescription>Tell visitors about your business</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="aboutText">About Text</Label>
                  <Textarea
                    id="aboutText"
                    value={aboutText}
                    onChange={(e) => setAboutText(e.target.value)}
                    placeholder="Tell your story..."
                    rows={6}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Services Section</CardTitle>
                <CardDescription>Describe what you offer</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="servicesText">Services Description</Label>
                  <Textarea
                    id="servicesText"
                    value={servicesText}
                    onChange={(e) => setServicesText(e.target.value)}
                    placeholder="List your services..."
                    rows={6}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
                <CardDescription>How customers can reach you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="contactEmail">Email</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="contact@yourbusiness.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactPhone">Phone</Label>
                  <Input
                    id="contactPhone"
                    type="tel"
                    value={contactPhone}
                    onChange={(e) => setContactPhone(e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="domain">
            <Card>
              <CardHeader>
                <CardTitle>Domain Settings</CardTitle>
                <CardDescription>Manage your domain and DNS settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Domain Name</Label>
                  <Input value={website.domain_name} disabled />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Badge variant={website.status === 'live' ? 'default' : 'secondary'}>
                    {website.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Domain settings coming soon. Contact support for DNS changes.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="advanced">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
                <CardDescription>Template and technical settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Template ID</Label>
                  <Input value={website.template_id} disabled />
                </div>
                {isAdmin && website.admin_notes && (
                  <div className="space-y-2">
                    <Label>Admin Notes</Label>
                    <Textarea value={website.admin_notes} disabled rows={3} />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};