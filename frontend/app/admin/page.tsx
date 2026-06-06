"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

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

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);
  const [passcode, setPasscode] = useState("");
  const [authError, setAuthError] = useState("");
  
  const [view, setView] = useState<"kings" | "eras">("kings");
  const [eras, setEras] = useState<Era[]>([]);
  const [kings, setKings] = useState<King[]>([]);
  const [loading, setLoading] = useState(true);

  // Form States
  const [newEra, setNewEra] = useState({ name: "", years: "" });
  const [newKing, setNewKing] = useState({
    name: "",
    englishName: "",
    dynasty: "",
    reign: "",
    bio: "",
    achievements: "",
    cartouche: "",
    docId: "",
    era_id: "",
    image: null as File | null
  });

  // Edit States
  const [editingEra, setEditingEra] = useState<Era | null>(null);
  const [editEraForm, setEditEraForm] = useState({ name: "", years: "" });

  const [editingKing, setEditingKing] = useState<King | null>(null);
  const [editKingForm, setEditKingForm] = useState({
    name: "",
    englishName: "",
    dynasty: "",
    reign: "",
    bio: "",
    achievements: "",
    cartouche: "",
    docId: "",
    era_id: "",
    image: null as File | null
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const erasRes = await fetch("/api/eras");
      const erasData = await erasRes.json();
      setEras(erasData);

      const kingsRes = await fetch("/api/kings");
      const kingsData = await kingsRes.json();
      setKings(kingsData);
    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/admin/auth");
        const data = await res.json();
        if (data.authenticated) {
          setIsAuthenticated(true);
          fetchData();
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setAuthChecking(false);
      }
    };
    checkAuth();
  }, []);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ passcode })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        fetchData();
      } else {
        setAuthError(data.error || "Incorrect passcode");
      }
    } catch (err) {
      setAuthError("Failed to authenticate");
    }
  };

  const addEra = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/eras", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEra)
      });
      setNewEra({ name: "", years: "" });
      fetchData();
    } catch (err) {
      console.error("Error adding era:", err);
    }
  };

  const startEditEra = (era: Era) => {
    setEditingEra(era);
    setEditEraForm({
      name: era.name,
      years: era.years || ""
    });
  };

  const updateEra = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEra) return;
    try {
      await fetch(`/api/eras/${editingEra.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editEraForm)
      });
      setEditingEra(null);
      fetchData();
    } catch (err) {
      console.error("Error updating era:", err);
    }
  };

  const deleteEra = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this historical era?")) {
      try {
        const res = await fetch(`/api/eras/${id}`, { method: "DELETE" });
        if (res.status === 400) {
          const errData = await res.json();
          window.alert(errData.error || "Cannot delete era with linked kings");
        } else {
          if (editingEra?.id === id) {
            setEditingEra(null);
          }
          fetchData();
        }
      } catch (err) {
        console.error("Error deleting era:", err);
      }
    }
  };

  const addKing = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", newKing.name);
      formData.append("englishName", newKing.englishName);
      formData.append("dynasty", newKing.dynasty);
      formData.append("reign", newKing.reign);
      formData.append("bio", newKing.bio);
      formData.append("achievements", newKing.achievements);
      formData.append("cartouche", newKing.cartouche);
      formData.append("docId", newKing.docId);
      formData.append("era_id", newKing.era_id);
      if (newKing.image) {
        formData.append("image", newKing.image);
      }

      await fetch("/api/kings", {
        method: "POST",
        body: formData
      });

      setNewKing({
        name: "",
        englishName: "",
        dynasty: "",
        reign: "",
        bio: "",
        achievements: "",
        cartouche: "",
        docId: "",
        era_id: "",
        image: null
      });
      fetchData();
    } catch (err) {
      console.error("Error adding king:", err);
    }
  };

  const startEditKing = (king: King) => {
    setEditingKing(king);
    setEditKingForm({
      name: king.name,
      englishName: king.englishName || "",
      dynasty: king.dynasty || "",
      reign: king.reign || "",
      bio: king.bio || "",
      achievements: king.achievements || "",
      cartouche: king.cartouche || "",
      docId: king.docId || "",
      era_id: king.era ? king.era.toString() : "",
      image: null
    });
  };

  const updateKing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingKing) return;
    try {
      const formData = new FormData();
      formData.append("name", editKingForm.name);
      formData.append("englishName", editKingForm.englishName);
      formData.append("dynasty", editKingForm.dynasty);
      formData.append("reign", editKingForm.reign);
      formData.append("bio", editKingForm.bio);
      formData.append("achievements", editKingForm.achievements);
      formData.append("cartouche", editKingForm.cartouche);
      formData.append("docId", editKingForm.docId);
      formData.append("era_id", editKingForm.era_id);
      if (editKingForm.image) {
        formData.append("image", editKingForm.image);
      }

      await fetch(`/api/kings/${editingKing.id}`, {
        method: "PUT",
        body: formData
      });

      setEditingKing(null);
      fetchData();
    } catch (err) {
      console.error("Error updating king:", err);
    }
  };

  const deleteKing = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this royal record?")) {
      try {
        await fetch(`/api/kings/${id}`, { method: "DELETE" });
        if (editingKing?.id === id) {
          setEditingKing(null);
        }
        fetchData();
      } catch (err) {
        console.error("Error deleting king:", err);
      }
    }
  };

  // Auth checking indicator
  if (authChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-white">
        <div className="w-12 h-12 border-4 border-[#ff7a00] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Passcode entry form
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-white relative overflow-hidden" dir="ltr" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
        {/* Hologram Background */}
        <div 
          className="fixed inset-0 bg-cover bg-center -z-20"
          style={{
            backgroundImage: "linear-gradient(rgba(10, 10, 10, 0.95), rgba(10, 10, 10, 0.95)), url('/photos/home-background.png')",
          }}
        />
        
        <motion.div 
          className="w-full max-w-md bg-black/60 border border-[#ff7a00]/30 p-8 rounded-3xl backdrop-blur-md shadow-[0_0_60px_rgba(255,122,0,0.15)] text-center space-y-6"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-2">
            <h2 className="text-3xl font-extrabold tracking-tight uppercase">
              Royal Admin Login
            </h2>
            <p className="text-gray-400 text-sm">Enter the royal passcode to manage the museum</p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <input 
              type="password"
              value={passcode}
              onChange={e => setPasscode(e.target.value)}
              placeholder="Passcode..."
              className="w-full bg-black/60 border border-[#ff7a00]/30 p-4 rounded-xl text-center text-xl font-bold tracking-widest focus:border-[#ff7a00] outline-none transition-all duration-300 text-[#ff7a00] placeholder-gray-800"
              required
            />
            {authError && (
              <p className="text-red-500 text-sm font-semibold">{authError}</p>
            )}
            <button className="w-full py-3.5 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-[#ff7a00] hover:border-[#ff7a00] hover:shadow-[0_0_15px_rgba(255,122,0,0.4)] transition-all duration-300 font-bold tracking-widest text-sm">
              SUBMIT PASSCODE
            </button>
          </form>

          <Link href="/" className="inline-block text-xs text-gray-500 hover:text-[#ff7a00] transition-colors mt-2">
            &larr; Return to Museum
          </Link>
        </motion.div>
      </div>
    );
  }

  // Admin Control Panel UI
  return (
    <div className="min-h-screen pb-20 text-white relative overflow-hidden" dir="ltr" style={{ fontFamily: "var(--font-sans), sans-serif" }}>
      {/* Hologram Background */}
      <div 
        className="fixed inset-0 bg-cover bg-center -z-20"
        style={{
          backgroundImage: "linear-gradient(rgba(10, 10, 10, 0.95), rgba(10, 10, 10, 0.95)), url('/photos/home-background.png')",
        }}
      />

      <div className="max-w-6xl mx-auto px-6 pt-32">
        <header className="flex flex-col md:flex-row justify-between items-center mb-12 border-b border-white/10 pb-6 gap-6">
          <div className="text-left">
            <h1 className="text-4xl font-extrabold tracking-tight uppercase">
              Royal Control Panel
            </h1>
            <p className="text-gray-400 mt-2 text-sm">Manage the historical records of the Virtual Egyptian Museum</p>
          </div>
          <nav className="flex gap-4">
            <button 
              onClick={() => setView("kings")} 
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                view === "kings" 
                  ? "bg-[#ff7a00] text-white font-bold shadow-[0_0_15px_rgba(255,122,0,0.3)]" 
                  : "bg-white/5 border border-white/10 hover:bg-white/10"
              }`}
            >
              Kings
            </button>
            <button 
              onClick={() => setView("eras")} 
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                view === "eras" 
                  ? "bg-[#ff7a00] text-white font-bold shadow-[0_0_15px_rgba(255,122,0,0.3)]" 
                  : "bg-white/5 border border-white/10 hover:bg-white/10"
              }`}
            >
              Eras
            </button>
          </nav>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-16 h-16 border-4 border-[#ff7a00] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-400 animate-pulse text-sm">Loading historical records...</p>
          </div>
        ) : (
          <div>
            {view === "eras" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
                {/* Add or Edit Era Form */}
                <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl backdrop-blur-md">
                  {editingEra ? (
                    <>
                      <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#ff7a00]">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#ff7a00]"></span>
                        Edit Era: {editingEra.name}
                      </h2>
                      <form onSubmit={updateEra} className="space-y-4">
                        <div>
                          <label className="block text-gray-400 text-xs mb-1.5 font-bold">Era Name</label>
                          <input 
                            type="text"
                            value={editEraForm.name} 
                            onChange={e => setEditEraForm({...editEraForm, name: e.target.value})} 
                            placeholder="e.g. New Kingdom" 
                            className="w-full bg-black/50 border border-white/10 p-3 rounded-lg focus:border-[#ff7a00] outline-none text-white transition-all duration-300" 
                            required 
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-xs mb-1.5 font-bold">Time Period (Years)</label>
                          <input 
                            type="text"
                            value={editEraForm.years} 
                            onChange={e => setEditEraForm({...editEraForm, years: e.target.value})} 
                            placeholder="e.g. 1550-1069 BC" 
                            className="w-full bg-black/50 border border-white/10 p-3 rounded-lg focus:border-[#ff7a00] outline-none text-white transition-all duration-300" 
                          />
                        </div>
                        <div className="flex gap-4">
                          <button className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-[#ff7a00] hover:border-[#ff7a00] hover:shadow-[0_0_15px_rgba(255,122,0,0.4)] transition-all duration-300 font-bold">
                            Update Era
                          </button>
                          <button 
                            type="button"
                            onClick={() => setEditingEra(null)}
                            className="flex-1 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 hover:bg-red-500/20 transition-all duration-300 font-bold"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </>
                  ) : (
                    <>
                      <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#ff7a00]">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#ff7a00]"></span>
                        Add New Era
                      </h2>
                      <form onSubmit={addEra} className="space-y-4">
                        <div>
                          <label className="block text-gray-400 text-xs mb-1.5 font-bold">Era Name</label>
                          <input 
                            type="text"
                            value={newEra.name} 
                            onChange={e => setNewEra({...newEra, name: e.target.value})} 
                            placeholder="e.g. New Kingdom" 
                            className="w-full bg-black/50 border border-white/10 p-3 rounded-lg focus:border-[#ff7a00] outline-none text-white transition-all duration-300" 
                            required 
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-xs mb-1.5 font-bold">Time Period (Years)</label>
                          <input 
                            type="text"
                            value={newEra.years} 
                            onChange={e => setNewEra({...newEra, years: e.target.value})} 
                            placeholder="e.g. 1550-1069 BC" 
                            className="w-full bg-black/50 border border-white/10 p-3 rounded-lg focus:border-[#ff7a00] outline-none text-white transition-all duration-300" 
                          />
                        </div>
                        <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-[#ff7a00] hover:border-[#ff7a00] hover:shadow-[0_0_15px_rgba(255,122,0,0.4)] transition-all duration-300 font-bold">
                          Save Era
                        </button>
                      </form>
                    </>
                  )}
                </div>

                {/* Eras List */}
                <div className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl backdrop-blur-md">
                  <h2 className="text-xl font-bold mb-6 text-[#ff7a00]">Historical Eras List</h2>
                  <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                    {eras.map(era => (
                      <div key={era.id} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/5 group relative overflow-hidden hover:border-[#ff7a00]/30 transition-all duration-300">
                        <div>
                          <p className="font-bold text-[#ff7a00] text-lg">{era.name}</p>
                          <p className="text-xs text-gray-400 mt-1">{era.years}</p>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 shrink-0">
                          <button 
                            onClick={() => startEditEra(era)} 
                            className="p-2 text-yellow-500 hover:bg-yellow-500/10 rounded-lg transition-all duration-300"
                            title="Edit Era"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => deleteEra(era.id)} 
                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all duration-300"
                            title="Delete Era"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
                {/* Add or Edit King Form */}
                <div className="lg:col-span-1 bg-white/[0.02] border border-white/5 p-6 rounded-2xl backdrop-blur-md h-fit">
                  {editingKing ? (
                    <>
                      <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#ff7a00]">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#ff7a00]"></span>
                        Edit King: {editingKing.englishName || editingKing.name}
                      </h2>
                      <form onSubmit={updateKing} className="space-y-4 text-sm">
                        <div>
                          <label className="block text-gray-400 text-xs mb-1 font-bold">Name in Arabic</label>
                          <input 
                            type="text"
                            value={editKingForm.name} 
                            onChange={e => setEditKingForm({...editKingForm, name: e.target.value})} 
                            placeholder="e.g. رمسيس الثاني" 
                            className="w-full bg-black/50 border border-white/10 p-3 rounded-lg outline-none text-white focus:border-[#ff7a00] transition-all duration-300" 
                            required 
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-xs mb-1 font-bold">Name in English</label>
                          <input 
                            type="text"
                            value={editKingForm.englishName} 
                            onChange={e => setEditKingForm({...editKingForm, englishName: e.target.value})} 
                            placeholder="e.g. Ramesses II" 
                            className="w-full bg-black/50 border border-white/10 p-3 rounded-lg outline-none text-white focus:border-[#ff7a00] transition-all duration-300" 
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-xs mb-1 font-bold">Era</label>
                          <select 
                            value={editKingForm.era_id} 
                            onChange={e => setEditKingForm({...editKingForm, era_id: e.target.value})} 
                            className="w-full bg-black/50 border border-white/10 p-3 rounded-lg outline-none text-white focus:border-[#ff7a00] transition-all duration-300" 
                            required
                          >
                            <option value="" className="bg-[#0a0a0a] text-gray-400">Select Era</option>
                            {eras.map(era => <option key={era.id} value={era.id} className="bg-[#0a0a0a] text-white">{era.name}</option>)}
                          </select>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-gray-400 text-xs mb-1 font-bold">Dynasty</label>
                            <input 
                              type="text"
                              value={editKingForm.dynasty} 
                              onChange={e => setEditKingForm({...editKingForm, dynasty: e.target.value})} 
                              placeholder="e.g. Dynasty 19" 
                              className="w-full bg-black/50 border border-white/10 p-3 rounded-lg outline-none text-white focus:border-[#ff7a00] transition-all duration-300" 
                            />
                          </div>
                          <div>
                            <label className="block text-gray-400 text-xs mb-1 font-bold">Reign Years</label>
                            <input 
                              type="text"
                              value={editKingForm.reign} 
                              onChange={e => setEditKingForm({...editKingForm, reign: e.target.value})} 
                              placeholder="e.g. 1279-1213 BC" 
                              className="w-full bg-black/50 border border-white/10 p-3 rounded-lg outline-none text-white focus:border-[#ff7a00] transition-all duration-300" 
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-gray-400 text-xs mb-1 font-bold">Historical Bio</label>
                          <textarea 
                            value={editKingForm.bio} 
                            onChange={e => setEditKingForm({...editKingForm, bio: e.target.value})} 
                            placeholder="Write a brief biography..." 
                            className="w-full bg-black/50 border border-white/10 p-3 rounded-lg outline-none text-white focus:border-[#ff7a00] transition-all duration-300 h-20 resize-none" 
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-xs mb-1 font-bold">Key Achievements (One per line)</label>
                          <textarea 
                            value={editKingForm.achievements} 
                            onChange={e => setEditKingForm({...editKingForm, achievements: e.target.value})} 
                            placeholder="e.g. Battle of Kadesh&#10;Abu Simbel Temple" 
                            className="w-full bg-black/50 border border-white/10 p-3 rounded-lg outline-none text-white focus:border-[#ff7a00] transition-all duration-300 h-20 resize-none" 
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-xs mb-1 font-bold">Royal Cartouche (Hieroglyphs)</label>
                          <input 
                            type="text"
                            value={editKingForm.cartouche} 
                            onChange={e => setEditKingForm({...editKingForm, cartouche: e.target.value})} 
                            placeholder="e.g. 𓎡𓃭𓇋𓍯" 
                            className="w-full bg-black/50 border border-white/10 p-3 rounded-lg outline-none text-white focus:border-[#ff7a00] transition-all duration-300" 
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-xs mb-1 font-bold">YouTube Documentary ID</label>
                          <input 
                            type="text"
                            value={editKingForm.docId} 
                            onChange={e => setEditKingForm({...editKingForm, docId: e.target.value})} 
                            placeholder="e.g. Z3W_717kIAQ" 
                            className="w-full bg-black/50 border border-white/10 p-3 rounded-lg outline-none text-white focus:border-[#ff7a00] transition-all duration-300" 
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-xs mb-1 font-bold">King Image (Leave empty to keep existing)</label>
                          <div className="border border-white/10 p-4 rounded-lg text-center hover:border-[#ff7a00] transition-all duration-300 bg-black/50">
                            <input 
                              type="file" 
                              onChange={e => setEditKingForm({...editKingForm, image: e.target.files ? e.target.files[0] : null})} 
                              className="hidden" 
                              id="edit-img-upload" 
                            />
                            <label htmlFor="edit-img-upload" className="cursor-pointer text-gray-400 text-xs block">
                              {editKingForm.image ? editKingForm.image.name : "Choose New Image"}
                            </label>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <button className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-[#ff7a00] hover:border-[#ff7a00] hover:shadow-[0_0_15px_rgba(255,122,0,0.4)] transition-all duration-300 font-bold">
                            Update King
                          </button>
                          <button 
                            type="button"
                            onClick={() => setEditingKing(null)}
                            className="flex-1 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 hover:bg-red-500/20 transition-all duration-300 font-bold"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    </>
                  ) : (
                    <>
                      <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-[#ff7a00]">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#ff7a00]"></span>
                        Add New King
                      </h2>
                      <form onSubmit={addKing} className="space-y-4 text-sm">
                        <div>
                          <label className="block text-gray-400 text-xs mb-1 font-bold">Name in Arabic</label>
                          <input 
                            type="text"
                            value={newKing.name} 
                            onChange={e => setNewKing({...newKing, name: e.target.value})} 
                            placeholder="e.g. رمسيس الثاني" 
                            className="w-full bg-black/50 border border-white/10 p-3 rounded-lg outline-none text-white focus:border-[#ff7a00] transition-all duration-300" 
                            required 
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-xs mb-1 font-bold">Name in English</label>
                          <input 
                            type="text"
                            value={newKing.englishName} 
                            onChange={e => setNewKing({...newKing, englishName: e.target.value})} 
                            placeholder="e.g. Ramesses II" 
                            className="w-full bg-black/50 border border-white/10 p-3 rounded-lg outline-none text-white focus:border-[#ff7a00] transition-all duration-300" 
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-xs mb-1 font-bold">Era</label>
                          <select 
                            value={newKing.era_id} 
                            onChange={e => setNewKing({...newKing, era_id: e.target.value})} 
                            className="w-full bg-black/50 border border-white/10 p-3 rounded-lg outline-none text-white focus:border-[#ff7a00] transition-all duration-300" 
                            required
                          >
                            <option value="" className="bg-[#0a0a0a] text-gray-400">Select Era</option>
                            {eras.map(era => <option key={era.id} value={era.id} className="bg-[#0a0a0a] text-white">{era.name}</option>)}
                          </select>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-gray-400 text-xs mb-1 font-bold">Dynasty</label>
                            <input 
                              type="text"
                              value={newKing.dynasty} 
                              onChange={e => setNewKing({...newKing, dynasty: e.target.value})} 
                              placeholder="e.g. Dynasty 19" 
                              className="w-full bg-black/50 border border-white/10 p-3 rounded-lg outline-none text-white focus:border-[#ff7a00] transition-all duration-300" 
                            />
                          </div>
                          <div>
                            <label className="block text-gray-400 text-xs mb-1 font-bold">Reign Years</label>
                            <input 
                              type="text"
                              value={newKing.reign} 
                              onChange={e => setNewKing({...newKing, reign: e.target.value})} 
                              placeholder="e.g. 1279-1213 BC" 
                              className="w-full bg-black/50 border border-white/10 p-3 rounded-lg outline-none text-white focus:border-[#ff7a00] transition-all duration-300" 
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-gray-400 text-xs mb-1 font-bold">Historical Bio</label>
                          <textarea 
                            value={newKing.bio} 
                            onChange={e => setNewKing({...newKing, bio: e.target.value})} 
                            placeholder="Write a brief biography..." 
                            className="w-full bg-black/50 border border-white/10 p-3 rounded-lg outline-none text-white focus:border-[#ff7a00] transition-all duration-300 h-20 resize-none" 
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-xs mb-1 font-bold">Key Achievements (One per line)</label>
                          <textarea 
                            value={newKing.achievements} 
                            onChange={e => setNewKing({...newKing, achievements: e.target.value})} 
                            placeholder="e.g. Battle of Kadesh&#10;Abu Simbel Temple" 
                            className="w-full bg-black/50 border border-white/10 p-3 rounded-lg outline-none text-white focus:border-[#ff7a00] transition-all duration-300 h-20 resize-none" 
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-xs mb-1 font-bold">Royal Cartouche (Hieroglyphs)</label>
                          <input 
                            type="text"
                            value={newKing.cartouche} 
                            onChange={e => setNewKing({...newKing, cartouche: e.target.value})} 
                            placeholder="e.g. 𓎡𓃭𓇋𓍯" 
                            className="w-full bg-black/50 border border-white/10 p-3 rounded-lg outline-none text-white focus:border-[#ff7a00] transition-all duration-300" 
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-xs mb-1 font-bold">YouTube Documentary ID</label>
                          <input 
                            type="text"
                            value={newKing.docId} 
                            onChange={e => setNewKing({...newKing, docId: e.target.value})} 
                            placeholder="e.g. Z3W_717kIAQ" 
                            className="w-full bg-black/50 border border-white/10 p-3 rounded-lg outline-none text-white focus:border-[#ff7a00] transition-all duration-300" 
                          />
                        </div>
                        <div>
                          <label className="block text-gray-400 text-xs mb-1 font-bold">King Image</label>
                          <div className="border border-white/10 p-4 rounded-lg text-center hover:border-[#ff7a00] transition-all duration-300 bg-black/50">
                            <input 
                              type="file" 
                              onChange={e => setNewKing({...newKing, image: e.target.files ? e.target.files[0] : null})} 
                              className="hidden" 
                              id="img-upload" 
                            />
                            <label htmlFor="img-upload" className="cursor-pointer text-gray-400 text-xs block">
                              {newKing.image ? newKing.image.name : "Choose King Image"}
                            </label>
                          </div>
                        </div>
                        <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-[#ff7a00] hover:border-[#ff7a00] hover:shadow-[0_0_15px_rgba(255,122,0,0.4)] transition-all duration-300 font-bold">
                          Register King
                        </button>
                      </form>
                    </>
                  )}
                </div>

                {/* Kings List */}
                <div className="lg:col-span-2 space-y-4">
                  <h2 className="text-xl font-bold mb-4 text-[#ff7a00]">
                    Currently Registered Kings ({kings.length})
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[750px] overflow-y-auto pr-1">
                    {kings.map(king => (
                      <div key={king.id} className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex gap-4 items-center group relative overflow-hidden backdrop-blur-md hover:border-[#ff7a00]/30 transition-all duration-300">
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-black/50 border border-white/10 shrink-0">
                          {king.image && (
                            <img 
                              src={king.image} 
                              alt={king.englishName || king.name}
                              className="w-full h-full object-cover" 
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = "/photos/3.png";
                              }}
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-[#ff7a00] text-lg truncate">{king.englishName || king.name}</h3>
                          <p className="text-xs text-gray-400 uppercase tracking-wide truncate" style={{ fontFamily: "'Amiri', serif" }}>{king.name}</p>
                          <p className="text-[10px] text-yellow-600 mt-1 truncate">{king.dynasty} | {king.reign}</p>
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300 shrink-0">
                          <button 
                            onClick={() => startEditKing(king)} 
                            className="p-2 text-yellow-500 hover:bg-yellow-500/10 rounded-lg transition-all duration-300"
                            title="Edit Record"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => deleteKing(king.id)} 
                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all duration-300"
                            title="Delete Record"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

