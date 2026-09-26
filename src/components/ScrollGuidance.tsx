"use client";

import React from "react";

interface ScrollGuidanceProps {
  label?: string;
  className?: string;
  theme?: "dark" | "light"; // "dark": green on black; "light": black on green
}

export default function ScrollGuidance({
  label = "KEEP SCROLLING",
  className = "",
  theme = "dark",
}: ScrollGuidanceProps) {
  const isLight = theme === "light";

  return (
    <div
      className={`inline-flex flex-col items-center gap-1.5 select-none font-mono text-[10px] tracking-widest uppercase pointer-events-none transition-all duration-300 ${className}`}
    >
      <div
        className={`inline-flex items-center gap-2 px-3 py-1 rounded curtis-notch font-bold ${
          isLight
            ? "bg-[#0a0a0a] text-[#9df133] shadow-lg border border-[#0a0a0a]/30"
            : "bg-[#050505]/80 text-[#9df133] border border-[#9df133]/40 backdrop-blur-md shadow-[0_0_16px_rgba(157,241,51,0.25)]"
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isLight ? "bg-[#9df133] animate-ping" : "bg-[#9df133] animate-pulse"
          }`}
        />
        <span>{label}</span>
      </div>

      {/* Retro Pixel Downward Bouncing Arrow */}
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="currentColor"
        className={`animate-bounce ${
          isLight
            ? "text-[#0a0a0a] drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]"
            : "text-[#9df133] drop-shadow-[0_0_8px_rgba(157,241,51,0.8)]"
        }`}
      >
        {/* Shaft */}
        <rect x="8" y="0" width="4" height="4" rx="0.5" />
        <rect x="8" y="4" width="4" height="4" rx="0.5" />
        {/* Arrowhead Bar */}
        <rect x="0" y="8" width="4" height="4" rx="0.5" />
        <rect x="8" y="8" width="4" height="4" rx="0.5" />
        <rect x="16" y="8" width="4" height="4" rx="0.5" />
        {/* Arrowhead diagonals */}
        <rect x="4" y="12" width="4" height="4" rx="0.5" />
        <rect x="8" y="12" width="4" height="4" rx="0.5" />
        <rect x="12" y="12" width="4" height="4" rx="0.5" />
        {/* Tip */}
        <rect x="8" y="16" width="4" height="4" rx="0.5" />
      </svg>
    </div>
  );
}
