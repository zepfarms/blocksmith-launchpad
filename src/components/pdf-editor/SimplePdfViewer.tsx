interface SimplePdfViewerProps {
  pdfUrl: string;
}

export function SimplePdfViewer({ pdfUrl }: SimplePdfViewerProps) {
  return (
    <div className="w-full h-full min-h-[700px] bg-background">
      <iframe
        src={pdfUrl}
        className="w-full h-full border-0"
        title="PDF Viewer"
      />
    </div>
  );
}
