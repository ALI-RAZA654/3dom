'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, Truck, PackageCheck, ExternalLink, ArrowLeft, Clock } from 'lucide-react';
import { fetchOrderDetails } from '@/lib/api';

export default function OrderTrackingPage() {
  const params = useParams();
  const id = params?.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchOrderDetails(id)
      .then((data) => {
        setOrder(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Order not found');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center text-xs">
        Fetching order status...
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center space-y-4 p-4">
        <h2 className="text-xl font-bold">Order Not Found</h2>
        <p className="text-xs text-zinc-400">We couldn't locate order ID: {id}</p>
        <Link href="/3d-printing" className="px-6 py-2 bg-red-600 rounded-lg text-xs font-bold">
          Return to Store
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-800 pb-6 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-emerald-400 font-extrabold text-xs uppercase tracking-wider mb-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>Order Placed Successfully</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black">Order #{order.id}</h1>
          </div>

          <Link
            href="/3d-printing"
            className="flex items-center space-x-1.5 text-xs font-bold px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-zinc-700 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {/* Carrier Tracking Card */}
        <div className="bg-gradient-to-r from-red-950/40 via-zinc-900 to-zinc-900 border border-red-600/50 p-6 rounded-2xl space-y-4 shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-red-400 tracking-wider">Logistics Carrier</span>
              <h3 className="text-lg font-black text-white">{order.carrier} Express Logistics</h3>
              <p className="text-xs text-zinc-400">Tracking Code: <span className="font-mono font-bold text-white">{order.trackingNumber}</span></p>
            </div>

            <a
              href={order.trackingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center space-x-2 transition"
            >
              <span>Track on {order.carrier} Website</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>

          {/* Timeline Status */}
          <div className="pt-4 border-t border-zinc-800/80 grid grid-cols-3 gap-2 text-center text-xs">
            <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
              <Clock className="w-4 h-4 text-amber-400 mx-auto mb-1" />
              <span className="font-bold block text-white">Order Confirmed</span>
              <span className="text-[10px] text-zinc-500">Inventory Reserved</span>
            </div>
            <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
              <Truck className="w-4 h-4 text-red-500 mx-auto mb-1" />
              <span className="font-bold block text-white">{order.orderStatus}</span>
              <span className="text-[10px] text-zinc-500">Carrier Picked Up</span>
            </div>
            <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
              <PackageCheck className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <span className="font-bold block text-white">In Transit</span>
              <span className="text-[10px] text-zinc-500">ETA 2-3 Days</span>
            </div>
          </div>
        </div>

        {/* Order Details & Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Customer Shipping Address */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-3">
            <h4 className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Shipping Details</h4>
            <div className="text-xs text-zinc-300 space-y-1">
              <p className="font-bold text-white">{order.customer?.name}</p>
              <p>{order.customer?.email}</p>
              <p>{order.customer?.phone}</p>
              <p className="text-zinc-400 pt-1">{order.customer?.address}</p>
            </div>
          </div>

          {/* Payment Method & Total */}
          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-3">
            <h4 className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Payment Summary</h4>
            <div className="text-xs space-y-1.5">
              <div className="flex justify-between text-zinc-400">
                <span>Payment Method:</span>
                <span className="font-bold text-white">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Payment Status:</span>
                <span className="font-bold text-emerald-400 uppercase">{order.paymentStatus}</span>
              </div>
              {order.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Discount Applied:</span>
                  <span>-${order.discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-zinc-800">
                <span>Total Paid:</span>
                <span className="text-red-500">${order.finalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Purchased Items List */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
          <h4 className="text-xs font-bold uppercase text-zinc-400 tracking-wider">Purchased Items</h4>
          <div className="space-y-3">
            {order.items?.map((item: any) => (
              <div key={item.id} className="flex items-center space-x-4 p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg border border-zinc-800" />
                <div className="flex-1 min-w-0">
                  <h5 className="text-xs font-bold text-white truncate">{item.name}</h5>
                  <p className="text-[10px] text-zinc-500 capitalize">Vertical: {item.vertical} &bull; Qty: {item.quantity}</p>
                </div>
                <span className="text-xs font-black text-white">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
