'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shirt, Sparkles, Filter, ArrowRight, Watch } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { fetchProducts } from '@/lib/api';

export default function GenZFashionStore() {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);

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
    { id: 'Tops', name: 'Tops' },
    { id: 'Bottoms', name: 'Bottoms' },
    { id: 'T-shirts', name: 'T-shirts' },
    { id: 'Shirts', name: 'Shirts' },
    { id: 'Jeans', name: 'Jeans' },
    { id: 'Shorts', name: 'Shorts' },
    { id: 'Watches', name: 'Watches' },
  ];

  const filteredProducts = products.filter(
    (p) => selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase()
  );

  return (
    <div className="bg-[#FAF9F6] text-zinc-900 min-h-screen">
      
      {/* 1. HERO BANNER - GenZ Korean Fashion */}
      <section className="relative min-h-[500px] sm:min-h-[540px] flex items-center overflow-hidden border-b border-zinc-200 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        {/* Full Clear Background Banner Image - No Shadows */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/fashion-banner.jpg"
            alt="Korean Streetwear Fashion Banner"
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle left-side overlay so text is readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto flex items-center relative z-10 w-full">
          <div className="max-w-2xl space-y-5 text-left">
            <span className="inline-block px-3.5 py-1.5 bg-amber-500 text-white text-xs font-extrabold uppercase tracking-widest rounded-full border border-amber-600 shadow-lg">
              Autumn / Winter 2026 Collection
            </span>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-none">
              Seoul Streetwear & <br />
              <span className="text-amber-400 italic font-serif">Minimalist Fits.</span>
            </h1>

            <p className="text-zinc-200 text-sm sm:text-base leading-relaxed font-normal">
              Discover relaxed drop-shoulder hoodies, boxy linen camp shirts, Y2K skate denim, and retro cyber quartz timepieces crafted for trendsetters.
            </p>

            <div className="pt-2 flex flex-wrap justify-start gap-3">
              <a
                href="#catalog"
                className="px-8 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-full shadow-xl transition transform hover:-translate-y-0.5"
              >
                Shop New Arrivals
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SUB-CATEGORIES NAV GRID */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6">
          Browse by Category
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {categories.slice(1).map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-4 rounded-xl border text-center transition-all ${
                selectedCategory === cat.id
                  ? 'bg-zinc-900 text-white border-zinc-900 shadow-md'
                  : 'bg-white text-zinc-800 border-zinc-200 hover:border-zinc-400'
              }`}
            >
              <div className="text-xs font-bold truncate">{cat.name}</div>
            </button>
          ))}
        </div>
      </section>

      {/* 3. PRODUCT CATALOG */}
      <section id="catalog" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-black text-zinc-900">
              Korean Apparel & Accessories
            </h2>
            <p className="text-xs text-zinc-500">Curated GenZ aesthetics with fast shipping</p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-full transition ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-800 text-white shadow'
                    : 'bg-white text-zinc-700 hover:bg-zinc-100 border border-zinc-200'
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
              <div key={i} className="h-80 bg-zinc-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 text-zinc-500">
            No items in this fashion subcategory.
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
