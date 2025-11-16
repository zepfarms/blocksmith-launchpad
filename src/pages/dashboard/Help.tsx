import { Button } from "@/components/ui/button";
import { Mail, MessageCircle, FileText, ExternalLink } from "lucide-react";

export default function Help() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">Help & Support</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            We're here to help you succeed
          </p>
        </div>

        {/* Support Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="glass-card p-6 rounded-2xl border border-border/40 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-acari-green/10 border border-acari-green/20 flex items-center justify-center">
              <Mail className="h-6 w-6 text-acari-green" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground mb-2">Email Support</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get help via email from our support team
              </p>
              <Button
                variant="outline"
                className="w-full border-border/40 hover:border-acari-green/50 hover:bg-acari-green/5"
              >
                <Mail className="h-4 w-4 mr-2" />
                Contact Support
              </Button>
            </div>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-border/40 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-neon-cyan/10 border border-neon-cyan/20 flex items-center justify-center">
              <FileText className="h-6 w-6 text-neon-cyan" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground mb-2">Documentation</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Learn how to use all features
              </p>
              <Button
                variant="outline"
                className="w-full border-border/40 hover:border-neon-cyan/50 hover:bg-neon-cyan/5"
              >
                <FileText className="h-4 w-4 mr-2" />
                View Docs
              </Button>
            </div>
          </div>
        </div>

        {/* FAQ Placeholder */}
        <div className="glass-card p-6 md:p-8 rounded-3xl border border-border/40">
          <h2 className="text-xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground text-sm">
            Common questions and answers will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}
