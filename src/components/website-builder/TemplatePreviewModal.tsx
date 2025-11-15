import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { WebsiteTemplate } from "@/data/websiteTemplates";

interface TemplatePreviewModalProps {
  template: WebsiteTemplate | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TemplatePreviewModal = ({
  template,
  isOpen,
  onClose,
}: TemplatePreviewModalProps) => {
  const navigate = useNavigate();

  if (!template) return null;

  const handleUseTemplate = () => {
    navigate(`/dashboard/website-builder?template=${template.id}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-7xl h-[90vh] p-0">
        <div className="h-full flex flex-col">
          {/* Modal Header */}
          <div className="p-6 border-b flex items-center justify-between shrink-0">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">{template.name}</h2>
                <Badge variant="outline">{template.category}</Badge>
              </div>
              <p className="text-muted-foreground">{template.description}</p>
            </div>
            <Button onClick={handleUseTemplate} size="lg">
              Use This Template
            </Button>
          </div>

          {/* Live Preview */}
          <div className="flex-1 bg-gray-100 relative overflow-hidden">
            <iframe
              src={`/templates/${template.id}/index.html`}
              className="w-full h-full border-0"
              title={`${template.name} Live Preview`}
            />
          </div>

          {/* Modal Footer */}
          <div className="p-4 border-t bg-card flex items-center justify-between shrink-0">
            <div className="flex gap-4 items-center">
              <div className="flex gap-2">
                {Object.entries(template.colorScheme).map(([key, color]) => (
                  <div
                    key={key}
                    className="w-6 h-6 rounded-full border"
                    style={{ backgroundColor: color }}
                    title={key}
                  />
                ))}
              </div>
              <div className="text-sm text-muted-foreground">
                {template.features.length} Features • $10/month
              </div>
            </div>
            <Button variant="outline" onClick={onClose}>
              Close Preview
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};