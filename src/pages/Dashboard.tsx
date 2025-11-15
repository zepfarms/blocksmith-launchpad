import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CheckCircle2, Rocket, LayoutDashboard, User, CreditCard, Briefcase, Trash2, Eye, Store } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { VerificationBanner } from "@/components/VerificationBanner";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DashboardItem {
  id: string;
  title: string;
  completionStatus: "not_started" | "in_progress" | "completed";
  description: string;
  isFree?: boolean;
  category?: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [businessData, setBusinessData] = useState<any>(null);
  const [items, setItems] = useState<DashboardItem[]>([]);
  const [savedAssets, setSavedAssets] = useState<any[]>([]);
  const [showLaunchDialog, setShowLaunchDialog] = useState(false);
  const [launchingBusiness, setLaunchingBusiness] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const [paidBlockCount, setPaidBlockCount] = useState(0);
  const [userEmail, setUserEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(true);
  const [showVerificationBanner, setShowVerificationBanner] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);

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
        
        for (const blockName of allBlocks) {
          const unlock = unlockedBlocks?.find(u => u.block_name === blockName);
          const completionStatus = (unlock?.completion_status || 'not_started') as "not_started" | "in_progress" | "completed";
          
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
          
          if (blockName === 'Domain + Website') {
            dashboardItems.push({
              id: "website-builder",
              title: "Website Builder",
              completionStatus,
              description: "Build and launch your professional website",
              isFree: false,
            });
          }
        }
        
        setItems(dashboardItems);
        calculatePricing(allBlocks);
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

  const handleCompleteBlock = (id: string) => {
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
      case 'website-builder':
        navigate('/dashboard/website-builder');
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

  const calculatePricing = async (selectedBlocks: string[]) => {
    if (!selectedBlocks || selectedBlocks.length === 0) {
      setTotalCost(0);
      setPaidBlockCount(0);
      return;
    }

    const { data: pricing, error } = await supabase
      .from('blocks_pricing')
      .select('*')
      .in('block_name', selectedBlocks);

    if (!error && pricing) {
      const paidBlocks = pricing.filter(p => !p.is_free && p.price_cents > 0);
      const total = paidBlocks.reduce((sum, block) => sum + block.price_cents, 0);
      setTotalCost(total);
      setPaidBlockCount(paidBlocks.length);
    }
  };

  const handleLaunchBusiness = async () => {
    if (!businessData) return;

    if (paidBlockCount === 0) {
      setLaunchingBusiness(true);
      
      await supabase
        .from('user_businesses')
        .update({ status: 'launched', payment_status: 'completed' })
        .eq('id', businessData.id);

      toast.success("Your business is live! 🚀");
      setLaunchingBusiness(false);
      window.location.reload();
      return;
    }

    setShowLaunchDialog(true);
  };

  const proceedToCheckout = async () => {
    if (!businessData) return;

    setLaunchingBusiness(true);
    setShowLaunchDialog(false);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Please log in to continue");
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        body: { blockNames: businessData.selected_blocks }
      });

      if (error) throw error;

      if (data?.sessionUrl) {
        window.location.href = data.sessionUrl;
      }
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error("Payment error. Please try again.");
    } finally {
      setLaunchingBusiness(false);
    }
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

            {recommendedBlock && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <Rocket className="w-6 h-6 text-acari-green" />
                  Recommended Next Step
                </h2>
                <div className="glass-card p-6 rounded-2xl border border-acari-green/40 bg-acari-green/5">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-semibold text-white">{recommendedBlock.title}</h3>
                        {recommendedBlock.isFree && (
                          <Badge className="bg-acari-green/20 text-acari-green border-acari-green/30">FREE</Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground mb-4">{recommendedBlock.description}</p>
                      <Button 
                        onClick={() => handleCompleteBlock(recommendedBlock.id)}
                        className="bg-acari-green hover:bg-acari-green/90 text-black font-semibold"
                      >
                        Complete This Block
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {awaitingBlocks.length > 1 && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-white">Apps Awaiting Completion</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {awaitingBlocks.slice(1).map((item) => (
                    <div
                      key={item.id}
                      className="glass-card p-6 rounded-2xl border border-white/10 hover:border-acari-green/40 transition-all hover:shadow-lg hover:shadow-acari-green/10"
                    >
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-foreground">{item.title}</h3>
                              {item.isFree && (
                                <Badge className="bg-acari-green/20 text-acari-green border-acari-green/30 text-xs">FREE</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => handleCompleteBlock(item.id)}
                            className="flex-1 bg-acari-green hover:bg-acari-green/90 text-black"
                          >
                            Complete This Block
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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

            <div className="glass-card p-8 rounded-2xl border border-white/10 text-center space-y-4">
              <h2 className="text-2xl font-bold text-white">Ready to Launch?</h2>
              <p className="text-muted-foreground">
                {paidBlockCount > 0 
                  ? `Complete checkout for ${paidBlockCount} paid block${paidBlockCount > 1 ? 's' : ''} ($${(totalCost / 100).toFixed(2)})`
                  : "All your blocks are free - launch now!"}
              </p>
              <Button
                onClick={handleLaunchBusiness}
                disabled={launchingBusiness}
                className="bg-acari-green hover:bg-acari-green/90 text-black font-bold text-lg px-8 py-6"
              >
                {launchingBusiness ? "Processing..." : paidBlockCount > 0 ? "Proceed to Checkout" : "Launch Business"}
              </Button>
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

      <AlertDialog open={showLaunchDialog} onOpenChange={setShowLaunchDialog}>
        <AlertDialogContent className="bg-acari-dark border-white/20">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">Ready to Launch?</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              You have {paidBlockCount} paid block{paidBlockCount > 1 ? 's' : ''} totaling ${(totalCost / 100).toFixed(2)}.
              Proceed to checkout to complete your purchase and launch your business.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-white/5 border-white/20 hover:bg-white/10">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={proceedToCheckout}
              className="bg-acari-green hover:bg-acari-green/90 text-black"
            >
              Proceed to Checkout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;