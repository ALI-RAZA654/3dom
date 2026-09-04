'use client';

import React from 'react';
import Link from 'next/link';
import { Box, Shirt, Sparkles, ShieldCheck, Truck, RotateCcw, Headphones } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white text-slate-600 text-sm border-t border-slate-200 mt-auto">
      {/* Platform Features Bar */}
      <div className="border-b border-slate-100 py-8 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex items-center space-x-4 justify-center md:justify-start">
            <div className="p-3 bg-red-50 rounded-2xl border border-red-100 text-red-600">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">Express Logistics</h4>
              <p className="text-xs text-slate-500">Tracked via DTDC, Bluedart & Delhivery</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 justify-center md:justify-start">
            <div className="p-3 bg-red-50 rounded-2xl border border-red-100 text-red-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">Authentic Guarantee</h4>
              <p className="text-xs text-slate-500">100% verified materials & original stock</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 justify-center md:justify-start">
            <div className="p-3 bg-red-50 rounded-2xl border border-red-100 text-red-600">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">Easy Replacement</h4>
              <p className="text-xs text-slate-500">Hassle-free 7-day store support</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 justify-center md:justify-start">
            <div className="p-3 bg-red-50 rounded-2xl border border-red-100 text-red-600">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-900 text-base">Expert Consultation</h4>
              <p className="text-xs text-slate-500">WhatsApp live support for custom sourcing</p>
            </div>
          </div>
        </div>
      </div>

      {/* Links & Verticals Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-2 space-y-4">
          <Link href="/3d-printing" className="flex items-center">
            <span className="logo-wordmark text-3xl font-black text-red-600">3DOM</span>
          </Link>
          <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
            3DOM is a next-generation multi-vertical e-commerce platform unifying high-precision 3D printing equipment, trend-forward Korean fashion, and luxury beauty essentials into one unified checkout.
          </p>
          <div className="pt-2 text-xs text-slate-400 font-semibold">
            Redesigned Multi-Store Architecture &bull; Fast Local & Global Delivery
          </div>
        </div>

        <div>
          <h5 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-4 flex items-center space-x-2">
            <Box className="w-4 h-4 text-red-600" />
            <span>3D Printing Lab</span>
          </h5>
          <ul className="space-y-2 text-xs">
            <li><Link href="/3d-printing" className="hover:text-red-600 transition">3D Printers & Kits</Link></li>
            <li><Link href="/3d-printing" className="hover:text-red-600 transition">Filaments (PLA, PETG, ABS)</Link></li>
            <li><Link href="/3d-printing" className="hover:text-red-600 transition">Hotends & Nozzles</Link></li>
            <li><Link href="/3d-printing" className="hover:text-red-600 transition">PEI Build Plates</Link></li>
            <li><Link href="/3d-printing" className="hover:text-red-600 transition">Filament Dryers</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-4 flex items-center space-x-2">
            <Shirt className="w-4 h-4 text-amber-600" />
            <span>Korean Fashion</span>
          </h5>
          <ul className="space-y-2 text-xs">
            <li><Link href="/fashion" className="hover:text-red-600 transition">Oversized Streetwear</Link></li>
            <li><Link href="/fashion" className="hover:text-red-600 transition">Boxy Camp Shirts</Link></li>
            <li><Link href="/fashion" className="hover:text-red-600 transition">Wide-Leg Cargo Pants</Link></li>
            <li><Link href="/fashion" className="hover:text-red-600 transition">Y2K Skate Denim</Link></li>
            <li><Link href="/fashion" className="hover:text-red-600 transition">Cyber Retro Watches</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-slate-900 text-sm uppercase tracking-wider mb-4 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-rose-600" />
            <span>Beauty Store</span>
          </h5>
          <ul className="space-y-2 text-xs">
            <li><Link href="/beauty" className="hover:text-red-600 transition">Maison Perfumes & Oils</Link></li>
            <li><Link href="/beauty" className="hover:text-red-600 transition">Botanical Shampoos</Link></li>
            <li><Link href="/beauty" className="hover:text-red-600 transition">Peptide Hair Masks</Link></li>
            <li><Link href="/beauty" className="hover:text-red-600 transition">K-Glow Sheet Masks</Link></li>
            <li><Link href="/beauty" className="hover:text-red-600 transition">Lip Sleeping Masks</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-100 py-6 text-center text-xs text-slate-400">
        &copy; {new Date().getFullYear()} 3DOM E-Commerce Platform. All rights reserved. Professional storefront design.
      </div>
    </footer>
  );
};
