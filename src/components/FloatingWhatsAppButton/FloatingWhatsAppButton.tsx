"use client";

import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import siteConfig from "@/data/siteConfig.json";

export default function FloatingWhatsAppButton() {
  const whatsappUrl = `https://wa.me/${siteConfig.whatsappNumber}?text=${encodeURIComponent(siteConfig.whatsappMessage)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat on WhatsApp"
      style={{
        position: "fixed",
        right: "20px",
        bottom: "20px",
        width: "60px",
        height: "60px",
        borderRadius: "50%",
        background: "linear-gradient(135deg, #25D366, #128C7E)",
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 12px 30px rgba(37, 211, 102, 0.35)",
        zIndex: 2000,
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px) scale(1.04)";
        e.currentTarget.style.boxShadow = "0 16px 34px rgba(37, 211, 102, 0.45)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0) scale(1)";
        e.currentTarget.style.boxShadow = "0 12px 30px rgba(37, 211, 102, 0.35)";
      }}
    >
      <WhatsAppIcon fontSize="large" />
    </a>
  );
}
