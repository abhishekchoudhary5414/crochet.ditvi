"use client";

import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import siteConfig from "@/data/siteConfig.json";
import styles from "./FloatingWhatsAppButton.module.css";

export default function FloatingWhatsAppButton() {
  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(siteConfig.whatsappMessage)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      className={styles.wrapper}
    >
      <WhatsAppIcon fontSize="large" />
    </a>
  );
}
