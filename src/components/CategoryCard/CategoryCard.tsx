"use client";

import React from "react";
import Link from "next/link";
import { Category } from "@/data/categories";
import styles from "./CategoryCard.module.css";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/shop?category=${category.slug}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        <img
          src={category.image}
          alt={category.name}
          className={styles.image}
          loading="lazy"
        />
        {/* Semi-transparent tint overlay */}
        <div className={styles.overlay} />
        
        {/* Content Box */}
        <div className={styles.content}>
          <h3 className={styles.name}>{category.name}</h3>
          <p className={styles.description}>{category.description}</p>
          <span className={styles.exploreLink}>Explore Collection &rarr;</span>
        </div>
      </div>
    </Link>
  );
}
