"use client";

import React, { useEffect, useState } from 'react';
import supabase from '@/lib/supabaseClient';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const s = await supabase.auth.getSession();
      const token = s?.data?.session?.access_token;
      if (!token) return;
      
      const res = await fetch('/api/admin/users', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={{ padding: 24 }}>Loading users...</div>;

  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 600, color: '#1c2434', marginBottom: 24 }}>Registered Users</h2>
      <div style={{ background: '#fff', borderRadius: 8, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ background: '#f8f9fa', borderBottom: '1px solid #e9ecef' }}>
              <th style={{ padding: '16px 24px', fontWeight: 600, color: '#495057' }}>Name</th>
              <th style={{ padding: '16px 24px', fontWeight: 600, color: '#495057' }}>Email</th>
              <th style={{ padding: '16px 24px', fontWeight: 600, color: '#495057' }}>Phone</th>
              <th style={{ padding: '16px 24px', fontWeight: 600, color: '#495057' }}>Joined</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                <td style={{ padding: '16px 24px', color: '#212529' }}>{u.full_name || '—'}</td>
                <td style={{ padding: '16px 24px', color: '#212529' }}>{u.email}</td>
                <td style={{ padding: '16px 24px', color: '#212529' }}>{u.phone || '—'}</td>
                <td style={{ padding: '16px 24px', color: '#6c757d', fontSize: 14 }}>{new Date(u.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: '32px', textAlign: 'center', color: '#6c757d' }}>No users found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
