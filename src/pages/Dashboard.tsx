import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CheckCircle2, Clock, AlertCircle, Rocket, FileText, Download, Edit3, LayoutDashboard, User, CreditCard, Briefcase, Trash2, Eye, Store, Calendar, Receipt } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
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
  status: "ready" | "in-progress" | "not-started";
  description: string;
  locked: boolean;
  approved: boolean;
  isFree?: boolean;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [businessData, setBusinessData] = useState<any>(null);
  const [items, setItems] = useState<DashboardItem[]>([]);
  const [logoSessionCount, setLogoSessionCount] = useState(0);
  const [savedAssets, setSavedAssets] = useState<any[]>([]);
  const [showLaunchDialog, setShowLaunchDialog] = useState(false);
  const [launchingBusiness, setLaunchingBusiness] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const [paidBlockCount, setPaidBlockCount] = useState(0);
  const [userEmail, setUserEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(true);
  const [showVerificationBanner, setShowVerificationBanner] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/");
        return;
      }

      setUserEmail(session.user.email || "");

      // Check email verification status
      const { data: profile } = await supabase
        .from('profiles')
        .select('email_verified')
        .eq('id', session.user.id)
        .maybeSingle();
      
      const verified = (profile as any)?.email_verified ?? true;
      setEmailVerified(verified);
      setShowVerificationBanner(!verified);

      // Load user's business data
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
        
        // Check logo generation sessions
        const { data: sessions } = await (supabase as any)
          .from('logo_generation_sessions')
          .select('id')
          .eq('user_id', session.user.id);
        
        setLogoSessionCount(sessions?.length || 0);
        
        // Build items from selected blocks
        const selectedBlocks = data.selected_blocks || [];
        const dashboardItems: DashboardItem[] = [];
        
        // Logo block - check for various naming patterns
        const hasLogoBlock = selectedBlocks.some((block: string) => 
          block.toLowerCase().includes('logo') || block.toLowerCase().includes('name')
        );
        
        if (hasLogoBlock) {
          const { data: logoAssets } = await (supabase as any)
            .from('user_assets')
            .select('*')
            .eq('user_id', session.user.id)
            .eq('asset_type', 'logo');
          
          const hasGenerated = sessions && sessions.length > 0;
          const hasSaved = logoAssets && logoAssets.length > 0;
          const hasApproved = logoAssets?.some((a: any) => a.status === 'approved');
          
          dashboardItems.push({
            id: "logo",
            title: "Logo designs",
            status: hasGenerated ? "ready" : "not-started",
            description: hasSaved 
              ? `${logoAssets.length} logo${logoAssets.length !== 1 ? 's' : ''} saved`
              : hasGenerated 
                ? "Ready to preview and save"
                : "Create your professional logo",
            locked: !hasSaved,
            approved: hasApproved || false,
            isFree: true,
          });
        }
        
        // Other blocks - default to in-progress for now
        selectedBlocks.forEach((block: string) => {
          const isLogoBlock = block.toLowerCase().includes('logo') || block.toLowerCase().includes('name');
          if (!isLogoBlock) {
            dashboardItems.push({
              id: block.toLowerCase().replace(/\s+/g, '-'),
              title: block,
              status: "in-progress",
              description: "Being prepared for you",
              locked: true,
              approved: false,
              isFree: false,
            });
          }
        });
        
        setItems(dashboardItems);
        
        // Calculate pricing for selected blocks
        await calculatePricing(data.selected_blocks || []);
      }
      
      // Load saved assets
      loadSavedAssets(session.user.id);
    };

    checkAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadSavedAssets = async (userId: string) => {
    const { data, error } = await (supabase as any)
      .from('user_assets')
      .select('*')
      .eq('user_id', userId)
      .in('status', ['saved', 'approved'])
      .order('created_at', { ascending: false });

    if (!error && data) {
      setSavedAssets(data);
    }
  };

  const handleApprove = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, approved: !item.approved } : item
      )
    );
  };

  const handleApproveAsset = async (assetId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await (supabase as any)
      .from('user_assets')
      .update({ status: 'approved' })
      .eq('id', assetId);

    loadSavedAssets(user.id);
  };

  const handleDeleteAsset = async (assetId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await (supabase as any)
      .from('user_assets')
      .delete()
      .eq('id', assetId);

    loadSavedAssets(user.id);
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

    // If only free blocks, skip Stripe and just activate
    if (paidBlockCount === 0) {
      setLaunchingBusiness(true);
      
      await supabase
        .from('user_businesses')
        .update({ status: 'launched', payment_status: 'completed' })
        .eq('id', businessData.id);

      toast("Your business is live! 🚀");
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
        toast("Please log in to continue");
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
      toast("Payment error. Please try again.");
      setLaunchingBusiness(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ready":
        return <CheckCircle2 className="w-5 h-5 text-neon-cyan" />;
      case "in-progress":
        return <Clock className="w-5 h-5 text-electric-indigo animate-pulse" />;
      case "not-started":
        return <AlertCircle className="w-5 h-5 text-muted-foreground" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ready":
        return <Badge className="bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20">Ready</Badge>;
      case "in-progress":
        return <Badge className="bg-electric-indigo/10 text-electric-indigo border-electric-indigo/20">Building</Badge>;
      case "not-started":
        return <Badge variant="outline" className="text-muted-foreground">Queued</Badge>;
      default:
        return null;
    }
  };

  const approvedCount = items.filter((item) => item.approved).length;
  const readyCount = items.filter((item) => item.status === "ready").length;

  return (
    <div className="relative min-h-screen overflow-hidden overflow-x-hidden">
      
      {/* Email Verification Banner */}
      {showVerificationBanner && (
        <VerificationBanner
          email={userEmail}
          onDismiss={() => setShowVerificationBanner(false)}
          onVerified={() => {
            setEmailVerified(true);
            setShowVerificationBanner(false);
            toast.success("Email verified!");
          }}
        />
      )}

      <div className="px-6 pt-32 pb-12">
        {/* Background ambient effects */}
        <div className="absolute top-1/4 left-1/4 w-[80vw] max-w-[600px] h-[80vw] max-h-[600px] rounded-full bg-neon-cyan/10 blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[80vw] max-w-[600px] h-[80vw] max-h-[600px] rounded-full bg-electric-indigo/10 blur-[120px] animate-float" style={{ animationDelay: "2s" }} />

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        {/* Dashboard Navigation Tabs */}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="w-full bg-background/5 backdrop-blur-sm border border-white/10 p-2 h-auto rounded-2xl">
            <TabsTrigger 
              value="dashboard" 
              className="flex-1 gap-2 data-[state=active]:bg-background/80 data-[state=active]:text-foreground rounded-xl px-4 py-3 text-sm md:text-base font-medium transition-all"
            >
              <LayoutDashboard className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger 
              value="app-store" 
              className="flex-1 gap-2 data-[state=active]:bg-background/80 data-[state=active]:text-foreground rounded-xl px-4 py-3 text-sm md:text-base font-medium transition-all"
              onClick={() => navigate("/dashboard/app-store")}
            >
              <Store className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">App Store</span>
            </TabsTrigger>
            <TabsTrigger 
              value="account" 
              className="flex-1 gap-2 data-[state=active]:bg-background/80 data-[state=active]:text-foreground rounded-xl px-4 py-3 text-sm md:text-base font-medium transition-all"
            >
              <User className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">Account</span>
            </TabsTrigger>
            <TabsTrigger 
              value="billing" 
              className="flex-1 gap-2 data-[state=active]:bg-background/80 data-[state=active]:text-foreground rounded-xl px-4 py-3 text-sm md:text-base font-medium transition-all"
              onClick={() => navigate("/dashboard/purchase-history")}
            >
              <Receipt className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">Purchases</span>
            </TabsTrigger>
            <TabsTrigger 
              value="briefcase" 
              className="flex-1 gap-2 data-[state=active]:bg-background/80 data-[state=active]:text-foreground rounded-xl px-4 py-3 text-sm md:text-base font-medium transition-all"
            >
              <Briefcase className="w-4 h-4 md:w-5 md:h-5" />
              <span className="hidden sm:inline">Briefcase</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="mt-8 space-y-8">
        {/* Top banner */}
        <div className="glass-card p-6 rounded-3xl border border-neon-cyan/20">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground font-light">
                Your launch package is building
              </p>
              <p className="text-xs text-muted-foreground/60">
                You only pay when you're ready to launch
              </p>
            </div>
            <Badge className="bg-electric-indigo/10 text-electric-indigo border-electric-indigo/20">
              {readyCount} of {items.length} ready
            </Badge>
          </div>
        </div>

        {/* Hero section */}
        <div className="text-center space-y-6 py-12">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter">
            <span className="block text-foreground mb-2">Your business is</span>
            <span className="block bg-gradient-to-r from-neon-cyan to-electric-indigo bg-clip-text text-transparent">
              coming to life
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed">
            Review your assets. Make edits. When you're ready, launch everything with one click.
          </p>
        </div>

        {/* Items grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className={cn(
                "glass-card p-6 rounded-2xl border transition-all duration-300",
                item.approved
                  ? "border-neon-cyan/50 bg-neon-cyan/5"
                  : "border-white/10 hover:border-neon-cyan/20"
              )}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(item.status)}
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-foreground">{item.title}</h3>
                        {item.isFree && (
                          <Badge className="bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20 text-xs">FREE</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  {getStatusBadge(item.status)}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  {item.status === "ready" && (
                    <>
                      <button
                        className="flex-1 gap-2 px-4 py-2 rounded-full border border-white/20 text-white text-sm hover:bg-white/5 transition-all disabled:opacity-50 inline-flex items-center justify-center"
                        disabled={item.locked}
                        onClick={() => {
                          if (!item.locked && item.id === 'logo') {
                            navigate('/dashboard/logos');
                          }
                        }}
                      >
                        <FileText className="w-4 h-4" />
                        {item.locked ? "Preview (locked)" : "Review"}
                      </button>
                      <button
                        className={`flex-1 gap-2 px-4 py-2 rounded-full text-sm transition-all inline-flex items-center justify-center ${
                          item.approved 
                            ? "bg-white text-black hover:bg-gray-100" 
                            : "border border-white/20 text-white hover:bg-white/5"
                        }`}
                        onClick={() => handleApprove(item.id)}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        {item.approved ? "Approved" : "Approve"}
                      </button>
                      <button className="gap-2 px-4 py-2 rounded-full border border-white/20 text-white text-sm hover:bg-white/5 transition-all inline-flex items-center justify-center">
                        <Edit3 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  {item.status === "in-progress" && (
                    <div className="flex-1 text-center py-2">
                      <p className="text-sm text-muted-foreground">Building...</p>
                    </div>
                  )}
                  {item.status === "not-started" && (
                    <button
                      className="flex-1 gap-2 px-4 py-2 rounded-full bg-white text-black hover:bg-gray-100 text-sm transition-all inline-flex items-center justify-center"
                      onClick={() => {
                        if (item.id === 'logo') {
                          navigate('/dashboard/logos');
                        }
                      }}
                    >
                      Create Logos
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Launch/Checkout section */}
        <div className="glass-card p-8 rounded-3xl border border-neon-purple/20 text-center space-y-6 mt-12">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              {paidBlockCount > 0 ? "Ready to unlock your products?" : "Ready to get started?"}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">
              {paidBlockCount > 0 
                ? "Review your selections and complete checkout to unlock everything and start building your business."
                : "Add monthly blocks from the App Store or activate your free blocks to get started."
              }
            </p>
          </div>

          {paidBlockCount > 0 ? (
            <button
              onClick={() => navigate('/dashboard/subscription-checkout')}
              className="group px-10 py-5 bg-acari-green text-black rounded-full font-medium text-lg hover:bg-acari-green/90 transition-all duration-200 shadow-lg inline-flex items-center gap-2"
            >
              <Rocket className="w-5 h-5 group-hover:translate-y-[-4px] transition-transform duration-300" />
              Checkout Now
            </button>
          ) : (
            <button
              onClick={() => navigate('/dashboard/app-store')}
              className="group px-10 py-5 bg-white text-black rounded-full font-medium text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg inline-flex items-center gap-2"
            >
              Browse Monthly Blocks
            </button>
          )}

          <div className="pt-4 space-y-2">
            <p className="text-sm text-muted-foreground/80">
              {paidBlockCount > 0 ? "You haven't been charged yet." : "Start with free blocks or explore our monthly subscriptions."}
            </p>
          </div>

          {/* What you'll get */}
          <div className="pt-8 border-t border-white/5">
            <p className="text-sm font-semibold text-foreground/80 mb-4">When you launch, you get:</p>
            <div className="grid sm:grid-cols-2 gap-3 text-sm text-muted-foreground text-left max-w-2xl mx-auto">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-neon-cyan flex-shrink-0" />
                <span>High-res logo files</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-neon-cyan flex-shrink-0" />
                <span>Business cards ordered</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-neon-cyan flex-shrink-0" />
                <span>Website goes live</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-neon-cyan flex-shrink-0" />
                <span>EIN/LLC filings submitted</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-neon-cyan flex-shrink-0" />
                <span>CRM/emails connected</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-neon-cyan flex-shrink-0" />
                <span>Brand kit ZIP download</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-neon-cyan flex-shrink-0" />
                <span>Marketing kit unlocked</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-neon-cyan flex-shrink-0" />
                <span>Full admin access</span>
              </div>
            </div>
          </div>
        </div>
          </TabsContent>

          <TabsContent value="account" className="mt-8">
            <div className="glass-card p-8 rounded-3xl border border-white/10">
              <h2 className="text-2xl font-bold text-foreground mb-6">Account Settings</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-foreground">Email</Label>
                  <Input
                    type="email"
                    value={businessData?.email || ''}
                    disabled
                    className="bg-background/50 text-muted-foreground"
                  />
                  <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-foreground">Business Name</Label>
                  <Input
                    type="text"
                    value={businessData?.business_name || ''}
                    onChange={async (e) => {
                      const newName = e.target.value;
                      if (businessData?.id) {
                        const { error } = await supabase
                          .from('user_businesses')
                          .update({ business_name: newName })
                          .eq('id', businessData.id);
                        
                        if (!error) {
                          setBusinessData({ ...businessData, business_name: newName });
                        }
                      }
                    }}
                    className="bg-background/50 text-foreground"
                  />
                  <p className="text-xs text-yellow-500">⚠️ Changing your business name will affect future assets. Existing assets keep their original name.</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="billing" className="mt-8">
            <div className="glass-card p-8 rounded-3xl border border-white/10">
              <h2 className="text-2xl font-bold text-foreground mb-4">Billing</h2>
              <p className="text-muted-foreground">Billing information coming soon...</p>
            </div>
          </TabsContent>

          <TabsContent value="briefcase" className="mt-8 space-y-6">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-foreground">My Apps</h2>
              <p className="text-muted-foreground">All your saved business assets ({savedAssets.length})</p>
            </div>

            {savedAssets.length === 0 ? (
              <div className="glass-card p-12 rounded-3xl border border-white/10 text-center">
                <p className="text-muted-foreground">No assets saved yet. Generate and save assets from the Dashboard.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {savedAssets.map((asset) => (
                  <div
                    key={asset.id}
                    className={cn(
                      "glass-card rounded-2xl border overflow-hidden transition-all group",
                      asset.status === 'approved'
                        ? "border-neon-cyan/50 bg-neon-cyan/5"
                        : "border-white/10"
                    )}
                  >
                    {/* Asset Preview */}
                    <div className="relative aspect-square bg-gradient-to-br from-white/5 to-white/10 p-4">
                      <div
                        className="absolute inset-0 opacity-10"
                        style={{
                          backgroundImage: `
                            linear-gradient(45deg, #ccc 25%, transparent 25%),
                            linear-gradient(-45deg, #ccc 25%, transparent 25%),
                            linear-gradient(45deg, transparent 75%, #ccc 75%),
                            linear-gradient(-45deg, transparent 75%, #ccc 75%)
                          `,
                          backgroundSize: '20px 20px',
                          backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px'
                        }}
                      />
                      
                      <img
                        src={asset.file_url}
                        alt={`${asset.asset_type} ${asset.metadata?.logo_number || ''}`}
                        className="relative w-full h-full object-contain"
                      />
                    </div>
                    
                    {/* Asset Info */}
                    <div className="p-3 border-t border-white/10 space-y-2">
                      <div className="flex items-center justify-between gap-1">
                        <Badge className="bg-primary/10 text-primary border-primary/30 text-[10px]">
                          {asset.asset_type.toUpperCase()}
                        </Badge>
                        {asset.status === 'approved' && (
                          <Badge className="bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20 text-[10px]">
                            ✓
                          </Badge>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 rounded-full text-xs h-7"
                          onClick={() => window.open(asset.file_url, '_blank')}
                        >
                          <Eye className="w-3 h-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 rounded-full text-xs h-7"
                          onClick={async () => {
                            const response = await fetch(asset.file_url);
                            const blob = await response.blob();
                            const url = window.URL.createObjectURL(blob);
                            const link = document.createElement('a');
                            link.href = url;
                            link.download = `${asset.asset_type}-${asset.metadata?.logo_number || 'download'}.png`;
                            document.body.appendChild(link);
                            link.click();
                            window.URL.revokeObjectURL(url);
                            document.body.removeChild(link);
                          }}
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                      </div>

                      <div className="flex gap-1">
                        {asset.status !== 'approved' && (
                          <Button
                            size="sm"
                            className="flex-1 rounded-full bg-white text-black hover:bg-gray-100 text-xs h-7"
                            onClick={() => handleApproveAsset(asset.id)}
                          >
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Approve
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 rounded-full border-red-500/20 text-red-400 hover:bg-red-500/10 text-xs h-7"
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
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Launch Confirmation Dialog */}
      <AlertDialog open={showLaunchDialog} onOpenChange={setShowLaunchDialog}>
        <AlertDialogContent className="bg-background border border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl font-bold">Ready to Launch? 🚀</AlertDialogTitle>
            <AlertDialogDescription className="text-base space-y-4 pt-4">
              <div>
                You're about to launch with <span className="font-bold text-foreground">{paidBlockCount} paid block{paidBlockCount !== 1 ? 's' : ''}</span>.
              </div>
              <div className="text-2xl font-bold text-neon-cyan">
                Total: ${(totalCost / 100).toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground pt-2">
                You'll be redirected to Stripe to complete your payment. After successful payment, all your assets will unlock and your business will go live.
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full" disabled={launchingBusiness}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={proceedToCheckout}
              className="rounded-full bg-white text-black hover:bg-gray-100"
              disabled={launchingBusiness}
            >
              {launchingBusiness ? "Processing..." : "Continue to Payment"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
    </div>
  );
};

export default Dashboard;
