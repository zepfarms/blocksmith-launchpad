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
    <section className="bg-black text-white py-20 overflow-hidden max-w-full">
      <div className="container mx-auto px-4 max-w-full">
        <div className="max-w-6xl mx-auto w-full">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-center px-2 break-words">
            Example Ideas We Can Launch
          </h2>
          <p className="text-lg sm:text-xl text-gray-400 mb-16 text-center px-2 break-words">
            Over 500 Business tasks and growing
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 px-2">
            {examples.map((example, index) => {
              const Icon = example.icon;
              return (
                <div
                  key={index}
                  className="bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-8 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.3)] hover:border-neon-cyan/30 md:hover:scale-[1.02] cursor-pointer group max-w-full"
                >
                  <div className="bg-black border-2 border-white shadow-[0_0_20px_rgba(255,255,255,0.3)] rounded-2xl w-16 h-16 flex items-center justify-center mb-6 group-hover:shadow-[0_0_30px_rgba(34,211,238,0.5)] group-hover:border-neon-cyan transition-all duration-300 flex-shrink-0">
                    <Icon className="w-8 h-8 text-white group-hover:text-neon-cyan transition-colors duration-300" />
                  </div>
                  
                  <h3 className="text-lg sm:text-xl font-semibold mb-6 break-words">
                    "{example.title}"
                  </h3>

                  <ul className="space-y-3 min-w-0">
                    {example.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-3 text-gray-400 min-w-0">
                        <ArrowRight className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="break-words min-w-0 flex-1">{item}</span>
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
