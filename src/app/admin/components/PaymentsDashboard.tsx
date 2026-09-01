"use client";
import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import styles from './PaymentsDashboard.module.css';

type Payment = { id: string; order_id?: string; provider_payment_id?: string; amount?: number; status?: string; created_at?: string };

export default function PaymentsDashboard() {
  const [payments, setPayments] = useState<Payment[] | null>(null);
  const router = useRouter();
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [query, setQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [viewMode, setViewMode] = useState<'table'|'card'>('table');
  const [total, setTotal] = useState<number>(0);
  const [stats, setStats] = useState<{ orders?: number; users?: number; revenue?: number } | null>(null);
  const [paidCount, setPaidCount] = useState<number>(0);
  const [failedCount, setFailedCount] = useState<number>(0);
  const [cancelledCount, setCancelledCount] = useState<number>(0);

  const loadPayments = useCallback(async (opts?: { append?: boolean }) => {
    setLoadingMore(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', String(limit));
      if (query) params.set('q', query);
      if (statusFilter) params.set('status', statusFilter);
      const res = await fetch(`/api/admin/payments?${params.toString()}`, { credentials: 'same-origin' });
      if (res.status === 401 || res.status === 403) {
        router.push('/admin/login');
        return;
      }
      const data = await res.json();
      if (!res.ok) {
        console.error('load payments', data?.error || 'failed');
        return;
      }
      const list: Payment[] = data.payments ?? [];
      setHasMore(list.length >= limit);
      setTotal(Number(data.total ?? 0));
      setPayments((prev) => (opts?.append ? ((prev || []).concat(list)) : list));
    } catch (e) {
      console.error('load payments', e);
    } finally {
      setLoadingMore(false);
    }
  }, [page, limit, query, statusFilter, router]);

  const loadStats = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/stats', { credentials: 'same-origin' });
      if (!res.ok) return;
      const data = await res.json();
      setStats(data);
      // also fetch payment counts
      try {
        const p1 = await fetch('/api/admin/payments?status=paid&limit=1', { credentials: 'same-origin' });
        const d1 = await p1.json();
        setPaidCount(Number(d1.total ?? 0));
      } catch (e) { console.error('paid count', e); }
      try {
        const p2 = await fetch('/api/admin/payments?status=failed&limit=1', { credentials: 'same-origin' });
        const d2 = await p2.json();
        setFailedCount(Number(d2.total ?? 0));
      } catch (e) { console.error('failed count', e); }
      try {
        const p3 = await fetch('/api/admin/payments?status=cancelled&limit=1', { credentials: 'same-origin' });
        const d3 = await p3.json();
        setCancelledCount(Number(d3.total ?? 0));
      } catch (e) { console.error('cancelled count', e); }
    } catch (e) {
      console.error('load stats', e);
    }
  }, []);

  useEffect(() => { loadPayments({ append: false }); }, [loadPayments]);
  useEffect(() => { loadStats(); }, [loadStats]);

  return (
    <div>
      <h2>Payments</h2>
      <p className={styles.spaced}>Payment transactions and reconciliation.</p>

      <div className={styles.toolbar}>
        <div className={styles.controlsLeft}>
          <input placeholder="Search order / provider id" value={query} onChange={(e) => setQuery(e.target.value)} className={styles.search} />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={styles.select}>
            <option value="">All statuses</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className={styles.controlsRight}>
          <label className={styles.label}>Per page</label>
          <select value={limit} onChange={(e) => setLimit(Number(e.target.value))} className={styles.selectSmall}>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <button className={styles.iconBtn} onClick={() => setViewMode(viewMode === 'table' ? 'card' : 'table')}>{viewMode === 'table' ? 'Card' : 'Table'}</button>
        </div>
      </div>

      <div className={styles.cardsRow}>
        <div className={styles.cardSmall}><div className={styles.cardLabel}>Total Orders</div><div className={styles.cardValue}>{stats?.orders ?? '-'}</div></div>
        <div className={styles.cardSmall}><div className={styles.cardLabel}>Total Payments</div><div className={styles.cardValue}>{total ?? '-'}</div></div>
        <div className={styles.cardSmall}><div className={styles.cardLabel}>Paid</div><div className={styles.cardValue}>{paidCount ?? 0}</div></div>
        <div className={styles.cardSmall}><div className={styles.cardLabel}>Failed</div><div className={styles.cardValue}>{failedCount ?? 0}</div></div>
        <div className={styles.cardSmall}><div className={styles.cardLabel}>Cancelled</div><div className={styles.cardValue}>{cancelledCount ?? 0}</div></div>
        <div className={styles.cardSmall}><div className={styles.cardLabel}>Revenue</div><div className={styles.cardValue}>₹{Number(stats?.revenue ?? 0).toFixed(2)}</div></div>
      </div>

      <div className={styles.spaced}>
        {payments === null ? (
          <div>Loading...</div>
        ) : payments.length === 0 ? (
          <div className={styles.empty}><em>No payments yet</em></div>
        ) : (
          <div className={styles.wrap}>
            <div className={styles.responsive}>
              {viewMode === 'table' ? (
                <table className={styles.table}>
                  <thead className={styles.thead}>
                    <tr>
                      <th>Order</th>
                      <th>Provider ID</th>
                      <th>Amount</th>
                      <th>Status</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => {
                      const status = (p.status || '').toLowerCase();
                      const badgeClass = status === 'paid' ? 'paid' : status === 'failed' ? 'failed' : status === 'pending' ? 'pending' : 'unknown';
                      return (
                        <tr key={p.id} className={styles.row}>
                          <td className={styles.cell} data-label="Order">{p.order_id ?? '-'}</td>
                          <td className={styles.cell} data-label="Provider">{p.provider_payment_id ?? '-'}</td>
                          <td className={styles.cell} data-label="Amount">₹{Number(p.amount ?? 0).toFixed(2)}</td>
                          <td className={styles.cell} data-label="Status"><span className={`${styles.badge} ${styles[badgeClass]}`}>{status || '-'}</span></td>
                          <td className={styles.cell} data-label="Created">{p.created_at ? new Date(p.created_at).toLocaleString() : '-'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              ) : (
                <div className={styles.cardList}>
                  {payments.map((p) => {
                    const status = (p.status || '').toLowerCase();
                    const badgeClass = status === 'paid' ? 'paid' : status === 'failed' ? 'failed' : status === 'pending' ? 'pending' : 'unknown';
                    return (
                      <div key={p.id} className={styles.card}>
                        <div className={styles.cardRow}><strong>Order</strong><span>{p.order_id ?? '-'}</span></div>
                        <div className={styles.cardRow}><strong>Provider</strong><span>{p.provider_payment_id ?? '-'}</span></div>
                        <div className={styles.cardRow}><strong>Amount</strong><span>₹{Number(p.amount ?? 0).toFixed(2)}</span></div>
                        <div className={styles.cardRow}><strong>Status</strong><span className={`${styles.badge} ${styles[badgeClass]}`}>{status || '-'}</span></div>
                        <div className={styles.cardRow}><strong>Created</strong><span>{p.created_at ? new Date(p.created_at).toLocaleString() : '-'}</span></div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Pagination controls */}
      <div className={styles.pagination}>
        <button disabled={page <= 1 || loadingMore} onClick={() => { setPage((p) => Math.max(1, p - 1)); }} className={styles.pageBtn}>Previous</button>
        <span className={styles.pageInfo}>Page {page}</span>
        <button disabled={!hasMore || loadingMore} onClick={() => { setPage((p) => p + 1); }} className={styles.pageBtn}>Next</button>
        <div className={styles.totalInfo}>Total: {total}</div>
        <button onClick={() => { setPage(1); loadPayments({ append: false }); }} className={styles.pageBtnSecondary}>Refresh</button>
      </div>
    </div>
  );
}
