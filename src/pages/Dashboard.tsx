import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { LayoutDashboard, User, Briefcase, Trash2, Eye, Store } from "lucide-react";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { VerificationBanner } from "@/components/VerificationBanner";
import { toast } from "sonner";
import AppStore from "@/pages/dashboard/AppStore";

interface DashboardItem {
  id: string;
  title: string;
  completionStatus: "not_started" | "in_progress" | "completed";
  description: string;
  isFree?: boolean;
  category?: string;
  isAffiliate?: boolean;
  affiliateLink?: string;
  logoUrl?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [businessData, setBusinessData] = useState<any>(null);
  const [items, setItems] = useState<DashboardItem[]>([]);
  const [savedAssets, setSavedAssets] = useState<any[]>([]);
  const [userEmail, setUserEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(true);
  const [showVerificationBanner, setShowVerificationBanner] = useState(false);
  const [activeTab, setActiveTab] = useState("my-apps");

  const loadBlocksCatalog = async (): Promise<Map<string, any>> => {
    const response = await fetch('/data/blocks_catalog.csv');
    const text = await response.text();
    const lines = text.split('\n').slice(1);
    
    const catalogMap = new Map();
    
    lines.filter(line => line.trim()).forEach(line => {
      const matches = line.match(/(?:^|,)("(?:[^"]|"")*"|[^,]*)/g);
      if (!matches || matches.length < 7) return;
      
      const clean = (str: string) => str.replace(/^,?"?|"?$/g, '').trim();
      const name = clean(matches[0]);
      const category = clean(matches[1]);
      const subtitle = clean(matches[2]);
      const description = clean(matches[3]);
      const isFreeRaw = clean(matches[4]) || 'TRUE';
      const isAffiliateRaw = clean(matches[8]) || 'FALSE';
      const affiliateLink = clean(matches[9]) || '';
      const logoUrl = clean(matches[10]) || '';
      
      catalogMap.set(name, {
        category,
        subtitle,
        description,
        isFree: isFreeRaw.toUpperCase() === 'TRUE',
        isAffiliate: isAffiliateRaw.toUpperCase() === 'TRUE',
        affiliateLink,
        logoUrl
      });
    });
    
    return catalogMap;
  };

  const loadDashboardData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      navigate("/");
      return;
    }

    setUserEmail(session.user.email || "");

    const { data: profile } = await supabase
      .from('profiles')
      .select('email_verified')
      .eq('id', session.user.id)
      .maybeSingle();
    
    const verified = (profile as any)?.email_verified ?? true;
    setEmailVerified(verified);
    setShowVerificationBanner(!verified);

    const { data, error } = await supabase
      .from('user_businesses')
      .select('*')
      .eq('user_id', session.user.id)
      .maybeSingle();

    if (error) {
      console.error('Error loading business data:', error);
      return;
    }

