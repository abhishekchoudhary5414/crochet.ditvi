import React from "react";
import styles from "./faq.module.css";

export const metadata = {
  title: "FAQ - Ditvi Crochet",
  description: "Find answers about handmade crochet orders, shipping, custom requests, and WhatsApp support.",
};

const faqItems = [
  {
    question: "How long does a handmade order take?",
    answer:
      "Most crochet products are handcrafted in 3 to 12 business days depending on the design, complexity, and current order volume. We will confirm the timeline when we receive your order request.",
  },
  {
    question: "Do you offer custom crochet designs?",
    answer:
      "Yes. We love creating custom gifts, themed dolls, colors, and accessories. You can share your idea through our custom order form or via WhatsApp support.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes, we offer shipping across India and selected international destinations. Shipping timings and charges vary by location and order size.",
  },
  {
    question: "Can I order through WhatsApp?",
    answer:
      "Absolutely. You can message us directly on WhatsApp to place an order, ask for product availability, or check delivery details before purchasing.",
  },
  {
    question: "Are your products safe for kids and gifting?",
    answer:
      "Yes. We use quality yarns and test each piece for durability, softness, and safe finishing. Our products are designed to be durable, comforting, and gift-ready.",
  },
  {
    question: "What is your return or exchange policy?",
    answer:
      "We accept returns or exchanges for damaged or incorrect items, as long as they are reported within a reasonable time frame after delivery. Please contact us with your order number and a photo for review.",
  },
];

export default function FAQPage() {
  return (
    <main className={styles.container}>
      <div className={styles.wrapper}>
        <p className={styles.eyebrow}>Support</p>
        <h1 className={styles.title}>Frequently Asked Questions</h1>
        <p className={styles.lead}>Everything you need to know before placing your next cozy crochet order.</p>

        <div className={styles.list}>
          {faqItems.map((item) => (
            <article key={item.question} className={styles.item}>
              <h2>{item.question}</h2>
              <p>{item.answer}</p>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
