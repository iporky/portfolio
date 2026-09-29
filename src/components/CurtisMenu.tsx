"use client";

import React, { useEffect } from "react";
import { useHorizontalScroll, TIMELINE_STAGES } from "./HorizontalLayout";
import { useSound } from "./SoundManager";

interface CurtisMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItemProps {
  label: string;
  onClick: () => void;
}

// Menu palette: pitch black panels with a cyberpunk yellow signal colour. The
// rest of the timeline keeps its chartreuse; only the drawer speaks yellow.
const YELLOW = "#ffff00";

const PILL_CLIP = "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)";

// Black chamfered pill with a yellow hairline; floods yellow on hover. Every
// item shares one height and one type size so the stack reads as a set.
function CurtisMenuItem({ label, onClick }: MenuItemProps) {
  const { playHover } = useSound();

  return (
    <div
      className="group relative w-full shrink-0 p-px bg-[#ffff00]/40 hover:bg-[#ffff00] transition-colors duration-150"
      style={{ clipPath: PILL_CLIP }}
    >
      <button
        onClick={onClick}
        onMouseEnter={playHover}
        className="relative w-full h-12 sm:h-14 flex items-center justify-start px-5 sm:px-6 bg-[#0a0a0a] text-[#ffff00] group-hover:bg-[#ffff00] group-hover:text-[#0a0a0a] transition-colors duration-150 cursor-pointer select-none"
        style={{ clipPath: PILL_CLIP }}
      >
        {/* Top-Right Corner '+' */}
        <span className="absolute top-1 right-2 font-mono text-[11px] font-bold opacity-70 select-none">+</span>

        {/* Bottom-Left Corner '+' */}
        <span className="absolute bottom-1 left-2 font-mono text-[11px] font-bold opacity-70 select-none">+</span>

        {/* Left signal bar, lit on hover */}
        <span className="absolute left-0 top-3 bottom-3 w-[3px] bg-[#ffff00]/60 group-hover:bg-[#0a0a0a] transition-colors duration-150" />

        <span className="text-2xl sm:text-3xl font-black font-sans uppercase tracking-tight leading-none">
          {label}
        </span>

        <span className="ml-auto font-mono text-xs font-bold opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-150">
          &rarr;
        </span>
      </button>
    </div>
  );
}

