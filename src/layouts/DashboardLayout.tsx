import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { VerificationBanner } from "@/components/VerificationBanner";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/AuthModal";
import { User } from "@supabase/supabase-js";
import { Menu, LayoutDashboard, Package, Briefcase, Store, Settings, HelpCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "My Apps", url: "/dashboard/my-apps", icon: Package },
  { title: "Briefcase", url: "/dashboard/briefcase", icon: Briefcase },
  { title: "App Store", url: "/dashboard/app-store", icon: Store },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
  { title: "Help & Support", url: "/dashboard/help", icon: HelpCircle },
];

export const DashboardLayout = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [emailVerified, setEmailVerified] = useState(true);

  useEffect(() => {
    const checkEmailVerification = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        setUser(user);
        const { data: profile } = await supabase
          .from('profiles')
          .select('email_verified')
          .eq('id', user.id)
          .single();
        
        if (profile && !profile.email_verified) {
          setEmailVerified(false);
        }
      }
      
      setChecking(false);
    };

    checkEmailVerification();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        supabase
          .from('profiles')
          .select('email_verified')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile }) => {
            setEmailVerified(profile?.email_verified ?? false);
          });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (checking) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Dashboard Header */}
      <header className="fixed top-0 left-0 right-0 z-[100] px-3 sm:px-6 py-2 bg-black border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <img 
            src="/acari-logo.png" 
            alt="Acari" 
            className="h-14 sm:h-20 md:h-24 w-auto cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate("/")}
          />

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 text-white border border-white/20 hover:bg-white/10 rounded-full px-3 sm:px-4">
                  <Menu className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end" 
                className="z-[200] min-w-[200px] bg-background border border-white/20 backdrop-blur-xl shadow-xl"
              >
                {menuItems.map((item) => (
                  <DropdownMenuItem 
                    key={item.url}
                    onClick={() => navigate(item.url)} 
                    className="text-foreground hover:bg-white/10 focus:bg-white/10 cursor-pointer gap-3"
                  >
                    <item.icon className="w-4 h-4" />
                    {item.title}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator className="bg-white/10" />
                <DropdownMenuItem 
                  onClick={handleLogout} 
                  className="text-foreground hover:bg-white/10 focus:bg-white/10 cursor-pointer"
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>

      {!emailVerified && user?.email && (
        <VerificationBanner 
          email={user.email}
          onDismiss={() => setEmailVerified(true)}
          onVerified={() => {
            setEmailVerified(true);
            // Refresh profile data
            supabase
              .from('profiles')
              .select('email_verified')
              .eq('id', user.id)
              .single()
              .then(({ data: profile }) => {
                setEmailVerified(profile?.email_verified ?? false);
              });
          }}
        />
      )}

      <main className="flex-1 pt-16 sm:pt-24 md:pt-28">
        <Outlet />
      </main>

      <AuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </div>
  );
};