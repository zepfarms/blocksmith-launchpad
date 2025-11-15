import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Phone, Mail, MapPin, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AutomotiveTemplate() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Demo data
  const demoData = {
    businessName: "AutoCare Pro",
    logoUrl: "/acari-logo.png",
    heroTitle: "Expert Auto Care & Repair",
    heroSubtitle: "Professional automotive services you can trust. From routine maintenance to complex repairs.",
    phone: "(555) 123-4567",
    email: "info@autocarepro.com",
    address: "123 Main Street, Your City, ST 12345",
    services: [
      {
        title: "Oil Change & Maintenance",
        description: "Keep your engine running smooth with regular oil changes and preventive maintenance."
      },
      {
        title: "Brake Service",
        description: "Professional brake inspection, repair, and replacement for your safety."
      },
      {
        title: "Engine Diagnostics",
        description: "Advanced computer diagnostics to identify and fix engine issues quickly."
      },
      {
        title: "Tire Service",
        description: "Full tire services including rotation, balancing, and replacement."
      },
      {
        title: "Transmission Repair",
        description: "Expert transmission diagnostics and repair for all makes and models."
      },
      {
        title: "AC & Heating",
        description: "Climate control system repair to keep you comfortable year-round."
      }
    ],
    aboutText: "With over 25 years of experience, AutoCare Pro is your trusted partner for all automotive needs. Our ASE-certified technicians use the latest diagnostic equipment to ensure your vehicle receives the highest quality care."
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-card/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <img src={demoData.logoUrl} alt={demoData.businessName} className="h-10 w-10" />
              <span className="font-bold text-xl">{demoData.businessName}</span>
            </div>

            {/* Desktop Nav */}
            <ul className="hidden md:flex items-center gap-8">
              <li><a href="#home" className="text-foreground/80 hover:text-foreground transition-colors">Home</a></li>
              <li><a href="#services" className="text-foreground/80 hover:text-foreground transition-colors">Services</a></li>
              <li><a href="#about" className="text-foreground/80 hover:text-foreground transition-colors">About</a></li>
              <li>
                <a href="#contact">
                  <Button variant="default" className="rounded-full">Book Service</Button>
                </a>
              </li>
            </ul>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-2">
              <a href="#home" className="block py-2 text-foreground/80">Home</a>
              <a href="#services" className="block py-2 text-foreground/80">Services</a>
              <a href="#about" className="block py-2 text-foreground/80">About</a>
              <a href="#contact" className="block py-2">
                <Button variant="default" className="w-full rounded-full">Book Service</Button>
              </a>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative py-20 sm:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-destructive/20 via-background to-background" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent">
              {demoData.heroTitle}
            </h1>
            <p className="text-xl sm:text-2xl text-muted-foreground mb-8">
              {demoData.heroSubtitle}
            </p>
            <a href="#contact">
              <Button size="lg" className="rounded-full text-lg px-8">
                Schedule Appointment
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {demoData.services.map((service, idx) => (
              <div
                key={idx}
                className="glass-card p-8 rounded-2xl hover:scale-105 transition-all duration-300 border-l-4 border-destructive"
              >
                <h3 className="text-2xl font-bold mb-4 text-destructive">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-12">About Us</h2>
          <p className="text-lg text-muted-foreground leading-relaxed text-center">
            {demoData.aboutText}
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-card/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-16">Book Your Service</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div className="space-y-6">
              <div className="flex gap-4 items-start">
                <Phone className="h-6 w-6 text-destructive shrink-0 mt-1" />
                <div>
                  <strong className="block text-lg mb-1">Phone</strong>
                  <p className="text-muted-foreground">{demoData.phone}</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <Mail className="h-6 w-6 text-destructive shrink-0 mt-1" />
                <div>
                  <strong className="block text-lg mb-1">Email</strong>
                  <p className="text-muted-foreground">{demoData.email}</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <MapPin className="h-6 w-6 text-destructive shrink-0 mt-1" />
                <div>
                  <strong className="block text-lg mb-1">Location</strong>
                  <p className="text-muted-foreground">{demoData.address}</p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <form className="glass-card p-8 rounded-2xl space-y-4">
              <input
                type="text"
                placeholder="Name"
                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-destructive"
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-destructive"
                required
              />
              <input
                type="tel"
                placeholder="Phone"
                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-destructive"
                required
              />
              <input
                type="text"
                placeholder="Vehicle Make & Model"
                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-destructive"
                required
              />
              <select
                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-destructive"
                required
              >
                <option value="">Select Service</option>
                <option>Oil Change</option>
                <option>Brake Service</option>
                <option>Tire Service</option>
                <option>General Maintenance</option>
              </select>
              <textarea
                rows={3}
                placeholder="Additional details"
                className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-destructive resize-none"
              />
              <Button type="submit" className="w-full rounded-full" size="lg">
                Book Appointment
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-muted-foreground">
            &copy; 2024 {demoData.businessName}. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Floating Back Button */}
      <Button
        onClick={() => navigate('/templates')}
        variant="outline"
        size="lg"
        className="fixed bottom-8 left-8 rounded-full shadow-premium z-50"
      >
        <ArrowLeft className="mr-2 h-5 w-5" />
        Back to Templates
      </Button>
    </div>
  );
}
