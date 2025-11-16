import { Mail, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Help() {
  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-2">Help & Support</h1>
      <p className="text-muted-foreground mb-8">Get help with your Acari experience</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Email Support */}
        <div className="glass-card p-6 hover:scale-[1.02] transition-all">
          <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 w-fit mb-4">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Email Support</h3>
          <p className="text-muted-foreground mb-4">
            Get in touch with our support team for personalized assistance
          </p>
          <Button
            variant="outline"
            className="w-full border-white/20 hover:bg-white/10"
            onClick={() => window.location.href = 'mailto:support@acari.com'}
          >
            <Mail className="w-4 h-4 mr-2" />
            Contact Support
          </Button>
        </div>

        {/* Documentation */}
        <div className="glass-card p-6 hover:scale-[1.02] transition-all">
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 w-fit mb-4">
            <BookOpen className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Documentation</h3>
          <p className="text-muted-foreground mb-4">
            Browse our guides and learn how to use all features
          </p>
          <Button
            variant="outline"
            className="w-full border-white/20 hover:bg-white/10"
            onClick={() => window.open('/support', '_blank')}
          >
            <BookOpen className="w-4 h-4 mr-2" />
            View Docs
          </Button>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="glass-card p-6 mt-6">
        <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-medium mb-1">How do I unlock more apps?</h4>
            <p className="text-sm text-muted-foreground">
              Visit the App Store to browse and unlock additional tools for your business.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-1">Where can I find my saved assets?</h4>
            <p className="text-sm text-muted-foreground">
              All your saved logos, business plans, and other assets are available in your Briefcase.
            </p>
          </div>
          <div>
            <h4 className="font-medium mb-1">How do I manage my subscription?</h4>
            <p className="text-sm text-muted-foreground">
              You can view and manage your subscriptions from the Settings page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}