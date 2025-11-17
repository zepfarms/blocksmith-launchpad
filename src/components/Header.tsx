import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/AuthModal";
import { supabase } from "@/integrations/supabase/runtimeClient";
import { User } from "@supabase/supabase-js";
import { Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[100] px-4 sm:px-6 py-2 bg-black border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <img 
            src="/acari-logo.png" 
            alt="Acari" 
            className="h-16 sm:h-20 md:h-24 w-auto cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() => navigate("/")}
          />

          <div className="hidden sm:flex items-center gap-4 md:gap-8">
            <button onClick={() => navigate("/features")} className="text-white/80 hover:text-white transition-colors text-xs sm:text-sm">
              Features
            </button>
            <button onClick={() => navigate("/tools")} className="text-white/80 hover:text-white transition-colors text-xs sm:text-sm">
              Tools
            </button>
            <button onClick={() => navigate("/templates")} className="text-white/80 hover:text-white transition-colors text-xs sm:text-sm">
              Templates
            </button>
          </div>

          {user ? (
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
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAuthModal(true)}
              className="text-white border border-white/20 hover:bg-white/10 rounded-full px-4 sm:px-6 text-xs sm:text-sm"
            >
              Sign In
            </Button>
          )}
        </div>
      </header>

      <AuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
};
