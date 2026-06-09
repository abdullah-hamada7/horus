"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Types matching Flask Backend models
interface Era {
  id: number;
  name: string;
  years: string;
}

interface King {
  id: number;
  name: string;
  englishName: string;
  dynasty: string;
  reign: string;
  bio: string;
  achievements: string;
  cartouche: string;
  docId: string;
  image: string;
  era: number;
}

const DOCUMENTARIES = [
  { title: "Secrets of the Pyramids", id: "fJBlEPOj4Fk", thumbnail: "https://img.youtube.com/vi/fJBlEPOj4Fk/0.jpg" },
  { title: "Curse of the Pharaohs: The Truth", id: "J_O9aJ9J14c", thumbnail: "https://img.youtube.com/vi/J_O9aJ9J14c/0.jpg" },
  { title: "A Day in the Life of an Ancient Egyptian", id: "k1tUtaMSUK4", thumbnail: "https://img.youtube.com/vi/k1tUtaMSUK4/0.jpg" }
];

const ERA_TRANSLATIONS: Record<string, string> = {
  // Early / pre-dynastic variants
  "الصبر المبكر": "Early Dynastic Period",
  "العصر المبكر": "Early Dynastic Period",
  "فجر الأسرات": "Early Dynastic Period",
  "عصر ما قبل الأسرات": "Predynastic Period",
  // Intermediate periods
  "الفترة الانتقالية الأولى": "First Intermediate Period",
  "الفترة الانتقالية الثانية": "Second Intermediate Period",
  "الفترة الانتقالية الثالثة": "Third Intermediate Period",
  // Main kingdoms
  "الدولة القديمة": "Old Kingdom",
  "الدولة الوسطى": "Middle Kingdom",
  "الدولة الحديثة": "New Kingdom",
  "العصر المتأخر": "Late Period",
  "العصر اليوناني الروماني": "Greco-Roman Period",
};

const translateDynasty = (dyn: string) => {
  if (!dyn) return "";
  return dyn
    .replace("الأسرة", "Dynasty")
    .replace("الأولى", "1")
    .replace("الثانية", "2")
    .replace("الثالثة", "3")
    .replace("الرابعة", "4")
    .replace("الخامسة", "5")
    .replace("السادسة", "6")
    .replace("السابعة", "7")
    .replace("الثامنة", "8")
    .replace("التاسعة", "9")
    .replace("العاشرة", "10")
    .replace("الحادية عشرة", "11")
    .replace("الثانية عشرة", "12")
    .replace("الثالثة عشرة", "13")
    .replace("الرابعة عشرة", "14")
    .replace("الخامسة عشرة", "15")
    .replace("السادسة عشرة", "16")
    .replace("السابعة عشرة", "17")
    .replace("الثامنة عشرة", "18")
    .replace("التاسعة عشرة", "19")
    .replace("العشرون", "20")
    .replace("الحادية والعشرون", "21")
    .replace("الثانية والعشرون", "22")
    .replace("الثالثة والعشرون", "23")
    .replace("الرابعة والعشرون", "24")
    .replace("الخامسة والعشرون", "25")
    .replace("السادسة والعشرون", "26")
    .replace("السابعة والعشرون", "27")
    .replace("الثامنة والعشرون", "28")
    .replace("التاسعة والعشرون", "29")
    .replace("الثلاثون", "30")
    .replace("الحادية والثلاثون", "31");
};

