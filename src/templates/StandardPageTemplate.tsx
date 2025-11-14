/**
 * STANDARD PAGE LAYOUT TEMPLATE
 * 
 * Use this template for creating new static pages (Terms, Privacy, etc.)
 * to maintain consistency across the site.
 * 
 * Key features:
 * - pt-32 on wrapper to clear the fixed header
 * - Standard "Back to Home" button with ArrowLeft icon
 * - Consistent spacing and container widths
 * - Dark theme with proper text colors
 */

import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function StandardPageTemplate() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white pt-32">
      <Header />
      
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Standard Back Button - DO NOT MODIFY */}
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-8 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          {/* Page Content Goes Here */}
          <div className="prose prose-invert max-w-none">
            <h1 className="text-4xl font-bold mb-8">Page Title</h1>
            
            {/* Add your page content here */}
            <p>Page content...</p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
