"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import PixelTransition from "./PixelTransition";

interface HorizontalScrollContextType {
  scrollProgress: number; // 0.0 to 1.0
  scrollX: number;
  totalWidth: number;
  scrollToProgress: (prog: number) => void;
  isLoaded: boolean;
  isDesktop: boolean;
  preloadedFrames: HTMLImageElement[];
}

const TOTAL_FRAMES = 181;
const CRITICAL_IMAGES = [
  "/portrait.webp",
  "/portrait_tuxedo_top.webp",
  "/projects/konnect_app_banner.png",
  "/projects/konnect_logo.png",
  "/projects/treksforall.webp",
  "/projects/magnum_logo.png",
  "/companies/ge_aerospace.svg",
  "/companies/verizon.svg",
  "/companies/247ai.svg",
];
const TOTAL_ASSETS = TOTAL_FRAMES + CRITICAL_IMAGES.length;

const HorizontalScrollContext = createContext<HorizontalScrollContextType>({
  scrollProgress: 0,
  scrollX: 0,
  totalWidth: 0,
  scrollToProgress: () => {},
  isLoaded: false,
  isDesktop: true,
  preloadedFrames: [],
});

export const useHorizontalScroll = () => useContext(HorizontalScrollContext);

export default function HorizontalLayout({ children }: { children: React.ReactNode }) {
  const outerContainerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollX, setScrollX] = useState(0);
  const [totalWidth, setTotalWidth] = useState(0);
  const [isDesktop, setIsDesktop] = useState(true);

  // Preloader / Boot Barrier State
  const [isLoaded, setIsLoaded] = useState(false);
  const [bootPercent, setBootPercent] = useState(0);
  const [bootStatus, setBootStatus] = useState("INITIALIZING BUFFER...");
  const [preloadedFrames, setPreloadedFrames] = useState<HTMLImageElement[]>([]);

  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);

  // Responsive breakpoint tracking (>= 1024px is desktop)
  useEffect(() => {
    const checkViewport = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  // 1. Initial Mount: Real asset preloading (all 181 frames + critical images)
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
      window.scrollTo(0, 0);
    }

    let isCancelled = false;
    let loadedCount = 0;
    const frameImages: HTMLImageElement[] = new Array(TOTAL_FRAMES);

    const onAssetLoaded = (label: string) => {
      if (isCancelled) return;
      loadedCount++;
      const pct = Math.min(100, Math.round((loadedCount / TOTAL_ASSETS) * 100));
      setBootPercent(pct);
      setBootStatus(`BUFFERING ASSETS (${loadedCount}/${TOTAL_ASSETS})`);
    };

    // Load a single frame
    const loadFrame = (idx: number): Promise<HTMLImageElement> => {
      return new Promise((resolve) => {
        const img = new Image();
        const frameNum = String(idx + 1).padStart(3, "0");
        img.src = `/frames/frame-${frameNum}.webp`;
        const finish = () => {
          frameImages[idx] = img;
          onAssetLoaded(`frame-${frameNum}`);
          resolve(img);
        };
        img.onload = finish;
        img.onerror = finish;
      });
    };

    // Load a general image asset
    const loadImg = (url: string): Promise<HTMLImageElement> => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = url;
        const finish = () => {
          onAssetLoaded(url);
          resolve(img);
        };
        img.onload = finish;
        img.onerror = finish;
      });
    };

    // Concurrent worker pool to load all 181 frames smoothly without choking socket connections
    const concurrency = 16;
    let frameCursor = 0;

    const worker = async () => {
      while (frameCursor < TOTAL_FRAMES) {
        const idx = frameCursor++;
        await loadFrame(idx);
      }
    };

    const workerPromises = Array.from({ length: concurrency }, () => worker());
    const assetPromises = CRITICAL_IMAGES.map((url) => loadImg(url));

    Promise.all([...workerPromises, ...assetPromises]).then(() => {
      if (isCancelled) return;
      setPreloadedFrames(frameImages);
      setBootPercent(100);
      setBootStatus("ALL 181 FRAMES & ASSETS READY");
      setTimeout(() => {
        if (!isCancelled) {
          setIsLoaded(true);
          if (typeof window !== "undefined") {
            window.scrollTo(0, 0);
          }
        }
      }, 350);
    });

    return () => {
      isCancelled = true;
    };
  }, []);

  // 2. Strict scroll lock while loading: Prevent wheel, touch, keys, and overflow
  useEffect(() => {
    if (!isLoaded) {
      const preventDefault = (e: Event) => {
        e.preventDefault();
      };
      const onKeyDown = (e: KeyboardEvent) => {
        if (["Space", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End"].includes(e.code)) {
          e.preventDefault();
        }
      };

      if (typeof document !== "undefined") {
        document.documentElement.style.overflow = "hidden";
        document.body.style.overflow = "hidden";
      }

      window.addEventListener("wheel", preventDefault, { passive: false });
      window.addEventListener("touchmove", preventDefault, { passive: false });
      window.addEventListener("keydown", onKeyDown, { passive: false });
      window.scrollTo(0, 0);

      return () => {
        if (typeof document !== "undefined") {
          document.documentElement.style.overflow = "";
          document.body.style.overflow = "";
        }
        window.removeEventListener("wheel", preventDefault);
        window.removeEventListener("touchmove", preventDefault);
        window.removeEventListener("keydown", onKeyDown);
      };
    }
  }, [isLoaded]);

  // 3. Calculate dimensions and update on resize (Desktop only)
  useEffect(() => {
    if (!isDesktop) return;

    const updateDimensions = () => {
      if (trackRef.current) {
        const scrollWidth = trackRef.current.scrollWidth;
        const viewportWidth = window.innerWidth;
        const maxScrollDist = Math.max(0, scrollWidth - viewportWidth);
        setTotalWidth(maxScrollDist);
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [isDesktop]);

  // 4. Scroll Handling:
  // - On Desktop: Maps vertical scroll of tall 1200vh container to horizontal translation with slew-rate limiting
  // - On Mobile/Tablet: Natural vertical native scrolling with vertical scroll progress calculation
  useEffect(() => {
    if (!isLoaded) return;

    if (!isDesktop) {
      // Natural vertical scroll tracking for mobile & tablet
      const onMobileScroll = () => {
        const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
        const prog = Math.min(1, Math.max(0, window.scrollY / scrollable));
        setScrollProgress(prog);
      };

      window.addEventListener("scroll", onMobileScroll, { passive: true });
      onMobileScroll();
      return () => window.removeEventListener("scroll", onMobileScroll);
    }

    let animId: number;

    const onScroll = () => {
      if (!isLoaded || !outerContainerRef.current) return;
      const outerRect = outerContainerRef.current.getBoundingClientRect();
      const totalScrollable = outerContainerRef.current.offsetHeight - window.innerHeight;
      const currentScroll = -outerRect.top;

      const progress = Math.min(1, Math.max(0, currentScroll / totalScrollable));
      targetProgressRef.current = progress;
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    // Smooth loop with slew rate limit: ensures sudden trackpad flings glide with controlled luxurious inertia
    const loop = () => {
      const target = targetProgressRef.current;
      const current = currentProgressRef.current;
      const diff = target - current;

      if (Math.abs(diff) > 0.00005) {
        // Max delta progress per frame (0.008 at 60fps = 0.48/sec) -> prevents instant skipping of 3-4 slides
        const maxStep = 0.008;
        const step = Math.sign(diff) * Math.min(Math.abs(diff * 0.09), maxStep);
        currentProgressRef.current += step;

        const prog = Math.min(1, Math.max(0, currentProgressRef.current));
        setScrollProgress(prog);

        if (trackRef.current) {
          const W = window.innerWidth;

          // Pinned Timeline Stages with Dedicated Cushions for Every Screen (6 Slides total)
          let x = 0;
          if (prog <= 0.09) {
            x = 0;
          } else if (prog <= 0.13) {
            const t = (prog - 0.09) / 0.04;
            const ease = 0.5 - 0.5 * Math.cos(t * Math.PI);
            x = ease * W;
          } else if (prog <= 0.29) {
            x = W;
          } else if (prog <= 0.33) {
            const t = (prog - 0.29) / 0.04;
            const ease = 0.5 - 0.5 * Math.cos(t * Math.PI);
            x = W + ease * W;
          } else if (prog <= 0.39) {
            x = 2 * W;
          } else if (prog <= 0.42) {
            const t = (prog - 0.39) / 0.03;
            const ease = 0.5 - 0.5 * Math.cos(t * Math.PI);
            x = 2 * W + ease * W;
          } else if (prog <= 0.48) {
            x = 3 * W;
          } else if (prog <= 0.52) {
            const t = (prog - 0.48) / 0.04;
            const ease = 0.5 - 0.5 * Math.cos(t * Math.PI);
            x = 3 * W + ease * W;
          } else if (prog <= 0.60) {
            x = 4 * W;
          } else if (prog <= 0.64) {
            const t = (prog - 0.60) / 0.04;
            const ease = 0.5 - 0.5 * Math.cos(t * Math.PI);
            x = 4 * W + ease * W;
          } else if (prog <= 0.76) {
            x = 5 * W;
          } else if (prog <= 0.80) {
            const t = (prog - 0.76) / 0.04;
            const ease = 0.5 - 0.5 * Math.cos(t * Math.PI);
            x = 5 * W + ease * W;
          } else {
            x = 6 * W;
          }

          setScrollX(x);
          trackRef.current.style.transform = `translate3d(-${x}px, 0, 0)`;
        }
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(animId);
    };
  }, [isLoaded, isDesktop]);

  // 5. Programmatic scroll helper
  const scrollToProgress = (prog: number) => {
    if (isDesktop) {
      if (!outerContainerRef.current) return;
      const totalScrollable = outerContainerRef.current.offsetHeight - window.innerHeight;
      const targetY = prog * totalScrollable;
      window.scrollTo({ top: targetY, behavior: "smooth" });
    } else {
      const scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const targetY = prog * scrollable;
      window.scrollTo({ top: targetY, behavior: "smooth" });
    }
  };

  return (
    <HorizontalScrollContext.Provider
      value={{
        scrollProgress,
        scrollX,
        totalWidth,
        scrollToProgress,
        isLoaded,
        isDesktop,
        preloadedFrames,
      }}
    >
      {/* Outer scroll container: 1200vh on Desktop for horizontal translation; auto on Mobile/Tablet */}
      <div
        ref={outerContainerRef}
        className="relative w-full bg-[#050505]"
        style={{ height: isDesktop ? "1200vh" : "auto" }}
      >
        {/* Sticky 100vw x 100vh Viewport on Desktop; Native vertical flow on Mobile/Tablet */}
        <div
          className={`w-full bg-[#050505] ${
            isDesktop
              ? "sticky top-0 left-0 w-screen h-screen overflow-hidden"
              : "relative min-h-screen overflow-visible"
          }`}
        >
          {/* Moving Horizontal Track on Desktop; Vertical flex column on Mobile/Tablet */}
          <div
            ref={trackRef}
            className={
              isDesktop
                ? "flex h-full w-max will-change-transform"
                : "flex flex-col w-full h-auto"
            }
            style={{
              transform: isDesktop ? `translate3d(-${scrollX}px, 0, 0)` : "none",
            }}
          >
            {children}
          </div>

          {/* Fullscreen Staggered Pixel Wipe Transitions (Desktop Only) */}
          {isDesktop && (
            <>
              <PixelTransition
                scrollProgress={scrollProgress}
                triggerStart={0.28}
                triggerEnd={0.34}
                columns={14}
                rows={9}
                color="#050505"
              />
              <PixelTransition
                scrollProgress={scrollProgress}
                triggerStart={0.47}
                triggerEnd={0.53}
                columns={14}
                rows={9}
                color="#9df133"
              />
            </>
          )}
        </div>
      </div>

      {/* Cyber Preloader / Boot Barrier (Blocks scroll until screens and assets are mounted) */}
      <div
        className={`fixed inset-0 z-50 bg-[#050505] flex flex-col items-center justify-center transition-all duration-700 ${
          isLoaded ? "opacity-0 pointer-events-none scale-105" : "opacity-100 pointer-events-auto scale-100"
        }`}
      >
        {/* Fine background grid */}
        <div className="absolute inset-0 cyber-grid opacity-20 pointer-events-none" />

        <div className="relative z-10 max-w-md w-full px-6 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded cyber-notch-sm bg-[#9df133]/10 border border-[#9df133]/30 text-[#9df133] font-mono text-xs tracking-wider">
            <span className="w-2 h-2 rounded-full bg-[#9df133] animate-pulse" />
            <span>// SYSTEM BOOT &middot; RUNTIME ENGINE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mb-6">
            PORTFOLIO / <span className="text-[#9df133]">SHIVANG</span>
          </h1>

          {/* Neon Green Progress Bar */}
          <div className="w-full bg-white/10 rounded-full h-1.5 mb-3 overflow-hidden p-0.5 border border-white/20">
            <div
              className="bg-[#9df133] h-full rounded-full transition-all duration-150 shadow-[0_0_12px_#9df133]"
              style={{ width: `${bootPercent}%` }}
            />
          </div>

          <div className="flex items-center justify-between w-full font-mono text-[11px] text-white/50">
            <span className="uppercase tracking-wider">{bootStatus}</span>
            <span className="text-[#9df133] font-bold">{bootPercent}%</span>
          </div>
        </div>
      </div>
    </HorizontalScrollContext.Provider>
  );
}
