import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CheckCircle2, Rocket, LayoutDashboard, User, CreditCard, Briefcase, Trash2, Eye, Store, HelpCircle, BookOpen, MessageCircle, FileText } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { VerificationBanner } from "@/components/VerificationBanner";
import { toast } from "sonner";

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
  const [showCompleted, setShowCompleted] = useState(false);

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
      const description = clean(matches[2]);
      const isAffiliateRaw = clean(matches[7]) || 'FALSE';
      const affiliateLink = clean(matches[8]) || '';
      const logoUrl = clean(matches[9]) || '';
      
      catalogMap.set(name, {
        category,
        description,
        isAffiliate: isAffiliateRaw.toUpperCase() === 'TRUE',
        affiliateLink,
        logoUrl
      });
    });
    
    return catalogMap;
  };

  useEffect(() => {
    const checkAuth = async () => {
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
            });
          }
          
          if (blockName === 'Domain Name Generator') {
            const { data: domainData } = await supabase
              .from('user_domain_selections')
              .select('*')
              .eq('user_id', session.user.id)
              .eq('business_id', data.id)
              .maybeSingle();
            
            dashboardItems.push({
              id: "domain-name-generator",
              title: "Domain Name Generator",
              completionStatus,
              description: domainData?.domain_name 
                ? `Domain: ${domainData.domain_name}`
                : domainData?.domain_status === 'skipped'
                  ? "Skipped for now"
                  : "Enter your domain or generate new ideas for your business",
              isFree: true,
            });
          }
          
          if (blockName.toLowerCase().includes('logo')) {
            const { data: logoAssets } = await supabase
              .from('user_assets')
              .select('*')
              .eq('user_id', session.user.id)
              .eq('asset_type', 'logo');
            
            dashboardItems.push({
              id: "logo",
              title: "Logo Generator",
              completionStatus,
              description: logoAssets && logoAssets.length > 0
                ? `${logoAssets.length} logo${logoAssets.length !== 1 ? 's' : ''} saved`
                : "Create your professional logo",
              isFree: true,
            });
          }
          
          if (blockName === 'Business Plan Generator') {
            const { data: planData } = await supabase
              .from('business_plans')
              .select('*')
              .eq('user_id', session.user.id)
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
            });
          }
          
          if (blockName === 'Social Media Handle Checker') {
            dashboardItems.push({
              id: "social-media-checker",
              title: "Social Media Handle Checker",
              completionStatus,
              description: "Check availability across all major platforms",
              isFree: true,
            });
          }
          
          if (blockName === 'QR Code Generator') {
            dashboardItems.push({
              id: "qr-code-generator",
              title: "QR Code Generator",
              completionStatus,
              description: "Create custom QR codes for your business",
              isFree: true,
            });
          }
          
          if (blockName === 'Professional Email Signature') {
            dashboardItems.push({
              id: "email-signature",
              title: "Professional Email Signature",
              completionStatus,
              description: "Generate professional email signatures",
              isFree: true,
            });
          }
        }
        
        setItems(dashboardItems);
        loadSavedAssets(session.user.id);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      checkAuth();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const loadSavedAssets = async (userId: string) => {
    const { data, error } = await supabase
      .from('user_assets')
      .select('*')
      .eq('user_id', userId)
      .in('status', ['saved', 'approved'])
      .order('created_at', { ascending: false });

    if (!error && data) {
      setSavedAssets(data);
    }
  };

  const handleCompleteBlock = (id: string, item?: DashboardItem) => {
    // Handle affiliate blocks - open link in new tab
    if (item?.isAffiliate && item.affiliateLink) {
      window.open(item.affiliateLink, '_blank', 'noopener,noreferrer');
      toast.success(`Opening ${item.title} in a new tab`);
      return;
    }
    
    switch (id) {
      case 'business-name-generator':
        navigate('/dashboard/business-name-generator');
        break;
      case 'domain-name-generator':
        navigate('/dashboard/domain-name-generator');
        break;
      case 'logo':
        navigate('/dashboard/logos');
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
  const completedBlocks = items.filter(item => item.completionStatus === 'completed');
  const recommendedBlock = awaitingBlocks[0];

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
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8 bg-white/5 border border-white/10">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-acari-green/20">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="app-store" className="data-[state=active]:bg-acari-green/20">
              <Store className="w-4 h-4 mr-2" />
              App Store
            </TabsTrigger>
            <TabsTrigger value="account" className="data-[state=active]:bg-acari-green/20">
              <User className="w-4 h-4 mr-2" />
              Account
            </TabsTrigger>
            <TabsTrigger value="purchases" className="data-[state=active]:bg-acari-green/20">
              <CreditCard className="w-4 h-4 mr-2" />
              Purchases
            </TabsTrigger>
            <TabsTrigger value="briefcase" className="data-[state=active]:bg-acari-green/20">
              <Briefcase className="w-4 h-4 mr-2" />
              Briefcase
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-8">
            <div className="glass-card p-8 rounded-2xl border border-white/10 text-center space-y-4">
              <h1 className="text-4xl font-bold text-white">
                Welcome to Your Business Dashboard
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                {businessData?.business_name || "Your Business"}
              </p>
            </div>

            {awaitingBlocks.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Rocket className="w-6 h-6 text-acari-green" />
                  Recommended Next Steps
                </h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {awaitingBlocks.map((item) => (
                    <div
                      key={item.id}
                      className="glass-card p-6 rounded-2xl border border-white/10 hover:border-acari-green/40 transition-all hover:shadow-lg hover:shadow-acari-green/10 flex flex-col"
                    >
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start gap-3">
                          {item.logoUrl && item.isAffiliate && (
                            <img src={item.logoUrl} alt={item.title} className="w-10 h-10 rounded flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <h3 className="font-semibold text-foreground">{item.title}</h3>
                              {item.isFree && (
                                <Badge className="bg-acari-green/20 text-acari-green border-acari-green/30 text-xs">FREE</Badge>
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
            )}

            {/* Looking for more apps section */}
            <div className="glass-card p-8 rounded-2xl border border-white/10 text-center">
              <h3 className="text-xl font-semibold text-white mb-3">
                Looking to add more apps?
              </h3>
              <p className="text-muted-foreground mb-6">
                Discover additional tools and features in our App Store
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

            {completedBlocks.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-6 h-6 text-acari-green" />
                    Completed Blocks
                  </h2>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="show-completed" className="text-sm text-muted-foreground">
                      Show completed
                    </Label>
                    <Switch 
                      id="show-completed"
                      checked={showCompleted}
                      onCheckedChange={setShowCompleted}
                    />
                  </div>
                </div>
                
                {showCompleted && (
                  <div className="grid gap-4 md:grid-cols-2">
                    {completedBlocks.map((item) => (
                      <div
                        key={item.id}
                        className="glass-card p-6 rounded-2xl border border-acari-green/30 bg-acari-green/5"
                      >
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-foreground">{item.title}</h3>
                                <Badge className="bg-acari-green/20 text-acari-green border-acari-green/30">
                                  Complete ✓
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              onClick={() => handleCompleteBlock(item.id)}
                              variant="outline"
                              className="flex-1 border-white/20 hover:bg-white/5"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View
                            </Button>
                            <Button 
                              onClick={() => handleCompleteBlock(item.id)}
                              variant="outline"
                              className="flex-1 border-white/20 hover:bg-white/5"
                            >
                              Use Again
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="glass-card p-8 rounded-2xl border border-white/10 space-y-6">
              <div className="text-center space-y-2">
                <HelpCircle className="w-12 h-12 mx-auto text-acari-green" />
                <h2 className="text-2xl font-bold text-white">Need Help Getting Started?</h2>
                <p className="text-muted-foreground">Access helpful resources and support</p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => navigate('/support')}
                  className="glass-card p-6 rounded-xl border border-white/10 hover:border-acari-green/40 transition-all hover:shadow-lg hover:shadow-acari-green/10 text-left group"
                >
                  <BookOpen className="w-8 h-8 mb-3 text-acari-green" />
                  <h3 className="font-semibold text-white mb-1 group-hover:text-acari-green transition-colors">FAQs & Support</h3>
                  <p className="text-sm text-muted-foreground">Find answers to common questions</p>
                </button>

                <button
                  onClick={() => navigate('/templates')}
                  className="glass-card p-6 rounded-xl border border-white/10 hover:border-acari-green/40 transition-all hover:shadow-lg hover:shadow-acari-green/10 text-left group"
                >
                  <FileText className="w-8 h-8 mb-3 text-acari-green" />
                  <h3 className="font-semibold text-white mb-1 group-hover:text-acari-green transition-colors">View Templates</h3>
                  <p className="text-sm text-muted-foreground">Browse website design templates</p>
                </button>

                <button
                  onClick={() => window.location.href = 'mailto:support@acari.com'}
                  className="glass-card p-6 rounded-xl border border-white/10 hover:border-acari-green/40 transition-all hover:shadow-lg hover:shadow-acari-green/10 text-left group"
                >
                  <MessageCircle className="w-8 h-8 mb-3 text-acari-green" />
                  <h3 className="font-semibold text-white mb-1 group-hover:text-acari-green transition-colors">Contact Support</h3>
                  <p className="text-sm text-muted-foreground">Get direct help from our team</p>
                </button>

                <button
                  onClick={() => navigate('/features')}
                  className="glass-card p-6 rounded-xl border border-white/10 hover:border-acari-green/40 transition-all hover:shadow-lg hover:shadow-acari-green/10 text-left group"
                >
                  <Rocket className="w-8 h-8 mb-3 text-acari-green" />
                  <h3 className="font-semibold text-white mb-1 group-hover:text-acari-green transition-colors">Getting Started Guide</h3>
                  <p className="text-sm text-muted-foreground">Learn how to use the platform</p>
                </button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="app-store">
            <div className="text-center py-12">
              <Store className="w-16 h-16 mx-auto mb-4 text-acari-green" />
              <h2 className="text-2xl font-bold text-white mb-2">App Store</h2>
              <p className="text-muted-foreground mb-4">Browse and add more blocks to your business</p>
              <Button onClick={() => navigate('/dashboard/app-store')} className="bg-acari-green hover:bg-acari-green/90 text-black">
                Browse Apps
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="account" className="space-y-6">
            <div className="glass-card p-6 rounded-2xl border border-white/10">
              <h2 className="text-xl font-bold text-white mb-4">Account Information</h2>
              <div className="space-y-4">
                <div>
                  <Label>Email</Label>
                  <Input value={userEmail} disabled className="bg-white/5" />
                </div>
                <div>
                  <Label>Business Name</Label>
                  <Input value={businessData?.business_name || ""} disabled className="bg-white/5" />
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="purchases">
            <div className="glass-card p-6 rounded-2xl border border-white/10 text-center">
              <CreditCard className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="text-xl font-bold text-white mb-2">Purchase History</h2>
              <p className="text-muted-foreground">Your purchase history will appear here</p>
            </div>
          </TabsContent>

          <TabsContent value="briefcase" className="space-y-6">
            <div className="glass-card p-6 rounded-2xl border border-white/10">
              <h2 className="text-xl font-bold text-white mb-4">Saved Assets</h2>
              {savedAssets.length === 0 ? (
                <div className="text-center py-8">
                  <Briefcase className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground">No saved assets yet</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {savedAssets.map((asset) => (
                    <div key={asset.id} className="glass-card p-4 rounded-xl border border-white/10">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-white capitalize">{asset.asset_type}</h3>
                          <p className="text-sm text-muted-foreground">
                            {new Date(asset.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(asset.file_url, '_blank')}
                            className="border-white/20"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteAsset(asset.id)}
                            className="border-white/20 text-red-400 hover:text-red-300"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

    </div>
  );
};

export default Dashboard;