import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, AlertCircle, Rocket, FileText, Download, Edit3 } from "lucide-react";
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
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [businessData, setBusinessData] = useState<any>(null);
  const [items, setItems] = useState<DashboardItem[]>([
    {
      id: "logo",
      title: "Logo designs",
      status: "ready",
      description: "3 professional logo variations",
      locked: true,
      approved: false,
    },
    {
      id: "business-cards",
      title: "Business card templates",
      status: "ready",
      description: "Print-ready business card designs",
      locked: true,
      approved: false,
    },
    {
      id: "domain",
      title: "Domain recommendations",
      status: "ready",
      description: "Available domain options for your business",
      locked: false,
      approved: false,
    },
    {
      id: "website",
      title: "Website preview",
      status: "in-progress",
      description: "Your business website is being built",
      locked: true,
      approved: false,
    },
    {
      id: "legal",
      title: "Legal paperwork queue",
      status: "not-started",
      description: "LLC/EIN filing documents",
      locked: true,
      approved: false,
    },
    {
      id: "email",
      title: "Email domain",
      status: "ready",
      description: "Professional email setup drafted",
      locked: true,
      approved: false,
    },
    {
      id: "social",
      title: "Social kit",
      status: "in-progress",
      description: "Social media templates uploading",
      locked: true,
      approved: false,
    },
    {
      id: "marketing",
      title: "Marketing plan",
      status: "ready",
      description: "Customer acquisition strategy",
      locked: false,
      approved: false,
    },
  ]);

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
      }
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

  const handleApprove = (id: string) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, approved: !item.approved } : item
      )
    );
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
    <div className="min-h-screen px-6 py-12">
      <Header />
      {/* Background ambient effects */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full bg-neon-cyan/10 blur-[120px] animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] rounded-full bg-electric-indigo/10 blur-[120px] animate-float" style={{ animationDelay: "2s" }} />

      <div className="relative z-10 max-w-6xl mx-auto space-y-8">
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
                      <h3 className="font-semibold text-foreground">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                  {getStatusBadge(item.status)}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  {item.status === "ready" && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 gap-2"
                        disabled={item.locked}
                      >
                        <FileText className="w-4 h-4" />
                        {item.locked ? "Preview (locked)" : "Review"}
                      </Button>
                      <Button
                        variant={item.approved ? "default" : "outline"}
                        size="sm"
                        className={cn(
                          "flex-1 gap-2",
                          item.approved && "bg-neon-cyan text-background"
                        )}
                        onClick={() => handleApprove(item.id)}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        {item.approved ? "Approved" : "Approve"}
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-2">
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  {item.status === "in-progress" && (
                    <div className="flex-1 text-center py-2">
                      <p className="text-sm text-muted-foreground">Building...</p>
                    </div>
                  )}
                  {item.status === "not-started" && (
                    <div className="flex-1 text-center py-2">
                      <p className="text-sm text-muted-foreground">In queue</p>
                    </div>
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

          <Button
            variant="empire"
            size="xl"
            className="group gap-3"
            disabled={approvedCount === 0}
          >
            <Rocket className="w-5 h-5 group-hover:translate-y-[-4px] transition-transform duration-300" />
            Launch My Business
          </Button>

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
      </div>
    </div>
  );
};

export default Dashboard;
