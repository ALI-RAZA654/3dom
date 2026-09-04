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
    <div className="bg-[#F8FAFC] text-slate-900 min-h-screen pb-16">
      
      {/* 1. HERO BANNER - GenZ Korean Fashion */}
      <section className="relative bg-white border-b border-slate-200/80 py-12 sm:py-16 px-4 sm:px-8 shadow-2xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-6 text-left">
            <span className="inline-block px-3.5 py-1 bg-amber-500 text-white text-xs font-black uppercase tracking-widest rounded-full shadow-2xs">
              Autumn / Winter Collection
            </span>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
              Seoul Streetwear & <br />
              <span className="text-red-600 italic font-serif">Minimalist Fits.</span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal max-w-xl">
              Discover relaxed drop-shoulder hoodies, boxy linen camp shirts, Y2K skate denim, and retro cyber quartz timepieces crafted for trendsetters.
            </p>

            <div className="pt-2 flex flex-wrap justify-start gap-3">
              <a
                href="#catalog"
                className="px-7 py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-red-600/20 transition transform hover:-translate-y-0.5"
              >
                Shop New Arrivals
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white p-3 rounded-3xl border border-slate-200 shadow-xl overflow-hidden group">
              <img
                src="/images/fashion-banner.jpg"
                alt="Korean Streetwear Fashion Banner"
                className="w-full h-72 sm:h-80 object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

        </div>
      </section>

      {/* 2. SUB-CATEGORIES NAV GRID */}
      <section className="py-8 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-2xs">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4">
            Browse by Category
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {categories.slice(1).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-3.5 rounded-2xl border text-center transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-red-600 text-white border-red-600 shadow-2xs'
                    : 'bg-slate-50 text-slate-800 border-slate-200 hover:border-red-300 hover:bg-white'
                }`}
              >
                <div className="text-xs font-bold truncate">{cat.name}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. PRODUCT CATALOG */}
      <section id="catalog" className="py-6 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                Korean Apparel & Accessories
              </h2>
              <p className="text-xs text-slate-500">Curated GenZ aesthetics with fast shipping</p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition ${
                    selectedCategory === cat.id
                      ? 'bg-red-600 text-white shadow-2xs'
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
              No items in this fashion subcategory.
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
