"use client";

import React, { useState } from "react";
import { useHorizontalScroll, TIMELINE_STAGES, stageIndexForProgress } from "./HorizontalLayout";
import { useSound } from "./SoundManager";

const pad = (n: number) => String(n).padStart(2, "0");

// Desktop: a stage rail on the right edge. One tick per pinned screen, the
// current one lit, each one a jump target. Mobile / tablet: a neon progress
// line along the top of the page, since the rail would sit over the content.
export default function TimelineHUD() {
  const { scrollProgress, scrollToProgress, isLoaded, isDesktop, isMenuOpen } = useHorizontalScroll();
  const { playClick, playHover } = useSound();
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  if (!isLoaded) return null;

  if (!isDesktop) {
    return (
      <div
        aria-hidden
        className="fixed top-0 left-0 z-40 h-[2px] w-full origin-left bg-[#ffff00] shadow-[0_0_8px_#ffff00] pointer-events-none"
        style={{ transform: `scaleX(${scrollProgress})` }}
      />
    );
  }

  const active = stageIndexForProgress(scrollProgress);
  const visible = scrollProgress > 0.04 && !isMenuOpen;
  const hovered = hoverIdx !== null ? TIMELINE_STAGES[hoverIdx] : null;

  return (
    <nav
      aria-label="Timeline stages"
      className={`fixed right-3 lg:right-5 top-1/2 -translate-y-1/2 z-40 transition-all duration-500 ease-out ${
        visible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-3 pointer-events-none"
      }`}
    >
      {/* Hovered stage name, outside the clipped pill so it can hang to the left */}
      <span
        aria-hidden
        className={`absolute right-full mr-2 top-1/2 -translate-y-1/2 whitespace-nowrap px-2 py-1 curtis-notch bg-[#050505]/85 backdrop-blur-md border border-[#ffff00]/40 font-mono text-[9px] font-bold tracking-widest text-[#ffff00] transition-all duration-200 ${
          hovered ? "opacity-100 translate-x-0" : "opacity-0 translate-x-1"
        }`}
      >
        {hovered ? hovered.label : ""}
      </span>

      <div className="flex flex-col items-center gap-2 px-2 py-2.5 curtis-notch bg-[#050505]/85 backdrop-blur-md border border-[#ffff00]/30 shadow-[0_0_20px_rgba(0,0,0,0.85)]">
        <span className="font-mono text-[9px] font-bold tracking-widest text-[#ffff00] tabular-nums">
          {pad(active + 1)}
        </span>

        <ul className="flex flex-col items-end gap-1.5">
          {TIMELINE_STAGES.map((stage, i) => {
            const isActive = i === active;
            const isPast = i < active;
            return (
              <li key={stage.id}>
                <button
                  type="button"
                  title={stage.label}
                  aria-label={`Go to ${stage.label}`}
                  aria-current={isActive ? "step" : undefined}
                  onMouseEnter={() => {
                    setHoverIdx(i);
                    playHover();
                  }}
                  onMouseLeave={() => setHoverIdx((cur) => (cur === i ? null : cur))}
                  onClick={() => {
                    playClick();
                    scrollToProgress(stage.jump);
                  }}
                  className="group flex items-center justify-end w-7 h-3.5 cursor-pointer"
                >
                  <span
                    className={`block h-[2px] rounded-full transition-all duration-300 ease-out ${
                      isActive
                        ? "w-6 bg-[#ffff00] shadow-[0_0_8px_#ffff00]"
                        : isPast
                          ? "w-3 bg-[#ffff00]/45 group-hover:w-5 group-hover:bg-[#ffff00]"
                          : "w-3 bg-white/25 group-hover:w-5 group-hover:bg-white/70"
                    }`}
                  />
                </button>
              </li>
            );
          })}
        </ul>

        <span className="font-mono text-[9px] tracking-widest text-white/35 tabular-nums">
          {pad(TIMELINE_STAGES.length)}
        </span>

        {/* Fine overall progress rail */}
        <div aria-hidden className="relative w-px h-12 bg-white/10 overflow-hidden">
          <div
            className="absolute inset-x-0 top-0 h-full bg-[#ffff00] origin-top"
            style={{ transform: `scaleY(${scrollProgress})` }}
          />
        </div>
      </div>
    </nav>
  );
}
