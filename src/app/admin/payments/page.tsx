import React from 'react';
import PaymentsDashboard from '../components/PaymentsDashboard';
import styles from '../page.module.css';

export default function AdminPaymentsPage() {
  return (
    <div>
      <div className={styles.headerBlock}>
        <div className={styles.sectionLabel}>Payments</div>
        <h2 className={styles.sectionTitle}>Payments</h2>
      </div>
      <PaymentsDashboard />
    </div>
  );
}
