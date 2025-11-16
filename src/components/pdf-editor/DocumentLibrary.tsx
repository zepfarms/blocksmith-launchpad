import { useState, useEffect } from "react";
import { Plus, Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UploadDialog } from "./UploadDialog";
import { TemplateSelector } from "./TemplateSelector";

interface DocumentLibraryProps {
  onSelectDocument: (id: string) => void;
  onSelectTemplate: (id: string) => void;
}

export function DocumentLibrary({ onSelectDocument, onSelectTemplate }: DocumentLibraryProps) {
  const { toast } = useToast();
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [templateSelectorOpen, setTemplateSelectorOpen] = useState(false);
  const [myDocuments, setMyDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMyDocuments();
  }, []);

  const loadMyDocuments = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("user_edited_documents")
        .select("*")
        .eq("user_id", user.id)
        .order("last_edited_at", { ascending: false });

      if (error) throw error;
      setMyDocuments(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading documents",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Your PDF Documents</h2>
          <p className="text-muted-foreground mt-2">
            Create new documents or edit existing ones
          </p>
        </div>
        <div className="flex gap-3">
          <Button onClick={() => setUploadDialogOpen(true)} className="gap-2">
            <Upload className="h-4 w-4" />
            Upload PDF
          </Button>
          <Button onClick={() => setTemplateSelectorOpen(true)} variant="outline" className="gap-2">
            <Plus className="h-4 w-4" />
            Use Template
          </Button>
        </div>
      </div>

      <Tabs defaultValue="my-documents" className="w-full">
        <TabsList>
          <TabsTrigger value="my-documents">My Documents ({myDocuments.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="my-documents" className="mt-6">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Loading documents...</p>
            </div>
          ) : myDocuments.length === 0 ? (
            <div className="text-center py-12 border-2 border-dashed border-border rounded-lg">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No documents yet</h3>
              <p className="text-muted-foreground mb-6">
                Upload a PDF or start from a template to begin editing
              </p>
              <div className="flex gap-3 justify-center">
                <Button onClick={() => setUploadDialogOpen(true)}>Upload PDF</Button>
                <Button onClick={() => setTemplateSelectorOpen(true)} variant="outline">
                  Browse Templates
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {myDocuments.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => onSelectDocument(doc.id)}
                  className="border border-border rounded-lg p-6 hover:border-primary hover:shadow-lg transition-all cursor-pointer bg-card"
                >
                  <div className="flex items-start gap-4">
                    <FileText className="h-10 w-10 text-primary flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground truncate">{doc.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Edited {doc.edit_count} {doc.edit_count === 1 ? "time" : "times"}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {new Date(doc.last_edited_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <UploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        onUploadComplete={(id) => {
          setUploadDialogOpen(false);
          onSelectDocument(id);
        }}
      />

      <TemplateSelector
        open={templateSelectorOpen}
        onOpenChange={setTemplateSelectorOpen}
        onSelectTemplate={(id) => {
          setTemplateSelectorOpen(false);
          onSelectTemplate(id);
        }}
      />
    </div>
  );
}
