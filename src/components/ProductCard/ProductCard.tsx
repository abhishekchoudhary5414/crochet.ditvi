"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import siteConfig from "@/data/siteConfig.json";
import { Product } from "@/data/products";
import styles from "./ProductCard.module.css";
import { useApp } from '@/context/AppContext';
import supabase from '@/lib/supabaseClient';

// Small inline icons to avoid external dependency
const VisibilityIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10z" fill="currentColor" />
    <circle cx="12" cy="12" r="2.5" fill="currentColor" />
  </svg>
);

const StarIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.788 1.402 8.172L12 18.896 4.664 23.17l1.402-8.172L.132 9.21l8.2-1.192L12 .587z" fill="currentColor" />
  </svg>
);

const WhatsAppIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20.52 3.48A11.88 11.88 0 0 0 12 .5C6 0 1 4.98 1 11.02c0 1.94.5 3.84 1.44 5.5L.5 23.5l6.98-1.82A11.88 11.88 0 0 0 12 22.5c6 0 10.98-4.98 10.98-11.02 0-3.02-1.17-5.85-3.46-7.98z" fill="currentColor" />
  </svg>
);

const PaidIcon = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 1L3 5v6c0 5 3.58 9.74 9 11 5.42-1.26 9-6 9-11V5l-9-4z" fill="currentColor" />
  </svg>
);

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { addToCart, addToast } = useApp();
  const router = useRouter();
  const productPath = product.slug || product.id;

  const handleOrderOnWhatsApp = (e: React.MouseEvent) => {
    e.preventDefault();
    const message = encodeURIComponent(
      `Hi Ditvi Crochet, I want to order ${product.name} (${product.category.replace("-", " ")}).\n` +
        `Color: ${product.colors?.[0]?.name || "Default"}\n` +
        `Size: ${product.sizes?.[0] || "Standard"}\n` +
        `Price: ₹${product.price.toFixed(2)}\nPlease share availability and delivery details.`
    );
    window.open(`https://wa.me/${siteConfig.whatsappNumber}?text=${message}`, "_blank", "noopener,noreferrer");
  };

  const hasDiscount = typeof product.originalPrice === 'number' && product.originalPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart({
      id: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      image: product.images?.[0] || '',
      color: product.colors?.[0]?.name || '',
      size: product.sizes?.[0] || ''
    });
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    const item = { id: product.id, slug: product.slug, name: product.name, price: product.price, image: product.images?.[0] || '', color: product.colors?.[0]?.name || '', size: product.sizes?.[0] || '', quantity: 1 };
    try { sessionStorage.setItem('ditvi_buy_now', JSON.stringify(item)); } catch (e) {}
    router.push('/checkout');
  };

  return (
    <div className={styles.card}>
      <Link href={`/shop/${productPath}`} className={styles.imageLink}>
        <div className={styles.imageWrapper}>
          <img src={product.images?.[0] || '/logo/logo.png'} alt={product.name} className={styles.image} loading="lazy" />

          {hasDiscount && (
            <span className={`${styles.badge} ${styles.discountBadge}`}>-{discountPercentage}% Off</span>
          )}
          {product.isBestSeller && !hasDiscount && (
            <span className={`${styles.badge} ${styles.bestBadge}`}>Best Seller</span>
          )}
          {product.isNewArrival && !hasDiscount && !product.isBestSeller && (
            <span className={`${styles.badge} ${styles.newBadge}`}>New</span>
          )}

        </div>
      </Link>

      <div className={styles.content}>
        <span className={styles.category}>{product.category.replace("-", " ")}</span>
        <Link href={`/shop/${productPath}`} className={styles.titleLink}><h3 className={styles.title}>{product.name}</h3></Link>

        <div className={styles.ratingRow}>
          <span className={styles.stars}><StarIcon /> {product.rating?.toFixed?.(1) ?? '0.0'}</span>
          <span className={styles.reviews}>({product.reviewCount ?? 0})</span>
        </div>

        <div className={styles.footerRow}>
          <div className={styles.priceContainer}>
            <span className={styles.price}>₹{product.price.toFixed(2)}</span>
            {hasDiscount && <span className={styles.originalPrice}>₹{product.originalPrice?.toFixed(2)}</span>}
          </div>

          <div className={styles.btn}>
            <Link href={`/shop/${productPath}`} className={styles.viewDetailsBtn} aria-label={`View details for ${product.name}`}>View Details</Link>

            <div className={styles.actionGroup}>
              <button className={styles.addCartBtn} onClick={handleAddToCart} aria-label="Add to cart">Add to Cart</button>
              <button className={styles.buyNowBtn} onClick={handleBuyNow} aria-label="Buy now"><PaidIcon /> Buy Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
