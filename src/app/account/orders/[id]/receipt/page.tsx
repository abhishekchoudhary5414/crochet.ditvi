"use client";

import React, { use, useEffect, useState } from 'react';
import { jsPDF } from 'jspdf';
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
    if (!order) return;

    const doc = new jsPDF({ unit: 'pt', format: 'a4' });
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 42;
    const gap = 20;
    const receiptNo = order.receipt_number || order.order_number || order.id;
    const customer = order.metadata?.shipping_address;
    const paymentState = String(order.payment_status || order.last_payment_status || 'pending').toLowerCase();
    const isPaid = ['paid', 'success', 'successful', 'succeeded', 'captured', 'completed', 'confirmed', 'authorized'].includes(paymentState);

    const wrapText = (text: string, maxWidth: number) => {
      const safeText = String(text || '');
      const words = safeText.split(/\s+/).filter(Boolean);
      const lines: string[] = [];
      let current = '';

      for (const word of words) {
        const candidate = current ? `${current} ${word}` : word;
        if (doc.getTextWidth(candidate) <= maxWidth) {
          current = candidate;
        } else {
          if (current) lines.push(current);
          current = word;
        }
      }

      if (current) lines.push(current);
      return lines.length ? lines : [''];
    };

    const drawTextBlock = (x: number, y: number, lines: string[], maxWidth: number, options: { fontSize?: number; fontStyle?: 'normal' | 'bold'; color?: [number, number, number] } = {}) => {
      doc.setFont('helvetica', options.fontStyle || 'normal');
      doc.setFontSize(options.fontSize || 10);
      if (options.color) doc.setTextColor(options.color[0], options.color[1], options.color[2]);
      lines.forEach((line, index) => {
        const text = line || ' ';
        const safeLine = wrapText(text, maxWidth).join(' ');
        doc.text(safeLine, x, y + index * 16);
      });
    };

    const leftBlockWidth = (pageWidth - margin * 2 - gap) / 2;
    const rightBlockWidth = leftBlockWidth;
    const headerY = 26;
    const headerHeight = 118;
    const topCardStart = 162;
    const cardsHeight = 110;

    doc.setFillColor(249, 236, 242);
    doc.rect(0, 0, pageWidth, headerHeight + 40, 'F');

    doc.setDrawColor(228, 196, 211);
    doc.roundedRect(24, 20, pageWidth - 48, pageHeight - 36, 18, 18, 'S');

    doc.setFillColor(255, 255, 255);
    doc.roundedRect(36, 34, 120, 42, 12, 12, 'F');
    doc.setDrawColor(196, 152, 173);
    doc.roundedRect(36, 34, 120, 42, 12, 12, 'S');
    doc.setTextColor(61, 45, 51);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('DITVI', 52, 58);
    doc.setFontSize(12);
    doc.text('CROCHET', 52, 72);

    doc.setTextColor(141, 77, 103);
    doc.setFontSize(9);
    doc.text('HANDMADE WITH LOVE', pageWidth - margin - 110, 54, { align: 'right' });

    doc.setTextColor(61, 45, 51);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(29);
    doc.text('Invoice', pageWidth - margin - 110, 70, { align: 'right' });

    doc.setTextColor(111, 83, 93);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(`Invoice No: ${receiptNo}`, margin, 108);
    doc.text(`Date: ${new Date(order.created_at).toLocaleString()}`, pageWidth - margin - 120, 108, { align: 'right' });

    const statusColor = isPaid ? [25, 114, 69] : [167, 110, 52];
    const statusLabel = isPaid ? 'PAID' : 'PENDING';
    doc.setFillColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.roundedRect(pageWidth - margin - 86, 116, 72, 22, 11, 11, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text(statusLabel, pageWidth - margin - 50, 131, { align: 'center' });

    doc.setDrawColor(218, 193, 204);
    doc.setLineWidth(1);
    doc.line(margin, 150, pageWidth - margin, 150);

    const billingX = margin;
    const summaryX = margin + leftBlockWidth + gap;
    const boxY = topCardStart;

    doc.setFillColor(255, 248, 250);
    doc.roundedRect(billingX, boxY, leftBlockWidth, cardsHeight, 12, 12, 'F');
    doc.setDrawColor(231, 204, 216);
    doc.roundedRect(billingX, boxY, leftBlockWidth, cardsHeight, 12, 12, 'S');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(122, 95, 106);
    doc.text('BILLING DETAILS', billingX + 14, boxY + 22);

    const addressLines = customer
      ? [
          customer.name || 'Customer',
          customer.address || '',
          `${customer.city || ''}, ${customer.state || ''} - ${customer.pin || ''}`,
          `Phone: ${customer.phone || ''}`,
        ].filter(Boolean)
      : ['No shipping details available.'];

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(61, 45, 51);
    let addressY = boxY + 42;
    for (const line of addressLines) {
      const wrapped = wrapText(line, leftBlockWidth - 28);
      for (const part of wrapped) {
        doc.text(part, billingX + 14, addressY);
        addressY += 15;
      }
    }

    doc.setFillColor(255, 248, 250);
    doc.roundedRect(summaryX, boxY, rightBlockWidth, cardsHeight, 12, 12, 'F');
    doc.setDrawColor(231, 204, 216);
    doc.roundedRect(summaryX, boxY, rightBlockWidth, cardsHeight, 12, 12, 'S');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(122, 95, 106);
    doc.text('ORDER SUMMARY', summaryX + 14, boxY + 22);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(61, 45, 51);
    let summaryY = boxY + 42;
    doc.text(`Order ID: ${order.order_number || order.id}`, summaryX + 14, summaryY);
    summaryY += 18;
    doc.text(`Status: ${order.order_status || 'pending'}`, summaryX + 14, summaryY);
    summaryY += 18;
    doc.text(`Payment: ${String(order.payment_status || order.last_payment_status || 'pending').toUpperCase()}`, summaryX + 14, summaryY);

    let itemStartY = boxY + cardsHeight + 28;
    doc.setFillColor(253, 240, 245);
    doc.roundedRect(margin, itemStartY, pageWidth - margin * 2, 22, 8, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(122, 95, 106);
    doc.text('ITEM', margin + 12, itemStartY + 14);
    doc.text('QTY', pageWidth - 170, itemStartY + 14, { align: 'right' });
    doc.text('PRICE', pageWidth - margin - 12, itemStartY + 14, { align: 'right' });

    itemStartY += 34;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(61, 45, 51);

    let currentY = itemStartY;
    const maxItemArea = pageHeight - 180;
    for (const item of items) {
      if (currentY > maxItemArea) {
        doc.addPage();
        currentY = 54;
      }

      const itemName = String(item.product_name || 'Item');
      const nameLines = wrapText(itemName, pageWidth - 220);
      const lineCount = Math.max(1, nameLines.length);
      const itemHeight = lineCount * 12 + 10;

      doc.text(nameLines[0] || '', margin + 12, currentY);
      if (nameLines[1]) doc.text(nameLines[1], margin + 12, currentY + 12);
      doc.text(String(item.quantity ?? 0), pageWidth - 170, currentY + 8, { align: 'right' });
      doc.text(`₹${Number(item.total_price ?? 0).toFixed(2)}`, pageWidth - margin - 12, currentY + 8, { align: 'right' });

      doc.setDrawColor(243, 226, 234);
      doc.line(margin + 12, currentY + itemHeight + 2, pageWidth - margin - 12, currentY + itemHeight + 2);
      currentY += itemHeight + 18;
    }

    const totalsX = pageWidth / 2 + 18;
    const totalsY = Math.min(pageHeight - 170, currentY + 24);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(totalsX, totalsY, pageWidth / 2 - 66, 110, 12, 12, 'F');
    doc.setDrawColor(230, 209, 219);
    doc.roundedRect(totalsX, totalsY, pageWidth / 2 - 66, 110, 12, 12, 'S');

    const subtotal = Number(order.subtotal ?? 0);
    const shipping = Number(order.shipping_fee ?? 0);
    const discount = Number(order.discount ?? 0);
    const total = Number(order.total_amount ?? 0);

    let totalsRowY = totalsY + 20;
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(95, 72, 80);
    doc.setFontSize(10);
    doc.text('Subtotal', totalsX + 16, totalsRowY);
    doc.text(`₹${subtotal.toFixed(2)}`, pageWidth - margin - 18, totalsRowY, { align: 'right' });
    totalsRowY += 18;
    doc.text('Shipping', totalsX + 16, totalsRowY);
    doc.text(`₹${shipping.toFixed(2)}`, pageWidth - margin - 18, totalsRowY, { align: 'right' });
    totalsRowY += 18;
    doc.text('Discount', totalsX + 16, totalsRowY);
    doc.text(`-₹${discount.toFixed(2)}`, pageWidth - margin - 18, totalsRowY, { align: 'right' });
    totalsRowY += 20;
    doc.setDrawColor(236, 212, 223);
    doc.line(totalsX + 16, totalsRowY, pageWidth - margin - 18, totalsRowY);
    totalsRowY += 18;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(45, 36, 48);
    doc.text('TOTAL', totalsX + 16, totalsRowY);
    doc.text(`₹${total.toFixed(2)}`, pageWidth - margin - 18, totalsRowY, { align: 'right' });

    doc.setTextColor(141, 77, 103);
    doc.setFontSize(10);
    doc.text('Thank you for shopping with Ditvi Crochet', margin, pageHeight - 38);
    doc.text('Support: +91 9285248504', pageWidth - margin - 110, pageHeight - 38, { align: 'right' });

    doc.save(`ditvi-receipt-${order.order_number || order.id || 'invoice'}.pdf`);
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

