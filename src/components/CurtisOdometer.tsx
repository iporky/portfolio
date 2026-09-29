"use client";

import React from "react";

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

// Odometer for stat values like "30+", "12+", "7+", "99.98%", "94.6%". Shared
// by the capabilities tiles and the outcomes header so numbers roll in the
// same way everywhere on the timeline.
export default function CurtisOdometer({
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
