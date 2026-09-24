"use client";

import React from "react";
import Image from "next/image";
import { Terminal, ChevronRight } from "lucide-react";
import { useSound } from "./SoundManager";
import ScrambleText from "./ScrambleText";

export default function CaseStudies() {
  const { playHover } = useSound();

  const projects = [
    {
      id: "247ai",
      company: "[24]7.ai",
      logo: "/companies/247ai.svg",
      whiteBg: false,
      period: "Sep 2020 – Present",
      role: "SDE III",
      location: "Bangalore, India",
      tagline: "Enterprise Conversational AI Runtime & Self-Serve Ad Tech Automation",
      color: "#00f5d4",
      highlights: [
        {
          title: "Agentic Conversational AI Runtime",
          desc: "Architected an async Python FastAPI backend with Node.js integration layer for intent resolution, session management, and Redis-backed state. Designed a configurable React/TypeScript/Redux-Saga chat UI with WebSockets and resumable sessions.",
          tech: ["FastAPI", "Python", "Node.js", "Redis", "React", "TypeScript", "WebSockets"],
        },
        {
          title: "Target Selfserve Ad Delivery Platform",
          desc: "Scaled a self-serve ad delivery platform integrated with Google DV360 and Meta Campaign APIs on a React + Node.js/MongoDB architecture.",
          tech: ["React", "Node.js", "MongoDB", "DV360 API", "Meta Marketing API"],
        },
      ],
      architectureDiagram: `[Client WebSocket] <--> [Node.js Gateway] <--> [FastAPI Intent Engine] <--> [Redis State]`,
    },
    {
      id: "konnect",
      company: "Konnect",
      logo: "/projects/konnect_logo.png",
      whiteBg: true,
      period: "Jun 2025 – Apr 2026",
      role: "Full-Stack Engineer (Freelance / Seoul Remote)",
      location: "Seoul, South Korea (Remote)",
      tagline: "AI-Powered Korea Living Platform — Cross-Platform App & 4-Service RAG",
      color: "#ff2a5f",
      highlights: [
        {
          title: "Solo Cross-Platform Mobile App (Android + iOS)",
          desc: "Built the mobile app solo in React Native/Expo: Firebase auth, streaming NDJSON search, EN/KR bilingual i18n, voice search, and signed store release pipelines.",
          tech: ["React Native", "Expo", "NDJSON", "Firebase", "TypeScript"],
        },
        {
          title: "4-Service FastAPI Microservices Backend",
          desc: "Engineered distributed microservices (Query, Discovery, Enrichment, Publisher) over Kafka, PostgreSQL/pgvector, Redis, and a 34-intent RAG pipeline with Google GenAI & Naver.",
          tech: ["FastAPI", "Kafka", "PostgreSQL", "pgvector", "Google GenAI"],
        },
      ],
      architectureDiagram: `[React Native App] ---> [Kafka Message Broker] ---> [FastAPI RAG + pgvector]`,
    },
    {
      id: "ge",
      company: "GE Aerospace",
      logo: "/companies/ge_aerospace.svg",
      whiteBg: false,
      period: "Jun 2016 – Sep 2020",
      role: "Senior Software Engineer",
      location: "Bangalore, India",
      tagline: "Aviation Big Data Visualizer ($3M Saved) & NLP Resolution Engine",
      color: "#00f0ff",
      highlights: [
        {
          title: "ViewIT — Aviation Visualizer (Saved $3M, Best Product Award)",
          desc: "Architected ViewIT telemetry visualizer with Plotly.js & d3.js, replacing commercial Spotfire licenses across multiple divisions and saving $3,000,000. Won GE Best Engineering Product Award.",
          tech: ["Plotly.js", "d3.js", "JavaScript", "Python", "Data Visualization"],
        },
        {
          title: "DTi Support NLP Search (90% Triage Cut)",
          desc: "Customized SpaCy with aviation entity matchers and GloVe models over Flask APIs & Vue/Vuex UI, cutting resolution time by 90% and saving $200k/yr.",
          tech: ["SpaCy", "GloVe", "Python Flask", "Vue.js", "NLP"],
        },
      ],
      architectureDiagram: `[Telemetry Data] ---> [Python Engine] ---> [Plotly.js / d3.js] ($3M Saved)`,
    },
    {
      id: "verizon",
      company: "Verizon",
      logo: "/companies/verizon.svg",
      whiteBg: false,
      period: "Aug 2014 – Jun 2016",
      role: "Software Engineer",
      location: "Chennai, India",
      tagline: "Healthcare Universal Identity Services (UIS) & High-Assurance Cryptography",
      color: "#a855f7",
      highlights: [
        {
          title: "Universal Identity Services (UIS)",
          desc: "Delivered high-assurance digital identity credentialing systems for healthcare professionals featuring cryptographic hash encryption, security audits, and CI/CD pipelines.",
          tech: ["Cryptography", "Security Compliance", "CI/CD", "Oracle DB"],
        },
      ],
      architectureDiagram: `[Healthcare Portal] <--> [Cryptographic UIS Gateway] <--> [Audited DB Migration]`,
    },
  ];

  return (
    <section id="architecture" className="relative w-screen max-w-screen h-screen shrink-0 bg-[#050505] text-white border-r border-white/[0.06] overflow-y-auto sm:overflow-hidden flex flex-col justify-center px-6 sm:px-12 py-8 selection:bg-[#00f5d4] selection:text-black">
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
        {/* Section Title */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 mb-2 rounded cyber-notch-sm bg-[#9df133]/10 border border-[#9df133]/30 text-[#9df133] font-mono text-xs tracking-wider">
              <Terminal className="w-3.5 h-3.5" />
              <span>// 05 &middot; ENTERPRISE PRODUCTION ARCHITECTURES</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              Production Architectures &amp; <br />
              <span className="text-[#9df133]">
                Enterprise Systems
              </span>
            </h2>
          </div>
          <p className="font-mono text-xs sm:text-sm text-white/50 max-w-sm">
            Direct impact across distributed microservices, agentic conversational AI, and ad tech.
          </p>
        </div>

        {/* Open 2x2 Grid of All Enterprise Production Architectures (Zero Tabs) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((proj) => (
            <div
              key={proj.id}
              onMouseEnter={playHover}
              className="rounded-xl cyber-glass border border-white/10 hover:border-white/20 p-4 sm:p-5 flex flex-col justify-between transition-all duration-300 shadow-xl overflow-hidden"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-white/10 gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div
                      className={`relative h-8 w-24 p-1 rounded border flex items-center justify-center shrink-0 ${
                        proj.whiteBg
                          ? "bg-white border-white shadow-sm"
                          : "bg-white/[0.04] border-white/10"
                      }`}
                    >
                      <Image
                        src={proj.logo}
                        alt={proj.company}
                        fill
                        className={`object-contain p-0.5 ${
                          proj.whiteBg ? "" : "filter brightness-125"
                        }`}
                      />
                    </div>
                    <div>
                      <h3
                        className="text-sm sm:text-base font-bold font-mono"
                        style={{ color: proj.color }}
                      >
                        <ScrambleText text={proj.company} />
                      </h3>
                      <p className="text-[11px] text-white/60 font-sans truncate max-w-[220px]">
                        {proj.tagline}
                      </p>
                    </div>
                  </div>

                  <div className="font-mono text-[10px] text-white/40 text-right shrink-0">
                    <div>{proj.period.split("–")[0]}</div>
                  </div>
                </div>

                {/* Architecture Diagram snippet */}
                <div className="mb-3 p-2 rounded bg-black/80 border border-white/10 font-mono text-[10px] text-[#00f5d4]/90 overflow-x-auto">
                  <pre className="whitespace-pre leading-relaxed">{proj.architectureDiagram}</pre>
                </div>

                {/* Highlights */}
                <div className="space-y-2 mb-3">
                  {proj.highlights.slice(0, 1).map((item, idx) => (
                    <div key={idx} className="p-2 rounded bg-white/[0.02] border border-white/[0.06]">
                      <div className="flex items-center gap-1.5 mb-1">
                        <ChevronRight className="w-3 h-3 shrink-0" style={{ color: proj.color }} />
                        <h4 className="text-[11px] font-semibold text-white/95">{item.title}</h4>
                      </div>
                      <p className="text-[10px] text-white/65 leading-relaxed font-sans pl-4">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tech tags */}
              <div className="flex flex-wrap gap-1 pt-2 border-t border-white/[0.06]">
                {proj.highlights[0]?.tech.slice(0, 4).map((t) => (
                  <span
                    key={t}
                    className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-white/[0.04] text-white/60"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
