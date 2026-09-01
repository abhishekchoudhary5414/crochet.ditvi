"use client";

import React, { useEffect, useState } from 'react';
import supabase from '@/lib/supabaseClient';
import Link from 'next/link';
import styles from '../orders.module.css';

type Order = { id: string; order_number?: string; total_amount?: number; customer?: { full_name?: string; email?: string } };

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    (async () => {
      const s = await supabase.auth.getSession();
      const token = s?.data?.session?.access_token;
      if (!token) return;
      try {
        const res = await fetch('/api/admin/orders', { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (res.ok) setOrders(data.orders || []);
      } catch (e) {
        console.error(e);
      }
    })();
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.header}><h2 className={styles.title}>All Orders</h2></div>
      <div className={styles.card}>
        {orders.length === 0 ? (
          <div className={styles.empty}>No orders yet.</div>
        ) : (
          orders.map((o) => (
            <div key={o.id} className={styles.orderRow}>
              <div className={styles.orderLeft}>
                <strong>{o.order_number}</strong>
                <div className={styles.smallText}>{o.customer?.full_name || o.customer?.email || 'Guest'}</div>
              </div>
              <div className={styles.orderRight}>
                <div>₹{Number(o.total_amount).toFixed(2)}</div>
                <div className={styles.viewLink}><Link href={`/admin/orders/${o.id}`}>View</Link></div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
