import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { AuthModal } from "@/components/AuthModal";
import { supabase } from "@/integrations/supabase/client";

export function PDFEditorPromo() {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleTryFreeEdits = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    
    if (session) {
      navigate("/dashboard/pdf-editor");
    } else {
      setShowAuthModal(true);
    }
  };

  const handleAuthSuccess = () => {
    setShowAuthModal(false);
    navigate("/dashboard/pdf-editor");
  };

  return (
    <>
      <AuthModal
        open={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleAuthSuccess}
      />
    <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Edit className="h-5 w-5 text-primary" />
              </div>
              <Sparkles className="h-4 w-4 text-primary" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-2">
                Edit PDFs Online with Our Professional Editor
              </h3>
              <p className="text-muted-foreground text-base">
                Annotate, customize, and edit any PDF document directly in your browser. 
                Perfect for contracts, forms, and business documents.
              </p>
            </div>
            <div className="flex items-center gap-4 pt-2">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-foreground">$5</span>
                <span className="text-muted-foreground">/month</span>
              </div>
              <div className="h-6 w-px bg-border" />
              <span className="text-sm text-muted-foreground">or $29 lifetime</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild size="lg" className="gap-2">
              <Link to="/start?selectedBlock=PDF Editor">
                Get Started
                <Sparkles className="h-4 w-4" />
              </Link>
            </Button>
            <Button onClick={handleTryFreeEdits} variant="outline" size="lg">
              Try Free Edits
            </Button>
          </div>
        </div>
      </div>
    </Card>
    </>
  );
}
