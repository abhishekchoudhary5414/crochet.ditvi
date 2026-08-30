import React from "react";
import styles from "./ReviewCard.module.css";

export interface ReviewData {
  id: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
  productName?: string;
  avatar?: string;
}

interface ReviewCardProps {
  review: ReviewData;
}

export default function ReviewCard({ review }: ReviewCardProps) {
  // Render star ratings
  const stars = Array.from({ length: 5 }, (_, i) => (
    <span key={i} className={i < review.rating ? styles.starFilled : styles.starEmpty}>
      ★
    </span>
  ));

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        {/* Avatar Placeholder */}
        <div className={styles.avatar}>
          {review.avatar ? (
            <img src={review.avatar} alt={review.name} className={styles.avatarImg} />
          ) : (
            <span className={styles.avatarInitial}>{review.name.charAt(0)}</span>
          )}
        </div>
        
        {/* Name and Date */}
        <div className={styles.meta}>
          <h4 className={styles.name}>{review.name}</h4>
          <span className={styles.date}>
            {new Date(review.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      </div>

      {/* Star Row */}
      <div className={styles.starsRow}>{stars}</div>

      {/* Review Comment */}
      <p className={styles.comment}>&ldquo;{review.comment}&rdquo;</p>

      {/* Product Tag if provided */}
      {review.productName && (
        <div className={styles.productTag}>
          <span className={styles.tagIcon}>🛍️</span> Verified Purchase:{" "}
          <strong className={styles.tagText}>{review.productName}</strong>
        </div>
      )}
    </div>
  );
}
