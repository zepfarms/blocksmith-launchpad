import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AuthModal } from "@/components/AuthModal";
import { supabase } from "@/integrations/supabase/client";
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
      <header className="absolute top-0 left-0 right-0 z-50 px-6 py-6 bg-black/50 backdrop-blur-sm border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-xl font-bold text-white">
            SpaceBlocks.ai
          </div>

          <div className="flex items-center gap-8">
            <a href="/features" className="text-white/80 hover:text-white transition-colors text-sm">
              Features
            </a>
            <a href="/start/browse" className="text-white/80 hover:text-white transition-colors text-sm">
              Business Ideas
            </a>
          </div>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 text-white border border-white/20 hover:bg-white/10">
                  <Menu className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-black/95 backdrop-blur-md border-white/10">
                <DropdownMenuItem onClick={() => navigate("/dashboard")} className="text-white">
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-white">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAuthModal(true)}
              className="text-white border border-white/20 hover:bg-white/10 rounded-full px-6"
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
