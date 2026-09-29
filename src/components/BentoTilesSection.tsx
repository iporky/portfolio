"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion, type TargetAndTransition, type Transition } from "framer-motion";
import { useSound } from "./SoundManager";
import { useHorizontalScroll } from "./HorizontalLayout";
import ScrollGuidance from "./ScrollGuidance";
import CurtisOdometer from "./CurtisOdometer";

interface BentoTilesSectionProps {
  scrollProgress?: number;
}

export default function BentoTilesSection({ scrollProgress: propProgress }: BentoTilesSectionProps) {
  const { playHover, playClick } = useSound();
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

  // -------------------------------------------------------------------------
  // Gravity toggle. Every tile keeps its scroll-driven aperture reveal, but
  // once gravity is on it drops to the floor of its grid, landing on whichever
  // tile of the same column is below it, with a small bounce and tilt. Off
  // again floats everything back. Desktop tiles fall inside their absolute
  // canvas area; phone tiles fall into the drop room padded under each grid.
  // -------------------------------------------------------------------------
  type FallTarget = { y: number; x: number; rotate: number; duration: number };
  type TileSlot = { id: string; col: number; row: number };
  const STACK_GAP = 6;

  const [gravityOn, setGravityOn] = useState(false);
  const [fallTargets, setFallTargets] = useState<Record<string, FallTarget>>({});
  const [mobileFallTargets, setMobileFallTargets] = useState<Record<string, FallTarget>>({});
  // The desktop canvas and the phone grid both render every tile id, so each
  // layout keeps its own element map.
  const tileRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const mobileTileRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const s1AreaRef = useRef<HTMLDivElement>(null);
  const s2AreaRef = useRef<HTMLDivElement>(null);
  const m1GridRef = useRef<HTMLDivElement>(null);
  const m2GridRef = useRef<HTMLDivElement>(null);

  // Phone grid: two columns, tiles in array order (the lever sits on its own
  // row above them, so it is not in any column's path).
  const mobileSlots = (tiles: { id: string }[]): TileSlot[] =>
    tiles.map((t, i) => ({ id: t.id, col: (i % 2) + 1, row: Math.floor(i / 2) + 1 }));

  const computeFall = (
    tiles: TileSlot[],
    area: HTMLDivElement | null,
    refs: Record<string, HTMLDivElement | null>,
    targets: Record<string, FallTarget>
  ) => {
    // A hidden layout (display: none) measures as 0 and contributes nothing.
    if (!area || area.clientHeight === 0) return;
    // offsetTop / offsetHeight are layout values, so a tile mid-animation
    // still measures from its grid position. `area` is the offsetParent.
    const floor = area.clientHeight;
    tiles.forEach((tile) => {
      const el = refs[tile.id];
      if (!el) return;
      const below = tiles.filter((t) => t.col === tile.col && t.row > tile.row).length;
      const floorTop = floor - el.offsetHeight * (below + 1) - STACK_GAP * below;
      const drop = Math.max(0, floorTop - el.offsetTop);
      const dir = tile.col % 2 === 0 ? 1 : -1;
      // Tiles resting on the floor sit almost flat; tiles landing on top tilt.
      const tilt =
        below === 0 ? dir * (0.6 + (tile.row % 3) * 0.5) : dir * (2.5 + ((tile.col * 7 + tile.row * 3) % 4));
      targets[tile.id] = {
        y: drop,
        x: dir * (2 + (tile.row % 3) * 2),
        rotate: tilt,
        duration: 0.45 + drop / 1300,
      };
    });
  };

  const toggleGravity = () => {
    playClick();
    if (gravityOn) {
      setGravityOn(false);
      return;
    }
    const desktop: Record<string, FallTarget> = {};
    computeFall(screen1Tiles.map((t) => ({ id: t.id, col: t.col, row: t.row })), s1AreaRef.current, tileRefs.current, desktop);
    computeFall(screen2Tiles.map((t) => ({ id: t.id, col: t.col, row: t.row })), s2AreaRef.current, tileRefs.current, desktop);
    const mobile: Record<string, FallTarget> = {};
    computeFall(mobileSlots(screen1Tiles), m1GridRef.current, mobileTileRefs.current, mobile);
    computeFall(mobileSlots(screen2Tiles), m2GridRef.current, mobileTileRefs.current, mobile);
    setFallTargets(desktop);
    setMobileFallTargets(mobile);
    setGravityOn(true);
  };

  // Motion props per tile, memoised so scroll re-renders hand framer-motion
  // the same objects and never restart a fall in progress.
  const tileMotion = useMemo(() => {
    const restTransition: Transition = { type: "spring", stiffness: 80, damping: 15, mass: 1 };
    const rest: { animate: TargetAndTransition; transition: Transition } = {
      animate: { y: 0, x: 0, rotate: 0 },
      transition: restTransition,
    };
    const build = (targets: Record<string, FallTarget>) => {
      const map: Record<string, { animate: TargetAndTransition; transition: Transition }> = {};
      Object.entries(targets).forEach(([id, fall]) => {
        const bounce = Math.max(8, fall.y * 0.07);
        map[id] = {
          animate: {
            y: [null, fall.y, fall.y - bounce, fall.y],
            x: fall.x,
            rotate: [null, fall.rotate * 0.4, fall.rotate],
          },
          transition: {
            y: { duration: fall.duration, times: [0, 0.6, 0.8, 1], ease: ["easeIn", "easeOut", "easeIn"] },
            rotate: { duration: fall.duration, ease: "easeOut" },
            x: { duration: fall.duration, ease: "easeOut" },
          },
        };
      });
      return map;
    };
    return { rest, map: build(fallTargets), mobileMap: build(mobileFallTargets) };
  }, [fallTargets, mobileFallTargets]);

  const motionFor = (id: string) => (gravityOn && tileMotion.map[id] ? tileMotion.map[id] : tileMotion.rest);
  const mobileMotionFor = (id: string) =>
    gravityOn && tileMotion.mobileMap[id] ? tileMotion.mobileMap[id] : tileMotion.rest;

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

    const tileMotionProps = isMobile ? mobileMotionFor(tile.id) : motionFor(tile.id);

    return (
      <motion.div
        key={tile.id}
        ref={(el: HTMLDivElement | null) => {
          (isMobile ? mobileTileRefs : tileRefs).current[tile.id] = el;
        }}
        initial={false}
        {...tileMotionProps}
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
            ? "stat-box group relative w-full h-[120px] min-h-[116px] select-none cursor-pointer"
            : `stat-box group absolute w-[92vw] sm:w-[45vw] lg:w-[17.5vw] h-[22vh] min-h-[135px] max-h-[175px] select-none cursor-pointer ${desktopPos}`
        }
        style={{
          // Curtis exact aperture reveal formula (unfolds clip-path as user scrolls):
          clipPath: `inset(calc((1 - ${oh}) * 50%) calc((1 - ${ow}) * (100% - 1px)) calc((1 - ${oh}) * 50%) 0)`,
          willChange: "clip-path, transform",
        }}
      >
        {/* Outer Notch Border Stroke: Mustard yellow by default, Pitch Black on Hover */}
        <div
          className={`absolute inset-0 transition-colors duration-200 ${
            isHovered ? "bg-[#000000]" : "bg-[#a09400] group-hover:bg-[#000000]"
          }`}
          style={{
            clipPath:
              "polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 125px, 11.71px 113px, 11.71px 52px, 0 40px)",
          }}
        >
          {/* Inner Notch Box Fill (inset 2px): Mustard yellow by default, Pure Black on Hover */}
          <div
            className={`absolute inset-[2px] ${isMobile ? "p-3.5 pl-6 sm:p-4 sm:pl-6" : "p-4 pl-5"} flex flex-col justify-between transition-colors duration-200 ${
              isHovered
                ? "bg-[#0a0a0a] text-white shadow-2xl"
                : "bg-[#e0d000] text-[#0a0a0a] group-hover:bg-[#0a0a0a] group-hover:text-white group-hover:shadow-2xl"
            }`}
            style={{
              clipPath:
                "polygon(0 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 125px, 11.71px 113px, 11.71px 52px, 0 40px)",
            }}
          >
            {/* Top-Left Illuminated Triangular Fold (Neon Yellow on Hover) */}
            <div
              className={`absolute top-0 left-0 w-4 h-4 bg-[#ffff00] transition-opacity duration-200 pointer-events-none ${
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
                        isHovered ? "text-[#ffff00]" : "text-[#0a0a0a] group-hover:text-[#ffff00]"
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
                            ? "bg-[#ffff00] text-[#050505]"
                            : "bg-[#0a0a0a] text-[#ffff00] group-hover:bg-[#ffff00] group-hover:text-[#050505]"
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
      </motion.div>
    );
  };

  return (
    <section
      id="capabilities-tiles"
      className="relative w-full lg:w-[200vw] h-auto lg:h-screen shrink-0 bg-[#ffff00] text-[#0a0a0a] flex flex-col lg:flex-row select-none overflow-visible lg:overflow-hidden"
    >
      {/* 6 Vertical Guidelines across Screen 1 & 2 (Desktop only) */}
      <div className="hidden lg:flex absolute inset-0 justify-between pointer-events-none z-0">
        <div className="w-px h-full bg-[#a09400]/30" />
        <div className="w-px h-full bg-[#a09400]/25" />
        <div className="w-px h-full bg-[#a09400]/25" />
        <div className="w-px h-full bg-[#a09400]/25" />
        <div className="w-px h-full bg-[#a09400]/25" />
        <div className="w-px h-full bg-[#a09400]/30" />
        <div className="w-px h-full bg-[#a09400]/25" />
        <div className="w-px h-full bg-[#a09400]/25" />
        <div className="w-px h-full bg-[#a09400]/25" />
        <div className="w-px h-full bg-[#a09400]/25" />
        <div className="w-px h-full bg-[#a09400]/30" />
      </div>

      {/* ========================================================================= */}
      {/* SCREEN 1: Authentic Curtis 5-Column Staggered Chessboard                  */}
      {/* ========================================================================= */}
      <div ref={screen1Ref} className="relative w-full lg:w-screen h-auto lg:h-screen shrink-0 flex flex-col justify-between p-4 sm:p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-[#a09400]/30 z-10">
        {/* Top Header Bar (Matching Curtis telemetry) */}
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between font-mono text-[11px] font-bold uppercase tracking-wider text-[#0a0a0a] pb-2.5 pr-[4.75rem] sm:pr-20 lg:pr-24 border-b-2 border-[#a09400]/40 gap-2">
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
            <span className="px-2.5 py-0.5 rounded bg-[#0a0a0a] text-[#ffff00] text-[10px] font-mono font-black shadow-sm">
              SCREEN 1 OF 2 &middot; CORE CAPABILITIES
            </span>
          </div>
        </div>

        {/* Screen 1 Canvas Area for Desktop (5 Alternating Staggered Columns) */}
        <div ref={s1AreaRef} className="relative w-full h-[calc(100vh-8.5rem)] my-auto hidden lg:block">
          {screen1Tiles.map((tile) => renderCurtisTile(tile, effectiveS1Progress, false))}

          {/* Gravity lever in Column 1, Row 3: bolted in place, it never falls */}
          <div className="absolute lg:left-[2.5%] lg:top-[calc(1.75rem+50vh)] w-[92vw] sm:w-[45vw] lg:w-[17.5vw] h-[22vh] min-h-[135px] max-h-[175px] z-20">
            <GravityLever on={gravityOn} onToggle={toggleGravity} onHover={playHover} progress={effectiveS1Progress} />
          </div>
        </div>

        {/* Screen 1 Grid Area for Mobile & Tablet (< 1024px) */}
        <div className="relative w-full block lg:hidden my-4 sm:my-6">
          {/* The grid is the tiles' offsetParent; its bottom padding is the
              drop room they fall into when gravity is on. */}
          <div ref={m1GridRef} className="relative grid grid-cols-2 gap-2.5 sm:gap-3.5 w-full pb-[150px]">
            {/* Gravity lever on its own row above the tiles, clear of every column */}
            <div className="col-span-2 relative w-full h-[110px] select-none">
              <GravityLever
                on={gravityOn}
                onToggle={toggleGravity}
                onHover={playHover}
                progress={Math.min(1, Math.max(0.55, effectiveS1Progress * 1.2))}
                compact
              />
            </div>

            {screen1Tiles.map((tile) => renderCurtisTile(tile, effectiveS1Progress, true))}
          </div>

          {/* Small Scroll Guidance on Mobile */}
          <div className="flex justify-center mt-5 mb-1 pointer-events-none">
            <ScrollGuidance label="KEEP SCROLLING" theme="light" />
          </div>
        </div>

        {/* Bottom Continuity Banner */}
        <div className="flex items-center justify-between font-mono text-[11px] font-bold text-[#0a0a0a] pt-2 border-t-2 border-[#a09400]/40">
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
        <div className="flex flex-wrap sm:flex-nowrap items-center justify-between font-mono text-[11px] font-bold uppercase tracking-wider text-[#0a0a0a] pb-2.5 pr-[4.75rem] sm:pr-20 lg:pr-24 border-b-2 border-[#a09400]/40 gap-2">
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
            <span className="px-2.5 py-0.5 rounded bg-[#0a0a0a] text-[#ffff00] text-[10px] font-mono font-black shadow-sm">
              SCREEN 2 OF 2 &middot; DISTRIBUTED SYSTEMS
            </span>
          </div>
        </div>

        {/* Screen 2 Canvas Area for Desktop */}
        <div ref={s2AreaRef} className="relative w-full h-[calc(100vh-8.5rem)] my-auto hidden lg:block">
          {screen2Tiles.map((tile) => renderCurtisTile(tile, effectiveS2Progress, false))}
        </div>

        {/* Screen 2 Grid Area for Mobile & Tablet (< 1024px) */}
        <div className="relative w-full block lg:hidden my-4 sm:my-6">
          <div ref={m2GridRef} className="relative grid grid-cols-2 gap-2.5 sm:gap-3.5 w-full pb-[150px]">
            {screen2Tiles.map((tile) => renderCurtisTile(tile, effectiveS2Progress, true))}
          </div>

          {/* Small Scroll Guidance on Mobile */}
          <div className="flex justify-center mt-5 mb-1 pointer-events-none">
            <ScrollGuidance label="KEEP SCROLLING FOR PRODUCTS" theme="light" />
          </div>
        </div>

        {/* Bottom Status Cue */}
        <div className="flex items-center justify-between font-mono text-[11px] font-bold text-[#0a0a0a] pt-2 border-t-2 border-[#a09400]/40">
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

// Physical lever that owns the gravity state. The arm pivots at its base:
// leaning left is OFF, swung right is ON. It moves on a spring so it lands
// with a little overshoot, and the knob lights neon once gravity is engaged.
function GravityLever({
  on,
  onToggle,
  onHover,
  progress,
  compact = false,
}: {
  on: boolean;
  onToggle: () => void;
  onHover: () => void;
  progress: number; // screen reveal progress, drives the scale-in
  compact?: boolean;
}) {
  const width = compact ? 104 : 124;
  const height = compact ? 54 : 64;
  const arm = compact ? 38 : 46;

  return (
    <button
      type="button"
      onClick={onToggle}
      onMouseEnter={onHover}
      aria-pressed={on}
      aria-label={on ? "Turn gravity off" : "Turn gravity on"}
      className="group relative w-full h-full flex flex-col items-center justify-center gap-1.5 cursor-pointer select-none outline-none"
      style={{
        transform: `scale(${Math.min(1, Math.max(0, progress * 1.8))})`,
        opacity: Math.min(1, Math.max(0, progress * 2.2)),
        transition: "transform 0.3s ease-out, opacity 0.3s ease-out",
      }}
    >
      <span className="font-mono text-[9px] font-black uppercase tracking-widest text-[#0a0a0a]">
        // GRAVITY LEVER
      </span>

      <div className="relative" style={{ width, height }}>
        {/* Dashed travel arc */}
        <svg viewBox={`0 0 ${width} ${height}`} className="absolute inset-0 w-full h-full text-[#0a0a0a]/35">
          <path
            d={`M ${width / 2 - arm * 0.78} ${height - 6} A ${arm} ${arm} 0 0 1 ${width / 2 + arm * 0.78} ${height - 6}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="3 4"
          />
        </svg>

        {/* Base plate */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[64px] h-[12px] bg-[#0a0a0a]"
          style={{ clipPath: "polygon(0 100%, 8px 0, calc(100% - 8px) 0, 100% 100%)" }}
        />

        {/* Arm, pivoting at the base */}
        <motion.div
          initial={false}
          animate={{ rotate: on ? 42 : -42 }}
          transition={{ type: "spring", stiffness: 220, damping: 13, mass: 0.9 }}
          className="absolute left-1/2 w-[6px] -ml-[3px] origin-bottom bg-[#0a0a0a] rounded-full"
          style={{ bottom: 10, height: arm }}
        >
          <span
            className={`absolute -top-[10px] left-1/2 -translate-x-1/2 w-5 h-5 rounded-full border-2 border-[#0a0a0a] transition-colors duration-200 ${
              on ? "bg-[#ffff00] shadow-[0_0_14px_rgba(255,255,0,0.9)]" : "bg-[#0a0a0a] group-hover:bg-[#2a2a2a]"
            }`}
          />
        </motion.div>

        {/* Pivot cap */}
        <div className="absolute bottom-[4px] left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#ffff00] border-2 border-[#0a0a0a] z-10" />
      </div>

      <div className="flex items-center justify-between font-mono text-[9px] font-black tracking-widest" style={{ width }}>
        <span className={`transition-colors duration-200 ${on ? "text-[#0a0a0a]/35" : "text-[#0a0a0a]"}`}>OFF</span>
        <span className={`transition-colors duration-200 ${on ? "text-[#0a0a0a]" : "text-[#0a0a0a]/35"}`}>ON</span>
      </div>

      <span className="font-mono text-[8px] font-bold uppercase tracking-wider text-[#0a0a0a]/70 text-center">
        {on ? "GRAVITY ENGAGED \u00b7 PULL TO RESTORE" : "PULL TO TURN ON GRAVITY"}
      </span>
    </button>
  );
}
