'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, X, Plus, Minus, Trash2, Tag, ArrowRight, CheckCircle, AlertCircle, Sparkles, TrendingUp, Layers, Box } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { validateCoupon, fetchProducts } from '@/lib/api';

// Fallback recommendations if API products fetch is delayed
const RECOMMENDATIONS_FALLBACK = [
  {
    id: 'prod-rec-1',
    name: 'PLA+ High-Speed Filament 1.75mm 1kg',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1612815150330-80e90c888d22?auto=format&fit=crop&w=400&q=80',
    vertical: '3d-printing',
    category: 'Filaments',
    stock: 25,
  },
  {
    id: 'prod-rec-2',
    name: 'Hardened Steel Nozzle Kit 0.4mm (4 Pack)',
    price: 19.50,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
    vertical: '3d-printing',
    category: '3D Printer Parts',
    stock: 30,
  },
  {
    id: 'prod-rec-3',
    name: 'Textured PEI Spring Steel Build Plate',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
    vertical: '3d-printing',
    category: 'Printer Accessories',
    stock: 18,
  },
  {
    id: 'prod-rec-4',
    name: 'Over-Sized Oversized Korean Skate Tee',
    price: 39.00,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=400&q=80',
    vertical: 'fashion',
    category: 'Tops',
    stock: 15,
  },
  {
    id: 'prod-rec-5',
    name: 'Maison 3DOM Velvet Rose Eau De Parfum',
    price: 89.00,
    image: 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=400&q=80',
    vertical: 'beauty',
    category: 'Perfumes',
    stock: 12,
  },
];

