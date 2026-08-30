"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LocalFloristOutlinedIcon from "@mui/icons-material/LocalFloristOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import { categories } from "@/data/categories";
import { products, Product } from "@/data/products";
import ProductCard from "@/components/ProductCard/ProductCard";
import CategoryCard from "@/components/CategoryCard/CategoryCard";
import ReviewCard, { ReviewData } from "@/components/ReviewCard/ReviewCard";
import QuickViewModal from "@/components/QuickViewModal/QuickViewModal";
import Newsletter from "@/components/Newsletter/Newsletter";
import Button from "@/components/Button/Button";
import styles from "./page.module.css";
import HeroImage from '../../public/hero/hero.png'

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Filter products
  const bestSellers = products.filter((p) => p.isBestSeller).slice(0, 4);
  const newArrivals = products.filter((p) => p.isNewArrival).slice(0, 4);

  // Take first 4 categories for homepage display
  const featuredCategories = categories.slice(0, 4);

  // Mock static review testimonials for Ditvi Crochet brand
  const brandReviews: ReviewData[] = [
    {
      id: "br1",
      name: "Sophia L.",
      rating: 5,
      date: "2026-08-28",
      comment: "I requested a custom bag in sage green and it exceeded all expectations! The stitches are incredibly neat and sturdy. Highly recommend!",
      productName: "Blossom Crochet Tote Bag",
    },
    {
      id: "br2",
      name: "Ethan M.",
      rating: 5,
      date: "2026-08-25",
      comment: "The Daisy and Tulip bouquet makes the perfect home decor addition. They look so elegant and cozy without needing any watering.",
      productName: "Classic Daisy & Tulip Bouquet",
    },
    {
      id: "br3",
      name: "Olivia R.",
      rating: 5,
      date: "2026-08-19",
      comment: "Bought Bella the Bunny amigurumi doll for my niece's birthday. The material is so soft and safe. Absolutely love the attention to detail!",
      productName: "Bella the Bunny Doll",
    },
  ];

  // Instagram items
  const instagramGallery = [
    {
      image: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&w=400&q=80",
      likes: 142,
    },
    {
      image: "https://images.unsplash.com/photo-1590736969955-71cb94801759?auto=format&fit=crop&w=400&q=80",
      likes: 218,
    },
    {
      image: "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=400&q=80",
      likes: 95,
    },
    {
      image: "https://images.unsplash.com/photo-1615486511484-92e172cc4fe0?auto=format&fit=crop&w=400&q=80",
      likes: 312,
    },
    {
      image: "https://images.unsplash.com/photo-1575413829029-1bb393595e52?auto=format&fit=crop&w=400&q=80",
      likes: 188,
    },
    {
      image: "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=400&q=80",
      likes: 245,
    },
  ];

  return (
    <div className={styles.home}>
      {/* 2. Hero Section */}
      <section className={styles.hero}>
        <div className={`${styles.heroGrid} ${styles.container}`}>
          <div className={styles.heroContent}>
            <span className={styles.heroSubtitle}>Handmade Premium Boutique</span>
            <h1 className={styles.heroTitle}>
              Handmade With Love, <br />
              <span>Crafted For You.</span>
            </h1>
            <p className={styles.heroDesc}>
              Discover beautifully cozy, high-quality handmade crochet bags, flowers, amigurumi dolls, and unique home accessories. Stitching warmth and love into every single design.
            </p>
            <div className={styles.heroActions}>
              <Link href="/shop">
                <Button variant="primary" size="lg">
                  Shop Now
                </Button>
              </Link>
              <Link href="/categories">
                <Button variant="outline" size="lg">
                  Explore Collection
                </Button>
              </Link>
            </div>
          </div>
          <div className={styles.heroImageWrapper}>
            <div className={styles.heroVisual}>
              <div className={styles.heroGlow} />
              <div className={styles.imageFrame}>
                <Image
                  src={HeroImage}
                  alt="Beautiful crochet product by Ditvi Crochet"
                  className={styles.heroImg}
                  width={510}
                  height={585}
                  priority
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>

              <div className={`${styles.productBadge} ${styles.productBadgeTop}`}>
                <span className={styles.badgeIcon}><LocalFloristOutlinedIcon fontSize="small" /></span>
                <div>
                  <strong>Floral Tote</strong>
                  <small>Handcrafted</small>
                </div>
              </div>

              <div className={`${styles.productBadge} ${styles.productBadgeBottom}`}>
                <span className={styles.badgeIcon}><AutoAwesomeOutlinedIcon fontSize="small" /></span>
                <div>
                  <strong>4.9/5</strong>
                  <small>Happy customers</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Featured Categories */}
      <section className={`${styles.section} ${styles.container}`}>
        <div className={styles.sectionHeader}>
          <span>Collections</span>
          <h2 className={styles.sectionTitle}>Popular Categories</h2>
        </div>
        <div className={styles.categoryGrid}>
          {featuredCategories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      {/* 4. Best Sellers */}
      <section className={`${styles.section} ${styles.container}`}>
        <div className={styles.sectionHeader}>
          <span>Customer Favorites</span>
          <h2 className={styles.sectionTitle}>Best Sellers</h2>
        </div>
        <div className={styles.productsGrid}>
          {bestSellers.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setSelectedProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* 5. New Arrivals */}
      <section className={`${styles.section} ${styles.container}`}>
        <div className={styles.sectionHeader}>
          <span>Just In</span>
          <h2 className={styles.sectionTitle}>New Arrivals</h2>
        </div>
        <div className={styles.productsGrid}>
          {newArrivals.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onQuickView={(p) => setSelectedProduct(p)}
            />
          ))}
        </div>
      </section>

      {/* 6. Why Ditvi Crochet? */}
      <section className={`${styles.container}`}>
        <div className={styles.whyUs}>
          <div className={styles.sectionHeader}>
            <span>Our Promises</span>
            <h2 className={styles.sectionTitle}>Why Choose Ditvi Crochet?</h2>
          </div>
          <div className={styles.whyUsGrid}>
            <div className={styles.whyCard}>
              <span className={styles.whyIcon}><FavoriteBorderOutlinedIcon fontSize="small" /></span>
              <h3 className={styles.whyTitle}>100% Hand-Stitched</h3>
              <p className={styles.whyDesc}>
                Every product is carefully crocheted by hand, investing hours of patient dedication.
              </p>
            </div>
            <div className={styles.whyCard}>
              <span className={styles.whyIcon}><LocalFloristOutlinedIcon fontSize="small" /></span>
              <h3 className={styles.whyTitle}>Premium Materials</h3>
              <p className={styles.whyDesc}>
                We select soft, organic, hypoallergenic yarns and natural wood accents.
              </p>
            </div>
            <div className={styles.whyCard}>
              <span className={styles.whyIcon}><AutoAwesomeOutlinedIcon fontSize="small" /></span>
              <h3 className={styles.whyTitle}>Custom Orders</h3>
              <p className={styles.whyDesc}>
                Have a dream shape, size, or color palette? We custom knit it just for you!
              </p>
            </div>
            <div className={styles.whyCard}>
              <span className={styles.whyIcon}><LocalShippingOutlinedIcon fontSize="small" /></span>
              <h3 className={styles.whyTitle}>Packed with Heart</h3>
              <p className={styles.whyDesc}>
                Arrives beautiful and pre-wrapped, ready for gifting to yourself or a loved one.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Custom Crochet CTA Section */}
      <section className={`${styles.container}`}>
        <div className={styles.customCTA}>
          <span className={styles.ctaSubtitle}>Bespoke Crochet Creation</span>
          <h2 className={styles.ctaTitle}>Have something special in mind?</h2>
          <p className={styles.ctaDesc}>
            Let’s crochet it together. Whether it's a personalized amigurumi doll of your pet, a custom color tote bag, or a specific wedding floral bouquet, we will bring your design to life.
          </p>
          <Link href="/custom-orders">
            <Button variant="primary" className={styles.ctaBtn} size="lg">
              Request Custom Design
            </Button>
          </Link>
        </div>
      </section>

      {/* 8. Customer Reviews */}
      <section className={`${styles.section} ${styles.container}`}>
        <div className={styles.sectionHeader}>
          <span>Love Notes</span>
          <h2 className={styles.sectionTitle}>What Customers Say</h2>
        </div>
        <div className={styles.reviewsGrid}>
          {brandReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </section>

      {/* 9. Handmade Story */}
      <section className={`${styles.section} ${styles.container}`}>
        <div className={styles.storyGrid}>
          <div className={styles.storyImageWrapper}>
            <Image
              src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"
              alt="Hands crocheting with soft wool yarn"
              className={styles.storyImg}
              width={800}
              height={600}
            />
          </div>
          <div>
            <span className={styles.storyLabel}>Made By Hand. Made With Heart.</span>
            <h2 className={styles.storyTitle}>The Story Behind Ditvi Crochet</h2>
            <p className={styles.storyText}>
              At Ditvi Crochet, we believe that in an automated, fast-paced world, there is a distinct beauty in things made slowly, step-by-step, by human hands. Every loop, knot, and stitch carries our creativity, thoughts, and warmth.
            </p>
            <p className={styles.storyText}>
              What started as a childhood hobby and passion for creating cute little yarn figures grew into a boutique brand. Today, we craft everything from fashionable granny square tote bags to everlasting botanical bouquets that never wither.
            </p>
            <p className={styles.storyText}>
              We hope our creations bring a cozy spark of color, comfort, and handmade magic into your home and everyday style!
            </p>
            <Link href="/about">
              <Button variant="secondary">Read Our Full Story</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 10. Instagram Gallery */}
      <section className={`${styles.section} ${styles.container}`}>
        <div className={styles.sectionHeader}>
          <span>@DitviCrochet</span>
          <h2 className={styles.sectionTitle}>Cozy Studio Gram</h2>
        </div>
        <div className={styles.instagramGrid}>
          {instagramGallery.map((post, idx) => (
            <div key={idx} className={styles.instagramCard}>
              <Image
                src={post.image}
                alt={`Ditvi Crochet Instagram post ${idx + 1}`}
                className={styles.instagramImg}
                width={400}
                height={500}
              />
              <div className={styles.instagramOverlay}>
                <span className={styles.instaIcon}><CameraAltOutlinedIcon fontSize="small" /></span>
                <span><FavoriteBorderOutlinedIcon fontSize="small" /> {post.likes} Likes</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 11. Newsletter */}
      <Newsletter />

      {/* Quick View Modal Overlay */}
      <QuickViewModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
