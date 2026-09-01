"use client";

import React, { useEffect, useState } from 'react';
import styles from './layout.module.css';
import AdminNavbar from './components/AdminNavbar';
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
    return <div className={styles.minFull}>{children}</div>;
  }
  if (isAdmin === null) return <div className={styles.checking}>Checking admin access...</div>;

  // navItems removed; no sidebar in admin layout

  return (
      <>
        <AdminNavbar />
        <main className={styles.main}>
          <div className={styles.content}>{children}</div>
        </main>
      </>
  );
}
