import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { LogOut, Mail, CheckCircle, XCircle } from "lucide-react";

export default function DashboardSettings() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return;

    setUserEmail(session.user.email || "");

    const { data: profile } = await supabase
      .from('profiles')
      .select('email_verified')
      .eq('id', session.user.id)
      .maybeSingle();

    setEmailVerified(profile?.email_verified ?? true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Manage your account settings
          </p>
        </div>

        {/* Account Information */}
        <div className="glass-card p-6 md:p-8 rounded-3xl border border-border/40 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Account Information</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/20 border border-border/40">
                <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground mb-1">Email Address</p>
                  <p className="text-foreground font-medium">{userEmail}</p>
                </div>
                {emailVerified ? (
                  <CheckCircle className="h-5 w-5 text-acari-green" />
                ) : (
                  <XCircle className="h-5 w-5 text-destructive" />
                )}
              </div>

              {!emailVerified && (
                <div className="p-4 rounded-xl bg-destructive/5 border border-destructive/20">
                  <p className="text-sm text-destructive">
                    Your email is not verified. Please check your inbox for the verification code.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Logout */}
          <div className="pt-4 border-t border-border/40">
            <Button
              onClick={handleLogout}
              variant="outline"
              className="w-full md:w-auto border-destructive/50 text-destructive hover:bg-destructive/10 hover:border-destructive"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
