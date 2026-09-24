"use client";

import React, { useMemo } from "react";

interface ScrollScrambleQuoteProps {
  quote?: string;
  scrollProgress: number; // 0.0 to 1.0 (local or global)
  startThreshold?: number; // when unscrambling starts (e.g. 0.01)
  endThreshold?: number; // when unscrambling finishes (e.g. 0.12)
  className?: string;
}

const GLYPHS = "01$#_[]{}—=+*^?~<>!/\\X#%";

export default function ScrollScrambleQuote({
  quote = "I Solve problems and take Ownership",
  scrollProgress,
  startThreshold = 0.01,
  endThreshold = 0.12,
  className = "",
}: ScrollScrambleQuoteProps) {
  // Compute normalized progress between startThreshold and endThreshold
  const ratio = useMemo(() => {
    if (scrollProgress <= startThreshold) return 0;
    if (scrollProgress >= endThreshold) return 1;
    return (scrollProgress - startThreshold) / (endThreshold - startThreshold);
  }, [scrollProgress, startThreshold, endThreshold]);

  // Generate scrambled or resolved string based on scroll ratio
  const renderedChars = useMemo(() => {
    const chars = quote.split("");
    const totalChars = chars.length;
    const resolvedCount = Math.floor(ratio * totalChars);

    return chars.map((char, idx) => {
      if (char === " " || char === "\n") {
        return { char, isResolved: true };
      }
      if (idx < resolvedCount) {
        return { char, isResolved: true };
      }
      // Scrambled glyph seeded semi-consistently
      const seedIndex = (idx * 7 + Math.floor(scrollProgress * 100)) % GLYPHS.length;
      return { char: GLYPHS[seedIndex], isResolved: false };
    });
  }, [quote, ratio, scrollProgress]);

  return (
    <div className={`font-mono transition-all duration-100 ${className}`}>
      <span className="text-[#9df133] mr-2 text-xs select-none">&gt;&gt;</span>
      {renderedChars.map((item, i) => (
        <span
          key={i}
          className={`transition-colors duration-150 ${
            item.isResolved
              ? "text-white/95"
              : "text-[#9df133] drop-shadow-[0_0_6px_rgba(157,241,51,0.8)] font-bold animate-pulse"
          }`}
        >
          {item.char}
        </span>
      ))}
      {ratio < 1 && (
        <span className="inline-block w-2 h-4 ml-1 bg-[#9df133] animate-ping align-middle" />
      )}
    </div>
  );
}
