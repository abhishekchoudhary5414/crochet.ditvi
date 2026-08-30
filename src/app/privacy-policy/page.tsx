import React from "react";
import styles from "./privacy-policy.module.css";

export const metadata = {
  title: "Privacy Policy - Ditvi Crochet",
  description: "How Ditvi Crochet handles personal information, orders, customer support, and WhatsApp communication.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className={styles.container}>
      <div className={styles.wrapper}>
        <p className={styles.eyebrow}>Legal</p>
        <h1 className={styles.title}>Privacy Policy</h1>
        <p className={styles.lead}>
          At Ditvi Crochet, we respect your privacy and value the trust you place in us. This policy explains how
          we collect, use, and protect your information when you visit our website, place an order, contact us, or
          join our WhatsApp updates.
        </p>

        <section className={styles.section}>
          <h2>1. Information We Collect</h2>
          <p>
            We may collect personal information when you contact us, subscribe for updates, or place an order. This may
            include your name, email address, phone number, shipping details, order preferences, and WhatsApp number if
            you share it with us.
          </p>
        </section>

        <section className={styles.section}>
          <h2>2. How We Use Your Information</h2>
          <p>
            We use your information to process orders, reply to customer queries, personalize support, improve our
            products and services, send order confirmations, and share important updates about special collections,
            custom orders, and occasional promotions.
          </p>
        </section>

        <section className={styles.section}>
          <h2>3. WhatsApp and Email Communication</h2>
          <p>
            If you choose to join our WhatsApp channel or provide your contact details, we may use that information to
            communicate with you about order updates, delivery status, and new product releases. You may opt out at any
            time by telling us you no longer want to receive updates.
          </p>
        </section>

        <section className={styles.section}>
          <h2>4. Security</h2>
          <p>
            We take reasonable steps to secure your information against unauthorized access, misuse, or disclosure. We
            store personal data only as needed for business or legal reasons and limit access to authorized team members.
          </p>
        </section>

        <section className={styles.section}>
          <h2>5. Third-Party Services</h2>
          <p>
            We may use trusted third-party services such as WhatsApp, email tools, or payment gateways to help us operate
            our store. These services are bound by their own privacy practices, and we only share information necessary
            for processing and communication.
          </p>
        </section>

        <section className={styles.section}>
          <h2>6. Your Rights</h2>
          <p>
            You can request to review, correct, or delete the personal information we have about you, and you can ask us
            to stop sending promotional communications at any time.
          </p>
        </section>

        <section className={styles.section}>
          <h2>7. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy or how we handle your information, please reach out via
            our contact page or WhatsApp support.
          </p>
        </section>
      </div>
    </main>
  );
}
