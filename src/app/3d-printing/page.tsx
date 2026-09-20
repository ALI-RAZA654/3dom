'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Box, 
  Layers, 
  Wrench, 
  ArrowRight, 
  Zap, 
  Cpu, 
  Sparkles, 
  Filter, 
  Printer, 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  ShoppingBag, 
  Eye, 
  CheckCircle2, 
  Flame, 
  ShieldCheck, 
  Award,
  Tag,
  Gauge
} from 'lucide-react';
import { ProductCard } from '@/components/ProductCard';
import { fetchProducts } from '@/lib/api';
import { useCart } from '@/context/CartContext';

// Default mock 3D printing products fallback
const FALLBACK_3D_PRODUCTS = [
  {
    id: 'prod-3d-2',
    slug: 'bambu-lab-p1s-combo-3d-printer',
    name: 'Bambu Lab P1S Combo with AMS 3D Printer',
    vertical: '3d-printing',
    category: 'Printers',
    brand: 'Bambu Lab',
    price: 949.00,
    originalPrice: 999.00,
    stock: 8,
    rating: 4.95,
    reviewCount: 52,
    image: 'https://images.unsplash.com/photo-1612815150330-80e90c888d22?auto=format&fit=crop&w=800&q=80',
    description: 'Enclosed multi-color 3D printer capable of 500mm/s acceleration with automatic filament switching system.',
    attributes: { speed: '500mm/s', buildVolume: '256x256x256mm', colors: 'Up to 16 Colors' },
    isFeatured: true
  },
  {
    id: 'prod-3d-16',
    slug: 'bambu-lab-a1-combo-ams-lite',
    name: 'Bambu Lab A1 Combo with AMS Lite 3D Printer',
    vertical: '3d-printing',
    category: 'Printers',
    brand: 'Bambu Lab',
    price: 499.00,
    originalPrice: 559.00,
    stock: 12,
    rating: 4.96,
    reviewCount: 78,
    image: 'https://images.unsplash.com/photo-1612815150330-80e90c888d22?auto=format&fit=crop&w=800&q=80',
    description: 'Full-auto calibration 4-color multi-material printer with active flow compensation and 500mm/s print speed.',
    attributes: { speed: '500mm/s', buildVolume: '256x256x256mm', colors: '4 Colors AMS Lite' },
    isFeatured: true
  },
  {
    id: 'prod-3d-1',
    slug: 'ender-3-v3-se-3d-printer',
    name: 'Ender 3 V3 SE High-Speed 3D Printer',
    vertical: '3d-printing',
    category: 'Printers',
    brand: 'Creality',
    price: 219.00,
    originalPrice: 249.00,
    stock: 15,
    rating: 4.8,
    reviewCount: 34,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    description: 'High-speed auto-leveling FDM printer with dual Z-axis, CR Touch leveling, and Sprite direct extruder.',
    attributes: { speed: '250mm/s', buildVolume: '220x220x250mm', extruder: 'Sprite Direct Drive' },
    isFeatured: true
  },
  {
    id: 'prod-3d-17',
    slug: 'creality-k1-max-flagship-corexy',
    name: 'Creality K1 Max AI CoreXY Flagship 3D Printer',
    vertical: '3d-printing',
    category: 'Printers',
    brand: 'Creality',
    price: 849.00,
    originalPrice: 999.00,
    stock: 6,
    rating: 4.88,
    reviewCount: 45,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80',
    description: 'Blazing 600mm/s speed with AI LiDaR, AI Camera, and large 300x300x300mm build volume.',
    attributes: { speed: '600mm/s', buildVolume: '300x300x300mm', camera: 'AI LiDAR + HD Cam' },
    isFeatured: true
  },
  {
    id: 'prod-3d-18',
    slug: 'elegoo-neptune-4-max-high-speed',
    name: 'Elegoo Neptune 4 Max Large Build High-Speed Printer',
    vertical: '3d-printing',
    category: 'Printers',
    brand: 'Elegoo',
    price: 470.00,
    originalPrice: 520.00,
    stock: 10,
    rating: 4.82,
    reviewCount: 38,
    image: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80',
    description: 'Massive 420x420x480mm print size with Klipper firmware pre-installed and 500mm/s top speed.',
    attributes: { speed: '500mm/s', buildVolume: '420x420x480mm', firmware: 'Klipper' },
    isFeatured: true
  },
  {
    id: 'prod-3d-19',
    slug: 'prusa-mk4s-3d-printer-kit',
    name: 'Original Prusa MK4S High-Precision 3D Printer Kit',
    vertical: '3d-printing',
    category: 'Printers',
    brand: 'Prusa',
    price: 799.00,
    originalPrice: 849.00,
    stock: 5,
    rating: 4.98,
    reviewCount: 94,
    image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80',
    description: 'Legendary Nextruder 32-bit architecture with Loadcell sensor for perfect first layer without manual tuning.',
    attributes: { speed: '350mm/s', buildVolume: '250x210x220mm', extruder: 'Nextruder' },
    isFeatured: true
  },
  {
    id: 'prod-3d-3',
    slug: 'voron-2-4-r2-corexy-kit',
    name: 'Voron 2.4 R2 CoreXY DIY 3D Printer Kit',
    vertical: '3d-printing',
    category: 'Printers',
    brand: 'Voron',
    price: 899.00,
    originalPrice: 950.00,
    stock: 4,
    rating: 4.9,
    reviewCount: 18,
    image: 'https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&w=800&q=80',
    description: 'Enclosed CoreXY high-performance printer with flying gantry design for ultimate speed and precision.',
    attributes: { speed: '350mm/s', buildVolume: '350x350x350mm', firmware: 'Klipper' },
    isFeatured: false
  },
  {
    id: 'prod-3d-4',
    slug: 'premium-pla-plus-filament-black-1kg',
    name: '3DOM Pro PLA+ Tough Filament 1.75mm (Jet Black 1kg)',
    vertical: '3d-printing',
    category: 'Filaments',
    brand: '3DOM Tech',
    price: 22.99,
    originalPrice: 27.99,
    stock: 45,
    rating: 4.85,
    reviewCount: 120,
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    description: 'Ultra-smooth, low-warp PLA+ engineered for high-speed printing with superior layer adhesion.',
    attributes: { material: 'PLA', diameter: '1.75mm', weight: '1kg', temp: '190-220°C' },
    isFeatured: true
  },
  {
    id: 'prod-3d-20',
    slug: 'silk-dual-color-pla-bundle-1kg',
    name: '3DOM Magical Silk Co-Extrusion Dual Color PLA (2 Pack Spools)',
    vertical: '3d-printing',
    category: 'Filaments',
    brand: '3DOM Tech',
    price: 34.99,
    originalPrice: 44.99,
    stock: 40,
    rating: 4.9,
    reviewCount: 63,
    image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80',
    description: 'Stunning dichroic color shift filaments (Gold-Purple & Blue-Green) for lustrous 3D art models.',
    attributes: { material: 'Silk PLA', diameter: '1.75mm', weight: '2 x 1kg', temp: '200-225°C' },
    isFeatured: true
  },
  {
    id: 'prod-3d-5',
    slug: 'petg-tough-filament-fire-red-1kg',
    name: '3DOM PETG High Impact Filament (Fire Red 1kg)',
    vertical: '3d-printing',
    category: 'Filaments',
    brand: '3DOM Tech',
    price: 24.50,
    originalPrice: 29.00,
    stock: 30,
    rating: 4.75,
    reviewCount: 64,
    image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80',
    description: 'Durable, weather-resistant PETG filament combining the ease of PLA with the strength of ABS.',
    attributes: { material: 'PETG', diameter: '1.75mm', weight: '1kg', temp: '230-250°C' },
    isFeatured: false
  },
  {
    id: 'prod-3d-7',
    slug: 'nylon-carbon-fiber-filament-1kg',
    name: 'Polymaker PolyMax Nylon Carbon Fiber (CF) Filament',
    vertical: '3d-printing',
    category: 'Filaments',
    brand: 'Polymaker',
    price: 59.99,
    originalPrice: 69.99,
    stock: 12,
    rating: 4.9,
    reviewCount: 29,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    description: 'Industrial grade carbon fiber reinforced nylon with high thermal tolerance and tensile strength.',
    attributes: { material: 'Nylon', diameter: '1.75mm', weight: '500g', temp: '280-300°C' },
    isFeatured: true
  },
  {
    id: 'prod-3d-12',
    slug: 'magnetic-pei-flexible-build-plate',
    name: '3DOM Dual-Sided Textured PEI Powder Coated Steel Sheet (235x235mm)',
    vertical: '3d-printing',
    category: 'Printer Accessories',
    brand: '3DOM Tech',
    price: 28.00,
    originalPrice: 35.00,
    stock: 40,
    rating: 4.95,
    reviewCount: 95,
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80',
    description: 'Spring steel sheet coated with textured PEI for effortless print removal and perfect first layer adhesion.',
    attributes: { partType: 'Build plate', size: '235x235mm', surface: 'Textured PEI' },
    isFeatured: true
  },
  {
    id: 'prod-3d-13',
    slug: 'smart-filament-dryer-box-s2',
    name: 'Sunlu S2 Smart Heated Filament Dryer Box with Humidity Sensor',
    vertical: '3d-printing',
    category: 'Printer Accessories',
    brand: 'Sunlu',
    price: 69.00,
    originalPrice: 79.99,
    stock: 16,
    rating: 4.8,
    reviewCount: 47,
    image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=800&q=80',
    description: '360° surround heating filament dryer box with touchscreen display to remove moisture from PLA/PETG/Nylon.',
    attributes: { partType: 'Filament dryer', maxTemp: '70°C', display: 'Touchscreen LCD' },
    isFeatured: true
  }
];

