"use client";

import React, { useState } from "react";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Copy, 
  Check, 
  Download, 
  ArrowUp, 
  Terminal, 
  Github, 
  Linkedin,
  Sparkles
} from "lucide-react";
import { useSound } from "./SoundManager";

export default function Footer() {
  const { playClick, playHover, playSuccess } = useSound();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const email = "chauhanshivang4@gmail.com";
  const phone = "+91 91767 88879";

  const handleCopyEmail = () => {
    playSuccess();
    navigator.clipboard.writeText(email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleCopyPhone = () => {
    playSuccess();
    navigator.clipboard.writeText(phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  const scrollToTop = () => {
    playClick();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="contact" className="relative bg-[#050505] text-white pt-24 pb-12 border-t border-white/10 overflow-hidden">
      {/* Background Cyber Grid */}
      <div className="absolute inset-0 cyber-grid opacity-30 pointer-events-none" />

      {/* Ambient Top Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-[#00f5d4]/10 to-transparent blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Call To Action Banner */}
        <div className="p-8 sm:p-12 rounded-2xl cyber-glass border border-white/15 mb-16 relative overflow-hidden">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 mb-4 rounded cyber-notch-sm bg-[#00f5d4]/10 border border-[#00f5d4]/30 text-[#00f5d4] font-mono text-xs tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>// 06 · INITIATE TRANSMISSION</span>
            </div>
            <h2 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-4 text-white">
              Ready To Scale Your Next Ambitious Architecture?
            </h2>
            <p className="text-sm sm:text-base text-white/60 leading-relaxed font-sans mb-8">
              Available for full-time staff/lead roles, high-impact architectural consulting, and zero-to-one conversational AI builds. Let&apos;s talk engineering.
            </p>

            <div className="flex flex-wrap gap-4">
              {/* Copy Email Button */}
              <button
                onClick={handleCopyEmail}
                onMouseEnter={playHover}
                className="px-5 py-3 rounded cyber-notch font-mono text-xs font-bold text-black bg-[#00f5d4] hover:bg-[#38ffd9] transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(0,245,212,0.35)]"
              >
                {copiedEmail ? <Check className="w-4 h-4 text-black" /> : <Copy className="w-4 h-4 text-black" />}
                <span>{copiedEmail ? "EMAIL COPIED TO CLIPBOARD!" : "COPY EMAIL (CHAUHANSHIVANG4@GMAIL.COM)"}</span>
              </button>

              {/* Download CV */}
              <a
                href="/Shivang_CV.pdf"
                download="Shivang_Chauhan_CV.pdf"
                onClick={playClick}
                onMouseEnter={playHover}
                className="px-5 py-3 rounded cyber-notch font-mono text-xs font-medium text-white/90 bg-white/[0.05] hover:bg-white/10 border border-white/20 transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>DOWNLOAD RESUME (PDF)</span>
              </a>
            </div>
          </div>
        </div>

        {/* Contact Coordinates & Information */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 font-mono text-xs">
          {/* Email Box */}
          <div className="p-5 rounded-lg bg-white/[0.02] border border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-[#00f5d4]/10 text-[#00f5d4]">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <div className="text-white/40 text-[10px]">DIRECT TRANSMISSION</div>
                <a
                  href={`mailto:${email}`}
                  onClick={playClick}
                  className="text-white hover:text-[#00f5d4] transition-colors"
                >
                  {email}
                </a>
              </div>
            </div>
            <button
              onClick={handleCopyEmail}
              className="p-1.5 rounded hover:bg-white/10 text-white/40 hover:text-white transition-colors"
              title="Copy email"
            >
              {copiedEmail ? <Check className="w-3.5 h-3.5 text-[#00f5d4]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Phone Box */}
          <div className="p-5 rounded-lg bg-white/[0.02] border border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-[#ff2a5f]/10 text-[#ff2a5f]">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <div className="text-white/40 text-[10px]">SECURE LINE / WHATSAPP</div>
                <a
                  href={`tel:${phone.replace(/\s+/g, "")}`}
                  onClick={playClick}
                  className="text-white hover:text-[#ff2a5f] transition-colors"
                >
                  {phone}
                </a>
              </div>
            </div>
            <button
              onClick={handleCopyPhone}
              className="p-1.5 rounded hover:bg-white/10 text-white/40 hover:text-white transition-colors"
              title="Copy phone"
            >
              {copiedPhone ? <Check className="w-3.5 h-3.5 text-[#ff2a5f]" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Location Box */}
          <div className="p-5 rounded-lg bg-white/[0.02] border border-white/[0.08] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded bg-[#00f0ff]/10 text-[#00f0ff]">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <div className="text-white/40 text-[10px]">HEADQUARTERS</div>
                <div className="text-white">Bangalore, India (IST)</div>
              </div>
            </div>
            <span className="text-[10px] text-emerald-400 font-bold px-2 py-0.5 rounded bg-emerald-400/10 border border-emerald-400/20">
              REMOTE OK
            </span>
          </div>
        </div>

        {/* Bottom Legal & Back to Top Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-white/40">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00f5d4] animate-pulse" />
            <span>© 2026 SHIVANG CHAUHAN // ALL SYSTEMS OPERATIONAL</span>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="mailto:chauhanshivang4@gmail.com"
              onClick={playClick}
              className="hover:text-white transition-colors"
            >
              EMAIL
            </a>
            <a
              href="/Shivang_CV.pdf"
              download="Shivang_Chauhan_CV.pdf"
              onClick={playClick}
              className="hover:text-white transition-colors"
            >
              RESUME
            </a>
            <button
              onClick={scrollToTop}
              onMouseEnter={playHover}
              className="flex items-center gap-1.5 text-white/60 hover:text-[#00f5d4] transition-colors"
            >
              <span>BACK TO TOP</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
