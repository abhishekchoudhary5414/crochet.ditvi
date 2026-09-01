"use client";
import React, { useEffect, useState } from 'react';
import styles from './PaymentsDashboard.module.css';

type Payment = { id: string; order_id?: string; provider_payment_id?: string; amount?: number; status?: string; created_at?: string };

export default function PaymentsDashboard() {
  const [payments, setPayments] = useState<Payment[] | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/admin/payments', { credentials: 'same-origin' });
        if (res.status === 401 || res.status === 403) {
          window.location.href = '/admin/login';
          return;
        }
        const data = await res.json();
        if (!res.ok) {
          console.error('load payments', data?.error || 'failed');
          return;
        }
        if (mounted) setPayments(data.payments ?? []);
      } catch (e) {
        console.error('load payments', e);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div>
      <h2>Payments</h2>
      <p style={{ marginTop: 12 }}>Payment transactions and reconciliation.</p>
      <div style={{ marginTop: 12 }}>
        {payments === null ? (
          <div>Loading...</div>
        ) : payments.length === 0 ? (
          <div className={styles.empty}><em>No payments yet</em></div>
        ) : (
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th>Order</th>
                <th>Provider ID</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p.id} className={styles.row}>
                  <td className={styles.cell}>{p.order_id ?? '-'}</td>
                  <td className={styles.cell}>{p.provider_payment_id ?? '-'}</td>
                  <td className={styles.cell}>₹{Number(p.amount ?? 0).toFixed(2)}</td>
                  <td className={styles.cell}>{p.status ?? '-'}</td>
                  <td className={styles.cell}>{p.created_at ? new Date(p.created_at).toLocaleString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
