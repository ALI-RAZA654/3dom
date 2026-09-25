'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Shirt, 
  Sparkles, 
  Filter, 
  ArrowRight, 
  Watch, 
  Flame, 
  Zap, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  ShoppingBag,
  TrendingUp,
  Tag,
  Scissors,
  CheckCircle2,
  Clock,
  Crown,
  ChevronDown
} from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { fetchProducts } from '@/lib/api';
import { useCart } from '@/context/CartContext';

export default function GenZFashionStore() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [heroSlide, setHeroSlide] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const lookbookScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    fetchProducts({ vertical: 'fashion' })
      .then((data) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const categories = [
    { id: 'all', name: 'All Collection' },
    { id: 'Tops', name: 'Tops & Hoodies' },
    { id: 'Bottoms', name: 'Cargo & Pants' },
    { id: 'T-shirts', name: 'Oversized Tees' },
    { id: 'Shirts', name: 'Linen Shirts' },
    { id: 'Jeans', name: 'Skate Denim' },
    { id: 'Watches', name: 'Cyber Watches' },
  ];

  const filteredProducts = products.filter((p) => {
    return selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
  });

  const scrollContainer = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#FAF9F8] text-slate-900 min-h-screen pb-16 pt-[110px] sm:pt-[120px] font-sans">
      
      {/* ─── 1. TOP CATEGORY RIBBON BAR (LIGHT THEME) ─── */}
      <div className="bg-white border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 flex items-center justify-between text-xs overflow-x-auto whitespace-nowrap scrollbar-none py-2.5">
          <div className="flex items-center space-x-6">
            <button className="bg-slate-900 text-white px-3.5 py-1.5 rounded-lg font-bold flex items-center space-x-2 text-xs hover:bg-slate-800 transition">
              <span>■ Shop Categories</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            <nav className="flex items-center space-x-6 text-slate-700 font-semibold text-xs">
              {[
                { name: 'Oversized Hoodies', cat: 'Tops' },
                { name: 'Y2K Skate Denim', cat: 'Jeans' },
                { name: 'Camp Shirts', cat: 'Shirts' },
                { name: 'Utilitarian Cargo', cat: 'Bottoms' },
                { name: 'Cyber Steel Watches', cat: 'Watches' }
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    setSelectedCategory(item.cat);
                    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-red-600 transition cursor-pointer"
                >
                  {item.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="hidden lg:flex items-center space-x-2 font-bold text-red-600 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-red-600" />
            <span>Free Express Shipping & 7-Day Easy Fits Swap</span>
          </div>
        </div>
      </div>

      {/* ─── 2. HERO BANNER — LIGHT EDITORIAL KOREAN FASHION ─── */}
      <section className="px-3 sm:px-6 lg:px-8 max-w-[1536px] mx-auto my-6">
        <div className="relative rounded-3xl overflow-hidden bg-white border border-slate-200/90 shadow-sm min-h-[380px] lg:min-h-[420px] flex items-center">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-12 w-full">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <div className="flex items-center space-x-3 flex-wrap gap-y-2">
                <span className="px-3.5 py-1 bg-amber-100 text-amber-900 border border-amber-300/60 text-[11px] font-black uppercase tracking-widest rounded-full flex items-center space-x-1.5">
                  <Crown className="w-3.5 h-3.5 text-amber-700" />
                  <span>{heroSlide === 0 ? 'SEOUL STREET CULTURE' : heroSlide === 1 ? 'GANGNAM MINIMALISM' : 'Y2K SKATE FIT'}</span>
                </span>
                <span className="px-3 py-1 bg-slate-100 text-slate-700 text-[11px] font-bold uppercase tracking-wider rounded-full border border-slate-200">
                  AUTUMN / WINTER '26
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.08]">
                {heroSlide === 0 && (
                  <>Seoul Streetwear & <br /><span className="text-red-600 italic font-serif">Minimalist Fits.</span></>
                )}
                {heroSlide === 1 && (
                  <>Silhouette Tailoring & <br /><span className="text-red-600 italic font-serif">Linen Camp Shirts.</span></>
                )}
                {heroSlide === 2 && (
                  <>Cyber Steel Watches & <br /><span className="text-red-600 italic font-serif">Y2K Wide Denim.</span></>
                )}
              </h1>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl font-medium">
                {heroSlide === 0 && 'Discover relaxed drop-shoulder heavyweight hoodies, boxy linen camp shirts, Y2K skate denim, and retro cyber quartz timepieces crafted for trendsetters.'}
                {heroSlide === 1 && 'Refined camp collar linen shirts, boxy cropped blazers, and pleated fluid trousers designed for modern minimalist tailoring.'}
                {heroSlide === 2 && 'Retro futuristic stainless steel quartz timepieces and distressed wide-leg skate denim direct from Korea’s top independent fashion labels.'}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="#catalog"
                  className="px-7 py-3.5 bg-slate-900 hover:bg-black text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition-all duration-300 flex items-center space-x-2 cursor-pointer"
                >
                  <span>Shop New Drop</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </a>

                <a
                  href="#lookbook"
                  className="px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold uppercase tracking-wider rounded-xl border border-slate-300 transition"
                >
                  View Lookbook
                </a>
              </div>

              {/* Dots Slider */}
              <div className="flex items-center space-x-2 pt-2">
                {[0, 1, 2].map((i) => (
                  <button
                    key={i}
                    onClick={() => setHeroSlide(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === heroSlide ? 'w-8 bg-slate-900' : 'w-2 bg-slate-300 hover:bg-slate-400'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Right Editorial Image */}
            <div className="lg:col-span-5 relative">
              <div className="bg-slate-100 p-3 rounded-3xl border border-slate-200 shadow-md overflow-hidden group">
                <img
                  src={
                    heroSlide === 0
                      ? 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80'
                      : heroSlide === 1
                      ? 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80'
                      : 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80'
                  }
                  alt="Korean Fashion Editorial"
                  className="w-full h-80 sm:h-96 object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Floating Quality Badge */}
              <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-xl hidden sm:flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-black">
                  100%
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900">Direct Sourced</div>
                  <div className="text-[10px] font-medium text-slate-500">Seoul Independent Labels</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─── 3. SHOP BY AESTHETIC VIBE ─── */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 max-w-[1536px] mx-auto">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs">
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="text-[11px] font-black tracking-widest text-slate-400 uppercase block mb-1">
                CURATED AESTHETICS
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Shop by Vibe
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
            {[
              {
                title: 'Gangnam Minimalist',
                sub: 'Cropped blazers & linen shirts',
                bg: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80',
                badge: 'ELEGANT'
              },
              {
                title: 'Hongdae Y2K Skate',
                sub: 'Baggy denim & graphic tees',
                bg: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80',
                badge: 'STREETWEAR'
              },
              {
                title: 'K-Pop Off-Duty',
                sub: 'Heavyweight hoodies & caps',
                bg: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
                badge: 'TRENDING'
              },
              {
                title: 'Cyber Accessories',
                sub: 'Steel quartz timepieces',
                bg: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80',
                badge: 'NEW DROP'
              }
            ].map((vibe, idx) => (
              <div
                key={idx}
                onClick={() => {
                  document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="relative rounded-2xl overflow-hidden h-52 sm:h-60 group border border-slate-200 cursor-pointer shadow-2xs hover:shadow-md transition-all duration-300 bg-slate-100"
              >
                <img
                  src={vibe.bg}
                  alt={vibe.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                
                <div className="absolute top-3 left-3">
                  <span className="px-2.5 py-0.5 bg-black text-white text-[10px] font-bold uppercase rounded-md tracking-wider shadow-xs">
                    {vibe.badge}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 space-y-0.5 text-white">
                  <h3 className="text-base sm:text-lg font-black leading-snug group-hover:text-amber-300 transition">
                    {vibe.title}
                  </h3>
                  <p className="text-xs text-slate-200 font-medium">
                    {vibe.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 4. MAIN PRODUCT CATALOG ─── */}
      <section id="catalog" className="py-6 px-4 sm:px-6 lg:px-8 max-w-[1536px] mx-auto">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 flex items-center space-x-2">
                <span>Korean Apparel & Cyber Accessories</span>
                <span className="text-xs bg-red-50 text-red-600 border border-red-200 px-2.5 py-0.5 rounded-full font-bold">
                  {filteredProducts.length} Items
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">Directly imported GenZ streetwear & minimalist essentials</p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition ${
                    selectedCategory === cat.id
                      ? 'bg-black text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-80 bg-slate-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-sm font-semibold">
              No products found in this fashion subcategory.
              <button
                onClick={() => setSelectedCategory('all')}
                className="block mx-auto mt-3 px-4 py-2 bg-slate-900 hover:bg-black text-white font-black text-xs rounded-xl transition"
              >
                Reset Filter
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

        </div>
      </section>

    </div>
  );
}
