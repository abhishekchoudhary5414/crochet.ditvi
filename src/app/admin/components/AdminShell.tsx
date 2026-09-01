"use client";
import React, { useState } from 'react';
import AdminDashboard from './AdminDashboard';
import OrdersDashboard from './OrdersDashboard';
import UsersDashboard from './UsersDashboard';
import PaymentsDashboard from './PaymentsDashboard';
import styles from './AdminShell.module.css';

export default function AdminShell() {
  const [view, setView] = useState<'overview' | 'orders' | 'users' | 'payments'>('overview');
  const [navOpen, setNavOpen] = useState<boolean>(true);

  return (
    <div className={styles.container}>
      {/* Side navbar */}
      <aside className={navOpen ? styles.aside : `${styles.aside} ${styles.asideClosed}`}>
        <div className={styles.navHeader}>
          <div className={styles.brand}>Admin</div>
          <button aria-label="Close menu" onClick={() => setNavOpen(false)} className={styles.closeButton}>✕</button>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button onClick={() => setView('overview')} className={`${styles.navButton} ${view === 'overview' ? styles.navButtonActive : ''}`}>Overview</button>
          <button onClick={() => setView('orders')} className={`${styles.navButton} ${view === 'orders' ? styles.navButtonActive : ''}`}>Orders</button>
          <button onClick={() => setView('users')} className={`${styles.navButton} ${view === 'users' ? styles.navButtonActive : ''}`}>Users</button>
          <button onClick={() => setView('payments')} className={`${styles.navButton} ${view === 'payments' ? styles.navButtonActive : ''}`}>Payments</button>
        </nav>
      </aside>

      {/* Main area */}
      <div className={styles.mainArea}>
        <div className={styles.topBar}>
          {!navOpen && (
            <button aria-label="Open menu" onClick={() => setNavOpen(true)} className={styles.toggleButton}>☰</button>
          )}
          <div style={{ flex: 1 }} />
        </div>

        <main className={styles.mainContent}>
          {view === 'overview' && <AdminDashboard />}
          {view === 'orders' && <OrdersDashboard />}
          {view === 'users' && <UsersDashboard />}
          {view === 'payments' && <PaymentsDashboard />}
        </main>
      </div>
    </div>
  );
}

// navButtonStyle removed; styling handled in AdminShell.module.css
