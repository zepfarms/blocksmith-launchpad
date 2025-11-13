import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Terms = () => {
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

          <h1 className="text-5xl font-bold mb-4">Terms of Service</h1>
          <p className="text-gray-400 mb-8">Last updated: January 11, 2025</p>

          <div className="space-y-8 text-gray-300">
            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Agreement to Terms</h2>
              <p>
                By accessing or using Acari ("Service"), you agree to be bound by these Terms of Service ("Terms"). If you disagree with any part of these terms, you may not access the Service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Description of Service</h2>
              <p>
                Acari provides an AI-powered platform for building and launching businesses. Our services include business planning, brand development, website creation, marketing support, and other business-building tools and resources.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. User Accounts</h2>
              <h3 className="text-xl font-semibold text-white mb-2">3.1 Account Creation</h3>
              <p className="mb-4">
                You must create an account to use certain features of our Service. You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.
              </p>

              <h3 className="text-xl font-semibold text-white mb-2">3.2 Account Security</h3>
              <p>
                You are responsible for safeguarding your account password and for any activities or actions under your account. You agree to notify us immediately of any unauthorized access to or use of your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Pricing and Payment</h2>
              <h3 className="text-xl font-semibold text-white mb-2">4.1 Pricing Model</h3>
              <p className="mb-4">
                Acari operates on a "build first, pay when ready to launch" model. You can build and review your business assets before payment is required. Payment is only required when you choose to launch your business.
              </p>

              <h3 className="text-xl font-semibold text-white mb-2">4.2 Payment Processing</h3>
              <p className="mb-4">
                All payments are processed through secure third-party payment processors. We do not store your payment card information. You agree to pay all fees and charges incurred in connection with your use of the Service.
              </p>

              <h3 className="text-xl font-semibold text-white mb-2">4.3 Refunds</h3>
              <p>
                Refund requests are evaluated on a case-by-case basis. Once your business is launched and assets are delivered, refunds may not be available. Please contact support@acari.ai for refund inquiries.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Intellectual Property Rights</h2>
              <h3 className="text-xl font-semibold text-white mb-2">5.1 Your Content</h3>
              <p className="mb-4">
                You retain all ownership rights to the business assets we create for you, including logos, websites, marketing materials, and other deliverables. Once you pay for and launch your business, these assets are 100% yours.
              </p>

              <h3 className="text-xl font-semibold text-white mb-2">5.2 Our Platform</h3>
              <p>
                The Service, including its original content, features, and functionality, is owned by Acari and is protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Prohibited Uses</h2>
              <p className="mb-2">You agree not to use the Service:</p>
              <ul className="list-disc list-inside space-y-2">
                <li>For any unlawful purpose or to violate any laws</li>
                <li>To transmit any harmful code, viruses, or malicious software</li>
                <li>To infringe upon the rights of others</li>
                <li>To harass, abuse, or harm another person</li>
                <li>To impersonate any person or entity</li>
                <li>To interfere with or disrupt the Service or servers</li>
                <li>To attempt to gain unauthorized access to any portion of the Service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. AI-Generated Content</h2>
              <p>
                Our Service uses artificial intelligence to analyze business ideas and generate recommendations. While we strive for accuracy, AI-generated content may contain errors or inaccuracies. You are responsible for reviewing and verifying all content before use in your business.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Limitation of Liability</h2>
              <p>
                TO THE MAXIMUM EXTENT PERMITTED BY LAW, ACARI SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Disclaimer of Warranties</h2>
              <p>
                THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Indemnification</h2>
              <p>
                You agree to indemnify and hold harmless Acari and its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including attorneys' fees) arising out of your use of the Service or violation of these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">11. Termination</h2>
              <p>
                We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason, including if you breach these Terms. Upon termination, your right to use the Service will immediately cease.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">12. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of the State of Oklahoma, United States, without regard to its conflict of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">13. Changes to Terms</h2>
              <p>
                We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. Your continued use of the Service after changes become effective constitutes acceptance of the revised Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">14. Contact Information</h2>
              <p className="mb-2">If you have questions about these Terms, please contact us:</p>
              <div className="bg-white/5 border border-white/10 rounded-xl p-6">
                <p className="mb-2"><strong>Email:</strong> support@acari.ai</p>
                <p><strong>Address:</strong> P.O. Box 1234, Shawnee, OK 74802</p>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;
