import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { UsersTable } from "@/components/admin/UsersTable";
import { AnalyticsCards } from "@/components/admin/AnalyticsCards";

export default function Admin() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAdminAccess();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkAdminAccess = async () => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        console.error("Error getting user for admin check:", error);
      }

      // Not logged in → send to home
      if (!user) {
        navigate("/");
        return;
      }

      // Secure admin check:
      //  - your email
      //  - OR role in user_metadata
      //  - OR role in app_metadata
      const isAdminUser =
        user.email === "support@acari.ai" ||
        (user.user_metadata && user.user_metadata.role === "admin") ||
        // @ts-ignore – app_metadata exists on the user object at runtime
        (user.app_metadata && user.app_metadata.role === "admin");

      if (!isAdminUser) {
        // Logged in but not authorized → send to dashboard
        navigate("/dashboard");
        return;
      }

      setIsAdmin(true);
    } catch (err) {
      console.error("Error checking admin access:", err);
      navigate("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Verifying admin access...</div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        <main className="flex-1">
          <header className="h-16 border-b flex items-center px-6 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
            <SidebarTrigger className="mr-4" />
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          </header>
          <div className="p-6 space-y-6">
            <AnalyticsCards />
            <UsersTable />
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
