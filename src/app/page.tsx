"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import LocalFloristOutlinedIcon from "@mui/icons-material/LocalFloristOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import CheckroomOutlinedIcon from "@mui/icons-material/CheckroomOutlined";
import ToysOutlinedIcon from "@mui/icons-material/ToysOutlined";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import HandymanOutlinedIcon from "@mui/icons-material/HandymanOutlined";
import ColorLensOutlinedIcon from "@mui/icons-material/ColorLensOutlined";
import { categories } from "@/data/categories";
import { products, Product } from "@/data/products";
import ProductCard from "@/components/ProductCard/ProductCard";
import CategoryCard from "@/components/CategoryCard/CategoryCard";
import ReviewCard, { ReviewData } from "@/components/ReviewCard/ReviewCard";
import QuickViewModal from "@/components/QuickViewModal/QuickViewModal";
import Newsletter from "@/components/Newsletter/Newsletter";
import Button from "@/components/Button/Button";
import styles from "./page.module.css";
import blogs from "@/data/blogs.json";
import CarouselImage1 from '../../public/hero/carousel1.png'
import CarouselImage2 from '../../public/hero/carousel2.png'
import CarouselImage3 from '../../public/hero/carousel3.png'



function SectionBackground() {
  const icons = [
    { Icon: LocalFloristOutlinedIcon, className: styles.iconOne },
    { Icon: PaletteOutlinedIcon, className: styles.iconTwo },
    { Icon: FavoriteBorderOutlinedIcon, className: styles.iconThree },
    { Icon: HandymanOutlinedIcon, className: styles.iconFour },
    { Icon: CheckroomOutlinedIcon, className: styles.iconFive },
    { Icon: ToysOutlinedIcon, className: styles.iconSix },
    { Icon: AutoAwesomeOutlinedIcon, className: styles.iconSeven },
    { Icon: ColorLensOutlinedIcon, className: styles.iconEight },
  ];

  return (
    <div className={styles.sectionBackground} aria-hidden="true">
      {icons.map(({ Icon, className }, index) => (
        <span key={index} className={`${styles.backgroundIcon} ${className}`}>
          <Icon fontSize="small" />
        </span>
      ))}
    </div>
  );
}

export default function Home() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const heroSlides = [
    {
      label: "Handmade Premium Boutique",
      title: "Handmade With Love, Crafted For You.",
      description: "Discover beautifully cozy, high-quality handmade crochet bags, flowers, amigurumi dolls, and unique home accessories. Stitching warmth and love into every single design.",
      image: CarouselImage1,
      badgeTitle: "Floral Tote",
      badgeMeta: "Handcrafted",
      badgeIcon: LocalFloristOutlinedIcon,
    },
    {
      label: "Bestselling Crochet Gifts",
      title: "Sweet, Thoughtful Pieces Made To Cherish.",
      description: "From statement totes to bouquet keepsakes, each design is created to add charm, warmth, and lasting joy to the people you love most.",
      image: CarouselImage2,
      badgeTitle: "New Bloom",
      badgeMeta: "Fresh drops",
      badgeIcon: AutoAwesomeOutlinedIcon,
    },
    {
      label: "Custom Handmade Magic",
      title: "Dream It, We’ll Crochet It In Your Style.",
      description: "Create a custom piece for birthdays, gifting, home styling, or personal keepsakes with colors, shapes, and stories tailored exactly to you.",
      image: CarouselImage3,
      badgeTitle: "Custom Love",
      badgeMeta: "Made to order",
      badgeIcon: FavoriteBorderOutlinedIcon,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4200);

    return () => clearInterval(interval);
  }, []);

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

  // blog posts loaded from data/blogs.json
  const blogPosts = blogs;

  // Resolve hero image URL (handle imported static image objects)
  const currentHeroImage =
    typeof heroSlides[activeSlide].image === "string"
      ? heroSlides[activeSlide].image
      : heroSlides[activeSlide].image?.src ?? "";

  return (
    <div className={styles.home}>
      {/* 2. Hero Section */}
      <section
        className={styles.hero}
        style={{
          backgroundImage: `url(${currentHeroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className={`${styles.heroGrid} ${styles.container}`}>
          <div className={styles.heroContent}>
            <span className={styles.heroSubtitle}>{heroSlides[activeSlide].label}</span>
            <h1 className={styles.heroTitle}>
              {heroSlides[activeSlide].title}
            </h1>
            <p className={styles.heroDesc}>
              {heroSlides[activeSlide].description}
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
            <div className={styles.sliderDots} aria-label="Hero slider pagination">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.label}
                  type="button"
                  className={`${styles.dot} ${index === activeSlide ? styles.activeDot : ""}`}
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Show slide ${index + 1}`}
                />
              ))}
            </div>
            <div className={styles.heroFeatures}>
              <div className={styles.featureItem}>
                <LocalShippingOutlinedIcon fontSize="small" />
                <span>100% Satisfaction</span>
              </div>
              <div className={styles.featureItem}>
                <LocalFloristOutlinedIcon fontSize="small" />
                <span>Handmade</span>
              </div>
              <div className={styles.featureItem}>
                <FavoriteBorderOutlinedIcon fontSize="small" />
                <span>Custom Orders</span>
              </div>
            </div>

            <p className={styles.heroNote}>Made with love — ethically sourced yarns, careful hand-stitching, and attention to detail.</p>
          </div>
        </div>
      </section>

      {/* 3. Featured Categories */}
      <section className={`${styles.section} ${styles.container} ${styles.decoratedSection}`}>
        <SectionBackground />
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
      <section className={`${styles.section} ${styles.container} ${styles.decoratedSection}`}>
        <SectionBackground />
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
      <section className={`${styles.section} ${styles.container} ${styles.decoratedSection}`}>
        <SectionBackground />
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
          <SectionBackground />
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
          <SectionBackground />
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
      <section className={`${styles.section} ${styles.container} ${styles.decoratedSection}`}>
        <SectionBackground />
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
      <section className={`${styles.section} ${styles.container} ${styles.decoratedSection}`}>
        <SectionBackground />
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
      <section className={`${styles.section} ${styles.container} ${styles.decoratedSection}`}>
        <SectionBackground />
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

      {/* 11. Blog Section */}
      <section className={`${styles.section} ${styles.container} ${styles.decoratedSection}`}>
        <SectionBackground />
        <div className={styles.sectionHeader}>
          <span>Journal</span>
          <h2 className={styles.sectionTitle}>Latest from the Blog</h2>
        </div>
        <div className={styles.blogGrid}>
          {blogPosts.map((post) => (
            <article key={post.id} className={styles.blogCard}>
              <div className={styles.blogImageWrap}>
                <Image
                  src={post.image}
                  alt={post.title}
                  className={styles.blogImage}
                  width={800}
                  height={500}
                />
              </div>
              <div className={styles.blogContent}>
                <div className={styles.blogMetaRow}>
                  <span className={styles.blogCategory}>{post.category}</span>
                  <span className={styles.blogReadTime}>{post.readTime}</span>
                </div>
                <h3 className={styles.blogTitle}>{post.title}</h3>
                <p className={styles.blogExcerpt}>{post.excerpt}</p>
                <Link href={post.href} className={styles.blogLink}>
                  Read article
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 12. Newsletter */}
      <Newsletter />

      {/* Quick View Modal Overlay */}
      <QuickViewModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
}
