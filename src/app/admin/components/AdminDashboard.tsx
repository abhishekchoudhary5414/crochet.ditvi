"use client";
import React, { useEffect, useState } from 'react';
import styles from './AdminDashboard.module.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState<{ orders: number; users: number; revenue: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/admin/stats', { credentials: 'same-origin' });
        if (res.status === 401 || res.status === 403) {
          window.location.href = '/admin/login';
          return;
        }
        const data = await res.json();
        if (!res.ok) {
          const msg = data?.error || 'Failed to load stats';
          console.error('load stats', msg);
          if (mounted) setError(String(msg));
          return;
        }
        if (mounted) setStats({ orders: data.orders ?? 0, users: data.users ?? 0, revenue: Number(data.revenue ?? 0) });
      } catch (e) {
        console.error('load stats', e);
        if (mounted) setError(String(e));
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div>
      <h2>Overview</h2>
      {error ? (
        <div className={styles.error}>{error}</div>
      ) : (
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th>Metric</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr className={styles.row}>
              <td className={styles.cell}>Orders</td>
              <td className={styles.cell}>{loading ? '…' : String(stats?.orders ?? 0)}</td>
            </tr>
            <tr className={styles.row}>
              <td className={styles.cell}>Users</td>
              <td className={styles.cell}>{loading ? '…' : String(stats?.users ?? 0)}</td>
            </tr>
            <tr className={styles.row}>
              <td className={styles.cell}>Payments</td>
              <td className={styles.cell}>{loading ? '…' : '--'}</td>
            </tr>
            <tr className={styles.row}>
              <td className={styles.cell}>Revenue</td>
              <td className={styles.cell}>{loading ? '…' : `₹${(stats?.revenue ?? 0).toFixed(2)}`}</td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
}

// Card helper removed; overview uses a table now.
