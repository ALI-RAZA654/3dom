'use client';

import React from 'react';
import Link from 'next/link';
import { Box, Shirt, Sparkles, ShieldCheck, Truck, RotateCcw, Headphones } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-zinc-950 text-zinc-400 text-sm border-t border-zinc-800">
      {/* Platform Features Bar */}
      <div className="border-b border-zinc-800/80 py-8 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex items-center space-x-4 justify-center md:justify-start">
            <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 text-red-500">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Express Logistics</h4>
              <p className="text-xs text-zinc-400">Tracked via DTDC, Bluedart & Delhivery</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 justify-center md:justify-start">
            <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 text-red-500">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Authentic Guarantee</h4>
              <p className="text-xs text-zinc-400">100% verified materials & original stock</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 justify-center md:justify-start">
            <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 text-red-500">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Easy Replacement</h4>
              <p className="text-xs text-zinc-400">Hassle-free 7-day store support</p>
            </div>
          </div>

          <div className="flex items-center space-x-4 justify-center md:justify-start">
            <div className="p-3 bg-zinc-900 rounded-xl border border-zinc-800 text-red-500">
              <Headphones className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-white text-base">Expert Consultation</h4>
              <p className="text-xs text-zinc-400">WhatsApp live support for custom sourcing</p>
            </div>
          </div>
        </div>
      </div>

      {/* Links & Verticals Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-5 gap-8">
        <div className="md:col-span-2 space-y-4">
          <Link href="/3d-printing" className="flex items-center">
            <span className="logo-wordmark text-3xl font-black text-white">3DOM</span>
          </Link>
          <p className="text-xs text-zinc-400 max-w-sm leading-relaxed">
            3DOM is an next-generation multi-vertical storefront platform unifying high-precision 3D printing equipment, trend-forward Korean fashion, and premium beauty essentials into one checkout infrastructure.
          </p>
          <div className="pt-2 text-xs text-zinc-500">
            Powered by Next.js &bull; Portable Client Build
          </div>
        </div>

        <div>
          <h5 className="font-bold text-white text-sm uppercase tracking-wider mb-4 flex items-center space-x-2">
            <Box className="w-4 h-4 text-red-500" />
            <span>3D Printing Lab</span>
          </h5>
          <ul className="space-y-2 text-xs">
            <li><Link href="/3d-printing" className="hover:text-white transition">3D Printers & Kits</Link></li>
            <li><Link href="/3d-printing" className="hover:text-white transition">Filaments (PLA, PETG, ABS)</Link></li>
            <li><Link href="/3d-printing" className="hover:text-white transition">Hotends & Nozzles</Link></li>
            <li><Link href="/3d-printing" className="hover:text-white transition">PEI Build Plates</Link></li>
            <li><Link href="/3d-printing" className="hover:text-white transition">Filament Dryers</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-white text-sm uppercase tracking-wider mb-4 flex items-center space-x-2">
            <Shirt className="w-4 h-4 text-amber-400" />
            <span>Korean Fashion</span>
          </h5>
          <ul className="space-y-2 text-xs">
            <li><Link href="/fashion" className="hover:text-white transition">Oversized Streetwear</Link></li>
            <li><Link href="/fashion" className="hover:text-white transition">Boxy Camp Shirts</Link></li>
            <li><Link href="/fashion" className="hover:text-white transition">Wide-Leg Cargo Pants</Link></li>
            <li><Link href="/fashion" className="hover:text-white transition">Y2K Skate Denim</Link></li>
            <li><Link href="/fashion" className="hover:text-white transition">Cyber Retro Watches</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-bold text-white text-sm uppercase tracking-wider mb-4 flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-rose-400" />
            <span>Beauty Store</span>
          </h5>
          <ul className="space-y-2 text-xs">
            <li><Link href="/beauty" className="hover:text-white transition">Maison Perfumes & Oils</Link></li>
            <li><Link href="/beauty" className="hover:text-white transition">Botanical Shampoos</Link></li>
            <li><Link href="/beauty" className="hover:text-white transition">Peptide Hair Masks</Link></li>
            <li><Link href="/beauty" className="hover:text-white transition">K-Glow Sheet Masks</Link></li>
            <li><Link href="/beauty" className="hover:text-white transition">Lip Sleeping Masks</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-zinc-900 py-6 text-center text-xs text-zinc-500">
        &copy; {new Date().getFullYear()} 3DOM E-Commerce Platform. All rights reserved. Built for fast multi-vertical commerce.
      </div>
    </footer>
  );
};
