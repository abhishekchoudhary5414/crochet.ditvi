"use client";

import React from "react";
import Link from "next/link";
import { Product } from "@/data/products";
import { useApp } from "@/context/AppContext";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
  const { toggleWishlist, isInWishlist, addToCart } = useApp();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to details page
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0],
      color: product.colors[0]?.name || "Default",
      size: product.sizes[0] || "Standard",
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating
    toggleWishlist(product.id);
  };

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  const isFavorite = isInWishlist(product.id);

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
              👁️
            </button>
            <button
              className={`${styles.overlayBtn} ${isFavorite ? styles.favorited : ""}`}
              onClick={handleWishlistToggle}
              title={isFavorite ? "Remove from Wishlist" : "Add to Wishlist"}
              aria-label={isFavorite ? "Remove from Wishlist" : "Add to Wishlist"}
            >
              ❤️
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
          <span className={styles.stars}>⭐ {product.rating.toFixed(1)}</span>
          <span className={styles.reviews}>({product.reviewCount})</span>
        </div>

        {/* Price & Cart Actions Row */}
        <div className={styles.footerRow}>
          <div className={styles.priceContainer}>
            <span className={styles.price}>${product.price.toFixed(2)}</span>
            {hasDiscount && (
              <span className={styles.originalPrice}>
                ${product.originalPrice?.toFixed(2)}
              </span>
            )}
          </div>

          <button
            className={styles.cartBtn}
            onClick={handleAddToCart}
            disabled={product.stockStatus === "out_of_stock"}
            title="Add to Cart"
            aria-label="Add product to cart"
          >
            {product.stockStatus === "out_of_stock" ? "Out" : "＋"}
          </button>
        </div>
      </div>
    </div>
  );
}
