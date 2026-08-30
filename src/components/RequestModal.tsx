'use client';

import React, { useState } from 'react';
import { X, Send, CheckCircle2, HeartHandshake } from 'lucide-react';
import { submitCustomRequest } from '@/lib/api';

export const RequestModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [itemDetails, setItemDetails] = useState('');
  const [requiredDate, setRequiredDate] = useState('');
  const [address, setAddress] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !itemDetails) {
      setError('Email and item details are required.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await submitCustomRequest({
        customerEmail: email,
        whatsappNumber: whatsapp,
        requestedItem: itemDetails,
        requiredDate: requiredDate,
        deliveryAddress: address,
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        setEmail('');
        setWhatsapp('');
        setItemDetails('');
        setRequiredDate('');
        setAddress('');
      }, 2500);
    } catch (err: any) {
      setError(err.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-zinc-950 text-white p-6 relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-zinc-400 hover:text-white p-1 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-600/20 text-red-500 rounded-xl border border-red-500/30">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Can't Find What You Need?</h3>
              <p className="text-xs text-zinc-400">
                Submit a custom procurement request. We source rare 3D parts, fashion apparel & beauty products.
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {success ? (
            <div className="text-center py-8 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto animate-bounce" />
              <h4 className="text-lg font-bold text-zinc-900">Request Submitted!</h4>
              <p className="text-xs text-zinc-600 max-w-xs mx-auto">
                Our procurement team has received your request. We will update you via WhatsApp & Email shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg font-medium">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">
                  Customer Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="your.name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-zinc-50 border border-zinc-300 rounded-lg outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">
                  WhatsApp Number
                </label>
                <input
                  type="tel"
                  placeholder="+1 555 019 2831 (Include country code)"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-zinc-50 border border-zinc-300 rounded-lg outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">
                  Requested Item / Brand / Model <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe item make, model, brand, specification (e.g. Voron Stealthburner toolhead, K-Beauty serum...)"
                  value={itemDetails}
                  onChange={(e) => setItemDetails(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs bg-zinc-50 border border-zinc-300 rounded-lg outline-none focus:border-black resize-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">
                    Required Date
                  </label>
                  <input
                    type="date"
                    value={requiredDate}
                    onChange={(e) => setRequiredDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-zinc-50 border border-zinc-300 rounded-lg outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-700 uppercase mb-1">
                    Delivery Address
                  </label>
                  <input
                    type="text"
                    placeholder="City, State / Zip"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs bg-zinc-50 border border-zinc-300 rounded-lg outline-none focus:border-black"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-red-900/30 flex items-center justify-center space-x-2 transition disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{loading ? 'Submitting...' : 'Submit Procurement Request'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
