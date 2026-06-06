"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface GlyphInfo {
  char: string;
  name: string;
}

const GLYPH_DATA: Record<string, GlyphInfo> = {
  'A': { char: '𓄿', name: 'Vulture' },
  'B': { char: '𓃀', name: 'Leg' },
  'C': { char: '𓎡', name: 'Basket' },
  'D': { char: '𓂧', name: 'Hand' },
  'E': { char: '𓇋', name: 'Reed' },
  'F': { char: '𓆑', name: 'Viper' },
  'G': { char: '𓎼', name: 'Stand' },
  'H': { char: '𓉔', name: 'Shelter' },
  'I': { char: '𓇋', name: 'Reed' },
  'J': { char: '𓆙', name: 'Cobra' },
  'K': { char: '𓎡', name: 'Basket' },
  'L': { char: '𓃭', name: 'Lion' },
  'M': { char: '𓅓', name: 'Owl' },
  'N': { char: '𓈖', name: 'Water' },
  'O': { char: '𓅱', name: 'Chick' },
  'P': { char: '𓊪', name: 'Stool' },
  'Q': { char: '𓈎', name: 'Hill' },
  'R': { char: '𓂋', name: 'Mouth' },
  'S': { char: '𓋴', name: 'Cloth' },
  'T': { char: '𓏏', name: 'Loaf' },
  'U': { char: '𓅲', name: 'Chick' },
  'V': { char: '𓆑', name: 'Viper' },
  'W': { char: '𓅱', name: 'Chick' },
  'X': { char: '𓎡𓋴', name: 'Basket & Cloth' },
  'Y': { char: '𓇌', name: 'Reeds' },
  'Z': { char: '𓊃', name: 'Bolt' },
};

