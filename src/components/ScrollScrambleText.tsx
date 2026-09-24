"use client";

import React, { useMemo } from "react";

interface ScrollScrambleTextProps {
  text: string;
  scrollProgress: number;
  startThreshold?: number;
  endThreshold?: number;
  className?: string;
  prefix?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
}

const GLYPHS = "01$#_[]{}—=+*^?~<>!/\\X#%";

export default function ScrollScrambleText({
  text,
  scrollProgress,
  startThreshold = 0.0,
  endThreshold = 0.1,
  className = "",
  prefix = "",
  as: Component = "span",
}: ScrollScrambleTextProps) {
  const result = useMemo(() => {
    // If before start threshold, hide completely
    if (scrollProgress < startThreshold) {
      return {
        hidden: true,
        display: "",
        resolvedIndex: 0,
      };
    }

    // Normalized progress in [0, 1]
    const progress = Math.min(
      1,
      Math.max(0, (scrollProgress - startThreshold) / (endThreshold - startThreshold))
    );

    const totalChars = text.length;
    // Number of characters resolved
    const resolvedIndex = Math.floor(progress * totalChars);

    if (progress >= 1) {
      return {
        hidden: false,
        display: text,
        resolvedIndex: totalChars,
      };
    }

    let scrambled = "";
    for (let i = 0; i < totalChars; i++) {
      if (text[i] === " " || text[i] === "\n") {
        scrambled += text[i];
      } else if (i < resolvedIndex) {
        scrambled += text[i];
      } else {
        // Pseudo-random glyph seeded deterministically
        const charCode = text.charCodeAt(i) + i + Math.floor(progress * 50);
        scrambled += GLYPHS[charCode % GLYPHS.length];
      }
    }

    return {
      hidden: false,
      display: scrambled,
      resolvedIndex,
    };
  }, [text, scrollProgress, startThreshold, endThreshold]);

  if (result.hidden) {
    return (
      <Component className={`${className} opacity-0 pointer-events-none transition-opacity duration-200`}>
        {prefix}
        {text}
      </Component>
    );
  }

  const isFullyResolved = result.resolvedIndex >= text.length;

  return (
    <Component className={`${className} transition-opacity duration-200`}>
      {prefix && <span className="text-[#9df133] mr-2">{prefix}</span>}
      <span className={isFullyResolved ? "" : "text-[#9df133] font-mono drop-shadow-[0_0_8px_rgba(157,241,51,0.4)]"}>
        {result.display}
      </span>
      {!isFullyResolved && (
        <span className="inline-block w-2 h-4 ml-1 bg-[#9df133] animate-pulse align-middle" />
      )}
    </Component>
  );
}
