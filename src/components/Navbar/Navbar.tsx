"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import siteConfig from "@/data/siteConfig.json";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(siteConfig.whatsappMessage)}`;

  // Handle scroll to add background blur/shadow
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on page change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "Categories", path: "/categories" },
    // { name: "Custom Orders", path: "/custom-orders" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={`${styles.container} container`}>
        {/* Mobile Hamburger Button */}
        <button
          className={`${styles.hamburger} ${isOpen ? styles.active : ""}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle Navigation Menu"
        >
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
          <span className={styles.bar}></span>
        </button>

        {/* Brand Logo */}
        <Link href="/" className={styles.logo} aria-label="Ditvi Crochet home">
          <Image
            src="/logo/logo.svg"
            alt="Ditvi Crochet logo"
            width={120}
            height={48}
            priority
            className={styles.logoImage}
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className={`${styles.nav} ${isOpen ? styles.open : ""}`}>
          <ul className={styles.navList}>
            {navLinks.map((link) => {
              const isActive = pathname === link.path;
              return (
                <li key={link.path} className={styles.navItem}>
                  <Link
                    href={link.path}
                    className={`${styles.navLink} ${isActive ? styles.activeLink : ""}`}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Action Icons & Utilities */}
        <div className={styles.actions}>
          <a href={whatsappUrl} target="_blank" rel="noreferrer" className={styles.whatsappButton} aria-label="Chat on WhatsApp">
            <WhatsAppIcon fontSize="small" />
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </header>
  );
}
