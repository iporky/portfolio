"use client";

import React from "react";

interface PixelScrollCueProps {
  scrollProgress: number;
  className?: string;
}

export default function PixelScrollCue({
  scrollProgress,
  className = "",
}: PixelScrollCueProps) {
  const isVisible = scrollProgress > 0.008;
  const opacity = Math.min(1, Math.max(0, (scrollProgress - 0.008) / 0.025));

  return (
    <div
      className={`inline-flex items-center gap-4 select-none transition-all duration-300 ${className}`}
      style={{
        opacity,
        transform: `translateX(${Math.min(15, scrollProgress * 120)}px)`,
      }}
    >
      <div className="flex flex-col font-mono uppercase tracking-tight font-black leading-none">
        <span className="text-white/90 text-sm sm:text-base tracking-wider">&quot;LETS ITERATE</span>
        <span className="text-[#b4f000] text-base sm:text-lg tracking-widest font-black">TOGETHER&quot;</span>
      </div>

      {/* Exact Green Pixel Arrow (Reference Image 2) */}
      <svg
        width="44"
        height="36"
        viewBox="0 0 60 50"
        fill="none"
        className="shrink-0 text-[#b4f000] drop-shadow-[0_0_10px_rgba(180,240,0,0.6)] animate-pulse"
      >
        {/* Row 0 */}
        <rect x="30" y="0" width="8" height="8" fill="currentColor" rx="1" />

        {/* Row 1 */}
        <rect x="40" y="10" width="8" height="8" fill="currentColor" rx="1" />

        {/* Row 2: Shaft and Arrow Tip */}
        <rect x="0" y="20" width="8" height="8" fill="currentColor" rx="1" />
        <rect x="10" y="20" width="8" height="8" fill="currentColor" rx="1" />
        <rect x="20" y="20" width="8" height="8" fill="currentColor" rx="1" />
        <rect x="30" y="20" width="8" height="8" fill="currentColor" rx="1" />
        <rect x="40" y="20" width="8" height="8" fill="currentColor" rx="1" />
        <rect x="50" y="20" width="8" height="8" fill="currentColor" rx="1" />

        {/* Row 3 */}
        <rect x="40" y="30" width="8" height="8" fill="currentColor" rx="1" />

        {/* Row 4 */}
        <rect x="30" y="40" width="8" height="8" fill="currentColor" rx="1" />
      </svg>
    </div>
  );
}
