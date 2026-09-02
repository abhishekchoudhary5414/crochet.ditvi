"use client";

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from './OrdersDashboard.module.css';

type Order = { id: string; order_number?: string; total_amount?: number; order_status?: string; payment_status?: string; created_at?: string; customer?: any; paid?: boolean; last_payment_status?: string; address?: any };

export default function OrdersDashboard() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [total, setTotal] = useState(0);
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailFilter, setEmailFilter] = useState('');
  const [stats, setStats] = useState<{ orders?: number; users?: number; revenue?: number } | null>(null);
  const router = useRouter();

  const loadStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/stats', { credentials: 'same-origin' });
      if (!res.ok) return;
      const data = await res.json();
      setStats(data);
    } catch (e) {
      console.error('load stats', e);
    }
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', String(limit));
      if (q) params.set('q', q);
      if (statusFilter) params.set('status', statusFilter);
      if (paymentFilter) params.set('payment', paymentFilter);

      const res = await fetch(`/api/admin/orders?${params.toString()}`, { credentials: 'same-origin' });
      if (res.status === 401 || res.status === 403) {
        router.push('/admin/login');
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        console.error('load orders', data?.error || 'failed');
        setOrders([]);
        setTotal(0);
        return;
      }
      setOrders(data.orders ?? []);
      setTotal(Number(data.total ?? 0));
    } catch (e) {
      console.error('load orders', e);
    } finally {
      setLoading(false);
    }
  }, [page, limit, q, statusFilter, paymentFilter, router]);

  useEffect(() => { loadStats(); }, [loadStats]);
  useEffect(() => { load(); }, [load]);

  function exportCSV() {
    const rows = (orders || []).map((o) => ({
      id: o.id,
      order_number: o.order_number ?? '',
      customer: o.customer?.full_name ?? o.customer?.email ?? '',
      email: o.customer?.email ?? '',
      address: o.address ? `${o.address.address_line_1 || ''} ${o.address.city || ''} ${o.address.pincode || ''}` : '',
      payment: String((o as any).last_payment_status ?? o.payment_status ?? ''),
      status: o.order_status ?? '',
      total: String(o.total_amount ?? 0),
      created_at: o.created_at ?? '',
    }));
    const header = Object.keys(rows[0] || {}).join(',') + '\n';
    const csv = header + rows.map(r => Object.values(r).map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const totalPages = Math.max(1, Math.ceil(total / limit));

  const getCustomerName = (o: Order) => o.customer?.full_name || o.customer?.first_name || o.customer?.last_name || 'Guest';
  const getCustomerPhone = (o: Order) => String(o.address?.phone || o.customer?.phone || '').trim();
  const getAddressText = (o: Order) => {
    const address = o.address;
    if (!address) return '—';

    const parts = [
      address.address_line_1,
      address.address_line_2,
      address.city,
      address.state,
      address.pincode,
    ].filter(Boolean);

    return parts.length > 0 ? parts.join(', ') : '—';
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.headerTitle}>
        <div>
          <span className={styles.kicker}>Sales flow</span>
          <h2>Orders</h2>
        </div>
      </div>

      <div className={styles.cardsRow}>
        <div className={`${styles.cardSmall} ${styles.cardPink}`}>
          <div className={styles.cardLabel}>Total Orders</div>
          <div className={styles.cardValue}>{stats?.orders ?? '-'}</div>
        </div>
        <div className={`${styles.cardSmall} ${styles.cardPeach}`}>
          <div className={styles.cardLabel}>Users</div>
          <div className={styles.cardValue}>{stats?.users ?? '-'}</div>
        </div>
        <div className={`${styles.cardSmall} ${styles.cardMint}`}>
          <div className={styles.cardLabel}>Revenue</div>
          <div className={styles.cardValue}>₹{Number(stats?.revenue ?? 0).toFixed(2)}</div>
        </div>
      </div>

      <div className={styles.toolbar}>
        <input className={styles.search} placeholder="Search order number or id" value={q} onChange={(e) => setQ(e.target.value)} />
        <input className={styles.search} placeholder="Filter by customer email" value={emailFilter} onChange={(e) => setEmailFilter(e.target.value)} />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          <option value="placed">Placed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}>
          <option value="">All payments</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}>
          <option value={10}>10 / page</option>
          <option value={20}>20 / page</option>
          <option value={50}>50 / page</option>
        </select>
        <button onClick={() => exportCSV()} className={styles.pageBtn}>Export CSV</button>
      </div>

      <div className={styles.spaced}>
        {loading ? (
          <div>Loading...</div>
        ) : !orders || orders.length === 0 ? (
          <div className={styles.empty}><em>No orders found</em></div>
        ) : (
          <>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead className={styles.thead}>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Contact</th>
                    <th>Address</th>
                    <th>Status</th>
                    <th>Payment</th>
                    <th>Total</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {orders
                    .filter((oo) => !emailFilter || String(oo.customer?.email || '').toLowerCase().includes(emailFilter.toLowerCase()))
                    .map((o) => {
                      const phone = getCustomerPhone(o);
                      const customerName = getCustomerName(o);
                      const addressText = getAddressText(o);

                      return (
                        <tr key={o.id} className={styles.row}>
                          <td className={styles.cell} data-label="Order">{o.order_number ?? o.id}</td>
                          <td className={styles.cell} data-label="Customer">
                            <div className={styles.personCell}>
                              <span className={styles.personName}>{customerName}</span>
                              <small>{o.customer?.email ?? 'No email'}</small>
                            </div>
                          </td>
                          <td className={styles.cell} data-label="Contact">
                            {phone ? (
                              <div className={styles.contactCell}>
                                <span>{phone}</span>
                                <a href={`tel:${phone.replace(/\s+/g, '')}`} className={styles.callButton} aria-label={`Call ${customerName}`}>
                                  Call
                                </a>
                              </div>
                            ) : (
                              '—'
                            )}
                          </td>
                          <td className={styles.cell} data-label="Address">
                            <span className={styles.addressText}>{addressText}</span>
                          </td>
                          <td className={styles.cell} data-label="Status">
                            <select
                              className={styles.select}
                              value={(o as any).order_status || ''}
                              onChange={async (e) => {
                                const newStatus = e.target.value;
                                try {
                                  const res = await fetch(`/api/admin/orders/${o.id}/status`, {
                                    method: 'PATCH',
                                    credentials: 'same-origin',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ order_status: newStatus }),
                                  });
                                  const data = await res.json();
                                  if (!res.ok) throw new Error(data?.error || 'update failed');
                                  setOrders((prev) => (prev || []).map((x) => (x.id === o.id ? { ...x, order_status: newStatus } : x)));
                                } catch (err) {
                                  console.error('update status', err);
                                  alert('Failed to update status');
                                }
                              }}
                            >
                              <option value="pending">pending</option>
                              <option value="confirmed">confirmed</option>
                              <option value="processing">processing</option>
                              <option value="shipped">shipped</option>
                              <option value="out_for_delivery">out_for_delivery</option>
                              <option value="delivered">delivered</option>
                              <option value="cancelled">cancelled</option>
                            </select>
                          </td>
                          <td className={styles.cell} data-label="Payment">
                            <span className={`${styles.badge} ${styles[((o as any).last_payment_status || o.payment_status || 'unknown').toLowerCase()] || styles['unknown']}`}>{String((o as any).last_payment_status ?? o.payment_status ?? 'unpaid')}</span>
                          </td>
                          <td className={styles.cell} data-label="Total">₹{Number(o.total_amount ?? 0).toFixed(2)}</td>
                          <td className={styles.cell} data-label="Created">{o.created_at ? new Date(o.created_at).toLocaleString() : '-'}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>

            <div className={styles.pagination}>
              <button disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
              <span className={styles.pageInfo}>Page {page} / {totalPages}</span>
              <button disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</button>
              <div className={styles.totalInfo}>Total: {total}</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
