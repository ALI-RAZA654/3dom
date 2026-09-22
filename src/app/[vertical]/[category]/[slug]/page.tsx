'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Star, ShoppingBag, ArrowLeft, Check, Truck, ShieldCheck, MapPin } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { fetchProductBySlug, fetchProductReviews, submitProductReview } from '@/lib/api';

const PRINTER_SVG_FALLBACK = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500"><rect width="500" height="500" fill="%23f8fafc" rx="16"/><rect x="70" y="70" width="360" height="360" rx="24" fill="%230f172a" stroke="%23334155" stroke-width="6"/><rect x="100" y="100" width="300" height="250" rx="14" fill="%23020617"/><path d="M140 150 h220 M250 150 v100" stroke="%23dc2626" stroke-width="6" stroke-linecap="round"/><polygon points="232,250 268,250 250,280" fill="%23ef4444"/><rect x="160" y="285" width="180" height="16" fill="%23334155" rx="6"/><rect x="110" y="375" width="280" height="34" rx="10" fill="%231e293b"/><circle cx="360" cy="392" r="9" fill="%23ef4444"/><text x="250" y="445" font-family="sans-serif" font-weight="900" font-size="18" fill="%230f172a" text-anchor="middle" letter-spacing="2">3DOM PRO 3D PRINTER</text></svg>`;

