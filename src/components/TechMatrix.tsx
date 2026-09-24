"use client";

import React, { useRef, useState } from "react";
import { Cpu, Layout, Smartphone, Server, Wrench, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { useSound } from "./SoundManager";
import ScrambleText from "./ScrambleText";

export default function TechMatrix() {
  const { playClick, playHover } = useSound();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("ai");

  const categories = [
    { id: "ai", label: "AI & AGENTIC", icon: Cpu },
    { id: "frontend", label: "FRONTEND MASTERY", icon: Layout },
    { id: "mobile", label: "MOBILE (REACT NATIVE)", icon: Smartphone },
    { id: "backend", label: "BACKEND & DISTRIBUTED", icon: Server },
    { id: "platform", label: "PLATFORM & DEVOPS", icon: Wrench },
  ];

  const allSkills = [
    // AI & Agentic
    { name: "Claude Code", category: "ai", level: "EXPERT", note: "Autonomous issue-tracked sessions, test generation & refactoring", hot: true },
    { name: "Agentic Workflows", category: "ai", level: "EXPERT", note: "End-to-end solo engineering pairing AI tools with sound architecture", hot: true },
    { name: "RAG Pipelines", category: "ai", level: "ADVANCED", note: "Bilingual intent-aware retrieval (34 intents, 31 categories)", hot: true },
    { name: "pgvector & Embeddings", category: "ai", level: "ADVANCED", note: "PostgreSQL vector similarity search for semantic discovery", hot: false },
    { name: "Google GenAI & Naver", category: "ai", level: "ADVANCED", note: "Multi-provider LLM integrations with fallback handling", hot: false },
    { name: "Prompt Design", category: "ai", level: "EXPERT", note: "Structured schema generation & context steering", hot: false },

    // Frontend
    { name: "React & Next.js", category: "frontend", level: "EXPERT", note: "12+ yrs experience, App Router, SSR, Server Components", hot: true },
    { name: "TypeScript", category: "frontend", level: "EXPERT", note: "Strict type safety across large monorepos with Pyright/tsc", hot: false },
    { name: "Framer Motion", category: "frontend", level: "EXPERT", note: "Scroll-linked canvas animations, micro-interactions, layout transitions", hot: true },
    { name: "Tailwind CSS", category: "frontend", level: "EXPERT", note: "Tailored design tokens, dark themes, and responsive design systems", hot: false },
    { name: "Redux & Redux-Saga", category: "frontend", level: "EXPERT", note: "Complex async state machines, WebSocket session managers", hot: false },
    { name: "HTML5 Canvas / d3.js", category: "frontend", level: "ADVANCED", note: "High-performance telemetry visualizers and 60fps canvas scrubbers", hot: true },

    // Mobile
    { name: "React Native & Expo", category: "mobile", level: "EXPERT", note: "Solo built cross-platform mobile apps for Android and iOS", hot: true },
    { name: "Firebase Auth", category: "mobile", level: "ADVANCED", note: "Multi-provider OAuth, session verification, social logins", hot: false },
    { name: "Streaming NDJSON", category: "mobile", level: "ADVANCED", note: "Low-latency streaming search updates on mobile feeds", hot: true },
    { name: "Play Store & App Store", category: "mobile", level: "ADVANCED", note: "Signed production build & release automation pipelines", hot: false },

    // Backend
    { name: "Python & FastAPI", category: "backend", level: "EXPERT", note: "Async microservices, Pydantic v2 validation, WebSocket gateways", hot: true },
    { name: "Node.js", category: "backend", level: "EXPERT", note: "High-concurrency integration layers, MongoDB backend APIs", hot: false },
    { name: "Apache Kafka", category: "backend", level: "ADVANCED", note: "Event-driven microservice pub/sub message brokers", hot: true },
    { name: "PostgreSQL & Redis", category: "backend", level: "EXPERT", note: "Relational modeling, vector search, distributed session caches", hot: false },
    { name: "MongoDB", category: "backend", level: "ADVANCED", note: "Document store for dynamic ad campaign configuration", hot: false },
    { name: "FFmpeg Media Pipeline", category: "backend", level: "ADVANCED", note: "Automated video generation with dynamic audio/video assembly", hot: true },

    // Platform & DevOps
    { name: "Docker", category: "platform", level: "ADVANCED", note: "Containerized monorepo environments and reproducible production images", hot: false },
    { name: "CI/CD (Jenkins, Actions)", category: "platform", level: "ADVANCED", note: "Automated test suites, SonarQube static audits, release pipelines", hot: false },
    { name: "pnpm Monorepos", category: "platform", level: "EXPERT", note: "Workspace dependency management, shared configs, unified builds", hot: false },
    { name: "SonarQube & Pyright", category: "platform", level: "ADVANCED", note: "Strict type checking and automated vulnerability scans", hot: false },
  ];

  const filteredSkills = allSkills.filter((s) => s.category === selectedCategory);

  const scrollLeft = () => {
    playClick();
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -320, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    playClick();
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 320, behavior: "smooth" });
    }
  };

  return (
    <section id="tech-stack" className="relative w-screen xl:w-[115vw] h-screen shrink-0 bg-[#050505] text-white border-r border-white/[0.06] overflow-y-auto sm:overflow-hidden flex flex-col justify-center px-6 sm:px-12 py-8 selection:bg-[#00f5d4] selection:text-black">
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
              <Cpu className="w-3.5 h-3.5" />
              <span>// 04 &middot; HORIZONTAL SKILLS REEL &amp; CAPABILITIES</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Tools &amp; <br />
              <span className="text-[#9df133]">
                Engineering Domain
              </span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={scrollLeft}
              onMouseEnter={playHover}
              className="p-2 rounded curtis-notch bg-white/[0.04] hover:bg-[#00f5d4] hover:text-black border border-white/10 transition-all cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={scrollRight}
              onMouseEnter={playHover}
              className="p-2 rounded curtis-notch bg-white/[0.04] hover:bg-[#00f5d4] hover:text-black border border-white/10 transition-all cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filter Pills without 'ALL DOMAINS' */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  playClick();
                  setSelectedCategory(cat.id);
                }}
                onMouseEnter={playHover}
                className={`flex items-center gap-2 px-3 py-1.5 rounded curtis-notch font-mono text-xs transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#00f5d4] text-black font-bold shadow-[0_0_15px_rgba(0,245,212,0.4)]"
                    : "bg-white/[0.03] text-white/60 hover:text-white hover:bg-white/[0.07] border border-white/10"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Horizontal Scrolling Track */}
        <div
          ref={scrollContainerRef}
          className="flex gap-4 overflow-x-auto pb-4 pt-1 scroll-smooth select-none"
        >
          {filteredSkills.map((skill) => (
            <div
              key={skill.name}
              onMouseEnter={playHover}
              className="shrink-0 w-72 sm:w-80 p-4 rounded-xl cyber-glass border border-white/10 hover:border-[#00f5d4]/40 transition-all flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-white group-hover:text-[#00f5d4] transition-colors truncate">
                      <ScrambleText text={skill.name} />
                    </span>
                    {skill.hot && (
                      <span className="flex items-center gap-0.5 text-[8px] font-mono px-1 py-0.2 rounded bg-[#ff2a5f]/15 border border-[#ff2a5f]/30 text-[#ff2a5f]">
                        <Sparkles className="w-2.5 h-2.5" />
                        CORE
                      </span>
                    )}
                  </div>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-white/[0.05] border border-white/10 text-white/50">
                    {skill.level}
                  </span>
                </div>

                <p className="text-xs text-white/60 leading-relaxed font-sans mb-3 line-clamp-3">
                  {skill.note}
                </p>
              </div>

              <div className="pt-2 border-t border-white/[0.05] flex items-center justify-between text-[10px] font-mono text-white/40">
                <span>{skill.category.toUpperCase()}</span>
                <span className="text-[#00f5d4]">100% VERIFIED</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
