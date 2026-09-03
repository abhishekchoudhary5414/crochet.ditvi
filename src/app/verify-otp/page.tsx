"use client";

import React, { useState } from 'react';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button/Button';
import styles from '@/app/auth.module.css';
import { useApp } from '@/context/AppContext';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

const schema = z
  .object({
    email: z.string().email({ message: 'Invalid email' }),
    otp: z.string().length(6, { message: 'OTP must be 6 digits' }),
    fullName: z.string().min(2, { message: 'Full name is required' }),
    phone: z.string().min(10, { message: 'Valid phone number is required' }),
    password: z.string().min(8, { message: 'Password must be at least 8 characters' }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export default function VerifyOtpPage() {
  const router = useRouter();
  const { addToast } = useApp();
  const [formData, setFormData] = useState(() => {
    let initialEmail = '';
    try {
      const pending = typeof window !== 'undefined' ? sessionStorage.getItem('pendingSignup') : null;
      if (pending) {
        const parsed = JSON.parse(pending) as { email?: string };
        initialEmail = parsed.email || '';
      }
    } catch {
      initialEmail = '';
    }

    return {
      email: initialEmail,
      otp: '',
      fullName: '',
      phone: '',
      password: '',
      confirmPassword: '',
    };
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const shimmerStyle = {
    background: 'linear-gradient(90deg, #f1f1f1 25%, #e9e9e9 50%, #f1f1f1 75%)',
    backgroundSize: '200% 100%',
    animation: 'otp-shimmer 1.4s ease infinite',
    borderRadius: 8,
  } as const;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});

    const result = schema.safeParse(formData);
    if (!result.success) {
      const err: Record<string, string> = {};
      result.error.errors.forEach((zerr) => {
        const key = String(zerr.path[0] ?? 'form');
        err[key] = zerr.message;
      });
      setErrors(err);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        const message = data?.error === 'already registered' ? 'Already registered' : (data?.error || 'Verification failed');
        addToast(message, 'warning');
        setErrors({ form: message });
        return;
      }

      try {
        sessionStorage.removeItem('pendingSignup');
      } catch {
        // no-op
      }

      const supabase = (await import('@/lib/supabaseClient')).default;
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) {
        throw signInError;
      }

      addToast('Account created successfully.', 'success');
      router.push('/cart');
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Verification failed. Please try again.';
      addToast(message, 'error');
      setErrors({ form: message });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isSubmitting) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.container} style={{ maxWidth: '760px' }}>
          <div className={styles.leftPane}>
            <div style={{ width: 120, height: 28, ...shimmerStyle, marginBottom: 18 }} />
            <div style={{ width: '75%', height: 26, ...shimmerStyle, marginBottom: 12 }} />
            <div style={{ width: '90%', height: 14, ...shimmerStyle, marginBottom: 8 }} />
            <div style={{ width: '70%', height: 14, ...shimmerStyle }} />
          </div>

          <div className={styles.rightPane}>
            <div className={styles.formHeader}>
              <div style={{ width: 80, height: 16, ...shimmerStyle, marginBottom: 10 }} />
              <div style={{ width: 180, height: 30, ...shimmerStyle }} />
            </div>

            <div className={styles.form}>
              <div className={styles.inputGrid}>
                {[1, 2, 3, 4, 5, 6].map((item) => (
                  <div key={item} className={styles.inputGroup}>
                    <div style={{ width: 120, height: 16, ...shimmerStyle, marginBottom: 10 }} />
                    <div style={{ width: '100%', height: 48, ...shimmerStyle }} />
                  </div>
                ))}
              </div>

              <div style={{ width: '100%', height: 52, ...shimmerStyle, marginTop: 8 }} />
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes otp-shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container} style={{ maxWidth: '760px' }}>
        <div className={styles.leftPane}>
          <span className={styles.brandBadge}>Secure signup</span>
          <h2>Verify your account</h2>
          <p>
            We have sent a one-time password to your email. Enter the code, set your password, and finish your profile.
          </p>
        </div>

        <div className={styles.rightPane}>
          <div className={styles.formHeader}>
            <p className={styles.kicker}>Almost there</p>
            <h1>Complete verification</h1>
          </div>

          <form onSubmit={onSubmit} className={styles.form}>
            <div className={styles.inputGrid}>
              <div className={styles.inputGroup}>
                <label>Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} readOnly />
                {errors.email && <small className={styles.error}>{errors.email}</small>}
              </div>

              <div className={styles.inputGroup}>
                <label>Full Name</label>
                <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Your full name" />
                {errors.fullName && <small className={styles.error}>{errors.fullName}</small>}
              </div>

              <div className={styles.inputGroup}>
                <label>Mobile Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91 9876543210" />
                {errors.phone && <small className={styles.error}>{errors.phone}</small>}
              </div>

              <div className={styles.inputGroup}>
                <label>OTP (6-digit)</label>
                <input type="text" name="otp" value={formData.otp} onChange={handleInputChange} placeholder="123456" maxLength={6} />
                {errors.otp && <small className={styles.error}>{errors.otp}</small>}
              </div>

              <div className={styles.inputGroup}>
                <label>Password</label>
                <div className={styles.passwordField}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Create password"
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
                  </button>
                </div>
                {errors.password && <small className={styles.error}>{errors.password}</small>}
              </div>

              <div className={styles.inputGroup}>
                <label>Confirm Password</label>
                <div className={styles.passwordField}>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Re-enter password"
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                  >
                    {showConfirmPassword ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
                  </button>
                </div>
                {errors.confirmPassword && <small className={styles.error}>{errors.confirmPassword}</small>}
              </div>
            </div>

            {errors.form && <small className={styles.error}>{errors.form}</small>}

            <Button type="submit" variant="primary" disabled={isSubmitting} size="lg" style={{ marginTop: 8 }}>
              {isSubmitting ? 'Verifying...' : 'Verify & Continue'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
