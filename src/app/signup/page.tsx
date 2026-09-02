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