export default function Hieroglyphics() {
  const [name, setName] = useState("");
  const [particles, setParticles] = useState<{ left: string; duration: string; delay: string }[]>([]);
  const captureRef = useRef<HTMLDivElement>(null);

  // Generate particles client-side only
  useEffect(() => {
    const parts = [];
    for (let i = 0; i < 40; i++) {
      parts.push({
        left: Math.random() * 100 + "vw",
        duration: 5 + Math.random() * 10 + "s",
        delay: Math.random() * 5 + "s",
      });
    }
    setParticles(parts);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Keep only English letters, max 15 chars
    const val = e.target.value.toLowerCase().replace(/[^a-z]/g, "");
    setName(val.substring(0, 15));
  };

  const downloadImage = async () => {
    if (typeof window === "undefined" || !captureRef.current) return;

    try {
      const html2canvas = (await import("html2canvas")).default;
      
      // Ensure fonts are loaded
      await document.fonts.ready;
      
      // Temporarily remove anim class styling for capture
      const elements = captureRef.current.querySelectorAll(".stagger-in");
      const savedStyles = Array.from(elements).map((el: any) => {
        const style = {
          animation: el.style.animation,
          opacity: el.style.opacity,
          transform: el.style.transform
        };
        el.style.animation = "none";
        el.style.opacity = "1";
        el.style.transform = "none";
        return style;
      });

      const canvas = await html2canvas(captureRef.current, {
        backgroundColor: "#050a14",
        scale: 3,
        useCORS: true,
        logging: false,
      });
      
      // Restore animations
      elements.forEach((el: any, i) => {
        el.style.animation = savedStyles[i].animation;
        el.style.opacity = savedStyles[i].opacity;
        el.style.transform = savedStyles[i].transform;
      });

      const link = document.createElement("a");
      link.download = `royal_name_${name || "cartouche"}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Download failed:", err);
      alert("Sorry, an error occurred during download. Please try again.");
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-16 px-6 gap-12 text-white relative overflow-hidden" dir="ltr" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
      {/* Hologram Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center -z-20"
        style={{
          backgroundImage: "linear-gradient(rgba(10, 10, 10, 0.9), rgba(10, 10, 10, 0.9)), url('/photos/home-background.png')",
        }}
      />

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        {particles.map((p, idx) => (
          <div
            key={idx}
            className="absolute w-[2px] h-[2px] bg-[#ff7a00] rounded-full opacity-35"
            style={{
              left: p.left,
              bottom: "-10px",
              animation: `drift ${p.duration} linear infinite`,
              animationDelay: p.delay,
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes drift {
          from { transform: translateY(0) translateX(0); opacity: 0; }
          50% { opacity: 0.6; }
          to { transform: translateY(-110vh) translateX(30px); opacity: 0; }
        }
        .hieroglyph-font {
          font-family: 'Noto Sans Egyptian Hieroglyphs', sans-serif;
        }
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; color: black !important; }
          .print-container { border: 4px solid black !important; background: white !important; border-radius: 80px !important; box-shadow: none !important; }
          .print-glyph { -webkit-text-fill-color: black !important; filter: none !important; }
        }
      `}</style>

      {/* Header */}
      <div className="text-center space-y-4 no-print relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: -25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-2"
        >
          <span className="text-[#ff7a00] text-xs font-bold tracking-[0.3em] uppercase block">CARTOUCHE TRANSLATOR</span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight uppercase">
            ROYAL CARTOUCHE EDITOR
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Translate your name into ancient Egyptian hieroglyphs and forge your own royal cartouche.
          </p>
          <div className="w-20 h-[2px] bg-[#ff7a00] mx-auto mt-4 rounded-full shadow-[0_0_8px_rgba(255,122,0,0.5)]"></div>
        </motion.div>
      </div>

      {/* Interactive Cartouche Editor */}
      <div className="w-full max-w-5xl flex flex-col items-center gap-12 relative z-20">
        {/* Cartouche Capture Area */}
        <div id="capture-area" ref={captureRef} className="p-12 rounded-3xl bg-transparent">
          <div className="print-container relative p-12 md:p-14 border-8 border-double border-[#ff7a00]/80 rounded-[120px] bg-black/60 shadow-[0_0_80px_rgba(255,122,0,0.25),_inset_0_0_50px_rgba(255,122,0,0.1)] flex items-center justify-center min-w-[320px] md:min-w-[450px] transition-all duration-700">
            {/* Left loop bar style */}
            <div className="absolute left-6 top-1/4 bottom-1/4 w-1.5 bg-[#ff7a00] rounded-full shadow-[0_0_15px_#ff7a00]"></div>
            
            <div className="flex flex-wrap justify-center gap-8 hieroglyph-font">
              {name.split("").map((char, index) => {
                const upperChar = char.toUpperCase();
                const glyph = GLYPH_DATA[upperChar] || GLYPH_DATA["A"];
                return (
                  <motion.div 
                    key={index} 
                    className="stagger-in flex flex-col items-center gap-3 group relative cursor-pointer"
                    initial={{ opacity: 0, scale: 0.5, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                  >
                    <span 
                      className="print-glyph text-7xl md:text-8xl bg-gradient-to-br from-amber-200 via-yellow-400 to-[#ff7a00] bg-clip-text text-transparent drop-shadow-[0_0_12px_rgba(255,122,0,0.7)] group-hover:scale-125 group-hover:rotate-6 group-hover:drop-shadow-[0_0_20px_#ff7a00] transition-all duration-300"
                    >
                      {glyph.char}
                    </span>
                    <span className="absolute -bottom-6 text-xs text-[#ff7a00] font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-black/85 px-2.5 py-1 rounded-md border border-[#ff7a00]/30 whitespace-nowrap z-30 pointer-events-none">
                      {glyph.name}
                    </span>
                  </motion.div>
                );
              })}
              {name === "" && (
                <div className="text-gray-600 text-lg py-8 tracking-widest text-center animate-pulse uppercase">
                  Type your name below to generate cartouche
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form controls */}
        <div className="w-full max-w-2xl space-y-8 no-print bg-white/[0.02] p-8 rounded-3xl border border-white/5 backdrop-blur-md">
          <div className="space-y-4">
            <label className="block text-[#ff7a00] text-center uppercase tracking-widest text-sm font-bold">
              Enter Name in English
            </label>
            <input
              type="text"
              value={name}
              onChange={handleInputChange}
              className="w-full p-5 rounded-2xl bg-black/50 border border-white/10 text-white text-center text-2xl font-bold tracking-widest uppercase focus:border-[#ff7a00] focus:shadow-[0_0_20px_rgba(255,122,0,0.3)] outline-none transition-all duration-300 placeholder-gray-800"
              placeholder="TYPE YOUR NAME..."
              maxLength={15}
            />
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={downloadImage} 
              className="px-8 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm tracking-wider uppercase hover:bg-[#ff7a00] hover:border-[#ff7a00] hover:shadow-[0_0_15px_rgba(255,122,0,0.4)] transition-all duration-300 flex items-center gap-2"
              disabled={!name}
              style={{ opacity: name ? 1 : 0.5, cursor: name ? "pointer" : "not-allowed" }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download
            </button>
            <button 
              onClick={handlePrint} 
              className="px-8 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm tracking-wider uppercase hover:bg-[#ff7a00] hover:border-[#ff7a00] hover:shadow-[0_0_15px_rgba(255,122,0,0.4)] transition-all duration-300 flex items-center gap-2"
              disabled={!name}
              style={{ opacity: name ? 1 : 0.5, cursor: name ? "pointer" : "not-allowed" }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print
            </button>
            <Link 
              href="/"
              className="px-8 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-bold text-sm tracking-wider uppercase hover:bg-[#ff7a00] hover:border-[#ff7a00] hover:shadow-[0_0_15px_rgba(255,122,0,0.4)] transition-all duration-300 flex items-center gap-2 no-underline"
            >
              Back to Museum
            </Link>
          </div>
        </div>
      </div>
      
      <div className="fixed bottom-4 text-[#ff7a00]/30 text-[10px] uppercase tracking-[0.7em] w-full text-center no-print pointer-events-none">
        Ancient Egyptian Arts • Virtual Museum
      </div>
    </div>
  );
}

