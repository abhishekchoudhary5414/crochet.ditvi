"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import PinterestIcon from "@mui/icons-material/Pinterest";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import siteConfig from "@/data/siteConfig.json";
import { useApp } from "@/context/AppContext";
import styles from "./Footer.module.css";

export default function Footer() {
  const { addToast } = useApp();
  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(siteConfig.whatsappMessage)}`;

  const handleJoinChannel = () => {
    window.open(siteConfig.whatsappChannelUrl, "_blank", "noopener,noreferrer");
    addToast("Opening the WhatsApp channel.", "success");
  };

  return (
    <footer className={styles.footer}>
      <div className={`${styles.container} container`}>
        {/* Brand Column */}
        <div className={styles.brandCol}>
          <Link href="/" className={styles.logo} aria-label="Ditvi Crochet home">
            <Image
              src="/logo/logo.svg"
              alt="Ditvi Crochet logo"
              width={140}
              height={56}
              className={styles.logoImage}
            />
          </Link>
          <p className={styles.tagline}>Made by Hand. Made With Heart.</p>
          <p className={styles.description}>
            Beautifully cozy, premium handmade crochet products. Little stitches, big love in every single detail.
          </p>
          {/* Social Icons */}
          <div className={styles.socials}>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="Instagram">
              <InstagramIcon fontSize="small" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="Facebook">
              <FacebookIcon fontSize="small" />
            </a>
            <a href="https://pinterest.com" target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="Pinterest">
              <PinterestIcon fontSize="small" />
            </a>
            <a href={whatsappUrl} target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="WhatsApp">
              <WhatsAppIcon fontSize="small" />
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
          <div className={styles.form}>
            <button type="button" onClick={handleJoinChannel} className={styles.submitBtn}>
              Join WhatsApp Channel
            </button>
          </div>
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
