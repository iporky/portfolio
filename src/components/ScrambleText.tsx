"use client";

import React, { useState, useEffect, useRef } from "react";

interface ScrambleTextProps {
  text: string;
  className?: string;
  scrambleColor?: string;
  triggerOnView?: boolean;
  speed?: number;
  delay?: number;
}

const GLYPHS = "01$#_[]{}—=+*^?~<>!/\\X#%";

export default function ScrambleText({
  text,
  className = "",
  scrambleColor = "#9df133",
  triggerOnView = true,
  speed = 30,
  delay = 0,
}: ScrambleTextProps) {
  const [displayText, setDisplayText] = useState<string>(text);
  const [isScrambling, setIsScrambling] = useState<boolean>(false);
  const containerRef = useRef<HTMLSpanElement>(null);
  const hasAnimatedRef = useRef<boolean>(false);

  const startScramble = () => {
    if (isScrambling) return;
    setIsScrambling(true);

    const length = text.length;
    let iteration = 0;
    const maxIterations = length + 8;

    const interval = setInterval(() => {
      setDisplayText(() => {
        return text
          .split("")
          .map((char, index) => {
            if (char === " " || char === "\n") return char;
            if (index < iteration - 2) {
              return text[index];
            }
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join("");
      });

      iteration += 1 / 2;

      if (iteration >= maxIterations) {
        clearInterval(interval);
        setDisplayText(text);
        setIsScrambling(false);
      }
    }, speed);
  };

  useEffect(() => {
    if (!triggerOnView) {
      const timer = setTimeout(startScramble, delay);
      return () => clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimatedRef.current) {
            hasAnimatedRef.current = true;
            setTimeout(startScramble, delay);
          }
        });
      },
      { threshold: 0.1 }
    );

    const el = containerRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [text, triggerOnView, delay]);

  return (
    <span
      ref={containerRef}
      onMouseEnter={() => {
        if (!isScrambling) startScramble();
      }}
      className={`inline-block transition-colors duration-150 cursor-default ${className} ${
        isScrambling ? "text-[#9df133] drop-shadow-[0_0_8px_rgba(157,241,51,0.6)]" : ""
      }`}
    >
      {displayText}
    </span>
  );
}
