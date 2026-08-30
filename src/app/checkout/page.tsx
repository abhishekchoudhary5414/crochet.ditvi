"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import Button from "@/components/Button/Button";
import styles from "./checkout.module.css";

export default function CheckoutPage() {
  const { cart, clearCart, addToast } = useApp();
  const router = useRouter();

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pin: "",
  });

  const [paymentMethod, setPaymentMethod] = useState<"card" | "upi" | "cod">("card");
  
  // Card details states
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
  });

  // Coupon states (duplicated from cart page to maintain consistency)
  const [couponCode, setCouponCode] = useState("");
  const [discountPercent, setDiscountPercent] = useState(0);

  // Success state
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [orderSummary, setOrderSummary] = useState({
    name: "",
    email: "",
    total: 0,
  });

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = subtotal >= 50 || subtotal === 0 ? 0 : 5.0;
  
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase().trim() === "COZY10") {
      setDiscountPercent(10);
      addToast("Discount code COZY10 (10% Off) applied! 💖", "success");
    } else {
      addToast("Invalid code. Use 'COZY10' for 10% off.", "error");
    }
  };

  const discountAmount = subtotal * (discountPercent / 100);
  const totalAmount = subtotal - discountAmount + shippingCost;

  // Handle Form Inputs
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardDetails((prev) => ({ ...prev, [name]: value }));
  };

  // Submit Form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Additional payment validations
    if (paymentMethod === "card") {
      if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv) {
        addToast("Please fill in all credit card details.", "error");
        return;
      }
    }

    // Success simulation
    const generatedId = `DC-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(generatedId);
    setOrderSummary({
      name: formData.name,
      email: formData.email,
      total: totalAmount,
    });
    setIsSuccess(true);
    addToast("Order placed successfully! Thank you! 🌸", "success");
    
    // Clear shopping cart state
    clearCart();
  };

  const handleSuccessClose = () => {
    setIsSuccess(false);
    router.push("/");
  };

  // Redirect if cart is empty and not checked out
  if (cart.length === 0 && !isSuccess) {
    return (
      <div className={styles.container} style={{ textAlign: "center", padding: "80px 0" }}>
        <span style={{ fontSize: "4rem" }}>🛒</span>
        <h1 className={styles.title} style={{ marginTop: "20px" }}>Your Cart is Empty</h1>
        <p style={{ marginBottom: "30px", opacity: 0.8 }}>
          You cannot checkout without items. Please add some cozy crochet products to your cart.
        </p>
        <Link href="/shop">
          <Button variant="primary">Visit Shop</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Secure Checkout</h1>

      <div className={styles.layout}>
        {/* Left Column: Forms */}
        <form onSubmit={handleSubmit} className={styles.checkoutForm}>
          {/* Shipping section */}
          <div className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Shipping & Contact</h2>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label htmlFor="chk-name" className={styles.label}>Full Name *</label>
                <input
                  type="text"
                  id="chk-name"
                  name="name"
                  required
                  placeholder="e.g. Emily Watson"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="chk-email" className={styles.label}>Email Address *</label>
                <input
                  type="email"
                  id="chk-email"
                  name="email"
                  required
                  placeholder="e.g. emily@gmail.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>

              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label htmlFor="chk-phone" className={styles.label}>Phone Number *</label>
                <input
                  type="tel"
                  id="chk-phone"
                  name="phone"
                  required
                  placeholder="e.g. +91 98765 43210"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>

              <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                <label htmlFor="chk-address" className={styles.label}>Street Address *</label>
                <input
                  type="text"
                  id="chk-address"
                  name="address"
                  required
                  placeholder="Apartment, suite, unit, street name"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="chk-city" className={styles.label}>City *</label>
                <input
                  type="text"
                  id="chk-city"
                  name="city"
                  required
                  placeholder="City"
                  value={formData.city}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="chk-state" className={styles.label}>State *</label>
                <input
                  type="text"
                  id="chk-state"
                  name="state"
                  required
                  placeholder="State"
                  value={formData.state}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="chk-pin" className={styles.label}>PIN / Postal Code *</label>
                <input
                  type="text"
                  id="chk-pin"
                  name="pin"
                  required
                  placeholder="e.g. 110001"
                  value={formData.pin}
                  onChange={handleInputChange}
                  className={styles.input}
                />
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className={styles.section} style={{ marginTop: "30px" }}>
            <h2 className={styles.sectionTitle}>2. Payment Method</h2>
            <div className={styles.paymentSelector}>
              <div className={styles.paymentTabs}>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`${styles.paymentTab} ${
                    paymentMethod === "card" ? styles.activePaymentTab : ""
                  }`}
                >
                  💳 Credit/Debit Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("upi")}
                  className={`${styles.paymentTab} ${
                    paymentMethod === "upi" ? styles.activePaymentTab : ""
                  }`}
                >
                  📱 UPI / Scan QR
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("cod")}
                  className={`${styles.paymentTab} ${
                    paymentMethod === "cod" ? styles.activePaymentTab : ""
                  }`}
                >
                  💬 Cash on Delivery
                </button>
              </div>

              {/* Payment content */}
              <div className={styles.paymentDetails}>
                {paymentMethod === "card" && (
                  <div className={styles.cardGrid}>
                    <div className={styles.formGroup} style={{ gridColumn: "1 / span 3" }}>
                      <label className={styles.label}>Card Number</label>
                      <input
                        type="text"
                        name="number"
                        placeholder="1234 5678 9101 1121"
                        value={cardDetails.number}
                        onChange={handleCardChange}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.formGroup} style={{ gridColumn: "1 / span 2" }}>
                      <label className={styles.label}>Expiration Date</label>
                      <input
                        type="text"
                        name="expiry"
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={handleCardChange}
                        className={styles.input}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.label}>CVV</label>
                      <input
                        type="password"
                        name="cvv"
                        maxLength={3}
                        placeholder="123"
                        value={cardDetails.cvv}
                        onChange={handleCardChange}
                        className={styles.input}
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === "upi" && (
                  <div className={styles.upiDetails}>
                    <p style={{ fontSize: "var(--text-sm)" }}>Scan the QR code using any UPI app (GPay, PhonePe, Paytm)</p>
                    <div className={styles.qrCode}>
                      {/* Simple mock QR pattern */}
                      <div style={{ width: "100%", height: "100%", border: "2px solid var(--dark-text)", background: "repeating-conic-gradient(#4a3a40 0% 25%, #fff9fb 0% 50%) 50% / 20px 20px" }} />
                    </div>
                    <span style={{ fontSize: "var(--text-xs)", opacity: 0.8 }}>Ditvi Crochet Merchant ID: ditvicrochet@okaxis</span>
                  </div>
                )}

                {paymentMethod === "cod" && (
                  <div className={styles.codDetails}>
                    <p><strong>Cash on Delivery & WhatsApp Support</strong></p>
                    <p style={{ marginTop: "5px", opacity: 0.85 }}>
                      We will review your order details and reach out on WhatsApp/Email. You can pay securely in cash when the delivery agent brings your hand-stitched treasure!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Button type="submit" variant="primary" fullWidth size="lg" style={{ marginTop: "30px" }}>
            Place Order (${totalAmount.toFixed(2)})
          </Button>
        </form>

        {/* Right Column: Summaries */}
        <aside className={styles.summaryCol}>
          <div className={styles.summaryCard}>
            <h2 className={styles.sectionTitle}>Order Summary</h2>
            
            {/* Items list */}
            <div className={styles.itemsList}>
              {cart.map((item, idx) => (
                <div key={`${item.id}-${idx}`} className={styles.summaryItem}>
                  <img src={item.image} alt={item.name} className={styles.itemThumb} />
                  <div className={styles.itemDetails}>
                    <span className={styles.itemName}>{item.name}</span>
                    <span className={styles.itemMeta}>
                      Color: {item.color} | Qty: {item.quantity}
                    </span>
                  </div>
                  <span className={styles.itemPrice}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Quick coupon check */}
            {discountPercent === 0 && (
              <form onSubmit={handleApplyCoupon} style={{ display: "flex", gap: "10px", margin: "15px 0" }}>
                <input
                  type="text"
                  placeholder="Discount Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className={styles.input}
                  style={{ flex: 1, padding: "8px 10px" }}
                />
                <Button type="submit" variant="outline" size="sm">Apply</Button>
              </form>
            )}

            <div className={styles.summaryDivider} />

            {/* Calculations */}
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>

            {discountPercent > 0 && (
              <div className={styles.summaryRow} style={{ color: "var(--accent)", fontWeight: 500 }}>
                <span>Discount (10%)</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}

            <div className={styles.summaryRow}>
              <span>Shipping</span>
              <span>{shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}</span>
            </div>

            <div className={styles.summaryDivider} />

            <div className={styles.totalRow}>
              <span>Total Amount</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </aside>
      </div>

      {/* Success Modal */}
      {isSuccess && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <span className={styles.successIcon}>🌸</span>
            <h2 className={styles.successTitle}>Order Confirmed!</h2>
            <p className={styles.successText}>
              Thank you so much, <strong>{orderSummary.name}</strong>, for shopping with us! <br />
              We have received your payment method and catalog details. Since our products are completely handmade, your stitches will be cast with care.
            </p>
            <div>
              <span className={styles.orderNumber}>Order ID: {orderId}</span>
            </div>
            <p className={styles.successText} style={{ fontSize: "var(--text-xs)", opacity: 0.8 }}>
              We sent a validation receipt to <strong>{orderSummary.email}</strong>. We will message you on WhatsApp with dispatch details.
            </p>
            <Button variant="primary" onClick={handleSuccessClose} fullWidth>
              Return to Homepage
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
