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
  const [redirectUrl, setRedirectUrl] = useState('/account/profile');

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
