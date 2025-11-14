import { motion } from "framer-motion";

const acariGreen = "#6EE7B7";

const rows = [
  "Logo, colors, and brand kit",
  "Website, booking, and payments",
  "LLC filing, EIN & contracts",
  "Business phone, email & numbers",
  "Social profiles & content system",
  "Grants, plan & pitch deck",
];

export default function AcariCapabilitiesSection() {
  return (
    <section className="w-full bg-transparent">
      <div className="max-w-5xl mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="grid gap-10 md:gap-12 lg:gap-14 md:grid-cols-[1.15fr,1.35fr] items-center">
          {/* LEFT: TEXT */}
          <div>
            <div
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium tracking-[0.18em] uppercase"
              style={{
                borderColor: `${acariGreen}55`,
                background: "rgba(0,0,0,0.6)",
                color: acariGreen,
              }}
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{
                  background: acariGreen,
                  boxShadow: `0 0 10px ${acariGreen}`,
                }}
              />
              AI Business Launch System
            </div>

            <h2 className="mt-3 text-2xl sm:text-[1.8rem] lg:text-[2rem] font-semibold text-white leading-tight">
              Things Acari can accomplish for you
            </h2>

            <p className="mt-3 text-sm sm:text-[0.95rem] leading-relaxed text-slate-400 max-w-md">
              Describe the business you want to launch — Acari assembles every piece for you:{" "}
              <span style={{ color: acariGreen }}>
                brand, website, systems, paperwork, and more
              </span>
              . One prompt in, an entire operation out.
            </p>

            <ul className="mt-4 space-y-2.5 text-sm text-slate-200">
              <li className="flex items-start gap-2">
                <span
                  className="mt-1 h-2 w-2 flex-shrink-0 rounded-full"
                  style={{ background: acariGreen, boxShadow: `0 0 8px ${acariGreen}` }}
                />
                <span>From logo to LLC to live website, built in one workflow.</span>
              </li>
              <li className="flex items-start gap-2">
                <span
                  className="mt-1 h-2 w-2 flex-shrink-0 rounded-full"
                  style={{ background: acariGreen, boxShadow: `0 0 8px ${acariGreen}` }}
                />
                <span>AI-crafted assets tailored to your industry, market, and offer.</span>
              </li>
              <li className="flex items-start gap-2">
                <span
                  className="mt-1 h-2 w-2 flex-shrink-0 rounded-full"
                  style={{ background: acariGreen, boxShadow: `0 0 8px ${acariGreen}` }}
                />
                <span>You stay in control — approve, tweak, and launch faster than ever.</span>
              </li>
            </ul>

            <p className="mt-4 text-[12px] text-slate-400">
              If you need it to start or grow a business,{" "}
              <span style={{ color: acariGreen }}>Acari can handle it for you.</span>
            </p>
          </div>

          {/* RIGHT: VISUAL */}
          <div className="relative h-[280px] sm:h-[300px] flex items-center justify-center">
            {/* 3D STACK */}
            <motion.div
              className="relative w-[280px] sm:w-[320px] h-[230px] sm:h-[250px]"
              initial={{ rotateX: 18, rotateY: -24 }}
              animate={{ rotateX: 22, rotateY: 18 }}
              transition={{
                duration: 16,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut",
              }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Back layer */}
              <div
                className="absolute inset-0 rounded-2xl border bg-black/70"
                style={{
                  transform: "translateZ(0px) translateY(22px)",
                  opacity: 0.35,
                  borderColor: `${acariGreen}55`,
                  boxShadow: `0 0 30px ${acariGreen}33`,
                }}
              />
              {/* Mid layer */}
              <div
                className="absolute inset-0 rounded-2xl border bg-black/70"
                style={{
                  transform: "translateZ(20px) translateY(10px)",
                  opacity: 0.7,
                  borderColor: `${acariGreen}77`,
                  boxShadow: `0 0 30px ${acariGreen}44`,
                }}
              />
              {/* Top layer */}
              <div
                className="absolute inset-0 flex flex-col rounded-2xl border bg-black/80"
                style={{
                  transform: "translateZ(40px) translateY(-4px)",
                  borderColor: `${acariGreen}aa`,
                  boxShadow: `0 0 30px ${acariGreen}55`,
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-2.5">
                  <div className="flex items-center gap-2 text-[11px] tracking-[0.15em] text-[${acariGreen}] uppercase">
                    <span
                      className="h-2 w-2 rounded-full"
                      style={{ background: acariGreen, boxShadow: `0 0 10px ${acariGreen}` }}
                    />
                    <span className="text-[11px] text-[${acariGreen}]">ACARI WORKSPACE</span>
                  </div>
                  <div
                    className="rounded-full border px-2.5 py-1 text-[10px] uppercase tracking-[0.12em] text-slate-100"
                    style={{ borderColor: `${acariGreen}66`, background: "rgba(0,0,0,0.7)" }}
                  >
                    AI AUTOPILOT
                  </div>
                </div>

                {/* Rows */}
                <div className="flex-1 px-4 py-2.5 space-y-1.5">
                  {rows.map((label, idx) => (
                    <div
                      key={label}
                      className="flex items-center justify-between gap-3 text-[11px] text-slate-100"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className="h-[9px] w-[9px] rounded-full flex-shrink-0"
                          style={{
                            background: acariGreen,
                            boxShadow: `0 0 9px ${acariGreen}`,
                          }}
                        />
                        <span className="opacity-90">{label}</span>
                      </div>
                      <div className="h-[3px] w-14 rounded-full bg-slate-800 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{
                            background: `linear-gradient(to right, #22d3ee, ${acariGreen})`,
                            transformOrigin: "left",
                          }}
                          animate={{ scaleX: [0.2, 0.95, 0.3] }}
                          transition={{
                            duration: 3.2,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: idx * 0.25,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </motion.div>

            {/* FLOATING TAGS */}
            <FloatingTag
              className="right-0 top-4"
              delay={0}
              label="Branded clothing & cards"
            />
            <FloatingTag
              className="right-6 bottom-6"
              delay={0.6}
              label="Business phone & voicemail"
            />
            <FloatingTag
              className="left-2 top-10"
              delay={0.3}
              label="Contracts & legal templates"
            />
            <FloatingTag
              className="left-8 bottom-8"
              delay={0.9}
              label="Automations & AI workflows"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

type FloatingTagProps = {
  className?: string;
  label: string;
  delay?: number;
};

function FloatingTag({ className = "", label, delay = 0 }: FloatingTagProps) {
  return (
    <motion.div
      className={`absolute rounded-full border px-3 py-1 text-[11px] text-[${acariGreen}] bg-black/80 backdrop-blur-sm shadow-xl whitespace-nowrap flex items-center gap-2 ${className}`}
      style={{ borderColor: `${acariGreen}55` }}
      animate={{ y: [0, -8, 0], opacity: [0.8, 1, 0.8] }}
      transition={{
        duration: 9,
        repeat: Infinity,
        ease: "easeInOut",
        delay,
      }}
    >
      <span
        className="h-[6px] w-[6px] rounded-full"
        style={{ background: acariGreen, boxShadow: `0 0 10px ${acariGreen}` }}
      />
      <span>{label}</span>
    </motion.div>
  );
}
