"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    // Initialize state
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "HOME", path: "/" },
    { name: "ABOUT", path: "/about" },
    { name: "LIBRARY", path: "/library" },
    { name: "HIEROGLYPHICS", path: "/hieroglyphics" },
    { name: "Team", path: "/team"}
  ];

  return (
    <nav className={`${styles.navbar} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={styles.logo}>
        <Link href="/">
          <Image
            src="/photos/icon.png"
            alt="Horus Logo"
            width={40}
            height={40}
            className={styles.logoImage}
          />
        </Link>
        <Link href="/" className={styles.logoText}>HORUS</Link>
      </div>
      <button
        className={styles.menuToggle}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        <span className={`${styles.hamburger} ${isMenuOpen ? styles.hamburgerOpen1 : ""}`}></span>
        <span className={`${styles.hamburger} ${isMenuOpen ? styles.hamburgerOpen2 : ""}`}></span>
        <span className={`${styles.hamburger} ${isMenuOpen ? styles.hamburgerOpen3 : ""}`}></span>
      </button>

      <div className={`${styles.navLinks} ${isMenuOpen ? styles.navLinksOpen : ""}`}>
        {navLinks.map((link) => (
          <Link
            key={link.name}
            href={link.path}
            className={`${styles.navLink} ${pathname === link.path ? styles.active : ""}`}
            onClick={() => setIsMenuOpen(false)}
          >
            {link.name}
          </Link>
        ))}
      </div>
    </nav>
  );
}
