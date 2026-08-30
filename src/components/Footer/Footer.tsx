"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import styles from "./Footer.module.css";

export default function Footer() {
  const { addToast } = useApp();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    addToast("Thank you for subscribing to our newsletter! 💖", "success");
    setEmail("");
  };

  return (
    <footer className={styles.footer}>
      <div className={`${styles.container} container`}>
        {/* Brand Column */}
        <div className={styles.brandCol}>
          <Link href="/" className={styles.logo}>
            Ditvi Crochet
          </Link>
          <p className={styles.tagline}>Made by Hand. Made With Heart.</p>
          <p className={styles.description}>
            Beautifully cozy, premium handmade crochet products. Little stitches, big love in every single detail.
          </p>
          {/* Social Icons */}
          <div className={styles.socials}>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="Instagram">
              📸
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="Facebook">
              📘
            </a>
            <a href="https://pinterest.com" target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="Pinterest">
              📌
            </a>
            <a href="https://wa.me/911234567890" target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="WhatsApp">
              💬
            </a>
          </div>
        </div>

        {/* Shop Links */}
        <div className={styles.linksCol}>
          <h3 className={styles.title}>Shop Collection</h3>
          <ul className={styles.list}>
            <li><Link href="/shop?category=crochet-bags">Crochet Bags</Link></li>
            <li><Link href="/shop?category=crochet-flowers">Crochet Flowers</Link></li>
            <li><Link href="/shop?category=crochet-dolls">Crochet Dolls</Link></li>
            <li><Link href="/shop?category=crochet-keychains">Crochet Keychains</Link></li>
            <li><Link href="/custom-orders">Custom Orders</Link></li>
          </ul>
        </div>

        {/* Support Links */}
        <div className={styles.linksCol}>
          <h3 className={styles.title}>Customer Support</h3>
          <ul className={styles.list}>
            <li><Link href="/about">Our Story</Link></li>
            <li><Link href="/contact">Contact Us</Link></li>
            <li><Link href="/faq">FAQs</Link></li>
            <li><Link href="/shipping-returns">Shipping & Returns</Link></li>
            <li><Link href="/privacy-policy">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Newsletter Column */}
        <div className={styles.newsletterCol}>
          <h3 className={styles.title}>Join Our Family</h3>
          <p className={styles.newsletterText}>
            Subscribe to get custom order discounts, sneak peeks of new collections, and craft stories!
          </p>
          <form onSubmit={handleSubscribe} className={styles.form}>
            <input
              type="email"
              placeholder="Your email address"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" className={styles.submitBtn}>
              Join
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className={styles.bottomBar}>
        <div className={`${styles.bottomContainer} container`}>
          <p className={styles.copyright}>
            &copy; {new Date().getFullYear()} <strong>Ditvi Crochet</strong>. All rights reserved.
          </p>
          {/* Mock Payment Badges */}
          <div className={styles.payments}>
            <span className={styles.paymentBadge}>Visa</span>
            <span className={styles.paymentBadge}>Mastercard</span>
            <span className={styles.paymentBadge}>UPI</span>
            <span className={styles.paymentBadge}>PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