export default function CurtisMenu({ isOpen, onClose }: CurtisMenuProps) {
  const { isDesktop, scrollToProgress } = useHorizontalScroll();
  const { playClick, playHover } = useSound();

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Desktop jumps land on the stage's settled point from the shared timeline,
  // so a menu item never parks the track halfway through a slide transition.
  const navigateTo = (anchorId: string, stageId: string) => {
    playClick();
    onClose();
    if (isDesktop) {
      const stage = TIMELINE_STAGES.find((s) => s.id === stageId);
      scrollToProgress(stage ? stage.jump : 0);
    } else {
      const el = document.getElementById(anchorId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const socialLinks = [
    { num: "01", label: "LINKEDIN", href: "https://www.linkedin.com/in/shivang-chauhan/", isDownload: false },
    { num: "02", label: "INSTAGRAM", href: "https://www.instagram.com/nanashi.la_familia/", isDownload: false },
    { num: "03", label: "GITHUB", href: "https://github.com/iporky", isDownload: false },
    { num: "04", label: "EMAIL", href: "mailto:chauhanshivang4@gmail.com", isDownload: false },
    { num: "05", label: "WHATSAPP", href: "https://wa.me/919176788879", isDownload: false },
    { num: "06", label: "RESUME", href: "/Shivang_CV.pdf", isDownload: true, downloadName: "Shivang_Chauhan_Resume.pdf" },
  ];

  return (
    <>
      {/* Transparent Click-Dismiss Layer (No dark overlay - keeps full page visible underneath!) */}
      <div
        onClick={() => {
          playClick();
          onClose();
        }}
        className="fixed inset-0 z-[110] bg-black/10 select-none"
      />

      {/* Cyber Drawer Panel Attached Directly to Top-Right Menu Button */}
      <div className="menu-in fixed top-3 right-3 sm:top-4 sm:right-6 lg:top-5 lg:right-8 z-[120] w-[calc(100vw-24px)] max-w-[360px] sm:max-w-[380px] origin-top-right select-none">
        {/* Chamfered Outer Border Container */}
        <div
          className="relative w-full bg-[#ffff00]/35 p-[1.5px] shadow-[0_20px_50px_rgba(0,0,0,0.95),0_0_40px_rgba(255,255,0,0.12)]"
          style={{
            clipPath:
              "polygon(14px 0, calc(100% - 14px) 0, 100% 14px, 100% calc(100% - 14px), calc(100% - 14px) 100%, 14px 100%, 0 calc(100% - 14px), 0 14px)",
          }}
        >
          {/* Inner Drawer Body */}
          <div
            className="relative w-full bg-[#0a0a0a] text-white p-5 sm:p-6 flex flex-col justify-between overflow-hidden"
            style={{
              clipPath:
                "polygon(13px 0, calc(100% - 13px) 0, 100% 13px, 100% calc(100% - 13px), calc(100% - 13px) 100%, 13px 100%, 0 calc(100% - 13px), 0 13px)",
            }}
          >
            {/* Fine grid + scanlines behind the panel */}
            <div aria-hidden className="absolute inset-0 cyber-grid opacity-60 pointer-events-none" />
            <div aria-hidden className="absolute inset-0 scanline opacity-10 pointer-events-none" />

            <div className="relative">
              {/* Top Bar inside Drawer: / MENU & Attached CLOSE Button */}
              <div className="flex items-center justify-between font-mono text-xs uppercase tracking-widest text-white/50 mb-5 pb-3 border-b border-[#ffff00]/20">
                <span className="font-bold tracking-widest flex items-center gap-2" style={{ color: YELLOW }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ffff00] animate-pulse" />
                  // MENU
                </span>

                {/* Authentic Curtis Close Button with Corner Brackets */}
                <button
                  onClick={() => {
                    playClick();
                    onClose();
                  }}
                  onMouseEnter={playHover}
                  className="group relative px-3 py-1 bg-[#ffff00]/10 hover:bg-[#ffff00] hover:text-black border border-[#ffff00]/40 transition-all font-mono text-[11px] font-bold uppercase tracking-wider text-[#ffff00] cursor-pointer"
                >
                  <span className="absolute -top-0.5 -left-0.5 w-1 h-1 border-t border-l border-[#ffff00]" />
                  <span className="absolute -top-0.5 -right-0.5 w-1 h-1 border-t border-r border-[#ffff00]" />
                  <span className="absolute -bottom-0.5 -left-0.5 w-1 h-1 border-b border-l border-[#ffff00]" />
                  <span className="absolute -bottom-0.5 -right-0.5 w-1 h-1 border-b border-r border-[#ffff00]" />
                  <span>CLOSE</span>
                </button>
              </div>

              {/* Primary Navigation Tiles: identical height and type size, black with yellow signal */}
              <nav className="flex flex-col items-stretch gap-2.5 mb-6 w-full">
                <CurtisMenuItem label="ABOUT" onClick={() => navigateTo("about", "about")} />
                <CurtisMenuItem label="WORK" onClick={() => navigateTo("selected-products", "work")} />
                <CurtisMenuItem label="CAPABILITIES" onClick={() => navigateTo("capabilities-tiles", "capabilities")} />
                <CurtisMenuItem label="STORY" onClick={() => navigateTo("scrolly-greeting", "story")} />
              </nav>

              {/* CONNECT SECTION */}
              <div className="pt-3 border-t border-[#ffff00]/20">
                <span className="block font-mono text-[10px] font-bold text-white/50 uppercase tracking-widest mb-3">
                  CONNECT
                </span>

                {/* 2-Column Numbered Links Grid */}
                <div className="grid grid-cols-2 gap-x-5 gap-y-2.5">
                  {socialLinks.map((link) => (
                    <a
                      key={link.num}
                      href={link.href}
                      download={link.isDownload ? (link.downloadName || true) : undefined}
                      target={link.isDownload ? "_self" : "_blank"}
                      rel="noopener noreferrer"
                      onMouseEnter={playHover}
                      onClick={playClick}
                      className="group flex items-center justify-between text-xs font-mono py-1 border-b border-transparent hover:border-[#ffff00]/50 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="font-bold text-[10px]" style={{ color: YELLOW }}>
                          {link.num}
                        </span>
                        <span className="text-white/80 group-hover:text-[#ffff00] uppercase tracking-wider font-semibold truncate text-[11px] transition-colors">
                          {link.label}
                        </span>
                        {link.isDownload && (
                          <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-[#ffff00]/15 text-[#ffff00] border border-[#ffff00]/40 font-bold shrink-0">
                            PDF
                          </span>
                        )}
                      </div>
                      <span
                        className="group-hover:translate-y-0.5 transition-transform text-xs font-bold shrink-0 ml-1"
                        style={{ color: YELLOW }}
                      >
                        {link.isDownload ? "↓" : "↗"}
                      </span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="pt-4 mt-4 border-t border-[#ffff00]/20 flex items-center justify-between font-mono text-[10px] text-white/40 tracking-wider">
                <span>@2026 BY SHIVANG CHAUHAN</span>
                <span className="text-[#ffff00]/70">FULL-STACK &bull; AI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
