import { Store, Dog, Shirt, Palette, ArrowRight } from "lucide-react";

export const ExampleIdeasSection = () => {
  const examples = [
    {
      icon: Store,
      title: "Create a store for my brand with merch and digital products",
      items: [
        "We build your Shopify/Webflow store",
        "Auto-created merch mockups",
        "Launch designs & logo",
        "Domain ideas + profile handles",
        "Email & text marketing flows",
        "Social launch content",
        "Your shop goes live"
      ]
    },
    {
      icon: Dog,
      title: "Start a dog-walking business",
      items: [
        "Brand name, logo, tagline",
        "Booking website & pricing",
        "Contract templates",
        "Google My Business setup guidance",
        "Yelp listing support",
        "Local flyer designs + social ads",
        "Growth missions to win customers"
      ]
    },
    {
      icon: Shirt,
      title: "Launch my own clothing line",
      items: [
        "Brand story + mission",
        "Designs + mockups",
        "Storefront + fulfillment partners",
        "Influencer outreach templates",
        "TikTok content plan",
        "Email sequences + SMS flows"
      ]
    },
    {
      icon: Palette,
      title: "Turn my art/music into a business",
      items: [
        "Fan site + merch",
        "Digital launch assets",
        "Email list + community",
        "Release strategy",
        "Sponsorship & monetization ideas",
        "Short-form content engine"
      ]
    }
  ];

  return (
    <section className="bg-black text-white py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl font-bold mb-4 text-center">
            Example Ideas We Can Launch
          </h2>
          <p className="text-xl text-gray-400 mb-16 text-center">
            Over 500 Business tasks and growing
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {examples.map((example, index) => {
              const Icon = example.icon;
              return (
                <div
                  key={index}
                  className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-all"
                >
                  <div className="bg-black border-2 border-white shadow-[0_0_20px_rgba(255,255,255,0.3)] rounded-2xl w-16 h-16 flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl font-semibold mb-6">
                    "{example.title}"
                  </h3>

                  <ul className="space-y-3">
                    {example.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3 text-gray-400">
                        <ArrowRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
