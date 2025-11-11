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

          {/* Help Center */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-6">Help Center</h2>
            <div className="space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Getting Started</h3>
                <div className="space-y-3 text-gray-400">
                  <p><strong className="text-white">1. Tell us your idea:</strong> Start by describing your business idea in plain language. No business plan needed—just tell us what you want to do.</p>
                  <p><strong className="text-white">2. Pick your blocks:</strong> Choose from 200+ business services like Website, Logo Design, Legal Setup, Marketing, Payments, and more. Our AI recommends the essentials based on your business type.</p>
                  <p><strong className="text-white">3. Answer questions:</strong> We'll ask a few quick questions to personalize your business assets. Takes just a few minutes.</p>
                  <p><strong className="text-white">4. Review everything:</strong> Watch as AI builds your business assets. Preview everything in your dashboard before paying a dime.</p>
                  <p><strong className="text-white">5. Launch when ready:</strong> Once you're happy with everything, click launch to go live and unlock all your assets.</p>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">How SpaceBlocks Works</h3>
                <div className="space-y-3 text-gray-400">
                  <p><strong className="text-white">AI + Human Collaboration:</strong> Our AI handles the heavy lifting—building your website, designing your logo, writing marketing copy, setting up payments, and more. When you need help, real humans are available via email and Discord.</p>
                  <p><strong className="text-white">Business Blocks:</strong> Instead of hiring 10 different freelancers, you pick "blocks" for what you need. Each block is a service (like "Website Builder" or "Email Marketing Setup") that gets automatically built for your business.</p>
                  <p><strong className="text-white">Build First, Pay Later:</strong> Unlike other services, you can build your entire business, review all the work, and only pay when you're ready to launch. No surprises, no commitment until you're confident.</p>
                  <p><strong className="text-white">You Own Everything:</strong> All assets created for your business—logos, websites, marketing materials, domain names, business plans—are 100% yours after launch.</p>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Available Services (200+ Blocks)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-gray-400">
                  <div>
                    <strong className="text-white">Essentials:</strong> Business Name, Logo Design, Website Builder, Domain Setup, Email Setup, Business Cards
                  </div>
                  <div>
                    <strong className="text-white">Legal & Compliance:</strong> LLC Formation, EIN Registration, Business Licenses, Privacy Policy, Terms of Service
                  </div>
                  <div>
                    <strong className="text-white">Marketing:</strong> Social Media Kit, Content Calendar, SEO Setup, Google Ads, Facebook Ads, Email Marketing
                  </div>
                  <div>
                    <strong className="text-white">Sales & Payments:</strong> Payment Processing, Online Store, Product Listings, Checkout Pages, Invoice Templates
                  </div>
                  <div>
                    <strong className="text-white">Operations:</strong> Customer Support Setup, Booking System, Automations, CRM Integration, Analytics Dashboard
                  </div>
                  <div>
                    <strong className="text-white">Growth:</strong> Pitch Deck, Business Plan, Investor Matching, Grant Research, Loan Applications
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Pricing & Payment</h3>
                <div className="space-y-3 text-gray-400">
                  <p><strong className="text-white">No upfront costs:</strong> Start building completely free. No credit card required.</p>
                  <p><strong className="text-white">Pay when ready to launch:</strong> Only pay when you're ready to go live with your business. Review everything first.</p>
                  <p><strong className="text-white">Transparent pricing:</strong> Each block shows its price. Free blocks are clearly marked. Total cost shown before checkout.</p>
                  <p><strong className="text-white">Launch bundle:</strong> When you click "Launch My Business," you pay once for all selected blocks and they unlock immediately.</p>
                  <p><strong className="text-white">Refund policy:</strong> Evaluated case-by-case. Since you preview everything before paying, we deliver exactly what you see.</p>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Dashboard Features</h3>
                <div className="space-y-3 text-gray-400">
                  <p><strong className="text-white">Work-in-Progress View:</strong> See all your blocks being built in real-time with status indicators (Draft, Ready to Review, Approved).</p>
                  <p><strong className="text-white">Review & Approve:</strong> Preview each asset before launch. Logos, websites, marketing materials—all available for review.</p>
                  <p><strong className="text-white">Request Edits:</strong> Not happy with something? Request changes and our team will revise it.</p>
                  <p><strong className="text-white">Watermarked Previews:</strong> All assets show in preview mode until launch (logos have watermarks, websites are staging-only, etc.).</p>
                  <p><strong className="text-white">One-Click Launch:</strong> When everything looks perfect, click "Launch My Business" to unlock everything and go live.</p>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Common Questions</h3>
                <div className="space-y-4">
                  <div>
                    <p className="font-semibold text-white mb-1">Do I need tech skills?</p>
                    <p className="text-gray-400">No. SpaceBlocks handles everything technical. No coding, no design tools, no complicated setup.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-white mb-1">How long does it take?</p>
                    <p className="text-gray-400">Most businesses are ready to launch within 48 hours. Some blocks are instant, others take 1-2 days depending on complexity.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-white mb-1">Can I change my mind about blocks?</p>
                    <p className="text-gray-400">Yes! Add or remove blocks anytime before launch. You only pay for what you actually launch with.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-white mb-1">What if I need help?</p>
                    <p className="text-gray-400">Email us at support@spaceblocks.ai or join our Discord community for real-time help from our team and other entrepreneurs.</p>
                  </div>
                  <div>
                    <p className="font-semibold text-white mb-1">Can I use this for an existing business?</p>
                    <p className="text-gray-400">Absolutely! Many users add blocks to grow their existing business—whether it's adding a website, setting up online payments, or launching marketing campaigns.</p>
                  </div>
                </div>
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
