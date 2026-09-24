"use client";

import React from "react";
import Image from "next/image";
import { TrendingUp, Building2, HeartHandshake, Rocket } from "lucide-react";
import { useSound } from "./SoundManager";
import { useHorizontalScroll } from "./HorizontalLayout";
import ScrambleText from "./ScrambleText";

export default function ImpactMetrics() {
  const { playHover } = useSound();
  const { scrollProgress } = useHorizontalScroll();

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

  return (
    <section id="impact" className="relative w-screen max-w-screen h-screen shrink-0 bg-[#050505] text-white border-r border-white/[0.06] overflow-y-auto sm:overflow-hidden flex flex-col justify-center px-6 sm:px-12 py-8 selection:bg-[#9df133] selection:text-black">
      {/* 6-Column Vertical Guidelines */}
      <div className="shared-grid-lines">
        <div className="shared-v-line" />
        <div className="shared-v-line" />
        <div className="shared-v-line" />
        <div className="shared-v-line" />
        <div className="shared-v-line" />
        <div className="shared-v-line" />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 my-auto py-2">
        {/* Header - No gradients, solid neon green #9df133 */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 sm:mb-6 gap-2 sm:gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2 py-0.5 mb-1.5 rounded cyber-notch-sm bg-[#9df133]/10 border border-[#9df133]/30 text-[#9df133] font-mono text-[11px] tracking-wider">
              <TrendingUp className="w-3 h-3" />
              <span>// 03 &middot; ENTERPRISE OUTCOMES &amp; TRACK RECORD</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Enterprise Outcomes <br />
              <span className="text-[#9df133]">
                3 Fortune 500s &middot; 2 NGOs &middot; 1 Startup
              </span>
            </h2>
          </div>
          <p className="font-mono text-[11px] sm:text-xs text-white/50 max-w-sm">
            High-leverage engineering across Fortune 500 enterprises, social-impact non-profits, and venture startups.
          </p>
        </div>

        {/* 3 Columns Layout: Fortune 500s, NGOs, Startup - Staggered Load One by One on Scroll */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-stretch">
          {/* Col 1: 3 Fortune 500s (5 cols) */}
          <div className="lg:col-span-5 space-y-2 sm:space-y-2.5">
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#9df133] uppercase tracking-wider font-semibold">
              <Building2 className="w-3 h-3" />
              <span>3 TOP 10 FORTUNE 500 ENTERPRISES</span>
            </div>

            {fortune500.map((f500) => {
              const isRevealed = scrollProgress >= f500.threshold || scrollProgress >= 0.74;
              return (
                <div
                  key={f500.name}
                  onMouseEnter={playHover}
                  style={{
                    transform: isRevealed ? "translate3d(0, 0, 0)" : "translate3d(0, 24px, 0)",
                    opacity: isRevealed ? 1 : 0,
                    transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease-out",
                  }}
                  className="p-2.5 sm:p-3 rounded-lg cyber-glass border border-white/10 hover:border-[#9df133]/50 hover:shadow-[0_0_20px_rgba(157,241,51,0.15)] transition-all flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="relative h-5 w-20 sm:w-24">
                      <Image
                        src={f500.logo}
                        alt={f500.name}
                        fill
                        className="object-contain object-left filter brightness-125"
                      />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-[#9df133]">
                      {f500.outcome}
                    </span>
                  </div>
                  <div className="text-xs font-mono font-bold text-white mb-0.5">
                    <ScrambleText text={f500.name} />
                  </div>
                  <p className="text-[10.5px] sm:text-[11px] text-white/60 leading-relaxed font-sans line-clamp-2">
                    {f500.details}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Col 2: 2 NGOs (4 cols) */}
          <div className="lg:col-span-4 space-y-2 sm:space-y-2.5 flex flex-col">
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#9df133] uppercase tracking-wider font-semibold">
              <HeartHandshake className="w-3 h-3" />
              <span>2 SOCIAL IMPACT NGOS</span>
            </div>

            <div className="flex-1 flex flex-col justify-between gap-2 sm:gap-2.5">
              {ngos.map((ngo) => {
                const isRevealed = scrollProgress >= ngo.threshold || scrollProgress >= 0.74;
                return (
                  <div
                    key={ngo.name}
                    onMouseEnter={playHover}
                    style={{
                      transform: isRevealed ? "translate3d(0, 0, 0)" : "translate3d(0, 24px, 0)",
                      opacity: isRevealed ? 1 : 0,
                      transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease-out",
                    }}
                    className="p-3 sm:p-3.5 rounded-lg cyber-glass border border-white/10 hover:border-[#9df133]/50 hover:shadow-[0_0_20px_rgba(157,241,51,0.15)] transition-all flex flex-col justify-between flex-1"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-mono text-xs sm:text-sm font-bold text-white">
                          <ScrambleText text={ngo.name} />
                        </span>
                        <span className="text-[8.5px] font-mono px-1.5 py-0.5 rounded bg-[#9df133]/10 text-[#9df133] border border-[#9df133]/30 font-bold">
                          {ngo.outcome}
                        </span>
                      </div>
                      <div className="text-[10.5px] font-mono text-[#9df133] mb-1 font-semibold">{ngo.cause}</div>
                      <p className="text-[11px] text-white/60 leading-relaxed font-sans line-clamp-3">
                        {ngo.details}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Col 3: 1 Startup (3 cols) */}
          <div className="lg:col-span-3 space-y-2 sm:space-y-2.5 flex flex-col">
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#9df133] uppercase tracking-wider font-semibold">
              <Rocket className="w-3 h-3" />
              <span>1 GLOBAL STARTUP</span>
            </div>

            {(() => {
              const isRevealed = scrollProgress >= startup.threshold || scrollProgress >= 0.74;
              return (
                <div
                  onMouseEnter={playHover}
                  style={{
                    transform: isRevealed ? "translate3d(0, 0, 0)" : "translate3d(0, 24px, 0)",
                    opacity: isRevealed ? 1 : 0,
                    transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease-out",
                  }}
                  className="p-3 sm:p-3.5 rounded-xl cyber-glass border border-[#9df133]/30 hover:border-[#9df133]/70 hover:shadow-[0_0_25px_rgba(157,241,51,0.2)] transition-all flex flex-col justify-between flex-1"
                >
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
                      <span className="text-[9.5px] font-mono font-bold text-[#9df133]">
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
                    className="text-center px-3 py-1.5 rounded curtis-notch bg-[#9df133] hover:bg-[#b4f000] text-[#0a0a0a] font-mono text-[10px] font-black transition-all mt-auto shadow-[0_0_15px_rgba(157,241,51,0.3)]"
                  >
                    VISIT KONNECT.KR &rarr;
                  </a>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </section>
  );
}
