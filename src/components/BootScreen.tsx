"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

interface BootScreenProps {
  percent: number; // real asset progress, 0-100
  status: string;
  asset: string; // last asset decoded, shown as a live ticker
  log: string[]; // milestone lines, oldest first
  loaded: boolean; // true once the barrier lifts: content fades, grid dissolves
}

// Dissolve grid. Same 14x9 cell field as the in-timeline PixelTransition so
// the boot hand-off uses the site's own right-to-left pixel wipe.
const COLUMNS = 14;
const ROWS = 9;
const DISSOLVE_SPREAD_MS = 480;
const DISSOLVE_JITTER_MS = 160;

export default function BootScreen({ percent, status, asset, log, loaded }: BootScreenProps) {
  // The displayed percentage eases toward the real one so it climbs like a
  // counter instead of jumping in bursts as parallel downloads land.
  const [shown, setShown] = useState(0);
  const shownRef = useRef(0);

  useEffect(() => {
    let animId = 0;
    let last = performance.now();
    const target = loaded ? 100 : percent;

    const tick = (now: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (now - last) / 1000));
      last = now;
      const diff = target - shownRef.current;
      if (Math.abs(diff) < 0.2) {
        shownRef.current = target;
        setShown(target);
        return;
      }
      // Ease quickly once the real work is done so the counter reads 100 by
      // the time the status line announces the hand-off.
      const tau = target >= 100 ? 0.06 : 0.14;
      shownRef.current += diff * (1 - Math.exp(-dt / tau));
      setShown(Math.floor(shownRef.current));
      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animId);
  }, [percent, loaded]);

  const cells = useMemo(() => {
    const list: { key: string; delay: number }[] = [];
    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLUMNS; c++) {
        // Rightmost columns lift first, with a deterministic jitter per cell.
        const base = ((COLUMNS - 1 - c) / COLUMNS) * DISSOLVE_SPREAD_MS;
        const jitter = (Math.sin(r * 3.7 + c * 5.3) * 0.5 + 0.5) * DISSOLVE_JITTER_MS;
        list.push({ key: `${r}-${c}`, delay: Math.round(base + jitter) });
      }
    }
    return list;
  }, []);

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy={!loaded}
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center select-none ${
        loaded ? "pointer-events-none" : "pointer-events-auto"
      }`}
    >
      {/* Solid base: covers any hairline between grid cells while loading, and
          steps aside as soon as the dissolve begins. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[#050505] transition-opacity duration-200 ease-out"
        style={{ opacity: loaded ? 0 : 1 }}
      />

      {/* Pixel dissolve field */}
      <div
        aria-hidden
        className="absolute inset-0 grid w-full h-full"
        style={{
          gridTemplateColumns: `repeat(${COLUMNS}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))`,
        }}
      >
        {cells.map(({ key, delay }) => (
          <div
            key={key}
            className="w-full h-full bg-[#050505] transition-opacity duration-300 ease-out"
            style={{
              opacity: loaded ? 0 : 1,
              transitionDelay: loaded ? `${delay}ms` : "0ms",
            }}
          />
        ))}
      </div>

      {/* Fine background grid */}
      <div
        aria-hidden
        className="absolute inset-0 cyber-grid pointer-events-none transition-opacity duration-300"
        style={{ opacity: loaded ? 0 : 0.2 }}
      />

      {/* Boot panel */}
      <div
        className={`relative z-10 max-w-md w-full px-6 flex flex-col items-center text-center transition-all duration-300 ease-out ${
          loaded ? "opacity-0 -translate-y-2" : "opacity-100 translate-y-0"
        }`}
      >
        {/* Corner brackets */}
        <span aria-hidden className="absolute -top-3 left-2 w-3 h-3 border-t border-l border-[#ffff00]/60" />
        <span aria-hidden className="absolute -top-3 right-2 w-3 h-3 border-t border-r border-[#ffff00]/60" />
        <span aria-hidden className="absolute -bottom-3 left-2 w-3 h-3 border-b border-l border-[#ffff00]/60" />
        <span aria-hidden className="absolute -bottom-3 right-2 w-3 h-3 border-b border-r border-[#ffff00]/60" />

        <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded cyber-notch-sm bg-[#ffff00]/10 border border-[#ffff00]/30 text-[#ffff00] font-mono text-xs tracking-wider">
          <span className="w-2 h-2 rounded-full bg-[#ffff00] animate-pulse" />
          <span>// SYSTEM BOOT &middot; RUNTIME ENGINE</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white mb-4">
          PORTFOLIO / <span className="text-[#ffff00]">SHIVANG</span>
        </h1>

        {/* Rolling percentage */}
        <div className="font-mono text-6xl sm:text-7xl font-black tabular-nums leading-none text-white mb-5">
          {shown}
          <span className="text-[#ffff00] text-2xl sm:text-3xl align-top ml-1">%</span>
        </div>

        {/* Neon Yellow Progress Bar with a lit head */}
        <div className="w-full bg-white/10 rounded-full h-1.5 mb-3 overflow-hidden p-0.5 border border-white/20">
          <div
            className="relative bg-[#ffff00] h-full rounded-full shadow-[0_0_12px_#ffff00]"
            style={{ width: `${shown}%`, transition: "width 120ms linear" }}
          >
            <span className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-[0_0_10px_#ffffff]" />
          </div>
        </div>

        <div className="flex items-center justify-between w-full font-mono text-[11px] text-white/50">
          <span className="uppercase tracking-wider">{status}</span>
          <span className="text-[#ffff00] font-bold tabular-nums">{shown}%</span>
        </div>

        {/* Live asset ticker */}
        <div className="mt-2 w-full font-mono text-[10px] text-white/35 text-left truncate">
          <span className="text-[#ffff00]/70 mr-2">DECODE</span>
          <span className="tabular-nums">{asset || "—"}</span>
        </div>

        {/* Milestone log */}
        <div className="mt-4 w-full h-[7.5rem] overflow-hidden flex flex-col justify-end text-left font-mono text-[10px] leading-5 border-t border-white/[0.08] pt-2">
          {log.map((line, i) => (
            <div
              key={line}
              className="boot-line flex gap-2"
              style={{ opacity: 0.35 + 0.65 * ((i + 1) / log.length) }}
            >
              <span className="text-[#ffff00]">&gt;</span>
              <span className="text-white/85 uppercase tracking-wider">{line}</span>
            </div>
          ))}
          <div className="flex items-center gap-2 text-[#ffff00]">
            <span>&gt;</span>
            <span className="inline-block w-2 h-3 bg-[#ffff00] animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
