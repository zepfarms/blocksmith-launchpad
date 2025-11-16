import { useState } from "react";
import { Save } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SaveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentId: string | null;
  templateId: string | null;
  currentTitle: string;
  onSaveComplete: () => void;
}

export function SaveDialog({
  open,
  onOpenChange,
  documentId,
  templateId,
  currentTitle,
  onSaveComplete,
}: SaveDialogProps) {
  const { toast } = useToast();
  const [saving, setSaving] = useState(false);
  const [title, setTitle] = useState(currentTitle);

  const handleSave = async () => {
    if (!title) {
      toast({
        variant: "destructive",
        title: "Missing title",
        description: "Please enter a title for your document",
      });
      return;
    }

    setSaving(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      if (documentId) {
        // Update existing document - first get current edit count
        const { data: currentDoc } = await supabase
          .from("user_edited_documents")
          .select("edit_count")
          .eq("id", documentId)
          .single();

        const { error } = await supabase
          .from("user_edited_documents")
          .update({
            title,
            edit_count: (currentDoc?.edit_count || 0) + 1,
            last_edited_at: new Date().toISOString(),
          })
          .eq("id", documentId);

        if (error) throw error;
      } else if (templateId) {
        // Create new document from template
        const { data: template } = await supabase
          .from("document_templates")
          .select("file_url")
          .eq("id", templateId)
          .single();

        const { error } = await supabase
          .from("user_edited_documents")
          .insert({
            user_id: user.id,
            template_id: templateId,
            title,
            file_url: template?.file_url || "",
            original_file_url: template?.file_url || "",
          });

        if (error) throw error;
      }

      onSaveComplete();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Save failed",
        description: error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save Document</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div>
            <Label htmlFor="save-title">Document Title</Label>
            <Input
              id="save-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My Edited Document"
              className="mt-2"
            />
          </div>

          <Button
            onClick={handleSave}
            disabled={!title || saving}
            className="w-full gap-2"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Document"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
