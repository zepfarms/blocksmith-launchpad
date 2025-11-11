import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { CheckCircle2, Clock, AlertCircle, Rocket, FileText, Download, Edit3, LayoutDashboard, User, CreditCard, Briefcase, Trash2, Eye } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";

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

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        navigate("/");
        return;
      }

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
    <div className="min-h-screen px-6 pt-32 pb-12">
      <Header />
      {/* Background ambient effects */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-neon-cyan/10 blur-[120px] animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-electric-indigo/10 blur-[120px] animate-float" style={{ animationDelay: "2s" }} />

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
        {/* Dashboard Navigation Tabs */}
        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="w-full bg-background/5 backdrop-blur-sm border border-white/10 p-2 h-auto rounded-2xl">
            <TabsTrigger 
              value="dashboard" 
              className="flex-1 gap-2 data-[state=active]:bg-background/80 data-[state=active]:text-foreground rounded-xl px-4 py-3 text-sm md:text-base font-medium transition-all"
            >
              <LayoutDashboard className="w-4 h-4 md:w-5 md:h-5" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="account" 
              className="flex-1 gap-2 data-[state=active]:bg-background/80 data-[state=active]:text-foreground rounded-xl px-4 py-3 text-sm md:text-base font-medium transition-all"
            >
              <User className="w-4 h-4 md:w-5 md:h-5" />
              Account
            </TabsTrigger>
            <TabsTrigger 
              value="billing" 
              className="flex-1 gap-2 data-[state=active]:bg-background/80 data-[state=active]:text-foreground rounded-xl px-4 py-3 text-sm md:text-base font-medium transition-all"
            >
              <CreditCard className="w-4 h-4 md:w-5 md:h-5" />
              Billing
            </TabsTrigger>
            <TabsTrigger 
              value="briefcase" 
              className="flex-1 gap-2 data-[state=active]:bg-background/80 data-[state=active]:text-foreground rounded-xl px-4 py-3 text-sm md:text-base font-medium transition-all"
            >
              <Briefcase className="w-4 h-4 md:w-5 md:h-5" />
              Briefcase
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

        {/* Launch section */}
        <div className="glass-card p-8 rounded-3xl border border-neon-purple/20 text-center space-y-6 mt-12">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Ready to go live?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-light">
              {approvedCount > 0 
                ? `You've approved ${approvedCount} item${approvedCount !== 1 ? "s" : ""}. Launch to unlock your assets and go live.`
                : "Approve the items above, then launch your business with one click."
              }
            </p>
          </div>

          <button
            className="group px-10 py-5 bg-white text-black rounded-full font-medium text-lg hover:bg-gray-100 transition-all duration-200 shadow-lg inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={approvedCount === 0}
          >
            <Rocket className="w-5 h-5 group-hover:translate-y-[-4px] transition-transform duration-300" />
            Launch My Business
          </button>

          <div className="pt-4 space-y-2">
            <p className="text-sm text-muted-foreground/80">
              You haven't been charged yet.
            </p>
            <p className="text-xs text-muted-foreground/60 max-w-xl mx-auto">
              Your assets will unlock and your business will go live after payment.
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
              <h2 className="text-3xl font-bold text-foreground">Your Assets</h2>
              <p className="text-muted-foreground">All your generated and saved business assets in one place</p>
            </div>

            {/* Logos Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-semibold text-foreground">Logos</h3>
                <Badge className="bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20">
                  {savedAssets.filter(a => a.asset_type === 'logo').length} saved
                </Badge>
              </div>

              {savedAssets.filter(a => a.asset_type === 'logo').length === 0 ? (
                <div className="glass-card p-12 rounded-3xl border border-white/10 text-center">
                  <p className="text-muted-foreground">No logos saved yet. Generate and save logos from the Dashboard.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedAssets.filter(a => a.asset_type === 'logo').map((asset) => (
                    <div
                      key={asset.id}
                      className={cn(
                        "glass-card rounded-2xl border overflow-hidden transition-all",
                        asset.status === 'approved'
                          ? "border-neon-cyan/50 bg-neon-cyan/5"
                          : "border-white/10"
                      )}
                    >
                      <div className="relative aspect-square bg-gradient-to-br from-white/5 to-white/10 p-8">
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
                          alt={`Logo ${asset.metadata?.logo_number || ''}`}
                          className="relative w-full h-full object-contain"
                        />
                      </div>
                      
                      <div className="p-4 border-t border-white/10 space-y-3">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">
                            Logo {asset.metadata?.logo_number || ''}
                          </p>
                          {asset.status === 'approved' && (
                            <Badge className="bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20 text-xs">
                              Approved ✓
                            </Badge>
                          )}
                        </div>

                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 rounded-full"
                            onClick={() => window.open(asset.file_url, '_blank')}
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Preview
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 rounded-full"
                            onClick={async () => {
                              const response = await fetch(asset.file_url);
                              const blob = await response.blob();
                              const url = window.URL.createObjectURL(blob);
                              const link = document.createElement('a');
                              link.href = url;
                              link.download = `logo-${asset.metadata?.logo_number || 'download'}.png`;
                              document.body.appendChild(link);
                              link.click();
                              window.URL.revokeObjectURL(url);
                              document.body.removeChild(link);
                            }}
                          >
                            <Download className="w-3 h-3 mr-1" />
                            Download
                          </Button>
                        </div>

                        <div className="flex gap-2">
                          {asset.status !== 'approved' && (
                            <Button
                              size="sm"
                              className="flex-1 rounded-full bg-white text-black hover:bg-gray-100"
                              onClick={() => handleApproveAsset(asset.id)}
                            >
                              <CheckCircle2 className="w-3 h-3 mr-1" />
                              Approve
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 rounded-full border-red-500/20 text-red-400 hover:bg-red-500/10"
                            onClick={() => handleDeleteAsset(asset.id)}
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Other Asset Types - Coming Soon */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Business Cards</h3>
              <div className="glass-card p-8 rounded-3xl border border-white/10 text-center">
                <p className="text-muted-foreground">Coming soon...</p>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Social Media Kit</h3>
              <div className="glass-card p-8 rounded-3xl border border-white/10 text-center">
                <p className="text-muted-foreground">Coming soon...</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
