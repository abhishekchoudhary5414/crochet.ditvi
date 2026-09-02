"use client";

import React, { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './PaymentsDashboard.module.css';

type Payment = {
  id: string;
  order_id?: string;
  user_id?: string | null;
  provider?: string;
  provider_order_id?: string;
  provider_payment_id?: string;
  provider_signature?: string;
  amount?: number;
  currency?: string;
  status?: string;
  payment_method?: string;
  error_code?: string;
  error_description?: string;
  created_at?: string;
  updated_at?: string;
  customer?: {
    email?: string | null;
    phone?: string | null;
    full_name?: string | null;
  } | null;
};

const PaymentsDashboardSkeleton = () => (
  <div className={styles.dashboard}>
    <div className={styles.headerTitle}>
      <div>
        <span className={styles.kicker}>Finance flow</span>
        <h2>Payments</h2>
      </div>
    </div>

    <div className={styles.cardsRow}>
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className={`${styles.cardSmall} ${styles.cardSkeleton}`}>
          <div className={`${styles.skeletonLine} ${styles.skeletonShort}`} />
          <div className={`${styles.skeletonLine} ${styles.skeletonMetric}`} />
        </div>
      ))}
    </div>

    <div className={styles.toolbar}>
      <div className={`${styles.skeletonLine} ${styles.skeletonSearch}`} />
      <div className={`${styles.skeletonLine} ${styles.skeletonFilter}`} />
      <div className={`${styles.skeletonLine} ${styles.skeletonFilter}`} />
      <div className={`${styles.skeletonLine} ${styles.skeletonFilter}`} />
    </div>

    <div className={styles.spaced}>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Gateway</th>
              <th>Reference</th>
              <th>Status</th>
              <th>Amount</th>
              <th>Method</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, index) => (
              <tr key={index} className={styles.row}>
                <td className={styles.cell}><div className={`${styles.skeletonLine} ${styles.skeletonRowSm}`} /></td>
                <td className={styles.cell}><div className={`${styles.skeletonLine} ${styles.skeletonRowMd}`} /></td>
                <td className={styles.cell}><div className={`${styles.skeletonLine} ${styles.skeletonRowLg}`} /></td>
                <td className={styles.cell}><div className={`${styles.skeletonLine} ${styles.skeletonRowSm}`} /></td>
                <td className={styles.cell}><div className={`${styles.skeletonLine} ${styles.skeletonRowSm}`} /></td>
                <td className={styles.cell}><div className={`${styles.skeletonLine} ${styles.skeletonRowSm}`} /></td>
                <td className={styles.cell}><div className={`${styles.skeletonLine} ${styles.skeletonRowSm}`} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default function PaymentsDashboard() {
  const [payments, setPayments] = useState<Payment[] | null>(null);
  const router = useRouter();
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(20);
  const [query, setQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [providerFilter, setProviderFilter] = useState<string>('');
  const [total, setTotal] = useState<number>(0);
  const [stats, setStats] = useState<{ orders?: number; users?: number; revenue?: number } | null>(null);
  const [paidCount, setPaidCount] = useState<number>(0);
  const [failedCount, setFailedCount] = useState<number>(0);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [paymentsLoading, setPaymentsLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await fetch('/api/admin/stats', { credentials: 'same-origin' });
      if (!res.ok) return;
      const data = await res.json();
      setStats(data);

      try {
        const paidRes = await fetch('/api/admin/payments?status=paid&limit=1', { credentials: 'same-origin' });
        const paidData = await paidRes.json();
        setPaidCount(Number(paidData.total ?? 0));
      } catch (e) {
        console.error('paid count', e);
      }

      try {
        const failedRes = await fetch('/api/admin/payments?status=failed&limit=1', { credentials: 'same-origin' });
        const failedData = await failedRes.json();
        setFailedCount(Number(failedData.total ?? 0));
      } catch (e) {
        console.error('failed count', e);
      }

      try {
        const pendingRes = await fetch('/api/admin/payments?status=pending&limit=1', { credentials: 'same-origin' });
        const pendingData = await pendingRes.json();
        setPendingCount(Number(pendingData.total ?? 0));
      } catch (e) {
        console.error('pending count', e);
      }
    } catch (e) {
      console.error('load stats', e);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const loadPayments = useCallback(async () => {
    setPaymentsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', String(limit));
      if (query) params.set('q', query);
      if (statusFilter) params.set('status', statusFilter);
      if (providerFilter) params.set('provider', providerFilter);

      const res = await fetch(`/api/admin/payments?${params.toString()}`, { credentials: 'same-origin' });
      if (res.status === 401 || res.status === 403) {
        router.push('/admin/login');
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        console.error('load payments', data?.error || 'failed');
        setPayments([]);
        setTotal(0);
        return;
      }

      setPayments(data.payments ?? []);
      setTotal(Number(data.total ?? 0));
    } catch (e) {
      console.error('load payments', e);
      setPayments([]);
      setTotal(0);
    } finally {
      setPaymentsLoading(false);
    }
  }, [page, limit, query, statusFilter, providerFilter, router]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    loadPayments();
  }, [loadPayments]);

  if (paymentsLoading || statsLoading) return <PaymentsDashboardSkeleton />;

  function exportCSV() {
    const rows = (payments || []).map((payment) => ({
      order_id: payment.order_id ?? '',
      provider: payment.provider ?? '',
      provider_order_id: payment.provider_order_id ?? '',
      provider_payment_id: payment.provider_payment_id ?? '',
      amount: String(payment.amount ?? 0),
      currency: payment.currency ?? 'INR',
      status: payment.status ?? '',
      payment_method: payment.payment_method ?? '',
      error_code: payment.error_code ?? '',
      error_description: payment.error_description ?? '',
      created_at: payment.created_at ?? '',
    }));

    const headers = Object.keys(rows[0] || {}).join(',');
    const csv = headers + '\n' + rows.map((row) => Object.values(row).map((value) => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `payments_${Date.now()}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  const getBadgeClass = (value: string) => {
    const status = (value || '').toLowerCase();
    if (status === 'paid') return styles.paid;
    if (status === 'failed') return styles.failed;
    if (status === 'pending') return styles.pending;
    if (status === 'cancelled') return styles.cancelled;
    return styles.unknown;
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className={styles.dashboard}>
      <div className={styles.headerTitle}>
        <div>
          <span className={styles.kicker}>Finance flow</span>
          <h2>Payments</h2>
        </div>
      </div>

      <div className={styles.cardsRow}>
        <div className={`${styles.cardSmall} ${styles.cardPink}`}>
          <div className={styles.cardLabel}>Total payments</div>
          <div className={styles.cardValue}>{total}</div>
        </div>
        <div className={`${styles.cardSmall} ${styles.cardPeach}`}>
          <div className={styles.cardLabel}>Paid</div>
          <div className={styles.cardValue}>{paidCount}</div>
        </div>
        <div className={`${styles.cardSmall} ${styles.cardMint}`}>
          <div className={styles.cardLabel}>Failed</div>
          <div className={styles.cardValue}>{failedCount}</div>
        </div>
        <div className={`${styles.cardSmall} ${styles.cardBlue}`}>
          <div className={styles.cardLabel}>Pending</div>
          <div className={styles.cardValue}>{pendingCount}</div>
        </div>
      </div>

      <div className={styles.toolbar}>
        <input
          className={styles.search}
          placeholder="Search payment ref or order"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select value={providerFilter} onChange={(e) => setProviderFilter(e.target.value)}>
          <option value="">All gateways</option>
          <option value="razorpay">Razorpay</option>
          <option value="stripe">Stripe</option>
          <option value="cod">Cash on delivery</option>
        </select>
        <select value={limit} onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}>
          <option value={10}>10 / page</option>
          <option value={20}>20 / page</option>
          <option value={50}>50 / page</option>
        </select>
        <button onClick={() => exportCSV()} className={styles.pageBtn}>Export CSV</button>
      </div>

      <div className={styles.spaced}>
        {!payments || payments.length === 0 ? (
          <div className={styles.empty}><em>No payments found</em></div>
        ) : (
          <>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead className={styles.thead}>
                  <tr>
                    <th>Order</th>
                    <th>Customer</th>
                    <th>Gateway</th>
                    <th>Reference</th>
                    <th>Status</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => {
                    const status = String(payment.status ?? 'pending');
                    const ref = payment.provider_payment_id || payment.provider_order_id || payment.id;
                    const paymentMethod = payment.payment_method || 'N/A';
                    const providerName = payment.provider ? payment.provider.charAt(0).toUpperCase() + payment.provider.slice(1) : 'Razorpay';
                    const errorInfo = payment.error_code || payment.error_description;
                    const customerEmail = payment.customer?.email || 'No email';
                    const customerPhone = payment.customer?.phone || 'No phone';

                    return (
                      <tr key={payment.id} className={styles.row}>
                        <td className={styles.cell} data-label="Order">
                          <div className={styles.orderStack}>
                            <span className={styles.orderId}>{payment.order_id ?? '—'}</span>
                            <small className={styles.metaText}>{payment.currency ?? 'INR'}</small>
                          </div>
                        </td>

                        <td className={styles.cell} data-label="Customer">
                          <div className={styles.contactStack}>
                            <span className={styles.contactText}>{customerEmail}</span>
                            <small className={styles.metaText}>{customerPhone}</small>
                          </div>
                        </td>

                        <td className={styles.cell} data-label="Gateway">
                          <div className={styles.orderStack}>
                            <span className={styles.gatewayName}>{providerName}</span>
                            <small className={styles.metaText}>{payment.provider_order_id ? 'Order link ready' : 'No order ref'}</small>
                          </div>
                        </td>

                        <td className={styles.cell} data-label="Reference">
                          <div className={styles.inlineStack}>
                            <span className={styles.refText}>{ref}</span>
                            {errorInfo ? <small className={styles.errorText}>{errorInfo}</small> : <small className={styles.metaText}>Secure payment</small>}
                          </div>
                        </td>

                        <td className={styles.cell} data-label="Status">
                          <span className={`${styles.badge} ${getBadgeClass(status)}`}>{status}</span>
                        </td>

                        <td className={styles.cell} data-label="Amount">
                          <div className={styles.amountWrap}>
                            <strong>₹{Number(payment.amount ?? 0).toFixed(2)}</strong>
                            <small className={styles.metaText}>{payment.currency ?? 'INR'}</small>
                          </div>
                        </td>

                        <td className={styles.cell} data-label="Method">
                          <span className={styles.methodPill}>{paymentMethod}</span>
                        </td>

                        <td className={styles.cell} data-label="Created">
                          <div className={styles.orderStack}>
                            <span>{payment.created_at ? new Date(payment.created_at).toLocaleString() : '—'}</span>
                            {payment.updated_at && <small className={styles.metaText}>Updated {new Date(payment.updated_at).toLocaleString()}</small>}
                          </div>
                        </td>
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
