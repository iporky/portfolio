"use client";

import React, { useEffect, useRef } from "react";

interface DotMatrixBannerProps {
  text?: string;
  className?: string;
}

export default function DotMatrixBanner({
  text = "PORTFOLIO/SHIVANG",
  className = "",
}: DotMatrixBannerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, radius: 60 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    let animId = 0;

    const render = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = container.clientWidth;
      const height = container.clientHeight;

      if (width === 0 || height === 0) return;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.scale(dpr, dpr);

      // Create an offscreen canvas to render text and sample dot positions
      const offscreen = document.createElement("canvas");
      offscreen.width = width;
      offscreen.height = height;
      const offCtx = offscreen.getContext("2d");
      if (!offCtx) return;

      // Target max text width is 84% of container width to guarantee P and G are never clipped
      const maxTextWidth = width * 0.84;
      let fontSize = Math.floor(height * 0.70);
      offCtx.font = `900 ${fontSize}px "Space Grotesk", "Inter", -apple-system, sans-serif`;
      let measuredWidth = offCtx.measureText(text).width;

      if (measuredWidth > maxTextWidth) {
        fontSize = Math.floor(fontSize * (maxTextWidth / measuredWidth));
      }
      fontSize = Math.min(fontSize, Math.floor(height * 0.72));
      offCtx.font = `900 ${fontSize}px "Space Grotesk", "Inter", -apple-system, sans-serif`;
      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";
      offCtx.fillStyle = "#000000";
      offCtx.fillText(text, width / 2, height / 2);

      const imgData = offCtx.getImageData(0, 0, width, height).data;

      // Determine dot grid spacing (crisp and high resolution)
      const dotSpacing = Math.max(3, Math.floor(width / 180));
      const baseDotRadius = dotSpacing * 0.36;

      ctx.clearRect(0, 0, width, height);

      const mouse = mouseRef.current;

      for (let y = 0; y < height; y += dotSpacing) {
        for (let x = 0; x < width; x += dotSpacing) {
          const pixelIndex = (y * width + x) * 4;
          const alpha = imgData[pixelIndex + 3];

          if (alpha > 40) {
            // Distance from mouse for interactive ripple
            const dx = x - mouse.x;
            const dy = y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            let hoverOffset = 0;
            let dotRadius = baseDotRadius;

            if (dist < mouse.radius) {
              const force = (1 - dist / mouse.radius);
              hoverOffset = force * 4;
              dotRadius = baseDotRadius * (1 + force * 0.4);
            }

            // Draw subtle shadow dot (authentic drop shadow dot matrix in Image 2)
            ctx.fillStyle = "rgba(10, 10, 10, 0.22)";
            ctx.beginPath();
            ctx.arc(x + 1.2, y + 1.8 + hoverOffset, dotRadius * 0.9, 0, Math.PI * 2);
            ctx.fill();

            // Draw main black dot
            ctx.fillStyle = "rgba(10, 10, 10, 0.96)";
            ctx.beginPath();
            ctx.arc(x, y + hoverOffset, dotRadius, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    };

    render();

    const handleResize = () => {
      render();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      render();
    };

    const handleMouseLeave = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
      render();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect();
        mouseRef.current.x = e.touches[0].clientX - rect.left;
        mouseRef.current.y = e.touches[0].clientY - rect.top;
        render();
      }
    };

    const handleTouchEnd = () => {
      mouseRef.current.x = -1000;
      mouseRef.current.y = -1000;
      render();
    };

    window.addEventListener("resize", handleResize);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("touchmove", handleTouchMove, { passive: true });
    canvas.addEventListener("touchend", handleTouchEnd);

    return () => {
      window.removeEventListener("resize", handleResize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("touchmove", handleTouchMove);
      canvas.removeEventListener("touchend", handleTouchEnd);
      cancelAnimationFrame(animId);
    };
  }, [text]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden select-none pointer-events-auto h-[60px] sm:h-[80px] lg:h-[12vw] ${className}`}
      style={{ minHeight: "55px" }}
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block cursor-crosshair touch-none"
      />
    </div>
  );
}
