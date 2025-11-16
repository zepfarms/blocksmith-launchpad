import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ArrowLeft, MessageSquare, Headset, Mail, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Contact() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    subject: "",
    message: "",
    type: "general"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from("contact_submissions")
        .insert(formData);

      if (error) throw error;

      await supabase.functions.invoke("send-contact-notification", {
        body: formData,
      });

      toast({
        title: "Message sent!",
        description: "We'll get back to you within 24-48 hours.",
      });

      setFormData({
        name: "",
        email: "",
        company: "",
        subject: "",
        message: "",
        type: "general"
      });
    } catch (error: any) {
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactOptions = [
    {
      icon: MessageSquare,
      title: "Sales & Partnerships",
      description: "Interested in partnering or becoming an affiliate?",
      action: () => navigate("/partners")
    },
    {
      icon: Headset,
      title: "Technical Support",
      description: "Need help with your account or technical issues?",
      action: () => navigate("/support")
    },
    {
      icon: Mail,
      title: "General Inquiries",
      description: "Have a question? We'd love to hear from you.",
      action: () => document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" })
    },
    {
      icon: Users,
      title: "Community",
      description: "Join our Discord community for real-time help.",
      action: () => window.open("https://discord.com/invite/spaceblocks", "_blank")
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
              Get in Touch
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Have questions? We're here to help. Choose the option that best fits your needs.
            </p>
          </div>

          {/* Contact Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {contactOptions.map((option) => (
              <div
                key={option.title}
                onClick={option.action}
                className="glass-card p-6 cursor-pointer hover:border-acari-green/50 transition-all group"
              >
                <option.icon className="w-12 h-12 text-acari-green mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-lg font-bold mb-2">{option.title}</h3>
                <p className="text-sm text-muted-foreground">{option.description}</p>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div id="contact-form" className="glass-card p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Name *</label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email *</label>
                  <Input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Company</label>
                <Input
                  value={formData.company}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Subject Type *</label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General Inquiry</SelectItem>
                    <SelectItem value="partnership">Partnership</SelectItem>
                    <SelectItem value="support">Technical Support</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Subject *</label>
                <Input
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Message *</label>
                <Textarea
                  required
                  rows={6}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                We typically respond within 24-48 hours
              </p>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}