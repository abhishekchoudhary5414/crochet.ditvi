"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import PersonIcon from '@mui/icons-material/Person';
import FolderIcon from '@mui/icons-material/Folder';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import supabase from '@/lib/supabaseClient';
import styles from './account.module.css';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [profile, setProfile] = useState<{ full_name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      
      const { data } = await supabase.from('profiles').select('full_name, email').eq('user_id', session.user.id).single();
      if (data) {
        setProfile(data);
      } else {
        setProfile({ full_name: 'User', email: session.user.email || '' });
      }
      setLoading(false);
    }
    loadUser();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  const initial = profile?.full_name ? profile.full_name.charAt(0) : (profile?.email ? profile.email.charAt(0) : 'U');

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.layout}>
          <aside className={styles.sidebar}>
            <div className={styles.loadingUserCard}>
              <div className={`${styles.skeleton} ${styles.loadingAvatar}`} />
              <div className={styles.loadingUserText}>
                <div className={`${styles.skeleton} ${styles.loadingBlock}`} style={{ width: '30%', height: 12 }} />
                <div className={`${styles.skeleton} ${styles.loadingBlock}`} style={{ width: '75%', height: 18 }} />
              </div>
            </div>

            <div className={styles.loadingNavCard}>
              <div className={styles.loadingNavSection}>
                <div className={`${styles.skeleton} ${styles.loadingNavHeader}`} />
                <div className={`${styles.skeleton} ${styles.loadingNavItem}`} />
              </div>
              <div className={styles.loadingNavSection}>
                <div className={`${styles.skeleton} ${styles.loadingNavHeader}`} />
                <div className={`${styles.skeleton} ${styles.loadingNavItem}`} />
                <div className={`${styles.skeleton} ${styles.loadingNavItem}`} />
              </div>
            </div>
          </aside>

          <main className={styles.loadingMainContent}>
            <div className={`${styles.skeleton} ${styles.loadingTile}`} />
            <div className={`${styles.skeleton} ${styles.loadingBlock}`} />
            <div className={`${styles.skeleton} ${styles.loadingBlock}`} />
            <div className={`${styles.skeleton} ${styles.loadingBlock}`} style={{ width: '80%' }} />
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.layout}>
        {/* Sidebar */}
        <aside className={styles.sidebar}>
          {/* User Info Card */}
          <div className={styles.userCard}>
            <div className={styles.avatar}>{initial}</div>
            <div className={styles.userInfo}>
              <span className={styles.userGreeting}>Hello,</span>
              <span className={styles.userName}>{profile?.full_name || 'Customer'}</span>
            </div>
          </div>

          {/* Navigation Card */}
          <div className={styles.navCard}>
            
            <div className={styles.navSection}>
              <div className={styles.navHeader}>
                <FolderIcon className={styles.navIcon} fontSize="small" />
                <span>My Orders</span>
              </div>
              <ul className={styles.navList}>
                <li>
                  <Link 
                    href="/account/orders" 
                    className={`${styles.navItem} ${pathname?.startsWith('/account/orders') ? styles.activeNavItem : ''}`}
                  >
                    View All Orders
                  </Link>
                </li>
              </ul>
            </div>

            <div className={styles.navSection}>
              <div className={styles.navHeader}>
                <PersonIcon className={styles.navIcon} fontSize="small" />
                <span>Account Settings</span>
              </div>
              <ul className={styles.navList}>
                <li>
                  <Link 
                    href="/account/profile" 
                    className={`${styles.navItem} ${pathname === '/account/profile' ? styles.activeNavItem : ''}`}
                  >
                    Profile Information
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/account/addresses" 
                    className={`${styles.navItem} ${pathname === '/account/addresses' ? styles.activeNavItem : ''}`}
                  >
                    Manage Addresses
                  </Link>
                </li>
              </ul>
            </div>

            <div className={styles.navSection}>
              <button onClick={handleLogout} className={styles.navItem} style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '16px', color: '#878787', fontWeight: 500 }}>
                <PowerSettingsNewIcon fontSize="small" />
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className={styles.mainContent}>
          {children}
        </main>
      </div>
    </div>
  );
}
