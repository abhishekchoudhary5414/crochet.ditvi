import React from "react";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
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
    i < review.rating ? (
      <StarIcon key={i} className={styles.starFilled} fontSize="small" />
    ) : (
      <StarBorderIcon key={i} className={styles.starEmpty} fontSize="small" />
    )
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
          <ShoppingBagOutlinedIcon className={styles.tagIcon} fontSize="small" /> Verified Purchase:{" "}
          <strong className={styles.tagText}>{review.productName}</strong>
        </div>
      )}
    </div>
  );
}