export default function Library() {
  const [selectedEra, setSelectedEra] = useState<string>("all");
  const [selectedKing, setSelectedKing] = useState<King | null>(null);
  const [eras, setEras] = useState<Era[]>([]);
  const [kings, setKings] = useState<King[]>([]);
  const [search, setSearch] = useState("");
  const [videoModal, setVideoModal] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [particles, setParticles] = useState<{ left: string; duration: string; delay: string }[]>([]);

  // Fetch Eras and Kings
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const erasRes = await fetch("/api/eras");
        const erasData = await erasRes.json();
        setEras(erasData);

        const kingsRes = await fetch("/api/kings");
        const kingsData = await kingsRes.json();

        const processedKings = kingsData.map((king: King) => ({
          ...king,
          image: king.image || "/photos/3.png",
        }));
        setKings(processedKings);
      } catch (error) {
        console.error("Error fetching museum records:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Generate particles client-side only
  useEffect(() => {
    const parts = [];
    for (let i = 0; i < 30; i++) {
      parts.push({
        left: Math.random() * 100 + "vw",
        duration: 8 + Math.random() * 12 + "s",
        delay: Math.random() * 5 + "s",
      });
    }
    setParticles(parts);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filteredKings = kings.filter((king) => {
    const matchesEra = selectedEra === "all" || String(king.era) === selectedEra;
    const matchesSearch =
      (king.name && king.name.includes(search)) ||
      (king.englishName && king.englishName.toLowerCase().includes(search.toLowerCase()));
    return matchesEra && matchesSearch;
  });

  return (
    <div className="min-h-screen pb-20 text-white relative overflow-hidden" dir="ltr" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
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
      `}</style>

      {/* Scroll to Top */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-10 right-10 w-12 h-12 bg-white/5 border border-white/10 rounded-full text-white flex items-center justify-center cursor-pointer z-40 transition-all duration-300 hover:bg-[#ff7a00] hover:border-[#ff7a00] hover:shadow-[0_0_15px_rgba(255,122,0,0.4)] hover:scale-110 backdrop-blur-md ${
          showScrollTop ? "opacity-100 translate-y-0 visible" : "opacity-0 translate-y-4 invisible"
        }`}
        title="Back to Top"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>

      {/* Hero Section */}
      <header className="relative h-[45vh] flex flex-col items-center justify-center text-center px-6">
        <motion.div 
          className="z-20 space-y-3"
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="text-[#ff7a00] text-xs font-bold tracking-[0.3em] uppercase block">ROYAL ARCHIVE</span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight uppercase">
            THE ROYAL LIBRARY
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Walk through the scrolls, papyri, and achievements of the pharaohs that survived the centuries.
          </p>
          <div className="w-20 h-[2px] bg-[#ff7a00] mx-auto mt-4 rounded-full shadow-[0_0_8px_rgba(255,122,0,0.5)]"></div>
        </motion.div>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <div className="w-12 h-12 border-2 border-[#ff7a00] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-400 animate-pulse text-sm">Loading Royal Archives...</p>
        </div>
      ) : (
        <main className="max-w-6xl mx-auto px-6 space-y-20 relative z-20">
          {/* Search and Filter */}
          <section className="space-y-6 bg-white/[0.02] p-6 rounded-2xl border border-white/5 backdrop-blur-md">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              {/* Search Bar */}
              <div className="relative w-full lg:w-80">
                <input
                  type="text"
                  placeholder="Search for a king..."
                  className="w-full bg-white/[0.03] border border-white/10 rounded-full py-2.5 px-10 focus:border-[#ff7a00] focus:bg-white/5 outline-none transition-all text-white placeholder-gray-500 text-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <svg className="absolute left-3.5 top-3 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              {/* Eras Filter */}
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => setSelectedEra("all")}
                  className={`px-5 py-2 rounded-full border text-xs font-bold transition-all duration-300 ${
                    selectedEra === "all"
                      ? "bg-[#ff7a00] border-[#ff7a00] text-white shadow-[0_0_12px_rgba(255,122,0,0.3)]"
                      : "border-white/10 text-gray-400 hover:border-white/20 hover:text-white"
                  }`}
                >
                  All
                </button>
                {eras.map((era) => (
                  <button
                    key={era.id}
                    onClick={() => setSelectedEra(String(era.id))}
                    className={`px-5 py-2 rounded-full border text-xs font-bold transition-all duration-300 ${
                      selectedEra === String(era.id)
                        ? "bg-[#ff7a00] border-[#ff7a00] text-white shadow-[0_0_12px_rgba(255,122,0,0.3)]"
                        : "border-white/10 text-gray-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {ERA_TRANSLATIONS[era.name] || era.name}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Kings Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredKings.length > 0 ? (
              filteredKings.map((king, idx) => (
                <motion.div
                  key={king.id}
                  className="bg-white/[0.02] border border-white/5 rounded-2xl overflow-hidden backdrop-blur-md hover:border-[#ff7a00]/40 hover:shadow-[0_8px_30px_rgba(255,122,0,0.08)] transition-all duration-300 flex flex-col group"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.3) }}
                >
                  <div className="relative h-64 w-full overflow-hidden bg-black/40">
                    <img
                      src={king.image}
                      alt={king.englishName || king.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/photos/3.png";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent"></div>
                    <div className="absolute bottom-5 left-5 text-left">
                      <span className="text-[#ff7a00] text-[10px] font-bold tracking-widest uppercase">
                        {translateDynasty(king.dynasty)}
                      </span>
                      <h3 className="text-xl font-bold mt-0.5 text-white tracking-wide">
                        {king.englishName || king.name}
                      </h3>
                      {king.englishName && (
                        <p className="text-[12px] text-gray-400 font-medium" style={{ fontFamily: "'Amiri', serif" }}>{king.name}</p>
                      )}
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-grow space-y-4">
                    <p className="text-gray-400 text-xs leading-relaxed line-clamp-3" dir={king.bio ? "rtl" : "ltr"}>{king.bio}</p>
                    <button
                      onClick={() => setSelectedKing(king)}
                      className="w-full mt-auto py-2.5 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-[#ff7a00] hover:border-[#ff7a00] hover:shadow-[0_0_12px_rgba(255,122,0,0.3)] transition-all duration-300 text-xs font-bold uppercase tracking-wider"
                    >
                      Explore History
                    </button>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 text-gray-500 text-sm">
                No royal records match your search query.
              </div>
            )}
          </section>

          {/* Documentaries Section */}
          <section className="space-y-6 bg-white/[0.02] p-6 rounded-2xl border border-white/5 backdrop-blur-md">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-bold text-white uppercase tracking-wider">Historical Documentaries</h2>
              <p className="text-gray-500 uppercase tracking-widest text-[10px]">Step Back In Time</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {DOCUMENTARIES.map((doc, idx) => (
                <div
                  key={idx}
                  onClick={() => setVideoModal(doc.id)}
                  className="bg-black/30 border border-white/5 rounded-xl overflow-hidden cursor-pointer group hover:border-[#ff7a00]/30 transition-all duration-300"
                >
                  <div className="relative h-40 w-full">
                    <img src={doc.thumbnail} alt={doc.title} className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity duration-300" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 bg-[#ff7a00] rounded-full flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300 text-white">
                        <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4.5 3.5v13l11-6.5-11-6.5z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 text-center">
                    <h4 className="font-bold text-gray-200 text-xs group-hover:text-[#ff7a00] transition-colors">{doc.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      )}

      {/* Details Modal */}
      <AnimatePresence>
        {selectedKing && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#0c0c0c] border border-white/10 w-full max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl relative shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex flex-col md:flex-row"
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              transition={{ duration: 0.3 }}
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedKing(null)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/40 hover:bg-white/10 rounded-full transition-colors text-white"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Image Side */}
              <div className="w-full md:w-1/2 h-64 md:h-auto relative min-h-[300px] bg-black">
                <img
                  src={selectedKing.image}
                  alt={selectedKing.englishName || selectedKing.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/photos/3.png";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0c0c0c] via-transparent to-transparent"></div>
              </div>

              {/* Content Side */}
              <div className="w-full md:w-1/2 p-8 md:p-10 space-y-6 overflow-y-auto max-h-[85vh]">
                <div className="space-y-1">
                  <span className="text-[#ff7a00] text-[10px] font-bold uppercase tracking-widest block">
                    {translateDynasty(selectedKing.dynasty)} | {selectedKing.reign}
                  </span>
                  <h2 className="text-3xl font-extrabold text-white tracking-wide">{selectedKing.englishName || selectedKing.name}</h2>
                  {selectedKing.englishName && (
                    <p className="text-lg text-gray-400 font-medium" style={{ fontFamily: "'Amiri', serif" }}>{selectedKing.name}</p>
                  )}
                </div>

                {/* Royal Cartouche */}
                {selectedKing.cartouche && (
                  <div className="p-4 bg-white/[0.02] border border-white/5 rounded-xl flex flex-col items-center">
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider mb-2 font-bold">Royal Cartouche</span>
                    <div className="border border-[#ff7a00]/60 rounded-full px-6 py-2 bg-gradient-to-b from-[#ff7a00]/5 to-transparent">
                      <span 
                        className="text-3xl text-transparent bg-clip-text bg-gradient-to-b from-amber-200 to-amber-500 block text-center"
                        style={{ fontFamily: "'Noto Sans Egyptian Hieroglyphs', sans-serif" }}
                      >
                        {selectedKing.cartouche}
                      </span>
                    </div>
                  </div>
                )}

                {/* Biography */}
                <div className="space-y-2">
                  <h4 className="text-white text-xs font-bold uppercase tracking-wider border-l-2 border-[#ff7a00] pl-3">Biography</h4>
                  <p className="text-gray-400 text-xs leading-relaxed" dir={selectedKing.bio ? "rtl" : "ltr"}>{selectedKing.bio}</p>
                </div>

                {/* Achievements */}
                {selectedKing.achievements && (
                  <div className="space-y-2">
                    <h4 className="text-white text-xs font-bold uppercase tracking-wider border-l-2 border-[#ff7a00] pl-3">Key Achievements</h4>
                    <ul className="space-y-1.5 pl-1">
                      {selectedKing.achievements
                        .split("\n")
                        .filter((a) => a.trim())
                        .map((ach, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-gray-400 text-xs" dir={ach.trim() ? "rtl" : "ltr"}>
                            <span className="w-1.5 h-1.5 bg-[#ff7a00] rounded-full mt-1.5 flex-shrink-0" />
                            <span>{ach}</span>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}

                {/* watch documentary */}
                {selectedKing.docId && (
                  <button
                    onClick={() => setVideoModal(selectedKing.docId)}
                    className="w-full py-2.5 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-[#ff7a00] hover:border-[#ff7a00] hover:shadow-[0_0_12px_rgba(255,122,0,0.3)] transition-all duration-300 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.5 9a.5.5 0 000 1h2a.5.5 0 000-1h-2z" />
                    </svg>
                    Watch Private Documentary
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Modal */}
      <AnimatePresence>
        {videoModal && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="w-full max-w-3xl aspect-video relative">
              <button
                onClick={() => setVideoModal(null)}
                className="absolute -top-10 right-0 text-white hover:text-[#ff7a00] transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <iframe
                className="w-full h-full rounded-xl shadow-2xl border border-white/10"
                src={`https://www.youtube.com/embed/${videoModal}?autoplay=1`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
