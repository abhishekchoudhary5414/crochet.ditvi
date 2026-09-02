"use client";

import React, { use, useEffect, useState } from 'react';
import supabase from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/Button/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const OrderDetailPageSkeleton = () => (
  <div>
    <div style={{ padding: '24px', borderBottom: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: 16 }}>
      <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'linear-gradient(90deg, #f2edf0 25%, #f9f3f6 50%, #f2edf0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.3s ease-in-out infinite' }} />
      <div style={{ width: 170, height: 22, borderRadius: 8, background: 'linear-gradient(90deg, #f2edf0 25%, #f9f3f6 50%, #f2edf0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.3s ease-in-out infinite' }} />
    </div>

    <div style={{ padding: 24 }}>
      <div style={{ border: '1px solid #e0e0e0', borderRadius: 4, padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
          <div style={{ width: 180, height: 18, borderRadius: 8, background: 'linear-gradient(90deg, #f2edf0 25%, #f9f3f6 50%, #f2edf0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.3s ease-in-out infinite' }} />
          <div style={{ width: 220, height: 18, borderRadius: 8, background: 'linear-gradient(90deg, #f2edf0 25%, #f9f3f6 50%, #f2edf0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.3s ease-in-out infinite' }} />
          <div style={{ width: 150, height: 18, borderRadius: 8, background: 'linear-gradient(90deg, #f2edf0 25%, #f9f3f6 50%, #f2edf0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.3s ease-in-out infinite' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ width: 220, height: 22, borderRadius: 8, background: 'linear-gradient(90deg, #f2edf0 25%, #f9f3f6 50%, #f2edf0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.3s ease-in-out infinite' }} />
          <div style={{ width: 140, height: 38, borderRadius: 999, background: 'linear-gradient(90deg, #f2edf0 25%, #f9f3f6 50%, #f2edf0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.3s ease-in-out infinite' }} />
        </div>
      </div>

      <div style={{ border: '1px solid #e0e0e0', borderRadius: 4, padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 18, flexWrap: 'wrap' }}>
          <div style={{ width: 160, height: 18, borderRadius: 8, background: 'linear-gradient(90deg, #f2edf0 25%, #f9f3f6 50%, #f2edf0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.3s ease-in-out infinite' }} />
          <div style={{ width: 120, height: 18, borderRadius: 8, background: 'linear-gradient(90deg, #f2edf0 25%, #f9f3f6 50%, #f2edf0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.3s ease-in-out infinite' }} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[1, 2].map((item) => (
            <div key={item} style={{ display: 'flex', justifyContent: 'space-between', padding: '16px', background: '#fafafa', borderRadius: 4, gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ width: '45%', height: 18, marginBottom: 8, borderRadius: 8, background: 'linear-gradient(90deg, #f2edf0 25%, #f9f3f6 50%, #f2edf0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.3s ease-in-out infinite' }} />
                <div style={{ width: '60%', height: 14, borderRadius: 8, background: 'linear-gradient(90deg, #f2edf0 25%, #f9f3f6 50%, #f2edf0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.3s ease-in-out infinite' }} />
              </div>
              <div style={{ width: 80, height: 18, borderRadius: 8, background: 'linear-gradient(90deg, #f2edf0 25%, #f9f3f6 50%, #f2edf0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.3s ease-in-out infinite' }} />
            </div>
          ))}
        </div>
      </div>

      <div style={{ border: '1px solid #e0e0e0', borderRadius: 4, padding: 24 }}>
        <div style={{ width: 180, height: 18, marginBottom: 18, borderRadius: 8, background: 'linear-gradient(90deg, #f2edf0 25%, #f9f3f6 50%, #f2edf0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.3s ease-in-out infinite' }} />
        <div style={{ width: '40%', height: 18, marginBottom: 8, borderRadius: 8, background: 'linear-gradient(90deg, #f2edf0 25%, #f9f3f6 50%, #f2edf0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.3s ease-in-out infinite' }} />
        <div style={{ width: '50%', height: 14, marginBottom: 6, borderRadius: 8, background: 'linear-gradient(90deg, #f2edf0 25%, #f9f3f6 50%, #f2edf0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.3s ease-in-out infinite' }} />
        <div style={{ width: '55%', height: 14, marginBottom: 6, borderRadius: 8, background: 'linear-gradient(90deg, #f2edf0 25%, #f9f3f6 50%, #f2edf0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.3s ease-in-out infinite' }} />
        <div style={{ width: '28%', height: 14, borderRadius: 8, background: 'linear-gradient(90deg, #f2edf0 25%, #f9f3f6 50%, #f2edf0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.3s ease-in-out infinite' }} />
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  </div>
);

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

  if (loading) return <OrderDetailPageSkeleton />;
  if (!order) return <div style={{ padding: 24 }}>Order not found.</div>;

  const getStatusColor = (status: string) => {
    const normalized = String(status || '').toLowerCase();
    if (normalized === 'delivered') return '#388e3c';
    if (normalized.includes('payment canceled') || normalized.includes('payment cancelled') || normalized === 'cancelled' || normalized === 'canceled') return '#d32f2f';
    if (normalized === 'paid') return 'var(--primary)';
    return 'var(--accent)';
  };

  const paymentStatus = String(order?.payment_status || order?.last_payment_status || 'pending').toLowerCase();
  const normalizedPaymentStatus = [
    'paid', 'success', 'successful', 'succeeded', 'captured', 'completed', 'confirmed', 'authorized'
  ].includes(paymentStatus) ? 'paid' :
    ['failed', 'failure', 'cancelled', 'canceled', 'rejected', 'expired'].includes(paymentStatus) ?
      (paymentStatus === 'cancelled' || paymentStatus === 'canceled' ? 'cancelled' : 'failed') :
      paymentStatus;

  const paymentStatusLabel = normalizedPaymentStatus === 'paid' ? 'Paid' : normalizedPaymentStatus === 'failed' ? 'Failed' : normalizedPaymentStatus === 'cancelled' ? 'Cancelled' : 'Pending';
  const isDelivered = String(order?.order_status || '').trim().toLowerCase() === 'delivered';
  const supportUrl = `https://wa.me/919285248504?text=${encodeURIComponent('Hi Ditvi Crochet, I need support for my order.')}`;

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
            {isDelivered && (
              <Link href={`/account/orders/${id}/receipt`}>
                <Button variant="outline" size="sm">Download Invoice</Button>
              </Link>
            )}
          </div>
        </div>

        <div style={{ border: '1px solid #e0e0e0', borderRadius: 4, padding: 24, marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 14, color: '#878787', marginBottom: 6 }}>Payment Status</div>
              <div style={{
                display: 'inline-block',
                padding: '8px 12px',
                borderRadius: 999,
                fontWeight: 700,
                fontSize: 13,
                background:
                  normalizedPaymentStatus === 'paid' ? '#e8f8ee' :
                  normalizedPaymentStatus === 'failed' ? '#fdecec' :
                  normalizedPaymentStatus === 'cancelled' ? '#f2ebff' : '#fff5df',
                color:
                  normalizedPaymentStatus === 'paid' ? '#1d7a45' :
                  normalizedPaymentStatus === 'failed' ? '#b42318' :
                  normalizedPaymentStatus === 'cancelled' ? '#5b3e8e' : '#9c6a00'
              }}>
                {paymentStatusLabel}
              </div>
            </div>
            <div style={{ fontSize: 14, color: '#878787' }}>Status on order: <strong style={{ color: getStatusColor(order.order_status) }}>{order.order_status}</strong></div>
          </div>

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

        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 24 }}>
          <a
            href={supportUrl}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '12px 18px',
              borderRadius: 999,
              background: 'linear-gradient(135deg, #f8dfe9 0%, #f3c7d9 100%)',
              color: '#4a2f38',
              fontWeight: 700,
              fontSize: 14,
              textDecoration: 'none',
              boxShadow: '0 10px 20px rgba(201, 134, 164, 0.2)',
            }}
          >
            Need Help? WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}
