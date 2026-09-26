"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useSound } from "./SoundManager";
import { useHorizontalScroll } from "./HorizontalLayout";
import ScrollGuidance from "./ScrollGuidance";

interface BentoTilesSectionProps {
  scrollProgress?: number;
}

// Odometer digit strip rolling vertically on scroll with crisp clipping
function OdometerDigit({
  target,
  progress,
  className = "",
}: {
  target: number;
  progress: number;
  className?: string;
}) {
  const digits = Array.from({ length: target + 1 }, (_, i) => i % 10);
  const clampedProgress = Math.min(1, Math.max(0, progress));
  const offset = target * clampedProgress;

  return (
    <span
      className={`inline-block overflow-hidden h-[1.15em] leading-[1.15em] align-baseline ${className}`}
      style={{ verticalAlign: "baseline" }}
    >
      <span
        className="flex flex-col items-center select-none"
        style={{
          transform: `translateY(-${offset * 1.15}em)`,
          transition: "transform 0.08s ease-out",
        }}
      >
        {digits.map((d, i) => (
          <span
            key={i}
            className="h-[1.15em] leading-[1.15em] flex items-center justify-center font-mono font-bold"
          >
            {d}
          </span>
        ))}
      </span>
    </span>
  );
}

// Odometer component for stat numbers like "30+", "12+", "7+", "99.98%", "94.6%"
function CurtisOdometer({
  value,
  progress,
  className = "",
}: {
  value: string;
  progress: number;
  className?: string;
}) {
  // Once animation has settled (>= 0.95), render clean static typography to avoid any sub-pixel overlap
  if (progress >= 0.95) {
    return <span className={`inline-block font-mono font-bold leading-none ${className}`}>{value}</span>;
  }

  const match = value.match(/^([\d.]+)(.*)$/);
  if (!match) return <span className={`inline-block font-mono font-bold leading-none ${className}`}>{value}</span>;

  const numPart = match[1];
  const suffix = match[2];

  return (
    <span className={`inline-flex items-baseline font-mono font-bold tracking-tighter leading-none ${className}`}>
      {numPart.split("").map((char, idx) => {
        if (char === ".") {
          return (
            <span key={idx} className="h-[1.15em] leading-[1.15em]">
              .
            </span>
          );
        }
        const digit = parseInt(char, 10);
        return <OdometerDigit key={idx} target={digit} progress={progress} />;
      })}
      {suffix && <span className="ml-0.5">{suffix}</span>}
    </span>
  );
}