// Fallback product matching image 2 if fetch yields nothing
const DEFAULT_PDP_PRODUCT = {
  id: 'forge-a1-mini',
  slug: 'forge-a1-mini',
  name: 'Forge A1 Mini',
  brand: 'FORGE',
  vertical: '3d-printing',
  category: 'Printers',
  price: 28999,
  originalPrice: 34999,
  rating: 4.5,
  ratingCount: 2841,
  answeredQuestions: 316,
  image: PRINTER_SVG_FALLBACK,
  description: 'High-precision Core-XY enclosed auto-leveling 3D printer with 500mm/s acceleration and active flow compensation.',
  stock: 12,
  attributes: {
    'BUILD VOLUME': '180 × 180 × 180 mm',
    'MAX SPEED': '500 mm/s · 20,000 mm/s² accel',
    'HOTEND': 'All-metal, 300°C, quick swap',
    'BED': 'Textured PEI, 100°C',
    'LEVELLING': 'Fully automatic, per-print',
    'MATERIALS': 'PLA, PETG, TPU',
    'CONNECTIVITY': 'Wi-Fi, LAN, USB-C, app',
    'WARRANTY': '2 years, on-site in 14 cities'
  }
};

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { addToCart } = useCart();

  const [product, setProduct] = useState<any>(DEFAULT_PDP_PRODUCT);
  const [loading, setLoading] = useState<boolean>(true);

  // Configuration selection
  const [selectedConfig, setSelectedConfig] = useState<'standard' | 'ams' | 'enclosure'>('standard');

  // Add-ons checkboxes
  const [addOnPei, setAddOnPei] = useState<boolean>(false);
  const [addOnPla, setAddOnPla] = useState<boolean>(false);
  const [addOnCare, setAddOnCare] = useState<boolean>(false);

  // Delivery Pin Code state
  const [pincode, setPincode] = useState<string>('560001');
  const [isEditingPincode, setIsEditingPincode] = useState<boolean>(false);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchProductBySlug(slug)
      .then((data) => {
        if (data) {
          const isFactoryPeoplePhoto = data.image && (data.image.includes('photo-1581092160607') || data.image.startsWith('/images/'));
          setProduct({
            ...DEFAULT_PDP_PRODUCT,
            ...data,
            image: isFactoryPeoplePhoto ? PRINTER_SVG_FALLBACK : data.image,
            attributes: {
              ...DEFAULT_PDP_PRODUCT.attributes,
              ...(data.attributes || {})
            }
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('API fetch error fallback to default:', err);
        setLoading(false);
      });
  }, [slug]);

  // Calculate Base + Config + Add-ons Total
  const configPriceExtra = selectedConfig === 'ams' ? 12000 : selectedConfig === 'enclosure' ? 8000 : 0;
  const addOnTotal = (addOnPei ? 2699 : 0) + (addOnPla ? 2199 : 0) + (addOnCare ? 3499 : 0);
  const finalPrice = product.price + configPriceExtra + addOnTotal;

  const handleBuyNow = () => {
    addToCart(
      {
        ...product,
        price: finalPrice,
        name: `${product.name} (${selectedConfig === 'standard' ? 'Standard' : selectedConfig === 'ams' ? 'AMS' : 'Enclosure'})`
      },
      1
    );
    router.push('/checkout');
  };

  const handleAddToCart = () => {
    addToCart(
      {
        ...product,
        price: finalPrice,
        name: `${product.name} (${selectedConfig === 'standard' ? 'Standard' : selectedConfig === 'ams' ? 'AMS' : 'Enclosure'})`
      },
      1
    );
  };

  return (
    <div className="bg-[#F8F9FA] text-slate-900 min-h-screen pt-[140px] pb-16 font-sans">
      <div className="max-w-[1300px] mx-auto px-4 sm:px-6">
        
        {/* Back Link */}
        <button
          onClick={() => router.back()}
          className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-600 hover:text-black mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </button>

        {/* MAIN PRODUCT GRID (IMAGE LEFT + CHECKOUT DETAILS RIGHT) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* LEFT COLUMN: IMAGE GALLERY WITH GRID BACKGROUND */}
          <div className="lg:col-span-6">
            <div className="relative aspect-square w-full rounded-xl border border-slate-200 overflow-hidden bg-white flex items-center justify-center p-4 shadow-2xs">
              
              {/* Subtle Engineering Grid Background Pattern */}
              <div
                className="absolute inset-0 opacity-[0.08] pointer-events-none"
                style={{
                  backgroundImage: `
                    linear-gradient(to right, #000 1px, transparent 1px),
                    linear-gradient(to bottom, #000 1px, transparent 1px)
                  `,
                  backgroundSize: '20px 20px'
                }}
              />

              <img
                src={product.image || PRINTER_SVG_FALLBACK}
                alt={product.name}
                className="relative z-10 w-full h-full object-contain p-2 drop-shadow-sm"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = PRINTER_SVG_FALLBACK;
                }}
              />
            </div>
          </div>

          {/* RIGHT COLUMN: PRODUCT INFO & CHECKOUT ACTIONS */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* Title & Ratings Header */}
            <div>
              <span className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">
                {product.brand || 'FORGE'}
              </span>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-0.5">
                {product.name}
              </h1>

              {/* Rating Row */}
              <div className="flex items-center space-x-2 mt-2 text-xs">
                <span className="bg-black text-white px-2 py-0.5 rounded font-bold flex items-center space-x-1 text-[11px]">
                  <span>{product.rating}</span>
                  <Star className="w-3 h-3 fill-white" />
                </span>
                <span className="text-slate-500 font-medium">
                  {product.ratingCount || 2841} ratings · {product.answeredQuestions || 316} answered questions
                </span>
              </div>
            </div>

            {/* Price Block */}
            <div className="space-y-1">
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-black text-slate-900">
                  ₹{finalPrice.toLocaleString('en-IN')}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-slate-400 line-through font-medium">
                    ₹{(product.originalPrice + configPriceExtra).toLocaleString('en-IN')}
                  </span>
                )}
                <span className="bg-red-600 text-white text-xs font-black px-2 py-0.5 rounded uppercase tracking-wider">
                  17% OFF
                </span>
              </div>

              <div className="text-[11px] text-slate-500 font-medium space-y-0.5 pt-1">
                <p>Inclusive of all taxes · GST invoice on every order</p>
                <p>No-cost EMI from <span className="font-bold text-slate-900">₹2,417/mo</span> · 12 months</p>
              </div>
            </div>

            {/* CONFIGURATION SELECTOR */}
            <div>
              <h3 className="text-xs font-bold text-slate-900 mb-2.5">Configuration</h3>
              <div className="grid grid-cols-3 gap-3 text-left">
                <button
                  onClick={() => setSelectedConfig('standard')}
                  className={`p-3 rounded-lg border text-left transition ${
                    selectedConfig === 'standard'
                      ? 'border-red-600 bg-red-50/20 text-slate-900 ring-1 ring-red-600'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="text-xs font-bold">Standard</div>
                  <div className="text-[10px] text-slate-500 font-medium">0.4mm nozzle</div>
                </button>

                <button
                  onClick={() => setSelectedConfig('ams')}
                  className={`p-3 rounded-lg border text-left transition ${
                    selectedConfig === 'ams'
                      ? 'border-red-600 bg-red-50/20 text-slate-900 ring-1 ring-red-600'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="text-xs font-bold">+ AMS 4-colour</div>
                  <div className="text-[10px] text-slate-500 font-medium">auto material system</div>
                </button>

                <button
                  onClick={() => setSelectedConfig('enclosure')}
                  className={`p-3 rounded-lg border text-left transition ${
                    selectedConfig === 'enclosure'
                      ? 'border-red-600 bg-red-50/20 text-slate-900 ring-1 ring-red-600'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="text-xs font-bold">+ Enclosure</div>
                  <div className="text-[10px] text-slate-500 font-medium">ABS / ASA ready</div>
                </button>
              </div>
            </div>

            {/* ADD-ONS SECTION */}
            <div>
              <h3 className="text-xs font-bold text-slate-900 mb-2">Add-ons</h3>
              <div className="space-y-2">
                <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white cursor-pointer hover:border-slate-300 text-xs">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={addOnPei}
                      onChange={(e) => setAddOnPei(e.target.checked)}
                      className="accent-red-600 w-4 h-4 rounded cursor-pointer"
                    />
                    <span className="font-semibold text-slate-800">Extra textured PEI plate</span>
                  </div>
                  <span className="font-bold text-slate-900">+ ₹2,699</span>
                </label>

                <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white cursor-pointer hover:border-slate-300 text-xs">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={addOnPla}
                      onChange={(e) => setAddOnPla(e.target.checked)}
                      className="accent-red-600 w-4 h-4 rounded cursor-pointer"
                    />
                    <span className="font-semibold text-slate-800">PLA+ starter 3-pack</span>
                  </div>
                  <span className="font-bold text-slate-900">+ ₹2,199</span>
                </label>

                <label className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-white cursor-pointer hover:border-slate-300 text-xs">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={addOnCare}
                      onChange={(e) => setAddOnCare(e.target.checked)}
                      className="accent-red-600 w-4 h-4 rounded cursor-pointer"
                    />
                    <span className="font-semibold text-slate-800">2-yr on-site LuxeLoom Care</span>
                  </div>
                  <span className="font-bold text-slate-900">+ ₹3,499</span>
                </label>
              </div>
            </div>

            {/* ACTION BUTTONS: ADD TO CART & BUY NOW */}
            <div className="grid grid-cols-2 gap-4 pt-2">
              <button
                onClick={handleAddToCart}
                className="py-3.5 px-4 bg-white border-2 border-slate-900 hover:bg-slate-50 text-slate-900 rounded-lg text-xs font-black uppercase tracking-wider transition"
              >
                Add to cart · ₹{finalPrice.toLocaleString('en-IN')}
              </button>

              <button
                onClick={handleBuyNow}
                className="py-3.5 px-4 bg-slate-900 hover:bg-black text-white rounded-lg text-xs font-black uppercase tracking-wider transition shadow-md"
              >
                Buy now
              </button>
            </div>

            {/* STOCK & DELIVERY PINCODE BOX */}
            <div className="p-3.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-medium text-slate-700">
                  In stock in Bengaluru · Delivered by <strong className="font-bold text-slate-900">Fri, 6 Sep</strong> to {pincode}
                </span>
              </div>
              
              {isEditingPincode ? (
                <div className="flex items-center space-x-1">
                  <input
                    type="text"
                    value={pincode}
                    onChange={(e) => setPincode(e.target.value)}
                    className="w-16 px-1 py-0.5 border border-slate-300 rounded text-center text-xs"
                  />
                  <button
                    onClick={() => setIsEditingPincode(false)}
                    className="text-red-600 font-bold"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditingPincode(true)}
                  className="text-red-600 font-bold hover:underline"
                >
                  Change
                </button>
              )}
            </div>

            {/* SPECIFICATIONS GRID TABLE */}
            <div className="rounded-lg border border-slate-200 overflow-hidden bg-white">
              <div className="grid grid-cols-2 divide-x divide-y divide-slate-200 text-xs">
                
                <div className="p-3">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">BUILD VOLUME</div>
                  <div className="font-bold text-slate-900 mt-0.5">
                    {product.attributes?.['BUILD VOLUME'] || '180 × 180 × 180 mm'}
                  </div>
                </div>

                <div className="p-3">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">MAX SPEED</div>
                  <div className="font-bold text-slate-900 mt-0.5">
                    {product.attributes?.['MAX SPEED'] || '500 mm/s · 20,000 mm/s² accel'}
                  </div>
                </div>

                <div className="p-3">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">HOTEND</div>
                  <div className="font-bold text-slate-900 mt-0.5">
                    {product.attributes?.['HOTEND'] || 'All-metal, 300°C, quick swap'}
                  </div>
                </div>

                <div className="p-3">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">BED</div>
                  <div className="font-bold text-slate-900 mt-0.5">
                    {product.attributes?.['BED'] || 'Textured PEI, 100°C'}
                  </div>
                </div>

                <div className="p-3">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">LEVELLING</div>
                  <div className="font-bold text-slate-900 mt-0.5">
                    {product.attributes?.['LEVELLING'] || 'Fully automatic, per-print'}
                  </div>
                </div>

                <div className="p-3">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">MATERIALS</div>
                  <div className="font-bold text-slate-900 mt-0.5">
                    {product.attributes?.['MATERIALS'] || 'PLA, PETG, TPU'}
                  </div>
                </div>

                <div className="p-3">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CONNECTIVITY</div>
                  <div className="font-bold text-slate-900 mt-0.5">
                    {product.attributes?.['CONNECTIVITY'] || 'Wi-Fi, LAN, USB-C, app'}
                  </div>
                </div>

                <div className="p-3">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">WARRANTY</div>
                  <div className="font-bold text-slate-900 mt-0.5">
                    {product.attributes?.['WARRANTY'] || '2 years, on-site in 14 cities'}
                  </div>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
