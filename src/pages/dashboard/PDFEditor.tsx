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
    <DocumentLibrary
      onSelectDocument={setSelectedDocumentId}
      onSelectTemplate={setSelectedTemplateId}
    />
  );
}
