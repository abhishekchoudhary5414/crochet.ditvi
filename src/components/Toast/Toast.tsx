"use client";

import React from "react";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import CloseIcon from "@mui/icons-material/Close";
import { useApp } from "@/context/AppContext";
import styles from "./Toast.module.css";

export default function ToastContainer() {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  const getIcon = (type: "success" | "info" | "error") => {
    switch (type) {
      case "success":
        return <CheckCircleOutlineOutlinedIcon fontSize="small" />;
      case "error":
        return <ErrorOutlineOutlinedIcon fontSize="small" />;
      default:
        return <InfoOutlinedIcon fontSize="small" />;
    }
  };

  return (
    <div className={styles.container}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${styles.toast} ${styles[toast.type]}`}
          onClick={() => removeToast(toast.id)}
        >
          <span className={styles.iconWrap}>{getIcon(toast.type)}</span>
          <span className={styles.message}>{toast.message}</span>
          <button className={styles.closeBtn} aria-label="Close notification">
            <CloseIcon fontSize="small" />
          </button>
        </div>
      ))}
    </div>
  );
}
