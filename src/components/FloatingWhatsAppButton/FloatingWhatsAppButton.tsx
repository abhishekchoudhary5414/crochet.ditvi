"use client";

import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import styles from "./FloatingWhatsAppButton.module.css";

export default function FloatingWhatsAppButton() {
  const whatsappNumber = "919285248504";
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent("Hi Ditvi Crochet, I need support.")}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className={styles.wrapper}
    >
      <span className={styles.iconWrap}>
        <WhatsAppIcon fontSize="medium" />
      </span>
      <span className={styles.label}>Support</span>
    </a>
  );
}
