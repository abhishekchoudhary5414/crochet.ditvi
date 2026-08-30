"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { cart, wishlist, searchQuery, setSearchQuery } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const pathname = usePathname();
  const router = useRouter();

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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    router.push(`/shop?search=${encodeURIComponent(searchInput)}`);
    setShowSearch(false);
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
    { name: "Categories", path: "/categories" },
    { name: "Custom Orders", path: "/custom-orders" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
  ];

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

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
        <Link href="/" className={styles.logo}>
          Ditvi Crochet
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
          {/* Search Toggle */}
          <div className={styles.searchContainer}>
            {showSearch ? (
              <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
                <input
                  type="text"
                  placeholder="Search cozy products..."
                  className={styles.searchInput}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  autoFocus
                  onBlur={() => {
                    // Slight delay to allow submit click
                    setTimeout(() => setShowSearch(false), 200);
                  }}
                />
              </form>
            ) : (
              <button
                className={styles.actionBtn}
                onClick={() => {
                  setShowSearch(true);
                  setSearchInput(searchQuery);
                }}
                aria-label="Search site"
              >
                🔍
              </button>
            )}
          </div>

          {/* Wishlist Link */}
          <Link href="/shop?filter=wishlist" className={styles.actionBtn} aria-label="View Wishlist">
            ❤️
            {wishlist.length > 0 && (
              <span className={styles.badge}>{wishlist.length}</span>
            )}
          </Link>

          {/* Cart Link */}
          <Link href="/cart" className={styles.actionBtn} aria-label="View Cart">
            🛒
            {totalCartItems > 0 && (
              <span className={styles.badge}>{totalCartItems}</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}
