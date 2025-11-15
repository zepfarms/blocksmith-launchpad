import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Loader2, Sparkles, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Header } from "@/components/Header";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const RATE_LIMIT = 10;
const COOLDOWN_SECONDS = 60;

export default function BusinessNameGenerator() {
  const navigate = useNavigate();
  const [businessName, setBusinessName] = useState("");
  const [businessDescription, setBusinessDescription] = useState("");
  const [generatedNames, setGeneratedNames] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  const [regenerationCount, setRegenerationCount] = useState(0);
  const [cooldownEndTime, setCooldownEndTime] = useState<number | null>(null);
  const [secondsRemaining, setSecondsRemaining] = useState(0);

  useEffect(() => {
    loadBusinessData();
  }, []);

  useEffect(() => {
    if (!cooldownEndTime) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const remaining = Math.max(0, Math.ceil((cooldownEndTime - now) / 1000));
      setSecondsRemaining(remaining);

      if (remaining === 0) {
        setCooldownEndTime(null);
        setRegenerationCount(0);
        toast.success("Rate limit reset! You can generate names again.");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [cooldownEndTime]);

  const loadBusinessData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate('/');
      return;
    }

    const { data: business } = await supabase
      .from('user_businesses')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (business) {
      setBusinessName(business.business_name || '');
      setBusinessDescription(business.business_idea || '');
    }
  };

  const generateNames = async () => {
    if (!businessDescription.trim()) {
      toast.error("Please describe your business first");
      return;
    }

    if (regenerationCount >= RATE_LIMIT) {
      const endTime = Date.now() + (COOLDOWN_SECONDS * 1000);
      setCooldownEndTime(endTime);
      toast.warning(`Whoa there! Please wait ${COOLDOWN_SECONDS} seconds before generating again.`);
      return;
    }

    setIsGenerating(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-business-name', {
        body: { businessDescription: businessDescription.trim() }
      });

      if (error) throw error;

      if (data?.names && Array.isArray(data.names)) {
        setGeneratedNames(data.names);
        setHasGenerated(true);
        setRegenerationCount(prev => prev + 1);
        toast.success(`${data.names.length} awesome names generated!`);
      } else {
        throw new Error('Invalid response format');
      }

    } catch (error: any) {
      console.error('Error generating names:', error);
      const errorMessage = error?.message || error?.error || 'Failed to generate names. Please try again.';
      toast.error(errorMessage);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNameClick = (name: string) => {
    setBusinessName(name);
    toast.success(`"${name}" selected!`);
  };

  const handleSave = async () => {
    if (!businessName.trim()) {
      toast.error("Please enter or select a business name");
      return;
    }

    setShowConfirmDialog(true);
  };

  const confirmSave = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('user_businesses')
      .update({ business_name: businessName.trim() })
      .eq('user_id', user.id);

    if (error) {
      toast.error("Failed to save business name");
      return;
    }

    // Mark block as completed
    await supabase
      .from('user_block_unlocks')
      .update({ completion_status: 'completed' })
      .eq('user_id', user.id)
      .eq('block_name', 'Business Name Generator');

    toast.success(`"${businessName}" is now your business name!`);
    setShowConfirmDialog(false);
    
    setTimeout(() => navigate('/dashboard'), 1500);
  };

  const isInCooldown = cooldownEndTime && secondsRemaining > 0;
  const remainingGenerations = Math.max(0, RATE_LIMIT - regenerationCount);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <Header />
      
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <Button
          variant="ghost"
          onClick={() => navigate('/dashboard')}
          className="mb-6 text-white/70 hover:text-white"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-acari-green via-green-400 to-acari-green bg-clip-text text-transparent">
            Choose Your Business Name
          </h1>
          <p className="text-xl text-white/60">
            Give your business the perfect identity
          </p>
        </div>

        <div className="glass-card p-8 mb-8">
          <label className="block text-white font-medium mb-3">
            Business Name
          </label>
          <Input
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="e.g., Pawsome Walks Shawnee"
            className="text-lg mb-4"
          />
          
          <div className="flex gap-4">
            <Button
              onClick={handleSave}
              disabled={!businessName.trim()}
              className="flex-1"
            >
              Save Business Name
            </Button>
            <Button
              onClick={generateNames}
              disabled={isGenerating || isInCooldown}
              variant="outline"
              className="flex-1"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : isInCooldown ? (
                <>
                  <Clock className="w-4 h-4 mr-2" />
                  Cool down: {Math.floor(secondsRemaining / 60)}:{(secondsRemaining % 60).toString().padStart(2, '0')}
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generate Ideas ✨
                </>
              )}
            </Button>
          </div>

          {hasGenerated && !isInCooldown && (
            <p className="text-sm text-white/50 mt-2 text-center">
              {remainingGenerations} regeneration{remainingGenerations !== 1 ? 's' : ''} remaining before cooldown
            </p>
          )}

          {isInCooldown && (
            <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
              <p className="text-yellow-400 text-sm text-center">
                ⏱️ Too many generations! Take a breather, try again in {secondsRemaining} seconds.
              </p>
            </div>
          )}
        </div>

        <div className="glass-card p-8 mb-8">
          <label className="block text-white font-medium mb-3">
            Need inspiration? Tell us about your business:
          </label>
          <Textarea
            value={businessDescription}
            onChange={(e) => setBusinessDescription(e.target.value)}
            placeholder="e.g., Dog walking service in Shawnee, Kansas"
            className="min-h-[100px] mb-4"
          />
          
          {hasGenerated && (
            <Button
              onClick={generateNames}
              disabled={isGenerating || isInCooldown}
              variant="secondary"
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : isInCooldown ? (
                <>
                  <Clock className="w-4 h-4 mr-2" />
                  Cool down: {Math.floor(secondsRemaining / 60)}:{(secondsRemaining % 60).toString().padStart(2, '0')}
                </>
              ) : (
                <>
                  🔄 Regenerate ({remainingGenerations} left)
                </>
              )}
            </Button>
          )}
        </div>

        {isGenerating && (
          <div className="flex items-center justify-center gap-3 py-16">
            <Loader2 className="w-8 h-8 animate-spin text-acari-green" />
            <p className="text-xl text-white/70">Crafting awesome names...</p>
          </div>
        )}

        {hasGenerated && generatedNames.length > 0 && !isGenerating && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              AI-Generated Name Ideas
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {generatedNames.map((name, index) => (
                <button
                  key={index}
                  onClick={() => handleNameClick(name)}
                  className={`p-4 rounded-xl border-2 transition-all duration-200 text-center font-medium glass-card hover:scale-105 ${
                    businessName === name
                      ? 'border-acari-green bg-acari-green/20'
                      : 'border-white/20 hover:border-acari-green hover:bg-acari-green/10'
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Set "{businessName}" as your business name?</AlertDialogTitle>
            <AlertDialogDescription>
              This name will be used throughout Acari to build your business. 
              You can always change it later in your settings.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Go Back</AlertDialogCancel>
            <AlertDialogAction onClick={confirmSave}>
              Yes, Set This Name
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
