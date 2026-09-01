"use client";

import React, { use, useEffect, useState } from 'react';
import supabase from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import styles from '../../../profile/profile.module.css';

export default function ReceiptPage({ params }: { params?: any }) {
  const resolvedParams = typeof params === 'object' && params !== null && 'then' in params
    ? use(params as Promise<{ id: string }>)
    : (params ?? { id: '' });
  const { id } = (resolvedParams as any) as { id: string };
  const router = useRouter();
  const [order, setOrder] = useState<any | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const s = await supabase.auth.getSession();
        const token = s?.data?.session?.access_token;
        if (!token) {
          router.push('/login');
          return;
        }
        const res = await fetch(`/api/account/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || 'Failed to load receipt');
        setOrder(data.order);
        setItems(data.items || []);
      } catch (err: any) {
        console.error(err);
        alert(err?.message || 'Could not load receipt');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, router]);

  if (loading) return <div className={styles.card}>Loading receipt...</div>;
  if (!order) return <div className={styles.card}>Receipt not available.</div>;

  const handlePrint = () => window.print();

  return (
    <div className={styles.page}>
      <div className={styles.card} style={{ maxWidth: 900, margin: '20px auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            <h3>Ditvi Crochet</h3>
            <div>support@ditvicrochet.example</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div><strong>Receipt:</strong> {order.receipt_number || order.order_number}</div>
            <div>{new Date(order.created_at).toLocaleString()}</div>
          </div>
        </div>

        <h4>Customer</h4>
        <div style={{ marginBottom: 12 }}>{order.metadata?.shipping_address ? JSON.stringify(order.metadata.shipping_address, null, 2) : '—'}</div>

        <h4>Items</h4>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd' }}>Item</th>
              <th style={{ textAlign: 'right', borderBottom: '1px solid #ddd' }}>Qty</th>
              <th style={{ textAlign: 'right', borderBottom: '1px solid #ddd' }}>Price</th>
            </tr>
          </thead>
          <tbody>
            {items.map((it) => (
              <tr key={it.id}>
                <td style={{ padding: '8px 0' }}>{it.product_name}</td>
                <td style={{ textAlign: 'right' }}>{it.quantity}</td>
                <td style={{ textAlign: 'right' }}>₹{Number(it.total_price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
          <div style={{ textAlign: 'right' }}>
            <div>Subtotal: ₹{Number(order.subtotal).toFixed(2)}</div>
            <div>Discount: -₹{Number(order.discount || 0).toFixed(2)}</div>
            <div>Shipping: ₹{Number(order.shipping_fee || 0).toFixed(2)}</div>
            <div style={{ fontWeight: 700, marginTop: 6 }}>Total: ₹{Number(order.total_amount).toFixed(2)}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
          <button className={styles.button} onClick={handlePrint}>Print / Download</button>
          <button className={styles.buttonOutline} onClick={() => router.back()}>Back</button>
        </div>
      </div>
    </div>
  );
}
