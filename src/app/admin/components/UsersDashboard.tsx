"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './UsersDashboard.module.css';

type User = {
  id: string;
  full_name?: string;
  email?: string;
  phone?: string;
  created_at?: string;
  orders_count?: number;
  total_spent?: number;
  paid_amount?: number;
  unpaid_amount?: number;
  last_order_date?: string | null;
  order_status?: string;
  payment_status?: string;
  status?: string;
};

const UsersDashboardSkeleton = () => (
  <div className={styles.dashboard}>
    <div className={styles.headerTitle}>
      <div>
        <span className={styles.kicker}>Customer flow</span>
        <h2>Users</h2>
      </div>
    </div>

    <div className={styles.cardsRow}>
      {Array.from({ length: 3 }).map((_, index) => (
        <div key={index} className={`${styles.cardSmall} ${styles.cardSkeleton}`}>
          <div className={`${styles.skeletonLine} ${styles.skeletonShort}`} />
          <div className={`${styles.skeletonLine} ${styles.skeletonMetric}`} />
        </div>
      ))}
    </div>

    <div className={styles.toolbar}>
      <div className={`${styles.skeletonLine} ${styles.skeletonSearch}`} />
      <div className={`${styles.skeletonLine} ${styles.skeletonFilter}`} />
    </div>

    <div className={styles.spaced}>
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th>User</th>
              <th>Contact</th>
              <th>Orders</th>
              <th>Spent</th>
              <th>Status</th>
              <th>Joined</th>
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, index) => (
              <tr key={index} className={styles.row}>
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

export default function UsersDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<{ orders?: number; users?: number; revenue?: number } | null>(null);
  const [usersLoading, setUsersLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    (async () => {
      setUsersLoading(true);
      try {
        const res = await fetch('/api/admin/users', { credentials: 'same-origin' });
        if (res.status === 401 || res.status === 403) {
          router.push('/admin/login');
          return;
        }
        const data = await res.json();
        if (!res.ok) {
          console.error('load users', data?.error || 'failed');
          return;
        }
        if (mounted) setUsers(data.users ?? []);
      } catch (e) {
        console.error('load users', e);
      } finally {
        if (mounted) setUsersLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [router]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setStatsLoading(true);
      try {
        const res = await fetch('/api/admin/stats', { credentials: 'same-origin' });
        if (!res.ok) return;
        const d = await res.json();
        if (mounted) setStats(d);
      } catch (e) {
        console.error('load stats', e);
      } finally {
        if (mounted) setStatsLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (usersLoading || statsLoading) return <UsersDashboardSkeleton />;

  const activeUsers = users.filter((user) => (user.status || '').toLowerCase() === 'active').length;
  const filteredUsers = users.filter((user) => {
    const text = `${user.full_name ?? ''} ${user.email ?? ''} ${user.phone ?? ''}`.toLowerCase();
    const matchesText = !q || text.includes(q.toLowerCase());
    const matchesStatus = !statusFilter || (user.status || 'new') === statusFilter;
    return matchesText && matchesStatus;
  });

  const getBadgeClass = (value: string) => {
    const status = (value || 'new').toLowerCase();
    if (status === 'active') return styles.active;
    if (status === 'new') return styles.new;
    return styles.inactive;
  };

  const getOrderBadgeClass = (value: string) => {
    const status = (value || 'pending').toLowerCase();
    if (['pending', 'processing', 'placed', 'out_for_delivery'].includes(status)) return styles.pending;
    if (['delivered', 'paid', 'confirmed', 'completed'].includes(status)) return styles.paid;
    if (['cancelled', 'failed'].includes(status)) return styles.cancelled;
    return styles.pending;
  };

  const getPaymentBadgeClass = (value: string) => {
    const status = (value || 'pending').toLowerCase();
    if (['paid', 'captured', 'success', 'successful', 'completed', 'complete', 'confirmed'].includes(status)) return styles.paid;
    if (['failed', 'cancelled', 'rejected', 'error'].includes(status)) return styles.cancelled;
    return styles.pending;
  };

  return (
    <div className={styles.dashboard}>
      <div className={styles.headerTitle}>
        <div>
          <span className={styles.kicker}>Customer flow</span>
          <h2>Users</h2>
        </div>
      </div>

      <div className={styles.cardsRow}>
        <div className={`${styles.cardSmall} ${styles.cardPink}`}>
          <div className={styles.cardLabel}>Total users</div>
          <div className={styles.cardValue}>{stats?.users ?? users.length}</div>
        </div>
        <div className={`${styles.cardSmall} ${styles.cardPeach}`}>
          <div className={styles.cardLabel}>Active users</div>
          <div className={styles.cardValue}>{activeUsers}</div>
        </div>
        <div className={`${styles.cardSmall} ${styles.cardMint}`}>
          <div className={styles.cardLabel}>Paid amount</div>
          <div className={styles.cardValue}>₹{users.reduce((sum, user) => sum + Number(user.paid_amount ?? 0), 0).toFixed(2)}</div>
        </div>
        <div className={`${styles.cardSmall} ${styles.cardBlue}`}>
          <div className={styles.cardLabel}>Unpaid amount</div>
          <div className={styles.cardValue}>₹{users.reduce((sum, user) => sum + Number(user.unpaid_amount ?? 0), 0).toFixed(2)}</div>
        </div>
      </div>

      <div className={styles.toolbar}>
        <input
          className={styles.search}
          placeholder="Search user, email or phone"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All statuses</option>
          <option value="active">Active</option>
          <option value="new">New</option>
        </select>
      </div>

      <div className={styles.spaced}>
        {filteredUsers.length === 0 ? (
          <div className={styles.empty}><em>No users found</em></div>
        ) : (
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead className={styles.thead}>
                <tr>
                  <th>User</th>
                  <th>Contact</th>
                  <th>Orders</th>
                  <th>Paid</th>
                  <th>Unpaid</th>
             
                  <th>Last order</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className={styles.row}>
                    <td className={styles.cell} data-label="User">
                      <div className={styles.personCell}>
                        <span className={styles.personName}>{user.full_name || 'Unnamed user'}</span>
                        <small>{user.id}</small>
                      </div>
                    </td>

                    <td className={styles.cell} data-label="Contact">
                      <div className={styles.contactCell}>
                        <span>{user.email || 'No email'}</span>
                        <span className={styles.phoneText}>{user.phone || 'No phone'}</span>
                        {user.phone ? (
                          <a href={`tel:${user.phone.replace(/\s+/g, '')}`} className={styles.callButton}>Call</a>
                        ) : null}
                      </div>
                    </td>

                    <td className={styles.cell} data-label="Orders">
                      <div className={styles.amountWrap}>
                        <strong>{Number(user.orders_count ?? 0)}</strong>
                        <small className={styles.metaText}>orders</small>
                      </div>
                    </td>

                    <td className={styles.cell} data-label="Paid">
                      <div className={styles.amountWrap}>
                        <strong>₹{Number(user.paid_amount ?? 0).toFixed(2)}</strong>
                        <small className={styles.metaText}>paid</small>
                      </div>
                    </td>

                    <td className={styles.cell} data-label="Unpaid">
                      <div className={styles.amountWrap}>
                        <strong>₹{Number(user.unpaid_amount ?? 0).toFixed(2)}</strong>
                        <small className={styles.metaText}>due</small>
                      </div>
                    </td>

                 

                    <td className={styles.cell} data-label="Last order">
                      {user.last_order_date ? new Date(user.last_order_date).toLocaleString() : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
