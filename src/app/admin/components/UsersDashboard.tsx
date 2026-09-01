"use client";
import React, { useEffect, useState } from 'react';
import styles from './UsersDashboard.module.css';

type User = { id: string; full_name?: string; email?: string; created_at?: string };

export default function UsersDashboard() {
  const [users, setUsers] = useState<User[] | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/admin/users', { credentials: 'same-origin' });
        if (res.status === 401 || res.status === 403) {
          window.location.href = '/admin/login';
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
  }, []);

  return (
    <div>
      <h2>Users</h2>
      <div style={{ marginTop: 12 }}>
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
