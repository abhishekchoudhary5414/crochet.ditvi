"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './OrdersDashboard.module.css';

type Order = { id: string; order_number?: string; total_amount?: number; order_status?: string; payment_status?: string; created_at?: string };

export default function OrdersDashboard() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [paymentsMap, setPaymentsMap] = useState<Map<string, string>>(new Map());
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/admin/orders', { credentials: 'same-origin' });
        if (res.status === 401 || res.status === 403) {
          router.push('/admin/login');
          return;
        }
        const data = await res.json();
        if (!res.ok) {
          console.error('load orders', data?.error || 'failed');
          return;
        }
        if (mounted) setOrders(data.orders ?? []);
      } catch (e) {
        console.error('load orders', e);
      }
    })();
    return () => { mounted = false; };
  }, [router]);

  // Fetch payments once to reconcile payment status if orders lack it
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/admin/payments', { credentials: 'same-origin' });
        if (!res.ok) return;
        const data = await res.json();
        if (!mounted) return;
        const map = new Map<string, string>();
        (data.payments || []).forEach((p: any) => {
          if (p.order_id) map.set(String(p.order_id), p.status || '');
        });
        if (mounted) setPaymentsMap(map);
      } catch (e) {
        console.error('load payments for reconciliation', e);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div>
      <h2>Orders</h2>
      <div className={styles.spaced}>
        {orders === null ? (
          <div>Loading...</div>
        ) : orders.length === 0 ? (
          <div className={styles.empty}><em>No orders yet</em></div>
        ) : (
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th>Order</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Total</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className={styles.row}>
                  <td className={styles.cell}>{o.order_number ?? o.id}</td>
                  <td className={styles.cell}>{o.order_status}</td>
                  <td className={styles.cell}>{paymentsMap.get(o.id) ?? o.payment_status ?? 'unpaid'}</td>
                  <td className={styles.cell}>₹{Number(o.total_amount ?? 0).toFixed(2)}</td>
                  <td className={styles.cell}>{o.created_at ? new Date(o.created_at).toLocaleString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
