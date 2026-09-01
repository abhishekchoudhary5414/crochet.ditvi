import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || '';

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('x-razorpay-signature') || '';
    if (!WEBHOOK_SECRET) {
      console.warn('No Razorpay webhook secret configured');
    } else {
      const expected = crypto.createHmac('sha256', WEBHOOK_SECRET).update(body).digest('hex');
      if (expected !== signature) {
        return NextResponse.json({ error: 'invalid signature' }, { status: 400 });
      }
    }

    const payload = JSON.parse(body);
    const event = payload.event;

    // store event
    await supabaseAdmin.from('payment_events').insert({ event_type: event, payload, processed: false });

    // handle payment.captured
    if (event === 'payment.captured') {
      const payment = payload.payload.payment.entity;
      // idempotent update: find payment by provider_payment_id or create
      const { data: existing } = await supabaseAdmin.from('payments').select('*').eq('provider_payment_id', payment.id).limit(1);
      if (existing && existing.length > 0) {
        await supabaseAdmin.from('payments').update({ status: 'paid', updated_at: new Date().toISOString() }).eq('provider_payment_id', payment.id);
      } else {
        await supabaseAdmin.from('payments').insert({ provider_payment_id: payment.id, provider_order_id: payment.order_id, amount: payment.amount / 100, currency: payment.currency, status: 'paid', metadata: payment });
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error('webhook error', err);
    return NextResponse.json({ error: err.message || String(err) }, { status: 500 });
  }
}
