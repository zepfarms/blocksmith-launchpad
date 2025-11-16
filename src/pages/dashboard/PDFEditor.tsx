import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocumentLibrary } from "@/components/pdf-editor/DocumentLibrary";
import { DocumentEditor } from "@/components/pdf-editor/DocumentEditor";

export default function PDFEditor() {
  const navigate = useNavigate();
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);

  if (selectedDocumentId || selectedTemplateId) {
    return (
      <DocumentEditor
        documentId={selectedDocumentId}
        templateId={selectedTemplateId}
        onBack={() => {
          setSelectedDocumentId(null);
          setSelectedTemplateId(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">PDF Editor</h1>
              <p className="text-sm text-muted-foreground">
                Edit, annotate, and customize your PDF documents
              </p>
            </div>
          </div>
        </div>
      </div>

      <DocumentLibrary
        onSelectDocument={setSelectedDocumentId}
        onSelectTemplate={setSelectedTemplateId}
      />
    </div>
  );
}
