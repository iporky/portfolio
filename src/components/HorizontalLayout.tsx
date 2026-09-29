"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import PixelTransition from "./PixelTransition";
import CurtisMenu from "./CurtisMenu";
import BootScreen from "./BootScreen";
import TimelineHUD from "./TimelineHUD";

interface HorizontalScrollContextType {
  scrollProgress: number; // 0.0 to 1.0
  scrollX: number;
  totalWidth: number;
  scrollToProgress: (prog: number) => void;
  isLoaded: boolean;
  isDesktop: boolean;
  preloadedFrames: HTMLImageElement[];
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
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

// The boot screen stays up at least this long so the bar and log read as a
// sequence instead of a flash on a warm cache, and lingers this long after
// "SYSTEM ONLINE" before the pixel dissolve starts.
const BOOT_MIN_MS = 1100;
const BOOT_SETTLE_MS = 420;
// How long the dissolve + hero entrance needs before the overlay can unmount.
const BOOT_DISSOLVE_MS = 1200;

// ---------------------------------------------------------------------------
// Pinned timeline
//
// Every stage is a full viewport width; `pin` is the progress range during
// which it sits still, and between two pins the track glides one viewport
// with a cosine ease. `jump` is where a programmatic jump lands: inside the
// pin, past the point where the stage's own entrance animation has settled.
// ---------------------------------------------------------------------------
export interface TimelineStage {
  id: string;
  label: string;
  pin: [number, number];
  jump: number;
}

export const TIMELINE_STAGES: TimelineStage[] = [
  { id: "hero", label: "HERO", pin: [0, 0.09], jump: 0 },
  { id: "story", label: "STORY", pin: [0.13, 0.29], jump: 0.16 },
  { id: "capabilities", label: "CAPABILITIES I", pin: [0.33, 0.39], jump: 0.36 },
  { id: "capabilities-2", label: "CAPABILITIES II", pin: [0.42, 0.48], jump: 0.45 },
  { id: "work", label: "WORK", pin: [0.52, 0.6], jump: 0.575 },
  { id: "impact", label: "IMPACT", pin: [0.64, 0.76], jump: 0.71 },
  { id: "about", label: "ABOUT", pin: [0.8, 1], jump: 0.83 },
];

// Horizontal track offset (in px) for a timeline progress value.
export function trackXForProgress(prog: number, viewportWidth: number): number {
  for (let i = 0; i < TIMELINE_STAGES.length; i++) {
    const { pin } = TIMELINE_STAGES[i];
    if (prog <= pin[1]) return i * viewportWidth;
    const next = TIMELINE_STAGES[i + 1];
    if (!next) break;
    if (prog < next.pin[0]) {
      const t = (prog - pin[1]) / (next.pin[0] - pin[1]);
      const ease = 0.5 - 0.5 * Math.cos(t * Math.PI);
      return i * viewportWidth + ease * viewportWidth;
    }
  }
  return (TIMELINE_STAGES.length - 1) * viewportWidth;
}

// Which stage a progress value is closest to (transitions split at their midpoint).
export function stageIndexForProgress(prog: number): number {
  for (let i = 0; i < TIMELINE_STAGES.length - 1; i++) {
    const mid = (TIMELINE_STAGES[i].pin[1] + TIMELINE_STAGES[i + 1].pin[0]) / 2;
    if (prog < mid) return i;
  }
  return TIMELINE_STAGES.length - 1;
}

// ---------------------------------------------------------------------------
// Glide tuning (all in seconds / progress-per-second, so the feel is identical
// on 60Hz and 144Hz displays).
//
// SMOOTH_TAU  - time constant of the exponential ease toward the scroll target.
// MAX_RATE    - hard ceiling on how fast the timeline can advance from user
//               scrolling. One slide transition spans 0.04 progress, so at
//               0.15/s a fling crosses a slide in roughly 0.3s of glide plus
//               the ease-out tail, rather than skipping through it.
// JUMP_RATE   - ceiling used for menu / HUD jumps, which may need to cover
//               most of the timeline and should not crawl.
// ---------------------------------------------------------------------------
const SMOOTH_TAU = 0.2;
const MAX_RATE = 0.15;
const JUMP_RATE = 0.7;
const SETTLE_EPSILON = 0.00015;

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  typeof window.matchMedia === "function" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const HorizontalScrollContext = createContext<HorizontalScrollContextType>({
  scrollProgress: 0,
  scrollX: 0,
  totalWidth: 0,
  scrollToProgress: () => {},
  isLoaded: false,
  isDesktop: true,
  preloadedFrames: [],
  isMenuOpen: false,
  setIsMenuOpen: () => {},
});

export const useHorizontalScroll = () => useContext(HorizontalScrollContext);

export default function HorizontalLayout({ children }: { children: React.ReactNode }) {
  const outerContainerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollX, setScrollX] = useState(0);
  const [totalWidth, setTotalWidth] = useState(0);
  const [isDesktop, setIsDesktop] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Preloader / Boot Barrier State
  const [isLoaded, setIsLoaded] = useState(false);
  const [isBooted, setIsBooted] = useState(false);
  const [bootPercent, setBootPercent] = useState(0);
  const [bootStatus, setBootStatus] = useState("INITIALIZING BUFFER...");
  const [bootAsset, setBootAsset] = useState("");
  const [bootLog, setBootLog] = useState<string[]>(["MOUNTING RUNTIME ENGINE"]);
  const [preloadedFrames, setPreloadedFrames] = useState<HTMLImageElement[]>([]);

