"use client";

import React, { useState, useEffect } from "react";
import { ArrowRight, ChevronRight, Volume2, VolumeX } from "lucide-react";
import { useSound } from "./SoundManager";
import { useHorizontalScroll } from "./HorizontalLayout";
import ScrollScrambleText from "./ScrollScrambleText";
import PixelScrollCue from "./PixelScrollCue";
import GlitchPortrait from "./GlitchPortrait";
import ScrambleText from "./ScrambleText";

export default function CurtisHero() {
  const { soundEnabled, toggleSound, playClick, playHover } = useSound();
  const { scrollProgress, scrollToProgress } = useHorizontalScroll();
  const [timeStr, setTimeStr] = useState<string>("5:30 PM");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Asia/Kolkata",
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative w-screen h-screen shrink-0 bg-[#050505] text-white overflow-hidden flex flex-col justify-between pt-6 pb-6 px-6 sm:px-12 selection:bg-[#9df133] selection:text-black">
      {/* 6-Column Vertical Guidelines (Curtis Style) */}
      <div className="shared-grid-lines">
        <div className="shared-v-line" />
        <div className="shared-v-line" />
        <div className="shared-v-line" />
        <div className="shared-v-line" />
        <div className="shared-v-line" />
        <div className="shared-v-line" />
      </div>

      {/* Top Curtis Telemetry Bar */}
      <header className="relative z-30 flex items-center justify-between font-mono text-xs text-white/50 border-b border-white/[0.06] pb-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-[#9df133]">
            <polygon points="12 2 22 20 2 20" stroke="currentColor" strokeWidth="2.5" fill="none" />
            <circle cx="12" cy="14" r="2.5" fill="currentColor" />
          </svg>
          <span className="font-bold tracking-wider text-white uppercase text-sm">
            SHIVANG CHAUHAN
          </span>
        </div>

        {/* Audio Toggle */}
        <button
          onClick={() => {
            playClick();
            toggleSound();
          }}
          onMouseEnter={playHover}
          className="hidden sm:flex items-center gap-1.5 cursor-pointer uppercase tracking-wider hover:text-white transition-colors"
        >
          <span>SOUND</span>
          <span className="text-white/30">-</span>
          <span className={soundEnabled ? "text-[#9df133] font-bold" : "text-white/40"}>
            {soundEnabled ? "ON" : "OFF"}
          </span>
        </button>

        {/* City & Clock */}
        <div className="hidden md:flex flex-col text-[11px] uppercase tracking-wider text-right sm:text-left">
          <span className="text-white/80">BANGALORE, IN</span>
          <span className="text-white/40">{timeStr} IST</span>
        </div>

        {/* Coordinates */}
        <div className="hidden lg:flex flex-col text-[11px] tracking-wider text-right text-white/40">
          <span>12&deg;58&apos;32.0&quot;N</span>
          <span>77&deg;35&apos;55.2&quot;E</span>
        </div>

        {/* Curtis Polygon Menu Button */}
        <button
          onClick={() => {
            playClick();
            scrollToProgress(0.18);
          }}
          onMouseEnter={playHover}
          className="group relative flex items-center justify-center h-8 px-4 curtis-notch bg-[#9df133]/10 border border-[#9df133]/30 hover:bg-[#9df133] hover:text-black transition-all cursor-pointer"
        >
          <span className="absolute -top-0.5 -left-0.5 w-1.5 h-1.5 border-t border-l border-[#9df133]" />
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 border-t border-r border-[#9df133]" />
          <span className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 border-b border-l border-[#9df133]" />
          <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 border-b border-r border-[#9df133]" />
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#9df133] group-hover:text-black">
            EXPLORE &rarr;
          </span>
        </button>
      </header>

      {/* Main Hero Body: Freestanding Glitch Portrait (LEFT) + Headline & Scroll-Scrambled Quote (RIGHT) */}
      <div className="relative z-20 my-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center max-w-7xl mx-auto w-full h-[78vh]">
        {/* Left Column: Freestanding Portrait with Rich Glitch Overlay */}
        <div className="lg:col-span-5 relative h-full flex items-center justify-center lg:justify-start">
          <GlitchPortrait className="w-full max-w-[440px] h-[55vh] sm:h-[65vh] xl:h-[72vh]" />
        </div>

        {/* Right Column: Reference Image 1 Layout (Giant Name SHIVANG CHAUHAN + Green Badge + Quote) */}
        <div className="lg:col-span-7 flex flex-col justify-center pl-0 lg:pl-4">
          {/* Top Quick Telemetry & Contact */}
          <div className="flex items-center gap-4 font-mono text-[10px] text-white/50 mb-3 tracking-wider">
            <span>+91 91767 88879</span>
            <span className="text-white/20">&bull;</span>
            <span className="text-[#b4f000]">CHAUHANSHIVANG4@GMAIL.COM</span>
          </div>

          {/* Acid-Green Role Badge (Enlarged Designation) */}
          <div className="mb-4 sm:mb-5">
            <span className="inline-block px-4 sm:px-5 py-2 sm:py-2.5 rounded curtis-notch font-mono text-sm sm:text-base md:text-lg font-black uppercase tracking-wider bg-[#b4f000] text-[#050505] shadow-[0_0_24px_rgba(180,240,0,0.5)]">
              LEAD FULL-STACK &amp; AGENTIC AI ARCHITECT
            </span>
          </div>

          {/* Giant Typographic Name with Entry Scramble Animation */}
          <div className="mb-4">
            <div className="flex items-baseline justify-between max-w-lg">
              <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight text-white leading-[0.88] select-none">
                <span className="block text-white/95">
                  <ScrambleText text="SHIVANG" speed={25} delay={80} />
                </span>
                <span className="block text-[#9df133]">
                  <ScrambleText text="CHAUHAN" speed={25} delay={200} />
                </span>
              </h1>
              <div className="hidden sm:flex flex-col font-mono text-[11px] text-white/40 text-right uppercase tracking-widest">
                <span className="text-[#9df133] font-bold">12+ YRS</span>
                <span>EXP</span>
              </div>
            </div>
          </div>

          {/* Philosophy Quote Follows on Scroll Leading into Lets Iterate Together */}
          <div className="mt-2 mb-2 max-w-xl">
            <ScrollScrambleText
              text="Great products are crafted by discords, late night sessions and millions of Iterations. So : "
              scrollProgress={scrollProgress}
              startThreshold={0.003}
              endThreshold={0.040}
              prefix=">>"
              className="text-sm sm:text-base md:text-lg font-bold font-mono tracking-tight text-white/90 leading-snug"
            />
          </div>

          {/* Reference Image 3 & Image 2: Direction of Scroll Cue with Exact Green Pixel Arrow */}
          <div className="mt-2">
            <PixelScrollCue scrollProgress={scrollProgress} />
          </div>
        </div>
      </div>

      {/* Bottom Horizontal Cue Banner */}
      <footer className="relative z-30 pt-3 border-t border-white/[0.06] flex items-center justify-between font-mono text-xs text-white/50">
        <div className="flex items-center gap-3">
          <span className="text-[#9df133] font-semibold uppercase tracking-wider">
            HORIZONTAL TIMELINE
          </span>
          <span className="text-white/20">|</span>
          <span className="text-white/40">SCROLL DOWN TO GLIDE RIGHT &rarr;</span>
        </div>

        <button
          onClick={() => scrollToProgress(0.18)}
          onMouseEnter={playHover}
          className="flex items-center gap-2 text-white/70 hover:text-[#9df133] transition-colors"
        >
          <span>NEXT: SCROLLYTELLING SEQUENCE</span>
          <ArrowRight className="w-4 h-4 text-[#9df133]" />
        </button>
      </footer>
    </section>
  );
}
