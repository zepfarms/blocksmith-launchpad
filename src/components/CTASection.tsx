import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, Zap, TrendingUp, Shield } from "lucide-react";
export const CTASection = () => {
  const navigate = useNavigate();
  const stats = [{
    icon: Sparkles,
    label: "500+ Business Ideas",
    value: "Ready to Launch"
  }, {
    icon: Zap,
    label: "200+ Service Blocks",
    value: "At Your Service"
  }, {
    icon: TrendingUp,
    label: "48 Hours",
    value: "To Launch"
  }];
  return <section className="bg-gradient-to-b from-black to-gray-900 py-20 overflow-hidden max-w-full">
      <div className="container mx-auto px-4 max-w-full">
        <div className="max-w-5xl mx-auto w-full">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-16 px-2">
            {stats.map((stat, index) => {
            const Icon = stat.icon;
            return <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-300 hover-scale" style={{
              animationDelay: `${index * 100}ms`
            }}>
                  <div className="bg-primary/20 rounded-xl w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-sm text-gray-400 mb-1">{stat.label}</div>
                  <div className="text-lg font-semibold text-white">{stat.value}</div>
                </div>;
          })}
          </div>

          {/* Main CTA Card */}
          <div className="bg-white/5 border-2 border-white/20 rounded-3xl p-6 sm:p-10 md:p-12 text-center relative overflow-hidden max-w-full">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10 pointer-events-none" />
            
            <div className="relative z-10 max-w-full">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white break-words px-2">
                Ready to Turn Your Idea Into Reality?
              </h2>
              <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto break-words px-2">
                Join, and be one the first <span className="text-acari-green font-semibold">100 entrepreneurs</span> building real businesses with Acari.ai. Start for free, pay only when you're ready to launch.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full px-2">
                <button onClick={() => navigate("/start")} className="group w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-acari-green text-black rounded-full font-medium text-base sm:text-lg hover:bg-acari-green/90 transition-all duration-200 shadow-lg inline-flex items-center justify-center gap-2 hover-scale">
                  Start Building Free
                  <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                </button>

                <button onClick={() => navigate("/start/browse")} className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 border-2 border-white/20 text-white rounded-full font-medium text-base sm:text-lg hover:bg-white/5 transition-all duration-200 inline-flex items-center justify-center gap-2">
                  Browse Business Ideas
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-2 text-xs sm:text-sm text-gray-400 mt-6 px-2">
                <Shield className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-center break-words">No credit card required • Build first, pay when ready to launch</span>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 text-center max-w-full px-2">
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 md:gap-8 text-gray-400 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Real human help available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>You own everything we create</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>Launch in 48 hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};