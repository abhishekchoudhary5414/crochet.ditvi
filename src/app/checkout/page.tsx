"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import supabase from "@/lib/supabaseClient";
import { useApp } from "@/context/AppContext";
import Button from "@/components/Button/Button";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import AddIcon from "@mui/icons-material/Add";

export default function CheckoutPage() {
  const { cart, clearCart, addToast, removeFromCart, updateQuantity } = useApp();
  const router = useRouter();
  const [buyNowItem, setBuyNowItem] = useState<any>(null);

  const [activeStep, setActiveStep] = useState(2);
  const [user, setUser] = useState<any>(null);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [addingAddress, setAddingAddress] = useState(false);
  const [newAddress, setNewAddress] = useState<any>({ full_name: '', phone: '', address_line_1: '', address_line_2: '', city: '', state: '', pincode: '' });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Success state
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);

  const checkoutItems = buyNowItem ? [buyNowItem] : cart;
  const subtotal = checkoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = subtotal >= 50 || subtotal === 0 ? 0 : 5.0;
  const totalAmount = subtotal + shippingCost; // Add discount logic if needed

  useEffect(() => {
    (async () => {
      const s = await supabase.auth.getSession();
      const token = s?.data?.session?.access_token;
      if (!token || !s.data?.session?.user) {
        // Redirect to login if not authenticated
        try { sessionStorage.setItem('pendingCheckout', 'true'); } catch (e) {}
        router.push('/login?redirect=/checkout');
        return;
      }
      setUser(s.data.session.user);

      // Fetch addresses
      const res = await fetch('/api/account/addresses', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data = await res.json();
        setAddresses(data.addresses || []);
        if (data.addresses?.length > 0) {
          setSelectedAddressId(data.addresses[0].id);
        }
      }
      setLoading(false);
    })();
    // check buy now item in sessionStorage
    try {
      const b = sessionStorage.getItem('ditvi_buy_now');
      if (b) {
        const parsed = JSON.parse(b);
        if (parsed && parsed.id) setBuyNowItem(parsed);
      }
    } catch (e) {}
  }, [router]);

  const handlePayment = async () => {
    if (!selectedAddressId) {
      addToast('Please select a delivery address', 'error');
      return;
    }

    setProcessing(true);
    try {
      const s = await supabase.auth.getSession();
      const token = s?.data?.session?.access_token;
      
        const items = checkoutItems.map((it) => ({ productId: it.id, quantity: it.quantity, color: it.color, size: it.size }));
      
      const res = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ items, addressId: selectedAddressId, userId: user.id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed creating order');

      const { order, razorpay } = data;
      setCurrentOrderId(order.id);

      await new Promise<void>((resolve, reject) => {
        if ((window as any).Razorpay) return resolve();
        const s = document.createElement('script');
        s.src = 'https://checkout.razorpay.com/v1/checkout.js';
        s.onload = () => resolve();
        s.onerror = () => reject(new Error('Failed to load Razorpay'));
        document.body.appendChild(s);
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: razorpay.amount,
        currency: razorpay.currency || 'INR',
        name: 'Ditvi Crochet',
        description: `Order ${order.order_number || order.id}`,
        order_id: razorpay.id,
        handler: async function (response: any) {
          const v = await fetch('/api/payment/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: order.id,
            }),
          });
          const verified = await v.json();
          if (!v.ok) {
            addToast(verified?.error || 'Payment verification failed', 'error');
            return;
          }

          setOrderId(order.order_number || order.id);
          setIsSuccess(true);
          // clear buy now flag or cart accordingly
          try { sessionStorage.removeItem('ditvi_buy_now'); } catch (e) {}
          if (!buyNowItem) clearCart();
        },
        prefill: { email: user.email },
        theme: { color: '#F8BBD0' },
      } as any;

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', async function (response: any) {
        setProcessing(false);
        const cancelledOrderId = currentOrderId || order.id;

        try {
          const token = (await supabase.auth.getSession())?.data?.session?.access_token;
          await fetch('/api/payment/cancel', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
            },
            body: JSON.stringify({
              orderId: cancelledOrderId,
              reason: response?.error?.description || 'Payment cancelled by user',
            }),
          });
        } catch (e) {
          console.error('Failed to mark payment cancelled', e);
        }

        addToast('Payment cancelled — order status updated', 'error');
      });
      rzp.open();
    } catch (err: any) {
      addToast(err?.message || 'Checkout failed', 'error');
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div style={{ background: '#f1f3f6', minHeight: 'calc(100vh - 80px)', padding: '30px 20px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 600px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[1, 2, 3, 4].map((item) => (
              <div key={item} style={{ background: '#fff', borderRadius: 2, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.1)', padding: '18px 24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: 'linear-gradient(90deg, #f1f1f1 25%, #e9e9e9 50%, #f1f1f1 75%)', backgroundSize: '200% 100%', animation: 'checkout-shimmer 1.4s ease infinite' }} />
                  <div style={{ width: 180, height: 18, borderRadius: 6, background: 'linear-gradient(90deg, #f1f1f1 25%, #e9e9e9 50%, #f1f1f1 75%)', backgroundSize: '200% 100%', animation: 'checkout-shimmer 1.4s ease infinite' }} />
                </div>
                <div style={{ marginTop: 18, display: 'grid', gap: 12 }}>
                  <div style={{ width: '60%', height: 16, borderRadius: 6, background: 'linear-gradient(90deg, #f1f1f1 25%, #e9e9e9 50%, #f1f1f1 75%)', backgroundSize: '200% 100%', animation: 'checkout-shimmer 1.4s ease infinite' }} />
                  <div style={{ width: '70%', height: 14, borderRadius: 6, background: 'linear-gradient(90deg, #f1f1f1 25%, #e9e9e9 50%, #f1f1f1 75%)', backgroundSize: '200% 100%', animation: 'checkout-shimmer 1.4s ease infinite' }} />
                  <div style={{ width: '50%', height: 14, borderRadius: 6, background: 'linear-gradient(90deg, #f1f1f1 25%, #e9e9e9 50%, #f1f1f1 75%)', backgroundSize: '200% 100%', animation: 'checkout-shimmer 1.4s ease infinite' }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ flex: '1 1 300px' }}>
            <div style={{ background: '#fff', borderRadius: 2, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.1)', padding: 24 }}>
              <div style={{ width: 140, height: 18, borderRadius: 6, background: 'linear-gradient(90deg, #f1f1f1 25%, #e9e9e9 50%, #f1f1f1 75%)', backgroundSize: '200% 100%', animation: 'checkout-shimmer 1.4s ease infinite', marginBottom: 20 }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ width: 120, height: 14, borderRadius: 6, background: 'linear-gradient(90deg, #f1f1f1 25%, #e9e9e9 50%, #f1f1f1 75%)', backgroundSize: '200% 100%', animation: 'checkout-shimmer 1.4s ease infinite' }} />
                <div style={{ width: 72, height: 14, borderRadius: 6, background: 'linear-gradient(90deg, #f1f1f1 25%, #e9e9e9 50%, #f1f1f1 75%)', backgroundSize: '200% 100%', animation: 'checkout-shimmer 1.4s ease infinite' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ width: 120, height: 14, borderRadius: 6, background: 'linear-gradient(90deg, #f1f1f1 25%, #e9e9e9 50%, #f1f1f1 75%)', backgroundSize: '200% 100%', animation: 'checkout-shimmer 1.4s ease infinite' }} />
                <div style={{ width: 72, height: 14, borderRadius: 6, background: 'linear-gradient(90deg, #f1f1f1 25%, #e9e9e9 50%, #f1f1f1 75%)', backgroundSize: '200% 100%', animation: 'checkout-shimmer 1.4s ease infinite' }} />
              </div>
              <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px dashed #e0e0e0', display: 'flex', justifyContent: 'space-between' }}>
                <div style={{ width: 110, height: 18, borderRadius: 6, background: 'linear-gradient(90deg, #f1f1f1 25%, #e9e9e9 50%, #f1f1f1 75%)', backgroundSize: '200% 100%', animation: 'checkout-shimmer 1.4s ease infinite' }} />
                <div style={{ width: 84, height: 18, borderRadius: 6, background: 'linear-gradient(90deg, #f1f1f1 25%, #e9e9e9 50%, #f1f1f1 75%)', backgroundSize: '200% 100%', animation: 'checkout-shimmer 1.4s ease infinite' }} />
              </div>
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes checkout-shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </div>
    );
  }

  if (checkoutItems.length === 0 && !isSuccess) {
    return (
      <div style={{ padding: 40, textAlign: 'center' }}>
        <h2>Your Cart is Empty</h2>
        <Link href="/shop"><Button variant="primary">Shop Now</Button></Link>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div style={{ background: '#f1f3f6', minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ background: '#fff', padding: 40, borderRadius: 4, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.1)', textAlign: 'center', maxWidth: 500 }}>
          <CheckCircleOutlineOutlinedIcon style={{ fontSize: 64, color: '#388e3c', marginBottom: 16 }} />
          <h2 style={{ margin: '0 0 16px 0', color: '#212121' }}>Order Placed Successfully!</h2>
          <p style={{ color: '#878787', marginBottom: 24, lineHeight: 1.5 }}>
            Thank you for shopping with Ditvi Crochet. Your order has been confirmed.
          </p>
          <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 4, marginBottom: 24, fontWeight: 500 }}>
            Order ID: {orderId}
          </div>
          <Link href="/account/orders">
            <Button variant="primary" style={{ width: '100%' }}>View My Orders</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#f1f3f6', minHeight: 'calc(100vh - 80px)', padding: '30px 20px' }}>
      <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        
        {/* Main Steps */}
        <div style={{ flex: '1 1 600px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          
          {/* Step 1: Login */}
          <div style={{ background: '#fff', borderRadius: 2, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.1)' }}>
            <div style={{ padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ background: '#f0f0f0', color: 'var(--primary)', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2, fontSize: 14, fontWeight: 500 }}>1</span>
                <span style={{ fontWeight: 500, color: '#878787', textTransform: 'uppercase' }}>Login</span>
                <CheckCircleIcon style={{ color: 'var(--primary)', fontSize: 18 }} />
              </div>
            </div>
            <div style={{ padding: '0 24px 24px 64px', fontSize: 14 }}>
              <span style={{ fontWeight: 500 }}>{user?.email}</span>
            </div>
          </div>

          {/* Step 2: Delivery Address */}
          <div style={{ background: '#fff', borderRadius: 2, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.1)' }}>
            <div 
              style={{ background: activeStep === 2 ? 'var(--primary)' : '#fff', padding: '16px 24px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
              onClick={() => setActiveStep(2)}
            >
              <span style={{ background: activeStep === 2 ? '#fff' : '#f0f0f0', color: activeStep === 2 ? 'var(--dark-text)' : '#878787', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2, fontSize: 14, fontWeight: 500, marginRight: 16 }}>2</span>
              <span style={{ fontWeight: 500, color: activeStep === 2 ? 'var(--dark-text)' : '#878787', textTransform: 'uppercase' }}>Delivery Address</span>
              {activeStep > 2 && <CheckCircleIcon style={{ color: 'var(--primary)', fontSize: 18, marginLeft: 16 }} />}
            </div>

            {activeStep === 2 && (
              <div style={{ padding: '20px', paddingLeft: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <div style={{ fontWeight: 600 }}>Select Delivery Address</div>
                  <div>
                    <Button variant="outline" onClick={() => setAddingAddress((v) => !v)} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><AddIcon fontSize="small" /> {addingAddress ? 'Cancel' : 'Add Address'}</Button>
                  </div>
                </div>

                {addingAddress && (
                  <form style={{ display: 'grid', gap: 8, marginBottom: 12 }} onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      const s = await supabase.auth.getSession();
                      const token = s?.data?.session?.access_token;
                      if (!token) return addToast('Not authenticated', 'error');
                      const res = await fetch('/api/account/addresses', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }, body: JSON.stringify(newAddress) });
                      const data = await res.json();
                      if (!res.ok) return addToast(data?.error || 'Failed to add address', 'error');
                      setAddresses((prev) => [data.address, ...prev]);
                      setSelectedAddressId(data.address.id);
                      setNewAddress({ full_name: '', phone: '', address_line_1: '', address_line_2: '', city: '', state: '', pincode: '' });
                      setAddingAddress(false);
                      addToast('Address added', 'success');
                    } catch (err: any) {
                      addToast(err?.message || 'Failed to add address', 'error');
                    }
                  }}>
                    <input placeholder="Full name" value={newAddress.full_name} onChange={(e) => setNewAddress({ ...newAddress, full_name: e.target.value })} required style={{ padding: 10, borderRadius: 8, border: '1px solid #eee' }} />
                    <input placeholder="Phone" value={newAddress.phone} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} required style={{ padding: 10, borderRadius: 8, border: '1px solid #eee' }} />
                    <input placeholder="Address line 1" value={newAddress.address_line_1} onChange={(e) => setNewAddress({ ...newAddress, address_line_1: e.target.value })} required style={{ padding: 10, borderRadius: 8, border: '1px solid #eee' }} />
                    <input placeholder="Address line 2" value={newAddress.address_line_2} onChange={(e) => setNewAddress({ ...newAddress, address_line_2: e.target.value })} style={{ padding: 10, borderRadius: 8, border: '1px solid #eee' }} />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} required style={{ padding: 10, borderRadius: 8, border: '1px solid #eee', flex: 1 }} />
                      <input placeholder="State" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} required style={{ padding: 10, borderRadius: 8, border: '1px solid #eee', flex: 1 }} />
                    </div>
                    <input placeholder="PIN" value={newAddress.pincode} onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })} required style={{ padding: 10, borderRadius: 8, border: '1px solid #eee' }} />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <Button type="submit" variant="primary" style={{ background: 'var(--primary)', borderColor: 'var(--primary)', color: 'var(--dark-text)' }}>Save Address</Button>
                    </div>
                  </form>
                )}

                {addresses.length === 0 ? (
                  <div>
                    <p style={{ marginBottom: 16, color: '#878787' }}>No addresses found. Add one to continue.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {addresses.map((a) => (
                      <div key={a.id} style={{ display: 'flex', gap: 12, padding: 12, border: '1px solid #eee', borderRadius: 8, cursor: 'pointer', background: selectedAddressId === a.id ? '#fff7f3' : '#fff', alignItems: 'flex-start' }}>
                        <input type="radio" name="address" checked={selectedAddressId === a.id} onChange={() => setSelectedAddressId(a.id)} style={{ marginTop: 6 }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                              <div style={{ fontWeight: 600 }}>{a.full_name}</div>
                              <div style={{ fontSize: 13, color: '#6b6b6b' }}>{a.phone}</div>
                            </div>
                            <div>
                              <Button variant="outline" onClick={async () => {
                                // delete address (simple client action)
                                try {
                                  const s = await supabase.auth.getSession();
                                  const token = s?.data?.session?.access_token;
                                  if (!token) return addToast('Not authenticated', 'error');
                                  const r = await fetch(`/api/account/addresses/${a.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
                                  if (!r.ok) throw new Error('Failed to delete');
                                  setAddresses((prev) => prev.filter((x) => x.id !== a.id));
                                  if (selectedAddressId === a.id) setSelectedAddressId('');
                                  addToast('Address removed', 'info');
                                } catch (e) {
                                  addToast('Failed to remove address', 'error');
                                }
                              }}>Remove</Button>
                            </div>
                          </div>
                          <div style={{ marginTop: 8, color: '#333' }}>{a.address_line_1}{a.address_line_2 ? `, ${a.address_line_2}` : ''}, {a.city} - <strong>{a.pincode}</strong></div>
                          {selectedAddressId === a.id && (
                            <div style={{ marginTop: 12 }}>
                              <Button variant="primary" onClick={() => setActiveStep(3)} style={{ background: 'var(--primary)', borderColor: 'var(--primary)', color: 'var(--dark-text)', padding: '10px 20px' }}>Deliver Here</Button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Step 3: Order Summary */}
          <div style={{ background: '#fff', borderRadius: 2, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.1)' }}>
            <div 
              style={{ background: activeStep === 3 ? 'var(--primary)' : '#fff', padding: '16px 24px', display: 'flex', alignItems: 'center', cursor: 'pointer' }}
              onClick={() => { if(activeStep > 3) setActiveStep(3) }}
            >
              <span style={{ background: activeStep === 3 ? '#fff' : '#f0f0f0', color: activeStep === 3 ? 'var(--dark-text)' : '#878787', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2, fontSize: 14, fontWeight: 500, marginRight: 16 }}>3</span>
              <span style={{ fontWeight: 500, color: activeStep === 3 ? 'var(--dark-text)' : '#878787', textTransform: 'uppercase' }}>Order Summary</span>
              {activeStep > 3 && <CheckCircleIcon style={{ color: 'var(--primary)', fontSize: 18, marginLeft: 16 }} />}
            </div>

            {activeStep === 3 && (
              <div style={{ padding: '24px 24px 24px 64px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
                  {checkoutItems.map((item, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 8, borderRadius: 8, border: '1px solid #f0f0f0' }}>
                      <div style={{ width: 64, height: 64, background: '#f5f5f5', borderRadius: 6, overflow: 'hidden', flexShrink: 0 }}>
                        <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ fontWeight: 600 }}>{item.name}</div>
                          <div style={{ fontWeight: 700 }}>₹{(item.price * item.quantity).toFixed(2)}</div>
                        </div>
                        <div style={{ fontSize: 13, color: '#6b6b6b', marginTop: 6 }}>Color: {item.color} | Size: {item.size}</div>

                        <div style={{ marginTop: 10, display: 'flex', gap: 8, alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #e6e6e6', borderRadius: 8, overflow: 'hidden' }}>
                            <button aria-label="decrease" onClick={() => {
                              if (buyNowItem) {
                                const q = Math.max(1, (buyNowItem.quantity || 1) - 1);
                                setBuyNowItem({ ...buyNowItem, quantity: q });
                              } else {
                                updateQuantity(item.id, item.color, item.size, item.quantity - 1);
                              }
                            }} style={{ padding: '6px 10px', background: '#fff', border: 'none', cursor: 'pointer' }}>-</button>
                            <div style={{ padding: '6px 12px', minWidth: 36, textAlign: 'center' }}>{item.quantity}</div>
                            <button aria-label="increase" onClick={() => {
                              if (buyNowItem) {
                                const q = (buyNowItem.quantity || 1) + 1;
                                setBuyNowItem({ ...buyNowItem, quantity: q });
                              } else {
                                updateQuantity(item.id, item.color, item.size, item.quantity + 1);
                              }
                            }} style={{ padding: '6px 10px', background: '#fff', border: 'none', cursor: 'pointer' }}>+</button>
                          </div>

                          {!buyNowItem && (
                            <button onClick={() => removeFromCart(item.id, item.color, item.size)} style={{ background: 'transparent', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}>Remove</button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="primary" onClick={() => setActiveStep(4)} style={{ background: 'var(--primary)', borderColor: 'var(--primary)', color: 'var(--dark-text)', padding: '12px 32px' }}>CONTINUE</Button>
              </div>
            )}
          </div>

          {/* Step 4: Payment Options */}
          <div style={{ background: '#fff', borderRadius: 2, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.1)' }}>
            <div style={{ background: activeStep === 4 ? 'var(--primary)' : '#fff', padding: '16px 24px', display: 'flex', alignItems: 'center' }}>
              <span style={{ background: activeStep === 4 ? '#fff' : '#f0f0f0', color: activeStep === 4 ? 'var(--dark-text)' : '#878787', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 2, fontSize: 14, fontWeight: 500, marginRight: 16 }}>4</span>
              <span style={{ fontWeight: 500, color: activeStep === 4 ? 'var(--dark-text)' : '#878787', textTransform: 'uppercase' }}>Payment Options</span>
            </div>

            {activeStep === 4 && (
              <div style={{ padding: '24px 24px 24px 64px' }}>
                <div style={{ border: '1px solid #e0e0e0', padding: 16, borderRadius: 4, display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24, background: '#f9f9f9' }}>
                  <input type="radio" checked readOnly style={{ marginTop: 0 }} />
                  <span style={{ fontWeight: 500 }}>Razorpay (Credit/Debit Card, UPI, Netbanking)</span>
                </div>
                <Button 
                  variant="primary" 
                  onClick={handlePayment} 
                  disabled={processing}
                  style={{ background: 'var(--primary)', borderColor: 'var(--primary)', color: 'var(--dark-text)', padding: '12px 32px', fontSize: 16, width: '100%', maxWidth: 300 }}
                >
                  {processing ? 'PROCESSING...' : `PAY ₹${totalAmount.toFixed(2)}`}
                </Button>
              </div>
            )}
          </div>

        </div>

        {/* Price Details */}
        <div style={{ flex: '1 1 300px' }}>
          <div style={{ background: '#fff', borderRadius: 2, boxShadow: '0 1px 2px 0 rgba(0,0,0,0.1)', position: 'sticky', top: 20 }}>
            <div style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0', fontWeight: 500, color: '#878787', textTransform: 'uppercase' }}>
              Price Details
            </div>
            <div style={{ padding: 24 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontSize: 15 }}>
                <span>Price ({cart.length} item{cart.length !== 1 ? 's' : ''})</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontSize: 15 }}>
                <span>Delivery Charges</span>
                <span style={{ color: shippingCost === 0 ? '#388e3c' : 'inherit' }}>
                  {shippingCost === 0 ? 'FREE Delivery' : `₹${shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 24, paddingTop: 16, borderTop: '1px dashed #e0e0e0', fontSize: 18, fontWeight: 500 }}>
                <span>Total Amount</span>
                <span>₹{totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
