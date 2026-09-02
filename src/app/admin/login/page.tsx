"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/Button/Button';
import styles from './login.module.css';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { useRouter } from 'next/navigation';
export default function AdminLoginPage() {
  const router = useRouter();
  // router not needed because we perform a full navigation after login
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Invalid credentials');

      // navigate to admin overview after successful login
      router.push('/admin');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Admin login failed';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.leftPane}>
          <div className={styles.glowOne} />
          <div className={styles.glowTwo} />

          <div className={styles.brandRow}>
            <div className={styles.brandMark}>DC</div>
            <span>Ditvi Crochet</span>
          </div>

          <div className={styles.heroContent}>
            <span className={styles.kicker}>Secure admin access</span>
            <h2>Run your boutique from one elegant dashboard.</h2>
            <p>
              Manage orders, customer accounts, payments, and daily store activity with complete
              confidence.
            </p>
          </div>

          <ul className={styles.featureList}>
            <li>
              <span className={styles.featureDot} />
              Track inventory and sales in real time
            </li>
            <li>
              <span className={styles.featureDot} />
              Review customer orders and fulfilment updates
            </li>
            <li>
              <span className={styles.featureDot} />
              Monitor store performance and account activity
            </li>
          </ul>
        </div>

        <div className={styles.rightPane}>
          <div className={styles.formHeader}>
            <span className={styles.eyebrow}>Admin portal</span>
            <h1>Welcome back</h1>
            <p>Sign in to access your control center.</p>
          </div>

          <form onSubmit={onSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="admin-username">Username</label>
              <input
                id="admin-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                autoComplete="username"
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="admin-password">Password</label>
              <div className={styles.passwordField}>
                <input
                  id="admin-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
                </button>
              </div>
            </div>

            {error && <small className={styles.error}>{error}</small>}

            <Button type="submit" variant="primary" disabled={isSubmitting} size="lg" fullWidth className={styles.submitButton}>
              {isSubmitting ? 'Signing in...' : 'Login as Admin'}
            </Button>

            <div className={styles.links}>
              <Link href="/login" className={styles.link}>Customer login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