    if (data) {
      setBusinessData(data);
      
      const { data: unlockedBlocks } = await supabase
        .from('user_block_unlocks')
        .select('block_name, completion_status')
        .eq('user_id', session.user.id);
      
      const legacyBlocks = data.selected_blocks || [];
      const appStoreBlocks = unlockedBlocks?.map(u => u.block_name) || [];
      const allBlocks = [...new Set([...legacyBlocks, ...appStoreBlocks])];
        
        const dashboardItems: DashboardItem[] = [];
        const blocksCatalog = await loadBlocksCatalog();
        
        for (const blockName of allBlocks) {
          const unlock = unlockedBlocks?.find(u => u.block_name === blockName);
          const completionStatus = (unlock?.completion_status || 'not_started') as "not_started" | "in_progress" | "completed";
          const catalogInfo = blocksCatalog.get(blockName);
          
          // Handle affiliate blocks dynamically
          if (catalogInfo?.isAffiliate) {
            dashboardItems.push({
              id: blockName.toLowerCase().replace(/\s+/g, '-'),
              title: blockName,
              completionStatus,
              description: catalogInfo.description,
              isFree: true,
              category: catalogInfo.category,
              isAffiliate: true,
              affiliateLink: catalogInfo.affiliateLink,
              logoUrl: catalogInfo.logoUrl
            });
            continue;
          }
          
          if (blockName === 'Business Name Generator') {
            dashboardItems.push({
              id: "business-name-generator",
              title: "Business Name Generator",
              completionStatus,
              description: data.business_name 
                ? `Current name: ${data.business_name}`
                : "Choose your perfect business name",
              isFree: true,
              category: catalogInfo?.category,
              isAffiliate: catalogInfo?.isAffiliate,
              affiliateLink: catalogInfo?.affiliateLink,
              logoUrl: catalogInfo?.logoUrl,
            });
            continue;
          }
          
          if (blockName === 'Domain Name Generator') {
            const { data: domainData } = await supabase
              .from('user_domain_selections')
              .select('*')
              .eq('business_id', data.id)
              .maybeSingle();

            dashboardItems.push({
              id: "domain-name-generator",
              title: "Domain Name Generator",
              completionStatus,
              description: domainData
                  ? domainData.existing_website_url || domainData.domain_name || "Domain selected"
                  : completionStatus === "completed"
                  ? "Skipped for now"
                  : "Enter your domain or generate new ideas for your business",
              isFree: true,
              category: catalogInfo?.category,
              isAffiliate: catalogInfo?.isAffiliate,
              affiliateLink: catalogInfo?.affiliateLink,
              logoUrl: catalogInfo?.logoUrl,
            });
            continue;
          }
          
          if (blockName === 'Logo Generator') {
            const { data: logoAssets } = await supabase
              .from('user_assets')
              .select('*')
              .eq('user_id', session.user.id)
              .eq('business_id', data.id)
              .eq('asset_type', 'logo');

            dashboardItems.push({
              id: "logo-generator",
              title: "Logo Generator",
              completionStatus,
              description: logoAssets && logoAssets.length > 0
                ? `${logoAssets.length} logo${logoAssets.length !== 1 ? 's' : ''} saved`
                : "Create your professional logo",
              isFree: true,
              category: catalogInfo?.category,
              isAffiliate: catalogInfo?.isAffiliate,
              affiliateLink: catalogInfo?.affiliateLink,
              logoUrl: catalogInfo?.logoUrl,
            });
            continue;
          }
          
          if (blockName === 'Business Plan Generator') {
            const { data: planData } = await supabase
              .from('business_plans')
              .select('*')
              .eq('business_id', data.id)
              .maybeSingle();

            dashboardItems.push({
              id: "business-plan-generator",
              title: "Business Plan Generator",
              completionStatus,
              description: planData
                ? "Business plan created - View and edit"
                : "Generate a professional SBA-quality business plan",
              isFree: true,
              category: catalogInfo?.category,
              isAffiliate: catalogInfo?.isAffiliate,
              affiliateLink: catalogInfo?.affiliateLink,
              logoUrl: catalogInfo?.logoUrl,
            });
            continue;
          }
          
          if (blockName === 'Social Media Handle Checker') {
            dashboardItems.push({
              id: "social-media-checker",
              title: "Social Media Handle Checker",
              completionStatus,
              description: "Check availability across all major platforms",
              isFree: true,
              category: catalogInfo?.category,
              isAffiliate: catalogInfo?.isAffiliate,
              affiliateLink: catalogInfo?.affiliateLink,
              logoUrl: catalogInfo?.logoUrl,
            });
            continue;
          }
          
          if (blockName === 'QR Code Generator') {
            dashboardItems.push({
              id: "qr-code-generator",
              title: "QR Code Generator",
              completionStatus,
              description: "Create custom QR codes for your business",
              isFree: true,
              category: catalogInfo?.category,
              isAffiliate: catalogInfo?.isAffiliate,
              affiliateLink: catalogInfo?.affiliateLink,
              logoUrl: catalogInfo?.logoUrl,
            });
            continue;
          }
          
          if (blockName === 'Professional Email Signature') {
            dashboardItems.push({
              id: "email-signature",
              title: "Professional Email Signature",
              completionStatus,
              description: "Generate professional email signatures",
              isFree: true,
              category: catalogInfo?.category,
              isAffiliate: catalogInfo?.isAffiliate,
              affiliateLink: catalogInfo?.affiliateLink,
              logoUrl: catalogInfo?.logoUrl,
            });
            continue;
          }

          // Generic fallback for ALL other blocks
          const blockCatalogInfo = blocksCatalog.get(blockName) || {};
          dashboardItems.push({
            id: blockName.toLowerCase().replace(/\s+/g, '-'),
            title: blockName,
            completionStatus,
            description: blockCatalogInfo.description || `Complete your ${blockName}`,
            isFree: blockCatalogInfo.isFree !== false,
            category: blockCatalogInfo.category,
            isAffiliate: blockCatalogInfo.isAffiliate,
            affiliateLink: blockCatalogInfo.affiliateLink,
            logoUrl: blockCatalogInfo.logoUrl,
          });
        }
        
        setItems(dashboardItems);
        loadSavedAssets(session.user.id);
      }
    };

  useEffect(() => {
    loadDashboardData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      loadDashboardData();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const loadSavedAssets = async (userId: string) => {
    const { data } = await supabase
      .from('user_assets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (data) {
      setSavedAssets(data);
    }
  };

  const handleCompleteBlock = (blockId: string, item?: DashboardItem) => {
    if (item?.isAffiliate && item.affiliateLink) {
      window.open(item.affiliateLink, '_blank');
      return;
    }

    switch (blockId) {
      case 'business-name-generator':
        navigate('/dashboard/business-name-generator');
        break;
      case 'domain-name-generator':
        navigate('/start/domain-selection');
        break;
      case 'logo-generator':
        navigate('/dashboard/logo-generation');
        break;
      case 'business-plan-generator':
        navigate('/dashboard/business-plan-generator');
        break;
      case 'social-media-checker':
        navigate('/dashboard/social-media-checker');
        break;
      case 'qr-code-generator':
        navigate('/dashboard/qr-code-generator');
        break;
      case 'email-signature':
        navigate('/dashboard/email-signature-generator');
        break;
    }
  };

  const handleDeleteAsset = async (assetId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('user_assets')
      .delete()
      .eq('id', assetId);

    loadSavedAssets(user.id);
    toast.success("Asset deleted");
  };

  const awaitingBlocks = items.filter(item => 
    item.completionStatus === 'not_started' || item.completionStatus === 'in_progress'
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-acari-dark via-acari-dark/95 to-acari-dark">
      <Header />
      
      {showVerificationBanner && (
        <VerificationBanner 
          email={userEmail}
          onVerified={() => {
            setEmailVerified(true);
            setShowVerificationBanner(false);
          }}
          onDismiss={() => setShowVerificationBanner(false)}
        />
      )}

      <div className="container mx-auto px-4 py-8 pt-24 max-w-7xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8 bg-white/5 border border-white/10">
            <TabsTrigger value="my-apps" className="data-[state=active]:bg-acari-green/20">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              My Apps
            </TabsTrigger>
            <TabsTrigger value="briefcase" className="data-[state=active]:bg-acari-green/20">
              <Briefcase className="w-4 h-4 mr-2" />
              Briefcase
            </TabsTrigger>
            <TabsTrigger value="app-store" className="data-[state=active]:bg-acari-green/20">
              <Store className="w-4 h-4 mr-2" />
              App Store
            </TabsTrigger>
            <TabsTrigger value="account" className="data-[state=active]:bg-acari-green/20">
              <User className="w-4 h-4 mr-2" />
              Account
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-apps" className="space-y-8">
            <div className="glass-card p-8 rounded-2xl border border-white/10 text-center space-y-4">
              <h1 className="text-4xl font-bold text-white">
                My Apps
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {businessData?.business_name || "Your Business"}
              </p>
            </div>

            {awaitingBlocks.length > 0 ? (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  {awaitingBlocks.map((item) => (
                    <div
                      key={item.id}
                      className="glass-card p-6 rounded-2xl border border-white/10 hover:border-acari-green/40 transition-all hover:shadow-lg hover:shadow-acari-green/10 flex flex-col"
                    >
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start gap-3">
                          {item.logoUrl && (
                            <img src={item.logoUrl} alt={item.title} className="w-10 h-10 rounded flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <h3 className="font-semibold text-foreground">{item.title}</h3>
                              {item.isFree && (
                                <Badge className="bg-acari-green/20 text-acari-green border-acari-green/30 text-xs">FREE</Badge>
                              )}
                              {item.isAffiliate && (
                                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30 text-xs">PARTNER</Badge>
                              )}
                              {item.category && (
                                <Badge variant="outline" className="text-xs">{item.category}</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-3">{item.description}</p>
                          </div>
                        </div>
                      </div>
                      <Button 
                        onClick={() => handleCompleteBlock(item.id, item)}
                        className="w-full bg-acari-green hover:bg-acari-green/90 text-black mt-4"
                      >
                        {item.isAffiliate ? 'Visit Partner Website' : 'Complete This Block'}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="glass-card p-8 rounded-2xl border border-white/10 text-center">
                <h3 className="text-xl font-semibold text-white mb-3">
                  All apps completed!
                </h3>
                <p className="text-muted-foreground mb-6">
                  Your saved work is available in the Briefcase tab. Add more apps from the App Store.
                </p>
                <Button
                  onClick={() => navigate('/dashboard/app-store')}
                  variant="outline"
                  className="border-acari-green/40 text-acari-green hover:bg-acari-green/10"
                >
                  <Store className="w-4 h-4 mr-2" />
                  Visit App Store
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="briefcase" className="space-y-6">
            <div className="glass-card p-8 rounded-2xl border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6">Saved Assets</h2>

              {savedAssets.length === 0 ? (
                <div className="text-center py-12">
                  <Briefcase className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Your saved assets will appear here
                  </p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {savedAssets.map((asset) => (
                    <div
                      key={asset.id}
                      className="glass-card p-4 rounded-lg border border-white/10 hover:border-acari-green/40 transition-all"
                    >
                      <div className="aspect-square mb-3 rounded overflow-hidden bg-white/5 flex items-center justify-center">
                        {asset.thumbnail_url ? (
                          <img
                            src={asset.thumbnail_url}
                            alt={asset.asset_type}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <img
                            src={asset.file_url}
                            alt={asset.asset_type}
                            className="w-full h-full object-contain"
                          />
                        )}
                      </div>
                      <div className="space-y-2">
                        <Badge variant="outline" className="text-xs">
                          {asset.asset_type}
                        </Badge>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 border-white/20 hover:bg-white/5"
                            onClick={() => window.open(asset.file_url, '_blank')}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-red-500/20 hover:bg-red-500/10 text-red-400"
                            onClick={() => handleDeleteAsset(asset.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="app-store" className="space-y-6">
            <AppStore />
          </TabsContent>

          <TabsContent value="account" className="space-y-6">
            <div className="glass-card p-8 rounded-2xl border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6">Account Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <Input
                    type="email"
                    value={userEmail}
                    disabled
                    className="mt-1 bg-white/5 border-white/10"
                  />
                </div>
                
                <div className="pt-4">
                  <Button
                    variant="destructive"
                    onClick={async () => {
                      await supabase.auth.signOut();
                      navigate("/");
                    }}
                  >
                    Sign Out
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;