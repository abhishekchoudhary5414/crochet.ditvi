"use client";

import React, { useEffect, useState } from 'react';
import supabase from '@/lib/supabaseClient';
import styles from '../profile/profile.module.css';
import Link from 'next/link';

export default function WishlistPage() {
  const [items, setItems] = useState<any[]>([]);
  const [auth, setAuth] = useState<boolean | null>(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    (async () => {
      const s = await supabase.auth.getSession();
      const token = s?.data?.session?.access_token;
      if (!token) { setAuth(false); return; }
      setAuth(true);
      try {
        const res = await fetch('/api/account/wishlist', { headers: { Authorization: `Bearer ${token}` } });
        if (res.ok) {
          const j = await res.json();
          setItems(j.items || []);
        } else {
          setItems([]);
        }
      } catch (e) {
        setItems([]);
      }
    })();
  }, []);

  if (auth === null) return <div className={styles.page}><div className={styles.card}>Checking authentication...</div></div>;

  if (!auth) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.prompt}>
            <h3>Please sign in to view your wishlist</h3>
            <p>Your saved favorites will appear here after you log in.</p>
            <div className={styles.actions}>
              <Link href="/login">Login</Link>
              <Link href="/signup">Create Account</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}><h2 className={styles.title}>Wishlist</h2></div>
      <div className={styles.grid}>
        <div className={styles.left}>
          <div className={styles.card}>
            {items.length === 0 ? (
              <p>Your wishlist is empty.</p>
            ) : (
              items.map((it) => (
                <div key={it.id} style={{ padding: 10, borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong>{it.product_name || it.id}</strong>
                    <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>{it.product_meta || ''}</div>
                  </div>
                  <div>
                    <button style={{ background: 'transparent', border: 'none', color: 'var(--accent)', cursor: 'pointer' }} onClick={async () => {
                      try {
                        const s = await supabase.auth.getSession();
                        const token = s?.data?.session?.access_token;
                        const res = await fetch('/api/account/wishlist', { method: 'DELETE', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ productId: it.product_id || it.productId || it.id }) });
                        if (res.ok) setItems((prev) => prev.filter((x) => x.id !== it.id));
                      } catch (e) {}
                    }}>Remove</button>
                  </div>
                </div>
              ))
            )}

            <div style={{ marginTop: 12 }}>
              <form onSubmit={async (e) => {
                e.preventDefault();
                const fv = new FormData(e.currentTarget as HTMLFormElement);
                  const productId = fv.get('productId')?.toString();
                if (!productId) return;
                setAdding(true);
                try {
                  const s = await supabase.auth.getSession();
                  const token = s?.data?.session?.access_token;
                  const res = await fetch('/api/account/wishlist', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify({ productId }) });
                  if (res.ok) {
                    const j = await res.json();
                    setItems((prev) => [...prev, j.item]);
                  }
                } catch (e) {
                } finally { setAdding(false); }
              }}>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input name="productId" placeholder="Product ID to add (dev)" className={styles.input} />
                  <button type="submit" className="btn" style={{ padding: '8px 12px', borderRadius: 8, border: 'none', background: 'var(--accent)', color: '#fff' }}>{adding ? 'Adding...' : 'Add'}</button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.card}>
            <h4 style={{ marginBottom: 8 }}>Quick Links</h4>
            <ul style={{ paddingLeft: 18 }}>
              <li><Link href="/account/profile">Profile</Link></li>
              <li><Link href="/account/addresses">Manage Addresses</Link></li>
              <li><Link href="/account/orders">My Orders</Link></li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
