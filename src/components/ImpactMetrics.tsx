"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import { TrendingUp, Building2, HeartHandshake, Rocket } from "lucide-react";
import { useSound } from "./SoundManager";
import { useHorizontalScroll } from "./HorizontalLayout";
import ScrambleText from "./ScrambleText";
import CurtisOdometer from "./CurtisOdometer";

const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Card entrance: a left-to-right aperture wipe with a rise, then a single
// neon beam sweeps across the freshly revealed card.
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 26, clipPath: "inset(0 100% 0 0)" },
  visible: {
    opacity: 1,
    y: 0,
    clipPath: "inset(0 0% 0 0)",
    transition: { duration: 0.75, ease: EXPO },
  },
};

const beamVariants: Variants = {
  hidden: { x: "-30%", opacity: 0 },
  visible: {
    x: "560%",
    opacity: [0, 0.9, 0],
    transition: { duration: 0.9, delay: 0.1, ease: "easeOut" },
  },
};

const lineVariants: Variants = {
  hidden: { scaleX: 0 },
  visible: { scaleX: 1, transition: { duration: 0.8, ease: EXPO } },
};

const hoverLift = { y: -4, transition: { duration: 0.2, ease: "easeOut" as const } };

// 0 -> 1 over `duration` ms once `active` flips true. Used to drive the header
// odometers on mobile, where there is no pinned scroll range to map from.
function useRamp(active: boolean, duration = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!active) return;
    let animId = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setValue(t);
      if (t < 1) animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [active, duration]);
  return value;
}

// Outcome values with a number ("$3,000,000 Saved") count up when the card
// lands; text-only outcomes scramble in instead.
function OutcomeValue({ value, active }: { value: string; active: boolean }) {
  const match = value.match(/^([^\d]*)([\d,]+)(.*)$/);
  const hasNumber = Boolean(match);
  const target = match ? parseInt(match[2].replace(/,/g, ""), 10) : 0;
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (!hasNumber || !active) return;
    let animId = 0;
    const start = performance.now();
    const duration = 1400;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(Math.round(target * eased));
      if (t < 1) animId = requestAnimationFrame(tick);
    };
    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [active, hasNumber, target]);

  if (!match) return <ScrambleText text={value} />;
  return (
    <span className="tabular-nums">
      {match[1]}
      {(active ? shown : target).toLocaleString("en-US")}
      {match[3]}
    </span>
  );
}

// Section label with a telemetry line that draws under it once its column starts revealing.
function ColumnHeader({
  icon: Icon,
  label,
  active,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#ffff00] uppercase tracking-wider font-semibold">
        <Icon className="w-3 h-3" />
        <span>{label}</span>
        <span
          className={`ml-auto w-1.5 h-1.5 rounded-full bg-[#ffff00] transition-opacity duration-500 ${
            active ? "opacity-100 animate-pulse" : "opacity-0"
          }`}
        />
      </div>
      <motion.div
        initial={false}
        animate={active ? "visible" : "hidden"}
        variants={lineVariants}
        className="h-px w-full bg-gradient-to-r from-[#ffff00]/70 via-[#ffff00]/30 to-transparent origin-left"
      />
    </div>
  );
}

