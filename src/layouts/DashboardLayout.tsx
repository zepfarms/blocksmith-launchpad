import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { VerificationBanner } from "@/components/VerificationBanner";

export const DashboardLayout = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);
  const [emailVerified, setEmailVerified] = useState(true);

  useEffect(() => {
    const checkEmailVerification = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('email_verified')
          .eq('id', user.id)
          .single();
        
        setEmailVerified(profile?.email_verified ?? true);
        
        if (profile && !profile.email_verified) {
          navigate("/verify-email");
          return;
        }
      }
      
      setChecking(false);
    };

    checkEmailVerification();
  }, [navigate]);

  if (checking) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen w-full flex bg-background">
        <DashboardSidebar />
        <div className="flex-1 flex flex-col w-full">
          <Header />
          {!emailVerified && <VerificationBanner />}
          <main className="flex-1 pt-[72px] sm:pt-[80px]">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};
