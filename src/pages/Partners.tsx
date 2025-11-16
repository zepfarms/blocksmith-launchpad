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
      title: "Reach Engaged Entrepreneurs",
      description: "Connect with thousands of motivated business builders actively seeking solutions."
    },
    {
      icon: Handshake,
      title: "Earn Affiliate Revenue",
      description: "Generate income through our competitive affiliate program."
    },
    {
      icon: Zap,
      title: "Seamless Integration",
      description: "Easy integration process with our platform and technical support."
    },
    {
      icon: HeadphonesIcon,
      title: "Dedicated Support",
      description: "Work with our partnership team to maximize your success."
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
              Partner with Acari
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join our network of partners helping entrepreneurs succeed. Reach thousands of business builders while growing your own business.
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
          <div className="glass-card p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6">Partnership Types</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="font-bold mb-2">Affiliate Partners</h3>
                <p className="text-sm text-muted-foreground">
                  Promote products and services to our entrepreneur community and earn commissions.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Integration Partners</h3>
                <p className="text-sm text-muted-foreground">
                  Integrate your service directly into the Acari platform for seamless user experience.
                </p>
              </div>
              <div>
                <h3 className="font-bold mb-2">Service Providers</h3>
                <p className="text-sm text-muted-foreground">
                  Offer specialized services to entrepreneurs building their businesses.
                </p>
              </div>
            </div>
          </div>

          {/* Application Form */}
          <div className="glass-card p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Apply to Become a Partner</h2>
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
                    <SelectItem value="affiliate">Affiliate Partner</SelectItem>
                    <SelectItem value="integration">Integration Partner</SelectItem>
                    <SelectItem value="service">Service Provider</SelectItem>
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