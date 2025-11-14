import { useEffect, useState } from "react";

const SLIDE_DURATION = 2600; // ms each slide is visible
const PULSE_LEAD = 700;      // ms before slide ends to pulse the button

const generatingItems = [
  "Brand & logo",
  "Website & booking",
  "LLC, EIN & contracts",
  "Payments & invoicing",
  "Launch checklist",
];

const slides = ["home", "step1", "step2", "step3", "step4"] as const;
type SlideId = (typeof slides)[number];

export function IdeaToLaunchFlow() {
  const [index, setIndex] = useState(0);
  const [pulse, setPulse] = useState(false);
  const [isButtonClicked, setIsButtonClicked] = useState(false);

  const currentSlide = slides[index];

  useEffect(() => {
    setPulse(false);
    setIsButtonClicked(false);

    // Show subtle pulse/ready state
    const pulseTimer = setTimeout(() => {
      setPulse(true);
    }, SLIDE_DURATION - 700);

    // Button press animation (300ms before transition)
    const clickStartTimer = setTimeout(() => {
      setIsButtonClicked(true);
    }, SLIDE_DURATION - 300);

    // Button release (150ms before transition)
    const clickEndTimer = setTimeout(() => {
      setIsButtonClicked(false);
    }, SLIDE_DURATION - 150);

    // Slide transition
    const slideTimer = setTimeout(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, SLIDE_DURATION);

    return () => {
      clearTimeout(pulseTimer);
      clearTimeout(clickStartTimer);
      clearTimeout(clickEndTimer);
      clearTimeout(slideTimer);
    };
  }, [index]);

  return (
    <section className="w-full bg-background py-16 px-4">
      <div className="mx-auto max-w-5xl">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-foreground">
            From idea to launch in one flow
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted-foreground">
            Watch how Acari turns a simple idea{" "}
            <span className="text-acari-green">
              "I want to start a lawn care business"
            </span>{" "}
            into a fully launched business.
          </p>
        </div>

        {/* iPhone Mockup - Mobile/Tablet */}
        <div className="flex justify-center lg:hidden">
          <IPhoneMockup currentSlide={currentSlide} pulse={pulse} isButtonClicked={isButtonClicked} />
        </div>

        {/* Laptop Mockup - Desktop */}
        <div className="hidden lg:flex justify-center">
          <LaptopMockup currentSlide={currentSlide} pulse={pulse} isButtonClicked={isButtonClicked} />
        </div>
      </div>
    </section>
  );
}

