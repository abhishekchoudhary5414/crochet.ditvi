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
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const activeView = React.useMemo(() => {
    if (typeof pathname === 'string') {
      if (pathname.startsWith('/admin/orders')) return 'orders';
      if (pathname.startsWith('/admin/users')) return 'users';
      if (pathname.startsWith('/admin/payments')) return 'payments';
      return 'overview';
    }
    return (view as any) || 'overview';
  }, [pathname, view]);

  const setViewHandler = (v: 'overview' | 'orders' | 'users' | 'payments') => {
    if (setView) {
      setView(v);
      setMobileOpen(false);
      return;
    }

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

    setMobileOpen(false);
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/');
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.navInner}>
        <div className={styles.brandWrap}>
          <div className={styles.brandMark}>DC</div>
          <div>
            <div className={styles.brandTitle}>Ditvi Admin</div>
            <span className={styles.brandSubtitle}>Control center</span>
          </div>
        </div>

        <button
          type="button"
          className={styles.mobileToggle}
          onClick={() => setMobileOpen((value) => !value)}
          aria-label="Toggle admin menu"
        >
          <span className={styles.hamburgerIcon} />
        </button>

        <div className={`${styles.menu} ${mobileOpen ? styles.menuOpen : ''}`}>
          <button className={`${styles.btn} ${activeView === 'overview' ? styles.btnActive : ''}`} onClick={() => setViewHandler('overview')}>
            Dashboard
          </button>
          <button className={`${styles.btn} ${activeView === 'orders' ? styles.btnActive : ''}`} onClick={() => setViewHandler('orders')}>
            Orders
          </button>
          <button className={`${styles.btn} ${activeView === 'users' ? styles.btnActive : ''}`} onClick={() => setViewHandler('users')}>
            Users
          </button>
          <button className={`${styles.btn} ${activeView === 'payments' ? styles.btnActive : ''}`} onClick={() => setViewHandler('payments')}>
            Payments
          </button>

          <button className={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
