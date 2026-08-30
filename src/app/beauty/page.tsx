'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Heart, Filter, ShieldCheck } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { fetchProducts } from '@/lib/api';

export default function BeautyStore() {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);

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
    { id: 'Perfumes', name: 'Perfumes' },
    { id: 'Shampoo', name: 'Shampoo' },
    { id: 'Masks', name: 'Masks' },
    { id: 'Lip Balms', name: 'Lip Balms' },
  ];

  const filteredProducts = products.filter(
    (p) => selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase()
  );

  return (
    <div className="bg-[#FDF5F3] text-zinc-900 min-h-screen">
      
      {/* 1. BEAUTY HERO SECTION */}
      <section className="relative min-h-[500px] sm:min-h-[540px] flex items-center overflow-hidden border-b border-rose-200 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        {/* Full Clear Background Banner Image - No Shadows */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=2400&q=80"
            alt="Luxury Beauty Botanical Banner"
            className="w-full h-full object-cover object-center"
          />
        </div>

        <div className="max-w-7xl mx-auto flex items-center relative z-10 w-full">
          <div className="max-w-2xl space-y-5 text-left">
            <span className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 bg-rose-600 text-white text-xs font-bold uppercase tracking-widest rounded-full border border-rose-700 shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Maison 3DOM Luxury Beauty</span>
            </span>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-zinc-900 leading-none" style={{ textShadow: '0 2px 8px rgba(255,255,255,0.8)' }}>
              Nourish skin. <br />
              <span className="text-rose-600 font-serif italic">Elevate senses.</span>
            </h1>

            <p className="text-zinc-800 text-sm sm:text-base leading-relaxed font-semibold" style={{ textShadow: '0 1px 6px rgba(255,255,255,0.9)' }}>
              Indulge in artisanal Eau de Parfum, botanical organic shampoos, deep peptide repair hair masks, and triple hyaluronic K-Glow lip treatments.
            </p>

            <div className="pt-2 flex flex-wrap justify-start gap-3">
              <a
                href="#catalog"
                className="px-8 py-3.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-full shadow-xl shadow-rose-900/50 transition transform hover:-translate-y-0.5"
              >
                Explore Beauty Rituals
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SUB-CATEGORIES GRID */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-xs font-bold uppercase tracking-widest text-rose-900/60 mb-6">
          Beauty Categories
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.slice(1).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-5 rounded-2xl border text-center transition-all ${
                selectedCategory === cat.id
                  ? 'bg-rose-900 text-white border-rose-900 shadow-md'
                  : 'bg-white text-zinc-800 border-rose-100 hover:border-rose-300'
              }`}
            >
              <div className="text-sm font-bold">{cat.name}</div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. PRODUCT CATALOG */}
      <section id="catalog" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-black text-zinc-900">
              Curated Beauty Collection
            </h2>
            <p className="text-xs text-zinc-500">Cruelty-free formulations & luxurious botanical extracts</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-full transition ${
                  selectedCategory === cat.id
                    ? 'bg-rose-900 text-white shadow'
                    : 'bg-white text-rose-950 hover:bg-rose-50 border border-rose-200'
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
              <div key={i} className="h-80 bg-rose-100/50 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 text-zinc-500">
            No items in this beauty subcategory.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

    </div>
  );
}
