import { useState, useEffect } from "react";
import { ArrowLeft, Download, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { PDFEditorViewer } from "./PDFEditorViewer";
import { SaveDialog } from "./SaveDialog";
import { UpgradeModal } from "./UpgradeModal";

interface DocumentEditorProps {
  documentId: string | null;
  templateId: string | null;
  onBack: () => void;
}

export function DocumentEditor({ documentId, templateId, onBack }: DocumentEditorProps) {
  const { toast } = useToast();
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [documentTitle, setDocumentTitle] = useState<string>("");
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [editCount, setEditCount] = useState(0);
  const [hasUnlimitedAccess, setHasUnlimitedAccess] = useState(false);

  useEffect(() => {
    loadDocument();
    checkAccess();
  }, [documentId, templateId]);

  const checkAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Check if user is admin - admins get unlimited access
      const { data: adminRole } = await supabase
        .from("user_roles")
        .select("*")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (adminRole) {
        setHasUnlimitedAccess(true);
        return;
      }

      // Check if user has purchased unlimited access
      const { data: purchases } = await supabase
        .from("user_block_purchases")
        .select("*")
        .eq("user_id", user.id)
        .eq("block_name", "PDF Editor");

      const { data: subscriptions } = await supabase
        .from("user_subscriptions")
        .select("*")
        .eq("user_id", user.id)
        .eq("block_name", "PDF Editor")
        .eq("status", "active");

      setHasUnlimitedAccess((purchases && purchases.length > 0) || (subscriptions && subscriptions.length > 0));

      // Count how many edits they've made
      const { data: documents } = await supabase
        .from("user_edited_documents")
        .select("id")
        .eq("user_id", user.id);

      setEditCount(documents?.length || 0);
    } catch (error) {
      console.error("Error checking access:", error);
    }
  };

  const loadDocument = async () => {
    try {
      if (documentId) {
        const { data, error } = await supabase
          .from("user_edited_documents")
          .select("*")
          .eq("id", documentId)
          .single();

        if (error) throw error;
        setPdfUrl(data.file_url);
        setDocumentTitle(data.title);
      } else if (templateId) {
        const { data, error } = await supabase
          .from("document_templates")
          .select("*")
          .eq("id", templateId)
          .single();

        if (error) throw error;
        setPdfUrl(data.file_url || "");
        setDocumentTitle(data.title);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading document",
        description: error.message,
      });
    }
  };

  const handleSave = () => {
    // Check if user needs to upgrade
    if (!hasUnlimitedAccess && editCount >= 3) {
      setUpgradeModalOpen(true);
      return;
    }
    setSaveDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <h1 className="text-xl font-semibold text-foreground">{documentTitle}</h1>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Download
              </Button>
              <Button onClick={handleSave} className="gap-2">
                <Save className="h-4 w-4" />
                Save
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <PDFEditorViewer pdfUrl={pdfUrl} />
      </div>

      <SaveDialog
        open={saveDialogOpen}
        onOpenChange={setSaveDialogOpen}
        documentId={documentId}
        templateId={templateId}
        currentTitle={documentTitle}
        onSaveComplete={() => {
          setSaveDialogOpen(false);
          toast({
            title: "Document saved",
            description: "Your changes have been saved successfully",
          });
          onBack();
        }}
      />

      <UpgradeModal
        open={upgradeModalOpen}
        onOpenChange={setUpgradeModalOpen}
      />
    </div>
  );
}
