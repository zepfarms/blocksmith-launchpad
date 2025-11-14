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
    <div className="h-full flex flex-col bg-background">
      {/* Mobile Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
        <img src="/acari-logo.png" alt="Acari" className="h-5" />
        <button className="text-[0.6rem] text-foreground px-2 py-1 rounded-full border border-white/20">
          Sign In
        </button>
      </div>

      {/* Hero Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 space-y-4">
        <div className="text-center space-y-2">
          <h1 className="text-lg sm:text-xl font-black tracking-tight leading-tight">
            Turn Ideas Into<br />Companies — With AI
          </h1>
          <p className="text-[0.6rem] sm:text-xs text-muted-foreground">
            The AI Partner That Outworks Everyone
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="px-4 pb-4 space-y-2">
        <button
          disabled
          className={`relative w-full px-4 py-2.5 bg-acari-green text-background rounded-full font-semibold text-[0.7rem] sm:text-xs transition-transform duration-150 ${
            isClicked 
              ? "scale-95 opacity-90" 
              : pulse 
                ? "scale-[1.02]" 
                : "scale-100"
          }`}
        >
          {isClicked && (
            <span className="absolute inset-0 rounded-full bg-background/20 animate-[ping_0.3s_ease-out]" />
          )}
          Start Building →
        </button>
        <button className="w-full px-4 py-2.5 border border-white/20 text-foreground rounded-full font-medium text-[0.7rem] sm:text-xs">
          Sign In →
        </button>
      </div>
    </div>
  );
}

function Step1Slide({ pulse, isClicked }: { pulse: boolean; isClicked: boolean }) {
  return (
    <div className="h-full flex flex-col bg-background">
      {/* Breadcrumb */}
      <div className="px-4 pt-3 pb-1.5">
        <p className="text-[0.5rem] sm:text-[0.55rem] text-muted-foreground">Home &gt; Get Started</p>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 space-y-4">
        <div className="text-center space-y-2">
          <h2 className="text-lg sm:text-xl font-black tracking-tight leading-tight">
            Ready to start or build<br />your business?
          </h2>
          <p className="text-[0.65rem] sm:text-xs text-muted-foreground">
            Tell us a little bit about your idea
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="px-4 pb-4 space-y-2">
        <button
          disabled
          className={`relative w-full px-4 py-2.5 bg-acari-green text-background rounded-full font-semibold text-[0.7rem] sm:text-xs transition-transform duration-150 ${
            isClicked 
              ? "scale-95 opacity-90" 
              : pulse 
                ? "scale-[1.02]" 
                : "scale-100"
          }`}
        >
          {isClicked && (
            <span className="absolute inset-0 rounded-full bg-background/20 animate-[ping_0.3s_ease-out]" />
          )}
          Yes, I have an idea →
        </button>
        <button className="w-full px-4 py-2.5 border border-white/20 text-foreground rounded-full font-medium text-[0.7rem] sm:text-xs">
          No, show me ideas →
        </button>
      </div>
    </div>
  );
}

function Step2Slide({ pulse, isClicked }: { pulse: boolean; isClicked: boolean }) {
  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header with Back and Breadcrumb */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10">
        <button className="text-[0.6rem] sm:text-xs text-foreground">← Back</button>
        <p className="text-[0.5rem] sm:text-[0.55rem] text-muted-foreground">Home &gt; Describe Idea</p>
      </div>

      {/* Content */}
      <div className="flex-1 px-4 pt-4 space-y-3 overflow-y-auto">
        <div className="space-y-1.5">
          <h2 className="text-base sm:text-lg font-black tracking-tight">
            Tell us about your idea
          </h2>
        </div>

        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-[0.6rem] sm:text-xs text-muted-foreground">Business Name</label>
            <input 
              type="text"
              value="Green Thumb Lawn Care"
              disabled
              className="w-full px-2.5 py-2 bg-card border border-border rounded-lg text-[0.65rem] sm:text-xs text-foreground"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[0.6rem] sm:text-xs text-muted-foreground">Description</label>
            <textarea 
              value="I want to start a lawn care business that provides eco-friendly lawn maintenance services"
              disabled
              rows={3}
              className="w-full px-2.5 py-2 bg-card border border-border rounded-lg text-[0.65rem] sm:text-xs text-foreground resize-none"
            />
          </div>
        </div>
      </div>

      {/* Button */}
      <div className="px-4 pb-4">
        <button
          disabled
          className={`relative w-full px-4 py-2.5 bg-acari-green text-background rounded-full font-semibold text-[0.7rem] sm:text-xs transition-transform duration-150 ${
            isClicked 
              ? "scale-95 opacity-90" 
              : pulse 
                ? "scale-[1.02]" 
                : "scale-100"
          }`}
        >
          {isClicked && (
            <span className="absolute inset-0 rounded-full bg-background/20 animate-[ping_0.3s_ease-out]" />
          )}
          Continue →
        </button>
      </div>
    </div>
  );
}

