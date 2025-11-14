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

  const currentSlide = slides[index];

  useEffect(() => {
    setPulse(false);

    const pulseTimer = setTimeout(() => {
      setPulse(true);
    }, SLIDE_DURATION - PULSE_LEAD);

    const slideTimer = setTimeout(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, SLIDE_DURATION);

    return () => {
      clearTimeout(pulseTimer);
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
          <IPhoneMockup currentSlide={currentSlide} pulse={pulse} />
        </div>

        {/* Laptop Mockup - Desktop */}
        <div className="hidden lg:flex justify-center">
          <LaptopMockup currentSlide={currentSlide} pulse={pulse} />
        </div>
      </div>
    </section>
  );
}

function IPhoneMockup({ currentSlide, pulse }: { currentSlide: SlideId; pulse: boolean }) {
  return (
    <div className="w-full max-w-sm">
      {/* iPhone shell */}
      <div className="relative mx-auto rounded-[2.5rem] border-[8px] border-card bg-gradient-to-b from-card/60 via-background/40 to-card/60 shadow-premium">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 h-6 w-32 rounded-b-2xl bg-card border-x-[8px] border-b-[8px] border-card" />
        
        {/* Side buttons (subtle) */}
        <div className="absolute -left-[9px] top-16 h-8 w-1 rounded-l-sm bg-card/80" />
        <div className="absolute -left-[9px] top-28 h-12 w-1 rounded-l-sm bg-card/80" />
        <div className="absolute -right-[9px] top-20 h-16 w-1 rounded-r-sm bg-card/80" />

        {/* Screen */}
        <div className="relative h-[550px] sm:h-[600px] rounded-[1.75rem] border border-border/50 bg-gradient-to-b from-card/90 via-background to-background overflow-hidden">
          <div className="absolute inset-0 pt-8 pb-4 px-3 text-xs sm:text-sm text-foreground">
            {/* Slide content */}
            {currentSlide === "home" && <HomeSlide pulse={pulse} />}
            {currentSlide === "step1" && <Step1Slide pulse={pulse} />}
            {currentSlide === "step2" && <Step2Slide pulse={pulse} />}
            {currentSlide === "step3" && (
              <Step3Slide pulse={pulse} items={generatingItems} />
            )}
            {currentSlide === "step4" && <Step4Slide pulse={pulse} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function LaptopMockup({ currentSlide, pulse }: { currentSlide: SlideId; pulse: boolean }) {
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
              {currentSlide === "home" && <HomeSlide pulse={pulse} />}
              {currentSlide === "step1" && <Step1Slide pulse={pulse} />}
              {currentSlide === "step2" && <Step2Slide pulse={pulse} />}
              {currentSlide === "step3" && (
                <Step3Slide pulse={pulse} items={generatingItems} />
              )}
              {currentSlide === "step4" && <Step4Slide pulse={pulse} />}
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

function HomeSlide({ pulse }: { pulse: boolean }) {
  return (
    <>
      <UrlBar />
      <div className="flex h-full flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <p className="text-[0.7rem] uppercase tracking-[0.24em] text-acari-green/90">
            Idea → Launch
          </p>
          <h3 className="mt-1 text-base sm:text-lg font-semibold text-foreground">
            Launch your business in hours, not months.
          </h3>
          <p className="mt-2 max-w-md text-xs sm:text-sm text-muted-foreground">
            Acari uses AI to handle the busy work of building a company — from
            branding to legal to payments — so you can focus on the work that
            matters.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              className={`rounded-full bg-acari-green px-4 py-1.5 text-xs sm:text-sm font-medium text-background shadow-neon ${
                pulse ? "cta-pulse" : ""
              }`}
            >
              Get started
            </button>
          </div>
        </div>
        <div className="flex-1">
          <div className="rounded-xl border border-border bg-card/80 p-3 text-xs sm:text-[0.78rem] text-foreground">
            <p className="text-[0.65rem] uppercase tracking-[0.16em] text-muted-foreground">
              Snapshot of what Acari builds
            </p>
            <ul className="mt-2 list-disc pl-4 space-y-1">
              <li>Brand kit, website &amp; booking</li>
              <li>LLC, EIN &amp; starter contracts</li>
              <li>Payments, invoicing &amp; CRM</li>
              <li>Launch checklist &amp; next steps</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

function Step1Slide({ pulse }: { pulse: boolean }) {
  return (
    <div className="flex h-full flex-col">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-acari-green/60 bg-card/70 px-2.5 py-1 text-[0.68rem] uppercase tracking-[0.16em] text-acari-green">
        <span className="h-2 w-2 rounded-full bg-acari-green shadow-acari-glow" />
        Step 1
      </span>
      <h3 className="mt-2 text-base sm:text-lg font-semibold text-foreground">
        Do you already have a business idea?
      </h3>
      <p className="mt-2 max-w-md text-xs sm:text-sm text-muted-foreground">
        You can start from scratch, or tell Acari the business you've been
        dreaming about.
      </p>
      <div className="mt-3 sm:mt-4 flex flex-wrap gap-2 sm:gap-3">
        <div className="rounded-xl border border-acari-green/80 bg-acari-green/10 px-3 py-2 text-xs sm:text-sm text-acari-green shadow-acari-glow-subtle">
          Yes, I have an idea
        </div>
        <div className="rounded-xl border border-border bg-card/80 px-3 py-2 text-xs sm:text-sm text-foreground">
          No, help me find one
        </div>
      </div>
      <button
        className={`mt-3 sm:mt-4 inline-flex items-center rounded-full border border-border bg-card/80 px-4 py-1.5 text-xs sm:text-sm text-foreground ${
          pulse ? "cta-pulse" : ""
        }`}
      >
        Continue
      </button>
    </div>
  );
}

function Step2Slide({ pulse }: { pulse: boolean }) {
  return (
    <div className="flex h-full flex-col">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-acari-green/60 bg-card/70 px-2.5 py-1 text-[0.68rem] uppercase tracking-[0.16em] text-acari-green">
        <span className="h-2 w-2 rounded-full bg-acari-green shadow-acari-glow" />
        Step 2
      </span>
      <h3 className="mt-2 text-base sm:text-lg font-semibold text-foreground">
        Describe your idea in one sentence.
      </h3>
      <p className="mt-2 max-w-md text-xs sm:text-sm text-muted-foreground">
        Acari uses your idea to assemble everything your business needs behind
        the scenes.
      </p>

      <div className="mt-3 sm:mt-4 rounded-xl border border-border bg-card/80 p-3">
        <p className="text-[0.7rem] text-muted-foreground">Your idea</p>
        <div className="mt-1 flex min-h-[40px] items-center rounded-lg border border-border bg-background px-2 py-1 text-xs sm:text-sm">
          <span>I want to start a lawn care business.</span>
          <span className="typing-caret" />
        </div>
      </div>

      <div className="mt-2 sm:mt-3 flex items-center gap-2 text-[0.7rem] sm:text-xs text-muted-foreground">
        <span className="h-2 w-2 rounded-full bg-acari-green shadow-acari-glow" />
        <span>Acari is mapping your idea to everything it needs to launch.</span>
      </div>

      <button
        className={`mt-3 sm:mt-4 inline-flex items-center rounded-full border border-border bg-card/80 px-4 py-1.5 text-xs sm:text-sm text-foreground ${
          pulse ? "cta-pulse" : ""
        }`}
      >
        Continue
      </button>
    </div>
  );
}

function Step3Slide({
  pulse,
  items,
}: {
  pulse: boolean;
  items: string[];
}) {
  return (
    <div className="flex h-full flex-col">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-acari-green/60 bg-card/70 px-2.5 py-1 text-[0.68rem] uppercase tracking-[0.16em] text-acari-green">
        <span className="h-2 w-2 rounded-full bg-acari-green shadow-acari-glow" />
        Step 3
      </span>
      <h3 className="mt-2 text-base sm:text-lg font-semibold text-foreground">
        Generating your lawn care business.
      </h3>
      <p className="mt-2 max-w-md text-xs sm:text-sm text-muted-foreground">
        Acari is building your brand, website, legal docs, payments, and launch
        checklist.
      </p>

      <div className="mt-2 sm:mt-3 rounded-xl border border-border bg-card/80 p-2 sm:p-3">
        {items.map((label, idx) => (
          <div
            key={label}
            className={`flex items-center justify-between text-xs sm:text-[0.78rem] text-foreground ${
              idx < items.length - 1 ? 'mb-1 sm:mb-1.5' : ''
            }`}
          >
            <span>{label}</span>
            <span className="orbital">
              <span className="orbital-orbit">
                <span className="orbital-dot" />
              </span>
            </span>
          </div>
        ))}
      </div>

      <p className="mt-2 text-[0.7rem] sm:text-xs text-muted-foreground">
        This usually takes just a few moments.
      </p>

      <button
        className={`mt-2 sm:mt-3 inline-flex items-center rounded-full border border-border bg-card/80 px-4 py-1.5 text-xs sm:text-sm text-foreground ${
          pulse ? "cta-pulse" : ""
        }`}
      >
        Continue
      </button>
    </div>
  );
}

function Step4Slide({ pulse }: { pulse: boolean }) {
  return (
    <div className="flex h-full flex-col">
      <span className="inline-flex items-center gap-1.5 rounded-full border border-acari-green/60 bg-card/70 px-2.5 py-1 text-[0.68rem] uppercase tracking-[0.16em] text-acari-green">
        <span className="h-2 w-2 rounded-full bg-acari-green shadow-acari-glow" />
        Step 4
      </span>
      <h3 className="mt-2 text-base sm:text-lg font-semibold text-foreground">
        Congratulations — your lawn care business is live.
      </h3>
      <p className="mt-2 max-w-md text-xs sm:text-sm text-muted-foreground">
        You now have a launch-ready business with brand, website, systems, and
        paperwork set up for you by Acari.
      </p>

      <div className="mt-2 sm:mt-3 grid gap-2 sm:gap-3 grid-cols-1 sm:grid-cols-2">
        <div className="rounded-xl border border-border bg-card/80 p-2 sm:p-3 text-xs sm:text-[0.78rem]">
          <p className="mb-1 text-[0.7rem] text-muted-foreground">What's done</p>
          <ul className="list-disc space-y-0.5 sm:space-y-1 pl-4">
            <li>Brand kit &amp; logo</li>
            <li>Booking website</li>
            <li>Service contracts</li>
            <li>Payment links</li>
          </ul>
        </div>
        <div className="rounded-xl border border-border bg-card/80 p-2 sm:p-3 text-xs sm:text-[0.78rem]">
          <p className="mb-1 text-[0.7rem] text-muted-foreground">Next steps</p>
          <ul className="list-disc space-y-0.5 sm:space-y-1 pl-4">
            <li>Share your booking page</li>
            <li>Turn on marketing automations</li>
            <li>Track your first few customers</li>
          </ul>
        </div>
      </div>

      <div className="mt-3 sm:mt-4 inline-flex items-center gap-2 rounded-full border border-acari-green/80 bg-acari-green/15 px-3 py-1.5 text-xs sm:text-sm text-acari-green">
        <span className="h-2 w-2 rounded-full bg-acari-green shadow-acari-glow" />
        <span>Congrats! You just made your first sale.</span>
      </div>

      <button
        className={`mt-2 sm:mt-3 inline-flex items-center rounded-full border border-border bg-card/80 px-4 py-1.5 text-xs sm:text-sm text-foreground ${
          pulse ? "cta-pulse" : ""
        }`}
      >
        Create another business
      </button>
    </div>
  );
}
