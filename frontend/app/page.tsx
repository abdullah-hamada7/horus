"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";
import Hero from "./components/Hero/Hero";
import DiscoveryHall from "./components/Sections/DiscoveryHall";

export default function Home() {
  const [isIntroFinished, setIsIntroFinished] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== "undefined") {
      const finished = sessionStorage.getItem("introFinished");
      if (finished === "true") {
        setIsIntroFinished(true);
        setHasStarted(true);
      }
    }
  }, []);

  const handleStartExperience = () => {
    setHasStarted(true);
    if (videoRef.current) {
      videoRef.current.play().catch(e => console.error("Video play failed:", e));
    }
  };

  useEffect(() => {
    if (!isMounted) return;
    if (!isIntroFinished) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isIntroFinished, isMounted]);

  const handleSkipIntro = () => {
    setIsIntroFinished(true);
    sessionStorage.setItem("introFinished", "true");
    window.dispatchEvent(new Event("introFinished"));
    if (videoRef.current) {
      videoRef.current.pause();
    }
  };

  const handleVideoEnded = () => {
    setIsIntroFinished(true);
    sessionStorage.setItem("introFinished", "true");
    window.dispatchEvent(new Event("introFinished"));
  };

  // Prevent flash of splash screen before checking session storage
  if (!isMounted) return null;

  return (
    <div className={styles.container}>
      {/* Intro Video (Splash Screen) */}
      <div className={`${styles.splashScreen} ${isIntroFinished ? styles.hidden : ""}`}>
        {!hasStarted && !isIntroFinished && (
          <div className={styles.startOverlay}>
            <button className={styles.startButton} onClick={handleStartExperience}>
              START EXPERIENCE
            </button>
          </div>
        )}
        {!isIntroFinished && (
          <video
            ref={videoRef}
            className={styles.splashVideo}
            src="/photos/intro-video.mp4"
            poster="/photos/home-background.png"
            preload="auto"
            playsInline
            onEnded={handleVideoEnded}
          />
        )}
        {hasStarted && !isIntroFinished && (
          <button className={styles.skipButton} onClick={handleSkipIntro}>
            Skip Intro
          </button>
        )}
      </div>

      {/* Main Content Wrapper */}
      <main className={`${styles.mainContent} ${isIntroFinished ? styles.visible : ""}`}>
        <Hero />
        {/* <DiscoveryHall /> */}
      </main>
    </div>
  );
}
