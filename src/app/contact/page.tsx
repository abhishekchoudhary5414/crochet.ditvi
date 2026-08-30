"use client";

import React, { useState } from "react";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookIcon from "@mui/icons-material/Facebook";
import PinterestIcon from "@mui/icons-material/Pinterest";
import siteConfig from "@/data/siteConfig.json";
import Button from "@/components/Button/Button";
import { useApp } from "@/context/AppContext";
import styles from "./contact.module.css";

export default function ContactPage() {
  const { addToast } = useApp();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate submission
    addToast(`Thank you, ${formData.name}! Your message has been sent successfully.`, "success");
    setFormData({
      name: "",
      email: "",
      phone: "",
      message: "",
    });
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>Contact Us</h1>
        <p className={styles.desc}>
          Have a question about our handmade products, shipping, orders, or stitch work? Reach out and we will respond within 24 hours!
        </p>
      </header>

      {/* Grid Layout */}
      <div className={styles.layout}>
        {/* Left column: Contact Form */}
        <form onSubmit={handleSubmit} className={styles.formCard}>
          <h2 className={styles.formTitle}>Send a Message</h2>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label htmlFor="cnt-name" className={styles.label}>Your Name *</label>
              <input
                type="text"
                id="cnt-name"
                name="name"
                required
                placeholder="e.g. Rachel Adams"
                value={formData.name}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="cnt-email" className={styles.label}>Email Address *</label>
              <input
                type="email"
                id="cnt-email"
                name="email"
                required
                placeholder="e.g. rachel@gmail.com"
                value={formData.email}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="cnt-phone" className={styles.label}>Phone Number</label>
              <input
                type="tel"
                id="cnt-phone"
                name="phone"
                placeholder="Phone (optional)"
                value={formData.phone}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="cnt-message" className={styles.label}>Message *</label>
              <textarea
                id="cnt-message"
                name="message"
                required
                rows={5}
                placeholder="What would you like to ask or share with us?"
                value={formData.message}
                onChange={handleInputChange}
                className={styles.textarea}
              />
            </div>
          </div>

          <Button type="submit" variant="primary" fullWidth size="lg" style={{ marginTop: "20px" }}>
            Send Message
          </Button>
        </form>

        {/* Right column: Info & WhatsApp */}
        <aside className={styles.infoCol}>
          {/* Quick WhatsApp Support */}
          <div className={styles.whatsappCard}>
            <h3 className={styles.whatsappTitle}><ChatBubbleOutlineOutlinedIcon fontSize="small" /> Quick WhatsApp Support</h3>
            <p className={styles.whatsappDesc}>
              Want an instant response about a product or a custom order draft? Chat directly with our studio head on WhatsApp.
            </p>
            <a
              href={`https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(siteConfig.whatsappMessage)}`}
              target="_blank"
              rel="noreferrer"
              style={{ display: "block", width: "100%" }}
            >
              <Button variant="primary" className={styles.whatsappBtn} fullWidth>
                Chat on WhatsApp
              </Button>
            </a>
          </div>

          {/* Contact Details */}
          <div className={styles.infoBlock}>
            <h3 className={styles.infoTitle}>Studio Information</h3>
            <div className={styles.infoDetails}>
              <div className={styles.infoItem}>
                <span className={styles.infoIcon}><LocationOnOutlinedIcon fontSize="small" /></span>
                <span>
                  <strong>Ditvi Crochet Studio</strong> <br />
                  Studio 12, Craft Valley, <br />
                  New Delhi, India - 110001
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoIcon}><EmailOutlinedIcon fontSize="small" /></span>
                <span>
                  <strong>Email:</strong> <br />
                  hello@ditvicrochet.com
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoIcon}><PhoneOutlinedIcon fontSize="small" /></span>
                <span>
                  <strong>Phone:</strong> <br />
                  +91 98765 43210
                </span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoIcon}><AccessTimeOutlinedIcon fontSize="small" /></span>
                <span>
                  <strong>Studio Hours:</strong> <br />
                  Mon - Sat (09:00 AM - 06:00 PM) <br />
                  Closed on Sundays and National Holidays
                </span>
              </div>
            </div>
          </div>

          {/* Map Placement */}
          <div className={styles.mapPlaceholder}>
            <div className={styles.mapDesign} />
            <div className={styles.mapPin}><LocationOnOutlinedIcon fontSize="small" /></div>
          </div>

          {/* Social connections */}
          <div className={styles.socialsRow}>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="Instagram">
              <InstagramIcon fontSize="small" />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="Facebook">
              <FacebookIcon fontSize="small" />
            </a>
            <a href="https://pinterest.com" target="_blank" rel="noreferrer" className={styles.socialLink} aria-label="Pinterest">
              <PinterestIcon fontSize="small" />
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
