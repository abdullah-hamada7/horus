"use client";

import Image from "next/image";
import Link from "next/link";
import { motion ,type Variants} from "framer-motion";
import styles from "./DiscoveryHall.module.css";

const fadeInUp:Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  }
};

const staggerContainer:Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function DiscoveryHall() {
  const cards = [
    {
      id: 1,
      image: "/photos/3.png",
      title: "Tutankhamun's Treasures",
      year: "1323 BC",
      desc: "Observe the legendary golden death mask and war chariot of the young king.",
      link: "/library"
    },
    {
      id: 2,
      image: "/photos/1.png",
      title: "Temple of Horus at Edfu",
      year: "237 BC",
      desc: "Explore the ancient sanctuary of Horus, from sphinx avenues to the inner chambers.",
      link: "/about"
    },
    {
      id: 3,
      image: "/photos/2.png",
      title: "Nefertiti & Bastet",
      year: "1345 BC",
      desc: "Admire the unmatched beauty of Queen Nefertiti and the sacred protection of Bastet.",
      link: "/library"
    }
  ];


  return (
    <motion.section 
      className={styles.discoverySection}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={staggerContainer}
    >
      <div className={styles.discoveryBackground}>
        <div className={styles.radialGlow}></div>
      </div>
      <div className={styles.discoveryContent}>
        <motion.div variants={fadeInUp} className={styles.discoveryHeader}>
          <p className={styles.discoverySubtext}>Discovery Hall</p>
          <h2 className={styles.discoveryTitle}>Explore the Monuments</h2>
        </motion.div>

        <motion.div variants={staggerContainer} className={styles.cardsGrid}>
          {cards.map((card) => (
            <motion.div variants={fadeInUp} key={card.id} className={styles.card}>
              <div className={styles.cardImageWrapper}>
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 992px) 50vw, 33vw"
                  className={styles.cardImage}
                />
              </div>
              <div className={styles.cardHeader}>
                <h3 className={styles.cardTitle}>{card.title}</h3>
                <span className={styles.cardYear}>{card.year}</span>
              </div>
              <p className={styles.cardDescription}>{card.desc}</p>
              <Link href={card.link} className={styles.exploreLink}>EXPLORE ARTIFACT &rarr;</Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

