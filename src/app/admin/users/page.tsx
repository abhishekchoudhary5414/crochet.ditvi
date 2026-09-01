"use client";

import React from 'react';
import UsersDashboard from '../components/UsersDashboard';
import styles from '../users.module.css';

export default function AdminUsersPage() {
  return (
    <div>
      <div className={styles.headerBlock}>
        <div className={styles.sectionLabel}>Users</div>
        <h2 className={styles.sectionTitle}>Registered Users</h2>
      </div>
      <UsersDashboard />
    </div>
  );
}
