"use client";

import React, { useState, useEffect } from 'react';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import supabase from '@/lib/supabaseClient';
import Button from '@/components/Button/Button';
import styles from '@/app/auth.module.css';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

const schema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" })
});

export default function LoginPage() {
  const router = useRouter();
  const [redirectUrl, setRedirectUrl] = useState('/cart');

  useEffect(() => {
    try {
      const sp = new URLSearchParams(window.location.search);
      const r = sp.get('redirect');
      if (r) setRedirectUrl(r);
    } catch (e) {
      // ignore in non-browser environments
    }
  }, []);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shimmerStyle = {
    background: 'linear-gradient(90deg, #f1f1f1 25%, #e9e9e9 50%, #f1f1f1 75%)',
    backgroundSize: '200% 100%',
    animation: 'login-shimmer 1.4s ease infinite',
    borderRadius: 8,
  } as const;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    
    const result = schema.safeParse({ email, password });
    if (!result.success) {
      const err: Record<string, string> = {};
      result.error.errors.forEach((zerr) => { err[zerr.path[0] as string] = zerr.message; });
      setErrors(err);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await supabase.auth.signInWithPassword({ email, password });
      if (res.error) throw res.error;
      
      // Successfully logged in
      router.push(redirectUrl);
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed. Please check your credentials.';
      setErrors({ form: message });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitting) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.container}>
          <div className={styles.leftPane}>
            <div style={{ width: 110, height: 26, ...shimmerStyle, marginBottom: 20 }} />
            <div style={{ width: '85%', height: 26, ...shimmerStyle, marginBottom: 12 }} />
            <div style={{ width: '72%', height: 16, ...shimmerStyle, marginBottom: 8 }} />
            <div style={{ width: '90%', height: 16, ...shimmerStyle }} />
          </div>

          <div className={styles.rightPane}>
            <div className={styles.formHeader}>
              <div style={{ width: 80, height: 16, ...shimmerStyle, marginBottom: 10 }} />
              <div style={{ width: 110, height: 30, ...shimmerStyle }} />
            </div>

            <div className={styles.form}>
              <div className={styles.inputGroup}>
                <div style={{ width: 120, height: 16, ...shimmerStyle, marginBottom: 10 }} />
                <div style={{ width: '100%', height: 48, ...shimmerStyle }} />
              </div>

              <div className={styles.inputGroup}>
                <div style={{ width: 120, height: 16, ...shimmerStyle, marginBottom: 10 }} />
                <div style={{ width: '100%', height: 48, ...shimmerStyle }} />
              </div>

              <div style={{ width: '100%', height: 50, ...shimmerStyle, marginTop: 8 }} />
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes login-shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container}>
        <div className={styles.leftPane}>
          <span className={styles.brandBadge}>Member access</span>
          <h2>Welcome back!</h2>
          <p>Login to access your orders, track shipments, and manage your profile with ease.</p>
        </div>

        <div className={styles.rightPane}>
          <div className={styles.formHeader}>
            <p className={styles.kicker}>Sign in</p>
            <h1>Login</h1>
          </div>

          <form onSubmit={onSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label>Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
              {errors.email && <small className={styles.error}>{errors.email}</small>}
            </div>

            <div className={styles.inputGroup}>
              <label>Password</label>
              <div className={styles.passwordField}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
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
              {errors.password && <small className={styles.error}>{errors.password}</small>}
            </div>

            {errors.form && <small className={styles.error}>{errors.form}</small>}

            <Button type="submit" variant="primary" disabled={isSubmitting} size="lg" style={{ marginTop: 8 }}>
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>

            <div className={styles.links}>
              <Link href="/forgot-password" className={styles.link}>
                Forgot Password?
              </Link>
              <Link href="/signup" className={styles.link}>
                New here? Create Account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
