import { useState, useEffect } from "react";
import { FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TemplateSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (templateId: string) => void;
}

export function TemplateSelector({ open, onOpenChange, onSelectTemplate }: TemplateSelectorProps) {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (open) {
      loadTemplates();
    }
  }, [open]);

  const loadTemplates = async () => {
    try {
      const { data, error } = await supabase
        .from("document_templates")
        .select("*")
        .order("title");

      if (error) throw error;
      setTemplates(data || []);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error loading templates",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredTemplates = templates.filter((template) =>
    template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Choose a Template</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="overflow-y-auto max-h-[500px] pr-2">
            {loading ? (
              <p className="text-center py-8 text-muted-foreground">Loading templates...</p>
            ) : filteredTemplates.length === 0 ? (
              <p className="text-center py-8 text-muted-foreground">No templates found</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    onClick={() => onSelectTemplate(template.id)}
                    className="border border-border rounded-lg p-4 hover:border-primary hover:shadow-lg transition-all cursor-pointer bg-card"
                  >
                    <div className="flex items-start gap-3">
                      <FileText className="h-8 w-8 text-primary flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground truncate">{template.title}</h3>
                        {template.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {template.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
