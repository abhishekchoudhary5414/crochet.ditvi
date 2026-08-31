"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import Button from "@/components/Button/Button";
import styles from "./Newsletter.module.css";

export default function Newsletter() {
  const { addToast } = useApp();

  const handleJoinChannel = () => {
    window.open("https://whatsapp.com/channel/0029Vb8yxiYLNSZz50O43w0w", "_blank", "noopener,noreferrer");
    addToast("Opening the WhatsApp channel.", "success");
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
            {/* <div className={styles.form}> */}
              <Button variant="primary" onClick={handleJoinChannel} className={styles.subscribeBtn}>
                Join WhatsApp Channel
              </Button>
            {/* </div> */}
            <p className={styles.footerNote}>
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
