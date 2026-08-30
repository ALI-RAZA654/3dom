'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, CreditCard, ArrowRight, CheckCircle2, ShoppingBag, Truck, Tag, Lock, ArrowLeft } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { submitOrder, validateCoupon } from '@/lib/api';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, cartSubtotal, appliedCoupon, setAppliedCoupon, discountAmount, cartTotal, clearCart } = useCart();
  const { user } = useAuth();

  // Progress Steps: 1: Shipping Info -> 2: Payment & Order Review
  const [step, setStep] = useState<number>(1);

  // Form Fields
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('+1 555 982 1029');
  const [address, setAddress] = useState('742 Evergreen Terrace');
  const [city, setCity] = useState('San Francisco');
  const [state, setState] = useState('CA');
  const [zip, setZip] = useState('94107');

  // Coupon
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');

  // Payment method
  const [paymentGateway, setPaymentGateway] = useState<'stripe' | 'razorpay'>('stripe');
  const [isProcessing, setIsProcessing] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-4 space-y-4">
        <ShoppingBag className="w-12 h-12 text-zinc-600" />
        <h2 className="text-xl font-bold">Your cart is empty</h2>
        <p className="text-xs text-zinc-400">Add products from any of our 3 verticals before proceeding to checkout.</p>
        <Link href="/3d-printing" className="px-6 py-2.5 bg-red-600 text-white text-xs font-bold rounded-xl shadow">
          Explore Stores
        </Link>
      </div>
    );
  }

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponError('');
    try {
      const res = await validateCoupon(couponCode.trim(), cartSubtotal);
      setAppliedCoupon(res);
      setCouponCode('');
    } catch (err: any) {
      setCouponError(err.message || 'Invalid promo code');
    }
  };

  const handleCompleteOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutError('');
    setIsProcessing(true);

    try {
      const orderPayload = {
        customer: {
          name: name || 'Guest Customer',
          email,
          phone,
          address: `${address}, ${city}, ${state} ${zip}`
        },
        items: cart,
        couponCode: appliedCoupon?.code || null,
        paymentMethod: paymentGateway === 'stripe' ? 'Stripe Test Gateway (PCI Compliant)' : 'Razorpay Test Mode'
      };

      const createdOrder = await submitOrder(orderPayload);
      clearCart();
      router.push(`/orders/${createdOrder.id}`);
    } catch (err: any) {
      setCheckoutError(err.message || 'Checkout failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Progress Bar */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-6">
          <Link href="/3d-printing" className="logo-wordmark text-2xl font-black text-white">
            3DOM <span className="text-xs font-normal text-zinc-400">Checkout</span>
          </Link>

          {/* Checkout Progress Steps */}
          <div className="flex items-center space-x-4 text-xs font-bold">
            <div className={`flex items-center space-x-1.5 ${step >= 1 ? 'text-red-500' : 'text-zinc-500'}`}>
              <span className="w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center text-[10px]">1</span>
              <span>Shipping</span>
            </div>
            <span className="text-zinc-700">&rarr;</span>
            <div className={`flex items-center space-x-1.5 ${step >= 2 ? 'text-red-500' : 'text-zinc-500'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>2</span>
              <span>Payment</span>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column: Form Steps */}
          <div className="lg:col-span-7 space-y-6">
            
            {checkoutError && (
              <div className="p-4 bg-red-950/80 border border-red-800 text-red-400 text-xs rounded-xl font-semibold">
                {checkoutError}
              </div>
            )}

            {step === 1 && (
              <form onSubmit={() => setStep(2)} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
                <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                  <Truck className="w-5 h-5 text-red-500" />
                  <span>Shipping Address & Contact</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl outline-none text-white focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Email (For Confirmation)</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl outline-none text-white focus:border-red-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Phone Number (For Tracking Updates)</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 555 019 2831"
                    className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl outline-none text-white focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Innovation Drive"
                    className="w-full px-3.5 py-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-xl outline-none text-white focus:border-red-500"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">City</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-xl outline-none text-white focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">State</label>
                    <input
                      type="text"
                      required
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-xl outline-none text-white focus:border-red-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-zinc-400 mb-1">Postal Code</label>
                    <input
                      type="text"
                      required
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-xl outline-none text-white focus:border-red-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center space-x-2 transition"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {step === 2 && (
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                  <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                    <CreditCard className="w-5 h-5 text-red-500" />
                    <span>Select Payment Gateway Mode</span>
                  </h3>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs text-red-400 hover:underline flex items-center space-x-1"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Edit Shipping</span>
                  </button>
                </div>

                {/* Gateway Selection Tabs */}
                <div className="grid grid-cols-2 gap-4">
                  <div
                    onClick={() => setPaymentGateway('stripe')}
                    className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                      paymentGateway === 'stripe'
                        ? 'bg-red-950/40 border-red-600 ring-2 ring-red-500/50'
                        : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-black text-white">Stripe Test Gateway</span>
                      <p className="text-[10px] text-zinc-400 mt-1">Simulated PCI-compliant card processing</p>
                    </div>
                    <span className="mt-3 text-[10px] font-bold text-emerald-400">Sandbox Test Mode</span>
                  </div>

                  <div
                    onClick={() => setPaymentGateway('razorpay')}
                    className={`p-4 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                      paymentGateway === 'razorpay'
                        ? 'bg-red-950/40 border-red-600 ring-2 ring-red-500/50'
                        : 'bg-zinc-950 border-zinc-800 hover:border-zinc-700'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-black text-white">Razorpay Test Gateway</span>
                      <p className="text-[10px] text-zinc-400 mt-1">UPI, NetBanking & Card simulated flow</p>
                    </div>
                    <span className="mt-3 text-[10px] font-bold text-amber-400">UPI Sandbox Mode</span>
                  </div>
                </div>

                {/* Simulated Credit Card Input */}
                <div className="p-4 bg-zinc-950 rounded-xl border border-zinc-800 space-y-3">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span>Card Number (Test Mode Enabled)</span>
                    <Lock className="w-3.5 h-3.5 text-emerald-500" />
                  </div>
                  <input
                    type="text"
                    readOnly
                    value="4242 •••• •••• 4242"
                    className="w-full px-3.5 py-2 text-xs font-mono bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-300"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      readOnly
                      value="12 / 28"
                      className="px-3 py-2 text-xs font-mono bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-300"
                    />
                    <input
                      type="text"
                      readOnly
                      value="CVC 123"
                      className="px-3 py-2 text-xs font-mono bg-zinc-900 border border-zinc-800 rounded-lg text-zinc-300"
                    />
                  </div>
                </div>

                <button
                  onClick={handleCompleteOrder}
                  disabled={isProcessing}
                  className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm uppercase tracking-wider rounded-xl shadow-xl shadow-red-900/40 flex items-center justify-center space-x-2 transition disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>{isProcessing ? 'Processing Order & Deducting Stock...' : `Pay $${cartTotal.toFixed(2)} Now`}</span>
                </button>
              </div>
            )}

          </div>

          {/* Right Column: Order Summary & Coupon */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
              <h3 className="text-base font-bold text-white border-b border-zinc-800 pb-3">
                Order Summary ({cart.length} items)
              </h3>

              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 text-xs">
                    <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded-lg border border-zinc-800 bg-zinc-950" />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white truncate">{item.name}</p>
                      <p className="text-[10px] text-zinc-500">Qty: {item.quantity} &bull; Vertical: {item.vertical}</p>
                    </div>
                    <span className="font-extrabold text-white">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {/* Coupon Engine Input */}
              <form onSubmit={handleApplyCoupon} className="pt-3 border-t border-zinc-800 space-y-2">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Coupon (e.g. WELCOME10, 3DOM20)"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs uppercase bg-zinc-950 border border-zinc-800 rounded-lg outline-none text-white focus:border-red-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold rounded-lg transition"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-[11px] text-red-500">{couponError}</p>}
                {appliedCoupon && (
                  <p className="text-[11px] text-emerald-400 font-bold">
                    Applied: {appliedCoupon.code} (-${discountAmount.toFixed(2)})
                  </p>
                )}
              </form>

              {/* Pricing Totals */}
              <div className="pt-3 border-t border-zinc-800 space-y-2 text-xs text-zinc-400">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-white">${cartSubtotal.toFixed(2)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-400 font-bold">
                    <span>Discount</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-zinc-800">
                  <span>Total Amount</span>
                  <span className="text-red-500">${cartTotal.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
