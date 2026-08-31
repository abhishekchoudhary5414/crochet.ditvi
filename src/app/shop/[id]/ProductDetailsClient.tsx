"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import siteConfig from "@/data/siteConfig.json";
import { products, Product, Review } from "@/data/products";
import ProductCard from "@/components/ProductCard/ProductCard";
import QuickViewModal from "@/components/QuickViewModal/QuickViewModal";
import ReviewCard from "@/components/ReviewCard/ReviewCard";
import Button from "@/components/Button/Button";
import styles from "./details.module.css";

interface ProductDetailsClientProps {
  id: string;
}

export default function ProductDetailsClient({ id }: ProductDetailsClientProps) {
  // Find product by id
  const product = products.find((p) => p.id === id);

  // States
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [localReviews, setLocalReviews] = useState<Review[]>([]);
  const [selectedQuickViewProduct, setSelectedQuickViewProduct] = useState<Product | null>(null);

  // Accordion state
  const [accordionOpen, setAccordionOpen] = useState({
    details: true,
    materials: false,
    care: false,
    delivery: false,
  });

  // Image Zoom states
  const [zoomStyle, setZoomStyle] = useState<React.CSSProperties>({});
  const imageRef = useRef<HTMLImageElement>(null);

  // New Review Form States
  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");

  // Initialize options and reviews
  useEffect(() => {
    if (product) {
      setSelectedColor(product.colors[0]?.name || "Default");
      setSelectedSize(product.sizes[0] || "Standard");
      setQuantity(1);
      setActiveImageIndex(0);
      setLocalReviews(product.reviews);
    }
  }, [product]);

  if (!product) {
    return (
      <div className={`${styles.container} text-center`} style={{ padding: "80px 0" }}>
        <span style={{ fontSize: "4rem" }}><Inventory2OutlinedIcon fontSize="inherit" /></span>
        <h1 className={styles.title} style={{ marginTop: "20px" }}>Product Not Found</h1>
        <p style={{ marginBottom: "30px", opacity: 0.8 }}>
          Sorry, the product you are looking for does not exist or has been removed from our catalog.
        </p>
        <Link href="/shop">
          <Button variant="primary">Back to Shop</Button>
        </Link>
      </div>
    );
  }

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercentage = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  // Stepper controls
  const handleIncreaseQty = () => setQuantity((q) => q + 1);
  const handleDecreaseQty = () => setQuantity((q) => Math.max(1, q - 1));

  const handleOrderOnWhatsApp = () => {
    const orderMessage = encodeURIComponent(
      `Hi Ditvi Crochet, I want to order ${product.name}.\n` +
        `Color: ${selectedColor}\n` +
        `Size: ${selectedSize}\n` +
        `Quantity: ${quantity}\n` +
        `Price: ₹${product.price.toFixed(2)}\nPlease confirm availability and delivery details.`
    );

    window.open(`https://wa.me/${siteConfig.whatsappNumber}?text=${orderMessage}`, "_blank", "noopener,noreferrer");
  };

  // Accordion Toggle
  const toggleAccordion = (key: keyof typeof accordionOpen) => {
    setAccordionOpen((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Image Hover Zoom logic
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(1.8)",
    });
  };

  const handleMouseLeave = () => {
    setZoomStyle({
      transformOrigin: "center",
      transform: "scale(1)",
    });
  };

  // Handle Review Submission
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewName || !reviewComment) return;

    const newReview: Review = {
      id: `r-user-${Date.now()}`,
      name: reviewName,
      rating: reviewRating,
      date: new Date().toISOString().split("T")[0],
      comment: reviewComment,
    };

    setLocalReviews((prev) => [newReview, ...prev]);
    setReviewName("");
    setReviewComment("");
    setReviewRating(5);
  };

  // Related products
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  // Build displayed images array: prefer selected color image if provided
  const colorHasImages = product.colors && product.colors.some((c: any) => !!c.image);
  const displayedImages = colorHasImages
    ? (() => {
        const colorObj = product.colors.find((c: any) => c.name === selectedColor);
        const colorImg = colorObj?.image;
        const rest = product.images.filter((img) => img !== colorImg);
        return colorImg ? [colorImg, ...rest] : product.images;
      })()
    : product.images;

  useEffect(() => {
    if (colorHasImages) setActiveImageIndex(0);
  }, [selectedColor, colorHasImages]);

  return (
    <div className={styles.container}>
      {/* Back button */}
      <Link href="/shop" className={styles.backBtn}>
        <ArrowBackIcon fontSize="small" /> Back to Shop
      </Link>

      <div className={styles.grid}>
        {/* Gallery */}
        <div className={styles.galleryCol}>
          <div
            className={styles.mainImageWrapper}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={displayedImages[activeImageIndex]}
              alt={product.name}
              className={styles.mainImage}
              style={zoomStyle}
              ref={imageRef}
            />
            {hasDiscount && (
              <span className={styles.discountBadge}>-{discountPercentage}% Off</span>
            )}
          </div>
          {displayedImages.length > 1 && (
            <div className={styles.thumbnails}>
              {displayedImages.map((img, idx) => (
                <button
                  key={idx}
                  className={`${styles.thumbnailBtn} ${
                    idx === activeImageIndex ? styles.activeThumbnail : ""
                  }`}
                  onClick={() => setActiveImageIndex(idx)}
                >
                  <img src={img} alt={`${product.name} thumbnail ${idx + 1}`} className={styles.thumbnailImg} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info Column */}
        <div className={styles.infoCol}>
          <span className={styles.categoryName}>{product.category.replace("-", " ")}</span>
          <h1 className={styles.title}>{product.name}</h1>

          {/* Rating */}
          <div className={styles.ratingRow}>
            <span className={styles.stars}>
              {[...Array(5)].map((_, i) =>
                i < Math.round(product.rating) ? (
                  <StarIcon key={i} fontSize="small" />
                ) : (
                  <StarBorderIcon key={i} fontSize="small" />
                )
              )}
            </span>
            <span><StarIcon fontSize="small" /> {product.rating}</span>
            <a
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("reviews")?.scrollIntoView({ behavior: "smooth" });
              }}
              className={styles.reviewLink}
            >
              ({localReviews.length} customer reviews)
            </a>
          </div>

          {/* Price */}
          <div className={styles.priceRow}>
            <span className={styles.price}>₹{product.price.toFixed(2)}</span>
            {hasDiscount && (
              <span className={styles.originalPrice}>
                ₹{product.originalPrice?.toFixed(2)}
              </span>
            )}
          </div>

          <p className={styles.description}>{product.description}</p>

          {/* Variations Selectors */}
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

          {/* Quantity and Action Buttons */}
          <div className={styles.actionsRow}>
            {/* Quantity Stepper */}
            <div className={styles.quantityStepper}>
              <button onClick={handleDecreaseQty} className={styles.stepperBtn} aria-label="Decrease quantity">
                -
              </button>
              <span className={styles.quantityVal}>{quantity}</span>
              <button onClick={handleIncreaseQty} className={styles.stepperBtn} aria-label="Increase quantity">
                +
              </button>
            </div>

            <Button
              variant="primary"
              onClick={handleOrderOnWhatsApp}
              disabled={product.stockStatus === "out_of_stock"}
              className={styles.whatsappOrderBtn}
              style={{ flex: 2, minWidth: 0, height: "48px" }}
            >
              {product.stockStatus === "out_of_stock" ? "Out of Stock" : "Order on WhatsApp"}
            </Button>

          </div>

          {/* Accordion Specs */}
          <div className={styles.accordion}>
            {/* Item 1: Details */}
            <div className={styles.accordionItem}>
              <button
                className={styles.accordionHeader}
                onClick={() => toggleAccordion("details")}
              >
                <span>Product Details</span>
                <span className={`${styles.accordionIcon} ${accordionOpen.details ? styles.accordionIconOpen : ""}`}>
                  <ExpandMoreIcon fontSize="small" />
                </span>
              </button>
              {accordionOpen.details && (
                <div className={styles.accordionContent}>
                  <ul className={styles.bulletList}>
                    {product.details.map((detail, idx) => (
                      <li key={idx}>{detail}</li>
                    ))}
                    <li>Available in multiple customizable variations.</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Item 2: Materials */}
            <div className={styles.accordionItem}>
              <button
                className={styles.accordionHeader}
                onClick={() => toggleAccordion("materials")}
              >
                <span>Materials & Sourcing</span>
                <span className={`${styles.accordionIcon} ${accordionOpen.materials ? styles.accordionIconOpen : ""}`}>
                  <ExpandMoreIcon fontSize="small" />
                </span>
              </button>
              {accordionOpen.materials && (
                <div className={styles.accordionContent}>
                  <p>Hand-woven using quality components selected for softness and environmental values:</p>
                  <ul className={styles.bulletList}>
                    {product.materials.map((mat, idx) => (
                      <li key={idx}>{mat}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Item 3: Care Instructions */}
            <div className={styles.accordionItem}>
              <button
                className={styles.accordionHeader}
                onClick={() => toggleAccordion("care")}
              >
                <span>Wash & Care Instructions</span>
                <span className={`${styles.accordionIcon} ${accordionOpen.care ? styles.accordionIconOpen : ""}`}>
                  <ExpandMoreIcon fontSize="small" />
                </span>
              </button>
              {accordionOpen.care && (
                <div className={styles.accordionContent}>
                  <ul className={styles.bulletList}>
                    {product.careInstructions.map((care, idx) => (
                      <li key={idx}>{care}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Item 4: Delivery info */}
            <div className={styles.accordionItem}>
              <button
                className={styles.accordionHeader}
                onClick={() => toggleAccordion("delivery")}
              >
                <span>Delivery & Returns Information</span>
                <span className={`${styles.accordionIcon} ${accordionOpen.delivery ? styles.accordionIconOpen : ""}`}>
                  <ExpandMoreIcon fontSize="small" />
                </span>
              </button>
              {accordionOpen.delivery && (
                <div className={styles.accordionContent}>
                  <p>
                    Because this item is crafted completely by hand, production times range from 3-5 business days depending on queue lengths.
                  </p>
                  <ul className={styles.bulletList}>
                    <li>Free standard shipping on orders above ₹50.</li>
                    <li>Estimated delivery: 5-8 business days after dispatch.</li>
                    <li>Returns: Unused items can be returned within 14 days of delivery. Custom products are non-refundable.</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section id="reviews" className={styles.reviewsSection}>
        <div className={styles.reviewsHeader}>
          <h2 className={styles.reviewsTitle}>Customer Reviews</h2>
          <span className={styles.stars}>
            <StarIcon fontSize="small" /> {product.rating} average based on {localReviews.length} reviews
          </span>
        </div>

        <div className={styles.reviewsGrid}>
          {/* Reviews list */}
          <div className={styles.reviewsList}>
            {localReviews.length > 0 ? (
              localReviews.map((rev) => (
                <ReviewCard key={rev.id} review={rev} />
              ))
            ) : (
              <p style={{ opacity: 0.8, fontStyle: "italic" }}>
                No reviews yet. Be the first to share your cozy stitch story!
              </p>
            )}
          </div>

          {/* Submission Form */}
          <div className={styles.reviewFormCard}>
            <h3 className={styles.formTitle}>Leave a Review</h3>
            <form onSubmit={handleSubmitReview}>
              <div className={styles.formGroup}>
                <label className={styles.optionLabel}>Your Rating</label>
                <div className={styles.starRatingSelector}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className={`${styles.starRatingBtn} ${
                        star <= reviewRating ? styles.starRatingBtnActive : ""
                      }`}
                    >
                      {star <= reviewRating ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="rev-name" className={styles.optionLabel}>Your Name</label>
                <input
                  type="text"
                  id="rev-name"
                  required
                  placeholder="e.g. Amanda Jones"
                  value={reviewName}
                  onChange={(e) => setReviewName(e.target.value)}
                  className={styles.formInput}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="rev-comment" className={styles.optionLabel}>Your Comments</label>
                <textarea
                  id="rev-comment"
                  required
                  rows={4}
                  placeholder="Share your experience with our crochet stitches..."
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className={styles.formTextarea}
                />
              </div>

              <Button variant="primary" type="submit" fullWidth>
                Submit Review
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <section className={styles.relatedSection}>
          <h2 className={styles.relatedTitle}>Related Handmade Treasures</h2>
          <div className={styles.relatedGrid}>
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onQuickView={(prod) => setSelectedQuickViewProduct(prod)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Related quick view modal support */}
      <QuickViewModal
        product={selectedQuickViewProduct}
        onClose={() => setSelectedQuickViewProduct(null)}
      />
    </div>
  );
}
