import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { VerificationBanner } from "@/components/VerificationBanner";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/AuthModal";
import { User } from "@supabase/supabase-js";
import { Menu } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    <SidebarProvider>
      <div className="min-h-screen bg-background flex w-full">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col">
          {/* Dashboard Header */}
          <header className="fixed top-0 left-0 right-0 z-[100] px-3 sm:px-6 py-2 bg-black border-b border-white/5">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2 sm:gap-4">
                <SidebarTrigger className="lg:hidden -ml-2" />
                <img 
                  src="/acari-logo.png" 
                  alt="Acari" 
                  className="h-14 sm:h-20 md:h-24 w-auto cursor-pointer hover:opacity-80 transition-opacity"
                  onClick={() => navigate("/")}
                />
              </div>

              {user && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2 text-white border border-white/20 hover:bg-white/10 rounded-full px-3 sm:px-4">
                      <Menu className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent 
                    align="end" 
                    className="z-[200] min-w-[180px] bg-background border border-white/20 backdrop-blur-xl shadow-xl"
                  >
                    <DropdownMenuItem 
                      onClick={() => navigate("/dashboard")} 
                      className="text-foreground hover:bg-white/10 focus:bg-white/10 cursor-pointer"
                    >
                      Dashboard
                    </DropdownMenuItem>
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

          <main className="flex-1 pt-[72px] sm:pt-[80px]">
            <Outlet />
          </main>
        </div>
      </div>

      <AuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </SidebarProvider>
  );
};