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
    <div className="bg-[#F1F2F4] text-gray-900 min-h-screen pb-16">
      
      {/* 1. BEAUTY HERO SECTION */}
      <section className="relative bg-white border-b border-gray-200 py-12 sm:py-16 px-4 sm:px-6 lg:px-8 shadow-xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-7 space-y-5 text-left">
            <span className="inline-flex items-center space-x-1.5 px-3.5 py-1 bg-rose-600 text-white text-xs font-black uppercase tracking-widest rounded-full shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-white" />
              <span>Maison 3DOM Luxury Beauty</span>
            </span>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-gray-900 leading-tight">
              Nourish skin. <br />
              <span className="text-rose-600 font-serif italic">Elevate senses.</span>
            </h1>

            <p className="text-gray-600 text-sm sm:text-base leading-relaxed font-normal max-w-xl">
              Indulge in artisanal Eau de Parfum, botanical organic shampoos, deep peptide repair hair masks, and triple hyaluronic K-Glow lip treatments.
            </p>

            <div className="pt-2 flex flex-wrap justify-start gap-3">
              <a
                href="#catalog"
                className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md shadow-rose-500/20 transition"
              >
                Explore Beauty Rituals
              </a>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-white p-3 rounded-3xl border border-gray-200 shadow-xl overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80"
                alt="Luxury Beauty Botanical Banner"
                className="w-full h-72 sm:h-80 object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

        </div>
      </section>

      {/* 2. SUB-CATEGORIES GRID */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs">
          <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
            Beauty Categories
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.slice(1).map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`p-4 rounded-xl border text-center transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                    : 'bg-gray-50 text-gray-800 border-gray-200 hover:border-rose-300 hover:bg-white'
                }`}
              >
                <div className="text-sm font-bold">{cat.name}</div>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. PRODUCT CATALOG */}
      <section id="catalog" className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-gray-100 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-gray-900">
                Curated Beauty Collection
              </h2>
              <p className="text-xs text-gray-500">Cruelty-free formulations & luxurious botanical extracts</p>
            </div>

            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 text-xs font-bold rounded-xl transition ${
                    selectedCategory === cat.id
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200'
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
                <div key={i} className="h-80 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 text-gray-500 text-sm font-semibold">
              No items in this beauty subcategory.
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
