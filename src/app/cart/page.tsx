"use client";

import React, { useState } from "react";
import Link from "next/link";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import { useApp } from "@/context/AppContext";
import Button from "@/components/Button/Button";
import styles from "./cart.module.css";

const cartSkeletonStyle = {
  background: 'linear-gradient(90deg, #f1f1f1 25%, #e9e9e9 50%, #f1f1f1 75%)',
  backgroundSize: '200% 100%',
  animation: 'cart-shimmer 1.4s ease infinite',
  borderRadius: 6,
};

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, addToast } = useApp();
  const [couponInput, setCouponInput] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  // Subtotal calculation
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Shipping logic: free above ₹50
  const shippingThreshold = 50;
  const shippingCost = subtotal >= shippingThreshold || subtotal === 0 ? 0 : 5.0;

  // Coupon handling
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponInput.trim().toUpperCase();
    if (code === "COZY10") {
      setDiscountPercent(10);
      addToast("Discount code COZY10 (10% Off) applied successfully!", "success");
    } else if (code === "") {
      addToast("Please enter a valid coupon code.", "error");
    } else {
      addToast("Invalid discount code. Try using 'COZY10' for 10% off!", "error");
    }
  };

  const discountAmount = subtotal * (discountPercent / 100);
  const totalAmount = subtotal - discountAmount + shippingCost;

  // Cart item steppers
  const handleQtyChange = (
    id: string,
    color: string,
    size: string,
    newQty: number
  ) => {
    updateQuantity(id, color, size, newQty);
  };

  const isCartLoading = cart === null || cart === undefined;

  if (isCartLoading) {
    return (
      <div className={styles.container} style={{ paddingTop: 24, paddingBottom: 24 }}>
        <h1 className={styles.title} style={{ visibility: 'hidden' }}>Shopping Cart</h1>

        <div className={styles.layout}>
          <div className={styles.cartList} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[1, 2, 3].map((item) => (
              <div key={item} style={{ display: 'flex', gap: 16, padding: 16, border: '1px solid #e8e8e8', borderRadius: 12, background: '#fff' }}>
                <div style={{ width: 110, height: 110, ...cartSkeletonStyle }} />
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ width: '55%', height: 18, ...cartSkeletonStyle }} />
                  <div style={{ width: '40%', height: 14, ...cartSkeletonStyle }} />
                  <div style={{ width: '30%', height: 14, ...cartSkeletonStyle }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 12, minWidth: 100 }}>
                  <div style={{ width: 80, height: 18, ...cartSkeletonStyle }} />
                  <div style={{ width: 120, height: 38, ...cartSkeletonStyle }} />
                </div>
              </div>
            ))}
          </div>

          <div className={styles.summaryCard} style={{ minWidth: 300 }}>
            <div style={{ width: 150, height: 18, ...cartSkeletonStyle, marginBottom: 18 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ width: 100, height: 14, ...cartSkeletonStyle }} />
              <div style={{ width: 70, height: 14, ...cartSkeletonStyle }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
              <div style={{ width: 100, height: 14, ...cartSkeletonStyle }} />
              <div style={{ width: 70, height: 14, ...cartSkeletonStyle }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
              <div style={{ width: 100, height: 14, ...cartSkeletonStyle }} />
              <div style={{ width: 70, height: 14, ...cartSkeletonStyle }} />
            </div>
            <div style={{ height: 1, background: '#efefef', margin: '14px 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
              <div style={{ width: 80, height: 18, ...cartSkeletonStyle }} />
              <div style={{ width: 90, height: 18, ...cartSkeletonStyle }} />
            </div>
            <div style={{ width: '100%', height: 48, ...cartSkeletonStyle }} />
          </div>
        </div>

        <style jsx>{`
          @keyframes cart-shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyCart}>
          <span className={styles.emptyIcon}><Inventory2OutlinedIcon fontSize="large" /></span>
          <h1 className={styles.emptyTitle}>Your Cart is Empty</h1>
          <p className={styles.emptyText}>
            It looks like you haven't added any beautiful handmade crochet items to your cart yet. Let's find something cozy!
          </p>
          <Link href="/shop">
            <Button variant="primary">Explore Shop</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Shopping Cart</h1>

      <div className={styles.layout}>
        {/* Cart items list */}
        <div className={styles.cartList}>
          {cart.map((item, idx) => {
            const itemSubtotal = item.price * item.quantity;
            return (
              <div key={`${item.id}-${item.color}-${item.size}-${idx}`} className={styles.cartItem}>
                <img src={item.image} alt={item.name} className={styles.itemImage} />
                
                <div className={styles.itemInfo}>
                  <Link href={`/shop/${item.slug || item.id}`}>
                    <h3 className={styles.itemName}>{item.name}</h3>
                  </Link>
                  <span className={styles.itemMeta}>
                    Color: <strong>{item.color}</strong> &nbsp;|&nbsp; Size: <strong>{item.size}</strong>
                  </span>
                </div>

                <div className={styles.itemPrice}>
                  ₹{item.price.toFixed(2)}
                </div>

                {/* Stepper */}
                <div className={styles.quantityStepper}>
                  <button
                    onClick={() => handleQtyChange(item.id, item.color, item.size, item.quantity - 1)}
                    className={styles.stepperBtn}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className={styles.quantityVal}>{item.quantity}</span>
                  <button
                    onClick={() => handleQtyChange(item.id, item.color, item.size, item.quantity + 1)}
                    className={styles.stepperBtn}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <div className={styles.itemSubtotal}>
                  ₹{itemSubtotal.toFixed(2)}
                </div>

                <button
                  onClick={() => removeFromCart(item.id, item.color, item.size)}
                  className={styles.removeBtn}
                  aria-label="Remove item"
                  title="Remove item"
                >
                  <CloseIcon fontSize="small" />
                </button>
              </div>
            );
          })}

          {/* Coupon and Actions row */}
          <div className={styles.cartActions}>
            <form onSubmit={handleApplyCoupon} className={styles.couponForm}>
              <input
                type="text"
                placeholder="Coupon code (COZY10)"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                className={styles.couponInput}
              />
              <Button type="submit" variant="outline" size="sm">
                Apply
              </Button>
            </form>
            
            <Link href="/shop">
              <Button variant="text" size="sm">
                <ArrowBackOutlinedIcon fontSize="small" /> Continue Shopping
              </Button>
            </Link>
          </div>
        </div>

        {/* Cart summary side board */}
        <div className={styles.summaryCard}>
          <h2 className={styles.summaryTitle}>Order Summary</h2>
          
          <div className={styles.summaryRow}>
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>

          {discountAmount > 0 && (
            <div className={`${styles.summaryRow} styles.summaryRowDiscount`}>
              <span>Discount (10% Off)</span>
              <span>-₹{discountAmount.toFixed(2)}</span>
            </div>
          )}

          <div className={styles.summaryRow}>
            <span>Shipping</span>
            <span>{shippingCost === 0 ? "FREE" : `₹${shippingCost.toFixed(2)}`}</span>
          </div>

          <div className={styles.summaryRow} style={{ fontSize: "var(--text-xs)", opacity: 0.8 }}>
            <span>
              {shippingCost > 0 
                ? `Add ₹${(shippingThreshold - subtotal).toFixed(2)} more for FREE shipping!`
                : "Eligible for free standard shipping!"}
            </span>
          </div>

          <div className={styles.divider} />

          <div className={styles.totalRow}>
            <span>Total</span>
            <span>₹{totalAmount.toFixed(2)}</span>
          </div>

          <Link href="/checkout">
            <Button variant="primary" fullWidth className={styles.checkoutBtn}>
              Proceed to Checkout
            </Button>
          </Link>

          <div style={{ marginTop: "15px", textAlign: "center", fontSize: "0.8rem", opacity: 0.7 }}>
            <LockOutlinedIcon fontSize="small" /> Safe & Secure Checkout
          </div>
        </div>
      </div>
    </div>
  );
}
