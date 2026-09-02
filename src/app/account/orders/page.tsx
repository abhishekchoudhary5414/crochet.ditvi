"use client";

import React, { useEffect, useState } from 'react';
import supabase from '@/lib/supabaseClient';
import Link from 'next/link';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LocalMallOutlinedIcon from '@mui/icons-material/LocalMallOutlined';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const s = await supabase.auth.getSession();
    const token = s?.data?.session?.access_token;
    if (!token) {
      setLoading(false);
      return;
    }
    const res = await fetch('/api/account/orders', { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) {
      const data = await res.json();
      setOrders(data.orders || []);
    }
    setLoading(false);
  };

  if (loading) return <div style={{ padding: 24 }}>Loading orders...</div>;

  return (
    <div>
      <div style={{ padding: '24px', borderBottom: '1px solid #f0f0f0' }}>
        <h2 style={{ fontSize: '18px', fontWeight: 500, margin: 0, color: 'var(--dark-text)' }}>My Orders</h2>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {orders.length === 0 ? (
          <div style={{ padding: '48px', textAlign: 'center', color: '#878787' }}>
            <LocalMallOutlinedIcon style={{ fontSize: 64, color: '#e0e0e0', marginBottom: 16 }} />
            <p style={{ fontSize: 16, margin: 0 }}>You have no orders yet.</p>
          </div>
        ) : (
          orders.map((o) => {
            const orderStatus = String(o.order_status || 'pending').toLowerCase();
            const paymentStatus = String(o.latest_payment_status || o.payment_status || 'pending').toLowerCase();
            const wasPaymentCancelled = orderStatus.includes('payment canceled') || orderStatus.includes('payment cancelled') || orderStatus === 'canceled' || orderStatus === 'cancelled';
            const orderColor = orderStatus === 'delivered'
              ? '#388e3c'
              : orderStatus === 'paid'
                ? 'var(--primary)'
                : wasPaymentCancelled
                  ? '#d32f2f'
                  : 'var(--accent)';
            const paymentColor = paymentStatus === 'paid' || paymentStatus === 'captured' || paymentStatus === 'success' || paymentStatus === 'successful'
              ? '#388e3c'
              : paymentStatus === 'failed' || paymentStatus === 'cancelled' || paymentStatus === 'canceled'
                ? '#d32f2f'
                : '#f39c12';

            return (
              <Link href={`/account/orders/${o.id}`} key={o.id} style={{ textDecoration: 'none', color: 'inherit', display: 'block', borderBottom: '1px solid #f0f0f0' }}>
                <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'background 0.2s' }} 
                     onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fafafa'}
                     onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}>
                  
                  <div style={{ flex: 1, display: 'flex', gap: 24, alignItems: 'center' }}>
                    <div style={{ width: 80, height: 80, background: '#f5f5f5', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <LocalMallOutlinedIcon style={{ color: '#bdbdbd' }} />
                    </div>
                    
                    <div>
                      <div style={{ fontWeight: 500, fontSize: 16, color: '#212121', marginBottom: 4 }}>
                        Order #{o.order_number || o.id.slice(0,8).toUpperCase()}
                      </div>
                      <div style={{ fontSize: 14, color: '#878787', marginBottom: 8 }}>
                        Placed on {new Date(o.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </div>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 6 }}>
                        <div style={{
                          fontWeight: 600,
                          fontSize: 12,
                          color: orderColor,
                          background: 'rgba(0,0,0,0.02)',
                          border: '1px solid rgba(0,0,0,0.06)',
                          borderRadius: 999,
                          padding: '6px 10px',
                        }}>
                          Order: {String(o.order_status || 'pending').toUpperCase()}
                        </div>

                        <div style={{
                          fontWeight: 600,
                          fontSize: 12,
                          color: paymentColor,
                          background: 'rgba(0,0,0,0.02)',
                          border: '1px solid rgba(0,0,0,0.06)',
                          borderRadius: 999,
                          padding: '6px 10px',
                        }}>
                          Payment: {String(o.latest_payment_status || o.payment_status || 'pending').toUpperCase()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: 24 }}>
                    <div style={{ fontWeight: 500, fontSize: 16, color: '#212121' }}>
                      ₹{o.total_amount?.toFixed?.(2) ?? '—'}
                    </div>
                    <ChevronRightIcon style={{ color: '#878787' }} />
                  </div>

                </div>
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
