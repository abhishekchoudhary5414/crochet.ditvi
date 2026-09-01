"use client";

import React, { useEffect, useState } from 'react';
import supabase from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import styles from '@/app/account/profile/profile.module.css';

export default function AdminOrderDetail({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [order, setOrder] = useState<any | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [status, setStatus] = useState('');

  useEffect(() => {
    (async () => {
      const s = await supabase.auth.getSession();
      const token = s?.data?.session?.access_token;
      if (!token) {
        router.push('/login');
        return;
      }
      try {
        const res = await fetch(`/api/admin/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Failed');
        setOrder(data.order || data);
        setItems(data.items || data.order_items || []);
        setStatus((data.order && data.order.order_status) || data.order_status || 'pending');
      } catch (e) {
        console.error(e);
      }
    })();
  }, [id, router]);

  const updateStatus = async () => {
    try {
      const s = await supabase.auth.getSession();
      const token = s?.data?.session?.access_token;
      if (!token) return;
      const res = await fetch(`/api/admin/orders/${id}/status`, { method: 'PATCH', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ order_status: status }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed');
      alert('Status updated');
    } catch (e: any) {
      alert(e?.message || 'Update failed');
    }
  };

  if (!order) return <div className={styles.card}>Loading...</div>;

  return (
    <div className={styles.page}>
      <div className={styles.header}><h2 className={styles.title}>Order {order.order_number || order.id}</h2></div>
      <div className={styles.card}>
        <div style={{ marginBottom: 12 }}>
          <div><strong>Customer:</strong> {order.customer?.full_name || order.customer?.email || 'Guest'}</div>
          <div><strong>Amount:</strong> ₹{Number(order.total_amount).toFixed(2)}</div>
          <div><strong>Status:</strong> {order.order_status}</div>
        </div>

        <h4>Items</h4>
        {items.map((it) => (
          <div key={it.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #eee' }}>
            <div>{it.product_name}</div>
            <div>₹{Number(it.total_price).toFixed(2)}</div>
          </div>
        ))}

        <div style={{ marginTop: 12 }}>
          <label>Change Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ marginLeft: 8 }}>
            <option value="pending">pending</option>
            <option value="confirmed">confirmed</option>
            <option value="processing">processing</option>
            <option value="shipped">shipped</option>
            <option value="out_for_delivery">out_for_delivery</option>
            <option value="delivered">delivered</option>
            <option value="payment canceled">payment canceled</option>
            <option value="payment cancelled">payment cancelled</option>
            <option value="cancelled">cancelled</option>
          </select>
          <button onClick={updateStatus} style={{ marginLeft: 8 }} className={styles.button}>Update</button>
        </div>
      </div>
    </div>
  );
}
