import { NextRequest, NextResponse } from 'next/server';
import { getUserFromAuthHeader } from '@/lib/authServer';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { createRazorpayOrder } from '@/lib/razorpayServer';
import { resolveOrderItems } from '@/lib/productsServer';
import { generateOrderNumber } from '@/lib/ordersServer';

export async function POST(req: NextRequest) {
  try {
    const user = await getUserFromAuthHeader(req);
    if (!user) return NextResponse.json({ error: 'You must be logged in to place an order' }, { status: 401 });

    const body = await req.json();
    const { items, addressId, shippingAddress, discount = 0 } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'items required' }, { status: 400 });
    }

    const { resolved, subtotal } = resolveOrderItems(items);
    const shippingFee = subtotal >= 50 ? 0 : 5;
    const discountAmount = Number(discount) || 0;
    const tax = 0;
    const totalAmount = subtotal - discountAmount + shippingFee + tax;
    const totalPaise = Math.round(totalAmount * 100);

    const orderNumber = generateOrderNumber();

    let finalShippingAddress = shippingAddress || null;
    if (addressId) {
      const { data: addressData } = await supabaseAdmin
        .from('addresses')
        .select('*')
        .eq('id', addressId)
        .single();
      if (addressData) {
        finalShippingAddress = {
          name: addressData.full_name,
          phone: addressData.phone,
          address: addressData.address_line_1,
          city: addressData.city,
          state: addressData.state,
          pin: addressData.pincode,
        };
      }
    }

    const { data: orderData, error: orderErr } = await supabaseAdmin
      .from('orders')
      .insert({
        order_number: orderNumber,
        user_id: user.id,
        address_id: addressId || null,
        subtotal,
        discount: discountAmount,
        tax,
        shipping_fee: shippingFee,
        total_amount: totalAmount,
        currency: 'INR',
        order_status: 'pending',
        payment_status: 'pending',
        metadata: {
          shipping_address: finalShippingAddress,
          cart_snapshot: resolved,
        },
      })
      .select('*')
      .single();

    if (orderErr) throw orderErr;

    const rpOrder = await createRazorpayOrder({
      amountInPaise: totalPaise,
      currency: 'INR',
      receipt: orderNumber,
      notes: { orderId: orderData.id },
    });

    await supabaseAdmin
      .from('orders')
      .update({ razorpay_order_id: rpOrder.id })
      .eq('id', orderData.id);

    return NextResponse.json({ ok: true, order: orderData, razorpay: rpOrder });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('create-order error', message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
