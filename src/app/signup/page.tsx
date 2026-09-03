"use client";

import React, { useState } from 'react';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/Button/Button';
import styles from '@/app/auth.module.css';
import { useApp } from '@/context/AppContext';

const schema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

export default function SignupPage() {
  const router = useRouter();
  const { addToast } = useApp();
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const shimmerStyle = {
    background: 'linear-gradient(90deg, #f1f1f1 25%, #e9e9e9 50%, #f1f1f1 75%)',
    backgroundSize: '200% 100%',
    animation: 'signup-shimmer 1.4s ease infinite',
    borderRadius: 8,
  } as const;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    
    const result = schema.safeParse({ email });
    if (!result.success) {
      const err: Record<string, string> = {};
      result.error.errors.forEach((zerr) => { err[zerr.path[0] as string] = zerr.message; });
      setErrors(err);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      if (!res.ok) {
        const message = data?.error === 'already registered' ? 'Already registered' : (data?.error || 'Failed to send OTP');
        addToast(message, 'warning');
        setErrors({ form: message });
        return;
      }

      // Save email in session to pre-fill the verify-otp page
      try { sessionStorage.setItem('pendingSignup', JSON.stringify({ email })); } catch (e) {}
      
      router.push('/verify-otp');
    } catch (err: any) {
      const message = err?.message || 'Signup failed. Please try again.';
      addToast(message, 'error');
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
            <div style={{ width: '75%', height: 26, ...shimmerStyle, marginBottom: 18 }} />
            <div style={{ width: '90%', height: 16, ...shimmerStyle, marginBottom: 10 }} />
            <div style={{ width: '80%', height: 16, ...shimmerStyle }} />
          </div>

          <div className={styles.rightPane}>
            <div style={{ width: 160, height: 28, ...shimmerStyle, marginBottom: 18 }} />

            <div className={styles.form}>
              <div className={styles.inputGroup}>
                <div style={{ width: 120, height: 16, ...shimmerStyle, marginBottom: 10 }} />
                <div style={{ width: '100%', height: 48, ...shimmerStyle }} />
              </div>

              <div style={{ width: '100%', height: 50, ...shimmerStyle, marginTop: 8 }} />
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes signup-shimmer {
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
          <h2>Looks like you're new here!</h2>
          <p>Sign up with your email to get started. We'll send you an OTP to verify your account.</p>
        </div>
        <div className={styles.rightPane}>
          <h1>Create Account</h1>
          
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

            {errors.form && <small className={styles.error}>{errors.form}</small>}

            <Button type="submit" variant="primary" disabled={isSubmitting} size="lg" style={{ marginTop: 12 }}>
              {isSubmitting ? 'Sending OTP...' : 'Continue'}
            </Button>

            <div className={styles.links}>
              <span>Already have an account?</span>
              <Link href="/login" className={styles.link}>
                Login instead
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
