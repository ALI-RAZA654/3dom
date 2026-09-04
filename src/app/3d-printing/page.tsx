'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Box, Layers, Wrench, Shield, CheckCircle2, ArrowRight, Zap, Cpu, Sparkles, Filter, Printer } from 'lucide-react';
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

  // Material comparison data
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
      color: 'bg-[#DC2626]',
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

  const filteredProducts = products.filter(p => {
    const catMatch = selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const matMatch = selectedMaterial === 'all' || (p.attributes && p.attributes.material === selectedMaterial);
    return catMatch && matMatch;
  });

  return (
    <div className="bg-[#F8FAFC] text-slate-900 min-h-screen pb-16">
      
      {/* 1. HERO BANNER SECTION (Clean Red Theme) */}
      <section className="relative bg-white border-b border-slate-200/80 py-12 sm:py-16 px-4 sm:px-8 shadow-2xs">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Hero Text */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-red-50 border border-red-200 text-red-600 text-xs font-black uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 text-red-600" />
              <span>Flagship 3D Printing Marketplace</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
              Shape your ideas. <br />
              <span className="text-red-600">Build with Precision.</span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base font-normal leading-relaxed max-w-xl">
              Industrial grade 3D printers, high-speed CoreXY kits, engineering filaments, and high-temp replacement hardware delivered directly to your doorstep.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#catalog"
                className="px-7 py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-red-600/20 flex items-center space-x-2 transition transform hover:-translate-y-0.5"
              >
                <span>Explore 3D Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#materials"
                className="px-7 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl border border-slate-300 transition"
              >
                <span>Filament Guide</span>
              </a>
            </div>

            {/* Stat Counters */}
            <div className="pt-4 border-t border-slate-200/80 grid grid-cols-3 gap-4">
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900">50K+</div>
                <div className="text-xs text-slate-500 font-semibold">Prints Delivered</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-red-600">30+</div>
                <div className="text-xs text-slate-500 font-semibold">Material Grades</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-slate-900">10K+</div>
                <div className="text-xs text-slate-500 font-semibold">Makers & Engineers</div>
              </div>
            </div>
          </div>

          {/* Right Hero Image Card */}
          <div className="lg:col-span-5 relative">
            <div className="bg-white p-3 rounded-3xl border border-slate-200 shadow-xl overflow-hidden group">
              <img
                src="/images/3d-banner.jpg"
                alt="3D Printing Category Banner"
                className="w-full h-72 sm:h-80 object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

        </div>
      </section>

      {/* 2. SHOP BY CATEGORY GRID SECTION (Clean White Cards with Red Accents) */}
      <section className="py-10 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Shop by Category
          </h2>
          <p className="text-xs text-slate-500 mt-1">Explore specialized 3D printing equipment & replacement hardware</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {categories.slice(1).map((cat) => (
            <div
              key={cat.id}
              onClick={() => {
                setSelectedCategory(cat.id);
                document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`p-5 rounded-3xl border cursor-pointer transition-all duration-300 flex flex-col justify-between group ${
                selectedCategory === cat.id
                  ? 'bg-red-50 border-red-600 shadow-md'
                  : 'bg-white border-slate-200 hover:border-red-400 hover:shadow-md'
              }`}
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-600 mb-4 group-hover:scale-110 group-hover:bg-red-600 group-hover:text-white transition-all">
                  <Box className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-red-600 transition">{cat.name}</h3>
                <p className="text-xs text-slate-500 mt-1">{cat.count} Items in Stock</p>
              </div>

              <div className="mt-4 flex items-center text-xs font-extrabold text-red-600 group-hover:translate-x-1 transition-transform">
                <span>Browse Category</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. MATERIALS COMPARISON SECTION */}
      <section id="materials" className="py-6 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs">
          <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-red-600 bg-red-50 px-3 py-1 rounded-full border border-red-200">
              Material Selection Guide
            </span>
            <h2 className="text-2xl font-black text-slate-900">Pick the Right Plastic</h2>
            <p className="text-xs text-slate-500">
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
                className={`p-4.5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  selectedMaterial === mat.code
                    ? 'bg-red-50 border-red-600 ring-2 ring-red-300'
                    : 'bg-slate-50 border-slate-200 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs font-black px-2 py-0.5 rounded text-white ${mat.color}`}>
                      {mat.code}
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 border border-slate-200 px-1.5 py-0.5 rounded bg-white">
                      {mat.difficulty}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 mb-1">{mat.name}</h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed mb-3">{mat.useCase}</p>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                  <span>Print Temp:</span>
                  <span className="text-slate-900 font-bold">{mat.temp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PARTS & ACCESSORIES GRID */}
      <section className="py-6 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs">
          <div className="mb-6">
            <h2 className="text-xl font-black text-slate-900">Parts & Accessories Grid</h2>
            <p className="text-xs text-slate-500 mt-1">High-precision replacement components for Ender, Bambu, and Voron printers</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {partsGrid.map((part, idx) => {
              const Icon = part.icon;
              return (
                <div
                  key={idx}
                  className="p-4 bg-slate-50 rounded-2xl border border-slate-200 hover:border-red-400 hover:bg-white transition flex items-center space-x-3 group"
                >
                  <div className="p-2.5 bg-red-100 rounded-xl text-red-600 group-hover:bg-red-600 group-hover:text-white transition">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 group-hover:text-red-600 transition">{part.name}</h4>
                    <p className="text-[10px] text-slate-500">{part.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. MAIN PRODUCT CATALOG & FILTERING */}
      <section id="catalog" className="py-8 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center space-x-2">
                <span>3D Printing Catalog</span>
                <span className="text-xs bg-red-50 text-red-600 border border-red-200 px-2.5 py-0.5 rounded-full font-bold">
                  {filteredProducts.length} Products
                </span>
              </h2>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-500 flex items-center space-x-1 mr-1">
                <Filter className="w-3.5 h-3.5" />
                <span>Categories:</span>
              </span>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition ${
                    selectedCategory === cat.id
                      ? 'bg-red-600 text-white shadow-xs'
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
              No products match the selected filters.
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