export default function BentoTilesSection({ scrollProgress: propProgress }: BentoTilesSectionProps) {
  const { playHover } = useSound();
  const { scrollProgress: ctxProgress, isDesktop } = useHorizontalScroll();
  const scrollProgress = propProgress !== undefined ? propProgress : ctxProgress;

  // Track hover on any box for the pitch black card inversion
  const [hoveredBox, setHoveredBox] = useState<string | null>(null);

  // Screen 1 progress mapped from pinned timeline [0.33, 0.39] on desktop
  const s1Progress = Math.min(1, Math.max(0, (scrollProgress - 0.32) / 0.05));

  // Screen 2 progress mapped from pinned timeline [0.42, 0.48] on desktop
  const s2Progress = Math.min(1, Math.max(0, (scrollProgress - 0.41) / 0.05));

  // Mobile scroll progress tracking so transitions occur dynamically on scroll
  const [mobileS1Progress, setMobileS1Progress] = useState(0);
  const [mobileS2Progress, setMobileS2Progress] = useState(0);
  const screen1Ref = useRef<HTMLDivElement>(null);
  const screen2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isDesktop) return;

    const onScroll = () => {
      const vh = window.innerHeight;

      if (screen1Ref.current) {
        const rect1 = screen1Ref.current.getBoundingClientRect();
        const enterStart = vh * 0.95;
        const enterEnd = vh * 0.20;
        const p1 = Math.min(1, Math.max(0, (enterStart - rect1.top) / (enterStart - enterEnd)));
        setMobileS1Progress(p1);
      }

      if (screen2Ref.current) {
        const rect2 = screen2Ref.current.getBoundingClientRect();
        const enterStart = vh * 0.95;
        const enterEnd = vh * 0.20;
        const p2 = Math.min(1, Math.max(0, (enterStart - rect2.top) / (enterStart - enterEnd)));
        setMobileS2Progress(p2);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [isDesktop]);

  const effectiveS1Progress = isDesktop ? s1Progress : mobileS1Progress;
  const effectiveS2Progress = isDesktop ? s2Progress : mobileS2Progress;

  // SCREEN 1 TILES - Exact 5-Column Staggered Layout from CV (Zero Photoshop / Illustrator!)
  const screen1Tiles = [
    {
      id: "box-1",
      type: "stat",
      col: 1,
      row: 1,
      label: "PRODUCTS SHIPPED",
      value: "30+",
      sub: "Enterprise & Venture Systems",
      delay: 0.0,
      isFeatured: false,
    },
    {
      id: "box-2",
      type: "stat",
      col: 2,
      row: 2,
      label: "YEARS OF EXP",
      value: "12+",
      sub: "Full-Stack & AI Architecture",
      delay: 0.06,
      isFeatured: false,
    },
    {
      id: "box-4",
      type: "tool-claude",
      col: 3,
      row: 1,
      label: "CLAUDE CODE",
      sub: "Agentic AI Toolchain",
      desc: "Terminal-first agentic pairing & autonomous issue-tracked development.",
      defaultSvg: "/svg/claude-default.svg",
      hoverSvg: "/svg/claude-hover.svg",
      delay: 0.12,
      isFeatured: false,
    },
    {
      id: "box-3",
      type: "stat",
      col: 3,
      row: 3,
      label: "ENTERPRISE CLIENTS",
      value: "7+",
      sub: "Fortune 500s & Scaleups",
      delay: 0.18,
      isFeatured: false,
    },
    {
      id: "box-7",
      type: "tech",
      col: 4,
      row: 2,
      label: "NODE.JS & TYPESCRIPT",
      value: "100%",
      badge: "RUNTIME",
      sub: "Event-Driven API Gateways",
      desc: "High-concurrency streaming runtimes, WebSockets & zero-downtime workers.",
      delay: 0.22,
      isFeatured: false,
    },
    {
      id: "box-5",
      type: "tech",
      col: 5,
      row: 1,
      label: "REACT & NEXT.JS",
      value: "18/15",
      badge: "WEB",
      sub: "Modern Web SPAs",
      desc: "React 18 SPAs across 16+ responsive routes & Next.js Server Components.",
      delay: 0.26,
      isFeatured: false,
    },
    {
      id: "box-8",
      type: "tech",
      col: 5,
      row: 3,
      label: "PYTHON & FASTAPI",
      value: "4 Svcs",
      badge: "API",
      sub: "Async Microservices",
      desc: "Async 4-microservice cluster (Query, Discovery, Enrichment, Publisher).",
      delay: 0.30,
      isFeatured: false,
    },
  ];

  // SCREEN 2 TILES - Continuous Second Screen covering Bilingual RAG, Kafka, React Native, Docker, K8s
  const screen2Tiles = [
    {
      id: "box-s2-1",
      type: "tech",
      col: 1,
      row: 1,
      label: "BILINGUAL RAG",
      value: "34+",
      badge: "PROD",
      sub: "Naver & Google GenAI Intents",
      desc: "34-intent bilingual RAG pipeline with hybrid BM25 + dense vector re-ranking.",
      delay: 0.0,
      isFeatured: false,
    },
    {
      id: "box-s2-8",
      type: "stat",
      col: 1,
      row: 3,
      label: "PRODUCTION SLA",
      value: "99.98%",
      sub: "Zero Incident Tolerance",
      delay: 0.06,
      isFeatured: false,
    },
    {
      id: "box-s2-2",
      type: "tech",
      col: 2,
      row: 2,
      label: "KAFKA & PGVECTOR",
      value: "10K+",
      badge: "STREAM",
      sub: "Msg/Sec Event Pipeline",
      desc: "Distributed event streaming paired with PostgreSQL pgvector semantic similarity.",
      delay: 0.12,
      isFeatured: false,
    },
    {
      id: "box-s2-3",
      type: "tech",
      col: 3,
      row: 1,
      label: "REACT NATIVE & EXPO",
      value: "iOS/And",
      badge: "MOBILE",
      sub: "Cross-Platform Mobile App",
      desc: "Solo build with Firebase auth, streaming NDJSON search, signed store releases.",
      delay: 0.18,
      isFeatured: false,
    },
    {
      id: "box-s2-4",
      type: "stat",
      col: 3,
      row: 3,
      label: "SEMANTIC ACCURACY",
      value: "94.6%",
      sub: "Intent Disambiguation",
      delay: 0.22,
      isFeatured: false,
    },
    {
      id: "box-s2-5",
      type: "tech",
      col: 4,
      row: 2,
      label: "DOCKER & K8S",
      value: "CLOUD",
      badge: "DEVOPS",
      sub: "Cloud Native Infrastructure",
      desc: "Multi-stage container builds, HPA autoscaling, Redis session caching.",
      delay: 0.26,
      isFeatured: false,
    },
    {
      id: "box-s2-6",
      type: "tech",
      col: 5,
      row: 1,
      label: "AGENTIC WORKFLOWS",
      value: "AI-1st",
      badge: "VELOCITY",
      sub: "Autonomous Dev Sessions",
      desc: "Pairing Claude Code with issue-tracked sessions to ship solo at team speed.",
      delay: 0.28,
      isFeatured: false,
    },
    {
      id: "box-s2-7",
      type: "tech",
      col: 5,
      row: 3,
      label: "CI/CD & QUALITY",
      value: "0-FAIL",
      badge: "MONOREPO",
      sub: "Automated Verification",
      desc: "Jenkins, SonarQube, Pyright strict type checking, and Turborepo monorepos.",
      delay: 0.30,
      isFeatured: false,
    },
  ];

  // Helper function to render a tile in the exact Curtis geometric notch style
  const renderCurtisTile = (tile: any, screenProgress: number, isMobile = false) => {
    const isHovered = hoveredBox === tile.id;

    // Fast-loading aperture animation that triggers smoothly on both mobile & desktop
    const delay = isMobile ? tile.delay * 0.4 : tile.delay;
    const tProgress = Math.min(1, Math.max(0, (screenProgress - delay) / 0.22));
    const oh = Math.min(1, Math.max(0, tProgress / 0.45));
    const ow = Math.min(1, Math.max(0, (tProgress - 0.20) / 0.80));
    const odoProg = Math.min(1, Math.max(0, (tProgress - 0.20) / 0.80));

    // Custom CSS grid position classes for desktop 5-column alternating chessboard
    const colClasses: Record<number, string> = {
      1: "lg:left-[2.5%]",
      2: "lg:left-[22%]",
      3: "lg:left-[41.5%]",
      4: "lg:left-[61%]",
      5: "lg:left-[80.5%]",
    };

    const rowClasses: Record<number, string> = {
      1: "lg:top-[1.75rem]",
      2: "lg:top-[calc(1.75rem+25vh)]",
      3: "lg:top-[calc(1.75rem+50vh)]",
    };

    const desktopPos = `${colClasses[tile.col]} ${rowClasses[tile.row]}`;

    return (
      <div
        key={tile.id}
        onClick={() => {
          setHoveredBox(hoveredBox === tile.id ? null : tile.id);
          playHover();
        }}
        onTouchStart={() => {
          setHoveredBox(tile.id);
          playHover();
        }}
        onMouseEnter={() => {
          setHoveredBox(tile.id);
          playHover();
        }}
        onMouseLeave={() => setHoveredBox(null)}
        className={
          isMobile
            ? "stat-box group relative w-full h-[142px] min-h-[135px] select-none cursor-pointer transition-all duration-200"
            : `stat-box group absolute w-[92vw] sm:w-[45vw] lg:w-[17.5vw] h-[22vh] min-h-[135px] max-h-[175px] select-none cursor-pointer transition-all duration-200 ${desktopPos}`
        }
        style={{
          // Curtis exact aperture reveal formula (unfolds clip-path as user scrolls):
          clipPath: `inset(calc((1 - ${oh}) * 50%) calc((1 - ${ow}) * (100% - 1px)) calc((1 - ${oh}) * 50%) 0)`,
          willChange: "clip-path, transform",
        }}
      >
        {/* Outer Notch Border Stroke: Olive green by default, Pitch Black on Hover */}
        <div
          className={`absolute inset-0 transition-colors duration-200 ${
            isHovered ? "bg-[#000000]" : "bg-[#599f00] group-hover:bg-[#000000]"
          }`}
          style={{
            clipPath:
              "polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 125px, 11.71px 113px, 11.71px 52px, 0 40px)",
          }}
        >
          {/* Inner Notch Box Fill (inset 2px): Olive green by default, Pure Black on Hover */}
          <div
            className={`absolute inset-[2px] ${isMobile ? "p-2.5 sm:p-3" : "p-3.5"} flex flex-col justify-between transition-colors duration-200 ${
              isHovered
                ? "bg-[#0a0a0a] text-white shadow-2xl"
                : "bg-[#84c72f] text-[#0a0a0a] group-hover:bg-[#0a0a0a] group-hover:text-white group-hover:shadow-2xl"
            }`}
            style={{
              clipPath:
                "polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 125px, 11.71px 113px, 11.71px 52px, 0 40px)",
            }}
          >
            {/* Top-Left Illuminated Triangular Fold (Neon Green on Hover) */}
            <div
              className={`absolute top-0 left-0 w-4 h-4 bg-[#9df133] transition-opacity duration-200 pointer-events-none ${
                isHovered ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              }`}
              style={{
                clipPath: "polygon(0 0, 100% 0, 0 100%)",
              }}
            />

            {/* Top Right Label */}
            <div className="flex items-start justify-end w-full">
              <span
                className={`font-mono ${isMobile ? "text-[8.5px] sm:text-[10px]" : "text-[10px] sm:text-[11px]"} font-black tracking-widest uppercase text-right leading-tight transition-colors duration-200 ${
                  isHovered ? "text-white/95" : "text-[#0a0a0a]/90 group-hover:text-white/95"
                }`}
              >
                {tile.label}
              </span>
            </div>

            {/* Bottom Content: Stat Numbers OR AI / Tech Card */}
            <div className="mt-auto w-full flex items-end justify-between">
              {/* Stat Value with Odometer */}
              {tile.type === "stat" && (
                <div className="flex flex-col">
                  <div
                    className={`${isMobile ? "text-2xl sm:text-4xl" : "text-4xl sm:text-5xl lg:text-[3.5rem]"} font-bold font-mono tracking-tighter leading-none transition-colors duration-200 ${
                      isHovered ? "text-white" : "text-[#0a0a0a] group-hover:text-white"
                    }`}
                  >
                    <CurtisOdometer value={tile.value} progress={odoProg} />
                  </div>
                  {tile.sub && (
                    <span
                      className={`font-mono ${isMobile ? "text-[8px] sm:text-[9px]" : "text-[9px] sm:text-[10px]"} uppercase tracking-wider mt-0.5 sm:mt-1 transition-colors duration-200 font-bold ${
                        isHovered ? "text-white/70" : "text-[#0a0a0a]/70 group-hover:text-white/70"
                      }`}
                    >
                      {tile.sub}
                    </span>
                  )}
                </div>
              )}

              {/* Claude Code Tool Tile with Authentic Vector Starburst */}
              {tile.type === "tool-claude" && (
                <div className="flex items-end justify-between w-full">
                  <div className="flex flex-col pr-1 sm:pr-2">
                    <span
                      className={`font-mono ${isMobile ? "text-[8px] sm:text-[9px]" : "text-[9px] sm:text-[10px]"} uppercase tracking-wider font-black mb-0.5 ${
                        isHovered ? "text-[#9df133]" : "text-[#0a0a0a] group-hover:text-[#9df133]"
                      }`}
                    >
                      {tile.sub}
                    </span>
                    <p
                      className={`text-[8.5px] sm:text-[9.5px] leading-tight font-sans line-clamp-2 ${
                        isHovered ? "text-white/80" : "text-[#0a0a0a]/80 group-hover:text-white/80"
                      }`}
                    >
                      {tile.desc}
                    </p>
                  </div>
                  <div className={`relative ${isMobile ? "w-9 h-9 sm:w-12 sm:h-12" : "w-12 h-12 sm:w-14 sm:h-14"} shrink-0 flex items-center justify-center`}>
                    <Image
                      src={tile.defaultSvg}
                      alt={tile.label}
                      width={56}
                      height={56}
                      className={`object-contain transition-opacity duration-200 ${
                        isHovered ? "opacity-0" : "opacity-100 group-hover:opacity-0"
                      }`}
                    />
                    <Image
                      src={tile.hoverSvg}
                      alt={`${tile.label} Hover`}
                      width={56}
                      height={56}
                      className={`object-contain absolute inset-0 transition-opacity duration-200 ${
                        isHovered ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                      }`}
                    />
                  </div>
                </div>
              )}

              {/* Tech Cards (Node.js, Docker, RAG, Python, Kafka, React Native) */}
              {(tile.type === "tech" || tile.type === "tech-featured") && (
                <div className="flex flex-col w-full pr-1">
                  <div className="flex items-baseline justify-between mb-0.5 sm:mb-1">
                    <span
                      className={`${isMobile ? "text-xl sm:text-2xl" : "text-2xl sm:text-3xl"} font-black font-mono tracking-tight leading-none ${
                        isHovered ? "text-white" : "text-[#0a0a0a] group-hover:text-white"
                      }`}
                    >
                      <CurtisOdometer value={tile.value} progress={odoProg} />
                    </span>
                    {tile.badge && (
                      <span
                        className={`font-mono ${isMobile ? "text-[8px]" : "text-[9px]"} uppercase px-1 py-0.5 rounded font-black ${
                          isHovered
                            ? "bg-[#9df133] text-[#050505]"
                            : "bg-[#0a0a0a] text-[#9df133] group-hover:bg-[#9df133] group-hover:text-[#050505]"
                        }`}
                      >
                        {tile.badge}
                      </span>
                    )}
                  </div>
                  <p
                    className={`text-[8.5px] sm:text-[9.5px] leading-tight font-sans line-clamp-2 transition-colors duration-200 ${
                      isHovered ? "text-white/85" : "text-[#0a0a0a]/85 group-hover:text-white/85"
                    }`}
                  >
                    {tile.desc}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section
      id="capabilities-tiles"
      className="relative w-full lg:w-[200vw] h-auto lg:h-screen shrink-0 bg-[#9df133] text-[#0a0a0a] flex flex-col lg:flex-row select-none overflow-visible lg:overflow-hidden"
    >
      {/* 6 Vertical Guidelines across Screen 1 & 2 (Desktop only) */}
      <div className="hidden lg:flex absolute inset-0 justify-between pointer-events-none z-0">
        <div className="w-px h-full bg-[#599f00]/30" />
        <div className="w-px h-full bg-[#599f00]/25" />
        <div className="w-px h-full bg-[#599f00]/25" />
        <div className="w-px h-full bg-[#599f00]/25" />
        <div className="w-px h-full bg-[#599f00]/25" />
        <div className="w-px h-full bg-[#599f00]/30" />
        <div className="w-px h-full bg-[#599f00]/25" />
        <div className="w-px h-full bg-[#599f00]/25" />
        <div className="w-px h-full bg-[#599f00]/25" />
        <div className="w-px h-full bg-[#599f00]/25" />
        <div className="w-px h-full bg-[#599f00]/30" />
      </div>

      {/* ========================================================================= */}
      {/* SCREEN 1: Authentic Curtis 5-Column Staggered Chessboard                  */}
      {/* ========================================================================= */}
      <div ref={screen1Ref} className="relative w-full lg:w-screen h-auto lg:h-screen shrink-0 flex flex-col justify-between p-4 sm:p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-[#599f00]/30 z-10">
        {/* Top Header Bar (Matching Curtis telemetry) */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between font-mono text-[11px] font-bold uppercase tracking-wider text-[#0a0a0a] pb-2.5 border-b-2 border-[#599f00]/40 gap-2">
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-[#0a0a0a]">
              <polygon points="12 2 22 20 2 20" stroke="currentColor" strokeWidth="2.5" fill="none" />
            </svg>
            <span className="font-black tracking-widest text-xs">SHIVANG CHAUHAN</span>
          </div>

          <div className="hidden sm:flex items-center gap-6 text-[#0a0a0a]/75 text-[10px] font-bold">
            <span>BANGALORE &bull; SEOUL REMOTE</span>
            <span>12+ YRS ARCHITECTURE</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded bg-[#0a0a0a] text-[#9df133] text-[10px] font-mono font-black shadow-sm">
              SCREEN 1 OF 2 &middot; CORE CAPABILITIES
            </span>
          </div>
        </div>

        {/* Screen 1 Canvas Area for Desktop (5 Alternating Staggered Columns) */}
        <div className="relative w-full h-[calc(100vh-8.5rem)] my-auto hidden lg:block">
          {screen1Tiles.map((tile) => renderCurtisTile(tile, effectiveS1Progress, false))}

          {/* Freestanding Monochrome Pixel Art Pyramid in Column 1, Row 3 */}
          <div
            className="absolute lg:left-[2.5%] lg:top-[calc(1.75rem+50vh)] w-[92vw] sm:w-[45vw] lg:w-[17.5vw] h-[22vh] min-h-[135px] max-h-[175px] flex flex-col items-center justify-center pointer-events-none transition-transform duration-300"
            style={{
              transform: `scale(${Math.min(1, Math.max(0, effectiveS1Progress * 1.8))})`,
              opacity: Math.min(1, Math.max(0, effectiveS1Progress * 2.2)),
            }}
          >
            <CurtisPixelPyramid />
            <span className="font-mono text-[9px] font-black text-[#0a0a0a] mt-2 uppercase tracking-widest">
              // AGENTIC AI CORE
            </span>
          </div>
        </div>

        {/* Screen 1 Grid Area for Mobile & Tablet (< 1024px) */}
        <div className="relative w-full block lg:hidden my-4 sm:my-6">
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 w-full">
            {screen1Tiles.map((tile) => renderCurtisTile(tile, effectiveS1Progress, true))}

            {/* Freestanding Pixel Pyramid inside 2-Column Mobile Grid in Row 4, Col 2 (Matching Curtis Reference) */}
            <div
              className="stat-box relative w-full h-[142px] min-h-[135px] flex flex-col items-center justify-center p-2.5 sm:p-3 select-none"
              style={{
                transform: `scale(${Math.min(1, Math.max(0.75, effectiveS1Progress * 1.2))})`,
                opacity: Math.min(1, Math.max(0.4, effectiveS1Progress * 1.5)),
                transition: "transform 0.3s ease-out, opacity 0.3s ease-out",
              }}
            >
              <CurtisPixelPyramid />
              <span className="font-mono text-[8.5px] sm:text-[9px] font-black text-[#0a0a0a] mt-2 uppercase tracking-widest text-center">
                // AGENTIC AI CORE
              </span>
            </div>
          </div>

          {/* Small Scroll Guidance on Mobile */}
          <div className="flex justify-center mt-5 mb-1 pointer-events-none">
            <ScrollGuidance label="KEEP SCROLLING" theme="light" />
          </div>
        </div>

        {/* Bottom Continuity Banner */}
        <div className="flex items-center justify-between font-mono text-[11px] font-bold text-[#0a0a0a] pt-2 border-t-2 border-[#599f00]/40">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#0a0a0a] animate-ping" />
            <span>CONTINUOUS CAPABILITIES RUNTIME</span>
          </span>
          <span className="tracking-widest flex items-center gap-2">
            <span className="hidden sm:inline">SCROLL TO GLIDE INTO RAG, KAFKA &amp; BACKEND RUNTIMES</span>
            <span className="text-[#0a0a0a] font-black">&rarr;</span>
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SCREEN 2: Continuous Second Screen: Advanced AI, RAG, Kafka, K8s           */}
      {/* ========================================================================= */}
      <div ref={screen2Ref} className="relative w-full lg:w-screen h-auto lg:h-screen shrink-0 flex flex-col justify-between p-4 sm:p-8 lg:p-10 z-10 mt-8 lg:mt-0">
        {/* Top Header Bar */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between font-mono text-[11px] font-bold uppercase tracking-wider text-[#0a0a0a] pb-2.5 border-b-2 border-[#599f00]/40 gap-2">
          <div className="flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-[#0a0a0a]">
              <polygon points="12 2 22 20 2 20" stroke="currentColor" strokeWidth="2.5" fill="none" />
            </svg>
            <span className="font-black tracking-widest text-xs">SHIVANG CHAUHAN</span>
          </div>

          <div className="hidden sm:flex items-center gap-6 text-[#0a0a0a]/75 text-[10px] font-bold">
            <span>BILINGUAL RAG &bull; DISTRIBUTED PIPELINES &bull; CLOUD NATIVE</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded bg-[#0a0a0a] text-[#9df133] text-[10px] font-mono font-black shadow-sm">
              SCREEN 2 OF 2 &middot; DISTRIBUTED SYSTEMS
            </span>
          </div>
        </div>

        {/* Screen 2 Canvas Area for Desktop */}
        <div className="relative w-full h-[calc(100vh-8.5rem)] my-auto hidden lg:block">
          {screen2Tiles.map((tile) => renderCurtisTile(tile, effectiveS2Progress, false))}
        </div>

        {/* Screen 2 Grid Area for Mobile & Tablet (< 1024px) */}
        <div className="relative w-full block lg:hidden my-4 sm:my-6">
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3.5 w-full">
            {screen2Tiles.map((tile) => renderCurtisTile(tile, effectiveS2Progress, true))}
          </div>

          {/* Small Scroll Guidance on Mobile */}
          <div className="flex justify-center mt-5 mb-1 pointer-events-none">
            <ScrollGuidance label="KEEP SCROLLING FOR PRODUCTS" theme="light" />
          </div>
        </div>

        {/* Bottom Status Cue */}
        <div className="flex items-center justify-between font-mono text-[11px] font-bold text-[#0a0a0a] pt-2 border-t-2 border-[#599f00]/40">
          <span>END OF CAPABILITIES TRACK</span>
          <span className="tracking-widest flex items-center gap-2 font-bold">
            <span>CONTINUE SCROLLING FOR SELECTED ENTERPRISE PRODUCTS</span>
            <span className="font-black">&rarr;</span>
          </span>
        </div>
      </div>
    </section>
  );
}

// Authentic Curtis Freestanding Monochrome Pixel Art Pyramid
function CurtisPixelPyramid() {
  const pixelGrid = [
    [0, 0, 0, 1, 0, 0, 0],
    [0, 0, 1, 0, 1, 0, 0],
    [0, 1, 0, 0, 0, 1, 0],
    [1, 0, 0, 1, 0, 0, 1],
    [0, 1, 1, 0, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1],
  ];

  return (
    <svg
      width="64"
      height="56"
      viewBox="0 0 7 6"
      className="text-[#0a0a0a] drop-shadow-[0_2px_8px_rgba(0,0,0,0.25)]"
    >
      {pixelGrid.map((row, r) =>
        row.map((val, c) =>
          val ? (
            <rect
              key={`${r}-${c}`}
              x={c}
              y={r}
              width="0.84"
              height="0.84"
              fill="currentColor"
              rx="0.1"
            />
          ) : null
        )
      )}
    </svg>
  );
}
