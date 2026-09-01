"use client";

import React, { useState, useEffect } from 'react';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import Button from '@/components/Button/Button';
import styles from '@/app/auth.module.css';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';

const schema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  otp: z.string().length(6, { message: "OTP must be 6 digits" }),
  password: z.string().min(8, { message: "Password must be at least 8 characters" }),
  confirmPassword: z.string(),
  firstName: z.string().min(2, { message: "First name is required" }),
  lastName: z.string().min(2, { message: "Last name is required" }),
  phone: z.string().min(10, { message: "Valid phone number is required" }),
  address: z.string().min(5, { message: "Address is required" }),
  city: z.string().min(2, { message: "City is required" }),
  state: z.string().min(2, { message: "State is required" }),
  pin: z.string().min(6, { message: "Valid PIN code is required" }),
  country: z.string().min(2),
}).refine((d) => d.password === d.confirmPassword, { 
  path: ['confirmPassword'], message: 'Passwords do not match' 
});

export default function VerifyOtpPage() {
  const router = useRouter();
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
      password: '',
      confirmPassword: '',
      firstName: '',
      lastName: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pin: '',
      country: 'India'
    };
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    
    const result = schema.safeParse(formData);
    if (!result.success) {
      const err: Record<string, string> = {};
      result.error.errors.forEach((zerr) => { err[zerr.path[0] as string] = zerr.message; });
      setErrors(err);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/auth/verify-otp', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(formData) 
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Verification failed');

      try { sessionStorage.removeItem('pendingSignup'); } catch (e) {}

      // Login the user now that they are verified.
      const supabase = (await import('@/lib/supabaseClient')).default;
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (signInError) {
        console.warn('Auto-login failed after registration', signInError);
        alert('Account created! Please log in.');
        router.push('/login');
      } else {
        router.push('/account/profile');
        router.refresh();
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Verification failed. Please try again.';
      setErrors({ form: message });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.container} style={{ maxWidth: '900px' }}>
        <div className={styles.leftPane}>
          <h2>Almost there!</h2>
          <p>Please verify your email and complete your profile to finish setting up your account.</p>
        </div>
        <div className={styles.rightPane}>
          <h1>Complete Profile</h1>
          
          <form onSubmit={onSubmit} className={styles.form} style={{ marginTop: '16px' }}>
            
            <h3 style={{ fontSize: '16px', marginTop: '10px', color: 'var(--accent)' }}>Account Verification</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className={styles.inputGroup}>
                <label>Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} readOnly />
                {errors.email && <small className={styles.error}>{errors.email}</small>}
              </div>
              <div className={styles.inputGroup}>
                <label>OTP (6-digit)</label>
                <input type="text" name="otp" value={formData.otp} onChange={handleInputChange} placeholder="123456" maxLength={6} />
                {errors.otp && <small className={styles.error}>{errors.otp}</small>}
              </div>
              <div className={styles.inputGroup}>
                <label>Password</label>
                <div className={styles.passwordField}>
                  <input type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleInputChange} placeholder="Create password" />
                  <button type="button" className={styles.passwordToggle} onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Hide password' : 'Show password'}>
                    {showPassword ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
                  </button>
                </div>
                {errors.password && <small className={styles.error}>{errors.password}</small>}
              </div>
              <div className={styles.inputGroup}>
                <label>Confirm Password</label>
                <div className={styles.passwordField}>
                  <input type={showConfirmPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleInputChange} placeholder="Confirm password" />
                  <button type="button" className={styles.passwordToggle} onClick={() => setShowConfirmPassword((value) => !value)} aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}>
                    {showConfirmPassword ? <VisibilityOffOutlinedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
                  </button>
                </div>
                {errors.confirmPassword && <small className={styles.error}>{errors.confirmPassword}</small>}
              </div>
            </div>

            <h3 style={{ fontSize: '16px', marginTop: '16px', color: 'var(--accent)' }}>Personal Details</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className={styles.inputGroup}>
                <label>First Name</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="John" />
                {errors.firstName && <small className={styles.error}>{errors.firstName}</small>}
              </div>
              <div className={styles.inputGroup}>
                <label>Last Name</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Doe" />
                {errors.lastName && <small className={styles.error}>{errors.lastName}</small>}
              </div>
              <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
                <label>Mobile Number</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91 9876543210" />
                {errors.phone && <small className={styles.error}>{errors.phone}</small>}
              </div>
            </div>

            <h3 style={{ fontSize: '16px', marginTop: '16px', color: 'var(--accent)' }}>Delivery Address</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className={styles.inputGroup} style={{ gridColumn: '1 / -1' }}>
                <label>Street Address</label>
                <input type="text" name="address" value={formData.address} onChange={handleInputChange} placeholder="House no, Building, Street" />
                {errors.address && <small className={styles.error}>{errors.address}</small>}
              </div>
              <div className={styles.inputGroup}>
                <label>City</label>
                <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="City" />
                {errors.city && <small className={styles.error}>{errors.city}</small>}
              </div>
              <div className={styles.inputGroup}>
                <label>State</label>
                <input type="text" name="state" value={formData.state} onChange={handleInputChange} placeholder="State" />
                {errors.state && <small className={styles.error}>{errors.state}</small>}
              </div>
              <div className={styles.inputGroup}>
                <label>PIN / Postal Code</label>
                <input type="text" name="pin" value={formData.pin} onChange={handleInputChange} placeholder="110001" />
                {errors.pin && <small className={styles.error}>{errors.pin}</small>}
              </div>
              <div className={styles.inputGroup}>
                <label>Country</label>
                <input type="text" name="country" value={formData.country} onChange={handleInputChange} readOnly />
              </div>
            </div>

            {errors.form && <small className={styles.error} style={{ marginTop: '8px' }}>{errors.form}</small>}

            <Button type="submit" variant="primary" disabled={isSubmitting} size="lg" style={{ marginTop: 24 }}>
              {isSubmitting ? 'Verifying & Creating Account...' : 'Complete Registration'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
