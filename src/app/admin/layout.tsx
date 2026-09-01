"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
// Link intentionally removed; admin layout no longer renders sidebar
import supabase from '@/lib/supabaseClient';
// Icon imports removed; admin layout no longer renders a sidebar

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);


  useEffect(() => {
    (async () => {
      // If a cookie-based admin session exists, trust it
      try {
        const hasCookie = typeof document !== 'undefined' && document.cookie.includes('ditvi_admin_session=');
        if (hasCookie) {
          setIsAdmin(true);
          return;
        }
      } catch {
        // ignore cookie read errors
      }

      const s = await supabase.auth.getSession();
      const token = s?.data?.session?.access_token;
      if (!token) {
        setIsAdmin(false);
        return;
      }

      try {
        const res = await fetch('/api/admin/check', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          credentials: 'same-origin',
        });
        if (res.ok) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (e) {
        console.error('admin check failed', e);
        setIsAdmin(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (isAdmin === false) {
      // redirect to dedicated admin login page
      router.push('/admin/login');
    }
  }, [isAdmin, router]);
  // Do not render parent admin sidebar for the dedicated login page.
  if (typeof pathname === 'string' && (pathname === '/admin/login' || pathname.startsWith('/admin/login'))) {
    return <div style={{ minHeight: '100vh' }}>{children}</div>;
  }
  if (isAdmin === null) return <div style={{ padding: 40, textAlign: 'center', color: 'var(--dark-text)' }}>Checking admin access...</div>;

  // navItems removed; no sidebar in admin layout

  return (

      <main style={{ flex: 1, padding: 32, overflowY: 'auto' }}>
        <div style={{  margin: '0' }}>{children}</div>
      </main>
  );
}
