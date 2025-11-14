import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowLeft, Mail, MessageCircle, BookOpen, HelpCircle, ShieldCheck, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Support = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white pt-32">
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
                href="mailto:support@acari.ai"
                className="text-primary hover:text-primary/80 font-medium inline-flex items-center gap-2"
              >
                support@acari.ai
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </a>
            </div>

            <a
              href="https://discord.com/invite/spaceblocks"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-all block"
            >
              <div className="bg-primary/20 rounded-xl w-12 h-12 flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Discord Community</h3>
              <p className="text-gray-400 mb-4">
                Join our community to connect with other entrepreneurs and get real-time help.
              </p>
              <span className="text-primary hover:text-primary/80 font-medium inline-flex items-center gap-2">
                Join Discord Server
                <ArrowLeft className="w-4 h-4 rotate-180" />
              </span>
            </a>
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

          {/* Email Verification & Troubleshooting */}
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="w-8 h-8 text-acari-green" />
              <h2 className="text-3xl font-bold">Email Verification & Account Access</h2>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-6 sm:p-8">
              <Accordion type="single" collapsible className="w-full space-y-4">
                <AccordionItem value="item-1" className="border-white/10">
                  <AccordionTrigger className="text-left hover:text-acari-green">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-acari-green flex-shrink-0 mt-1" />
                      <span>I didn't receive my verification code</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400 space-y-3 pt-4 pl-8">
                    <p><strong className="text-white">Check your spam/junk folder:</strong> Email providers sometimes filter verification codes. Look in your spam, junk, or promotions folders.</p>
                    <p><strong className="text-white">Wait a few minutes:</strong> Delivery can take 1-5 minutes depending on your email provider.</p>
                    <p><strong className="text-white">Use the resend button:</strong> On the verification page, click "Resend Code" to get a new code. You can resend once immediately, then wait 60 seconds before requesting another.</p>
                    <p><strong className="text-white">Check your email address:</strong> Make sure you entered the correct email during signup.</p>
                    <p><strong className="text-white">Still not working?</strong> Email us at <a href="mailto:support@acari.ai" className="text-acari-green hover:underline">support@acari.ai</a> and we'll help you verify manually.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border-white/10">
                  <AccordionTrigger className="text-left hover:text-acari-green">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-acari-green flex-shrink-0 mt-1" />
                      <span>My verification code expired</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400 space-y-3 pt-4 pl-8">
                    <p>Verification codes expire after 10 minutes for security reasons.</p>
                    <p><strong className="text-white">Solution:</strong> Click the "Resend Code" button on the verification page to receive a fresh code. The new code will be valid for another 10 minutes.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border-white/10">
                  <AccordionTrigger className="text-left hover:text-acari-green">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-acari-green flex-shrink-0 mt-1" />
                      <span>The verification code isn't working</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400 space-y-3 pt-4 pl-8">
                    <p><strong className="text-white">Double-check the code:</strong> Verification codes are exactly 6 digits. Make sure you're entering all digits correctly.</p>
                    <p><strong className="text-white">Don't add spaces:</strong> Enter only the numbers, no spaces or dashes.</p>
                    <p><strong className="text-white">Use the latest code:</strong> If you requested multiple codes, only the most recent one will work.</p>
                    <p><strong className="text-white">Case sensitivity:</strong> Codes are numbers only, so case doesn't matter.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="border-white/10">
                  <AccordionTrigger className="text-left hover:text-acari-green">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-acari-green flex-shrink-0 mt-1" />
                      <span>Why do I need to verify my email?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400 space-y-3 pt-4 pl-8">
                    <p>Email verification helps us:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li><strong className="text-white">Protect your account:</strong> Ensures only you can access your business assets</li>
                      <li><strong className="text-white">Send important updates:</strong> Business launch notifications, payment confirmations, and support messages</li>
                      <li><strong className="text-white">Prevent abuse:</strong> Keeps the platform secure for all users</li>
                      <li><strong className="text-white">Enable password recovery:</strong> So you can reset your password if needed</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5" className="border-white/10">
                  <AccordionTrigger className="text-left hover:text-acari-green">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-acari-green flex-shrink-0 mt-1" />
                      <span>I'm using Gmail/Outlook and not receiving emails</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400 space-y-3 pt-4 pl-8">
                    <p><strong className="text-white">Gmail users:</strong> Check your "Promotions" or "Social" tabs. Sometimes verification emails get filtered there instead of Primary.</p>
                    <p><strong className="text-white">Outlook/Hotmail users:</strong> Check your "Other" or "Junk Email" folders. You may need to add no-reply@acari.ai to your safe senders list.</p>
                    <p><strong className="text-white">Add to safe senders:</strong> Mark no-reply@acari.ai as a safe sender to ensure future emails arrive in your inbox.</p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6" className="border-white/10">
                  <AccordionTrigger className="text-left hover:text-acari-green">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-acari-green flex-shrink-0 mt-1" />
                      <span>Can I change my email address?</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400 space-y-3 pt-4 pl-8">
                    <p>If you need to change your email address after signing up, please contact our support team at <a href="mailto:support@acari.ai" className="text-acari-green hover:underline">support@acari.ai</a> with:</p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Your current email address</li>
                      <li>Your new email address</li>
                      <li>Your business name (if you've created one)</li>
                    </ul>
                    <p className="mt-3">We'll verify your identity and update your account within 24 hours.</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
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
                <h3 className="text-xl font-semibold mb-4">How Acari Works</h3>
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
                <h3 className="text-xl font-semibold mb-4">Common Questions</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-white font-medium mb-2">What if I don't like the AI-generated assets?</h4>
                    <p className="text-gray-400">You can request revisions through your dashboard. Our AI will regenerate assets based on your feedback, or you can connect with a human specialist for custom work.</p>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-2">How long does it take to build my business?</h4>
                    <p className="text-gray-400">Most businesses are ready to review within 24-48 hours. Simple setups (website + logo) can be done in hours, while complex builds (full legal setup + marketing campaign) may take 2-3 days.</p>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-2">What happens after I launch?</h4>
                    <p className="text-gray-400">After launch, all your assets are unlocked and delivered to you. You'll receive login credentials, file downloads, and access instructions. Monthly services (like hosting or marketing) continue automatically.</p>
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-2">Can I add more services later?</h4>
                    <p className="text-gray-400">Absolutely! You can add new blocks to your business anytime from your dashboard. Just pick what you need and the AI will integrate it with your existing setup.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Support CTA */}
          <div className="bg-gradient-to-br from-acari-green/10 via-primary/10 to-acari-green/5 border border-acari-green/20 rounded-2xl p-8 text-center">
            <Mail className="w-12 h-12 text-acari-green mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-3">Still Need Help?</h3>
            <p className="text-gray-400 mb-6 max-w-2xl mx-auto">
              Our support team is here to help. We typically respond within 24 hours and are committed to solving your issue.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:support@acari.ai"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-acari-green text-black font-semibold rounded-lg hover:bg-acari-green/90 transition-all"
              >
                <Mail className="w-5 h-5" />
                Email Support
              </a>
              <a
                href="https://discord.com/invite/spaceblocks"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white font-semibold rounded-lg hover:bg-white/10 transition-all"
              >
                <MessageCircle className="w-5 h-5" />
                Join Discord
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Support;