  const targetProgressRef = useRef(0);
  const currentProgressRef = useRef(0);
  // Set by scrollToProgress so the glide loop may use the faster JUMP_RATE
  // until the track has caught up with the requested position.
  const jumpingRef = useRef(false);

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

    const bootStartedAt = performance.now();
    let isCancelled = false;
    let loadedCount = 0;
    let criticalLoaded = 0;
    const frameImages: HTMLImageElement[] = new Array(TOTAL_FRAMES);
    const milestones = new Set<number>();

    const pushLog = (line: string) => {
      setBootLog((prev) => [...prev.slice(-5), line]);
    };

    pushLog(`ALLOCATING FRAME BUFFER · ${TOTAL_FRAMES} FRAMES`);

    const onAssetLoaded = (label: string) => {
      if (isCancelled) return;
      loadedCount++;
      const pct = Math.min(100, Math.round((loadedCount / TOTAL_ASSETS) * 100));
      setBootPercent(pct);
      setBootAsset(label);
      setBootStatus(`BUFFERING ASSETS (${loadedCount}/${TOTAL_ASSETS})`);

      // Milestone lines keep the log moving without printing all 190 assets.
      for (const mark of [25, 50, 75]) {
        if (pct >= mark && !milestones.has(mark)) {
          milestones.add(mark);
          pushLog(`SEQUENCE DECODED · ${mark}%`);
        }
      }
    };