function IPhoneMockup({ currentSlide, pulse, isButtonClicked }: { currentSlide: SlideId; pulse: boolean; isButtonClicked: boolean }) {
  return (
    <div className="w-full max-w-[280px] sm:max-w-[320px]">
      {/* iPhone shell */}
      <div className="relative mx-auto rounded-[3rem] border-[6px] border-card bg-gradient-to-b from-card/60 via-background/40 to-card/60 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25),0_0_0_1px_rgba(255,255,255,0.1)] ring-1 ring-white/10">
        {/* Dynamic Island */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-10 h-[22px] w-[100px] rounded-full bg-black shadow-[inset_0_2px_8px_rgba(0,0,0,0.6)]" />
        
        {/* Camera lens */}
        <div className="absolute top-2.5 left-[45%] h-2 w-2 rounded-full bg-black/60 ring-1 ring-white/20 z-10" />
        
        {/* Left side buttons */}
        <div className="absolute -left-[7px] top-[80px] h-6 w-[2px] rounded-l-sm bg-gradient-to-r from-card via-white/20 to-card" />
        <div className="absolute -left-[7px] top-[100px] h-10 w-[2px] rounded-l-sm bg-gradient-to-r from-card via-white/20 to-card" />
        <div className="absolute -left-[7px] top-[140px] h-10 w-[2px] rounded-l-sm bg-gradient-to-r from-card via-white/20 to-card" />
        
        {/* Right side button (power) */}
        <div className="absolute -right-[7px] top-[120px] h-[50px] w-[2px] rounded-r-sm bg-gradient-to-r from-card via-white/20 to-card" />

        {/* Screen */}
        <div className="relative h-[550px] sm:h-[600px] rounded-[2.5rem] border-[3px] border-black/40 bg-gradient-to-b from-card/90 via-background to-background overflow-hidden">
          {/* Screen glare effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none" />
          
          <div className="absolute inset-0 pt-10 pb-4 px-2.5 text-[0.7rem] sm:text-xs text-foreground">
            {/* Slide content */}
            {currentSlide === "home" && <HomeSlide pulse={pulse} isClicked={isButtonClicked} />}
            {currentSlide === "step1" && <Step1Slide pulse={pulse} isClicked={isButtonClicked} />}
            {currentSlide === "step2" && <Step2Slide pulse={pulse} isClicked={isButtonClicked} />}
            {currentSlide === "step3" && (
              <Step3Slide pulse={pulse} isClicked={isButtonClicked} items={generatingItems} />
            )}
            {currentSlide === "step4" && <Step4Slide pulse={pulse} isClicked={isButtonClicked} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function LaptopMockup({ currentSlide, pulse, isButtonClicked }: { currentSlide: SlideId; pulse: boolean; isButtonClicked: boolean }) {
  return (
    <div className="w-full max-w-4xl">
      {/* Lid */}
      <div className="relative mx-auto rounded-2xl rounded-b-lg border border-glass-border bg-gradient-to-b from-card/50 via-background to-background shadow-premium">
        {/* Camera bar */}
        <div className="mt-1.5 mb-1.5 flex justify-center">
          <div className="h-1.5 w-16 rounded-full bg-background shadow-inner" />
        </div>

        {/* Screen frame */}
        <div className="mx-4 mb-4 rounded-xl border border-border bg-background overflow-hidden">
          <div className="relative h-[340px] lg:h-[380px] bg-gradient-to-b from-card/90 via-background to-background">
            <div className="absolute inset-0 p-4 sm:p-5 text-xs sm:text-sm text-foreground">
              {/* Slide content */}
              {currentSlide === "home" && <HomeSlide pulse={pulse} isClicked={isButtonClicked} />}
              {currentSlide === "step1" && <Step1Slide pulse={pulse} isClicked={isButtonClicked} />}
              {currentSlide === "step2" && <Step2Slide pulse={pulse} isClicked={isButtonClicked} />}
              {currentSlide === "step3" && (
                <Step3Slide pulse={pulse} isClicked={isButtonClicked} items={generatingItems} />
              )}
              {currentSlide === "step4" && <Step4Slide pulse={pulse} isClicked={isButtonClicked} />}
            </div>
          </div>
        </div>
      </div>

      {/* Base */}
      <div className="mx-auto mt-1 h-4 w-[88%] max-w-[860px] rounded-b-[999px] bg-gradient-to-b from-card/80 via-background to-background shadow-premium relative">
        <div className="absolute left-[14%] right-[14%] top-[2px] h-px bg-gradient-to-r from-transparent via-foreground/30 to-transparent" />
      </div>
    </div>
  );
}

function UrlBar() {
  return (
    <div className="mb-3 flex items-center gap-1.5 text-[0.68rem] text-muted-foreground">
      <div className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-red-500" />
        <span className="h-2 w-2 rounded-full bg-amber-400" />
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
      </div>
      <div className="ml-1 rounded-full border border-border bg-card/90 px-2 py-0.5">
        https://acari.ai
      </div>
    </div>
  );
}

function HomeSlide({ pulse, isClicked }: { pulse: boolean; isClicked: boolean }) {
  return (
    <div className="flex flex-col h-full justify-between">
      <div className="space-y-2 sm:space-y-3">
        <h3 className="text-sm sm:text-base font-semibold text-foreground">
          Welcome to Acari
        </h3>
        <p className="text-muted-foreground leading-snug text-[0.65rem] sm:text-xs">
          Tell us your business idea and we'll build everything you need to
          launch.
        </p>
      </div>
      <button
        className={`w-full py-2 rounded-lg bg-acari-green text-primary-foreground font-medium transition-all text-xs sm:text-sm ${
          pulse ? "animate-pulse scale-105" : ""
        }`}
      >
        Get Started
      </button>
    </div>
  );
}

function Step1Slide({ pulse, isClicked }: { pulse: boolean; isClicked: boolean }) {
  return (
    <div className="flex flex-col h-full justify-between">
      <div className="space-y-2 sm:space-y-3">
        <h3 className="text-sm sm:text-base font-semibold text-foreground">
          What's your idea?
        </h3>
        <div className="grid grid-cols-1 gap-2">
          <div className="p-2 rounded-lg border border-border bg-card hover:bg-card/80 cursor-pointer transition-colors">
            <div className="text-[0.65rem] sm:text-xs font-medium">💡 I have an idea</div>
          </div>
          <div className="p-2 rounded-lg border border-acari-green bg-acari-green/10 hover:bg-acari-green/20 cursor-pointer transition-colors">
            <div className="text-[0.65rem] sm:text-xs font-medium text-acari-green">
              🤔 Explore ideas
            </div>
          </div>
        </div>
      </div>
      <button
        className={`w-full py-2 rounded-lg bg-acari-green text-primary-foreground font-medium transition-all text-xs sm:text-sm ${
          pulse ? "animate-pulse scale-105" : ""
        }`}
      >
        Continue
      </button>
    </div>
  );
}

function Step2Slide({ pulse, isClicked }: { pulse: boolean; isClicked: boolean }) {
  return (
    <div className="flex flex-col h-full justify-between">
      <div className="space-y-2 sm:space-y-3">
        <h3 className="text-sm sm:text-base font-semibold text-foreground">
          Tell us about your idea
        </h3>
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Business name..."
            className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-acari-green text-[0.65rem] sm:text-xs"
            value="Green Thumb Lawn Care"
            readOnly
          />
          <textarea
            placeholder="Describe your vision..."
            className="w-full px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-acari-green resize-none text-[0.65rem] sm:text-xs"
            rows={3}
            value="I want to start a lawn care business"
            readOnly
          />
        </div>
      </div>
      <button
        className={`w-full py-2 rounded-lg bg-acari-green text-primary-foreground font-medium transition-all text-xs sm:text-sm ${
          pulse ? "animate-pulse scale-105" : ""
        }`}
      >
        Continue
      </button>
    </div>
  );
}

function Step3Slide({ pulse, isClicked, items }: { pulse: boolean; isClicked: boolean; items: string[] }) {
  return (
    <div className="flex flex-col h-full justify-between">
      <div className="space-y-2 sm:space-y-3">
        <h3 className="text-sm sm:text-base font-semibold text-foreground">
          We're building your business
        </h3>
        <div className="space-y-0.5 sm:space-y-1">
          {items.map((item, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-card border border-border"
            >
              <div className="flex-shrink-0 h-3 w-3 rounded-full border-2 border-acari-green flex items-center justify-center">
                <div className="h-1.5 w-1.5 rounded-full bg-acari-green animate-pulse" />
              </div>
              <span className="text-muted-foreground text-[0.6rem] sm:text-[0.65rem]">{item}</span>
            </div>
          ))}
        </div>
      </div>
      <button
        className={`w-full py-2 rounded-lg bg-muted text-muted-foreground font-medium cursor-not-allowed text-xs sm:text-sm ${
          pulse ? "animate-pulse scale-105" : ""
        }`}
        disabled
      >
        Building...
      </button>
    </div>
  );
}

function Step4Slide({ pulse, isClicked }: { pulse: boolean; isClicked: boolean }) {
  return (
    <div className="flex flex-col h-full justify-between">
      <div className="space-y-2 sm:space-y-3">
        <h3 className="text-sm sm:text-base font-semibold text-foreground">
          Your business is ready!
        </h3>
        <div className="grid grid-cols-1 gap-1.5">
          <div className="p-2 rounded-lg bg-card border border-border">
            <div className="text-[0.65rem] sm:text-xs font-medium text-acari-green mb-0.5">
              ✓ Brand
            </div>
            <div className="text-[0.6rem] sm:text-[0.65rem] text-muted-foreground">
              Logo & colors
            </div>
          </div>
          <div className="p-2 rounded-lg bg-card border border-border">
            <div className="text-[0.65rem] sm:text-xs font-medium text-acari-green mb-0.5">
              ✓ Website
            </div>
            <div className="text-[0.6rem] sm:text-[0.65rem] text-muted-foreground">
              Live & bookable
            </div>
          </div>
          <div className="p-2 rounded-lg bg-card border border-border">
            <div className="text-[0.65rem] sm:text-xs font-medium text-acari-green mb-0.5">
              ✓ Legal
            </div>
            <div className="text-[0.6rem] sm:text-[0.65rem] text-muted-foreground">
              LLC & contracts
            </div>
          </div>
          <div className="p-2 rounded-lg bg-card border border-border">
            <div className="text-[0.65rem] sm:text-xs font-medium text-acari-green mb-0.5">
              ✓ Payments
            </div>
            <div className="text-[0.6rem] sm:text-[0.65rem] text-muted-foreground">
              Ready to invoice
            </div>
          </div>
        </div>
      </div>
      <button
        className={`w-full py-2 rounded-lg bg-acari-green text-primary-foreground font-medium transition-all text-xs sm:text-sm ${
          pulse ? "animate-pulse scale-105" : ""
        }`}
      >
        View Dashboard
      </button>
    </div>
  );
}
