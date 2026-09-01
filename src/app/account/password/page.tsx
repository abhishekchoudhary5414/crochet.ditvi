"use client";
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import Button from '@/components/Button/Button';
import supabase from '@/lib/supabaseClient';
import styles from '../profile/profile.module.css';
import { useApp } from '@/context/AppContext';

export default function ChangePasswordPage() {
  const { register, handleSubmit } = useForm();
  const [auth, setAuth] = useState<boolean | null>(null);
  const { addToast } = useApp();

  useEffect(() => {
    (async () => {
      const s = await supabase.auth.getSession();
      const token = s?.data?.session?.access_token;
      setAuth(!!token);
    })();
  }, []);

  const onSubmit = async (data: any) => {
    if (!auth) return addToast('Not authenticated', 'error');
    // call server reset-password endpoint (not fully implemented server-side yet)
    const res = await fetch('/api/auth/reset-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: '', email: '', newPassword: data.new }) });
    const json = await res.json();
    if (!res.ok) return addToast(json?.error || json?.message || 'Password update failed', 'error');
    addToast('Password updated', 'success');
  };

  if (auth === null) return <div className={styles.page}><div className={styles.card}>Checking authentication...</div></div>;

  if (!auth) {
    return (
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.prompt}>
            <h3>Please sign in to change your password</h3>
            <p>For security, you must be signed in to update your password.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}><h2 className={styles.title}>Change Password</h2></div>
      <div className={styles.card}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{ display: 'grid', gap: 12 }}>
            <label>Current Password</label>
            <input className={styles.input} type="password" {...register('current')} />

            <label>New Password</label>
            <input className={styles.input} type="password" {...register('new')} />

            <label>Confirm New Password</label>
            <input className={styles.input} type="password" {...register('confirm')} />

            <div style={{ marginTop: 12 }}>
              <Button type="submit" variant="primary">Update Password</Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
