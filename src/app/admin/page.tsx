"use client";

import React, { useState } from 'react';
// Link removed; admin shell handles navigation
import AdminLoginPage from './login/page';
import AdminShell from './components/AdminShell';

export default function AdminOverviewPage() {
  const [hasSession] = useState<boolean>(() => {
    try {
      return typeof document !== 'undefined' && document.cookie.includes('ditvi_admin_session=');
    } catch {
      return false;
    }
  });

  // cards intentionally removed; AdminShell provides navigation UI

  if (hasSession === null) return <div style={{ padding: 24 }}>Checking admin session...</div>;
  if (!hasSession) return <AdminLoginPage />;

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', fontWeight: 700 }}>Dashboard</div>
        <h2 style={{ fontSize: 32, color: 'var(--dark-text)', marginTop: 6, marginBottom: 8 }}>Overview</h2>
      </div>

      <AdminShell />
    </div>
  );
}
