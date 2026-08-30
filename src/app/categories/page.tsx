import React from "react";
import { categories } from "@/data/categories";
import CategoryCard from "@/components/CategoryCard/CategoryCard";
import styles from "./categories.module.css";

export const metadata = {
  title: "Ditvi Crochet - Product Collections",
  description: "Browse our collections of premium handmade crochet tote bags, amigurumi toys, flowers, accessories, home decor, and custom requests.",
};

export default function CategoriesPage() {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Explore Our Collections</h1>
        <p className={styles.description}>
          Every single one of our crochet products is hand-stitched with love, patience, and premium materials. Browse our collections below to find the perfect gift or treat for yourself.
        </p>
      </header>

      <div className={styles.grid}>
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}
