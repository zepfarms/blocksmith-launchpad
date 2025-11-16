import { useState } from "react";
import { Upload, FileUp } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadComplete: (documentId: string) => void;
}

export function UploadDialog({ open, onOpenChange, onUploadComplete }: UploadDialogProps) {
  const { toast } = useToast();
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        toast({
          variant: "destructive",
          title: "Invalid file type",
          description: "Please select a PDF file",
        });
        return;
      }
      setFile(selectedFile);
      if (!title) {
        setTitle(selectedFile.name.replace(".pdf", ""));
      }
    }
  };

  const handleUpload = async () => {
    if (!file || !title) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please select a file and enter a title",
      });
      return;
    }

    setUploading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Upload PDF to storage
      const fileExt = "pdf";
      const fileName = `${user.id}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("business-assets")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("business-assets")
        .getPublicUrl(fileName);

      // Create document record
      const { data: document, error: dbError } = await supabase
        .from("user_edited_documents")
        .insert({
          user_id: user.id,
          title,
          file_url: publicUrl,
          original_file_url: publicUrl,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      toast({
        title: "PDF uploaded",
        description: "Your document is ready to edit",
      });

      onUploadComplete(document.id);
      setFile(null);
      setTitle("");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Upload failed",
        description: error.message,
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload PDF Document</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div>
            <Label htmlFor="title">Document Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="My Document"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="file">PDF File</Label>
            <div className="mt-2 flex items-center gap-2">
              <Input
                id="file"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
            </div>
            {file && (
              <p className="text-sm text-muted-foreground mt-2 flex items-center gap-2">
                <FileUp className="h-4 w-4" />
                {file.name}
              </p>
            )}
          </div>

          <Button
            onClick={handleUpload}
            disabled={!file || !title || uploading}
            className="w-full gap-2"
          >
            <Upload className="h-4 w-4" />
            {uploading ? "Uploading..." : "Upload & Edit"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
