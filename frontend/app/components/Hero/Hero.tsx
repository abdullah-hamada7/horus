"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import styles from "./Hero.module.css";
import DiscoveryHall from "../Sections/DiscoveryHall";
import { handlePlayClick } from "../../utils/navigation";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const current = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      setProgress((current / duration) * 100);
    }
  };

  return (
    <div className={styles.container}>
      {/* 1. Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroBackground}>
          <Image
            src="/photos/home-background.png"
            alt="Luxor Temple"
            fill
            priority
            className={styles.heroImage}
          />
          <div className={styles.heroOverlay}></div>
        </div>

        <motion.div 
          className={styles.heroContent}
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className={styles.heroTopText}>EST. 2026 — VIRTUAL EGYPTIAN MUSEUM</motion.div>
          <motion.h1 variants={fadeInUp} className={styles.heroTitle}>STEP INTO HORUS</motion.h1>
          <motion.p variants={fadeInUp} className={styles.heroSubtitle}>
            Walk through 3D reconstructions of ancient Egyptian temples. Ask questions to Horus, your guide, directly from your web browser or phone.
          </motion.p>



          <motion.div variants={fadeInUp} className={styles.heroButtons}>
            <button className={styles.primaryButton} onClick={handlePlayClick}>
              <span className={styles.playIcon}>▶</span> PLAY NOW
            </button>
          </motion.div>

        </motion.div>

        <motion.div 
          className={styles.scrollIndicator}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <div className={styles.mouse}>
            <div className={styles.wheel}></div>
          </div>
        </motion.div>
      </section>


      {/* 4. Trailer Section */}
      <motion.section 
        className={styles.trailerSection}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <motion.span variants={fadeInUp} className={styles.sectionLabel}>CINEMATIC PREVIEW</motion.span>
        <motion.h2 variants={fadeInUp} className={styles.sectionTitle}>WATCH THE TRAILER.</motion.h2>
        <motion.p variants={fadeInUp} className={styles.trailerSubtitle}>
          Experience a glimpse of what awaits inside the temple.
        </motion.p>

        <motion.div variants={fadeInUp} className={styles.videoWrapper} onClick={togglePlay}>
          <video
            ref={videoRef}
            className={styles.trailerVideo}
            src="/photos/intro-video.mp4"
            poster="/photos/home-background.png"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onEnded={() => setIsPlaying(false)}
            onTimeUpdate={handleTimeUpdate}
            playsInline
          />
          {!isPlaying && (
            <div className={styles.customPlayButton}>
              <span className={styles.playIconLarge}>▶</span>
            </div>
          )}
          <div className={styles.customControlsBar}>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </motion.div>
      </motion.section>

      <DiscoveryHall />

      {/* 6. Final CTA Section */}
      <motion.section 
        className={styles.finalCtaSection}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <motion.h2 variants={fadeInUp} className={styles.finalCtaTitle}>START THE TOUR</motion.h2>
        <motion.p variants={fadeInUp} className={styles.finalCtaSubtitle}>PLAY ON WEB OR MOBILE (NO VR GEAR NEEDED)</motion.p>
        <motion.button variants={fadeInUp} className={styles.primaryButton} onClick={handlePlayClick}>
          <span className={styles.playIcon}>▶</span> PLAY NOW
        </motion.button>


      </motion.section>
    </div>
  );
}
