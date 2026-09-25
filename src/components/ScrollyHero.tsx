"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Terminal, Sparkles, Cpu, Layers } from "lucide-react";
import { useSound } from "./SoundManager";
import { useHorizontalScroll } from "./HorizontalLayout";
import ScrambleText from "./ScrambleText";

const TOTAL_FRAMES = 181;
const INITIAL_BURST_FRAMES = 25;

export default function ScrollyHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { playClick, playHover, playSuccess } = useSound();
  const { scrollProgress, isDesktop } = useHorizontalScroll();

  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const [isInitialLoaded, setIsInitialLoaded] = useState<boolean>(false);
  const [currentFrameIndex, setCurrentFrameIndex] = useState<number>(0);
  const [mobileSelectedPhase, setMobileSelectedPhase] = useState<number>(1);
  const lastPhaseRef = useRef<number>(1);

  const targetFrameRef = useRef<number>(0);
  const currentFrameRef = useRef<number>(0);
  const imagesRef = useRef<HTMLImageElement[]>([]);

  const touchStartX = useRef<number>(0);
  const touchStartFrame = useRef<number>(0);

  // 1. Preload 181 WebP frames
  useEffect(() => {
    let isCancelled = false;
    const loadedImages: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    let loadedCount = 0;

    const loadSingleFrame = (idx: number): Promise<HTMLImageElement> => {
      return new Promise((resolve) => {
        const img = new Image();
        const frameNumber = String(idx + 1).padStart(3, "0");
        img.src = `/frames/frame-${frameNumber}.webp`;
        img.onload = () => {
          if (isCancelled) return;
          loadedImages[idx] = img;
          loadedCount++;
          setLoadProgress(Math.round((loadedCount / TOTAL_FRAMES) * 100));

          if (loadedCount >= INITIAL_BURST_FRAMES && !isInitialLoaded) {
            setIsInitialLoaded(true);
          }
          resolve(img);
        };
        img.onerror = () => {
          loadedCount++;
          resolve(img);
        };
      });
    };

    const burstPromises = [];
    for (let i = 0; i < INITIAL_BURST_FRAMES; i++) {
      burstPromises.push(loadSingleFrame(i));
    }

    Promise.all(burstPromises).then(() => {
      if (isCancelled) return;
      setImages([...loadedImages]);
      imagesRef.current = loadedImages;

      for (let i = INITIAL_BURST_FRAMES; i < TOTAL_FRAMES; i++) {
        loadSingleFrame(i).then(() => {
          if (!isCancelled) {
            imagesRef.current = loadedImages;
          }
        });
      }
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  // 2. High-performance Canvas Rendering
  const renderFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = imagesRef.current[frameIdx] || imagesRef.current[0];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const dpr = window.devicePixelRatio || 1;
    const canvasW = canvas.width / dpr;
    const canvasH = canvas.height / dpr;

    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, canvasW, canvasH);

    const imgRatio = img.naturalWidth / img.naturalHeight; // 1280 / 720
    const canvasRatio = canvasW / canvasH;

    let drawW: number;
    let drawH: number;
    let drawX: number;
    let drawY: number;

    if (canvasRatio > imgRatio) {
      drawH = canvasH;
      drawW = canvasH * imgRatio;
      drawX = (canvasW - drawW) / 2;
      drawY = 0;
    } else {
      drawW = canvasW;
      drawH = canvasW / imgRatio;
      drawX = 0;
      drawY = (canvasH - drawH) / 2;
    }

    ctx.drawImage(img, drawX, drawY, drawW, drawH);

    // Vignette gradient
    const gradient = ctx.createRadialGradient(
      canvasW / 2,
      canvasH / 2,
      Math.min(canvasW, canvasH) * 0.4,
      canvasW / 2,
      canvasH / 2,
      Math.max(canvasW, canvasH) * 0.72
    );
    gradient.addColorStop(0, "rgba(5, 5, 5, 0)");
    gradient.addColorStop(0.8, "rgba(5, 5, 5, 0.45)");
    gradient.addColorStop(1, "rgba(5, 5, 5, 0.98)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasW, canvasH);
  }, []);

  // 3. Canvas Resizing
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      const width = canvas.parentElement?.clientWidth || window.innerWidth;
      const height = isDesktop
        ? window.innerHeight
        : canvas.parentElement?.clientHeight || Math.min(420, window.innerHeight * 0.45);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
      renderFrame(Math.round(currentFrameRef.current));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [renderFrame, isDesktop]);

  // Avatar sequence is pinned on-screen between 0.13 and 0.29 on desktop
  const localProg = Math.min(1, Math.max(0, (scrollProgress - 0.13) / 0.12));

  useEffect(() => {
    if (!isDesktop) return;

    targetFrameRef.current = localProg * (TOTAL_FRAMES - 1);

    let currentPhase = 1;
    if (localProg > 0.73) currentPhase = 4;
    else if (localProg > 0.48) currentPhase = 3;
    else if (localProg > 0.22) currentPhase = 2;

    if (currentPhase !== lastPhaseRef.current) {
      lastPhaseRef.current = currentPhase;
      if (currentPhase === 4) playSuccess();
      else playHover();
    }
  }, [localProg, playHover, playSuccess, isDesktop]);

  // Touch scrubbing on mobile canvas
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartFrame.current = currentFrameRef.current;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const diffX = e.touches[0].clientX - touchStartX.current;
    const frameDelta = (diffX / (window.innerWidth || 360)) * TOTAL_FRAMES * 1.2;
    const newTarget = Math.min(TOTAL_FRAMES - 1, Math.max(0, touchStartFrame.current + frameDelta));
    targetFrameRef.current = newTarget;

    const prog = newTarget / (TOTAL_FRAMES - 1);
    let p = 1;
    if (prog > 0.73) p = 4;
    else if (prog > 0.48) p = 3;
    else if (prog > 0.22) p = 2;
    setMobileSelectedPhase(p);
  };

  // Smooth lerp loop
  useEffect(() => {
    let animId: number;

    const loop = () => {
      const target = targetFrameRef.current;
      const current = currentFrameRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.05) {
        currentFrameRef.current += diff * 0.18;
        const idx = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(currentFrameRef.current)));
        setCurrentFrameIndex(idx);
        renderFrame(idx);
      } else if (Math.round(current) !== Math.round(target)) {
        currentFrameRef.current = target;
        const idx = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(target)));
        setCurrentFrameIndex(idx);
        renderFrame(idx);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [renderFrame]);

  const getPhase = () => {
    if (localProg < 0.23) return 1;
    if (localProg < 0.49) return 2;
    if (localProg < 0.74) return 3;
    return 4;
  };

  const currentPhase = isDesktop ? getPhase() : mobileSelectedPhase;

  const chapters = [
    { id: 1, label: "01 // DEEP WORK", short: "01 WORKSTATION", frame: 0 },
    { id: 2, label: "02 // ARCHITECTURE", short: "02 AI RUNTIMES", frame: 55 },
    { id: 3, label: "03 // LEADERSHIP", short: "03 VELOCITY", frame: 115 },
    { id: 4, label: "04 // GREETING", short: "04 GREETING", frame: 180 },
  ];

  return (
    <section
      id="scrolly-greeting"
      className="relative w-full lg:w-screen h-auto min-h-screen lg:h-screen shrink-0 bg-[#050505] selection:bg-[#9df133] selection:text-black flex flex-col items-center justify-center overflow-visible lg:overflow-hidden border-t lg:border-t-0 lg:border-x border-white/[0.06] py-12 lg:py-0 px-4 sm:px-8 lg:px-0"
    >
      {/* Mobile Chapter Selector Bar (Touch buttons to jump between avatar milestones) */}
      <div className="flex lg:hidden flex-wrap items-center justify-center gap-2 mb-3 font-mono text-xs w-full max-w-xl z-20">
        {chapters.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setMobileSelectedPhase(item.id);
              targetFrameRef.current = item.frame;
              playClick();
            }}
            className={`px-3 py-1.5 rounded curtis-notch font-bold transition-all text-[10px] sm:text-xs ${
              currentPhase === item.id
                ? "bg-[#9df133] text-[#0a0a0a] shadow-[0_0_12px_rgba(157,241,51,0.4)]"
                : "bg-white/[0.06] text-white/50 border border-white/10 hover:text-white"
            }`}
          >
            {item.short}
          </button>
        ))}
      </div>

      {/* Canvas Engine Container: Fullscreen absolute on desktop; responsive touch-scrubbable viewport on mobile/tablet */}
      <div
        className={
          isDesktop
            ? "absolute inset-0 w-full h-full block z-0 cursor-default"
            : "relative w-full max-w-xl mx-auto h-[42vh] sm:h-[48vh] rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.9)] z-0 my-3 touch-none"
        }
      >
        <canvas
          ref={canvasRef}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          className="w-full h-full block cursor-ew-resize"
        />

        {/* Seamless Edge Feathering Overlays */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-radial-[circle_at_center,transparent_45%,#050505_96%]" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 sm:h-32 bg-gradient-to-b from-[#050505] via-[#050505]/60 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 sm:h-36 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 sm:w-28 bg-gradient-to-r from-[#050505] via-[#050505]/60 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 sm:w-28 bg-gradient-to-l from-[#050505] via-[#050505]/60 to-transparent z-10" />

        {/* Scanlines */}
        <div className="pointer-events-none absolute inset-0 z-10 opacity-15 scanline" />

        {/* Mobile touch gesture cue */}
        {!isDesktop && (
          <div className="absolute bottom-2 inset-x-0 text-center font-mono text-[9px] text-[#9df133]/70 pointer-events-none z-20">
            &larr; TOUCH &amp; DRAG HORIZONTALLY TO SCRUB AVATAR &rarr;
          </div>
        )}
      </div>

      {/* Preloader HUD */}
      <AnimatePresence>
        {!isInitialLoaded && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.8 } }}
            className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-[#050505]"
          >
            <div className="relative p-6 cyber-notch cyber-glass max-w-sm w-full mx-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-3 text-[#9df133] font-mono text-xs">
                <Cpu className="w-4 h-4 animate-spin" />
                <span>BUFFERING 181 FRAMES...</span>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-[#9df133] transition-all duration-200 shadow-[0_0_8px_#9df133]"
                  style={{ width: `${loadProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] font-mono text-white/40">
                <span>CANVAS ENGINE</span>
                <span className="text-[#9df133] font-bold">{loadProgress}%</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HUD Frame Status */}
      <div className="absolute top-8 right-8 z-20 hidden sm:flex flex-col items-end gap-1 font-mono text-[10px] text-white/40">
        <div className="flex items-center gap-2 px-2 py-1 rounded bg-black/60 border border-white/10 backdrop-blur-md">
          <span className="text-[#9df133]">FRAME:</span>
          <span className="text-white font-mono font-semibold">
            {String(currentFrameIndex + 1).padStart(3, "0")} / {TOTAL_FRAMES}
          </span>
        </div>
      </div>

      {/* Left Chapter Indicator (Desktop Only) */}
      <div className="absolute top-8 left-8 z-20 hidden lg:flex flex-col gap-2 font-mono text-[11px]">
        {chapters.map((item) => (
          <div
            key={item.id}
            className={`flex items-center gap-2 transition-all duration-300 ${
              currentPhase === item.id
                ? "text-[#9df133] font-bold translate-x-1"
                : "text-white/30"
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full transition-all ${
                currentPhase === item.id
                  ? "bg-[#9df133] shadow-[0_0_8px_#9df133]"
                  : "bg-white/20"
              }`}
            />
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Parallax Narrative Overlays */}
      <div className="relative z-20 w-full max-w-5xl mx-auto px-2 sm:px-6 pointer-events-auto">
        <AnimatePresence mode="wait">
          {currentPhase === 1 && (
            <motion.div
              key="phase-1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col items-start max-w-xl"
            >
              <div className="inline-flex items-center gap-2 px-2.5 py-1 mb-2.5 rounded cyber-notch-sm bg-[#9df133]/10 border border-[#9df133]/30 text-[#9df133] font-mono text-xs tracking-wider">
                <Terminal className="w-3.5 h-3.5" />
                <ScrambleText text="// 01 · ACTIVE TYPING & WORKSTATION" />
              </div>
              <h2 className="text-3xl sm:text-6xl font-extrabold tracking-tight text-white mb-2">
                <ScrambleText text="SHIVANG CHAUHAN" />
              </h2>
              <p className="text-sm sm:text-lg font-mono text-[#9df133] font-medium mb-2.5">
                SDE III &amp; Full-Stack Architect
              </p>
              <p className="text-xs sm:text-sm text-white/60 leading-relaxed mb-4 font-sans">
                Deep at work engineering distributed architectures, conversational AI runtimes, and self-serve ad tech platforms. {isDesktop ? "Continue scrolling right to see the sequence evolve." : "Tap chapters or swipe avatar above."}
              </p>
            </motion.div>
          )}

          {currentPhase === 2 && (
            <motion.div
              key="phase-2"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col items-start lg:items-end text-left lg:text-right lg:ml-auto max-w-xl"
            >
              <div className="inline-flex items-center gap-2 px-2.5 py-1 mb-2.5 rounded cyber-notch-sm bg-[#9df133]/10 border border-[#9df133]/30 text-[#9df133] font-mono text-xs tracking-wider">
                <Cpu className="w-3.5 h-3.5" />
                <ScrambleText text="// 02 · TURNING FOCUS & AI RUNTIMES" />
              </div>
              <h2 className="text-2xl sm:text-5xl font-bold tracking-tight text-white mb-2">
                Autonomous <span className="text-[#9df133]">AI Runtimes</span>
              </h2>
              <p className="text-xs sm:text-sm text-white/60 leading-relaxed mb-4 font-sans">
                FastAPI microservices, Redis-backed state, and 4-service RAG pipelines (34 intents, pgvector, Kafka) with Google GenAI &amp; Naver.
              </p>
              <div className="grid grid-cols-2 gap-3 text-left font-mono text-xs w-full max-w-sm">
                <div className="p-2.5 rounded bg-black/60 border border-white/10">
                  <div className="text-[#9df133] font-bold text-base">$3M+</div>
                  <div className="text-white/40 text-[10px]">Saved at GE Aviation</div>
                </div>
                <div className="p-2.5 rounded bg-black/60 border border-white/10">
                  <div className="text-[#9df133] font-bold text-base">34 Intents</div>
                  <div className="text-white/40 text-[10px]">RAG Intent Pipeline</div>
                </div>
              </div>
            </motion.div>
          )}

          {currentPhase === 3 && (
            <motion.div
              key="phase-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col items-start max-w-xl"
            >
              <div className="inline-flex items-center gap-2 px-2.5 py-1 mb-2.5 rounded cyber-notch-sm bg-[#9df133]/10 border border-[#9df133]/30 text-[#9df133] font-mono text-xs tracking-wider">
                <Layers className="w-3.5 h-3.5" />
                <ScrambleText text="// 03 · FRONTEND LEAD & VELOCITY" />
              </div>
              <h2 className="text-2xl sm:text-5xl font-bold tracking-tight text-white mb-2">
                Solo Output, <span className="text-[#9df133]">Team Scale</span>
              </h2>
              <p className="text-xs sm:text-sm text-white/60 leading-relaxed mb-4 font-sans">
                Deep mastery in modern React, Next.js, TypeScript, React Native / Expo, Redux-Saga, WebSockets, and Pyright monorepos.
              </p>
            </motion.div>
          )}

          {currentPhase === 4 && (
            <motion.div
              key="phase-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center text-center max-w-xl mx-auto"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 mb-2.5 rounded cyber-notch-sm bg-[#9df133]/10 border border-[#9df133]/30 text-[#9df133] font-mono text-xs tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <ScrambleText text="// 04 · GREETING & COLLABORATION" />
              </div>
              <h2 className="text-3xl sm:text-6xl font-extrabold tracking-tight text-white mb-2.5">
                &ldquo;Hey there! Let&apos;s build <span className="text-[#9df133]">together.</span>&rdquo;
              </h2>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed mb-4 font-sans">
                Resilient architectures, agentic AI workflows, and buttery smooth user interfaces.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Subtitle / Cue */}
      <div className="hidden lg:block absolute bottom-6 left-1/2 -translate-x-1/2 z-20 font-mono text-xs text-white/40 pointer-events-none">
        [SCROLL TO GLIDE RIGHT TO PRODUCTS &rarr;]
      </div>
      <div className="block lg:hidden text-center mt-6 font-mono text-xs text-white/40">
        [SWIPE DOWN FOR CORE CAPABILITIES &amp; TOOLS &darr;]
      </div>
    </section>
  );
}
