"use client";
import React from 'react';
import { useRouter } from 'next/navigation';

type Props = {
  view: string;
  setView: (v: 'overview' | 'orders' | 'users' | 'payments') => void;
};

export default function AdminNavbar({ view, setView }: Props) {
  const router = useRouter();

  return (
    <nav style={{ width: 220, background: 'var(--surface)', borderRight: '1px solid #eee', padding: 16, display: 'flex', flexDirection: 'column' }}>
      <div>
        <h3 style={{ margin: '6px 0 12px' }}>Admin</h3>
      </div>

      <button style={buttonStyle(view === 'overview')} onClick={() => setView('overview')}>Dashboard</button>
      <button style={buttonStyle(view === 'orders')} onClick={() => setView('orders')}>Orders</button>
      <button style={buttonStyle(view === 'users')} onClick={() => setView('users')}>Users</button>
      <button style={buttonStyle(view === 'payments')} onClick={() => setView('payments')}>Payments</button>

      <div style={{ marginTop: 'auto' }}>
        <button
          style={{ ...baseButton, background: 'transparent', color: 'var(--primary)', border: '1px solid rgba(0,0,0,0.06)' }}
          onClick={async () => {
            await fetch('/api/admin/logout', { method: 'POST' });
            router.push('/');
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

const baseButton: React.CSSProperties = {
  display: 'block',
  width: '100%',
  padding: '10px 12px',
  marginBottom: 8,
  textAlign: 'left',
  borderRadius: 6,
  border: 'none',
  cursor: 'pointer',
};

const buttonStyle = (active: boolean): React.CSSProperties => ({
  ...baseButton,
  background: active ? 'var(--primary)' : 'transparent',
  color: active ? '#fff' : 'var(--dark-text)'
});
