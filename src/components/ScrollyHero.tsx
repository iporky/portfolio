"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useSound } from "./SoundManager";
import { useHorizontalScroll } from "./HorizontalLayout";
import ScrollGuidance from "./ScrollGuidance";

const TOTAL_FRAMES = 181;
// Time constant of the frame ease, in seconds (~0.19 per frame at 60Hz).
const FRAME_TAU = 0.075;

export default function ScrollyHero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { playSuccess } = useSound();
  const { scrollProgress, isDesktop, preloadedFrames } = useHorizontalScroll();

  const targetFrameRef = useRef<number>(0);
  const currentFrameRef = useRef<number>(0);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const lastPhaseRef = useRef<number>(1);

  // Sync preloaded frames from HorizontalLayout
  useEffect(() => {
    if (preloadedFrames && preloadedFrames.length > 0) {
      imagesRef.current = preloadedFrames;
      renderFrame(Math.round(currentFrameRef.current));
    }
  }, [preloadedFrames]);

  // Fallback frame preloader (in case rendered standalone)
  useEffect(() => {
    if (imagesRef.current.length >= TOTAL_FRAMES) return;

    let isCancelled = false;
    const loadedImages: HTMLImageElement[] = new Array(TOTAL_FRAMES);

    for (let i = 0; i < TOTAL_FRAMES; i++) {
      const img = new Image();
      const frameNumber = String(i + 1).padStart(3, "0");
      img.src = `/frames/frame-${frameNumber}.webp`;
      img.onload = () => {
        if (isCancelled) return;
        loadedImages[i] = img;
        if (i === 0 && imagesRef.current.length === 0) {
          imagesRef.current = loadedImages;
          renderFrame(0);
        }
      };
    }

    imagesRef.current = loadedImages;
    return () => {
      isCancelled = true;
    };
  }, []);

  // High-performance Canvas Rendering
  const renderFrame = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fall back to the nearest earlier decoded frame rather than frame 0, so a
    // gap in the sequence holds the last pose instead of snapping back.
    let img = imagesRef.current[frameIdx];
    for (let i = frameIdx; i >= 0 && !(img && img.complete && img.naturalWidth > 0); i--) {
      img = imagesRef.current[i];
    }
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const dpr = window.devicePixelRatio || 1;
    const canvasW = canvas.width / dpr;
    const canvasH = canvas.height / dpr;

    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, canvasW, canvasH);

    // Full-bleed cover for both mobile portrait and desktop landscape (zero letterbox black bars!)
    const scale = Math.max(canvasW / img.naturalWidth, canvasH / img.naturalHeight);
    const drawW = img.naturalWidth * scale;
    const drawH = img.naturalHeight * scale;
    // On portrait mobile screens, focus slightly on the subject (x ~ 52%, y ~ 50%)
    const xFocal = canvasH > canvasW ? 0.52 : 0.5;
    const drawX = (canvasW - drawW) * xFocal;
    const drawY = (canvasH - drawH) * 0.5;

    ctx.drawImage(img, drawX, drawY, drawW, drawH);

    // Subtle edge vignette (never obscuring the video artwork on mobile)
    const radius = Math.hypot(canvasW, canvasH) * 0.55;
    const gradient = ctx.createRadialGradient(
      canvasW / 2,
      canvasH / 2,
      radius * 0.45,
      canvasW / 2,
      canvasH / 2,
      radius
    );
    gradient.addColorStop(0, "rgba(5,5,5,0)");
    gradient.addColorStop(0.75, "rgba(5,5,5,0.15)");
    gradient.addColorStop(1, "rgba(5,5,5,0.6)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvasW, canvasH);
  }, []);

  // Canvas Resizing
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const dpr = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;

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
  }, [renderFrame]);

  // Desktop horizontal scroll sequence mapping
  const localProg = Math.min(1, Math.max(0, (scrollProgress - 0.13) / 0.12));

  useEffect(() => {
    if (!isDesktop) return;
    targetFrameRef.current = localProg * (TOTAL_FRAMES - 1);
  }, [localProg, isDesktop]);

  // Mobile vertical scroll sequence mapping:
  // As user scrolls through the 260vh sticky container, frame advances from 0 to 180 (typing -> turning -> waving)
  useEffect(() => {
    if (isDesktop) return;

    const onMobileScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const totalScrollable = sectionRef.current.offsetHeight - window.innerHeight;
      if (totalScrollable <= 0) return;
      const progress = Math.min(1, Math.max(0, -rect.top / totalScrollable));
      targetFrameRef.current = progress * (TOTAL_FRAMES - 1);
    };

    window.addEventListener("scroll", onMobileScroll, { passive: true });
    onMobileScroll();
    return () => window.removeEventListener("scroll", onMobileScroll);
  }, [isDesktop]);

  // Play audio cue when user reaches waving frame
  useEffect(() => {
    const currentProg = isDesktop ? localProg : targetFrameRef.current / (TOTAL_FRAMES - 1);
    if (currentProg > 0.85 && lastPhaseRef.current !== 4) {
      lastPhaseRef.current = 4;
      playSuccess();
    } else if (currentProg <= 0.85 && lastPhaseRef.current === 4) {
      lastPhaseRef.current = 1;
    }
  }, [localProg, isDesktop, playSuccess]);

  // Smooth lerp loop. Time-based (FRAME_TAU seconds), so the sequence eases the
  // same on a 60Hz and a 144Hz display instead of running twice as fast on the
  // latter. Only repaints when the rounded frame actually changes.
  useEffect(() => {
    let animId: number;
    let lastTime = performance.now();
    let lastDrawn = -1;

    const loop = (now: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;

      const target = targetFrameRef.current;
      const current = currentFrameRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.05) {
        currentFrameRef.current += diff * (1 - Math.exp(-dt / FRAME_TAU));
      } else if (current !== target) {
        currentFrameRef.current = target;
      }

      const idx = Math.min(TOTAL_FRAMES - 1, Math.max(0, Math.round(currentFrameRef.current)));
      if (idx !== lastDrawn) {
        lastDrawn = idx;
        renderFrame(idx);
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [renderFrame]);

  return (
    <section
      id="scrolly-greeting"
      ref={sectionRef}
      className={`relative w-full shrink-0 bg-[#050505] selection:bg-[#ffff00] selection:text-black ${
        isDesktop
          ? "lg:w-screen lg:h-screen overflow-hidden border-x border-white/[0.06] flex flex-col items-center justify-center"
          : "h-[180vh]"
      }`}
    >
      {/* Canvas Engine Container: Sticky fullscreen viewport on mobile starting right at top:0; Absolute fullscreen on desktop */}
      <div
        className={
          isDesktop
            ? "absolute inset-0 w-full h-full block z-0"
            : "sticky top-0 left-0 w-full h-[100dvh] overflow-hidden z-0"
        }
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
        />

        {/* Seamless Edge Feathering Overlays (Desktop radial vignette; subtle fades on mobile) */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-radial-[circle_at_center,transparent_45%,#050505_96%] hidden lg:block" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-8 sm:h-16 lg:h-32 bg-gradient-to-b from-[#050505] via-[#050505]/30 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-8 sm:h-20 lg:h-36 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 sm:w-20 lg:w-28 bg-gradient-to-r from-[#050505] via-[#050505]/50 to-transparent z-10 hidden sm:block" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 sm:w-20 lg:w-28 bg-gradient-to-l from-[#050505] via-[#050505]/50 to-transparent z-10 hidden sm:block" />

        {/* Scanlines */}
        <div className="pointer-events-none absolute inset-0 z-10 opacity-15 scanline" />

        {/* Subtle Bouncing Scroll Guidance Indicator */}
        <div className="absolute bottom-5 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <ScrollGuidance label="KEEP SCROLLING" theme="dark" />
        </div>
      </div>
    </section>
  );
}