export default function ImpactMetrics() {
  const { playHover } = useSound();
  const { scrollProgress, isDesktop } = useHorizontalScroll();
  const [mobileRevealed, setMobileRevealed] = useState<boolean[]>(() => new Array(6).fill(false));
  const [mobileHeaderIn, setMobileHeaderIn] = useState(false);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDesktop) return;

    const onScroll = () => {
      const vh = window.innerHeight;
      if (headerRef.current && headerRef.current.getBoundingClientRect().top < vh * 0.9) {
        setMobileHeaderIn(true);
      }
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top < vh * 0.9) {
          setMobileRevealed((prev) => {
            if (prev[i]) return prev;
            const next = [...prev];
            next[i] = true;
            return next;
          });
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [isDesktop]);

  // Header odometers roll over the first slice of the pinned stage on desktop
  // (settled well before the cards start) and over ~1s once in view on mobile.
  const desktopHeaderProg = Math.min(1, Math.max(0, (scrollProgress - 0.635) / 0.04));
  const mobileHeaderProg = useRamp(mobileHeaderIn);
  const headerProg = isDesktop ? desktopHeaderProg : mobileHeaderProg;

  // The drifting scan line only runs while this screen is on or near the viewport.
  const beamActive = isDesktop ? scrollProgress > 0.6 && scrollProgress < 0.82 : mobileHeaderIn;

  const fortune500 = [
    {
      name: "GE Aerospace",
      role: "Senior Software Engineer",
      outcome: "$3,000,000 Saved",
      details: "Architected ViewIT telemetry visualizer with Plotly.js & d3.js, replacing commercial Spotfire licenses across multiple divisions. Best Engineering Product Award.",
      logo: "/companies/ge_aerospace.svg",
      type: "Top 10 Fortune 500 Enterprise",
      threshold: 0.655,
    },
    {
      name: "Verizon",
      role: "Software Engineer",
      outcome: "High-Assurance Security",
      details: "Delivered Universal Identity Services (UIS) healthcare credentialing platform with cryptographic hash encryption, vulnerability scans, and CI/CD.",
      logo: "/companies/verizon.svg",
      type: "Top 10 Fortune 500 Enterprise",
      threshold: 0.670,
    },
    {
      name: "[24]7.ai / Google & Meta Partner",
      role: "SDE III",
      outcome: "Automated Ad Tech & Runtimes",
      details: "Engineered Target Selfserve ad delivery engine publishing dynamically to DV360, Meta, TikTok, and Snapchat via weather & audience segment triggers.",
      logo: "/companies/247ai.svg",
      type: "Enterprise Conversational AI & Ad-Tech",
      threshold: 0.685,
    },
  ];

  const ngos = [
    {
      name: "Treks For All",
      cause: "Inclusive Adaptive Travel",
      outcome: "Zero-Barrier Expeditions",
      details: "Accessible tourism platform for persons with disabilities, enabling wheelchair-accessible Himalayan treks, adaptive river expeditions, and camps.",
      threshold: 0.700,
    },
    {
      name: "Metores Trust & v-shesh",
      cause: "Disability Inclusion",
      outcome: "Partnered Accessibility",
      details: "Inclusive leadership initiatives, adaptive adventure training, and structured employment pathways for persons with disabilities.",
      threshold: 0.715,
    },
  ];

  const startup = {
    name: "Konnect (Seoul, Remote)",
    type: "AI-Powered Korea Living Platform",
    outcome: "Solo Build at Team Speed",
    details: "Built the cross-platform mobile app solo in React Native/Expo and architected a 4-service FastAPI microservices backend over Kafka, PostgreSQL/pgvector, and bilingual RAG (34 intents).",
    url: "https://konnect.kr",
    threshold: 0.730,
  };

  const revealedAt = (threshold: number, idx: number) =>
    isDesktop ? scrollProgress >= threshold || scrollProgress >= 0.74 : mobileRevealed[idx];

  const f500Revealed = fortune500.map((f, i) => revealedAt(f.threshold, i));
  const ngoRevealed = ngos.map((n, i) => revealedAt(n.threshold, 3 + i));
  const startupRevealed = revealedAt(startup.threshold, 5);

  return (
    <section id="impact" className="relative w-full lg:w-screen max-w-screen h-auto min-h-screen lg:h-screen shrink-0 bg-[#050505] text-white border-t lg:border-t-0 lg:border-r border-white/[0.06] overflow-visible lg:overflow-hidden flex flex-col justify-center px-4 sm:px-8 lg:px-12 py-16 lg:py-8 selection:bg-[#ffff00] selection:text-black">
      {/* 6-Column Vertical Guidelines */}
      <div className="shared-grid-lines">
        <div className="shared-v-line" />
        <div className="shared-v-line" />
        <div className="shared-v-line" />
        <div className="shared-v-line" />
        <div className="shared-v-line" />
        <div className="shared-v-line" />
      </div>

      {/* Drifting telemetry scan line */}
      {beamActive && (
        <div
          aria-hidden
          className="beam-y pointer-events-none absolute inset-x-0 top-0 h-px bg-[#ffff00]/25 shadow-[0_0_10px_rgba(255,255,0,0.6)] z-0"
        />
      )}

      <div className="max-w-7xl mx-auto w-full relative z-10 my-auto py-2">
        {/* Header - No gradients, solid neon yellow #ffff00 */}
        <div ref={headerRef} className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 sm:mb-6 gap-2 sm:gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2 py-0.5 mb-1.5 rounded cyber-notch-sm bg-[#ffff00]/10 border border-[#ffff00]/30 text-[#ffff00] font-mono text-[11px] tracking-wider">
              <TrendingUp className="w-3 h-3" />
              <span>// 03 &middot; ENTERPRISE OUTCOMES &amp; TRACK RECORD</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Enterprise Outcomes <br />
              <span className="text-[#ffff00] inline-flex flex-wrap items-baseline gap-x-2">
                <span className="inline-flex items-baseline gap-x-1.5">
                  <CurtisOdometer value="3" progress={headerProg} />
                  <span>Fortune 500s</span>
                </span>
                <span className="text-white/30">&middot;</span>
                <span className="inline-flex items-baseline gap-x-1.5">
                  <CurtisOdometer value="2" progress={headerProg} />
                  <span>NGOs</span>
                </span>
                <span className="text-white/30">&middot;</span>
                <span className="inline-flex items-baseline gap-x-1.5">
                  <CurtisOdometer value="1" progress={headerProg} />
                  <span>Startup</span>
                </span>
              </span>
            </h2>
          </div>
          <p className="font-mono text-[11px] sm:text-xs text-white/50 max-w-sm">
            High-leverage engineering across Fortune 500 enterprises, social-impact non-profits, and venture startups.
          </p>
        </div>

        {/* 3 Columns Layout: Fortune 500s, NGOs, Startup */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-stretch">
          {/* Col 1: 3 Fortune 500s (5 cols) */}
          <div className="lg:col-span-5 space-y-2 sm:space-y-2.5">
            <ColumnHeader icon={Building2} label="3 TOP 10 FORTUNE 500 ENTERPRISES" active={f500Revealed[0]} />

            {fortune500.map((f500, idx) => {
              const isRevealed = f500Revealed[idx];
              return (
                <motion.div
                  key={f500.name}
                  ref={(el: HTMLDivElement | null) => {
                    cardRefs.current[idx] = el;
                  }}
                  initial={false}
                  animate={isRevealed ? "visible" : "hidden"}
                  variants={cardVariants}
                  whileHover={hoverLift}
                  onMouseEnter={playHover}
                  className="relative overflow-hidden p-2.5 sm:p-3 rounded-lg cyber-glass border border-white/10 hover:border-[#ffff00]/50 hover:shadow-[0_0_20px_rgba(255,255,0,0.15)] transition-[border-color,box-shadow] duration-300 flex flex-col justify-between"
                >
                  <motion.span
                    aria-hidden
                    variants={beamVariants}
                    className="pointer-events-none absolute inset-y-0 left-0 w-1/5 bg-gradient-to-r from-transparent via-[#ffff00]/25 to-transparent"
                  />
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="relative h-5 w-20 sm:w-24">
                      <Image
                        src={f500.logo}
                        alt={f500.name}
                        fill
                        className="object-contain object-left filter brightness-125"
                      />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[#ffff00]">
                      <OutcomeValue value={f500.outcome} active={isRevealed} />
                    </span>
                  </div>
                  <div className="text-xs font-mono font-bold text-white mb-0.5">
                    <ScrambleText text={f500.name} />
                  </div>
                  <p className="text-[10.5px] sm:text-[11px] text-white/60 leading-relaxed font-sans line-clamp-2">
                    {f500.details}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Col 2: 2 NGOs (4 cols) */}
          <div className="lg:col-span-4 space-y-2 sm:space-y-2.5 flex flex-col">
            <ColumnHeader icon={HeartHandshake} label="2 SOCIAL IMPACT NGOS" active={ngoRevealed[0]} />

            <div className="flex-1 flex flex-col justify-between gap-2 sm:gap-2.5">
              {ngos.map((ngo, idx) => {
                const cardIdx = 3 + idx;
                const isRevealed = ngoRevealed[idx];
                return (
                  <motion.div
                    key={ngo.name}
                    ref={(el: HTMLDivElement | null) => {
                      cardRefs.current[cardIdx] = el;
                    }}
                    initial={false}
                    animate={isRevealed ? "visible" : "hidden"}
                    variants={cardVariants}
                    whileHover={hoverLift}
                    onMouseEnter={playHover}
                    className="relative overflow-hidden p-3 sm:p-3.5 rounded-lg cyber-glass border border-white/10 hover:border-[#ffff00]/50 hover:shadow-[0_0_20px_rgba(255,255,0,0.15)] transition-[border-color,box-shadow] duration-300 flex flex-col justify-between flex-1"
                  >
                    <motion.span
                      aria-hidden
                      variants={beamVariants}
                      className="pointer-events-none absolute inset-y-0 left-0 w-1/5 bg-gradient-to-r from-transparent via-[#ffff00]/25 to-transparent"
                    />
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-xs sm:text-sm font-bold text-white">
                          <ScrambleText text={ngo.name} />
                        </span>
                        <span className="text-[8.5px] font-mono px-1.5 py-0.5 rounded bg-[#ffff00]/10 text-[#ffff00] border border-[#ffff00]/30 font-bold">
                          {ngo.outcome}
                        </span>
                      </div>
                      <div className="text-[10.5px] font-mono text-[#ffff00] mb-1 font-semibold">{ngo.cause}</div>
                      <p className="text-[11px] text-white/60 leading-relaxed font-sans line-clamp-3">
                        {ngo.details}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Col 3: 1 Startup (3 cols) */}
          <div className="lg:col-span-3 space-y-2 sm:space-y-2.5 flex flex-col">
            <ColumnHeader icon={Rocket} label="1 GLOBAL STARTUP" active={startupRevealed} />

            <motion.div
              ref={(el: HTMLDivElement | null) => {
                cardRefs.current[5] = el;
              }}
              initial={false}
              animate={startupRevealed ? "visible" : "hidden"}
              variants={cardVariants}
              whileHover={hoverLift}
              onMouseEnter={playHover}
              className="relative overflow-hidden p-3 sm:p-3.5 rounded-xl cyber-glass border border-[#ffff00]/30 hover:border-[#ffff00]/70 hover:shadow-[0_0_25px_rgba(255,255,0,0.2)] transition-[border-color,box-shadow] duration-300 flex flex-col justify-between flex-1"
            >
              <motion.span
                aria-hidden
                variants={beamVariants}
                className="pointer-events-none absolute inset-y-0 left-0 w-1/5 bg-gradient-to-r from-transparent via-[#ffff00]/25 to-transparent"
              />
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="relative h-6 w-20 sm:w-24 px-2 py-0.5 rounded bg-white border border-white flex items-center justify-center shadow-sm">
                    <Image
                      src="/projects/konnect_logo.png"
                      alt="Konnect"
                      fill
                      className="object-contain p-0.5"
                    />
                  </div>
                  <span className="text-[9.5px] font-mono font-bold text-[#ffff00]">
                    {startup.outcome}
                  </span>
                </div>
                <div className="font-mono text-xs sm:text-sm font-bold text-white mb-1">
                  <ScrambleText text={startup.name} />
                </div>
                <p className="text-[10.5px] sm:text-[11px] text-white/65 leading-relaxed font-sans mb-3 line-clamp-4">
                  {startup.details}
                </p>
              </div>

              <a
                href={startup.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-center px-3 py-1.5 rounded curtis-notch bg-[#ffff00] hover:bg-[#ffff66] text-[#0a0a0a] font-mono text-[10px] font-black transition-all mt-auto shadow-[0_0_15px_rgba(255,255,0,0.3)]"
              >
                VISIT KONNECT.KR &rarr;
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
