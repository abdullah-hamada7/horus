"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import styles from "./ChatBot.module.css";

interface Source {
  title?: string;
  snippet?: string;
  link?: string;
}

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  sources?: Source[];
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      text: "أهلاً بك! أنا حورس مرشدك السياحي الذكي 🇪🇬. يسعدني مساعدتك في استكشاف تاريخ معبد الأقصر، الأهرامات، والمعالم السياحية العريقة لمصر. كيف يمكنني إرشادك اليوم؟",
      sender: "bot"
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showTeaser, setShowTeaser] = useState(true);
  // Hide chatbot while intro splash screen is active
  const [introActive, setIntroActive] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Check if intro is already done (e.g. on page refresh / other routes)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const done = sessionStorage.getItem("introFinished") === "true";
      setIntroActive(!done);
    }
    // Listen for the intro finish event dispatched by page.tsx
    const handleIntroFinished = () => setIntroActive(false);
    window.addEventListener("introFinished", handleIntroFinished);
    return () => window.removeEventListener("introFinished", handleIntroFinished);
  }, []);

  // Auto scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  // Hide teaser after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTeaser(false);
    }, 8000);
    return () => clearTimeout(timer);
  }, []);

  const handleSend = async () => {
    const query = inputValue.trim();
    if (!query) return;

    // Add user message
    const userMsgId = Date.now().toString();
    setMessages(prev => [...prev, { id: userMsgId, text: query, sender: "user" }]);
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ question: query })
      });

      const data = await response.json();

      if (data.error) {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: `عذراً، حدث خطأ أثناء الاتصال بـ حورس: ${data.error}`,
          sender: "bot"
        }]);
      } else {
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          text: data.answer,
          sender: "bot",
          sources: data.sources
        }]);
      }
    } catch (error: any) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        text: `عذراً، فشل الاتصال بالدليل السياحي: ${error.message || error}`,
        sender: "bot"
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={styles.chatbotWrapper}
      style={introActive ? { opacity: 0, pointerEvents: "none", zIndex: -1 } : undefined}
    >
      {/* Teaser Bubble */}
      <AnimatePresence>
        {showTeaser && !isOpen && (
          <motion.div 
            className={styles.teaserBubble}
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            onClick={() => setIsOpen(true)}
          >
            <div className={styles.teaserText}>تحدث مع حورس (HORUS AI) 👋</div>
            <button className={styles.teaserClose} onClick={(e) => {
              e.stopPropagation();
              setShowTeaser(false);
            }}>×</button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Chat Button */}
      <motion.button 
        className={styles.chatButton}
        onClick={() => {
          setIsOpen(!isOpen);
          setShowTeaser(false);
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Chat with Horus"
      >
        <div className={styles.logoContainer}>
          <Image 
            src="/photos/icon.png" 
            alt="Horus Icon" 
            width={38} 
            height={38} 
            className={styles.logoImage}
          />
        </div>
        <span className={styles.pulseRing}></span>
      </motion.button>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className={styles.chatPanel}
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Header */}
            <div className={styles.panelHeader}>
              <div className={styles.headerInfo}>
                <Image 
                  src="/photos/icon.png" 
                  alt="Horus Logo" 
                  width={30} 
                  height={30}
                />
                <div>
                  <h4 className={styles.headerTitle}>HORUS AI</h4>
                  <span className={styles.headerStatus}>مرشدك السياحي الذكي (متصل)</span>
                </div>
              </div>
              <button className={styles.closeButton} onClick={() => setIsOpen(false)}>×</button>
            </div>

            {/* Message Area */}
            <div className={styles.messageArea}>
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`${styles.messageWrapper} ${msg.sender === "user" ? styles.userWrapper : styles.botWrapper}`}
                >
                  <div className={styles.messageContent}>
                    <p className={styles.messageText}>{msg.text}</p>
                    
                    {/* Reference Sources */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className={styles.sourcesContainer}>
                        <div className={styles.sourcesHeader}>المصادر المرجعية:</div>
                        <div className={styles.sourcesList}>
                          {msg.sources.map((src, i) => (
                            <a 
                              key={i} 
                              href={src.link || "#"} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className={styles.sourceLink}
                              title={src.snippet}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.sourceIcon}>
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                                <polyline points="15 3 21 3 21 9"></polyline>
                                <line x1="10" y1="14" x2="21" y2="3"></line>
                              </svg>
                              {src.title || "وثيقة مرجعية"}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {/* Typing Indicator */}
              {isLoading && (
                <div className={`${styles.messageWrapper} ${styles.botWrapper}`}>
                  <div className={styles.typingIndicator}>
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className={styles.inputForm}>
              <input 
                type="text" 
                placeholder="اسأل حورس عن تاريخ مصر..." 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSend();
                }}
                disabled={isLoading}
                className={styles.textInput}
              />
              <button 
                onClick={handleSend} 
                disabled={isLoading || !inputValue.trim()}
                className={styles.sendButton}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