function Step3Slide({ pulse, isClicked, items }: { pulse: boolean; isClicked: boolean; items: string[] }) {
  return (
    <div className="h-full flex flex-col bg-background">
      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 space-y-6">
        <div className="text-center space-y-1.5">
          <h2 className="text-lg sm:text-xl font-black tracking-tight">
            We're building your business
          </h2>
          <p className="text-[0.6rem] sm:text-xs text-muted-foreground">
            This will just take a moment...
          </p>
        </div>

        <div className="w-full space-y-1.5">
          {[
            "Creating brand identity",
            "Generating business plan",
            "Setting up website",
            "Configuring tools"
          ].map((item, i) => (
            <div 
              key={i}
              className="flex items-center space-x-2 p-2 bg-card/50 border border-border/50 rounded-lg"
              style={{ animation: `scale-in 0.4s ease-out ${i * 0.15}s both` }}
            >
              <div className="w-1.5 h-1.5 bg-acari-green rounded-full animate-pulse" />
              <span className="text-[0.6rem] sm:text-xs text-foreground">{item}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Button */}
      <div className="px-4 pb-4">
        <button
          disabled
          className="w-full px-4 py-2.5 bg-muted text-muted-foreground rounded-full font-medium cursor-not-allowed opacity-60 text-[0.7rem] sm:text-xs"
        >
          Building...
        </button>
      </div>
    </div>
  );
}

function Step4Slide({ pulse, isClicked }: { pulse: boolean; isClicked: boolean }) {
  return (
    <div className="h-full flex flex-col bg-background">
      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 space-y-6">
        <div className="text-center space-y-2">
          <div className="text-3xl mb-1.5">🎉</div>
          <h2 className="text-lg sm:text-xl font-black tracking-tight">
            Your business is ready!
          </h2>
          <p className="text-[0.65rem] sm:text-xs text-muted-foreground">
            Everything you need to start making sales
          </p>
        </div>

        <div className="w-full space-y-2">
          {[
            { icon: "✓", label: "Brand", desc: "Logo & colors" },
            { icon: "✓", label: "Website", desc: "Live & bookable" },
            { icon: "✓", label: "Legal", desc: "LLC & contracts" },
            { icon: "✓", label: "Payments", desc: "Ready to invoice" },
          ].map((item, i) => (
            <div 
              key={i}
              className="flex items-center space-x-3 p-2.5 bg-card border border-acari-green/20 rounded-xl"
              style={{ animation: `scale-in 0.4s ease-out ${i * 0.1}s both` }}
            >
              <div className="flex-shrink-0 w-6 h-6 bg-acari-green/20 text-acari-green rounded-full flex items-center justify-center text-[0.65rem] sm:text-xs font-bold">
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[0.65rem] sm:text-xs font-bold text-foreground">{item.label}</p>
                <p className="text-[0.6rem] sm:text-[0.65rem] text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Button */}
      <div className="px-4 pb-4">
        <button
          disabled
          className={`relative w-full px-4 py-2.5 bg-acari-green text-background rounded-full font-semibold text-[0.7rem] sm:text-xs transition-transform duration-150 ${
            isClicked 
              ? "scale-95 opacity-90" 
              : pulse 
                ? "scale-[1.02]" 
                : "scale-100"
          }`}
        >
          {isClicked && (
            <span className="absolute inset-0 rounded-full bg-background/20 animate-[ping_0.3s_ease-out]" />
          )}
          View Dashboard →
        </button>
      </div>
    </div>
  );
}
