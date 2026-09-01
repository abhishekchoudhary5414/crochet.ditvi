"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './UsersDashboard.module.css';

type User = { id: string; full_name?: string; email?: string; created_at?: string };

export default function UsersDashboard() {
  const [users, setUsers] = useState<User[] | null>(null);
  const [stats, setStats] = useState<{ orders?: number; users?: number; revenue?: number } | null>(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    (async () => {
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
      }
    })();
    return () => { mounted = false; };
  }, [router]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/admin/stats', { credentials: 'same-origin' });
        if (!res.ok) return;
        const d = await res.json();
        if (mounted) setStats(d);
      } catch (e) {
        console.error('load stats', e);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div>
      <h2>Users</h2>
      <div className={styles.cardsRow}>
        <div className={styles.cardSmall}><div className={styles.cardLabel}>Users</div><div className={styles.cardValue}>{stats?.users ?? '-'}</div></div>
        <div className={styles.cardSmall}><div className={styles.cardLabel}>Orders</div><div className={styles.cardValue}>{stats?.orders ?? '-'}</div></div>
        <div className={styles.cardSmall}><div className={styles.cardLabel}>Revenue</div><div className={styles.cardValue}>₹{Number(stats?.revenue ?? 0).toFixed(2)}</div></div>
      </div>
      <div className={styles.spaced}>
        {users === null ? (
          <div>Loading...</div>
        ) : users.length === 0 ? (
          <div className={styles.empty}><em>No users yet</em></div>
        ) : (
          <table className={styles.table}>
            <thead className={styles.thead}>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className={styles.row}>
                  <td className={styles.cell}>{u.full_name ?? '—'}</td>
                  <td className={styles.cell}>{u.email ?? '-'}</td>
                  <td className={styles.cell}>{u.created_at ? new Date(u.created_at).toLocaleString() : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
