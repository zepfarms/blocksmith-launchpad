import { useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { PDFDiagnosticsPanel } from "./PDFDiagnosticsPanel";

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

        // Preflight check: ensure SDK assets are available
        const probe = await fetch("/compdfkit/webviewer.js", { method: "HEAD" });
        if (!probe.ok) {
          throw new Error(`ComPDFKit assets missing. Expected /compdfkit/webviewer.js (status ${probe.status}).`);
        }

        // Dynamic import and normalize module shape
        const mod = await import("@compdfkit_pdf_sdk/webviewer");
        const ComPDFKitViewer: any = (mod as any)?.default ?? (mod as any);
        
        if (typeof ComPDFKitViewer?.init !== "function") {
          console.debug("ComPDFKit module shape", {
            hasDefault: Boolean((mod as any)?.default),
            keys: Object.keys(mod as any),
            type: typeof ComPDFKitViewer,
          });
          throw new Error("ComPDFKitViewer.init not found. Check SDK version and import.");
        }

        await ComPDFKitViewer.init(
          {
            pdfUrl: pdfUrl,
            license: publicKey,
            path: "/compdfkit",
          },
          containerRef.current!
        );

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
    <>
      <div 
        ref={containerRef}
        className="w-full h-full min-h-[600px] bg-background"
        style={{ minHeight: "calc(100vh - 120px)" }}
      />
      <PDFDiagnosticsPanel />
    </>
  );
}
