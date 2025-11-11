import { useState } from "react";
import { BlockCard } from "./BlockCard";
import { Button } from "@/components/ui/button";
import {
  Lightbulb,
  Target,
  Palette,
  Globe,
  FileText,
  Image,
  ShoppingBag,
  Building2,
  CreditCard,
  Mail,
  Share2,
  Users,
  Rocket,
  Headphones,
} from "lucide-react";

interface Block {
  id: string;
  title: string;
  category: string;
  icon: React.ReactNode;
}

const blocks: Block[] = [
  { id: "idea", title: "Idea Generator", category: "Start", icon: <Lightbulb className="w-6 h-6 text-ion-blue" /> },
  { id: "strategy", title: "Business Strategy", category: "Start", icon: <Target className="w-6 h-6 text-ion-blue" /> },
  { id: "brand", title: "Brand Story", category: "Brand", icon: <Palette className="w-6 h-6 text-cosmic-purple" /> },
  { id: "logo", title: "Logo & Design Kit", category: "Brand", icon: <Image className="w-6 h-6 text-cosmic-purple" /> },
  { id: "website", title: "Website Builder", category: "Site", icon: <Globe className="w-6 h-6 text-ion-blue" /> },
  { id: "domain", title: "Domain Setup", category: "Site", icon: <FileText className="w-6 h-6 text-ion-blue" /> },
  { id: "products", title: "Product Designer", category: "Commerce", icon: <ShoppingBag className="w-6 h-6 text-cosmic-purple" /> },
  { id: "llc", title: "LLC + EIN Setup", category: "Legal", icon: <Building2 className="w-6 h-6 text-deep-jet" /> },
  { id: "payments", title: "Payment Setup", category: "Commerce", icon: <CreditCard className="w-6 h-6 text-ion-blue" /> },
  { id: "email", title: "Email Funnels", category: "Marketing", icon: <Mail className="w-6 h-6 text-cosmic-purple" /> },
  { id: "social", title: "Social Launch Kit", category: "Marketing", icon: <Share2 className="w-6 h-6 text-cosmic-purple" /> },
  { id: "crm", title: "CRM System", category: "Sales", icon: <Users className="w-6 h-6 text-ion-blue" /> },
  { id: "launch", title: "Launch Plan", category: "Growth", icon: <Rocket className="w-6 h-6 text-cosmic-purple" /> },
  { id: "support", title: "Support System", category: "Support", icon: <Headphones className="w-6 h-6 text-ion-blue" /> },
];

export const BlockSelector = ({ onComplete }: { onComplete: (selectedBlocks: string[]) => void }) => {
  const [selectedBlocks, setSelectedBlocks] = useState<string[]>([]);

  const toggleBlock = (id: string) => {
    setSelectedBlocks((prev) =>
      prev.includes(id) ? prev.filter((blockId) => blockId !== id) : [...prev, id]
    );
  };

  return (
    <section className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold">
            Choose Your <span className="gradient-text">Business Blocks</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Select the building blocks you need. We'll assemble everything into a complete business system.
          </p>
          {selectedBlocks.length > 0 && (
            <p className="text-sm font-medium text-primary">
              {selectedBlocks.length} block{selectedBlocks.length !== 1 ? "s" : ""} selected
            </p>
          )}
        </div>

        {/* Block Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-scale-in">
          {blocks.map((block) => (
            <BlockCard
              key={block.id}
              title={block.title}
              category={block.category}
              icon={block.icon}
              isSelected={selectedBlocks.includes(block.id)}
              onToggle={() => toggleBlock(block.id)}
            />
          ))}
        </div>

        {/* CTA */}
        {selectedBlocks.length > 0 && (
          <div className="text-center pt-8 animate-slide-up">
            <Button 
              variant="hero" 
              size="xl"
              onClick={() => onComplete(selectedBlocks)}
              className="group"
            >
              Continue with {selectedBlocks.length} Block{selectedBlocks.length !== 1 ? "s" : ""}
              <Rocket className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};
