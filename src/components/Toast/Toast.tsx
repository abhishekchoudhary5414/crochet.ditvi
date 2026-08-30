"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import styles from "./Toast.module.css";

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className={styles.container}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${styles.toast} ${styles[toast.type]}`}
          onClick={() => removeToast(toast.id)}
        >
          <span className={styles.message}>{toast.message}</span>
          <button className={styles.closeBtn} aria-label="Close notification">
            &times;
          </button>
        </div>
      ))}
    </div>
  );
}
