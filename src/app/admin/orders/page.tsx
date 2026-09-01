"use client";

import React, { useEffect, useState } from 'react';
import supabase from '@/lib/supabaseClient';
import Link from 'next/link';
import styles from '@/app/account/profile/profile.module.css';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);

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
          <div>No orders yet.</div>
        ) : (
          orders.map((o) => (
            <div key={o.id} style={{ borderBottom: '1px solid #eee', padding: 12, display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <strong>{o.order_number}</strong>
                <div style={{ fontSize: '0.9rem', color: '#666' }}>{o.customer?.full_name || o.customer?.email || 'Guest'}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div>₹{Number(o.total_amount).toFixed(2)}</div>
                <div style={{ marginTop: 6 }}><Link href={`/admin/orders/${o.id}`}>View</Link></div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
