'use client';

import React, { useState } from 'react';
import { Gift, Share2, Copy, Check, Sparkles, Trophy, Tag, X, ChevronRight } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface RewardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'rewards' | 'referrals';
}

export const RewardsModal: React.FC<RewardsModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'rewards',
}) => {
  const [activeTab, setActiveTab] = useState<'rewards' | 'referrals'>(defaultTab);
  const [copiedLink, setCopiedLink] = useState(false);
  const [generatedCoupon, setGeneratedCoupon] = useState<string | null>(null);
  const [copiedCoupon, setCopiedCoupon] = useState(false);
  const { setAppliedCoupon, cartSubtotal } = useCart();

  if (!isOpen) return null;

  const referralLink = 'https://3dom.com?ref=USER7890';
  const rewardPoints = 350;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleGenerateCoupon = (discountPercent: number, codePrefix: string) => {
    const randomCode = `${codePrefix}-${Math.floor(1000 + Math.random() * 9000)}`;
    setGeneratedCoupon(randomCode);
    setCopiedCoupon(false);

    // Auto apply to cart
    const discountAmount = (cartSubtotal * discountPercent) / 100;
    setAppliedCoupon({
      code: randomCode,
      discountType: 'percentage',
      discountValue: discountPercent,
      discountAmount: discountAmount > 0 ? discountAmount : 15,
    });
  };

  const handleCopyCoupon = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCoupon(true);
    setTimeout(() => setCopiedCoupon(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="relative w-full max-w-lg bg-warm-card border border-warm-border rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-warm-accent/20 border border-warm-accent/30 flex items-center justify-center text-warm-accent">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white tracking-tight">3DOM Rewards & Referrals</h2>
              <p className="text-[11px] text-zinc-400">Earn points, refer friends & generate exclusive discount coupons</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-warm-border bg-warm-surface p-1.5 gap-2">
          <button
            onClick={() => setActiveTab('rewards')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 ${
              activeTab === 'rewards'
                ? 'bg-white text-slate-900 shadow-warm-sm border border-warm-border'
                : 'text-warm-muted hover:text-warm-text'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-500" />
            <span>My Rewards ({rewardPoints} pts)</span>
          </button>
          <button
            onClick={() => setActiveTab('referrals')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 ${
              activeTab === 'referrals'
                ? 'bg-white text-slate-900 shadow-warm-sm border border-warm-border'
                : 'text-warm-muted hover:text-warm-text'
            }`}
          >
            <Share2 className="w-4 h-4 text-warm-accent" />
            <span>Referral Club</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">

          {activeTab === 'rewards' && (
            <div className="space-y-5">
              {/* Points Card */}
              <div className="bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-warm-accent/10 border border-amber-500/20 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700">Available Balance</span>
                  <div className="text-3xl font-black text-slate-900 mt-0.5">{rewardPoints} <span className="text-sm font-semibold text-warm-muted">Points</span></div>
                  <p className="text-[11px] text-zinc-600 mt-0.5">100 Points = $10 Coupon Discount</p>
                </div>
                <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/20">
                  <Sparkles className="w-7 h-7" />
                </div>
              </div>

              {/* Redeem Coupon Options */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">Redeem Points for Coupons</h3>
                
                <div className="grid grid-cols-1 gap-2.5">
                  {/* Option 1 */}
                  <div className="flex items-center justify-between p-3.5 bg-warm-surface border border-warm-border rounded-2xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black text-xs">
                        10%
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">10% OFF Any Order</p>
                        <p className="text-[10px] text-warm-muted">Requires 100 Reward Points</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleGenerateCoupon(10, 'REWARD10')}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition shadow-warm-sm"
                    >
                      Redeem & Generate
                    </button>
                  </div>

                  {/* Option 2 */}
                  <div className="flex items-center justify-between p-3.5 bg-warm-surface border border-warm-border rounded-2xl">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-xl bg-warm-accent-light text-warm-accent flex items-center justify-center font-black text-xs">
                        15%
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900">15% OFF VIP Coupon</p>
                        <p className="text-[10px] text-warm-muted">Requires 200 Reward Points</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleGenerateCoupon(15, 'VIP15')}
                      className="px-3 py-1.5 bg-warm-accent hover:bg-red-700 text-white text-xs font-bold rounded-xl transition shadow-warm-sm"
                    >
                      Redeem & Generate
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'referrals' && (
            <div className="space-y-5">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-warm-accent-light text-warm-accent mx-auto flex items-center justify-center">
                  <Share2 className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">Invite Friends, Get $20 Coupon Each</h3>
                <p className="text-xs text-warm-muted max-w-xs mx-auto">
                  Share your personal referral link with friends. When they place their first order, you both get a 20% discount coupon!
                </p>
              </div>

              {/* Referral Link Copy Box */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Your Referral Link</label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    readOnly
                    value={referralLink}
                    className="flex-1 px-3 py-2 text-xs bg-warm-surface border border-warm-border rounded-xl font-mono text-slate-800 outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-2 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition flex items-center space-x-1.5 shrink-0"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedLink ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Quick Referral Coupon Generator */}
              <div className="bg-warm-surface border border-warm-border p-4 rounded-2xl space-y-3">
                <div className="flex items-center space-x-2">
                  <Tag className="w-4 h-4 text-warm-accent" />
                  <span className="text-xs font-bold text-slate-900">Instant Referral Coupon</span>
                </div>
                <p className="text-[11px] text-warm-muted">Generate a 20% OFF referral coupon instantly for your friend or yourself.</p>
                <button
                  onClick={() => handleGenerateCoupon(20, 'REF20')}
                  className="w-full py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-extrabold rounded-xl transition shadow-md flex items-center justify-center space-x-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Generate 20% OFF Referral Coupon</span>
                </button>
              </div>
            </div>
          )}

          {/* Generated Coupon Banner */}
          {generatedCoupon && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">🎉 Coupon Code Generated & Applied!</span>
              <div className="flex items-center justify-center space-x-3">
                <span className="text-lg font-black tracking-widest text-emerald-900 bg-white border border-emerald-300 px-4 py-1 rounded-xl font-mono">
                  {generatedCoupon}
                </span>
                <button
                  onClick={() => handleCopyCoupon(generatedCoupon)}
                  className="p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition"
                  title="Copy Coupon"
                >
                  {copiedCoupon ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-[11px] text-emerald-800 font-medium">This code has been automatically applied to your cart!</p>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-warm-surface border-t border-warm-border p-4 text-center">
          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-700 hover:text-black transition"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
};
