"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
// Lightweight inline SVG icons to avoid heavy external icon deps
function PersonIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 12c2.7614 0 5-2.2386 5-5s-2.2386-5-5-5-5 2.2386-5 5 2.2386 5 5 5z" fill="currentColor" />
      <path d="M3 20c0-3.866 3.5817-7 9-7s9 3.134 9 7v1H3v-1z" fill="currentColor" />
    </svg>
  );
}

function CartIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 4h-2l-1 2v2h2l3.6 7.59-1.35 2.45A1 1 0 0 0 9 19h9v-2H10.42a.25.25 0 0 1-.22-.14L11.1 16h5.45a1 1 0 0 0 .93-.63l1.58-4.02A1 1 0 0 0 18.1 9H7.21l-.94-2z" fill="currentColor" />
      <circle cx="10.5" cy="20.5" r="1.5" fill="currentColor" />
      <circle cx="17.5" cy="20.5" r="1.5" fill="currentColor" />
    </svg>
  );
}
import { useApp } from '@/context/AppContext';
import siteConfig from "@/data/siteConfig.json";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  // Hide global navbar on admin routes
  if (typeof pathname === 'string' && pathname.startsWith('/admin')) return null;
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
  const { cart } = useApp();
  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

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
          <Link href="/cart" className={styles.cartButton} aria-label="View cart">
            <CartIcon size={18} />
            <span className={styles.cartCount}>{cartCount}</span>
          </Link>
          <Link href="/account/profile" className={styles.profileButton} aria-label="My account">
            <PersonIcon size={18} />
          </Link>
        </div>
      </div>
    </header>
  );
}
