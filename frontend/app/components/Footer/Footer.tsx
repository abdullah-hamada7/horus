"use client";

import { motion ,type Variants} from "framer-motion";
import styles from "./Footer.module.css";
import { handlePlayClick } from "../../utils/navigation";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } 
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <motion.div 
        className={styles.container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
        variants={staggerContainer}
      >

        <motion.div variants={fadeInUp} className={styles.sloganContainer}>
          <h2 className={styles.sloganMain}>HISTORY ISN&apos;T READ. IT&apos;S EXPERIENCED.</h2>
          <p className={styles.sloganSub}>
            Walk the halls of the pharaohs in a 3D simulation on your web browser or phone.
          </p>
          <div className={styles.divider}></div>
        </motion.div>

        <motion.div variants={fadeInUp} className={styles.bottomBar}>
          <p className={styles.copyright}>&copy; 2026 HORUS - Built for the dreamers of yesterday.</p>
        </motion.div>
      </motion.div>
    </footer>
  );
}

