import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { LogoGrid } from "@/components/dashboard/LogoGrid";
import { RefinementChat } from "@/components/dashboard/RefinementChat";
import { ActionBar } from "@/components/dashboard/ActionBar";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Logo {
  file_url: string;
  thumbnail_url: string;
  logo_number: number;
}

export default function LogoGeneration() {
  const navigate = useNavigate();
  const [currentBatch, setCurrentBatch] = useState<Logo[]>([]);
  const [selectedLogos, setSelectedLogos] = useState<number[]>([]);
  const [generationCount, setGenerationCount] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [businessName, setBusinessName] = useState("");
  const [businessIdea, setBusinessIdea] = useState("");
  const [businessStatus, setBusinessStatus] = useState("");
  const [showLimitDialog, setShowLimitDialog] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ role: string; content: string }>>([]);

  useEffect(() => {
    loadBusinessData();
  }, []);

  const loadBusinessData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/');
      return;
    }

    const response: any = await supabase
      .from('user_businesses')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (response.data) {
      setBusinessName(response.data.business_name || '');
      setBusinessIdea(response.data.business_idea || '');
      setBusinessStatus(response.data.status || '');
      checkGenerationCount(user.id, { name: response.data.business_name, idea: response.data.business_idea });
    }
  };

  const checkGenerationCount = async (userId: string, opts?: { name?: string; idea?: string }) => {
    const { data: sessions, error } = await supabase
      .from('logo_generation_sessions' as any)
      .select('*')
      .eq('user_id', userId);

    const count = sessions?.length || 0;
    setGenerationCount(count);

    if (count === 0) {
      await generateLogos(undefined, { name: opts?.name, idea: opts?.idea });
    }
  };

  const generateLogos = async (userFeedback?: string, opts?: { name?: string; idea?: string }) => {
    const name = (opts?.name ?? businessName)?.trim();
    const idea = (opts?.idea ?? businessIdea)?.trim();

    if (!name || !idea) {
      console.warn('Missing business name or idea when generating logos');
      return;
    }

    if (generationCount >= 2 && businessStatus !== 'launched') {
      setShowLimitDialog(true);
      return;
    }

    setIsGenerating(true);
    setSelectedLogos([]);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.error('No active session');
        navigate('/');
        return;
      }

      const { data, error }: any = await supabase.functions.invoke('generate-logos', {
        body: {
          business_name: name,
          business_idea: idea,
          user_feedback: userFeedback
        }
      });

      if (error) {
        if (error.message?.includes('generation_limit')) {
          setShowLimitDialog(true);
          return;
        }
        throw error;
      }

      setCurrentBatch(data.logos);
      setGenerationCount(data.generation_number);

      if (userFeedback) {
        setChatMessages(prev => [
          ...prev,
          { role: 'user', content: userFeedback },
          { role: 'assistant', content: `Generated 6 new logos based on your feedback!` }
        ]);
      } else {
        setChatMessages([
          { role: 'assistant', content: `I generated 6 logo variations for ${name}. What do you think?` }
        ]);
      }
    } catch (error) {
      console.error('Error generating logos:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveSelected = async () => {
    if (selectedLogos.length === 0) return;

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const selectedUrls = selectedLogos.map(num => currentBatch[num - 1]?.file_url).filter(Boolean);

      for (const url of selectedUrls) {
        await supabase
          .from('user_assets' as any)
          .update({ status: 'saved' })
          .eq('user_id', user.id)
          .eq('asset_type', 'logo')
          .eq('file_url', url);
      }

      navigate('/dashboard?tab=briefcase');
    } catch (error) {
      console.error('Error saving logos:', error);
    }
  };

  const toggleLogoSelection = (logoNumber: number) => {
    setSelectedLogos(prev =>
      prev.includes(logoNumber)
        ? prev.filter(n => n !== logoNumber)
        : [...prev, logoNumber]
    );
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      <div className="absolute top-1/4 left-1/4 w-[80vw] max-w-[500px] h-[80vw] max-h-[500px] rounded-full bg-neon-cyan/10 blur-[120px] animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-[80vw] max-w-[600px] h-[80vw] max-h-[600px] rounded-full bg-electric-indigo/10 blur-[120px] animate-float" style={{ animationDelay: "2s" }} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="gap-2 text-foreground hover:bg-white/5 rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Dashboard
          </Button>
          <div className="text-sm text-muted-foreground">
            Batch #{generationCount} of 2 free
          </div>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-white/10">
          <h1 className="text-3xl font-bold text-foreground mb-2">Generate Logos</h1>
          <p className="text-muted-foreground mb-3">Business: {businessName}</p>
          <p className="text-sm text-yellow-500 bg-yellow-500/10 px-4 py-2 rounded-lg border border-yellow-500/20">
            ⚠️ Once you save selected logos to your Briefcase, they will be locked and cannot be edited. Choose carefully before saving.
          </p>
        </div>

        {isGenerating ? (
          <div className="glass-card p-12 rounded-3xl border border-white/10 flex flex-col items-center justify-center min-h-[400px]">
            <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
            <p className="text-lg text-foreground">Generating 6 logo variations...</p>
            <p className="text-sm text-muted-foreground mt-2">This may take a minute</p>
          </div>
        ) : (
          <LogoGrid
            logos={currentBatch}
            selectedLogos={selectedLogos}
            onToggleSelection={toggleLogoSelection}
          />
        )}

        <RefinementChat
          isOpen={isChatOpen}
          onToggle={() => setIsChatOpen(!isChatOpen)}
          messages={chatMessages}
          onSendFeedback={generateLogos}
          isGenerating={isGenerating}
        />

        <ActionBar
          selectedCount={selectedLogos.length}
          onSaveSelected={handleSaveSelected}
          disabled={isGenerating}
        />
      </div>

      <AlertDialog open={showLimitDialog} onOpenChange={setShowLimitDialog}>
        <AlertDialogContent className="glass-card border border-white/20">
          <AlertDialogHeader>
            <AlertDialogTitle>Free Generations Used</AlertDialogTitle>
            <AlertDialogDescription>
              You've used your 2 free logo generations. Launch your business to unlock unlimited generations and download your logos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => navigate('/dashboard?tab=billing')}>
              Launch My Business
            </AlertDialogAction>
            <AlertDialogAction onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}