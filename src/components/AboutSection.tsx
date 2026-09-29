"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, type Variants } from "framer-motion";
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
import ScrambleText from "./ScrambleText";

const EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Deck entrance: the parent staggers its blocks; the portrait unmasks bottom-up
// behind a neon scan line while the cards rise into place.
const deckVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.05 } },
};

const blockVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EXPO } },
};

const portraitVariants: Variants = {
  hidden: { clipPath: "inset(0 0 100% 0)", opacity: 0.6 },
  visible: { clipPath: "inset(0 0 0% 0)", opacity: 1, transition: { duration: 1.1, ease: EXPO } },
};

const scanVariants: Variants = {
  hidden: { top: "0%", opacity: 0 },
  visible: { top: "100%", opacity: [0, 1, 1, 0], transition: { duration: 1.1, ease: EXPO } },
};

const hoverLift = { y: -3, transition: { duration: 0.2, ease: "easeOut" as const } };

// Types the text out once `active` flips true; before that (and for the
// prerendered HTML) the full text is shown, so nothing depends on JS timing.
function Typewriter({ text, active, speed = 14 }: { text: string; active: boolean; speed?: number }) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!active) return;
    setCount(0);
    let i = 0;
    const id = window.setInterval(() => {
      i += 1;
      setCount(i);
      if (i >= text.length) window.clearInterval(id);
    }, speed);
    return () => window.clearInterval(id);
  }, [active, text, speed]);

  const typing = count !== null && count < text.length;
  const shown = count === null ? text : text.slice(0, count);

  return (
    <span>
      {shown}
      {typing && <span className="inline-block w-1.5 h-3 ml-0.5 bg-[#ffff00] align-middle animate-pulse" />}
    </span>
  );
}

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
  // When scroll reaches final pinned stage [0.860 -> 0.940], yellow card raises smoothly
  const scrollDoorProg = Math.min(1, Math.max(0, (scrollProgress - 0.86) / 0.08));
  const effectiveDoorProg = manualGarageOpen ? 1 : scrollDoorProg;
  // Smooth sine-ease transition
  const doorEase = effectiveDoorProg < 0.5
    ? 2 * effectiveDoorProg * effectiveDoorProg
    : 1 - Math.pow(-2 * effectiveDoorProg + 2, 2) / 2;
  const translateYPercent = (1 - doorEase) * 100;

  const [mobileInView, setMobileInView] = useState(false);
  const aboutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDesktop) return;

    const onScroll = () => {
      if (!aboutRef.current) return;
      const rect = aboutRef.current.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.88) {
        setMobileInView(true);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [isDesktop]);

  // The deck assembles as the track arrives (last stretch of the glide into
  // this stage on desktop; in view on mobile) and rests well before the door.
  const deckRevealed = isDesktop ? scrollProgress >= 0.79 : mobileInView;
  const beamActive = isDesktop ? scrollProgress > 0.74 : mobileInView;

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
    <section id="about" className="relative w-full lg:w-screen max-w-screen h-auto min-h-screen lg:h-screen shrink-0 bg-[#050505] text-white overflow-visible lg:overflow-hidden flex flex-col justify-between selection:bg-[#ffff00] selection:text-black pt-6 pb-0">
      {/* 6-Column Vertical Guidelines */}
      <div className="shared-grid-lines">
        <div className="shared-v-line" />
        <div className="shared-v-line" />
        <div className="shared-v-line" />
        <div className="shared-v-line" />
        <div className="shared-v-line" />
        <div className="shared-v-line" />
      </div>

      {/* Drifting transmission scan line */}
      {beamActive && (
        <div
          aria-hidden
          className="beam-y pointer-events-none absolute inset-x-0 top-0 h-px bg-[#ffff00]/25 shadow-[0_0_10px_rgba(255,255,0,0.6)] z-0"
        />
      )}

      {/* Top Meta Bar matching Curtis Image 2 */}
      {/* Stacks on phones: the name row first, the door button on its own row
          beneath it, both kept clear of the fixed MENU button by the gutter. */}
      <div className="relative z-30 px-6 sm:px-12 pr-[5.75rem] sm:pr-28 lg:pr-36 pt-6 pb-2 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-0 font-mono text-xs text-white/50 border-b border-white/[0.06]">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="w-2 h-2 rounded-full bg-[#ffff00] shadow-[0_0_8px_#ffff00]" />
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
            className="shrink-0 whitespace-nowrap px-2.5 py-1 rounded curtis-notch font-mono text-[10px] font-bold text-[#0a0a0a] bg-[#ffff00] hover:bg-[#ffff66] transition-all flex items-center gap-1"
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
      <motion.div
        ref={aboutRef}
        initial={false}
        animate={deckRevealed ? "visible" : "hidden"}
        variants={deckVariants}
        className="max-w-7xl mx-auto w-full relative z-10 px-6 sm:px-12 my-auto"
      >
        {/* Header (No text gradients, solid neon yellow) */}
        <motion.div
          variants={blockVariants}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 sm:mb-5 gap-3 sm:gap-4"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 mb-2 rounded cyber-notch-sm bg-[#ffff00]/10 border border-[#ffff00]/30 text-[#ffff00] font-mono text-xs tracking-wider">
              <Terminal className="w-3.5 h-3.5" />
              <span>// 05 &middot; ABOUT THE DEVELOPER &amp; COMMAND DECK</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Ready To Scale? <br />
              <span className="text-[#ffff00]">
                <ScrambleText text="Initiate Transmission" speed={28} />
              </span>
            </h2>
          </div>
          <p className="font-mono text-xs sm:text-sm text-white/50 max-w-sm">
            Scroll more or click &ldquo;GARAGE DOOR&rdquo; to open the executive contact deck.
          </p>
        </motion.div>

        {/* 3-Column Command Deck */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (4 cols): Moody Prevalent Dark Tuxedo Portrait (Matching Image 1) */}
          <motion.div
            variants={blockVariants}
            className="lg:col-span-4 relative flex items-start justify-center -mt-2 sm:-mt-4 lg:-mt-6"
          >
            <motion.div
              variants={portraitVariants}
              className="relative w-full max-w-[380px] h-[48vh] sm:h-[54vh] xl:h-[58vh] select-none"
              style={{
                maskImage: "linear-gradient(to bottom, black 70%, rgba(0,0,0,0.4) 88%, transparent 100%)",
                WebkitMaskImage: "linear-gradient(to bottom, black 70%, rgba(0,0,0,0.4) 88%, transparent 100%)",
              }}
            >
              {/* The figure sits left of centre in the file (bow tie at 34% of
                  its width) and the lighting hides the right side, so shift the
                  image right by the difference to centre the body in its box. */}
              <Image
                src="/portrait_tuxedo_top.webp"
                alt="Shivang Chauhan - Executive Architect"
                fill
                className="object-contain object-top translate-x-[16%] filter contrast-130 brightness-70"
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
                  backgroundImage: "radial-gradient(rgba(255,255,255,0.45) 0.5px, transparent 0.5px)",
                  backgroundSize: "2.5px 2.5px",
                }}
              />

              {/* Dense Horizontal Pixel Scanline Texture, with an occasional CRT flicker */}
              <div
                className="flicker absolute inset-0 pointer-events-none opacity-35 mix-blend-multiply"
                style={{
                  backgroundImage: "repeating-linear-gradient(to bottom, rgba(0,0,0,0.75) 0px, rgba(0,0,0,0.75) 1px, transparent 1px, transparent 2px)",
                }}
              />

              {/* Neon scan line riding the reveal edge */}
              <motion.div
                aria-hidden
                variants={scanVariants}
                className="absolute inset-x-0 h-px bg-[#ffff00] shadow-[0_0_14px_#ffff00] pointer-events-none"
              />
            </motion.div>
          </motion.div>

          {/* Center Column (4 cols): Philosophy, Recognition, Resume Download */}
          <div className="lg:col-span-4 space-y-3 flex flex-col justify-between">
            <motion.div variants={blockVariants} className="p-4 rounded-xl cyber-glass border border-white/10">
              <h3 className="font-mono text-xs text-[#ffff00] uppercase tracking-wider mb-2 flex items-center gap-1.5 font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI-First Engineering Ethos</span>
              </h3>
              <p className="text-xs text-white/80 leading-relaxed font-sans mb-3 min-h-[3.75rem]">
                <Typewriter
                  active={deckRevealed}
                  text={"\u201cI work AI-first \u2014 pairing agentic tooling (Claude Code, Copilot) with sound architecture to ship production systems solo at team speed.\u201d"}
                />
              </p>
              <div className="space-y-1.5 font-mono text-[10px] text-white/60">
                <div className="p-2 rounded bg-white/[0.02] border border-white/[0.06] hover:border-[#ffff00]/40 transition-colors">
                  <span className="text-[#ffff00] font-bold block mb-0.5">GE Best Product Award</span>
                  <span>ViewIT Visualizer ($3M Saved)</span>
                </div>
                <div className="p-2 rounded bg-white/[0.02] border border-white/[0.06] hover:border-[#ffff00]/40 transition-colors">
                  <span className="text-[#ffff00] font-bold block mb-0.5">SRM University B.Tech</span>
                  <span>8.45 CGPA &middot; Computer Science</span>
                </div>
              </div>
            </motion.div>

            {/* Quick Resume Download Action */}
            <motion.div
              variants={blockVariants}
              whileHover={hoverLift}
              className="p-3.5 rounded-lg bg-white/[0.02] border border-white/10 hover:border-[#ffff00]/40 transition-colors flex items-center justify-between"
            >
              <div>
                <span className="text-xs font-mono font-bold text-white block">Shivang Chauhan CV</span>
                <span className="text-[10px] font-mono text-white/40">12+ YRS &middot; SDE III &middot; PDF (822 KB)</span>
              </div>
              <a
                href="/Shivang_CV.pdf"
                download="Shivang_Chauhan_CV.pdf"
                onClick={playClick}
                onMouseEnter={playHover}
                className="px-3.5 py-1.5 rounded curtis-notch font-mono text-xs font-bold text-black bg-[#ffff00] hover:bg-[#ffff66] transition-all flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>DOWNLOAD</span>
              </a>
            </motion.div>
          </div>

          {/* Right Column (4 cols): Direct Contact Command Center */}
          <div className="lg:col-span-4 space-y-3 flex flex-col justify-between">
            {/* Channel status */}
            <motion.div
              variants={blockVariants}
              className="flex items-center gap-2 font-mono text-[10px] text-white/45 uppercase tracking-wider"
            >
              <span className="relative flex w-2 h-2">
                <span className="absolute inset-0 rounded-full bg-[#ffff00]/60 animate-ping" />
                <span className="relative w-2 h-2 rounded-full bg-[#ffff00]" />
              </span>
              <span>CHANNEL OPEN &middot; BANGALORE &middot; IST</span>
            </motion.div>

            {/* Direct Email Card */}
            <motion.div
              variants={blockVariants}
              whileHover={hoverLift}
              className="p-4 rounded-xl cyber-glass border border-white/10 hover:border-[#ffff00]/40 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="relative p-2 rounded bg-[#ffff00]/10 text-[#ffff00]">
                  <span aria-hidden className="absolute inset-0 rounded bg-[#ffff00]/20 animate-ping [animation-duration:2.4s]" />
                  <Mail className="relative w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-white/40 block">DIRECT EMAIL</span>
                  <a
                    href={`mailto:${email}`}
                    className="text-xs font-mono text-white hover:text-[#ffff00] transition-colors"
                  >
                    {email}
                  </a>
                </div>
              </div>
              <button
                onClick={handleCopyEmail}
                className={`px-3 py-1.5 rounded curtis-notch font-mono text-[10px] border transition-all flex items-center gap-1 cursor-pointer ${
                  copiedEmail
                    ? "bg-[#ffff00] text-black border-[#ffff00]"
                    : "bg-white/[0.05] hover:bg-[#ffff00] hover:text-black border-white/10"
                }`}
              >
                {copiedEmail ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedEmail ? "COPIED" : "COPY"}</span>
              </button>
            </motion.div>

            {/* Direct Phone / WhatsApp Card */}
            <motion.div
              variants={blockVariants}
              whileHover={hoverLift}
              className="p-4 rounded-xl cyber-glass border border-white/10 hover:border-[#ffff00]/40 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="relative p-2 rounded bg-[#ffff00]/10 text-[#ffff00]">
                  <span aria-hidden className="absolute inset-0 rounded bg-[#ffff00]/20 animate-ping [animation-duration:2.4s] [animation-delay:1.2s]" />
                  <Phone className="relative w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-white/40 block">PHONE / WHATSAPP</span>
                  <a
                    href={`tel:${phone.replace(/\s+/g, "")}`}
                    className="text-xs sm:text-sm font-mono text-white hover:text-[#ffff00] transition-colors"
                  >
                    {phone}
                  </a>
                </div>
              </div>
              <button
                onClick={handleCopyPhone}
                className={`px-3 py-1.5 rounded curtis-notch font-mono text-[10px] border transition-all flex items-center gap-1 cursor-pointer ${
                  copiedPhone
                    ? "bg-[#ffff00] text-black border-[#ffff00]"
                    : "bg-white/[0.05] hover:bg-[#ffff00] hover:text-black border-white/10"
                }`}
              >
                {copiedPhone ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedPhone ? "COPIED" : "COPY"}</span>
              </button>
            </motion.div>

            {/* Jump back to Hero Button */}
            <motion.div
              variants={blockVariants}
              className="pt-2 flex items-center justify-between font-mono text-xs text-white/40"
            >
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
                className="flex items-center gap-2 hover:text-[#ffff00] transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>RETURN TO HERO [START]</span>
              </button>
              <span>&copy; 2026 SHIVANG CHAUHAN</span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* GARAGE DOOR YELLOW CARD:
          - Desktop: Absolute 72vh card rising smoothly from bottom on scroll
          - Mobile/Tablet: Natural full-width in-flow footer */}
      <div
        id="garage-footer"
        className={
          isDesktop
            ? "absolute inset-x-0 bottom-0 z-40 bg-[#ffff00] text-[#0a0a0a] shadow-[0_-24px_60px_rgba(0,0,0,0.85)] border-t border-[#0a0a0a]/20 flex flex-col justify-between overflow-hidden"
            : "relative w-full bg-[#ffff00] text-[#0a0a0a] shadow-2xl border-t border-[#0a0a0a]/20 flex flex-col justify-between overflow-hidden mt-12"
        }
        style={{
          height: isDesktop ? "72vh" : "auto",
          transform: isDesktop ? `translate3d(0, ${translateYPercent}%, 0)` : "none",
          transition: isDesktop ? "transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)" : "none",
        }}
      >
        {/* Hazard stripes along the door's leading edge */}
        <div aria-hidden className="h-1.5 w-full overflow-hidden bg-[#0a0a0a] shrink-0">
          <div className="hazard-stripes h-full w-[200%]" />
        </div>

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
                className="px-5 py-3 rounded curtis-notch font-mono text-xs font-black text-[#0a0a0a] border border-[#0a0a0a] bg-transparent hover:bg-[#0a0a0a] hover:text-[#ffff00] transition-all tracking-wider uppercase flex items-center gap-2"
              >
                <span>SHOOT A MESSAGE</span>
              </a>
              <a
                href="/Shivang_CV.pdf"
                download="Shivang_Chauhan_CV.pdf"
                onClick={playClick}
                onMouseEnter={playHover}
                className="px-5 py-3 rounded curtis-notch font-mono text-xs font-black text-[#0a0a0a] border border-[#0a0a0a] bg-transparent hover:bg-[#0a0a0a] hover:text-[#ffff00] transition-all tracking-wider uppercase flex items-center gap-2"
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
                href="https://www.instagram.com/nanashi.la_familia/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-bold text-[#0a0a0a] hover:underline flex items-center justify-between py-1.5 border-b border-[#0a0a0a]/15 hover:border-[#0a0a0a]/40 transition-all group"
              >
                <span className="tracking-wider font-mono">INSTAGRAM</span>
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
        <div className="w-full relative px-2 sm:px-4 py-2 sm:py-3 bg-[#ffff00] overflow-hidden flex items-center justify-center">
          <DotMatrixBanner text="PORTFOLIO/SHIVANG" className="w-full" />
        </div>
      </div>
    </section>
  );
}