export const CartDrawer: React.FC = () => {
  const {
    cart,
    addToCart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    appliedCoupon,
    setAppliedCoupon,
    discountAmount,
    cartTotal,
    discountTiers,
    activeTier,
    nextTier,
    itemsNeededForNextTier,
    progressiveDiscountPercent,
    progressiveDiscountAmount,
    totalSavedAmount,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');
  const [couponSuccess, setCouponSuccess] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>(RECOMMENDATIONS_FALLBACK);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Fetch recommendations based on cart categories
  useEffect(() => {
    if (cart.length > 0) {
      const activeVertical = cart[0].vertical || '3d-printing';
      fetchProducts({ vertical: activeVertical })
        .then((prods) => {
          if (prods && prods.length > 0) {
            const filtered = prods.filter((p: any) => !cart.some((c) => c.id === p.id)).slice(0, 4);
            if (filtered.length > 0) {
              setRecommendedProducts(filtered);
            }
          }
        })
        .catch((err) => console.error('Error fetching recommendations', err));
    }
  }, [cart]);

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

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-4 sm:p-5 bg-zinc-950 text-white flex items-center justify-between border-b border-zinc-800">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-white">Your Shopping Cart</h2>
                <p className="text-[10px] text-zinc-400">{cartItemCount} items selected</p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* ─── 📊 PROGRESSIVE DISCOUNT BULK PRICING BAR (Matches Client Reference) ─── */}
          {cart.length > 0 && (
            <div className="bg-zinc-900 text-white p-4 border-b border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-red-500 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5" />
                    Bulk Pricing
                  </span>
                  <p className="text-[11px] text-zinc-400 font-medium">
                    {cartItemCount} items in group
                  </p>
                </div>
                {activeTier && (
                  <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                    {activeTier.discountPercent}% OFF Unlocked
                  </span>
                )}
              </div>

              {/* Dynamic Next Tier Callout */}
              <div className="text-xs text-zinc-200 font-semibold bg-zinc-800/90 p-2.5 rounded-xl border border-zinc-700/80">
                {nextTier ? (
                  <span>
                    Add <strong className="text-red-400 font-black">{itemsNeededForNextTier} items</strong> to reach{' '}
                    <strong className="text-red-400 font-black">{nextTier.discountPercent}% off</strong> — save more automatically!
                  </span>
                ) : (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5" />
                    🎉 Maximum Bulk Discount Tier Unlocked! (22% OFF)
                  </span>
                )}
              </div>

              {/* Visual Multi-Node Progress Bar */}
              <div className="relative pt-3 pb-1 px-2">
                {/* Connector Line */}
                <div className="absolute top-4 left-3 right-3 h-1 bg-zinc-700 rounded-full" />
                <div
                  className="absolute top-4 left-3 h-1 bg-red-600 rounded-full transition-all duration-500"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(
                        0,
                        (cartItemCount / (discountTiers[discountTiers.length - 1]?.minQty || 12)) * 100
                      )
                    )}%`,
                  }}
                />

                {/* Nodes for each Tier */}
                <div className="relative flex justify-between items-center z-10">
                  {discountTiers.map((tier) => {
                    const isUnlocked = cartItemCount >= tier.minQty;
                    const isCurrent = activeTier?.id === tier.id;

                    return (
                      <div key={tier.id} className="flex flex-col items-center group">
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                            isUnlocked
                              ? 'bg-red-600 text-white shadow-md shadow-red-600/40 ring-2 ring-red-400'
                              : 'bg-zinc-800 border-2 border-zinc-600 text-zinc-500'
                          }`}
                        >
                          <span className="text-[9px] font-black">{tier.minQty}+</span>
                        </div>
                        <span
                          className={`text-[9px] font-extrabold mt-1 transition ${
                            isUnlocked ? 'text-red-400' : 'text-zinc-500'
                          }`}
                        >
                          {tier.discountPercent}%
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Cart Items List & Recommendations */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-5">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto text-zinc-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-bold text-zinc-900">Your cart is empty</h3>
                <p className="text-xs text-zinc-500 max-w-xs mx-auto">
                  Explore our 3D printing equipment, GenZ fashion, or beauty collections and add items to unlock progressive discounts!
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="mt-4 px-6 py-2.5 bg-zinc-900 text-white text-xs font-bold rounded-xl hover:bg-black transition"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="eyebrow text-[10px]">Cart Items ({cart.length})</div>
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center space-x-3.5 p-3 bg-zinc-50 rounded-2xl border border-zinc-200/80 transition hover:border-zinc-300"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-16 h-16 object-cover rounded-xl border bg-white shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <h4 className="text-xs font-bold text-zinc-900 truncate">
                          {item.name}
                        </h4>
                        <span className="text-xs font-extrabold text-zinc-900 shrink-0">
                          ${(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>

                      <p className="text-[10px] text-zinc-500 capitalize mt-0.5">
                        Category: <span className="font-semibold">{item.category || item.vertical}</span>
                      </p>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity Selector */}
                        <div className="flex items-center space-x-2 bg-white rounded-lg border border-zinc-200 px-2 py-0.5 shadow-sm">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="text-zinc-500 hover:text-black p-0.5"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-black px-1.5">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            className="text-zinc-500 hover:text-black p-0.5 disabled:opacity-30"
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
                ))}
              </div>
            )}

            {/* ─── 🛍️ AUTOMATIC RECOMMENDED PRODUCTS ("YOU MAY ALSO LIKE") ─── */}
            <div className="pt-3 border-t border-zinc-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-warm-accent" />
                  <h3 className="text-xs font-extrabold text-zinc-900 uppercase tracking-wider">
                    You May Also Like
                  </h3>
                </div>
                <span className="text-[10px] font-semibold text-zinc-500">Frequently Bought Together</span>
              </div>

              <div className="grid grid-cols-1 gap-2.5">
                {recommendedProducts.map((rec) => (
                  <div
                    key={rec.id}
                    className="flex items-center justify-between p-2.5 bg-warm-surface border border-warm-border rounded-2xl hover:border-warm-accent/30 transition group"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <img
                        src={rec.image}
                        alt={rec.name}
                        className="w-12 h-12 object-cover rounded-xl border border-warm-border bg-white shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-zinc-900 truncate max-w-[170px] group-hover:text-warm-accent transition">
                          {rec.name}
                        </p>
                        <p className="text-[10px] font-semibold text-warm-accent">${rec.price}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => addToCart(rec, 1)}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white text-[11px] font-extrabold rounded-xl transition shadow-warm-sm flex items-center space-x-1 shrink-0 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Coupon & Summary Footer */}
          {cart.length > 0 && (
            <div className="border-t border-zinc-200 p-4 sm:p-5 bg-zinc-50 space-y-3.5">
              
              {/* Promo Code Form */}
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Tag className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
                    <input
                      type="text"
                      placeholder="Promo code (e.g. 3DOM10, REF20)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs uppercase bg-white border border-zinc-300 rounded-xl outline-none focus:border-zinc-900"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isValidating || !couponInput.trim()}
                    className="px-4 py-2 bg-zinc-900 text-white text-xs font-bold rounded-xl hover:bg-black disabled:opacity-50 transition"
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
                  <div className="flex justify-between items-center bg-emerald-50 text-emerald-800 p-2 rounded-xl text-xs font-semibold border border-emerald-200">
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
              <div className="space-y-1.5 text-xs text-zinc-600 pt-1">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-zinc-900">${cartSubtotal.toFixed(2)}</span>
                </div>

                {progressiveDiscountAmount > 0 && (
                  <div className="flex justify-between text-red-600 font-bold">
                    <span>Bulk Progressive Discount ({progressiveDiscountPercent}%)</span>
                    <span>-${progressiveDiscountAmount.toFixed(2)}</span>
                  </div>
                )}

                {appliedCoupon && (
                  <div className="flex justify-between text-emerald-600 font-bold">
                    <span>Promo Coupon ({appliedCoupon.code})</span>
                    <span>-${(appliedCoupon.discountAmount || 0).toFixed(2)}</span>
                  </div>
                )}

                {totalSavedAmount > 0 && (
                  <div className="flex justify-between text-red-600 font-extrabold bg-red-50 p-1.5 rounded-lg border border-red-100">
                    <span>You Save</span>
                    <span>-${totalSavedAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-xs text-zinc-500">
                  <span>Estimated Shipping</span>
                  <span className="text-emerald-600 font-semibold">FREE</span>
                </div>

                <div className="flex justify-between text-sm font-extrabold text-zinc-900 pt-2 border-t border-zinc-200">
                  <span>Total</span>
                  <span className="text-base font-black text-slate-900">${cartTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full py-3 bg-slate-900 hover:bg-black text-white font-extrabold text-sm rounded-xl shadow-lg flex items-center justify-center space-x-2 transition"
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
