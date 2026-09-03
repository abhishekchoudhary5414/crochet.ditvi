"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@/components/Button/Button';
import styles from '@/app/auth.module.css';

const schema = z.object({ email: z.string().email() });

export default function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema) });
  const [sent, setSent] = useState(false);
  const [Message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(values: any) {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/forgot-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || 'Failed');
      setSent(true);
      setMessage('If an account exists for this email, a password reset OTP or link has been sent.');
    } catch (err: any) {
      setMessage(err?.message || 'Request failed');
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading && !sent) {
    return (
      <div className={styles.pageWrapper}>
        <div className={styles.container} style={{ maxWidth: 900 }}>
          <div className={styles.leftPane}>
            <div style={{ width: 180, height: 18, borderRadius: 8, background: 'linear-gradient(90deg, #f1f1f1 25%, #e9e9e9 50%, #f1f1f1 75%)', backgroundSize: '200% 100%', animation: 'forgot-shimmer 1.4s ease infinite', marginBottom: 16 }} />
            <div style={{ width: '85%', height: 22, borderRadius: 8, background: 'linear-gradient(90deg, #f1f1f1 25%, #e9e9e9 50%, #f1f1f1 75%)', backgroundSize: '200% 100%', animation: 'forgot-shimmer 1.4s ease infinite', marginBottom: 12 }} />
            <div style={{ width: '70%', height: 14, borderRadius: 8, background: 'linear-gradient(90deg, #f1f1f1 25%, #e9e9e9 50%, #f1f1f1 75%)', backgroundSize: '200% 100%', animation: 'forgot-shimmer 1.4s ease infinite' }} />
          </div>

          <div className={styles.rightPane}>
            <div style={{ width: 170, height: 26, borderRadius: 8, background: 'linear-gradient(90deg, #f1f1f1 25%, #e9e9e9 50%, #f1f1f1 75%)', backgroundSize: '200% 100%', animation: 'forgot-shimmer 1.4s ease infinite', marginBottom: 18 }} />
            <div style={{ display: 'grid', gap: 16 }}>
              <div style={{ width: '100%', height: 46, borderRadius: 8, background: 'linear-gradient(90deg, #f1f1f1 25%, #e9e9e9 50%, #f1f1f1 75%)', backgroundSize: '200% 100%', animation: 'forgot-shimmer 1.4s ease infinite' }} />
              <div style={{ width: 160, height: 42, borderRadius: 8, background: 'linear-gradient(90deg, #f1f1f1 25%, #e9e9e9 50%, #f1f1f1 75%)', backgroundSize: '200% 100%', animation: 'forgot-shimmer 1.4s ease infinite' }} />
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes forgot-shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container} style={{ maxWidth: 900 }}>
        <div className={styles.leftPane}>
          <h2>Reset your password</h2>
          <p>Enter the email associated with your account. We'll send a secure one-time code or link to help you reset your password quickly.</p>
        </div>

        <div className={styles.rightPane}>
          <h1>Forgot Password</h1>

          {!sent ? (
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form} aria-live="polite">
              <div className={styles.inputGroup}>
                <label>Email</label>
                <input {...register('email')} placeholder="you@example.com" />
                {errors.email && <small className={styles.error}>{errors.email.message}</small>}
              </div>

              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginTop: 4 }}>
                <Button type="submit" variant="primary" disabled={isSubmitting} style={{ padding: '10px 20px' }}>{isSubmitting ? 'Sending...' : 'Send Reset'}</Button>
                <Button variant="text" onClick={() => window.location.href = '/login'}>Back to Login</Button>
              </div>

              {Message && <div style={{ marginTop: 12, color: Message.startsWith('If') ? '#388e3c' : '#d32f2f' }}>{Message}</div>}
            </form>
          ) : (
            <div>
              <div style={{ background: '#e8f5e9', padding: 16, borderRadius: 8, border: '1px solid #c8e6c9' }}>
                <strong>Check your email</strong>
                <div style={{ marginTop: 8 }}>{Message}</div>
              </div>

              <div style={{ marginTop: 18, display: 'flex', gap: 12 }}>
                <Button variant="primary" onClick={() => window.location.href = '/login'}>Return to Login</Button>
                <Button variant="text" onClick={() => setSent(false)}>Send Again</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
