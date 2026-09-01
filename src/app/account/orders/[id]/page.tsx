"use client";

import React, { use, useEffect, useState } from 'react';
import supabase from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/Button/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function OrderDetailPage({ params }: { params?: any }) {
  const resolvedParams = typeof params === 'object' && params !== null && 'then' in params
    ? use(params as Promise<{ id: string }>)
    : (params ?? { id: '' });
  const { id } = (resolvedParams as any) as { id: string };
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [items, setItems] = useState<any[]>([]);

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
        if (!res.ok) throw new Error(data?.error || 'Failed to load order');
        setOrder(data.order);
        setItems(data.items || []);
      } catch (err: any) {
        console.error('load order', err);
        alert(err?.message || 'Could not load order');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, router]);

  if (loading) return <div style={{ padding: 24 }}>Loading order details...</div>;
  if (!order) return <div style={{ padding: 24 }}>Order not found.</div>;

  const getStatusColor = (status: string) => {
    const normalized = String(status || '').toLowerCase();
    if (normalized === 'delivered') return '#388e3c';
    if (normalized.includes('payment canceled') || normalized.includes('payment cancelled') || normalized === 'cancelled' || normalized === 'canceled') return '#d32f2f';
    if (normalized === 'paid') return 'var(--primary)';
    return 'var(--accent)';
  };

  return (
    <div>
      <div style={{ padding: '24px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 16 }}>
        <Link href="/account/orders" style={{ color: '#878787', display: 'flex', alignItems: 'center' }}>
          <ArrowBackIcon />
        </Link>
        <h2 style={{ fontSize: '18px', fontWeight: 500, margin: 0, color: 'var(--dark-text)' }}>
          Order Details
        </h2>
      </div>

      <div style={{ padding: 24 }}>
        <div style={{ border: '1px solid #e0e0e0', borderRadius: 4, padding: 24, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #f0f0f0', paddingBottom: 16, marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 14, color: '#878787', marginBottom: 4 }}>Order ID</div>
              <div style={{ fontWeight: 500, fontSize: 16 }}>{order.order_number || order.id}</div>
            </div>
            <div>
              <div style={{ fontSize: 14, color: '#878787', marginBottom: 4 }}>Order Date</div>
              <div style={{ fontWeight: 500, fontSize: 16 }}>
                {new Date(order.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute:'2-digit' })}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 14, color: '#878787', marginBottom: 4 }}>Order Total</div>
              <div style={{ fontWeight: 500, fontSize: 16 }}>₹{Number(order.total_amount).toFixed(2)}</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 16, fontWeight: 500, color: getStatusColor(order.order_status) }}>
              Order Status: {order.order_status}
            </div>
            <Link href={`/account/orders/${id}/receipt`}>
              <Button variant="outline" size="sm">Download Invoice</Button>
            </Link>
          </div>
        </div>

        <div style={{ border: '1px solid #e0e0e0', borderRadius: 4, padding: 24, marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 16, marginTop: 0 }}>Items Ordered</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {items.map((it) => (
              <div key={it.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: '#fafafa', borderRadius: 4 }}>
                <div>
                  <div style={{ fontWeight: 500, color: '#212121', marginBottom: 4 }}>{it.product_name}</div>
                  <div style={{ fontSize: 14, color: '#878787' }}>Qty: {it.quantity} &nbsp;|&nbsp; Price: ₹{Number(it.unit_price).toFixed(2)}</div>
                </div>
                <div style={{ fontWeight: 500 }}>
                  ₹{Number(it.total_price).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16, paddingTop: 16, borderTop: '1px solid #e0e0e0' }}>
            <div style={{ width: 250 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
                <span>Subtotal</span>
                <span>₹{Number(order.subtotal).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8 }}>
                <span>Shipping</span>
                <span>₹{Number(order.shipping_fee).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 8, color: 'var(--accent)' }}>
                <span>Discount</span>
                <span>-₹{Number(order.discount).toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 500, marginTop: 8, paddingTop: 8, borderTop: '1px solid #e0e0e0' }}>
                <span>Total</span>
                <span>₹{Number(order.total_amount).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div style={{ border: '1px solid #e0e0e0', borderRadius: 4, padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 16, marginTop: 0 }}>Shipping Information</h3>
          {order.metadata?.shipping_address ? (
            <div style={{ fontSize: 14, color: '#212121', lineHeight: 1.5 }}>
              <div style={{ fontWeight: 500, marginBottom: 4 }}>{order.metadata.shipping_address.name}</div>
              <div>{order.metadata.shipping_address.address}</div>
              <div>{order.metadata.shipping_address.city}, {order.metadata.shipping_address.state} - {order.metadata.shipping_address.pin}</div>
              <div style={{ marginTop: 4 }}>Phone: {order.metadata.shipping_address.phone}</div>
            </div>
          ) : (
            <div style={{ fontSize: 14, color: '#878787' }}>No shipping information available.</div>
          )}
        </div>
      </div>
    </div>
  );
}
