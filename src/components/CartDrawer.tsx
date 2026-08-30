'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, X, Plus, Minus, Trash2, Tag, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { validateCoupon } from '@/lib/api';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    appliedCoupon,
    setAppliedCoupon,
    discountAmount,
    cartTotal,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  if (!isCartOpen) return null;

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    setCouponError('');
    setCouponSuccess('');
    setIsValidating(true);

    try {
      const res = await validateCoupon(couponInput.trim(), cartSubtotal);
      setAppliedCoupon(res);
      setCouponSuccess(`Coupon '${res.code}' applied! Saved $${res.discountAmount.toFixed(2)}`);
      setCouponInput('');
    } catch (err: any) {
      setCouponError(err.message || 'Invalid coupon code');
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-4 sm:p-6 bg-zinc-950 text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-red-500" />
              <h2 className="text-lg font-bold text-white">Universal Shopping Cart</h2>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto text-zinc-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-zinc-900">Your cart is empty</h3>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                  Explore our 3D printing equipment, GenZ fashion, or beauty collections and add items to your cart.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 px-6 py-2.5 bg-zinc-900 text-white text-xs font-bold rounded-lg hover:bg-black transition"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-4 p-3 bg-zinc-50 rounded-xl border border-zinc-200/80 transition hover:border-zinc-300"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg border bg-white"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-zinc-900 truncate max-w-[160px]">
                        {item.name}
                      </h4>
                      <span className="text-xs font-extrabold text-zinc-900">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    <p className="text-[11px] text-zinc-500 capitalize mt-0.5">
                      Store: <span className="font-semibold">{item.vertical}</span>
                    </p>

                    {/* Stock Warning */}
                    {item.stock <= 3 && (
                      <p className="text-[10px] text-amber-600 font-semibold">
                        Only {item.stock} left in stock!
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-2">
                      {/* Quantity Selector */}
                      <div className="flex items-center space-x-2 bg-white rounded-md border border-zinc-200 px-2 py-0.5">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="text-zinc-500 hover:text-black"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold px-1">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="text-zinc-500 hover:text-black disabled:opacity-30"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-500 hover:text-red-700 p-1 transition"
                        title="Remove item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Coupon & Summary Footer */}
          {cart.length > 0 && (
            <div className="border-t border-zinc-200 p-4 sm:p-6 bg-zinc-50 space-y-4">
              {/* Promo Code Form */}
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 absolute left-3 top-3 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="Promo code (e.g. WELCOME10, 3DOM20)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs uppercase bg-white border border-zinc-300 rounded-lg outline-none focus:border-zinc-900"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isValidating || !couponInput.trim()}
                    className="px-4 py-2 bg-zinc-900 text-white text-xs font-bold rounded-lg hover:bg-black disabled:opacity-50 transition"
                  >
                    Apply
                  </button>
                </div>

                {couponError && (
                  <p className="text-xs text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{couponError}</span>
                  </p>
                )}

                {couponSuccess && (
                  <p className="text-xs text-emerald-600 flex items-center space-x-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>{couponSuccess}</span>
                  </p>
                )}

                {appliedCoupon && (
                  <div className="flex justify-between items-center bg-emerald-50 text-emerald-800 p-2 rounded-md text-xs font-semibold">
                    <span>Applied: {appliedCoupon.code}</span>
                    <button
                      onClick={() => setAppliedCoupon(null)}
                      className="text-emerald-900 underline font-bold"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </form>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-zinc-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-zinc-900">${cartSubtotal.toFixed(2)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Discount</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Estimated Shipping</span>
                  <span className="text-emerald-600 font-semibold">FREE</span>
                </div>

                <div className="flex justify-between text-sm font-extrabold text-zinc-900 pt-2 border-t">
                  <span>Total</span>
                  <span className="text-base text-red-600">${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-red-900/30 flex items-center justify-center space-x-2 transition"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
