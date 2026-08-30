'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, Truck, ArrowLeft, PackageCheck } from 'lucide-react';

export default function OrderLookupPage() {
  const [orderId, setOrderId] = useState('');
  const router = useRouter();

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (orderId.trim()) {
      router.push(`/orders/${orderId.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white py-16 px-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-red-600/20 text-red-500 rounded-2xl flex items-center justify-center mx-auto border border-red-500/30">
            <Truck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black tracking-tight">Track Your Order</h1>
          <p className="text-xs text-zinc-400">
            Enter your Order ID below to get real-time tracking updates & carrier details.
          </p>
        </div>

        <form onSubmit={handleTrack} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-400 mb-2 uppercase tracking-wider">
              Order ID / Tracking Number
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. ORD-1001"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                required
                className="w-full py-3 pl-10 pr-4 bg-zinc-950 border border-zinc-800 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-red-500 transition"
              />
              <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition shadow-lg shadow-red-950/50 flex items-center justify-center space-x-2"
          >
            <span>Track Status</span>
            <PackageCheck className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-4 border-t border-zinc-800/80 text-center">
          <Link
            href="/3d-printing"
            className="inline-flex items-center space-x-1.5 text-xs text-zinc-400 hover:text-white transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Shop</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
