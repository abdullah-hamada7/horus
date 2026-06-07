"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";
import styles from "./page.module.css";
import { handlePlayClick } from "../utils/navigation";

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

export default function About() {
  return (
    <main className={styles.main}>
      <header className={styles.hero}>
        <div className={styles.heroBackground}>
          <Image
            src="/photos/hero-photo-(about).jpg"
            alt="About Background"
            fill
            sizes="100vw"
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
          <motion.p variants={fadeInUp} className={styles.sectionTag}>ABOUT</motion.p>
          <motion.h1 variants={fadeInUp} className={styles.title}>WHY WE BUILT HORUS.</motion.h1>
          <motion.p variants={fadeInUp} className={styles.subtitle}>
            Twelve months. Nine students. One question:<br />
            could a museum live inside a screen?
          </motion.p>
        </motion.div>
      </header>

      <section className={styles.contentSection}>
        <motion.div 
          className={styles.featureRow}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className={styles.featureText}>
            <p className={styles.tag}>THE PROBLEM</p>
            <h2>HISTORY DESERVES BETTER THAN A TEXTBOOK.</h2>
            <p>
              When you read about Luxor, you imagine columns. When you visit it, you
              feel awe. Most students never feel that gap. We wanted to close it.
            </p>
            <Link href="/library" className={styles.readMore}>
              EXPLORE LIBRARY &rarr;
            </Link>
          </motion.div>
          <motion.div variants={fadeInUp} className={styles.featureImageWrapper}>
            <Image
              src="/photos/img1(about).jpg"
              alt="History Textbook"
              fill
              className={styles.featureImage}
            />
          </motion.div>
        </motion.div>

        <motion.div 
          className={`${styles.featureRow} ${styles.reverse}`}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className={styles.featureText}>
            <p className={styles.tag}>THE COMPATIBILITY</p>
            <h2>ZERO HEADSETS OR PLUGINS REQUIRED.</h2>
            <p>
              We optimized the 3D assets to load instantly on standard mobile browsers and desktop browsers. You get real-time rendering, dynamic shadows, and 3D navigation directly through a URL, without needing specialized VR hardware.
            </p>
            <button onClick={handlePlayClick} className={`${styles.readMore} border-none p-0 cursor-pointer bg-transparent`}>
              PLAY SIMULATION &rarr;
            </button>
          </motion.div>
          <motion.div variants={fadeInUp} className={styles.featureImageWrapper}>
            <Image
              src="/photos/img2(about).jpg"
              alt="Browser rendering"
              fill
              className={styles.featureImage}
            />
          </motion.div>
        </motion.div>

        <motion.div 
          className={styles.featureRow}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp} className={styles.featureText}>
            <p className={styles.tag}>THE TECHNOLOGY</p>
            <h2>THE 3D ENGINE</h2>
            <p>
              We built the web version using Three.js and the desktop version using Unreal Engine. The 3D models are based on detailed scans of real artifacts. The chat guide, Horus, answers questions using a retrieval database loaded with historical texts.
            </p>
            <Link href="/hieroglyphics" className={styles.readMore}>
              DECODE HIEROGLYPHICS &rarr;
            </Link>
          </motion.div>

          <motion.div variants={fadeInUp} className={styles.featureImageWrapper}>
            <Image
              src="/photos/img3(about).jpg"
              alt="Echo Engine"
              fill
              className={styles.featureImage}
            />
          </motion.div>
        </motion.div>
      </section>


      {/* 8 Stops Virtual Exhibition Route */}
      <section className="max-w-6xl mx-auto px-6 py-16 text-left space-y-12 relative z-20">
        <div className="text-center space-y-2">
          <span className="text-[#ff7a00] text-xs font-bold tracking-[0.3em] uppercase block">THE JOURNEY</span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight uppercase">TOUR STOPS</h2>
          <p className="text-gray-400 text-sm md:text-base max-w-xl mx-auto leading-relaxed mt-2">
            Here are the stops you will visit during the interactive tour:
          </p>
          <div className="w-16 h-[2px] bg-[#ff7a00] mx-auto mt-4 rounded-full shadow-[0_0_8px_rgba(255,122,0,0.5)]"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {[
            {
              stop: "01",
              title: "Temple of Horus at Edfu",
              desc: "Start at the entrance gates. Walk down the avenue of sphinxes where the Opet Festival was once celebrated.",
              image: "/gallery/البوابة.png"
            },
            {
              stop: "02",
              title: "The Criosphinx",
              desc: "Look at the ram-headed sphinx. It represents the god Amun-Ra, combining a ram's head (wisdom) with a lion's body (strength).",
              image: "/gallery/Kabsh.png"
            },
            {
              stop: "03",
              title: "Obelisks at the Gate",
              desc: "Two pink granite obelisks built by Ramesses II stand beside the massive entrance gate.",
              image: "/gallery/مسلة.png"
            },
            {
              stop: "04",
              title: "Colonnade Hall Guardian",
              desc: "Encounter the sphinx guarding the gate. The human head represents the king's wisdom and the lion body represents his power.",
              image: "/gallery/sphinx.png"
            },
            {
              stop: "05",
              title: "The Papyrus Forest",
              desc: "Walk through the columns styled after papyrus plants, built to look like a forest rising from the Nile.",
              image: "/gallery/الاعمدة.png"
            },
            {
              stop: "06",
              title: "Tutankhamun's Treasures",
              desc: "Go inside the sanctuary to see Tutankhamun's gold mask and his war chariot.",
              image: "/gallery/توت.png"
            },
            {
              stop: "07",
              title: "Bastet & Nefertiti",
              desc: "See the black cat statue representing the goddess Bastet and the famous bust of Queen Nefertiti.",
              image: "/gallery/نفرتيتي.png"
            },
            {
              stop: "08",
              title: "Colossus of Ramesses II",
              desc: "End the tour in front of the seated statue of Ramesses II wearing the crown of Upper and Lower Egypt.",
              image: "/gallery/رمسيس.png"
            }
          ].map((item, idx) => (
            <motion.div
              key={idx}
              className="bg-white/[0.02] border border-white/5 p-6 rounded-2xl backdrop-blur-md hover:border-[#ff7a00]/30 hover:shadow-[0_8px_30px_rgba(255,122,0,0.06)] transition-all duration-300 flex flex-col justify-between group"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              variants={fadeInUp}
            >
              <div className="space-y-4">
                <div className="relative w-full h-40 rounded-xl overflow-hidden bg-white/5 mb-4">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 text-[10px] font-mono tracking-widest uppercase">STOP {item.stop}</span>
                  <span className="w-1.5 h-1.5 bg-[#ff7a00] rounded-full group-hover:shadow-[0_0_8px_#ff7a00] transition-shadow"></span>
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-[#ff7a00] transition-colors">{item.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>


      <motion.section 
        className={styles.demoSection}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
      >
        <motion.h2 variants={fadeInUp}>READY TO SEE IT IN ACTION?</motion.h2>
        <motion.button variants={fadeInUp} className={styles.demoButton} onClick={handlePlayClick}>
          <span className={styles.playIcon}>▶</span> PLAY SIMULATION
        </motion.button>
      </motion.section>


    </main>
  );
}

