import React from "react";
import Link from "next/link";
import HandymanOutlinedIcon from "@mui/icons-material/HandymanOutlined";
import ForestIcon from "@mui/icons-material/Forest";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import Button from "@/components/Button/Button";
import styles from "./about.module.css";

export const metadata = {
  title: "Ditvi Crochet - Our Handmade Story",
  description: "Learn about the warmth, creativity, and craftsmanship behind Ditvi Crochet. Discover our mission, quality materials, and custom-order processes.",
};

export default function AboutPage() {
  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>Our Cozy Story</h1>
        <p className={styles.subtitle}>&ldquo;Made by Hand. Made With Heart.&rdquo;</p>
      </header>

      {/* Split Story Section */}
      <section className={styles.storyGrid}>
        <div className={styles.imageWrapper}>
          <img
            src="/products/flower/sunflower.png"
            alt="Beautiful pastel crochet work"
            className={styles.image}
          />
        </div>
        <div className={styles.storyContent}>
          <h2 className={styles.storyTitle}>Little Stitches, Big Love</h2>
          <p className={styles.storyText}>
            Welcome to **Ditvi Crochet**! We are a boutique handmade crochet brand dedicated to creating cozy, premium, and beautiful items that bring color, comfort, and craftsmanship into your life.
          </p>
          <p className={styles.storyText}>
            Our journey began in a tiny studio, driven by a simple realization: in a fast-paced, mass-produced world, there is a rare, emotional magic in products made slowly, stitch-by-stitch, by human hands. Every piece we weave carries ours hours of patience, creative energy, and care.
          </p>
          <p className={styles.storyText}>
            We specialize in crafting stylish tote bags, amigurumi dolls, everlasting floral bouquets, cozy home accents, and accessories. We choose only high-grade materials (milk cotton yarns, organic bamboo-cotton blends, eco-friendly wooden buttons) that are soft, durable, and hypoallergenic.
          </p>
          <p className={styles.storyText}>
            Whether you are picking an anniversary gift, decorating a nursery room, or adding a vintage bohemian flair to your daily outfits, we want you to feel the love and warmth embedded in every loop.
          </p>
        </div>
      </section>

      {/* Core Values Section */}
      <section className={styles.valuesSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Our Craft Philosophies</h2>
        </div>
        <div className={styles.valuesGrid}>
          <div className={styles.valueCard}>
            <span className={styles.valueIcon}><HandymanOutlinedIcon fontSize="small" /></span>
            <h3 className={styles.valueTitle}>Handmade Integrity</h3>
            <p className={styles.valueDesc}>
              No automated machines or factory line shortcuts. Every single knot is hand-woven, ensuring that no two items are exactly identical—each piece is uniquely yours.
            </p>
          </div>
          <div className={styles.valueCard}>
            <span className={styles.valueIcon}><ForestIcon fontSize="small" /></span>
            <h3 className={styles.valueTitle}>Premium & Safe Materials</h3>
            <p className={styles.valueDesc}>
              We source safe, premium milk cotton and organic yarns. Perfect for delicate baby skins, hypoallergenic toys, and durable daily wear.
            </p>
          </div>
          <div className={styles.valueCard}>
            <span className={styles.valueIcon}><PaletteOutlinedIcon fontSize="small" /></span>
            <h3 className={styles.valueTitle}>Creative Personalization</h3>
            <p className={styles.valueDesc}>
              We love bringing your dream designs to life! Our custom orders section lets you share color preferences, sizes, and references for bespoke requests.
            </p>
          </div>
        </div>
      </section>

      {/* Process Workflow Section */}
      <section className={styles.processSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>How We Crochet Your Order</h2>
        </div>
        <div className={styles.processGrid}>
          <div className={styles.processStep}>
            <div className={styles.stepNum}>1</div>
            <h3 className={styles.stepTitle}>Design Draft</h3>
            <p className={styles.stepDesc}>We select pattern scales, yarn weights, and map out dimensions to match the requested form.</p>
          </div>
          <div className={styles.processStep}>
            <div className={styles.stepNum}>2</div>
            <h3 className={styles.stepTitle}>Hand Weaving</h3>
            <p className={styles.stepDesc}>Our master makers carefully stitch loop-by-loop. This process takes 3-12 hours of focused work.</p>
          </div>
          <div className={styles.processStep}>
            <div className={styles.stepNum}>3</div>
            <h3 className={styles.stepTitle}>Quality Review</h3>
            <p className={styles.stepDesc}>We inspect seams, tension uniformities, safety eyes, fabric linings, and button closures.</p>
          </div>
          <div className={styles.processStep}>
            <div className={styles.stepNum}>4</div>
            <h3 className={styles.stepTitle}>Cozy Packaging</h3>
            <p className={styles.stepDesc}>Wrapped in kraft wrap with wood wool, tied with a ribbon, and shipped with a hand-written note.</p>
          </div>
        </div>
      </section>

    
    </div>
  );
}
