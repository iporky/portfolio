"use client";

import React, { useEffect } from "react";
import { useHorizontalScroll } from "./HorizontalLayout";
import { useSound } from "./SoundManager";

interface CurtisMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuItemProps {
  label: string;
  onClick: () => void;
  textSize?: string;
}

// Authentic Curtis Metallic-to-Neon Chamfered Pill - All items have exact same height (h-12 sm:h-13)
function CurtisMenuItem({ label, onClick, textSize = "text-2xl sm:text-3xl" }: MenuItemProps) {
  const { playHover } = useSound();

  return (
    <button
      onClick={onClick}
      onMouseEnter={playHover}
      className="group relative w-full h-12 sm:h-13 flex items-center justify-start px-5 sm:px-6 bg-gradient-to-br from-[#f2f4ec] via-[#e5e9de] to-[#d8ddd0] hover:from-[#a7f73a] hover:via-[#9df133] hover:to-[#92e828] text-[#0a0a0a] transition-all duration-150 cursor-pointer shadow-sm hover:shadow-[0_0_24px_rgba(157,241,51,0.6)] select-none shrink-0"
      style={{
        clipPath:
          "polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px)",
      }}
    >
      {/* Top-Right Corner '+' */}
      <span className="absolute top-1 right-2 font-mono text-[11px] font-bold text-[#0a0a0a]/80 select-none">
        +
      </span>

      {/* Bottom-Left Corner '+' */}
      <span className="absolute bottom-1 left-2 font-mono text-[11px] font-bold text-[#0a0a0a]/80 select-none">
        +
      </span>

      <span className={`${textSize} font-black font-sans uppercase tracking-tight leading-none`}>
        {label}
      </span>
    </button>
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

  const navigateTo = (anchorId: string, desktopProg: number) => {
    playClick();
    onClose();
    if (isDesktop) {
      scrollToProgress(desktopProg);
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
      <div className="fixed top-3 right-3 sm:top-4 sm:right-6 lg:top-5 lg:right-8 z-[120] w-[calc(100vw-24px)] max-w-[360px] sm:max-w-[380px] origin-top-right transition-all duration-200 ease-out select-none">
        {/* Chamfered Outer Border Container */}
        <div
          className="relative w-full bg-[#262626] p-[1.5px] shadow-[0_20px_50px_rgba(0,0,0,0.95)]"
          style={{
            clipPath:
              "polygon(14px 0, calc(100% - 14px) 0, 100% 14px, 100% calc(100% - 14px), calc(100% - 14px) 100%, 14px 100%, 0 calc(100% - 14px), 0 14px)",
          }}
        >
          {/* Inner Drawer Body */}
          <div
            className="relative w-full bg-[#0a0a0a] text-white p-5 sm:p-6 flex flex-col justify-between"
            style={{
              clipPath:
                "polygon(13px 0, calc(100% - 13px) 0, 100% 13px, 100% calc(100% - 13px), calc(100% - 13px) 100%, 13px 100%, 0 calc(100% - 13px), 0 13px)",
            }}
          >
            {/* Top Bar inside Drawer: / MENU & Attached CLOSE Button */}
            <div className="flex items-center justify-between font-mono text-xs uppercase tracking-widest text-white/50 mb-5 pb-3 border-b border-white/[0.08]">
              <span className="font-bold tracking-widest text-[#9df133]">// MENU</span>

              {/* Authentic Curtis Close Button with Corner Brackets */}
              <button
                onClick={() => {
                  playClick();
                  onClose();
                }}
                onMouseEnter={playHover}
                className="group relative px-3 py-1 bg-[#9df133]/10 hover:bg-[#9df133] hover:text-black border border-[#9df133]/30 transition-all font-mono text-[11px] font-bold uppercase tracking-wider text-white cursor-pointer"
              >
                <span className="absolute -top-0.5 -left-0.5 w-1 h-1 border-t border-l border-[#9df133]" />
                <span className="absolute -top-0.5 -right-0.5 w-1 h-1 border-t border-r border-[#9df133]" />
                <span className="absolute -bottom-0.5 -left-0.5 w-1 h-1 border-b border-l border-[#9df133]" />
                <span className="absolute -bottom-0.5 -right-0.5 w-1 h-1 border-b border-r border-[#9df133]" />
                <span>CLOSE</span>
              </button>
            </div>

            {/* Primary Navigation Tiles: Identical Height (h-12 sm:h-13), Metallic Sheen, Neon Hover */}
            <nav className="flex flex-col items-stretch gap-2.5 mb-6 w-full">
              <CurtisMenuItem
                label="ABOUT"
                onClick={() => navigateTo("about-engineer", 0.90)}
              />

              <CurtisMenuItem
                label="WORK"
                onClick={() => navigateTo("selected-products", 0.62)}
              />

              <CurtisMenuItem
                label="CAPABILITIES"
                onClick={() => navigateTo("capabilities-tiles", 0.35)}
                textSize="text-xl sm:text-2xl"
              />

              <CurtisMenuItem
                label="STORY"
                onClick={() => navigateTo("scrolly-greeting", 0.18)}
              />
            </nav>

            {/* CONNECT SECTION */}
            <div className="pt-3 border-t border-white/[0.08]">
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
                    className="group flex items-center justify-between text-xs font-mono py-1 border-b border-transparent hover:border-[#9df133]/40 transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="text-[#9df133] font-bold text-[10px]">{link.num}</span>
                      <span className="text-white/80 group-hover:text-[#9df133] uppercase tracking-wider font-semibold truncate text-[11px]">
                        {link.label}
                      </span>
                      {link.isDownload && (
                        <span className="text-[8px] font-mono px-1 py-0.2 rounded bg-[#9df133]/20 text-[#9df133] border border-[#9df133]/30 font-bold shrink-0">
                          PDF
                        </span>
                      )}
                    </div>
                    <span className="text-[#9df133] group-hover:translate-y-0.5 transition-transform text-xs font-bold shrink-0 ml-1">
                      {link.isDownload ? "↓" : "↗"}
                    </span>
                  </a>
                ))}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="pt-4 mt-4 border-t border-white/[0.08] flex items-center justify-between font-mono text-[10px] text-white/40 tracking-wider">
              <span>@2026 BY SHIVANG CHAUHAN</span>
              <span className="text-[#9df133]/60">FULL-STACK &bull; AI</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
