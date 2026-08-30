"use client";

import React from "react";
import Link from "next/link";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import StarIcon from "@mui/icons-material/Star";
import siteConfig from "@/data/siteConfig.json";
import { Product } from "@/data/products";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const handleOrderOnWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    const message = encodeURIComponent(
      `Hi Ditvi Crochet, I want to order ${product.name} (${product.category.replace("-", " ")}).\n` +
        `Color: ${product.colors[0]?.name || "Default"}\n` +
        `Size: ${product.sizes[0] || "Standard"}\n` +
        `Price: ₹${product.price.toFixed(2)}\nPlease share availability and delivery details.`
    );
    window.open(`https://wa.me/${siteConfig.whatsappNumber}?text=${message}`, "_blank", "noopener,noreferrer");
  };

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  return (
    <div className={styles.card}>
      {/* Product Image Wrapper */}
      <Link href={`/shop/${product.id}`} className={styles.imageLink}>
        <div className={styles.imageWrapper}>
          <img
            src={product.images[0]}
            alt={product.name}
            className={styles.image}
            loading="lazy"
          />

          {/* Badge overlays */}
          {hasDiscount && (
            <span className={`${styles.badge} ${styles.discountBadge}`}>
              -{discountPercentage}% Off
            </span>
          )}
          {product.isBestSeller && !hasDiscount && (
            <span className={`${styles.badge} ${styles.bestBadge}`}>Best Seller</span>
          )}
          {product.isNewArrival && !hasDiscount && !product.isBestSeller && (
            <span className={`${styles.badge} ${styles.newBadge}`}>New</span>
          )}

          {/* Quick Action Overlay Buttons */}
          <div className={styles.overlayActions}>
            <button
              className={styles.overlayBtn}
              onClick={(e) => {
                e.preventDefault();
                onQuickView(product);
              }}
              title="Quick View"
              aria-label="Quick View product"
            >
              <VisibilityOutlinedIcon fontSize="small" />
            </button>
          </div>
        </div>
      </Link>

      {/* Product Content Details */}
      <div className={styles.content}>
        <span className={styles.category}>{product.category.replace("-", " ")}</span>
        <Link href={`/shop/${product.id}`} className={styles.titleLink}>
          <h3 className={styles.title}>{product.name}</h3>
        </Link>

        {/* Rating Row */}
        <div className={styles.ratingRow}>
          <span className={styles.stars}><StarIcon fontSize="small" /> {product.rating.toFixed(1)}</span>
          <span className={styles.reviews}>({product.reviewCount})</span>
        </div>

        {/* Price & Cart Actions Row */}
        <div className={styles.footerRow}>
          <div className={styles.priceContainer}>
            <span className={styles.price}>₹{product.price.toFixed(2)}</span>
            {hasDiscount && (
              <span className={styles.originalPrice}>
                ₹{product.originalPrice?.toFixed(2)}
              </span>
            )}
          </div>

          <button
            className={styles.orderBtn}
            onClick={handleOrderOnWhatsApp}
            disabled={product.stockStatus === "out_of_stock"}
            title="Order on WhatsApp"
            aria-label="Order product on WhatsApp"
          >
            {product.stockStatus === "out_of_stock" ? "Out" : <><WhatsAppIcon fontSize="small" /> WhatsApp</>}
          </button>
        </div>
      </div>
    </div>
  );
}
