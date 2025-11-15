import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Phone, Mail, MapPin, Menu, X, Clock, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function RestaurantTemplate() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenuCategory, setActiveMenuCategory] = useState("all");

  // Read preview data from URL params
  const searchParams = new URLSearchParams(window.location.search);
  const isPreview = searchParams.get('preview') === 'true';
  const previewBusinessName = searchParams.get('businessName');
  const previewIndustry = searchParams.get('industry');

  // Demo data with preview support
  const demoData = {
    businessName: previewBusinessName || "Bella Vita Trattoria",
    logoUrl: "/acari-logo.png",
    tagline: "Authentic Italian Cuisine",
    heroTitle: "Where Every Meal Tells a Story",
    heroSubtitle: "Experience the authentic flavors of Italy in a warm, inviting atmosphere",
    phone: "(555) 123-4567",
    email: "info@bellavita.com",
    address: "123 Main Street, Your City, ST 12345",
    hours: "Open Daily 11am-10pm",
    aboutText: "For over 20 years, we've been serving authentic Italian cuisine made with love and the freshest ingredients. Our family recipes have been passed down through generations, bringing the true taste of Italy to your table.",
    menuCategories: [
      {
        name: "Appetizers",
        items: [
          { name: "Bruschetta al Pomodoro", description: "Toasted bread with fresh tomatoes, basil, and olive oil", price: "$12" },
          { name: "Calamari Fritti", description: "Crispy fried squid with marinara sauce", price: "$15" },
          { name: "Caprese Salad", description: "Fresh mozzarella, tomatoes, and basil drizzled with balsamic", price: "$14" }
        ]
      },
      {
        name: "Main Courses",
        items: [
          { name: "Spaghetti Carbonara", description: "Classic Roman pasta with eggs, cheese, and pancetta", price: "$22" },
          { name: "Osso Buco", description: "Braised veal shanks in white wine and vegetables", price: "$38" },
          { name: "Margherita Pizza", description: "Traditional pizza with tomato, mozzarella, and basil", price: "$18" },
          { name: "Chicken Parmigiana", description: "Breaded chicken with marinara and melted cheese", price: "$26" }
        ]
      },
      {
        name: "Desserts",
        items: [
          { name: "Tiramisu", description: "Classic Italian coffee-flavored dessert", price: "$10" },
          { name: "Panna Cotta", description: "Silky vanilla custard with berry compote", price: "$9" },
          { name: "Gelato", description: "Homemade Italian ice cream - ask for today's flavors", price: "$8" }
        ]
      }
    ]
  };

  const allMenuItems = demoData.menuCategories.flatMap(cat => 
    cat.items.map(item => ({ ...item, category: cat.name.toLowerCase() }))
  );

  const filteredItems = activeMenuCategory === "all" 
    ? allMenuItems 
    : allMenuItems.filter(item => item.category === activeMenuCategory);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-red-900 to-red-800 text-white py-2.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm flex-wrap gap-2">
            <div className="flex gap-6">
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {demoData.address}
              </span>
              <span className="hidden sm:flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {demoData.hours}
              </span>
            </div>
            <div className="flex gap-4 items-center">
              <a href={`tel:${demoData.phone}`} className="flex items-center gap-2 hover:text-amber-300 transition-colors">
                <Phone className="h-4 w-4" />
                {demoData.phone}
              </a>
              <Button size="sm" className="bg-amber-400 hover:bg-amber-500 text-gray-900 rounded-full px-4 h-7">
                Order Online
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-xl border-b border-border shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-3">
              <img src={demoData.logoUrl} alt={demoData.businessName} className="h-12 w-12" />
              <div>
                <span className="font-bold text-2xl text-red-700" style={{ fontFamily: 'Georgia, serif' }}>
                  {demoData.businessName}
                </span>
                <p className="text-xs text-muted-foreground">{demoData.tagline}</p>
              </div>
            </div>

            {/* Desktop Nav */}
            <ul className="hidden md:flex items-center gap-8">
              <li><a href="#home" className="text-foreground/80 hover:text-red-700 transition-colors font-medium">Home</a></li>
              <li><a href="#menu" className="text-foreground/80 hover:text-red-700 transition-colors font-medium">Menu</a></li>
              <li><a href="#about" className="text-foreground/80 hover:text-red-700 transition-colors font-medium">About</a></li>
              <li><a href="#gallery" className="text-foreground/80 hover:text-red-700 transition-colors font-medium">Gallery</a></li>
              <li><a href="#contact" className="text-foreground/80 hover:text-red-700 transition-colors font-medium">Contact</a></li>
            </ul>

            <Button className="hidden md:flex bg-red-700 hover:bg-red-800 rounded-full px-6">
              Reserve Table
            </Button>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-2 border-t">
              <a href="#home" className="block py-2 text-foreground/80">Home</a>
              <a href="#menu" className="block py-2 text-foreground/80">Menu</a>
              <a href="#about" className="block py-2 text-foreground/80">About</a>
              <a href="#gallery" className="block py-2 text-foreground/80">Gallery</a>
              <a href="#contact" className="block py-2 text-foreground/80">Contact</a>
              <Button className="w-full bg-red-700 hover:bg-red-800 rounded-full mt-2">
                Reserve Table
              </Button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-red-700 via-red-800 to-red-900 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent,rgba(0,0,0,0.3))]" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-96 h-96 bg-amber-400 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-[500px] h-[500px] bg-amber-400 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10 max-w-4xl px-4 text-center">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6" style={{ fontFamily: 'Georgia, serif' }}>
            {demoData.heroTitle}
          </h1>
          <p className="text-xl sm:text-2xl mb-10 text-white/90 max-w-2xl mx-auto">
            {demoData.heroSubtitle}
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" className="bg-amber-400 hover:bg-amber-500 text-gray-900 rounded-full px-8 text-lg">
              View Menu
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 rounded-full px-8 text-lg">
              Call to Order
            </Button>
          </div>
        </div>

        <div className="absolute bottom-8 animate-bounce">
          <div className="text-4xl">↓</div>
        </div>
      </section>

      {/* Welcome Section */}
      <section id="about" className="py-20 bg-gradient-to-b from-amber-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-red-700 font-semibold text-sm tracking-wider uppercase">Welcome to</span>
              <h2 className="text-4xl sm:text-5xl font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>
                {demoData.businessName}
              </h2>
              <div className="w-20 h-1 bg-red-700" />
              <p className="text-lg text-gray-700 leading-relaxed">
                {demoData.aboutText}
              </p>
              <div className="space-y-3 pt-4">
                <div className="flex items-center gap-3 text-green-700">
                  <Star className="h-5 w-5 fill-current" />
                  <span className="font-medium">Fresh Ingredients Daily</span>
                </div>
                <div className="flex items-center gap-3 text-green-700">
                  <Star className="h-5 w-5 fill-current" />
                  <span className="font-medium">Authentic Recipes</span>
                </div>
                <div className="flex items-center gap-3 text-green-700">
                  <Star className="h-5 w-5 fill-current" />
                  <span className="font-medium">Family Atmosphere</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-red-200 to-red-300 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">🍝</div>
                  <p className="text-2xl font-semibold text-red-900">Welcome</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section id="menu" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-red-700 font-semibold text-sm tracking-wider uppercase">Discover</span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-2 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              Our Menu
            </h2>
            <div className="w-20 h-1 bg-red-700 mx-auto" />
          </div>

          {/* Menu Category Tabs */}
          <div className="flex justify-center gap-4 mb-12 flex-wrap">
            <Button
              variant={activeMenuCategory === "all" ? "default" : "outline"}
              onClick={() => setActiveMenuCategory("all")}
              className={`rounded-full ${activeMenuCategory === "all" ? "bg-red-700 hover:bg-red-800" : "hover:bg-red-50"}`}
            >
              All
            </Button>
            {demoData.menuCategories.map(cat => (
              <Button
                key={cat.name}
                variant={activeMenuCategory === cat.name.toLowerCase() ? "default" : "outline"}
                onClick={() => setActiveMenuCategory(cat.name.toLowerCase())}
                className={`rounded-full ${activeMenuCategory === cat.name.toLowerCase() ? "bg-red-700 hover:bg-red-800" : "hover:bg-red-50"}`}
              >
                {cat.name}
              </Button>
            ))}
          </div>

          {/* Menu Items Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item, idx) => (
              <div key={idx} className="bg-gradient-to-br from-amber-50 to-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 border border-amber-200">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-900">{item.name}</h3>
                  <span className="text-red-700 font-bold text-lg">{item.price}</span>
                </div>
                <p className="text-gray-600 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 bg-gradient-to-b from-white to-amber-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-red-700 font-semibold text-sm tracking-wider uppercase">Explore</span>
            <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-2 mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              Gallery
            </h2>
            <div className="w-20 h-1 bg-red-700 mx-auto" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <div key={i} className="aspect-square rounded-xl overflow-hidden shadow-lg bg-gradient-to-br from-red-200 to-amber-200 flex items-center justify-center hover:scale-105 transition-transform cursor-pointer">
                <div className="text-5xl">🍝</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-gradient-to-br from-red-900 to-red-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4" style={{ fontFamily: 'Georgia, serif' }}>
              Visit Us Today
            </h2>
            <p className="text-xl text-white/90">We'd love to serve you</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
              <MapPin className="h-12 w-12 mx-auto mb-4 text-amber-400" />
              <h3 className="text-xl font-bold mb-2">Location</h3>
              <p className="text-white/90">{demoData.address}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
              <Phone className="h-12 w-12 mx-auto mb-4 text-amber-400" />
              <h3 className="text-xl font-bold mb-2">Call Us</h3>
              <p className="text-white/90">{demoData.phone}</p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8">
              <Mail className="h-12 w-12 mx-auto mb-4 text-amber-400" />
              <h3 className="text-xl font-bold mb-2">Email</h3>
              <p className="text-white/90">{demoData.email}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-white/60">
            © 2024 {demoData.businessName}. All rights reserved.
          </p>
        </div>
      </footer>

      {!isPreview && (
        <Button
          onClick={() => navigate('/')}
          className="fixed bottom-4 right-4 rounded-full shadow-lg"
          size="lg"
        >
          ← Back to Templates
        </Button>
      )}
    </div>
  );
}
