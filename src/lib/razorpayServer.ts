import Razorpay from 'razorpay';
import crypto from 'crypto';

if (!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  if (process.env.NODE_ENV === 'development') {
    console.warn('Razorpay keys not found in env. Set NEXT_PUBLIC_RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET');
  }
}

export const razorpayClient = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID as string,
  key_secret: process.env.RAZORPAY_KEY_SECRET as string
});

export async function createRazorpayOrder({ amountInPaise, currency = 'INR', receipt, notes = {} }: { amountInPaise: number; currency?: string; receipt?: string; notes?: Record<string, any> }) {
  const opts = {
    amount: amountInPaise,
    currency,
    receipt,
    notes
  };
  return await razorpayClient.orders.create(opts);
}

export function verifyRazorpaySignature({ orderId, paymentId, signature }: { orderId: string; paymentId: string; signature: string }) {
  const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET as string);
  hmac.update(`${orderId}|${paymentId}`);
  const expected = hmac.digest('hex');
  return expected === signature;
}
