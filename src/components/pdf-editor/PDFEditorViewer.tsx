import { useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import WebViewer from "@compdfkit_pdf_sdk/webviewer";

interface PDFEditorViewerProps {
  pdfUrl: string;
}

export function PDFEditorViewer({ pdfUrl }: PDFEditorViewerProps) {
  const { toast } = useToast();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!pdfUrl || !containerRef.current) return;

    const initializeViewer = async () => {
      try {
        const publicKey = import.meta.env.VITE_COMPDFKIT_PUBLIC_KEY;

        if (!publicKey) {
          toast({
            variant: "destructive",
            title: "Configuration Error",
            description: "PDF Editor is not properly configured. Please contact support.",
          });
          return;
        }

        await WebViewer({
          pdfUrl: pdfUrl,
          license: publicKey,
          path: "/compdfkit",
        }, containerRef.current);

      } catch (error: any) {
        console.error("Error initializing PDF viewer:", error);
        toast({
          variant: "destructive",
          title: "Error loading PDF editor",
          description: error.message || "Failed to initialize PDF viewer",
        });
      }
    };

    initializeViewer();

    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, [pdfUrl, toast]);

  return (
    <div 
      ref={containerRef}
      className="w-full h-full min-h-[600px] bg-background"
      style={{ minHeight: "calc(100vh - 120px)" }}
    />
  );
}
