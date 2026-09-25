'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Star,
  ShoppingBag,
  SlidersHorizontal,
  RotateCcw,
  Check,
  ChevronDown,
  ArrowUpDown,
  Zap,
  Truck,
  Eye,
  Tag
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { fetchProducts } from '@/lib/api';

// High quality mock products matching the catalog design
const INITIAL_PRODUCTS = [
  {
    id: 'forge-a1-mini',
    slug: 'forge-a1-mini',
    name: 'Forge A1 Mini',
    vertical: '3d-printing',
    category: 'Printers',
    brand: 'Forge',
    technology: 'FDM / filament',
    price: 28999,
    originalPrice: 34999,
    rating: 4.5,
    ratingCount: 2841,
    tag: 'BESTSELLER',
    tagColor: 'bg-slate-900 text-white',
    image: 'https://images.unsplash.com/photo-1612815150330-80e90c888d22?auto=format&fit=crop&w=800&q=80',
    subSpecs: 'Core-XY · 180×180×180 · 500 mm/s',
    stock: 12,
    attributes: {
      buildVolume: '180 x 180 x 180 mm',
      maxSpeed: '500 mm/s · 20,000 mm/s² accel',
      hotend: 'All-metal, 300°C, quick swap',
      bed: 'Textured PEI, 100°C',
      levelling: 'Fully automatic, per-print',
      materials: 'PLA, PETG, TPU',
      connectivity: 'Wi-Fi, LAN, USB-C, app',
      warranty: '2 years, on-site in 14 cities'
    }
  },
  {
    id: 'forge-a1-pro-ams',
    slug: 'forge-a1-pro-ams',
    name: 'Forge A1 Pro AMS',
    vertical: '3d-printing',
    category: 'Printers',
    brand: 'Forge',
    technology: 'FDM / filament',
    price: 62999,
    originalPrice: 71999,
    rating: 4.6,
    ratingCount: 1120,
    tag: 'NEW',
    tagColor: 'bg-slate-900 text-white',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    subSpecs: '4-colour AMS · 256³ build · enclosed',
    stock: 8,
    attributes: {
      buildVolume: '256 x 256 x 256 mm',
      maxSpeed: '500 mm/s',
      hotend: 'All-metal 300°C',
      bed: 'PEI Flex Plate 110°C',
      levelling: 'Auto-bed levelling',
      materials: 'PLA, PETG, ABS, ASA, TPU',
      connectivity: 'Wi-Fi, Mobile App',
      warranty: '2 years warranty'
    }
  },
  {
    id: 'ender-craft-9',
    slug: 'ender-craft-9',
    name: 'Ender Craft 9',
    vertical: '3d-printing',
    category: 'Printers',
    brand: 'Ender',
    technology: 'FDM / filament',
    price: 16999,
    originalPrice: 21999,
    rating: 4.1,
    ratingCount: 5210,
    tag: 'BUDGET',
    tagColor: 'bg-black text-white',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    subSpecs: 'Bedslinger · 220³ · beginner kit',
    stock: 15,
    attributes: {
      buildVolume: '220 x 220 x 250 mm',
      maxSpeed: '250 mm/s',
      hotend: 'Brass 260°C',
      bed: 'Carborundum Glass',
      levelling: 'CR Touch 16-point',
      materials: 'PLA, PETG',
      connectivity: 'SD Card, USB-C',
      warranty: '1 year warranty'
    }
  },
  {
    id: 'halo-photon-m5s',
    slug: 'halo-photon-m5s',
    name: 'Halo Photon M5s 12K',
    vertical: '3d-printing',
    category: 'Printers',
    brand: 'Halo',
    technology: 'Resin / MSLA',
    price: 44999,
    originalPrice: 52999,
    rating: 4.8,
    ratingCount: 890,
    tag: 'BESTSELLER',
    tagColor: 'bg-slate-900 text-white',
    image: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80',
    subSpecs: '12K Mono LCD · Level-Free · 105mm/h',
    stock: 5,
    attributes: {
      buildVolume: '200 x 123 x 200 mm',
      maxSpeed: '105 mm/h',
      hotend: '12K Mono Screen',
      bed: 'Laser Engraved Plate',
      levelling: 'Level-Free Auto',
      materials: 'UV 405nm Resin',
      connectivity: 'Wi-Fi, USB',
      warranty: '1 year warranty'
    }
  },
  {
    id: 'loomfil-tough-pla-black',
    slug: 'loomfil-tough-pla-black',
    name: 'Loomfil Tough PLA+ 1.75mm (1kg)',
    vertical: '3d-printing',
    category: 'Filament',
    brand: 'Loomfil',
    technology: 'FDM / filament',
    price: 1899,
    originalPrice: 2499,
    rating: 4.7,
    ratingCount: 3420,
    tag: 'TOP RATED',
    tagColor: 'bg-emerald-600 text-white',
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    subSpecs: 'High Speed 600mm/s · Jet Black · Warp Free',
    stock: 50,
    attributes: {
      material: 'PLA+',
      diameter: '1.75mm',
      weight: '1.0 kg spool',
      temp: '190°C - 230°C'
    }
  },
  {
    id: 'forge-scan-pro-3d',
    slug: 'forge-scan-pro-3d',
    name: 'Forge Scan Pro 3D Scanner',
    vertical: '3d-printing',
    category: 'Parts & upgrades',
    brand: 'Forge',
    technology: '3D scanners',
    price: 49999,
    originalPrice: 59999,
    rating: 4.4,
    ratingCount: 145,
    tag: 'NEW',
    tagColor: 'bg-slate-900 text-white',
    image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80',
    subSpecs: '0.02mm Precision · 24-bit Full-Color Scan',
    stock: 4,
    attributes: {
      precision: '0.02 mm',
      scanRate: '15 fps',
      lightSource: 'NIR + Blue Light'
    }
  }
];

function ProductsCatalogContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addToCart } = useCart();

  // Filter States
  const [quickPick, setQuickPick] = useState<string>('all');
  const [maxBudget, setMaxBudget] = useState<number>(120000);
  const [selectedTech, setSelectedTech] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [under50kOffer, setUnder50kOffer] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'popularity' | 'price_asc' | 'price_desc' | 'rating'>('popularity');
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>('3D Printers');

  // Multi-checkbox helper
  const toggleArrayFilter = (arr: string[], setArr: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    if (arr.includes(item)) {
      setArr(arr.filter((i) => i !== item));
    } else {
      setArr([...arr, item]);
    }
  };

  const handleResetFilters = () => {
    setQuickPick('all');
    setMaxBudget(120000);
    setSelectedTech([]);
    setSelectedBrands([]);
    setSelectedCategories([]);
    setUnder50kOffer(false);
    setSortBy('popularity');
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    return INITIAL_PRODUCTS.filter((p) => {
      // Quick pick filter
      if (quickPick === 'instock' && p.stock <= 0) return false;
      if (quickPick === 'rating' && p.rating < 4.5) return false;
      if (quickPick === 'onsale' && (!p.originalPrice || p.originalPrice <= p.price)) return false;
      if (quickPick === 'new' && p.tag !== 'NEW') return false;

      // Budget filter
      if (p.price > maxBudget) return false;

      // Technology filter
      if (selectedTech.length > 0 && !selectedTech.includes(p.technology)) return false;

      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) return false;

      // Category filter
      if (selectedCategories.length > 0 && !selectedCategories.includes(p.category)) return false;

      // Offers filter
      if (under50kOffer && p.price > 50000) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price_asc') return a.price - b.price;
      if (sortBy === 'price_desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.ratingCount - a.ratingCount; // Popularity
    });
  }, [quickPick, maxBudget, selectedTech, selectedBrands, selectedCategories, under50kOffer, sortBy]);

  return (
    <div className="bg-[#F8F9FA] text-slate-900 min-h-screen pt-[110px] sm:pt-[120px] pb-16 font-sans">
      
      {/* TOP CATEGORY RIBBON / HEADER BAR */}
      <div className="bg-white border-b border-slate-200 shadow-2xs relative z-10">
        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 flex items-center justify-between text-xs overflow-x-auto whitespace-nowrap scrollbar-none py-1.5">
          <div className="flex items-center space-x-6">
            <button className="bg-black text-white px-3 py-2 rounded font-bold flex items-center space-x-2 text-xs hover:bg-slate-800 transition">
              <span>■ Shop categories</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            <nav className="flex items-center space-x-6 text-slate-700 font-semibold">
              {[
                '3D Printers',
                'Resin',
                'Filament',
                'Parts & Nozzles',
                'Scanners',
                'Under ₹50k'
              ].map((tab) => {
                const isActive = activeCategoryTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => setActiveCategoryTab(tab)}
                    className={`py-2 border-b-2 transition ${
                      isActive
                        ? 'border-red-600 text-red-600 font-bold'
                        : 'border-transparent hover:text-black'
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="hidden lg:flex items-center space-x-2 font-bold text-red-600 cursor-pointer hover:underline">
            <span>Deals of the week</span>
          </div>
        </div>
      </div>

      {/* MAIN LAYOUT: SIDEBAR + CATALOG GRID */}
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT SIDEBAR: SMART FILTERS */}
          <aside className="lg:col-span-3 bg-white rounded-xl border border-slate-200 p-4 shadow-2xs space-y-6">
            
            {/* Header */}
            <div className="bg-black text-white -mx-4 -mt-4 p-4 rounded-t-xl flex items-center justify-between">
              <div>
                <h2 className="text-sm font-black uppercase tracking-wider">SMART FILTERS</h2>
                <p className="text-[10px] text-slate-400">Refine your results</p>
              </div>
              <button
                onClick={handleResetFilters}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-2.5 py-1 rounded border border-slate-700 transition"
              >
                Reset
              </button>
            </div>

            {/* QUICK PICKS */}
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-wider text-slate-400 mb-2.5">
                QUICK PICKS
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'instock', label: 'In stock' },
                  { id: 'rating', label: '4.5★ & up' },
                  { id: 'onsale', label: 'On sale' },
                  { id: 'new', label: 'New arrivals' }
                ].map((pick) => {
                  const active = quickPick === pick.id;
                  return (
                    <button
                      key={pick.id}
                      onClick={() => setQuickPick(pick.id)}
                      className={`text-xs px-3 py-1.5 rounded-full border transition font-medium ${
                        active
                          ? 'bg-slate-900 text-white border-slate-900 font-bold'
                          : 'bg-white text-slate-700 border-slate-300 hover:border-slate-400'
                      }`}
                    >
                      {pick.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* BUDGET SLIDER & PRESETS */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-bold text-slate-900">Budget</h3>
                <span className="text-xs font-black text-red-600">
                  up to ₹{maxBudget.toLocaleString('en-IN')}
                </span>
              </div>
              
              <input
                type="range"
                min="1000"
                max="120000"
                step="1000"
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                className="w-full accent-red-600 cursor-pointer h-1.5 bg-slate-200 rounded-lg"
              />

              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                <span>₹899</span>
                <span>₹1,20,000</span>
              </div>

              {/* Preset buttons */}
              <div className="flex items-center space-x-2 mt-3">
                {[10000, 25000, 50000].map((bVal) => (
                  <button
                    key={bVal}
                    onClick={() => setMaxBudget(bVal)}
                    className={`flex-1 text-[11px] py-1 border rounded text-center transition font-semibold ${
                      maxBudget === bVal
                        ? 'border-slate-900 bg-slate-100 text-slate-900 font-bold'
                        : 'border-slate-300 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    ≤ ₹{(bVal / 1000).toFixed(0)}k
                  </button>
                ))}
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* TECHNOLOGY */}
            <div>
              <h3 className="text-xs font-bold text-slate-900 mb-2">Technology</h3>
              <div className="space-y-2 text-xs">
                {[
                  { name: 'FDM / filament', count: 6 },
                  { name: 'Resin / MSLA', count: 2 },
                  { name: '3D scanners', count: 1 }
                ].map((item) => {
                  const checked = selectedTech.includes(item.name);
                  return (
                    <label key={item.name} className="flex items-center justify-between cursor-pointer hover:text-black">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleArrayFilter(selectedTech, setSelectedTech, item.name)}
                          className="accent-red-600 w-4 h-4 rounded cursor-pointer"
                        />
                        <span className={checked ? 'font-bold text-slate-900' : 'text-slate-600'}>
                          {item.name}
                        </span>
                      </div>
                      <span className="text-slate-400 text-[11px]">{item.count}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* BRAND */}
            <div>
              <h3 className="text-xs font-bold text-slate-900 mb-2">Brand</h3>
              <div className="space-y-2 text-xs">
                {[
                  { name: 'Forge', count: 4 },
                  { name: 'Halo', count: 3 },
                  { name: 'Loomfil', count: 3 },
                  { name: 'Ender', count: 1 }
                ].map((item) => {
                  const checked = selectedBrands.includes(item.name);
                  return (
                    <label key={item.name} className="flex items-center justify-between cursor-pointer hover:text-black">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleArrayFilter(selectedBrands, setSelectedBrands, item.name)}
                          className="accent-red-600 w-4 h-4 rounded cursor-pointer"
                        />
                        <span className={checked ? 'font-bold text-slate-900' : 'text-slate-600'}>
                          {item.name}
                        </span>
                      </div>
                      <span className="text-slate-400 text-[11px]">{item.count}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* CATEGORY */}
            <div>
              <h3 className="text-xs font-bold text-slate-900 mb-2">Category</h3>
              <div className="space-y-2 text-xs">
                {[
                  { name: 'Filament', count: 2 },
                  { name: 'Parts & upgrades', count: 4 }
                ].map((item) => {
                  const checked = selectedCategories.includes(item.name);
                  return (
                    <label key={item.name} className="flex items-center justify-between cursor-pointer hover:text-black">
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleArrayFilter(selectedCategories, setSelectedCategories, item.name)}
                          className="accent-red-600 w-4 h-4 rounded cursor-pointer"
                        />
                        <span className={checked ? 'font-bold text-slate-900' : 'text-slate-600'}>
                          {item.name}
                        </span>
                      </div>
                      <span className="text-slate-400 text-[11px]">{item.count}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* OFFERS */}
            <div>
              <h3 className="text-xs font-bold text-slate-900 mb-2">Offers</h3>
              <div className="space-y-2 text-xs">
                <label className="flex items-center justify-between cursor-pointer hover:text-black">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={under50kOffer}
                      onChange={(e) => setUnder50kOffer(e.target.checked)}
                      className="accent-red-600 w-4 h-4 rounded cursor-pointer"
                    />
                    <span className={under50kOffer ? 'font-bold text-slate-900' : 'text-slate-600'}>
                      Under ₹50,000
                    </span>
                  </div>
                  <span className="text-slate-400 text-[11px]">7</span>
                </label>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 leading-tight pt-2">
              Filters update instantly. Combine multiple options to narrow down the catalog.
            </p>
          </aside>

          {/* RIGHT COLUMN: MAIN PRODUCT GRID & SORTING */}
          <main className="lg:col-span-9 space-y-4">
            
            {/* Catalog Header & Sorting Options */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
              <div>
                <h1 className="text-2xl font-black text-slate-900">3D Printers</h1>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  {filteredProducts.length} of {INITIAL_PRODUCTS.length} products · delivered across India
                </p>
              </div>

              {/* Sort Pills */}
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-slate-500 font-medium">Sort by</span>
                <button
                  onClick={() => setSortBy('popularity')}
                  className={`px-3 py-1.5 rounded transition ${
                    sortBy === 'popularity'
                      ? 'bg-black text-white font-bold'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  Popularity
                </button>

                <button
                  onClick={() => setSortBy('price_asc')}
                  className={`px-3 py-1.5 rounded transition ${
                    sortBy === 'price_asc'
                      ? 'bg-black text-white font-bold'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  Price ↑
                </button>

                <button
                  onClick={() => setSortBy('price_desc')}
                  className={`px-3 py-1.5 rounded transition ${
                    sortBy === 'price_desc'
                      ? 'bg-black text-white font-bold'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  Price ↓
                </button>

                <button
                  onClick={() => setSortBy('rating')}
                  className={`px-3 py-1.5 rounded transition ${
                    sortBy === 'rating'
                      ? 'bg-black text-white font-bold'
                      : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  Rating
                </button>
              </div>
            </div>

            {/* PRODUCT GRID */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
                <p className="text-sm font-bold text-slate-700">No products match your selected filters.</p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded transition"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProducts.map((product) => {
                  const pdpUrl = `/3d-printing/printers/${product.slug}`;
                  return (
                    <div
                      key={product.id}
                      className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-md transition flex flex-col justify-between group"
                    >
                      {/* Image Area with Badge */}
                      <Link href={pdpUrl} className="relative aspect-4/3 bg-[#F4F4F5] flex items-center justify-center p-4 block">
                        {product.tag && (
                          <span
                            className={`absolute top-3 left-3 text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-xs ${product.tagColor}`}
                          >
                            {product.tag}
                          </span>
                        )}
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';
                          }}
                        />
                      </Link>

                      {/* Info Area */}
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                            {product.brand}
                          </span>
                          <Link href={pdpUrl}>
                            <h3 className="text-sm font-bold text-slate-900 hover:text-red-600 transition leading-snug">
                              {product.name}
                            </h3>
                          </Link>
                          {product.subSpecs && (
                            <p className="text-[11px] text-slate-500 font-medium mt-1">
                              {product.subSpecs}
                            </p>
                          )}
                        </div>

                        {/* Price & Rating */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          <div>
                            <div className="flex items-baseline space-x-2">
                              <span className="text-base font-black text-slate-900">
                                ₹{product.price.toLocaleString('en-IN')}
                              </span>
                              {product.originalPrice && (
                                <span className="text-xs text-slate-400 line-through">
                                  ₹{product.originalPrice.toLocaleString('en-IN')}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-1.5 mt-1">
                              <span className="bg-black text-white text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center space-x-0.5">
                                <span>{product.rating}</span>
                                <Star className="w-2.5 h-2.5 fill-white" />
                              </span>
                              <span className="text-[10px] text-slate-400">
                                {product.ratingCount.toLocaleString('en-IN')} ratings
                              </span>
                            </div>
                          </div>

                          <Link
                            href={pdpUrl}
                            className="px-3 py-2 bg-slate-900 hover:bg-black text-white rounded text-xs font-bold transition flex items-center space-x-1"
                          >
                            <span>Buy Now</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </main>

        </div>
      </div>
    </div>
  );
}

export default function ProductsCatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-[#F8F9FA] min-h-screen pt-[140px] text-center font-bold text-slate-500 text-sm">
          Loading 3DOM Products Catalog...
        </div>
      }
    >
      <ProductsCatalogContent />
    </Suspense>
  );
}
