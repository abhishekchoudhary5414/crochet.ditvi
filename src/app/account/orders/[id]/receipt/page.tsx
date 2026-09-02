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

  const handleDownload = () => {
    const content = document.getElementById('receipt-content');
    if (!content) return;

    const printable = content.cloneNode(true) as HTMLElement;
    printable.style.width = '100%';
    printable.style.maxWidth = '100%';
    printable.style.padding = '0';

    const html = `
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Ditvi Crochet Receipt</title>
          <style>
            @page { size: A4; margin: 18mm; }
            body { font-family: Arial, sans-serif; margin: 0; padding: 0; background: #fff; color: #3d2d33; }
            .pdf-wrap { padding: 20px; }
            table { width: 100%; border-collapse: collapse; }
            th, td { padding: 10px 8px; border-bottom: 1px solid #f3e2ea; text-align: left; }
            th { font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: #7a5f6a; }
            td { font-size: 12px; color: #4d3a40; }
            .header { background: linear-gradient(135deg, #fff0f6 0%, #f7e7f2 100%); border: 1px solid #f0dfe7; border-radius: 18px; padding: 18px 20px; margin-bottom: 18px; }
            .brand { font-size: 28px; font-weight: 700; letter-spacing: -0.05em; }
            .sub { font-size: 12px; letter-spacing: 0.12em; text-transform: uppercase; color: #8d4d67; font-weight: 700; }
            .meta { text-align: right; font-size: 13px; color: #5f4850; }
            .meta b { color: #3d2d33; }
            .summary { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 18px; }
            .box { background: #fff9fb; border: 1px solid #f4e2ea; border-radius: 12px; padding: 14px; }
            .box-title { font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 700; color: #7a5f6a; margin-bottom: 8px; }
            .totals { width: 320px; margin-left: auto; margin-top: 16px; }
            .totals-row { display: flex; justify-content: space-between; padding: 7px 0; font-size: 13px; color: #5f4850; }
            .totals-row.total { border-top: 1px solid #f3e2ea; padding-top: 12px; margin-top: 8px; font-size: 20px; font-weight: 800; color: #2d2430; }
          </style>
        </head>
        <body>
          <div class="pdf-wrap">
            <div class="header">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 15px;">
                <div>
                  <div class="sub">Ditvi Crochet</div>
                  <div class="brand">Receipt</div>
                </div>
                <div class="meta">
                  <div><b>Receipt:</b> ${order.receipt_number || order.order_number || order.id}</div>
                  <div>${new Date(order.created_at).toLocaleString()}</div>
                </div>
              </div>
            </div>

            <div class="summary">
              <div class="box">
                <div class="box-title">Customer</div>
                <div>${order.metadata?.shipping_address ? `${order.metadata.shipping_address.name || 'Customer'}<br />${order.metadata.shipping_address.address || ''}<br />${order.metadata.shipping_address.city || ''}, ${order.metadata.shipping_address.state || ''} - ${order.metadata.shipping_address.pin || ''}<br />Phone: ${order.metadata.shipping_address.phone || ''}` : 'No shipping details available.'}</div>
              </div>

              <div class="box">
                <div class="box-title">Order Summary</div>
                <div><b>Order ID:</b> ${order.order_number || order.id}</div>
                <div><b>Status:</b> ${order.order_status || 'pending'}</div>
                <div><b>Payment:</b> ${String(order.payment_status || order.last_payment_status || 'pending').toUpperCase()}</div>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th style="text-align: right;">Qty</th>
                  <th style="text-align: right;">Price</th>
                </tr>
              </thead>
              <tbody>
                ${items.map((it) => `
                  <tr>
                    <td>${it.product_name}</td>
                    <td style="text-align: right;">${it.quantity}</td>
                    <td style="text-align: right; font-weight: 700;">₹${Number(it.total_price ?? 0).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="totals">
              <div class="totals-row"><span>Subtotal</span><span>₹${Number(order.subtotal ?? 0).toFixed(2)}</span></div>
              <div class="totals-row"><span>Shipping</span><span>₹${Number(order.shipping_fee ?? 0).toFixed(2)}</span></div>
              <div class="totals-row"><span>Discount</span><span>-₹${Number(order.discount ?? 0).toFixed(2)}</span></div>
              <div class="totals-row total"><span>Total</span><span>₹${Number(order.total_amount ?? 0).toFixed(2)}</span></div>
            </div>
          </div>
        </body>
      </html>
    `;

    const blob = new Blob([html], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ditvi-receipt-${order.order_number || order.id || 'invoice'}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.page}>
      <div className={styles.card} style={{ maxWidth: 960, margin: '20px auto', padding: 0, overflow: 'hidden' }}>
        <div id="receipt-content" style={{ padding: 0 }}>
          <div style={{ background: 'linear-gradient(135deg, #fff0f6 0%, #f7e7f2 100%)', padding: '28px 28px 18px', borderBottom: '1px solid #f0dfe7' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 18, flexWrap: 'wrap' }}>
              <div>
                <div style={{ fontSize: 14, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#8d4d67', fontWeight: 700 }}>Ditvi Crochet</div>
                <h3 style={{ margin: '8px 0 0', fontSize: '2rem', letterSpacing: '-0.05em', color: '#3d2d33' }}>Receipt</h3>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 13, color: '#7a5f6a', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Receipt No.</div>
                <div style={{ fontWeight: 800, color: '#3d2d33', fontSize: 18 }}>{order.receipt_number || order.order_number || order.id}</div>
                <div style={{ marginTop: 6, fontSize: 14, color: '#5f4850' }}>{new Date(order.created_at).toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div style={{ padding: 28 }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 18, marginBottom: 22 }}>
              <div style={{ background: '#fff9fb', border: '1px solid #f4e2ea', borderRadius: 16, padding: 18 }}>
                <div style={{ fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700, color: '#7a5f6a', marginBottom: 10 }}>Customer</div>
                <div style={{ lineHeight: 1.7, color: '#4d3a40' }}>
                  {order.metadata?.shipping_address ? (
                    <>
                      <div style={{ fontWeight: 700 }}>{order.metadata.shipping_address.name || 'Customer'}</div>
                      <div>{order.metadata.shipping_address.address || '—'}</div>
                      <div>{order.metadata.shipping_address.city || ''}, {order.metadata.shipping_address.state || ''} - {order.metadata.shipping_address.pin || ''}</div>
                      <div>Phone: {order.metadata.shipping_address.phone || '—'}</div>
                    </>
                  ) : '—'}
                </div>
              </div>

              <div style={{ background: '#fff9fb', border: '1px solid #f4e2ea', borderRadius: 16, padding: 18 }}>
                <div style={{ fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', fontWeight: 700, color: '#7a5f6a', marginBottom: 10 }}>Order Summary</div>
                <div style={{ lineHeight: 1.9, color: '#4d3a40' }}>
                  <div><strong>Order ID:</strong> {order.order_number || order.id}</div>
                  <div><strong>Status:</strong> {order.order_status || 'pending'}</div>
                  <div><strong>Payment:</strong> {String(order.payment_status || order.last_payment_status || 'pending').toUpperCase()}</div>
                </div>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', borderRadius: 12, overflow: 'hidden' }}>
                <thead>
                  <tr style={{ background: '#fdf0f5' }}>
                    <th style={{ textAlign: 'left', padding: '14px 12px', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7a5f6a' }}>Item</th>
                    <th style={{ textAlign: 'right', padding: '14px 12px', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7a5f6a' }}>Qty</th>
                    <th style={{ textAlign: 'right', padding: '14px 12px', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#7a5f6a' }}>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it) => (
                    <tr key={it.id} style={{ borderBottom: '1px solid #f3e2ea' }}>
                      <td style={{ padding: '14px 12px', color: '#4d3a40' }}>{it.product_name}</td>
                      <td style={{ textAlign: 'right', padding: '14px 12px', color: '#4d3a40' }}>{it.quantity}</td>
                      <td style={{ textAlign: 'right', padding: '14px 12px', color: '#4d3a40', fontWeight: 700 }}>₹{Number(it.total_price ?? 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 18 }}>
              <div style={{ width: '100%', maxWidth: 330 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', color: '#5f4850' }}>
                  <span>Subtotal</span>
                  <span>₹{Number(order.subtotal ?? 0).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', color: '#5f4850' }}>
                  <span>Shipping</span>
                  <span>₹{Number(order.shipping_fee ?? 0).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', color: '#9b5e75' }}>
                  <span>Discount</span>
                  <span>-₹{Number(order.discount ?? 0).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0', borderTop: '1px solid #f3e2ea', marginTop: 8, fontSize: 20, fontWeight: 800, color: '#2d2430' }}>
                  <span>Total</span>
                  <span>₹{Number(order.total_amount ?? 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', padding: '0 28px 28px', flexWrap: 'wrap' }}>
          <button className={styles.button} onClick={handleDownload}>Download PDF</button>
          <button className={styles.buttonOutline} onClick={() => router.back()}>Back</button>
        </div>
      </div>
    </div>
  );
}
