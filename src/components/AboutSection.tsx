"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  Award, 
  Mail, 
  Phone, 
  Copy, 
  Check, 
  Download, 
  ArrowLeft,
  Sparkles,
  Terminal,
  ExternalLink,
  ChevronUp
} from "lucide-react";
import { useSound } from "./SoundManager";
import { useHorizontalScroll } from "./HorizontalLayout";
import DotMatrixBanner from "./DotMatrixBanner";

export default function AboutSection() {
  const { playClick, playHover, playSuccess } = useSound();
  const { scrollProgress, scrollToProgress, isDesktop } = useHorizontalScroll();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [manualGarageOpen, setManualGarageOpen] = useState(false);

  const email = "chauhanshivang4@gmail.com";
  const phone = "+91 91767 88879";

  const handleCopyEmail = () => {
    playSuccess();
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyPhone = () => {
    playSuccess();
    navigator.clipboard.writeText(phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  // Garage Door Smooth Scroll Mechanic (Image 2)
  // When scroll reaches final pinned stage [0.860 -> 0.940], green card raises smoothly
  const scrollDoorProg = Math.min(1, Math.max(0, (scrollProgress - 0.86) / 0.08));
  const effectiveDoorProg = manualGarageOpen ? 1 : scrollDoorProg;
  // Smooth sine-ease transition
  const doorEase = effectiveDoorProg < 0.5
    ? 2 * effectiveDoorProg * effectiveDoorProg
    : 1 - Math.pow(-2 * effectiveDoorProg + 2, 2) / 2;
  const translateYPercent = (1 - doorEase) * 100;

  const handleGarageToggle = () => {
    playClick();
    if (isDesktop) {
      setManualGarageOpen(!manualGarageOpen);
    } else {
      const el = document.getElementById("garage-footer");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="about" className="relative w-full lg:w-screen max-w-screen h-auto min-h-screen lg:h-screen shrink-0 bg-[#050505] text-white overflow-visible lg:overflow-hidden flex flex-col justify-between selection:bg-[#9df133] selection:text-black pt-6 pb-0">
      {/* 6-Column Vertical Guidelines */}
      <div className="shared-grid-lines">
        <div className="shared-v-line" />
        <div className="shared-v-line" />
        <div className="shared-v-line" />
        <div className="shared-v-line" />
        <div className="shared-v-line" />
        <div className="shared-v-line" />
      </div>

      {/* Top Meta Bar matching Curtis Image 2 */}
      <div className="relative z-30 px-6 sm:px-12 pt-6 pb-2 flex items-center justify-between font-mono text-xs text-white/50 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#9df133] shadow-[0_0_8px_#9df133]" />
          <span className="font-bold text-white tracking-wider">SHIVANG CHAUHAN</span>
          <span className="text-white/40">// 04 LEAD ARCHITECT &amp; SDE III</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-[11px] text-white/40">
          <span>BANGALORE, IN &middot; 11:20 PM</span>
          <span>12&deg;58&prime;44.4&Prime; N 77&deg;35&prime;45.6&Prime; E</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleGarageToggle}
            onMouseEnter={playHover}
            className="px-2.5 py-1 rounded curtis-notch font-mono text-[10px] font-bold text-[#0a0a0a] bg-[#9df133] hover:bg-[#b4f000] transition-all flex items-center gap-1"
          >
            <ChevronUp className={`w-3 h-3 transition-transform ${effectiveDoorProg > 0.5 ? "rotate-180" : ""}`} />
            <span>{isDesktop ? (effectiveDoorProg > 0.5 ? "CLOSE FOOTER" : "GARAGE DOOR ↓") : "GO TO FOOTER ↓"}</span>
          </button>
        </div>
      </div>

      {/* Upper Context Quote visible above the raised garage door (Matching Image 2) */}
      <div className="relative z-20 px-6 sm:px-12 py-3 text-center max-w-4xl mx-auto">
        <p className="font-mono text-xs sm:text-sm text-white/70 leading-relaxed">
          &ldquo;Led product and distributed architectures across Fortune 500s (GE, Verizon) &amp; high-scale conversational AI platforms ([24]7.ai, Konnect). Architecting async FastAPI, Kafka pipelines &amp; agentic systems.&rdquo;
        </p>
      </div>

      {/* Base Deck: Tuxedo Portrait, Ethos, Contact Commands */}
      <div className="max-w-7xl mx-auto w-full relative z-10 px-6 sm:px-12 my-auto transition-opacity duration-300">
        {/* Header (No text gradients, solid neon green) */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 sm:mb-5 gap-3 sm:gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 mb-2 rounded cyber-notch-sm bg-[#9df133]/10 border border-[#9df133]/30 text-[#9df133] font-mono text-xs tracking-wider">
              <Terminal className="w-3.5 h-3.5" />
              <span>// 05 &middot; ABOUT THE DEVELOPER &amp; COMMAND DECK</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Ready To Scale? <br />
              <span className="text-[#9df133]">
                Initiate Transmission
              </span>
            </h2>
          </div>
          <p className="font-mono text-xs sm:text-sm text-white/50 max-w-sm">
            Scroll more or click &ldquo;GARAGE DOOR&rdquo; to open the executive contact deck.
          </p>
        </div>

        {/* 3-Column Command Deck */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (4 cols): Moody Prevalent Dark Tuxedo Portrait (Matching Image 1) */}
          <div className="lg:col-span-4 relative flex items-start justify-center -mt-2 sm:-mt-4 lg:-mt-6">
            <div
              className="relative w-full max-w-[380px] h-[48vh] sm:h-[54vh] xl:h-[58vh] select-none"
              style={{
                maskImage: "linear-gradient(to bottom, black 70%, rgba(0,0,0,0.4) 88%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to bottom, black 70%, rgba(0,0,0,0.4) 88%, transparent 100%)",
              }}
            >
              <Image
                src="/portrait_tuxedo_top.webp"
                alt="Shivang Chauhan - Executive Architect"
                fill
                className="object-contain object-top filter contrast-130 brightness-70"
                sizes="(max-width: 768px) 100vw, 380px"
                priority
              />

              {/* Deep Black Low-Key Wash (Blacker appearance matching user request) */}
              <div className="absolute inset-0 bg-[#050505]/50 pointer-events-none mix-blend-multiply" />
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "radial-gradient(ellipse at 50% 32%, transparent 15%, rgba(5,5,5,0.72) 58%, #050505 95%)",
                }}
              />
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(to bottom, rgba(5,5,5,0.45) 0%, transparent 20%, transparent 55%, rgba(5,5,5,0.92) 88%, #050505 100%)",
                }}
              />
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: "linear-gradient(to right, #050505 0%, transparent 15%, transparent 85%, #050505 100%)",
                }}
              />

              {/* Tightly Spaced Display Pixels (Ultra-dense 2.5px monochrome dots resembling raw screen pixels) */}
              <div
                className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay"
                style={{
                  backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.45) 0.5px, transparent 0.5px)",
                  backgroundSize: "2.5px 2.5px",
                }}
              />

              {/* Dense Horizontal Pixel Scanline Texture */}
              <div
                className="absolute inset-0 pointer-events-none opacity-35 mix-blend-multiply"
                style={{
                  backgroundImage: "repeating-linear-gradient(to bottom, rgba(0, 0, 0, 0.75) 0px, rgba(0, 0, 0, 0.75) 1px, transparent 1px, transparent 2px)",
                }}
              />
            </div>
          </div>

          {/* Center Column (4 cols): Philosophy, Recognition, Resume Download */}
          <div className="lg:col-span-4 space-y-3 flex flex-col justify-between">
            <div className="p-4 rounded-xl cyber-glass border border-white/10">
              <h3 className="font-mono text-xs text-[#9df133] uppercase tracking-wider mb-2 flex items-center gap-1.5 font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI-First Engineering Ethos</span>
              </h3>
              <p className="text-xs text-white/80 leading-relaxed font-sans mb-3">
                &ldquo;I work AI-first &mdash; pairing agentic tooling (Claude Code, Copilot) with sound architecture to ship production systems solo at team speed.&rdquo;
              </p>
              <div className="space-y-1.5 font-mono text-[10px] text-white/60">
                <div className="p-2 rounded bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-[#9df133] font-bold block mb-0.5">GE Best Product Award</span>
                  <span>ViewIT Visualizer ($3M Saved)</span>
                </div>
                <div className="p-2 rounded bg-white/[0.02] border border-white/[0.06]">
                  <span className="text-[#9df133] font-bold block mb-0.5">SRM University B.Tech</span>
                  <span>8.45 CGPA &middot; Computer Science</span>
                </div>
              </div>
            </div>

            {/* Quick Resume Download Action */}
            <div className="p-3.5 rounded-lg bg-white/[0.02] border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs font-mono font-bold text-white block">Shivang Chauhan CV</span>
                <span className="text-[10px] font-mono text-white/40">12+ YRS &middot; SDE III &middot; PDF (822 KB)</span>
              </div>
              <a
                href="/Shivang_CV.pdf"
                download="Shivang_Chauhan_CV.pdf"
                onClick={playClick}
                onMouseEnter={playHover}
                className="px-3.5 py-1.5 rounded curtis-notch font-mono text-xs font-bold text-black bg-[#9df133] hover:bg-[#b4f000] transition-all flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>DOWNLOAD</span>
              </a>
            </div>
          </div>

          {/* Right Column (4 cols): Direct Contact Command Center */}
          <div className="lg:col-span-4 space-y-3 flex flex-col justify-between">
            {/* Direct Email Card */}
            <div className="p-4 rounded-xl cyber-glass border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-[#9df133]/10 text-[#9df133]">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-white/40 block">DIRECT EMAIL</span>
                  <a
                    href={`mailto:${email}`}
                    className="text-xs font-mono text-white hover:text-[#9df133] transition-colors"
                  >
                    {email}
                  </a>
                </div>
              </div>
              <button
                onClick={handleCopyEmail}
                className="px-3 py-1.5 rounded curtis-notch font-mono text-[10px] bg-white/[0.05] hover:bg-[#9df133] hover:text-black border border-white/10 transition-all flex items-center gap-1 cursor-pointer"
              >
                {copiedEmail ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedEmail ? "COPIED" : "COPY"}</span>
              </button>
            </div>

            {/* Direct Phone / WhatsApp Card */}
            <div className="p-4 rounded-xl cyber-glass border border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded bg-[#9df133]/10 text-[#9df133]">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-white/40 block">PHONE / WHATSAPP</span>
                  <a
                    href={`tel:${phone.replace(/\s+/g, "")}`}
                    className="text-xs sm:text-sm font-mono text-white hover:text-[#9df133] transition-colors"
                  >
                    {phone}
                  </a>
                </div>
              </div>
              <button
                onClick={handleCopyPhone}
                className="px-3 py-1.5 rounded curtis-notch font-mono text-[10px] bg-white/[0.05] hover:bg-[#9df133] hover:text-black border border-white/10 transition-all flex items-center gap-1 cursor-pointer"
              >
                {copiedPhone ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedPhone ? "COPIED" : "COPY"}</span>
              </button>
            </div>

            {/* Jump back to Hero Button */}
            <div className="pt-2 flex items-center justify-between font-mono text-xs text-white/40">
              <button
                onClick={() => {
                  playClick();
                  if (isDesktop) {
                    scrollToProgress(0);
                  } else {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }
                }}
                onMouseEnter={playHover}
                className="flex items-center gap-2 hover:text-[#9df133] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>RETURN TO HERO [START]</span>
              </button>
              <span>&copy; 2026 SHIVANG CHAUHAN</span>
            </div>
          </div>
        </div>
      </div>

      {/* GARAGE DOOR GREEN CARD:
          - Desktop: Absolute 72vh card rising smoothly from bottom on scroll
          - Mobile/Tablet: Natural full-width in-flow footer */}
      <div
        id="garage-footer"
        className={
          isDesktop
            ? "absolute inset-x-0 bottom-0 z-40 bg-[#9df133] text-[#0a0a0a] shadow-[0_-24px_60px_rgba(0,0,0,0.85)] border-t border-[#0a0a0a]/20 flex flex-col justify-between overflow-hidden"
            : "relative w-full bg-[#9df133] text-[#0a0a0a] shadow-2xl border-t border-[#0a0a0a]/20 flex flex-col justify-between overflow-hidden mt-12"
        }
        style={{
          height: isDesktop ? "72vh" : "auto",
          transform: isDesktop ? `translate3d(0, ${translateYPercent}%, 0)` : "none",
          transition: isDesktop ? "transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)" : "none",
        }}
      >
        {/* Top Half of Green Card: CTA & Links */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 border-b border-[#0a0a0a]/15">
          {/* Left CTA: 7 cols */}
          <div className="lg:col-span-7 p-6 sm:p-8 md:p-10 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[#0a0a0a]/15">
            <div className="flex items-start gap-4 sm:gap-6">
              {/* Circular glyph matching Image 2 */}
              <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-full border-2 border-[#0a0a0a] flex items-center justify-center shrink-0 mt-1">
                <div className="w-3.5 h-3.5 rounded-full bg-[#0a0a0a]" />
              </div>
              <div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#0a0a0a] leading-[0.88]">
                  LET&apos;S BUILD <br />
                  GREAT PRODUCTS <br />
                  TOGETHER.
                </h2>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3 sm:gap-4 mt-6 sm:mt-8">
              <a
                href="mailto:chauhanshivang4@gmail.com"
                onClick={playClick}
                onMouseEnter={playHover}
                className="px-5 py-3 rounded curtis-notch font-mono text-xs font-black text-[#0a0a0a] border border-[#0a0a0a] bg-transparent hover:bg-[#0a0a0a] hover:text-[#9df133] transition-all tracking-wider uppercase flex items-center gap-2"
              >
                <span>SHOOT A MESSAGE</span>
              </a>
              <a
                href="/Shivang_CV.pdf"
                download="Shivang_Chauhan_CV.pdf"
                onClick={playClick}
                onMouseEnter={playHover}
                className="px-5 py-3 rounded curtis-notch font-mono text-xs font-black text-[#0a0a0a] border border-[#0a0a0a] bg-transparent hover:bg-[#0a0a0a] hover:text-[#9df133] transition-all tracking-wider uppercase flex items-center gap-2"
              >
                <span>DOWNLOAD CV &darr;</span>
              </a>
            </div>
          </div>

          {/* Right Direct Links: 5 cols (Strictly LinkedIn, GitHub, WhatsApp) */}
          <div className="lg:col-span-5 p-6 sm:p-8 md:p-10 flex flex-col justify-center font-mono text-xs">
            <span className="text-[#0a0a0a]/60 uppercase tracking-widest font-bold text-xs mb-4">
              // DIRECT CHANNELS
            </span>
            <div className="flex flex-col gap-3.5 text-sm">
              <a
                href="https://www.linkedin.com/in/shivang-chauhan/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#0a0a0a] hover:underline flex items-center justify-between py-1.5 border-b border-[#0a0a0a]/15 hover:border-[#0a0a0a]/40 transition-all group"
              >
                <span className="tracking-wider font-mono">LINKEDIN</span>
                <span className="text-base group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform font-bold">↗</span>
              </a>
              <a
                href="https://github.com/iporky"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#0a0a0a] hover:underline flex items-center justify-between py-1.5 border-b border-[#0a0a0a]/15 hover:border-[#0a0a0a]/40 transition-all group"
              >
                <span className="tracking-wider font-mono">GITHUB</span>
                <span className="text-base group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform font-bold">↗</span>
              </a>
              <a
                href="https://wa.me/919176788879"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#0a0a0a] hover:underline flex items-center justify-between py-1.5 border-b border-[#0a0a0a]/15 hover:border-[#0a0a0a]/40 transition-all group"
              >
                <span className="tracking-wider font-mono">WHATSAPP</span>
                <span className="text-base group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform font-bold">↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Giant Dot-Matrix Title (Image 2: PORTFOLIO/SHIVANG) */}
        <div className="w-full relative px-2 sm:px-4 py-2 sm:py-3 bg-[#9df133] overflow-hidden flex items-center justify-center">
          <DotMatrixBanner text="PORTFOLIO/SHIVANG" className="w-full" />
        </div>
      </div>
    </section>
  );
}
