import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowLeft, Mail, MessageCircle, BookOpen, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Support = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate("/")}
            className="mb-8 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </button>

          <h1 className="text-5xl font-bold mb-4">Support Center</h1>
          <p className="text-xl text-gray-400 mb-12">
            We're here to help you succeed. Get the support you need, when you need it.
          </p>

          {/* Contact Methods */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
              <div className="bg-primary/20 rounded-xl w-12 h-12 flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Email Support</h3>
              <p className="text-gray-400 mb-4">
                Get help from our support team. We typically respond within 24 hours.
              </p>
              <a
                href="mailto:support@spaceblocks.ai"
                className="text-primary hover:text-primary/80 font-medium inline-flex items-center gap-2"
              >
                support@spaceblocks.ai
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </a>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all">
              <div className="bg-primary/20 rounded-xl w-12 h-12 flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Discord Community</h3>
              <p className="text-gray-400 mb-4">
                Join our community to connect with other entrepreneurs and get real-time help.
              </p>
              <a
                href="https://discord.com/invite/spaceblocks"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary/80 font-medium inline-flex items-center gap-2"
              >
                Join Discord Server
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Quick Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => navigate("/features")}
                className="bg-white/5 border border-white/10 rounded-xl p-6 text-left hover:bg-white/10 transition-all flex items-center gap-4"
              >
                <BookOpen className="w-6 h-6 text-primary" />
                <div>
                  <h4 className="font-semibold mb-1">Knowledge Base</h4>
                  <p className="text-sm text-gray-400">Learn about all features and capabilities</p>
                </div>
              </button>

              <button
                onClick={() => navigate("/start")}
                className="bg-white/5 border border-white/10 rounded-xl p-6 text-left hover:bg-white/10 transition-all flex items-center gap-4"
              >
                <HelpCircle className="w-6 h-6 text-primary" />
                <div>
                  <h4 className="font-semibold mb-1">Get Started</h4>
                  <p className="text-sm text-gray-400">Begin building your business today</p>
                </div>
              </button>
            </div>
          </div>

          {/* FAQs */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h4 className="font-semibold mb-2">How does the pricing work?</h4>
                <p className="text-gray-400">
                  You can build your entire business for free. You only pay when you're ready to launch. This allows you to review all your assets, make sure everything is perfect, and then launch when you're confident.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h4 className="font-semibold mb-2">Do I own the assets you create?</h4>
                <p className="text-gray-400">
                  Yes! Once you pay and launch, 100% of the assets we create are yours. This includes your logo, website, marketing materials, business cards, and everything else. You can download, modify, and use them however you like.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h4 className="font-semibold mb-2">How long does it take to launch?</h4>
                <p className="text-gray-400">
                  Most businesses are ready to launch within 48 hours. The exact timeline depends on the complexity of your business and which blocks you select. Our AI works 24/7 to build your assets quickly.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h4 className="font-semibold mb-2">Can I get a refund?</h4>
                <p className="text-gray-400">
                  We evaluate refund requests on a case-by-case basis. Since you can review everything before paying, we deliver exactly what you see. However, if there's an issue, please contact us at support@spaceblocks.ai and we'll work it out.
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h4 className="font-semibold mb-2">Is there real human support?</h4>
                <p className="text-gray-400">
                  Absolutely! While our AI handles the building, real humans are available to help you succeed. You can email us, join our Discord community, or request personalized assistance anytime.
                </p>
              </div>
            </div>
          </div>

          {/* Contact Card */}
          <div className="bg-gradient-to-br from-primary/10 to-purple-500/10 border border-white/20 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
            <p className="text-gray-300 mb-6">
              Our support team is ready to help you succeed. Reach out anytime.
            </p>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 inline-block">
              <p className="mb-2"><strong>Email:</strong> support@spaceblocks.ai</p>
              <p><strong>Address:</strong> P.O. Box 1234, Shawnee, OK 74802</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Support;
