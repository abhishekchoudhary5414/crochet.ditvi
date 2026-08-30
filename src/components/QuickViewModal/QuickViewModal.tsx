"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Product } from "@/data/products";
import { useApp } from "@/context/AppContext";
import Button from "@/components/Button/Button";
import styles from "./QuickViewModal.module.css";

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const { addToCart } = useApp();
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Reset local selection states when the product changes
  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0]?.name || "");
      setSelectedSize(product.sizes[0] || "");
      setQuantity(1);
      setActiveImageIndex(0);
      document.body.style.overflow = "hidden"; // Prevent background scrolling
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [product]);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.images[0],
        color: selectedColor,
        size: selectedSize,
      },
      quantity
    );
    onClose();
  };

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">
          &times;
        </button>

        <div className={styles.grid}>
          {/* Gallery Column */}
          <div className={styles.galleryCol}>
            <div className={styles.mainImageWrapper}>
              <img
                src={product.images[activeImageIndex]}
                alt={product.name}
                className={styles.mainImage}
              />
              {hasDiscount && (
                <span className={styles.discountBadge}>-{discountPercentage}% Off</span>
              )}
            </div>
            {product.images.length > 1 && (
              <div className={styles.thumbnails}>
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    className={`${styles.thumbnailBtn} ${
                      idx === activeImageIndex ? styles.activeThumbnail : ""
                    }`}
                    onClick={() => setActiveImageIndex(idx)}
                  >
                    <img src={img} alt={`${product.name} view ${idx + 1}`} className={styles.thumbnailImg} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details Column */}
          <div className={styles.detailsCol}>
            <span className={styles.categoryName}>
              {product.category.replace("-", " ")}
            </span>
            <h2 className={styles.productName}>{product.name}</h2>

            {/* Price & Rating */}
            <div className={styles.metaRow}>
              <div className={styles.priceContainer}>
                <span className={styles.price}>${product.price.toFixed(2)}</span>
                {hasDiscount && (
                  <span className={styles.originalPrice}>
                    ${product.originalPrice?.toFixed(2)}
                  </span>
                )}
              </div>
              <div className={styles.rating}>
                <span>⭐ {product.rating}</span>
                <span className={styles.reviewCount}>({product.reviewCount} reviews)</span>
              </div>
            </div>

            <p className={styles.description}>{product.description}</p>

            {/* Options Selector */}
            <div className={styles.options}>
              {/* Colors */}
              {product.colors.length > 0 && (
                <div className={styles.optionGroup}>
                  <span className={styles.optionLabel}>Color: {selectedColor}</span>
                  <div className={styles.colorSwatches}>
                    {product.colors.map((color) => (
                      <button
                        key={color.name}
                        className={`${styles.colorSwatch} ${
                          selectedColor === color.name ? styles.activeColor : ""
                        }`}
                        style={{ backgroundColor: color.hex }}
                        onClick={() => setSelectedColor(color.name)}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Sizes */}
              {product.sizes.length > 0 && (
                <div className={styles.optionGroup}>
                  <span className={styles.optionLabel}>Size: {selectedSize}</span>
                  <div className={styles.sizeButtons}>
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        className={`${styles.sizeBtn} ${
                          selectedSize === size ? styles.activeSize : ""
                        }`}
                        onClick={() => setSelectedSize(size)}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quantity and Actions */}
            <div className={styles.actionsRow}>
              <div className={styles.quantityStepper}>
                <button
                  className={styles.stepperBtn}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className={styles.quantityVal}>{quantity}</span>
                <button
                  className={styles.stepperBtn}
                  onClick={() => setQuantity(quantity + 1)}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <Button
                variant="primary"
                onClick={handleAddToCart}
                disabled={product.stockStatus === "out_of_stock"}
                fullWidth
              >
                {product.stockStatus === "out_of_stock" ? "Out of Stock" : "Add to Cart"}
              </Button>
            </div>

            <Link href={`/shop/${product.id}`} className={styles.viewDetailsLink} onClick={onClose}>
              View Full Product Details &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
