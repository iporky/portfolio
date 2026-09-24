"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface GlitchPortraitProps {
  className?: string;
}

export default function GlitchPortrait({ className = "" }: GlitchPortraitProps) {
  const [isGlitching, setIsGlitching] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const animFrameRef = useRef<number | null>(null);

  // 1. Periodic Glitch Effect (triggers every 3.5s for 320ms, matching curtisdesignr.me)
  useEffect(() => {
    const triggerGlitch = () => {
      setIsGlitching(true);
      setTimeout(() => {
        setIsGlitching(false);
      }, 340);
    };

    const interval = setInterval(() => {
      // Randomize interval slightly around 3.5 seconds
      triggerGlitch();
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  // 2. Interactive Fluid Distortion on Mouse Hover
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x, y });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative select-none pointer-events-auto ${className}`}
      style={{
        maskImage: "linear-gradient(to bottom, black 50%, rgba(0,0,0,0.6) 75%, transparent 98%)",
        WebkitMaskImage: "linear-gradient(to bottom, black 50%, rgba(0,0,0,0.6) 75%, transparent 98%)",
      }}
    >
      {/* Hidden SVG Fluid Filter definition */}
      <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
        <defs>
          <filter id="fluid-ripple">
            <feTurbulence
              type="fractalNoise"
              baseFrequency={isHovered ? "0.015 0.02" : "0.005 0.005"}
              numOctaves="2"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={isHovered ? 14 : 0}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Main Freestanding Portrait */}
      <div
        className={`relative w-full h-full transition-transform duration-300 ${
          isHovered ? "scale-[1.02]" : "scale-100"
        }`}
        style={{
          filter: isHovered ? "url(#fluid-ripple)" : "none",
        }}
      >
        {/* Base Layer with Moody Low-Key Contrast */}
        <div className="relative w-full h-full">
          <Image
            src="/portrait.webp"
            alt="Shivang Chauhan - Lead Full-Stack Architect"
            fill
            className={`object-cover object-top transition-all duration-300 filter contrast-130 brightness-70 ${
              isGlitching ? "opacity-35" : "opacity-100"
            }`}
            sizes="(max-width: 768px) 100vw, 550px"
            priority
          />
        </div>

        {/* Deep Black Low-Key Wash (Blacker appearance matching user request) */}
        <div className="absolute inset-0 bg-[#050505]/50 pointer-events-none mix-blend-multiply" />
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 48% 36%, transparent 15%, rgba(5,5,5,0.72) 58%, #050505 95%)",
          }}
        />
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to bottom, rgba(5,5,5,0.45) 0%, transparent 20%, transparent 55%, rgba(5,5,5,0.92) 88%, #050505 100%)",
          }}
        />
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(to right, #050505 0%, transparent 12%, transparent 88%, #050505 100%)",
          }}
        />

        {/* Glitch RGB-Shift Layer 1 (Neon Green / Magenta Slice) */}
        {isGlitching && (
          <>
            <div
              className="absolute inset-0 pointer-events-none mix-blend-screen opacity-80"
              style={{
                transform: "translate(-4px, 2px)",
                filter: "drop-shadow(2px 0 0 #ff0055)",
                clipPath: "polygon(0 15%, 100% 15%, 100% 35%, 0 35%)",
              }}
            >
              <Image
                src="/portrait.webp"
                alt="Glitch Red"
                fill
                className="object-cover object-top contrast-150 brightness-70 filter hue-rotate-90"
                priority
              />
            </div>

            <div
              className="absolute inset-0 pointer-events-none mix-blend-screen opacity-80"
              style={{
                transform: "translate(3px, -2px)",
                filter: "drop-shadow(-2px 0 0 #9df133)",
                clipPath: "polygon(0 55%, 100% 55%, 100% 75%, 0 75%)",
              }}
            >
              <Image
                src="/portrait.webp"
                alt="Glitch Green"
                fill
                className="object-cover object-top contrast-150 brightness-70 filter invert"
                priority
              />
            </div>

            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                transform: "translate(2px, 1px)",
                clipPath: "polygon(0 40%, 100% 40%, 100% 48%, 0 48%)",
              }}
            >
              <Image
                src="/portrait.webp"
                alt="Glitch Slice"
                fill
                className="object-cover object-top contrast-175 brightness-70"
                priority
              />
            </div>
          </>
        )}

        {/* Tightly Spaced Display Pixels (Ultra-dense 2.5px monochrome dots resembling raw screen pixels) */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30 mix-blend-overlay"
          style={{
            backgroundImage: "radial-gradient(rgba(255, 255, 255, 0.45) 0.5px, transparent 0.5px)",
            backgroundSize: "2.5px 2.5px",
          }}
        />

        {/* Dense Horizontal Pixel Scanline Texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-35 mix-blend-multiply"
          style={{
            backgroundImage: "repeating-linear-gradient(to bottom, rgba(0, 0, 0, 0.75) 0px, rgba(0, 0, 0, 0.75) 1px, transparent 1px, transparent 2px)",
          }}
        />

        {/* Horizontal Neon Glitch Line */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div
            className={`w-full h-1 bg-gradient-to-r from-transparent via-[#9df133]/50 to-transparent transition-all duration-700 ${
              isGlitching ? "opacity-100 top-1/3" : "opacity-0 top-0"
            }`}
            style={{ position: "absolute" }}
          />
        </div>

        {/* Fluid hover cursor light tracker */}
        {isHovered && (
          <div
            className="absolute w-48 h-48 rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 blur-2xl opacity-25 transition-opacity bg-[#9df133]"
            style={{
              left: `${mousePos.x * 100}%`,
              top: `${mousePos.y * 100}%`,
            }}
          />
        )}
      </div>
    </div>
  );
}
