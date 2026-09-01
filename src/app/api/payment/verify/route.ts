import { NextRequest, NextResponse } from 'next/server';
import { verifyRazorpaySignature } from '@/lib/razorpayServer';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { generateReceiptNumber } from '@/lib/ordersServer';
import { sendOrderConfirmEmail } from '@/lib/emailServer';

export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: 'missing razorpay fields' }, { status: 400 });
    }

    const ok = verifyRazorpaySignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
    });
    if (!ok) return NextResponse.json({ error: 'invalid signature' }, { status: 400 });

    const { data: order } = await supabaseAdmin
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (!order) return NextResponse.json({ error: 'order not found' }, { status: 404 });

    const receiptNumber = generateReceiptNumber();
    const cartSnapshotRaw = (order.metadata as any)?.cart_snapshot;
    const cartSnapshot = Array.isArray(cartSnapshotRaw) ? (cartSnapshotRaw as any[]) : [];

    // Insert order items from cart snapshot
    if (cartSnapshot.length > 0) {
      const orderItems = cartSnapshot.map((it) => ({
        order_id: orderId,
        product_id: null,
        product_name: [it.productName, it.color && `Color: ${it.color}`, it.size && `Size: ${it.size}`].filter(Boolean).join(' | '),
        sku: it.productId,
        quantity: Number(it.quantity) || 0,
        unit_price: Number(it.unitPrice) || 0,
        discount: 0,
        tax: 0,
        total_price: Number(it.totalPrice) || 0,
      }));

      await supabaseAdmin.from('order_items').insert(orderItems);
    }

    await supabaseAdmin.from('payments').insert({
      order_id: orderId,
      user_id: order.user_id,
      provider_order_id: razorpay_order_id,
      provider_payment_id: razorpay_payment_id,
      provider_signature: razorpay_signature,
      amount: order.total_amount,
      currency: 'INR',
      status: 'paid',
      payment_method: 'razorpay',
    });

    await supabaseAdmin
      .from('orders')
      .update({
        payment_status: 'paid',
        payment_method: 'razorpay',
        razorpay_payment_id: razorpay_payment_id,
        order_status: 'paid',
        receipt_number: receiptNumber,
      })
      .eq('id', orderId);

    // Send confirmation email
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('user_id', order.user_id)
      .maybeSingle();

    const customerEmail = profile?.email || (order.metadata as { shipping_address?: { email?: string } })?.shipping_address?.email;
    const customerName = profile?.full_name || profile?.first_name || 'Customer';
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    if (customerEmail) {
      const itemsSummary = cartSnapshot.length > 0
        ? cartSnapshot.map((it: any) => `${it.productName} x${it.quantity}`).join(', ')
        : '';

      await sendOrderConfirmEmail({
        to: customerEmail,
        customerName,
        orderNumber: order.order_number,
        totalAmount: Number(order.total_amount),
        itemsSummary,
        receiptUrl: `${siteUrl}/account/orders/${orderId}/receipt`,
      });
    }

    return NextResponse.json({ ok: true, receiptNumber });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('verify payment error', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
