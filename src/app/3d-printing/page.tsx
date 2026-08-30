'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Box, Layers, Wrench, Shield, CheckCircle2, ArrowRight, Zap, Cpu, Sparkles, Filter } from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { fetchProducts } from '@/lib/api';

export default function ThreeDPrintingStore() {
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    fetchProducts({ vertical: '3d-printing' })
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
    { id: 'all', name: 'All 3D Products', count: products.length },
    { id: 'Printers', name: '3D Printers', count: products.filter(p => p.category === 'Printers').length },
    { id: 'Filaments', name: 'Filaments', count: products.filter(p => p.category === 'Filaments').length },
    { id: '3D Printer Parts', name: '3D Printer Parts', count: products.filter(p => p.category === '3D Printer Parts').length },
    { id: 'Printer Accessories', name: 'Printer Accessories', count: products.filter(p => p.category === 'Printer Accessories').length },
  ];

  // Material comparison cards data
  const materials = [
    {
      code: 'PLA',
      name: 'Polylactic Acid',
      useCase: 'Best for rapid prototypes, architectural models & detailed decorative prints.',
      temp: '190-220°C',
      difficulty: 'Easy',
      color: 'bg-red-600',
    },
    {
      code: 'PETG',
      name: 'Polyethylene Terephthalate',
      useCase: 'Best for durable, impact-resistant & waterproof mechanical parts.',
      temp: '230-250°C',
      difficulty: 'Moderate',
      color: 'bg-amber-500',
    },
    {
      code: 'ABS',
      name: 'Acrylonitrile Butadiene Styrene',
      useCase: 'Best for heat-resistant functional components & automotive enclosures.',
      temp: '240-260°C',
      difficulty: 'Advanced',
      color: 'bg-emerald-600',
    },
    {
      code: 'ASA',
      name: 'Acrylic Styrene Acrylonitrile',
      useCase: 'Best for UV-resistant outdoor fixtures & high-weather exposure parts.',
      temp: '240-260°C',
      difficulty: 'Advanced',
      color: 'bg-blue-600',
    },
    {
      code: 'Nylon',
      name: 'Carbon Fiber Reinforced',
      useCase: 'Best for industrial grade gears, high-load brackets & robotics.',
      temp: '280-300°C',
      difficulty: 'Expert',
      color: 'bg-purple-600',
    },
  ];

  // Parts grid items
  const partsGrid = [
    { name: 'Nozzle', icon: Wrench, desc: 'Hardened Steel, Brass & Ruby 0.4mm' },
    { name: 'Hotend', icon: Cpu, desc: 'All-Metal High-Temp 300°C Heat Blocks' },
    { name: 'Extruder', icon: Zap, desc: 'Sprite & Orbit Dual-Gear Direct Drives' },
    { name: 'Build plate', icon: Layers, desc: 'Spring Steel Textured PEI Sheets' },
    { name: 'PEI sheet', icon: Sparkles, desc: 'Double-Sided Powder Coated PEI' },
    { name: 'Belts & pulleys', icon: Box, desc: 'GT2 6mm Reinforced Fiber Belts' },
    { name: 'Fans', icon: Zap, desc: 'Noctua 4010 24V Ultra Silent Fans' },
    { name: 'Filament dryer', icon: Box, desc: 'Sunlu S2 Touchscreen Dryer Boxes' },
  ];

  // Brands list
  const brands = ['Creality', 'Bambu Lab', 'Voron', '3DOM Tech', 'eSun', 'Polymaker', 'E3D', 'Micro Swiss', 'Sunlu', 'Noctua'];

  const filteredProducts = products.filter(p => {
    const catMatch = selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matMatch = selectedMaterial === 'all' || (p.attributes && p.attributes.material === selectedMaterial);
    return catMatch && matMatch;
  });

  return (
    <div className="bg-zinc-950 text-white min-h-screen">
      
      {/* 1. HERO BANNER SECTION */}
      <section className="relative min-h-[540px] sm:min-h-[580px] flex items-center overflow-hidden border-b border-zinc-800/80 py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        {/* Full Clear Background Banner Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/3d-banner.jpg"
            alt="3D Printing Category Banner"
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle left-side overlay so text is readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        </div>

        <div className="max-w-7xl mx-auto flex items-center relative z-10 w-full">
          {/* Text Column - no background */}
          <div className="max-w-2xl space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-red-600 border border-red-700 text-white text-xs font-extrabold uppercase tracking-wider shadow-lg">
              <Zap className="w-4 h-4 text-white animate-pulse" />
              <span>Flagship 3D Printing Marketplace</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-none text-white">
              Shape ideas. <br />
              <span className="text-red-500">Build reality.</span>
            </h1>

            <p className="text-zinc-200 text-base sm:text-lg font-normal leading-relaxed">
              Industrial grade 3D printers, high-speed CoreXY kits, engineering filaments, and high-temp replacement parts backed by real-time inventory and fast delivery.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-start gap-4 pt-2">
              <a
                href="#catalog"
                className="w-full sm:w-auto px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm rounded-xl shadow-2xl shadow-red-900/60 flex items-center justify-center space-x-2 transition transform hover:-translate-y-0.5"
              >
                <span>Explore 3D Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#materials"
                className="w-full sm:w-auto px-8 py-4 bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 font-bold text-sm rounded-xl border border-zinc-700/80 flex items-center justify-center space-x-2 transition"
              >
                <span>Filament Guide</span>
              </a>
            </div>

            {/* Stat Counters */}
            <div className="pt-6 border-t border-zinc-500/50 grid grid-cols-3 gap-4 text-left">
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white">50K+</div>
                <div className="text-xs text-zinc-300 font-medium">Prints Delivered</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-red-500">30+</div>
                <div className="text-xs text-zinc-300 font-medium">Material Grades</div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white">10K+</div>
                <div className="text-xs text-zinc-300 font-medium">Makers & Engineers</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SHOP BY CATEGORY GRID SECTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-zinc-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Shop by Category
            </h2>
            <p className="text-xs text-zinc-400 mt-1">Explore specialized 3D printing equipment & replacement hardware</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.slice(1).map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`p-6 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col justify-between group ${
                selectedCategory === cat.id
                  ? 'bg-red-950/40 border-red-600 shadow-lg shadow-red-950/40'
                  : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900'
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center text-red-500 mb-4 group-hover:scale-110 transition-transform">
                  <Box className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-white group-hover:text-red-400 transition">{cat.name}</h3>
                <p className="text-xs text-zinc-500 mt-1">{cat.count} Items in Stock</p>
              </div>

              <div className="mt-4 flex items-center text-xs font-bold text-red-500 group-hover:translate-x-1 transition-transform">
                <span>Browse Category</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. MATERIALS / FILAMENT COMPARISON SECTION ("Pick the Right Plastic") */}
      <section id="materials" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-zinc-800 bg-zinc-950">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-red-500 bg-red-950/60 px-3 py-1 rounded-full border border-red-800/40">
            Material Selection Guide
          </span>
          <h2 className="text-3xl font-black text-white">Pick the Right Plastic</h2>
          <p className="text-xs text-zinc-400">
            Compare thermal limits, impact resistance, and printing complexity across top engineering polymers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {materials.map((mat) => (
            <div
              key={mat.code}
              onClick={() => {
                setSelectedMaterial(selectedMaterial === mat.code ? 'all' : mat.code);
                document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                selectedMaterial === mat.code
                  ? 'bg-zinc-900 border-red-500 ring-2 ring-red-500/50'
                  : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-sm font-black px-2.5 py-1 rounded text-white ${mat.color}`}>
                    {mat.code}
                  </span>
                  <span className="text-[10px] font-bold text-zinc-400 border border-zinc-800 px-2 py-0.5 rounded">
                    {mat.difficulty}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white mb-2">{mat.name}</h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed mb-4">{mat.useCase}</p>
              </div>

              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 font-semibold">
                <span>Print Temp:</span>
                <span className="text-zinc-300">{mat.temp}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. PARTS & ACCESSORIES GRID SECTION */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-zinc-800">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Parts & Accessories Grid</h2>
          <p className="text-xs text-zinc-400 mt-1">High-precision replacement components for Ender, Bambu, and Voron printers</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {partsGrid.map((part, idx) => {
            const Icon = part.icon;
            return (
              <div
                key={idx}
                className="p-4 bg-zinc-900/80 rounded-xl border border-zinc-800 hover:border-red-600/50 transition flex items-center space-x-3 group"
              >
                <div className="p-2.5 bg-zinc-800 rounded-lg text-red-500 group-hover:bg-red-600 group-hover:text-white transition">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-red-400 transition">{part.name}</h4>
                  <p className="text-[10px] text-zinc-500">{part.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. SHOP BY BRAND SECTION */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-b border-zinc-800">
        <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 text-center mb-6">
          Authorized Stockist & Brand Partners
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-75">
          {brands.map((brand) => (
            <span
              key={brand}
              className="text-sm font-extrabold text-zinc-400 hover:text-white hover:scale-105 transition cursor-pointer"
            >
              {brand}
            </span>
          ))}
        </div>
      </section>

      {/* 6. MAIN PRODUCT CATALOG & FILTERING */}
      <section id="catalog" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h2 className="text-2xl font-black text-white flex items-center space-x-2">
              <span>3D Printing Catalog</span>
              <span className="text-xs bg-red-600/20 text-red-500 border border-red-500/30 px-2 py-0.5 rounded-full font-bold">
                {filteredProducts.length} Products
              </span>
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-zinc-400 flex items-center space-x-1 mr-2">
              <Filter className="w-3.5 h-3.5" />
              <span>Categories:</span>
            </span>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition ${
                  selectedCategory === cat.id
                    ? 'bg-red-600 text-white shadow-md shadow-red-900/40'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
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
              <div key={i} className="h-80 bg-zinc-900 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16 text-zinc-500">
            No products match the selected filters.
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
