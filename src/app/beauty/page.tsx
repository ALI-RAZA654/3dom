'use client';

export const dynamic = 'force-dynamic';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  Heart, 
  Filter, 
  ShieldCheck, 
  Droplet, 
  Feather, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  ShoppingBag,
  ArrowRight,
  Flame,
  Award,
  Crown,
  ChevronDown
} from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { fetchProducts } from '@/lib/api';
import { useCart } from '@/context/CartContext';

export default function BeautyStore() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [heroSlide, setHeroSlide] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const ritualScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    fetchProducts({ vertical: 'beauty' })
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
    { id: 'all', name: 'All Beauty' },
    { id: 'Perfumes', name: 'Niche Perfumes' },
    { id: 'Shampoo', name: 'Organic Shampoo' },
    { id: 'Masks', name: 'K-Glow & Hair Masks' },
    { id: 'Lip Balms', name: 'Lip Treatments' },
  ];

  const filteredProducts = products.filter(
    (p) => selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase()
  );

  const scrollContainer = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-[#FAF8F6] text-slate-900 min-h-screen pb-16 pt-[110px] sm:pt-[120px] font-sans">
      
      {/* ─── 1. TOP CATEGORY RIBBON BAR (LIGHT THEME) ─── */}
      <div className="bg-white border-b border-rose-100 shadow-2xs">
        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 flex items-center justify-between text-xs overflow-x-auto whitespace-nowrap scrollbar-none py-2.5">
          <div className="flex items-center space-x-6">
            <button className="bg-rose-900 text-white px-3.5 py-1.5 rounded-lg font-bold flex items-center space-x-2 text-xs hover:bg-rose-800 transition">
              <span>■ Beauty Categories</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            <nav className="flex items-center space-x-6 text-slate-700 font-semibold text-xs">
              {[
                { name: 'Artisanal Eau de Parfum', cat: 'Perfumes' },
                { name: 'Organic Botanical Shampoos', cat: 'Shampoo' },
                { name: 'Keratin Peptide Hair Masks', cat: 'Masks' },
                { name: 'Triple Hyaluronic Lip Balms', cat: 'Lip Balms' }
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    setSelectedCategory(item.cat);
                    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-rose-600 transition cursor-pointer"
                >
                  {item.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="hidden lg:flex items-center space-x-2 font-bold text-rose-600 text-xs">
            <Sparkles className="w-3.5 h-3.5 text-rose-600" />
            <span>100% Botanical & Dermatologically Certified</span>
          </div>
        </div>
      </div>

      {/* ─── 2. HERO BANNER — LIGHT LUXURY BEAUTY ─── */}
      <section className="px-3 sm:px-6 lg:px-8 max-w-[1536px] mx-auto my-6">
        <div className="relative rounded-3xl overflow-hidden bg-white border border-rose-100 shadow-sm min-h-[380px] lg:min-h-[420px] flex items-center">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center p-6 sm:p-10 lg:p-12 w-full">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <div className="flex items-center space-x-3 flex-wrap gap-y-2">
                <span className="px-3.5 py-1 bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-black uppercase tracking-widest rounded-full flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                  <span>MAISON 3DOM RITUALS</span>
                </span>
                <span className="px-3 py-1 bg-amber-50 text-amber-800 text-[11px] font-bold uppercase tracking-wider rounded-full border border-amber-200">
                  CRUELTY-FREE & BOTANICAL
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.08]">
                {heroSlide === 0 && (
                  <>Nourish Skin. <br /><span className="text-rose-600 italic font-serif">Elevate Senses.</span></>
                )}
                {heroSlide === 1 && (
                  <>Deep Botanical <br /><span className="text-rose-600 italic font-serif">Hair Formulations.</span></>
                )}
                {heroSlide === 2 && (
                  <>Artisanal Niche <br /><span className="text-rose-600 italic font-serif">Eau de Parfum.</span></>
                )}
              </h1>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl font-medium">
                {heroSlide === 0 && 'Indulge in artisanal Eau de Parfum, cold-pressed botanical organic shampoos, deep bio-peptide hair masks, and triple hyaluronic K-Glow lip treatments.'}
                {heroSlide === 1 && 'Dermatologically crafted formulations with Centella Asiatica, Moroccan Argan Oil, Damask Rose extracts, and bio-identical peptides for radiant skin & hair.'}
                {heroSlide === 2 && 'Master perfumer blends featuring Turkish Damask Rose, Golden Amber Oud, and Sandalwood with guaranteed 14+ hours scent longevity.'}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <a
                  href="#catalog"
                  className="px-7 py-3.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-sm transition-all duration-300 flex items-center space-x-2 cursor-pointer"
                >
                  <span>Explore Beauty Rituals</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </a>

                <a
                  href="#rituals"
                  className="px-6 py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-900 text-xs font-bold uppercase tracking-wider rounded-xl border border-rose-200 transition"
                >
                  View Ritual Guide
                </a>
              </div>

              {/* Dots Slider */}
              <div className="flex items-center space-x-2 pt-2">
                {[0, 1, 2].map((i) => (
                  <button
                    key={i}
                    onClick={() => setHeroSlide(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === heroSlide ? 'w-8 bg-rose-600' : 'w-2 bg-slate-300 hover:bg-slate-400'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Right Beauty Image */}
            <div className="lg:col-span-5 relative">
              <div className="bg-rose-50 p-3 rounded-3xl border border-rose-100 shadow-md overflow-hidden group">
                <img
                  src={
                    heroSlide === 0
                      ? 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=1200&q=80'
                      : heroSlide === 1
                      ? 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80'
                      : 'https://images.unsplash.com/photo-1608248597263-00079e96047c?auto=format&fit=crop&w=1200&q=80'
                  }
                  alt="Luxury Beauty Editorial"
                  className="w-full h-80 sm:h-96 object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Olfactory Notes Pill Box */}
              <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-2xl border border-rose-200 shadow-xl hidden sm:flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-black">
                  14H+
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900">Scent Longevity</div>
                  <div className="text-[10px] font-medium text-slate-500">Damask Rose & Amber Oud</div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ─── 3. MAIN BEAUTY CATALOG ─── */}
      <section id="catalog" className="py-6 px-4 sm:px-6 lg:px-8 max-w-[1536px] mx-auto">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-rose-100 shadow-2xs">
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-2xl font-black text-slate-900 flex items-center space-x-2">
                <span>Curated Luxury Beauty Collection</span>
                <span className="text-xs bg-rose-50 text-rose-600 border border-rose-200 px-2.5 py-0.5 rounded-full font-bold">
                  {filteredProducts.length} Items
                </span>
              </h2>
              <p className="text-xs text-slate-500 mt-1">Cruelty-free botanical formulations & artisanal fragrances</p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition ${
                    selectedCategory === cat.id
                      ? 'bg-rose-600 text-white shadow-2xs'
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
              No products found in this beauty category.
              <button
                onClick={() => setSelectedCategory('all')}
                className="block mx-auto mt-3 px-4 py-2 bg-rose-600 text-white font-black text-xs rounded-xl"
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
