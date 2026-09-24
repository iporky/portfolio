"use client";

import React, { useState, useEffect } from "react";
import { useSound } from "./SoundManager";
import { Volume2, VolumeX, Menu, X, Download, Terminal, Sparkles } from "lucide-react";

export default function Navbar() {
  const { soundEnabled, toggleSound, playClick, playHover } = useSound();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "01 // OVERVIEW", href: "#overview" },
    { label: "02 // IMPACT", href: "#impact" },
    { label: "03 // ARCHITECTURE", href: "#architecture" },
    { label: "04 // TECH STACK", href: "#tech-stack" },
    { label: "05 // ABOUT", href: "#about" },
    { label: "06 // CONTACT", href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#050505]/85 backdrop-blur-md border-b border-white/[0.08] py-3 shadow-2xl shadow-black/80"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Brand Identity */}
        <a
          href="#top"
          onClick={playClick}
          onMouseEnter={playHover}
          className="group flex items-center gap-3 text-left focus:outline-none"
        >
          <div className="relative flex items-center justify-center w-9 h-9 cyber-notch bg-white/[0.04] border border-white/15 group-hover:border-[#00f5d4]/60 group-hover:bg-[#00f5d4]/10 transition-colors">
            <span className="font-mono text-sm font-bold text-[#00f5d4]">SC</span>
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#00f5d4] animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold tracking-wider text-white uppercase group-hover:text-[#00f5d4] transition-colors">
                Shivang Chauhan
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.2 text-[9px] font-mono tracking-widest uppercase bg-[#00f5d4]/10 text-[#00f5d4] border border-[#00f5d4]/30 rounded">
                SDE III
              </span>
            </div>
            <p className="font-mono text-[10px] text-white/40 tracking-tight">
              Full-Stack & Agentic AI Architect
            </p>
          </div>
        </a>

        {/* Center: Live Telemetry (Desktop) */}
        <div className="hidden lg:flex items-center gap-6 font-mono text-[11px] text-white/50 border-x border-white/10 px-6 py-1">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-white/80">AVAILABLE FOR ROLES</span>
          </div>
          <span className="text-white/20">|</span>
          <div className="flex items-center gap-1.5">
            <span className="text-white/40">LOC:</span>
            <span className="text-white/80">BANGALORE, IN</span>
            <span className="text-white/40 text-[9px]">(12.97°N, 77.59°E)</span>
          </div>
        </div>

        {/* Right: Sound Toggle, Links, CTA */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Sound FX Button */}
          <button
            onClick={() => {
              playClick();
              toggleSound();
            }}
            onMouseEnter={playHover}
            title={soundEnabled ? "Mute audio effects" : "Enable futuristic sound effects"}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-mono border transition-all ${
              soundEnabled
                ? "bg-[#00f5d4]/15 border-[#00f5d4]/60 text-[#00f5d4] shadow-[0_0_12px_rgba(0,245,212,0.2)]"
                : "bg-white/[0.03] border-white/10 text-white/50 hover:text-white/80 hover:border-white/20"
            }`}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 animate-pulse" />
                <span className="hidden md:inline text-[10px] font-semibold">SFX: ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span className="hidden md:inline text-[10px]">SFX: OFF</span>
              </>
            )}
          </button>

          {/* Desktop Nav Links */}
          <nav className="hidden xl:flex items-center gap-5 font-mono text-xs text-white/60">
            {navLinks.slice(1, 5).map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={playClick}
                onMouseEnter={playHover}
                className="hover:text-[#00f5d4] transition-colors relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#00f5d4] hover:after:w-full after:transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Download Resume Button */}
          <a
            href="/Shivang_CV.pdf"
            download="Shivang_Chauhan_CV.pdf"
            onClick={playClick}
            onMouseEnter={playHover}
            className="relative group overflow-hidden px-3.5 py-1.5 text-xs font-mono font-medium text-black bg-[#00f5d4] hover:bg-[#38ffd9] transition-all duration-200 cyber-notch-sm flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,245,212,0.25)] hover:shadow-[0_0_20px_rgba(0,245,212,0.45)]"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="tracking-wide">CV.PDF</span>
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => {
              playClick();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="xl:hidden p-2 text-white/70 hover:text-white border border-white/10 rounded bg-white/[0.03]"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden bg-[#070913]/98 border-b border-white/10 px-6 py-6 backdrop-blur-2xl">
          <div className="flex flex-col gap-4 font-mono text-sm">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs text-white/40">
              <span>// NAVIGATION HUD</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                ONLINE
              </span>
            </div>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => {
                  playClick();
                  setMobileMenuOpen(false);
                }}
                className="text-white/70 hover:text-[#00f5d4] py-1 transition-colors flex items-center justify-between"
              >
                <span>{link.label}</span>
                <span className="text-white/20 text-xs">→</span>
              </a>
            ))}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <a
                href="mailto:chauhanshivang4@gmail.com"
                className="text-xs text-[#00f5d4] hover:underline"
              >
                chauhanshivang4@gmail.com
              </a>
              <span className="text-xs text-white/40">+91 91767 88879</span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
