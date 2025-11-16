import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowLeft, Handshake, TrendingUp, Zap, HeadphonesIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Partners() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    contactPerson: "",
    email: "",
    phone: "",
    website: "",
    partnershipType: "",
    productDescription: "",
    integrationScope: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await supabase.functions.invoke("send-partner-inquiry", {
        body: formData,
      });

      toast({
        title: "Application sent!",
        description: "We'll review your application and get back to you within 3-5 business days.",
      });

      setFormData({
        companyName: "",
        contactPerson: "",
        email: "",
        phone: "",
        website: "",
        partnershipType: "",
        productDescription: "",
        integrationScope: ""
      });
    } catch (error: any) {
      toast({
        title: "Failed to send application",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const benefits = [
    {
      icon: TrendingUp,
      title: "Reach Thousands of Entrepreneurs",
      description: "Get your product in front of motivated business owners actively building their ventures."
    },
    {
      icon: Zap,
      title: "Featured Placement",
      description: "Premium visibility on our platform with enhanced promotional opportunities."
    },
    {
      icon: TrendingUp,
      title: "Performance Tracking",
      description: "Access detailed analytics on user engagement and conversion metrics."
    },
    {
      icon: HeadphonesIcon,
      title: "Dedicated Support",
      description: "Your partnership success manager helps optimize your listing and performance."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-32 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-8"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          {/* Hero */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-acari-green to-neon-cyan bg-clip-text text-transparent">
              Showcase Your Product to Thousands
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Partner with Acari to get your product or service in front of motivated entrepreneurs building their businesses. Grow your customer base while helping others succeed.
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="glass-card p-6">
                <benefit.icon className="w-12 h-12 text-acari-green mb-4" />
                <h3 className="text-lg font-bold mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>

          {/* Partnership Types */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-center">Partnership Opportunities</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card p-6 text-center hover:border-acari-green transition-colors">
                <h3 className="text-xl font-bold mb-3">Platform Listing</h3>
                <p className="text-muted-foreground">
                  Get listed in our tools directory with direct links to your product or service.
                </p>
              </div>
              <div className="glass-card p-6 text-center hover:border-acari-green transition-colors">
                <h3 className="text-xl font-bold mb-3">Featured Partner</h3>
                <p className="text-muted-foreground">
                  Premium placement with enhanced visibility and promotional opportunities.
                </p>
              </div>
              <div className="glass-card p-6 text-center hover:border-acari-green transition-colors">
                <h3 className="text-xl font-bold mb-3">Integration Partner</h3>
                <p className="text-muted-foreground">
                  Deep platform integration with seamless user experience and co-marketing.
                </p>
              </div>
            </div>
          </div>

          {/* Application Form */}
          <div className="glass-card p-8 md:p-12">
            <h2 className="text-3xl font-bold mb-4 text-center">Become a Partner</h2>
            <p className="text-muted-foreground mb-8 text-center">
              Interested in showcasing your product or service to thousands of entrepreneurs? Fill out the form below and we'll get back to you.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Company Name *</label>
                  <Input
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Contact Person *</label>
                  <Input
                    required
                    value={formData.contactPerson}
                    onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Email *</label>
                  <Input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Phone</label>
                  <Input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Company Website *</label>
                <Input
                  type="url"
                  required
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Partnership Type *</label>
                <Select
                  value={formData.partnershipType}
                  onValueChange={(value) => setFormData({ ...formData, partnershipType: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select partnership type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="platform-listing">Platform Listing</SelectItem>
                    <SelectItem value="featured-placement">Featured Placement</SelectItem>
                    <SelectItem value="integration">Integration Partnership</SelectItem>
                    <SelectItem value="custom">Custom Partnership</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Product/Service Description *</label>
                <Textarea
                  required
                  rows={4}
                  placeholder="Tell us about your product or service..."
                  value={formData.productDescription}
                  onChange={(e) => setFormData({ ...formData, productDescription: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Expected Integration Scope *</label>
                <Textarea
                  required
                  rows={4}
                  placeholder="Describe how you envision working with Acari..."
                  value={formData.integrationScope}
                  onChange={(e) => setFormData({ ...formData, integrationScope: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Application"}
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                We'll review your application and get back to you within 3-5 business days
              </p>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}