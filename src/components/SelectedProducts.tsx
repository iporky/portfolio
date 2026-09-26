"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ExternalLink, Smartphone, Globe, Sparkles, HeartHandshake, BookOpen } from "lucide-react";
import { useSound } from "./SoundManager";
import { useHorizontalScroll } from "./HorizontalLayout";
import ScrambleText from "./ScrambleText";

export default function SelectedProducts() {
  const { playClick, playHover } = useSound();
  const { scrollProgress, isDesktop } = useHorizontalScroll();
  const [mobileRevealed, setMobileRevealed] = useState<boolean[]>(() => new Array(4).fill(false));
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (isDesktop) return;

    const onScroll = () => {
      const vh = window.innerHeight;
      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        if (rect.top < vh * 0.90) {
          setMobileRevealed((prev) => {
            if (prev[i]) return prev;
            const next = [...prev];
            next[i] = true;
            return next;
          });
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [isDesktop]);

  const products = [
    {
      title: "Konnect Mobile App",
      badge: "EXPO / REACT NATIVE",
      url: "https://play.google.com/store/apps/details?id=com.konnect.kr&hl=en_IN",
      image: "/projects/konnect_app_banner.png",
      imageType: "photo",
      accent: "#9df133",
      threshold: 0.522,
      desc: "Solo cross-platform mobile app in React Native/Expo featuring AI travel companion Kiki. Firebase auth, streaming NDJSON search, EN/KR i18n, voice search, and signed Play Store release pipelines.",
      tags: ["React Native", "Expo", "Travel with Kiki", "NDJSON", "Play Store"],
      icon: Smartphone,
    },
    {
      title: "Konnect Web Platform",
      badge: "AI RAG MICROSERVICES",
      url: "https://konnect.kr",
      image: "/projects/konnect_logo.png",
      imageType: "logo",
      whiteBg: true,
      accent: "#ff2a5f",
      threshold: 0.538,
      desc: "Korea's leading foreigner living portal. 4-service FastAPI microservices over Kafka, pgvector, Redis, and bilingual RAG with Google GenAI & Naver.",
      tags: ["FastAPI", "Kafka", "pgvector", "Redis", "Google GenAI"],
      icon: Globe,
    },
    {
      title: "Treks For All",
      badge: "NGO / SOCIAL IMPACT",
      url: "https://treksforall.in",
      image: "/projects/treksforall.webp",
      imageType: "photo",
      accent: "#9df133",
      threshold: 0.554,
      desc: "Inclusive adaptive travel platform making the outdoors barrier-free for persons with disabilities. Himalayan treks, accessible river expeditions, and camps.",
      tags: ["Inclusive Travel", "Next.js", "Social Impact", "High Performance"],
      icon: HeartHandshake,
    },
    {
      title: "Magnum Custom Publishing",
      badge: "ENTERPRISE PUBLISHING",
      url: "https://magnumcustompublishing.com",
      image: "/projects/magnum_logo.png",
      imageType: "logo",
      whiteBg: true,
      accent: "#f59e0b",
      threshold: 0.570,
      desc: "Custom publishing portal delivering 360-degree editorial, layout, cover design, and book production with 500+ published titles.",
      tags: ["Editorial", "Next.js", "Cover Design", "500+ Books"],
      icon: BookOpen,
    },
  ];

  return (
    <section id="selected-products" className="relative w-full lg:w-screen max-w-screen h-auto min-h-screen lg:h-screen shrink-0 bg-[#050505] text-white border-t lg:border-t-0 lg:border-r border-white/[0.06] overflow-visible lg:overflow-hidden flex flex-col justify-center px-4 sm:px-8 lg:px-12 py-16 lg:py-8 selection:bg-[#9df133] selection:text-black">
      {/* 6-Column Vertical Guidelines */}
      <div className="shared-grid-lines">
        <div className="shared-v-line" />
        <div className="shared-v-line" />
        <div className="shared-v-line" />
        <div className="shared-v-line" />
        <div className="shared-v-line" />
        <div className="shared-v-line" />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10 my-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 mb-2 rounded cyber-notch-sm bg-[#9df133]/10 border border-[#9df133]/30 text-[#9df133] font-mono text-xs tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>// 02 &middot; SELECTED PRODUCTS &amp; APPS</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Production Apps &amp; <br />
              <span className="text-[#9df133]">
                Live Platforms
              </span>
            </h2>
          </div>
          <p className="font-mono text-xs sm:text-sm text-white/50 max-w-sm">
            Direct production apps engineered across mobile, web, and microservices backends.
          </p>
        </div>

        {/* 4 Cards Grid - Staggered Appearance Tied to Scroll on Desktop, Immediately Visible on Mobile */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((prod, idx) => {
            const Icon = prod.icon;
            const isRevealed = isDesktop
              ? (scrollProgress >= prod.threshold || scrollProgress >= 0.58)
              : mobileRevealed[idx];
            return (
              <div
                key={prod.title}
                ref={(el) => { cardRefs.current[idx] = el; }}
                onMouseEnter={playHover}
                style={{
                  transform: isRevealed ? "translate3d(0, 0, 0)" : "translate3d(0, 36px, 0)",
                  opacity: isRevealed ? 1 : 0,
                  filter: isRevealed ? "blur(0px)" : "blur(4px)",
                  transition: "transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.55s ease-out, filter 0.55s ease-out",
                }}
                className="group relative rounded-xl cyber-glass border border-white/10 hover:border-[#9df133]/50 hover:shadow-[0_0_25px_rgba(157,241,51,0.12)] transition-all duration-300 p-5 flex flex-col justify-between overflow-hidden shadow-xl"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="px-2 py-0.5 rounded cyber-notch-sm font-mono text-[9px] tracking-wider font-bold uppercase transition-colors"
                      style={{
                        backgroundColor: `${prod.accent}15`,
                        color: prod.accent,
                        border: `1px solid ${prod.accent}30`,
                      }}
                    >
                      {prod.badge}
                    </span>

                    <a
                      href={prod.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={playClick}
                      className="p-1.5 rounded cyber-notch-sm bg-white/[0.04] hover:bg-[#9df133]/15 text-white/70 hover:text-[#9df133] border border-white/10 hover:border-[#9df133]/40 transition-all font-mono text-[10px] flex items-center gap-1"
                    >
                      <span>LIVE</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Thumbnail / Logo box */}
                  <div
                    className={`relative w-full h-36 rounded-lg overflow-hidden mb-3 border transition-all ${
                      prod.whiteBg
                        ? "bg-white border-white/40 shadow-inner flex items-center justify-center p-4 group-hover:border-white"
                        : "bg-black/60 border-white/10 flex items-center justify-center p-2"
                    }`}
                  >
                    {prod.imageType === "photo" ? (
                      <>
                        <Image
                          src={prod.image}
                          alt={prod.title}
                          fill
                          className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                          sizes="300px"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                      </>
                    ) : (
                      <div className="relative w-full h-full flex items-center justify-center p-2 group-hover:scale-105 transition-transform duration-300">
                        <Image
                          src={prod.image}
                          alt={prod.title}
                          width={220}
                          height={70}
                          className="max-h-20 max-w-[85%] object-contain"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-1.5">
                    <Icon className="w-4 h-4 shrink-0 transition-colors group-hover:!text-[#9df133]" style={{ color: prod.accent }} />
                    <h3 className="text-base font-bold font-mono text-white group-hover:text-[#9df133] transition-colors truncate">
                      <ScrambleText text={prod.title} />
                    </h3>
                  </div>

                  <p className="text-xs text-white/60 leading-relaxed font-sans line-clamp-3 mb-3">
                    {prod.desc}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1 pt-2 border-t border-white/[0.05]">
                  {prod.tags.slice(0, 3).map((t) => (
                    <span
                      key={t}
                      className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-white/[0.03] border border-white/[0.08] text-white/50"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
