"use client";

import React, { useState } from 'react';
// Link removed; admin shell handles navigation
import AdminLoginPage from './login/page';
import AdminDashboard from './components/AdminDashboard';
import styles from './page.module.css';

export default function AdminOverviewPage() {
  const [hasSession] = useState<boolean>(() => {
    try {
      return typeof document !== 'undefined' && document.cookie.includes('ditvi_admin_session=');
    } catch {
      return false;
    }
  });

  // cards intentionally removed; AdminShell provides navigation UI

  if (hasSession === null) return <div className={styles.checking}>Checking admin session...</div>;
  if (!hasSession) return <AdminLoginPage />;

  return (
    <div>
      <div className={styles.headerBlock}>
        <div className={styles.sectionLabel}>Dashboard</div>
        <h2 className={styles.sectionTitle}>Overview</h2>
      </div>

      <AdminDashboard />
    </div>
  );
}
