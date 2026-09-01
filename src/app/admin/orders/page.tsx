"use client";

import React from 'react';
import OrdersDashboard from '../components/OrdersDashboard';
import styles from '../orders.module.css';

export default function AdminOrdersPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}><h2 className={styles.title}>All Orders</h2></div>
      <div className={styles.card}>
        <OrdersDashboard />
      </div>
    </div>
  );
}
