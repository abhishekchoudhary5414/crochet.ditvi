"use client";
import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import styles from './AdminNavbar.module.css';

type Props = {
  view?: string;
  setView?: (v: 'overview' | 'orders' | 'users' | 'payments') => void;
};

export default function AdminNavbar({ view, setView }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  // derive active view from pathname when available
  const activeView = React.useMemo(() => {
    if (typeof pathname === 'string') {
      if (pathname.startsWith('/admin/orders')) return 'orders';
      if (pathname.startsWith('/admin/users')) return 'users';
      if (pathname.startsWith('/admin/payments')) return 'payments';
      return 'overview';
    }
    return (view as any) || 'overview';
  }, [pathname, view]);

  const setViewHandler = (v: 'overview'|'orders'|'users'|'payments') => {
    if (setView) {
      setView(v);
      return;
    }
    // navigate to the corresponding admin route so content updates
    switch (v) {
      case 'orders':
        router.push('/admin/orders');
        break;
      case 'users':
        router.push('/admin/users');
        break;
      case 'payments':
        router.push('/admin/payments');
        break;
      default:
        router.push('/admin');
    }
  };

  const [open, setOpen] = React.useState<boolean>(true);

  React.useEffect(() => {
    // toggle body class so layout can respond to sidebar visibility
    try {
      if (open) {
        document.body.classList.remove('admin-sidebar-closed');
      } else {
        document.body.classList.add('admin-sidebar-closed');
      }
    } catch (e) {
      // ignore (server-side or restricted env)
    }
    return () => {};
  }, [open]);

  return (
    <>
      {!open && (
        <button
          className={styles.openButton}
          onClick={() => setOpen(true)}
          aria-label="Open sidebar"
        >
          <span className={styles.hamburgerIcon} />
        </button>
      )}

      <nav className={`${styles.nav} ${!open ? styles.navClosed : ''}`}>
        <div className={styles.topRow}>
          <h3 className={styles.brandTitle}>Admin</h3>
          <button className={styles.closeBtn} onClick={() => setOpen(false)} aria-label="Close sidebar">×</button>
        </div>
      <div>
        <h3 className={styles.brandTitle}>Admin</h3>
      </div>

      <button className={`${styles.btn} ${activeView === 'overview' ? styles.btnActive : ''}`} onClick={() => setViewHandler('overview')}>Dashboard</button>
      <button className={`${styles.btn} ${activeView === 'orders' ? styles.btnActive : ''}`} onClick={() => setViewHandler('orders')}>Orders</button>
      <button className={`${styles.btn} ${activeView === 'users' ? styles.btnActive : ''}`} onClick={() => setViewHandler('users')}>Users</button>
      <button className={`${styles.btn} ${activeView === 'payments' ? styles.btnActive : ''}`} onClick={() => setViewHandler('payments')}>Payments</button>

      <div className={styles.logoutWrap}>
        <button
          className={styles.logoutBtn}
          onClick={async () => {
            await fetch('/api/admin/logout', { method: 'POST' });
            router.push('/');
          }}
        >
          Logout
        </button>
      </div>
      </nav>
    </>
  );
}
