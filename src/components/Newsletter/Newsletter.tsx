"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import Button from "@/components/Button/Button";
import styles from "./Newsletter.module.css";

export default function Newsletter() {
  const { addToast } = useApp();
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    addToast("Welcome to the Ditvi Crochet newsletter family! 💖 Check your inbox soon.", "success");
    setEmail("");
  };

  return (
    <section className={styles.section}>
      <div className={`${styles.container} container`}>
        <div className={styles.card}>
          <div className={styles.content}>
            <span className={styles.sub}>Newsletter</span>
            <h2 className={styles.heading}>Join Our Cozy Stitch Circle</h2>
            <p className={styles.desc}>
              Get 10% off your first custom order request, receive exclusive updates on newly dropped crochet collections, and read stories from our studio!
            </p>
            <form onSubmit={handleSubscribe} className={styles.form}>
              <input
                type="email"
                placeholder="Enter your email address"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button variant="primary" type="submit" className={styles.subscribeBtn}>
                Subscribe
              </Button>
            </form>
            <p className={styles.footerNote}>
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