export default function ThreeDPrintingStore() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<any[]>(FALLBACK_3D_PRODUCTS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  const [bestSellerTab, setBestSellerTab] = useState<string>('enclosed');
  const [heroSlide, setHeroSlide] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  // Carousel refs for smooth horizontal scrolling
  const premiumScrollRef = useRef<HTMLDivElement>(null);
  const brandScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLoading(true);
    fetchProducts({ vertical: '3d-printing' })
      .then((data) => {
        if (data && Array.isArray(data) && data.length > 0) {
          setProducts(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
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

  // Brand data for "Shop By Brand" section
  const brandsList = [
    {
      id: 'prusa',
      name: 'PRUSA RESEARCH',
      tag: 'by Josef Prusa',
      brandQuery: 'Prusa',
      logo: (
        <div className="flex flex-col items-center">
          <div className="border-2 border-slate-900 px-3 py-1 font-black text-xs tracking-tighter text-slate-900 bg-white">
            PRUSA
          </div>
          <span className="text-[9px] font-black tracking-widest text-slate-700 uppercase mt-0.5">RESEARCH</span>
          <span className="text-[7px] text-slate-500 italic">by JOSEF PRUSA</span>
        </div>
      )
    },
    {
      id: 'creality',
      name: 'CREALITY',
      brandQuery: 'Creality',
      logo: (
        <div className="flex items-center space-x-1.5 font-black text-slate-900 text-sm tracking-tight">
          <div className="w-5 h-5 rounded-md bg-red-600 flex items-center justify-center text-white text-[10px] font-black">
            ▲
          </div>
          <span className="font-extrabold text-base tracking-wider text-slate-900">CREALITY</span>
        </div>
      )
    },
    {
      id: 'bambu',
      name: 'Bambu Lab',
      brandQuery: 'Bambu Lab',
      logo: (
        <div className="flex items-center space-x-2 font-black text-slate-900">
          <div className="grid grid-cols-2 gap-0.5 w-5 h-5">
            <div className="bg-emerald-600 rounded-[1px]"></div>
            <div className="bg-slate-900 rounded-[1px]"></div>
            <div className="bg-slate-900 rounded-[1px]"></div>
            <div className="bg-emerald-600 rounded-[1px]"></div>
          </div>
          <div className="leading-none text-left">
            <div className="font-black text-xs text-slate-900">Bambu</div>
            <div className="font-bold text-[10px] text-slate-600">Lab</div>
          </div>
        </div>
      )
    },
    {
      id: 'flashforge',
      name: 'FLASHFORGE',
      brandQuery: 'Flashforge',
      logo: (
        <div className="flex items-center space-x-1.5 font-black text-slate-900 text-sm">
          <div className="w-4 h-4 bg-slate-900 rotate-45 flex items-center justify-center">
            <div className="w-2 h-2 bg-red-600"></div>
          </div>
          <span className="font-black tracking-wider text-slate-900 text-xs sm:text-sm">FLASHFORGE</span>
        </div>
      )
    },
    {
      id: 'elegoo',
      name: 'ELEGOO',
      brandQuery: 'Elegoo',
      logo: (
        <div className="font-black tracking-widest text-slate-900 text-sm sm:text-base border-b-2 border-red-600 pb-0.5">
          ELEGOO
        </div>
      )
    },
    {
      id: 'anycubic',
      name: 'ANYCUBIC',
      brandQuery: 'Anycubic',
      logo: (
        <div className="font-black tracking-wider text-slate-800 text-xs sm:text-sm flex items-center space-x-1">
          <span className="text-red-600 font-extrabold">ANY</span>
          <span className="text-slate-900">CUBIC</span>
        </div>
      )
    },
    {
      id: 'voron',
      name: 'VORON',
      brandQuery: 'Voron',
      logo: (
        <div className="flex items-center space-x-1 font-black text-slate-900 text-xs">
          <div className="w-4 h-4 bg-red-600 text-white text-[9px] rounded-full flex items-center justify-center font-bold">V</div>
          <span className="tracking-widest text-slate-900">VORON</span>
        </div>
      )
    }
  ];

  // Material guide data
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

  // Filter premium printers for section 3
  const premiumPrinters = products.filter(
    p => p.category === 'Printers' || p.price >= 300 || p.brand === 'Bambu Lab' || p.brand === 'Creality'
  );

  // Filter filament deals for section 5
  const filamentDeals = products.filter(p => p.category === 'Filaments');

  // Filtered list for main catalog
  const filteredProducts = products.filter(p => {
    const catMatch = selectedCategory === 'all' || p.category.toLowerCase() === selectedCategory.toLowerCase();
    const brandMatch = selectedBrand === 'all' || p.brand.toLowerCase().includes(selectedBrand.toLowerCase());
    const matMatch = selectedMaterial === 'all' || (p.attributes && p.attributes.material === selectedMaterial);
    return catMatch && brandMatch && matMatch;
  });

  // Carousel scroll helpers
  const scrollContainer = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  // Featured printer card logic for Best Sellers
  const getBestSellerFeatured = () => {
    if (bestSellerTab === 'enclosed') {
      return products.find(p => p.slug.includes('bambu-lab-p1s') || p.slug.includes('k1-max')) || premiumPrinters[0];
    } else if (bestSellerTab === 'open') {
      return products.find(p => p.slug.includes('a1-combo') || p.slug.includes('ender-3')) || premiumPrinters[1];
    } else if (bestSellerTab === 'filaments') {
      return products.find(p => p.category === 'Filaments' && p.isFeatured) || filamentDeals[0];
    }
    return products.find(p => p.slug.includes('a1-combo')) || premiumPrinters[0];
  };

  const featuredBestSeller = getBestSellerFeatured();

  return (
    <div className="bg-[#F8FAFC] text-slate-900 min-h-screen pb-16 pt-[148px]">

      {/* 1. HERO BANNER — Wide Luxury Dark CoreXY Banner */}
      <section className="px-3 sm:px-6 lg:px-8 max-w-[1536px] mx-auto mb-10">
        <div className="relative rounded-[32px] overflow-hidden bg-[#0a0714] border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.6)] min-h-[460px] lg:min-h-[500px] flex items-center">

          {/* Slide Background Images with Glowing Gradient Overlays */}
          <div className="absolute inset-0 z-0">
            {heroSlide === 0 && (
              <img
                src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80"
                alt="Next-Gen CoreXY Banner"
                className="w-full h-full object-cover opacity-35 transition-all duration-1000 scale-105"
              />
            )}
            {heroSlide === 1 && (
              <img
                src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1600&q=80"
                alt="High-Temp Filaments Banner"
                className="w-full h-full object-cover opacity-35 transition-all duration-1000 scale-105"
              />
            )}
            {heroSlide === 2 && (
              <img
                src="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1600&q=80"
                alt="Custom 3D Print Banner"
                className="w-full h-full object-cover opacity-35 transition-all duration-1000 scale-105"
              />
            )}
            {heroSlide === 3 && (
              <img
                src="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=80"
                alt="Flagship Printers Banner"
                className="w-full h-full object-cover opacity-35 transition-all duration-1000 scale-105"
              />
            )}

            {/* Glowing Luxury Ambient Gradients */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#0a0714] via-[#120a22]/90 to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0714] via-transparent to-[#0a0714]/60 z-10" />
            <div className="absolute -left-20 -top-20 w-[450px] h-[450px] bg-red-600/15 rounded-full blur-[100px] z-10 pointer-events-none" />
            <div className="absolute right-10 bottom-0 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[120px] z-10 pointer-events-none" />
          </div>

          {/* Chevron Navigation Arrows (Top Left & Top Right) */}
          <button
            onClick={() => setHeroSlide((prev) => (prev === 0 ? 3 : prev - 1))}
            className="absolute top-6 left-6 z-30 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center transition-all duration-200 backdrop-blur-md shadow-lg cursor-pointer"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            onClick={() => setHeroSlide((prev) => (prev === 3 ? 0 : prev + 1))}
            className="absolute top-6 right-6 z-30 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center transition-all duration-200 backdrop-blur-md shadow-lg cursor-pointer"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Hero Content Area */}
          <div className="relative z-20 px-8 sm:px-14 lg:px-20 py-12 max-w-3xl space-y-6 text-left">

            {/* Badges Row */}
            <div className="flex items-center space-x-3 flex-wrap gap-y-2">
              <span className="px-4 py-1.5 bg-[#FF3B30] text-white text-[11px] font-black uppercase tracking-widest rounded-full shadow-[0_0_15px_rgba(255,59,48,0.6)] flex items-center space-x-1.5">
                <Flame className="w-3.5 h-3.5 text-white" />
                <span>
                  {heroSlide === 0 ? 'REVOLUTIONARY' : heroSlide === 1 ? 'PRO GRADE SPOOLS' : heroSlide === 2 ? 'INSTANT SERVICE' : 'FLAGSHIP SERIES'}
                </span>
              </span>
              <span className="px-4 py-1.5 bg-[#1d172e]/90 backdrop-blur-md border border-white/15 text-white text-[11px] font-extrabold uppercase tracking-wider rounded-full">
                {heroSlide === 0 ? 'CORE-XY 600 MM/S' : heroSlide === 1 ? 'FLASHSALE 20% OFF' : heroSlide === 2 ? '24-HOUR TURNAROUND' : 'AMS MULTI-COLOR'}
              </span>
            </div>

            {/* Slide Title */}
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.05] uppercase">
              {heroSlide === 0 && (
                <>NEXT-GEN <span className="text-[#FF3B30] drop-shadow-[0_0_25px_rgba(255,59,48,0.7)]">COREXY</span><br />SYSTEMS</>
              )}
              {heroSlide === 1 && (
                <>PRECISION <span className="text-[#FF3B30] drop-shadow-[0_0_25px_rgba(255,59,48,0.7)]">HIGH-TEMP</span><br />FILAMENTS</>
              )}
              {heroSlide === 2 && (
                <>ON-DEMAND <span className="text-[#FF3B30] drop-shadow-[0_0_25px_rgba(255,59,48,0.7)]">3D PRINTING</span><br />SERVICE</>
              )}
              {heroSlide === 3 && (
                <>ENCLOSED <span className="text-[#FF3B30] drop-shadow-[0_0_25px_rgba(255,59,48,0.7)]">MULTI-COLOR</span><br />PRINTERS</>
              )}
            </h1>

            {/* Slide Subtitle */}
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl font-medium">
              {heroSlide === 0 && 'Industrial-grade precision engineering with automatic active bed leveling, rapid dual-gear extruders, and ultra-smooth CoreXY motion.'}
              {heroSlide === 1 && 'Engineered Carbon Fiber, PETG, Silk Co-Extrusion, and high-temp resins tested for flawless layer adhesion and warp-free prints.'}
              {heroSlide === 2 && 'Upload your STL or CAD model for instant pricing, engineering material options, and high-speed delivery within 24 hours.'}
              {heroSlide === 3 && 'Experience high-speed automatic filament swapping with smart nozzle alignment and temperature-controlled build chambers.'}
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={() => {
                  if (heroSlide === 2) onRequestModalOpen();
                  else {
                    setSelectedCategory(heroSlide === 1 ? 'Filaments' : 'Printers');
                    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-8 py-4 bg-[#FF3B30] hover:bg-red-500 text-white text-xs font-black uppercase tracking-wider rounded-full flex items-center space-x-2 transition-all duration-300 shadow-[0_0_20px_rgba(255,59,48,0.5)] transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>{heroSlide === 2 ? 'Upload Your Model' : heroSlide === 1 ? 'Shop Filaments Deals' : 'EXPLORE FLAGSHIP PRINTERS'}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <a
                href="#premium-printers"
                className="px-7 py-4 bg-[#201833]/80 hover:bg-[#2e234a] border border-white/20 text-white text-xs font-extrabold uppercase tracking-wider rounded-full backdrop-blur-md transition-all duration-200"
              >
                VIEW CATALOG
              </a>
            </div>

            {/* Carousel Dots Indicator */}
            <div className="flex items-center space-x-2 pt-4">
              {[0, 1, 2, 3].map((i) => (
                <button
                  key={i}
                  onClick={() => setHeroSlide(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === heroSlide ? 'w-8 bg-[#FF3B30] shadow-[0_0_10px_rgba(255,59,48,0.8)]' : 'w-2 bg-white/30 hover:bg-white/60'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

          </div>

          {/* Right Floating Specs Box (3DOM PERFORMANCE) */}
          <div className="absolute right-10 top-1/2 -translate-y-1/2 z-20 hidden lg:block w-80">
            <div className="bg-[#120d20]/90 backdrop-blur-xl p-5 rounded-2xl border border-white/10 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-[#FF3B30] flex items-center space-x-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#FF3B30]" />
                  <span>3DOM PERFORMANCE</span>
                </span>
                <span className="text-[10px] font-extrabold text-slate-400">SERIES 2026</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">Max Print Speed</span>
                  <span className="text-white font-extrabold">600 mm/s</span>
                </div>
                <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#FF3B30] h-full w-[92%] shadow-[0_0_8px_rgba(255,59,48,0.8)]" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400 font-medium">Acceleration</span>
                  <span className="text-white font-extrabold">20,000 mm/s²</span>
                </div>
                <div className="w-full bg-slate-800/80 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#FF3B30] h-full w-[85%]" />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between text-xs border-t border-white/10">
                <span className="text-slate-400 font-medium">Nozzle Temp</span>
                <span className="text-[#FF3B30] font-black">Up to 350°C</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. SHOP BY CATEGORY SECTION (Matching Image 2) */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-[1536px] mx-auto">
        <div className="flex items-end justify-between mb-5">
          <div>
            <span className="text-[11px] font-extrabold tracking-widest text-slate-400 uppercase mb-1 block">
              SHOP BY CATEGORY
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Find the right setup
            </h2>
          </div>
          <button
            onClick={() => {
              setSelectedCategory('all');
              document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-red-600 hover:text-red-700 font-extrabold text-xs sm:text-sm flex items-center space-x-1 cursor-pointer"
          >
            <span>View all</span>
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </button>
        </div>

        {/* Categories Strip */}
        <div className="flex space-x-3 overflow-x-auto scrollbar-none pb-2 pt-1 snap-x">
          {[
            { name: '3D Printers', catId: 'Printers', img: '/images/forge-a1-mini.png' },
            { name: 'Resin', catId: 'Resin', img: '/images/halo-resin-4k.png' },
            { name: 'Filament', catId: 'Filaments', img: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&w=400&q=80' },
            { name: 'Nozzles', catId: '3D Printer Parts', img: '/images/cat-nozzles.png' },
            { name: 'Build plates', catId: 'Printer Accessories', img: '/images/cat-build-plates.png' },
            { name: 'Scanners', catId: 'Printer Accessories', img: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80' },
            { name: 'Dryers', catId: 'Printer Accessories', img: 'https://images.unsplash.com/photo-1563770660439-4636190af475?auto=format&fit=crop&w=400&q=80' },
            { name: 'Under ₹50k', catId: 'Printers', img: '/images/ender-craft-9.png' },
          ].map((cat, idx) => (
            <div
              key={idx}
              onClick={() => {
                setSelectedCategory(cat.catId);
                document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-white border border-slate-200/90 rounded-2xl p-3 hover:border-slate-300 hover:shadow-md transition-all flex items-center space-x-3 cursor-pointer group flex-shrink-0 min-w-[165px] sm:min-w-[190px] snap-start"
            >
              <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-xl bg-slate-100/90 border border-slate-200/60 flex items-center justify-center p-1 overflow-hidden flex-shrink-0">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover rounded-lg group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=300&q=80';
                  }}
                />
              </div>
              <span className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-red-600 transition">
                {cat.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 3. MACHINES & PARTS THAT SHIP TODAY SECTION (Matching Image 3) */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-[1536px] mx-auto mb-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Machines & parts that ship today
          </h2>
          <button
            onClick={() => {
              setSelectedCategory('all');
              document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="text-red-600 hover:text-red-700 font-extrabold text-xs sm:text-sm flex items-center space-x-1 cursor-pointer"
          >
            <span>View all 84</span>
            <ArrowRight className="w-4 h-4 ml-0.5" />
          </button>
        </div>

        {/* 4 Card Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {[
            {
              id: 'prod-forge-mini',
              slug: 'forge-a1-mini',
              badge: 'BESTSELLER',
              badgeBg: 'bg-red-600',
              brand: 'FORGE',
              name: 'Forge A1 Mini',
              specs: 'Core-XY · 180×180×180 · 500 mm/s',
              price: 28999,
              originalPrice: 34999,
              rating: '4.5',
              ratingsCount: '2,841',
              image: '/images/forge-a1-mini.png'
            },
            {
              id: 'prod-forge-ams',
              slug: 'forge-a1-pro-ams',
              badge: 'NEW',
              badgeBg: 'bg-red-600',
              brand: 'FORGE',
              name: 'Forge A1 Pro AMS',
              specs: '4-colour AMS · 256³ build · enclosed',
              price: 62999,
              originalPrice: 71999,
              rating: '4.6',
              ratingsCount: '1,120',
              image: '/images/forge-a1-pro-ams.png'
            },
            {
              id: 'prod-halo-4k',
              slug: 'halo-resin-4k',
              badge: null,
              brand: 'HALO',
              name: 'Halo Resin 4K',
              specs: '8.9" mono LCD · 22µm XY',
              price: 24499,
              originalPrice: 29999,
              rating: '4.3',
              ratingsCount: '908',
              image: '/images/halo-resin-4k.png'
            },
            {
              id: 'prod-ender-craft-9',
              slug: 'ender-craft-9',
              badge: 'BUDGET',
              badgeBg: 'bg-black',
              brand: 'ENDER',
              name: 'Ender Craft 9',
              specs: 'Bedslinger · 220³ · beginner kit',
              price: 16999,
              originalPrice: 21999,
              rating: '4.1',
              ratingsCount: '5,210',
              image: '/images/ender-craft-9.png'
            }
          ].map((item) => (
            <div
              key={item.id}
              onClick={() => {
                addToCart({
                  id: item.id,
                  slug: item.slug,
                  name: item.name,
                  price: item.price,
                  originalPrice: item.originalPrice,
                  image: item.image,
                  brand: item.brand,
                  vertical: '3d-printing',
                  category: 'Printers'
                }, 1);
              }}
              className="bg-white border border-slate-200/90 rounded-2xl p-4 flex flex-col justify-between hover:shadow-lg transition-all duration-300 group cursor-pointer"
            >
              <div>
                {/* Image Box */}
                <div className="relative aspect-[1.35] w-full rounded-xl bg-[#F5F5F7] p-3 mb-4 flex items-center justify-center overflow-hidden border border-slate-100">
                  {item.badge && (
                    <span className={`absolute top-3 left-3 z-10 ${item.badgeBg} text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-xs tracking-wider shadow-xs`}>
                      {item.badge}
                    </span>
                  )}
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                </div>

                {/* Brand Subtitle */}
                <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                  {item.brand}
                </span>

                {/* Name & Specs */}
                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight group-hover:text-red-600 transition">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-400 font-medium mt-1 mb-4">
                  {item.specs}
                </p>
              </div>

              {/* Price & Rating Row */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-lg sm:text-xl font-black text-slate-900">
                      ₹{item.price.toLocaleString('en-IN')}
                    </span>
                    {item.originalPrice && (
                      <span className="text-xs text-slate-400 line-through font-medium">
                        ₹{item.originalPrice.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Rating Badge */}
                <div className="flex items-center space-x-1.5">
                  <div className="bg-slate-950 text-white text-[10px] font-black px-2 py-0.5 rounded flex items-center space-x-1">
                    <span>{item.rating}</span>
                    <Star className="w-2.5 h-2.5 fill-white text-white" />
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    {item.ratingsCount} ratings
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. PREMIUM 3D PRINTERS SECTION (Exact requested red header & layout) */}
      <section id="premium-printers" className="py-10 px-4 sm:px-6 lg:px-8 max-w-[1536px] mx-auto">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs">
          
          {/* Header with red text emphasis and carousel arrows */}
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Premium <span className="text-red-600">3D Printers</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Top-tier industrial & flagship desktop 3D printers with high-speed CoreXY motion systems.
              </p>
            </div>

            {/* Left & Right Arrow Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => scrollContainer(premiumScrollRef, 'left')}
                className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 shadow-xs transition active:scale-95"
                aria-label="Previous Premium Printers"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollContainer(premiumScrollRef, 'right')}
                className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 shadow-xs transition active:scale-95"
                aria-label="Next Premium Printers"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Horizontal Scrolling Card Container */}
          <div
            ref={premiumScrollRef}
            className="flex space-x-6 overflow-x-auto scrollbar-none pb-4 snap-x"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {premiumPrinters.map((product) => {
              const discountPercent = product.originalPrice
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : null;
              const productUrl = `/${product.vertical}/${product.category.toLowerCase().replace(/\s+/g, '-')}/${product.slug}`;

              return (
                <div
                  key={product.id}
                  className="min-w-[270px] max-w-[290px] sm:min-w-[300px] bg-slate-50 rounded-3xl border border-slate-200 p-4 flex flex-col justify-between group hover:border-red-500 hover:shadow-xl transition-all duration-300 snap-start flex-shrink-0"
                >
                  <div>
                    {/* Image Area with Badges & Hover Action */}
                    <div className="relative aspect-square w-full rounded-2xl bg-white p-3 overflow-hidden border border-slate-200/60 mb-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';
                        }}
                        className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Top Sale & Brand Badges */}
                      <div className="absolute top-3 left-3 z-10">
                        {discountPercent && discountPercent > 0 && (
                          <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md shadow-xs tracking-wider">
                            SALE
                          </span>
                        )}
                      </div>

                      <div className="absolute top-3 right-3 z-10">
                        <span className="bg-white/90 backdrop-blur-md border border-slate-200 text-slate-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
                          {product.brand}
                        </span>
                      </div>

                      {/* Add to Cart Overlay Pill */}
                      <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex justify-center">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart(product, 1);
                          }}
                          className="w-full py-2.5 bg-slate-900 hover:bg-red-600 text-white text-xs font-black rounded-xl shadow-lg flex items-center justify-center space-x-2 transition"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>+ Add to Cart</span>
                        </button>
                      </div>
                    </div>

                    {/* Title & Brand */}
                    <span className="text-[10px] font-black uppercase tracking-wider text-red-600">
                      {product.brand}
                    </span>
                    <Link href={productUrl}>
                      <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 mt-1 group-hover:text-red-600 transition leading-snug">
                        {product.name}
                      </h3>
                    </Link>
                  </div>

                  {/* Price & Rating Row */}
                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="flex items-baseline space-x-1.5">
                        <span className="text-base sm:text-lg font-black text-slate-900">
                          ₹{product.price.toLocaleString('en-IN')}
                        </span>
                        {product.originalPrice && (
                          <span className="text-xs text-slate-400 line-through font-medium">
                            ₹{product.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-1 bg-emerald-700 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                      <span>{product.rating}</span>
                      <Star className="w-2.5 h-2.5 fill-white" />
                    </div>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 4. SHOP BY BRAND SECTION (Exact requested design & logos) */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-[1536px] mx-auto">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs">
          
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Shop By <span className="text-red-600">Brand</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Choose your favorite 3D printer brand to start your next creative project.
              </p>
            </div>

            {/* Carousel Arrow Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => scrollContainer(brandScrollRef, 'left')}
                className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 shadow-xs transition active:scale-95"
                aria-label="Previous Brand"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollContainer(brandScrollRef, 'right')}
                className="w-10 h-10 rounded-full border border-slate-200 bg-white hover:bg-slate-100 flex items-center justify-center text-slate-700 shadow-xs transition active:scale-95"
                aria-label="Next Brand"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Brand Cards Carousel */}
          <div
            ref={brandScrollRef}
            className="flex space-x-4 sm:space-x-6 overflow-x-auto scrollbar-none py-2 snap-x"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {brandsList.map((brand) => (
              <div
                key={brand.id}
                onClick={() => {
                  setSelectedBrand(brand.brandQuery);
                  document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className={`min-w-[160px] sm:min-w-[190px] p-6 rounded-2xl border cursor-pointer transition-all duration-300 flex flex-col items-center justify-center text-center group snap-start flex-shrink-0 ${
                  selectedBrand.toLowerCase() === brand.brandQuery.toLowerCase()
                    ? 'bg-red-50 border-red-600 shadow-md ring-2 ring-red-300'
                    : 'bg-slate-50 border-slate-200 hover:border-red-400 hover:bg-white hover:shadow-lg'
                }`}
              >
                <div className="h-12 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                  {brand.logo}
                </div>
                <span className="text-[11px] font-bold text-slate-600 group-hover:text-red-600 transition mt-1">
                  Explore {brand.brandQuery}
                </span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 5. SPECIAL FILAMENTS DEAL SECTION (Exact requested banner & spool grid) */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-[1536px] mx-auto">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs">
          
          <div className="mb-8 pb-4 border-b border-slate-100">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-wider mb-2 border border-red-200">
              <Flame className="w-3 h-3 text-red-600" />
              <span>Limited Time Bundle Offers</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Special Filaments <span className="text-red-600">Deal</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Get maximum value with our premium spools, multi-color bundles, and high-temp filaments.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Showcase Banner Box */}
            <div className="lg:col-span-4 bg-gradient-to-br from-slate-900 via-slate-800 to-red-950 p-6 sm:p-8 rounded-3xl text-white flex flex-col justify-between relative overflow-hidden group shadow-xl">
              <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-red-600/20 rounded-full blur-2xl group-hover:bg-red-600/30 transition-all" />
              
              <div className="relative z-10 space-y-4">
                <span className="bg-red-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full tracking-wider shadow-md">
                  SPECIAL OFFER
                </span>

                <h3 className="text-2xl sm:text-3xl font-black leading-tight">
                  High-Speed Filament Bundles
                </h3>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  Buy 3 or more spools of PLA+, PETG, or Silk Co-Extrusion filaments and receive an automatic 20% discount at checkout.
                </p>
              </div>

              {/* Decorative Filament Spool Image Container */}
              <div className="relative z-10 my-6 bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/20 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=800&q=80"
                  alt="Special Filaments Deal Showcase"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';
                  }}
                  className="w-full h-44 object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="relative z-10 pt-2">
                <button
                  onClick={() => {
                    setSelectedCategory('Filaments');
                    document.getElementById('catalog')?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full py-3.5 bg-red-600 hover:bg-red-500 text-white text-xs font-black rounded-xl shadow-lg flex items-center justify-center space-x-2 transition"
                >
                  <span>Explore Filament Deals</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Filament Deals Grid */}
            <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {filamentDeals.slice(0, 4).map((filament) => {
                const discountPercent = filament.originalPrice
                  ? Math.round(((filament.originalPrice - filament.price) / filament.originalPrice) * 100)
                  : 15;

                return (
                  <div
                    key={filament.id}
                    className="bg-slate-50 border border-slate-200 p-5 rounded-3xl flex flex-col justify-between hover:border-red-400 hover:shadow-xl transition-all duration-300 group"
                  >
                    <div>
                      {/* Spool Image with Sale Badge */}
                      <div className="relative aspect-video w-full rounded-2xl bg-white p-3 border border-slate-200/80 mb-4 overflow-hidden">
                        <img
                          src={filament.image}
                          alt={filament.name}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80';
                          }}
                          className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-3 left-3 bg-red-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md shadow-xs">
                          {discountPercent}% OFF
                        </span>
                        {filament.attributes?.material && (
                          <span className="absolute top-3 right-3 bg-slate-900 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md">
                            {filament.attributes.material}
                          </span>
                        )}
                      </div>

                      <span className="text-[10px] font-black uppercase tracking-wider text-red-600">
                        {filament.brand}
                      </span>
                      <h4 className="text-sm font-bold text-slate-900 line-clamp-2 mt-1 group-hover:text-red-600 transition">
                        {filament.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {filament.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="flex items-baseline space-x-1.5">
                          <span className="text-lg font-black text-slate-900">
                            ₹{filament.price.toLocaleString('en-IN')}
                          </span>
                          {filament.originalPrice && (
                            <span className="text-xs text-slate-400 line-through font-medium">
                              ₹{filament.originalPrice.toLocaleString('en-IN')}
                            </span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => addToCart(filament, 1)}
                        className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl shadow-md shadow-red-600/20 flex items-center space-x-1.5 transition"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </section>

      {/* 6. OUR BEST SELLERS SECTION (Exact requested split showcase card & tabs) */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-[1536px] mx-auto">
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs">
          
          {/* Header & Filter Tabs */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Our Best <span className="text-red-600">Sellers</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Discover our best selling 3D printers, print head products, filaments & post-processing tools.
              </p>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'enclosed', label: 'Enclosed CoreXY Printers' },
                { id: 'open', label: 'High-Speed Open Printers' },
                { id: 'filaments', label: 'Filaments & Bundles' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setBestSellerTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition ${
                    bestSellerTab === tab.id
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Main Best Seller Feature Split View Card */}
          {featuredBestSeller && (
            <div className="bg-slate-50 border border-slate-200 rounded-3xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-8">
              
              {/* Left Image Showcase */}
              <div className="lg:col-span-6 relative">
                <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-lg overflow-hidden group">
                  <img
                    src={featuredBestSeller.image}
                    alt={featuredBestSeller.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';
                    }}
                    className="w-full h-72 sm:h-80 object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-6 left-6 bg-red-600 text-white text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-md tracking-wider">
                    BEST SELLING #1
                  </div>
                </div>
              </div>

              {/* Right Technical Specs & Buy Actions */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-red-600">
                    {featuredBestSeller.brand} • TOP RATED CHOICE
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">
                    {featuredBestSeller.name}
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
                    {featuredBestSeller.description}
                  </p>
                </div>

                {/* Feature Specs List with Icons */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold text-slate-800">
                  <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-white border border-slate-200">
                    <Zap className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <span>Fast Automatic Full-Color</span>
                  </div>
                  <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-white border border-slate-200">
                    <Gauge className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <span>Up to 500 mm/s Speed</span>
                  </div>
                  <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-white border border-slate-200">
                    <Wrench className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <span>1-Clip Quick Swap Nozzle</span>
                  </div>
                  <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-white border border-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <span>Full-Auto Bed Mesh Leveling</span>
                  </div>
                </div>

                {/* Price & Primary Call to Actions */}
                <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-slate-500 font-semibold block">Exclusive Store Price</span>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-2xl sm:text-3xl font-black text-slate-900">
                        ₹{featuredBestSeller.price.toLocaleString('en-IN')}
                      </span>
                      {featuredBestSeller.originalPrice && (
                        <span className="text-sm text-slate-400 line-through font-medium">
                          ₹{featuredBestSeller.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => addToCart(featuredBestSeller, 1)}
                      className="px-7 py-3.5 bg-red-600 hover:bg-red-700 text-white text-xs font-black rounded-xl shadow-lg shadow-red-600/20 flex items-center space-x-2 transition transform hover:-translate-y-0.5"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>+ Add to Cart</span>
                    </button>

                    <Link
                      href={`/${featuredBestSeller.vertical}/${featuredBestSeller.category.toLowerCase().replace(/\s+/g, '-')}/${featuredBestSeller.slug}`}
                      className="px-5 py-3.5 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold rounded-xl border border-slate-300 transition"
                    >
                      <span>View Details</span>
                    </Link>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* Secondary Bestseller Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

        </div>
      </section>

      {/* 7. MATERIALS COMPARISON GUIDE */}
      <section id="materials" className="py-6 px-4 sm:px-6 lg:px-8 max-w-[1536px] mx-auto">
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

      {/* 8. MAIN PRODUCT CATALOG & FILTERING */}
      <section id="catalog" className="py-8 px-4 sm:px-6 lg:px-8 max-w-[1536px] mx-auto">
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

              {selectedBrand !== 'all' && (
                <button
                  onClick={() => setSelectedBrand('all')}
                  className="px-3 py-1 text-xs font-black bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition border border-red-300"
                >
                  Clear Brand: {selectedBrand} ✕
                </button>
              )}
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
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedBrand('all');
                  setSelectedMaterial('all');
                }}
                className="block mx-auto mt-3 px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-xl"
              >
                Reset All Filters
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
