"use client";

import React, { useState } from "react";
import PhotoOutlinedIcon from "@mui/icons-material/PhotoOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import Button from "@/components/Button/Button";
import { useApp } from "@/context/AppContext";
import styles from "./custom.module.css";

export default function CustomOrdersPage() {
  const { addToast } = useApp();
  const [formData, setFormData] = useState({
    productType: "Crochet Bags",
    colors: "",
    size: "",
    requirements: "",
    quantity: 1,
    name: "",
    email: "",
    phone: "",
  });

  const [fileName, setFileName] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFileName(files[0].name);
      addToast(`Selected file: ${files[0].name}`, "info");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate API submission
    setIsSuccess(true);
    addToast("Custom request submitted! We will reach out on WhatsApp/Email.", "success");
  };

  const handleReset = () => {
    setFormData({
      productType: "Crochet Bags",
      colors: "",
      size: "",
      requirements: "",
      quantity: 1,
      name: "",
      email: "",
      phone: "",
    });
    setFileName("");
    setIsSuccess(false);
  };

  if (isSuccess) {
    return (
      <div className={styles.container}>
        <div className={styles.successCard}>
          <span className={styles.successIcon}><CheckCircleOutlineOutlinedIcon fontSize="large" /></span>
          <h2 className={styles.successTitle}>Request Submitted!</h2>
          <p className={styles.successText}>
            Thank you, <strong>{formData.name}</strong>, for sharing your creative dream with us! <br />
            We have received your custom <strong>{formData.productType}</strong> request requirements.
          </p>
          <p className={styles.successText} style={{ opacity: 0.8 }}>
            Since our designs are custom knit, our lead designer will analyze your specifications and message you on WhatsApp (<strong>{formData.phone}</strong>) or Email (<strong>{formData.email}</strong>) within 24 hours with design drafts, color options, and a price estimate.
          </p>
          <Button variant="primary" onClick={handleReset}>
            Submit Another Request
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <h1 className={styles.title}>Custom Crochet Designs</h1>
        <p className={styles.subtitle}>&ldquo;Have something special in mind? Let’s crochet it together.&rdquo;</p>
        <p className={styles.desc}>
          Whether it is a personalized birthday plushie, a custom-size crossbody sling bag, matching cup coasters for your dining table, or specific wedding tulips, share your ideas and we will craft it loop-by-loop.
        </p>
      </header>

      {/* Grid Layout */}
      <div className={styles.layout}>
        {/* Left column: Form */}
        <form onSubmit={handleSubmit} className={styles.formCard}>
          <h2 className={styles.formTitle}>Request Form</h2>
          
          <div className={styles.formGrid}>
            {/* Product Category dropdown */}
            <div className={styles.formGroup}>
              <label htmlFor="cst-type" className={styles.label}>Product Type *</label>
              <select
                id="cst-type"
                name="productType"
                required
                value={formData.productType}
                onChange={handleInputChange}
                className={styles.select}
              >
                <option value="Crochet Bags">Crochet Bags</option>
                <option value="Crochet Flowers">Crochet Flowers</option>
                <option value="Crochet Keychains">Crochet Keychains</option>
                <option value="Crochet Dolls">Crochet Dolls</option>
                <option value="Crochet Accessories">Crochet Accessories</option>
                <option value="Crochet Home Decor">Crochet Home Decor</option>
                <option value="Crochet Gifts">Crochet Gifts</option>
                <option value="Other Custom Design">Other Custom Design</option>
              </select>
            </div>

            {/* Quantity */}
            <div className={styles.formGroup}>
              <label htmlFor="cst-qty" className={styles.label}>Quantity *</label>
              <input
                type="number"
                id="cst-qty"
                name="quantity"
                required
                min={1}
                max={50}
                value={formData.quantity}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>

            {/* Colors */}
            <div className={styles.formGroup}>
              <label htmlFor="cst-colors" className={styles.label}>Preferred Colors *</label>
              <input
                type="text"
                id="cst-colors"
                name="colors"
                required
                placeholder="e.g. Sage green and beige"
                value={formData.colors}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>

            {/* Size */}
            <div className={styles.formGroup}>
              <label htmlFor="cst-size" className={styles.label}>Size / Dimensions</label>
              <input
                type="text"
                id="cst-size"
                name="size"
                placeholder="e.g. 10x12 inches or standard"
                value={formData.size}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>

            {/* Requirements textarea */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label htmlFor="cst-reqs" className={styles.label}>Design Details & Requirements *</label>
              <textarea
                id="cst-reqs"
                name="requirements"
                required
                rows={5}
                placeholder="Describe your dream crochet creation! Add details about shapes, patterns, Removable dress style, flower stems, closures, straps, linings, etc..."
                value={formData.requirements}
                onChange={handleInputChange}
                className={styles.textarea}
              />
            </div>

            {/* File Upload mock */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label className={styles.label}>Reference Image (Sketch, Drawing or Photo)</label>
              <div className={styles.fileUploadContainer} onClick={() => document.getElementById("file-loader")?.click()}>
                <span className={styles.uploadIcon}><PhotoOutlinedIcon fontSize="small" /></span>
                <span className={styles.uploadLabel}>Click to upload reference file</span>
                <span className={styles.uploadSub}>Supports PNG, JPG, PDF (max 5MB)</span>
                {fileName && <span className={styles.fileName}>Selected: {fileName}</span>}
              </div>
              <input
                type="file"
                id="file-loader"
                accept="image/*,.pdf"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>

            {/* Customer info */}
            <div className={`${styles.formGroup} ${styles.fullWidth}`} style={{ marginTop: "15px" }}>
              <span className={styles.label} style={{ fontSize: "var(--text-md)", borderBottom: "1px solid var(--border-color)", paddingBottom: "4px" }}>
                Contact Information
              </span>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="cst-name" className={styles.label}>Your Name *</label>
              <input
                type="text"
                id="cst-name"
                name="name"
                required
                placeholder="Name"
                value={formData.name}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="cst-email" className={styles.label}>Email Address *</label>
              <input
                type="email"
                id="cst-email"
                name="email"
                required
                placeholder="email@example.com"
                value={formData.email}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>

            <div className={`${styles.formGroup} ${styles.fullWidth}`}>
              <label htmlFor="cst-phone" className={styles.label}>WhatsApp / Phone Number *</label>
              <input
                type="tel"
                id="cst-phone"
                name="phone"
                required
                placeholder="Phone (preferably WhatsApp for quick drafts)"
                value={formData.phone}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>
          </div>

          <Button type="submit" variant="primary" fullWidth size="lg" style={{ marginTop: "25px" }}>
            Submit Design Request
          </Button>
        </form>

        {/* Right column: Info details */}
        <aside className={styles.infoCol}>
          <div className={styles.infoCard}>
            <h3 className={styles.infoCardTitle}>Custom Order Guidelines</h3>
            <p className={styles.infoCardText}>
              We want to make the custom creation process as easy and transparent as possible. Here is what to expect after submission:
            </p>
            <ul className={styles.bullets}>
              <li><strong>Free Price Quote:</strong> We review the requirements and calculate yarn volume + hours of craftsmanship to give you a transparent price estimate.</li>
              <li><strong>WhatsApp Draft Review:</strong> We will send photos of yarn color options and early shape layouts to align on the details before completing the product.</li>
              <li><strong>Lead Time:</strong> Hand-crocheting custom orders takes approximately 5-7 business days of work before shipping. We will notify you of any schedule changes.</li>
              <li><strong>Gift Wrapping:</strong> All custom orders arrive pre-wrapped in premium boutique tissue and a ribbon at no extra charge.</li>
            </ul>
          </div>

          <div className={styles.galleryPreview}>
            <img
              src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=500&q=80"
              alt="Custom amigurumi thread selection"
              className={styles.previewImg}
            />
            <img
              src="https://images.unsplash.com/photo-1517594422361-5eeb8ae275a9?auto=format&fit=crop&w=500&q=80"
              alt="Crochet needle close-up"
              className={styles.previewImg}
            />
          </div>
        </aside>
      </div>
    </div>
  );
}
