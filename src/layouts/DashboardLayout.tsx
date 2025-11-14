import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";

export const DashboardLayout = () => {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkEmailVerification = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('email_verified')
          .eq('id', user.id)
          .single();
        
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
    return null; // Or a loading spinner
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-[72px] sm:pt-[80px]">
        <Outlet />
      </main>
    </div>
  );
};
