"use client";

import React, { useMemo } from "react";

interface PixelTransitionProps {
  scrollProgress: number;
  triggerStart: number;
  triggerEnd: number;
  columns?: number;
  rows?: number;
  color?: string; // default is black "#050505"
}

export default function PixelTransition({
  scrollProgress,
  triggerStart,
  triggerEnd,
  columns = 12,
  rows = 8,
  color = "#050505",
}: PixelTransitionProps) {
  // If outside range, don't render anything or fully transparent
  if (scrollProgress < triggerStart || scrollProgress > triggerEnd) {
    return null;
  }

  // Normalized transition progress [0, 1]
  const progress = (scrollProgress - triggerStart) / (triggerEnd - triggerStart);

  // Generate grid cells with pseudo-random staggered threshold based on x and y
  // Wave travels from right to left (x), revealing the next slide from the right side (Reference Image 5)
  const cells = useMemo(() => {
    const list = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < columns; c++) {
        // Rightmost columns resolve first
        const baseThreshold = (columns - 1 - c) / columns;
        // Pseudo-random jitter based on coordinates
        const jitter = Math.sin(r * 3.7 + c * 5.3) * 0.15;
        const cellThreshold = Math.max(0, Math.min(0.95, baseThreshold + jitter));
        list.push({ r, c, threshold: cellThreshold });
      }
    }
    return list;
  }, [rows, columns]);

  return (
    <div
      className="absolute inset-0 z-40 pointer-events-none grid w-full h-full overflow-hidden"
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
      }}
    >
      {cells.map(({ r, c, threshold }) => {
        // As progress goes from 0 to 1, blocks whose threshold > progress remain visible,
        // blocks whose threshold <= progress disappear (revealing the slide underneath)
        const isBlockPresent = threshold > progress;
        return (
          <div
            key={`${r}-${c}`}
            className="w-full h-full transition-opacity duration-150"
            style={{
              backgroundColor: color,
              opacity: isBlockPresent ? 1 : 0,
            }}
          />
        );
      })}
    </div>
  );
}
