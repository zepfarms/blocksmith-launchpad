import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function GrantTerms() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white pt-32">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-8 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <div className="prose prose-invert max-w-none">
            <h1 className="text-4xl font-bold mb-8">Acari Startup Micro Grant — Terms & Conditions</h1>
            
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Overview</h2>
              <p>
                The Acari Startup Micro Grant ("Grant") is a monthly program organized and administered by Acari.ai ("Acari," "we," "our," or "us"). The purpose of the Grant is to provide financial support to aspiring entrepreneurs, creators, and founders who are actively building or launching a new business using the Acari platform.
              </p>
              <p>
                By applying for the Grant, you ("Applicant," "you," or "your") agree to comply with these Terms & Conditions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Eligibility Requirements</h2>
              <p>To qualify for consideration, Applicants must:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Be at least 18 years of age.</li>
                <li>Be a legal resident of the United States.</li>
                <li>Have an active Acari.ai account.</li>
                <li>Submit a business idea or project through the Acari platform.</li>
                <li>Complete the minimum required onboarding steps or "blocks" within Acari.</li>
                <li>Provide truthful and accurate information during the application process.</li>
                <li>Submit all required materials by the specified deadline each month.</li>
              </ul>
              <p>Acari employees, contractors, and immediate family members are not eligible.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Application Process</h2>
              <p>Applicants may enter the Grant program by:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Creating a free account at Acari.ai.</li>
                <li>Adding their business idea within the platform.</li>
                <li>Completing the designated Acari starter blocks or tasks.</li>
                <li>Submitting their Grant application through Acari.</li>
              </ul>
              <p>No purchase or payment of any kind is required to enter or win.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Selection Criteria</h2>
              <p>This is not a random drawing or sweepstakes.</p>
              <p>Winners are chosen based on merit at Acari's sole discretion.</p>
              <p>Applications will be evaluated on:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Clarity of idea</li>
                <li>Feasibility</li>
                <li>Creativity</li>
                <li>Potential impact</li>
                <li>Demonstrated effort within Acari</li>
                <li>Authenticity of founder story</li>
                <li>Overall completeness and quality of the submission</li>
              </ul>
              <p>Acari may consider additional factors as needed.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Grant Award</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Each month, one Applicant will be selected to receive a $1,000 grant ("Award").</li>
                <li>The Award will be delivered via ACH transfer, PayPal, check, or another mutually agreed payment method.</li>
                <li>The Award is provided as a gift to support the Applicant's business activities.</li>
                <li>Acari does not require repayment of the Award.</li>
                <li>Acari does not guarantee business success or outcomes.</li>
                <li>Acari reserves the right to adjust the Award amount or frequency at any time.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Winner Notification</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Winners will be contacted using the email associated with their Acari account.</li>
                <li>If the winner does not respond within 7 days, Acari may select an alternate recipient at its discretion.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Publicity Release</h2>
              <p>By applying for the Grant, you agree that Acari may use:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Your name (first name + last initial)</li>
                <li>Your general location (city/state)</li>
                <li>Your business idea or description</li>
                <li>Your submitted materials</li>
                <li>Your likeness (optional with consent)</li>
              </ul>
              <p>…for promotional purposes, including on Acari's website, social media, marketing materials, and public announcements.</p>
              <p>You may opt out of photo/video usage upon request, but name and idea use is required for transparency of the program.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Applicant Representations</h2>
              <p>By submitting an application, you affirm that:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You are the original creator of the business idea.</li>
                <li>All information submitted is accurate and truthful.</li>
                <li>You are not violating any laws or third-party rights.</li>
                <li>You understand that Acari may verify the information provided.</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Limitations & Legal Rights</h2>
              <p>Acari reserves the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Modify or terminate the Grant program at any time</li>
                <li>Withhold the Award if fraud or misrepresentation is suspected</li>
                <li>Select winners at its sole discretion</li>
                <li>Disqualify Applicants who violate these Terms</li>
              </ul>
              <p>The Grant is void where prohibited by law.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Tax Information</h2>
              <p>
                Award recipients are responsible for reporting any grant funds received to the IRS or state tax authorities if required by law.
              </p>
              <p>
                Acari does not provide tax advice and is not responsible for any tax obligations associated with the Award.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">11. No Liability</h2>
              <p>By applying for the Grant, you agree that Acari shall not be liable for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Technical issues</li>
                <li>Application errors</li>
                <li>Payment delays</li>
                <li>Lost or corrupted data</li>
                <li>Indirect or consequential damages</li>
              </ul>
              <p>The maximum liability of Acari to any Applicant is the Award amount.</p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">12. Governing Law</h2>
              <p>
                These Terms & Conditions are governed by and interpreted according to the laws of the State of Delaware, without regard to conflict-of-law principles.
              </p>
              <p>
                Any disputes shall be resolved in the state or federal courts located in Delaware.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">13. Agreement</h2>
              <p>By submitting an application, you acknowledge that:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>You have read and understood these Terms</li>
                <li>You agree to be legally bound by them</li>
                <li>You meet all eligibility requirements</li>
              </ul>
              <p>If you do not agree to these Terms, do not apply for the Grant.</p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