    // Load a single frame
    const loadFrame = (idx: number): Promise<HTMLImageElement> => {
      return new Promise((resolve) => {
        const img = new Image();
        const frameNum = String(idx + 1).padStart(3, "0");
        img.src = `/frames/frame-${frameNum}.webp`;
        const finish = () => {
          frameImages[idx] = img;
          onAssetLoaded(`frame-${frameNum}.webp`);
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
          onAssetLoaded(url.split("/").pop() || url);
          criticalLoaded++;
          if (criticalLoaded === CRITICAL_IMAGES.length) pushLog("CRITICAL ASSETS LINKED");
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

    const timers: number[] = [];

    Promise.all([...workerPromises, ...assetPromises]).then(() => {
      if (isCancelled) return;
      setPreloadedFrames(frameImages);
      setBootPercent(100);
      setBootStatus(`ALL ${TOTAL_FRAMES} FRAMES & ASSETS READY`);
      pushLog("CALIBRATING HORIZONTAL TIMELINE");

      // Hold the boot screen up to its minimum so the sequence reads on a
      // warm cache, then announce and lift it.
      const elapsed = performance.now() - bootStartedAt;
      const holdFor = Math.max(0, BOOT_MIN_MS - elapsed);
      timers.push(
        window.setTimeout(() => {
          if (isCancelled) return;
          pushLog("SYSTEM ONLINE");
          setBootStatus("SYSTEM ONLINE · HANDING OFF TO TIMELINE");
          timers.push(
            window.setTimeout(() => {
              if (isCancelled) return;
              setIsLoaded(true);
              window.scrollTo(0, 0);
              // The overlay stays mounted through its dissolve, then leaves the DOM.
              timers.push(
                window.setTimeout(() => {
                  if (!isCancelled) setIsBooted(true);
                }, BOOT_DISSOLVE_MS)
              );
            }, BOOT_SETTLE_MS)
          );
        }, holdFor)
      );
    });

    return () => {
      isCancelled = true;
      timers.forEach((t) => window.clearTimeout(t));
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
  // - On Desktop: Maps vertical scroll of the tall 1200vh container to a horizontal
  //   translation through a time-based ease with a rate ceiling, so the glide
  //   feels the same on every refresh rate and a fling cannot skip a slide.
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
      window.addEventListener("resize", onMobileScroll);
      onMobileScroll();
      return () => {
        window.removeEventListener("scroll", onMobileScroll);
        window.removeEventListener("resize", onMobileScroll);
      };
    }

    const reducedMotion = prefersReducedMotion();
    let animId: number;

    const onScroll = () => {
      if (!outerContainerRef.current) return;
      const outerRect = outerContainerRef.current.getBoundingClientRect();
      const totalScrollable = outerContainerRef.current.offsetHeight - window.innerHeight;
      const currentScroll = -outerRect.top;

      const progress = Math.min(1, Math.max(0, currentScroll / totalScrollable));
      targetProgressRef.current = progress;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();

    let lastTime = performance.now();

    const loop = (now: number) => {
      // Clamp dt so a background tab returning does not lurch across the timeline.
      const dt = Math.min(0.05, Math.max(0.001, (now - lastTime) / 1000));
      lastTime = now;

      const target = targetProgressRef.current;
      const current = currentProgressRef.current;
      const diff = target - current;

      if (Math.abs(diff) > SETTLE_EPSILON) {
        let next: number;
        if (reducedMotion) {
          next = target;
        } else {
          const alpha = 1 - Math.exp(-dt / SMOOTH_TAU);
          let step = diff * alpha;
          const maxStep = (jumpingRef.current ? JUMP_RATE : MAX_RATE) * dt;
          if (Math.abs(step) > maxStep) step = Math.sign(diff) * maxStep;
          next = current + step;
        }

        const prog = Math.min(1, Math.max(0, next));
        currentProgressRef.current = prog;
        setScrollProgress(prog);

        if (trackRef.current) {
          const x = trackXForProgress(prog, window.innerWidth);
          setScrollX(x);
          trackRef.current.style.transform = `translate3d(-${x}px, 0, 0)`;
        }
      } else {
        if (current !== target) {
          currentProgressRef.current = target;
          setScrollProgress(target);
          if (trackRef.current) {
            const x = trackXForProgress(target, window.innerWidth);
            setScrollX(x);
            trackRef.current.style.transform = `translate3d(-${x}px, 0, 0)`;
          }
        }
        jumpingRef.current = false;
      }

      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(animId);
    };
  }, [isLoaded, isDesktop]);

  // 5. Programmatic scroll helper
  const scrollToProgress = (prog: number) => {
    if (isDesktop) {
      if (!outerContainerRef.current) return;
      const totalScrollable = outerContainerRef.current.offsetHeight - window.innerHeight;
      const targetY = prog * totalScrollable;
      // Move the document instantly and let the glide loop carry the track:
      // one easing curve instead of the browser's smooth scroll stacked on ours.
      jumpingRef.current = true;
      window.scrollTo({ top: targetY, behavior: "instant" as ScrollBehavior });
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
        isMenuOpen,
        setIsMenuOpen,
      }}
    >
      {/* Curtis Fullscreen Navigation & Social Overlay Menu */}
      <CurtisMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Stage rail (desktop) / progress line (mobile) */}
      <TimelineHUD />

      {/* Persistent Floating Top-Right MENU Button (Appears when scrolled past hero) */}
      {isLoaded && scrollProgress > 0.04 && !isMenuOpen && (
        <button
          onClick={() => setIsMenuOpen(true)}
          className="hud-in fixed top-4 right-4 sm:top-6 sm:right-8 z-40 group flex items-center justify-center h-8 px-4 curtis-notch bg-[#050505]/85 backdrop-blur-md border border-[#ffff00]/40 hover:bg-[#ffff00] hover:text-black transition-all cursor-pointer shadow-[0_0_20px_rgba(0,0,0,0.85)]"
        >
          <span className="absolute -top-0.5 -left-0.5 w-1.5 h-1.5 border-t border-l border-[#ffff00]" />
          <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 border-t border-r border-[#ffff00]" />
          <span className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 border-b border-l border-[#ffff00]" />
          <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 border-b border-r border-[#ffff00]" />
          <span className="font-mono text-xs font-bold uppercase tracking-widest text-[#ffff00] group-hover:text-black">
            MENU
          </span>
        </button>
      )}

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
                color="#ffff00"
              />
            </>
          )}
        </div>
      </div>

      {/* Cyber Preloader / Boot Barrier (Blocks scroll until screens and assets are mounted) */}
      {!isBooted && (
        <BootScreen
          percent={bootPercent}
          status={bootStatus}
          asset={bootAsset}
          log={bootLog}
          loaded={isLoaded}
        />
      )}
    </HorizontalScrollContext.Provider>
  );
}
