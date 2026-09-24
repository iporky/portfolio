"use client";

import React from "react";
import { SoundProvider } from "@/components/SoundManager";
import HorizontalLayout from "@/components/HorizontalLayout";
import CurtisHero from "@/components/CurtisHero";
import ScrollyHero from "@/components/ScrollyHero";
import BentoTilesSection from "@/components/BentoTilesSection";
import SelectedProducts from "@/components/SelectedProducts";
import ImpactMetrics from "@/components/ImpactMetrics";
import AboutSection from "@/components/AboutSection";

export default function Home() {
  return (
    <SoundProvider>
      <div id="top" className="relative bg-[#050505] text-white selection:bg-[#9df133] selection:text-black">
        {/* Full Horizontal-Scrolling Engine (Converts mouse wheel scroll into horizontal timeline glide) */}
        <HorizontalLayout>
          {/* Slide 1: Curtis-Style Hero Landing Page (Freestanding Portrait + Scroll-Scramble Quote & Headline + Direction Cue) */}
          <CurtisHero />

          {/* Slide 2: 181-Frame Canvas Scrollytelling Centerpiece (Pinned, Frames 1-181 Full Sequence) */}
          <ScrollyHero />

          {/* Slide 3: Acid-Green Modular Bento Tiles (Reference Image 4: 30+ Products, 10+ Years, Claude, Figma, etc.) */}
          <BentoTilesSection />

          {/* Slide 4: Selected Products & Live Platforms (Konnect App, Konnect Web, Treks For All, Magnum) */}
          <SelectedProducts />

          {/* Slide 4: Enterprise Outcomes (3 Top 10 Fortune 500s, 2 NGOs, 1 Startup) */}
          <ImpactMetrics />


          {/* Slide 6: About The Engineer & Command Center Transmission Deck */}
          <AboutSection />
        </HorizontalLayout>
      </div>
    </SoundProvider>
  );
}
