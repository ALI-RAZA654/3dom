'use client';

import React, { useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  ChevronLeft,
  ChevronRight,
  Printer,
  Layers,
  Wrench,
  Shirt,
  Scissors,
  Sparkles,
  Watch,
  Flame,
  PlusCircle
} from 'lucide-react';

interface CategoryScrollingRibbonProps {
  onRequestModalOpen?: () => void;
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
}

export const CategoryScrollingRibbon: React.FC<CategoryScrollingRibbonProps> = ({
  onRequestModalOpen,
  selectedCategory,
  onSelectCategory,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -280, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 280, behavior: 'smooth' });
    }
  };

  // Determine active vertical context
  const is3D = pathname.startsWith('/3d-printing') || pathname === '/';
  const isFashion = pathname.startsWith('/fashion');
  const isBeauty = pathname.startsWith('/beauty');

  // Category Ribbon Data with icon, label, badge, target link/action
  const categories = [
    {
      id: '3d-printers',
      label: '3D Printers',
      icon: Printer,
      badge: 'Hot Deal',
      link: '/3d-printing',
      catFilter: 'Printers',
    },
    {
      id: 'filaments',
      label: 'Filaments',
      icon: Layers,
      badge: 'PLA & PETG',
      link: '/3d-printing',
      catFilter: 'Filaments',
    },
    {
      id: 'parts',
      label: 'Printer Parts',
      icon: Wrench,
      badge: 'High-Temp',
      link: '/3d-printing',
      catFilter: '3D Printer Parts',
    },
    {
      id: 'korean-tops',
      label: 'GenZ Apparel',
      icon: Shirt,
      badge: 'New Fit',
      link: '/fashion',
      catFilter: 'Tops',
    },
    {
      id: 'denim',
      label: 'Skate Denim',
      icon: Scissors,
      badge: 'Trending',
      link: '/fashion',
      catFilter: 'Jeans',
    },
    {
      id: 'beauty-rituals',
      label: 'Luxury Beauty',
      icon: Sparkles,
      badge: 'K-Glow',
      link: '/beauty',
      catFilter: 'all',
    },
    {
      id: 'watches',
      label: 'Cyber Watches',
      icon: Watch,
      badge: 'Edition',
      link: '/fashion',
      catFilter: 'Watches',
    },
    {
      id: 'custom-print',
      label: '+1 Custom Print',
      icon: PlusCircle,
      badge: '+1 Request',
      isAction: true,
      action: onRequestModalOpen,
    },
    {
      id: 'flash-deals',
      label: 'Hot Offers',
      icon: Flame,
      badge: '50% OFF',
      link: '/3d-printing#catalog',
      catFilter: 'all',
    },
  ];

  const handleCategoryClick = (item: typeof categories[0]) => {
    if (item.isAction && item.action) {
      item.action();
      return;
    }

    if (onSelectCategory && item.catFilter) {
      onSelectCategory(item.catFilter);
    }

    if (item.link) {
      router.push(item.link);
    }
  };

  return (
    <div className="w-full bg-white border-b border-slate-200/80 shadow-2xs py-3.5">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-8">
        
        {/* Scroll Left Button */}
        <button
          onClick={scrollLeft}
          className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-slate-200 shadow-md text-slate-700 hover:bg-slate-50 flex items-center justify-center transition focus:outline-none cursor-pointer"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-5 h-5 text-slate-700" />
        </button>

        {/* Horizontal Category Pill Cards Container */}
        <div
          ref={scrollContainerRef}
          className="flex items-center space-x-3.5 sm:space-x-4 overflow-x-auto scrollbar-none scroll-smooth px-6 py-1"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory && selectedCategory.toLowerCase() === cat.catFilter?.toLowerCase();

            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat)}
                className={`group flex items-center space-x-3 px-4 py-2.5 rounded-2xl border transition-all flex-shrink-0 cursor-pointer text-left focus:outline-none transform hover:-translate-y-0.5 ${
                  isActive
                    ? 'bg-red-50 border-red-500 shadow-sm ring-1 ring-red-300'
                    : 'bg-slate-50 hover:bg-white border-slate-200 hover:border-red-400 hover:shadow-md'
                }`}
              >
                {/* Category Icon */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center transition-colors ${
                  isActive ? 'bg-red-600 text-white' : 'bg-red-100/80 text-red-600 group-hover:bg-red-600 group-hover:text-white'
                }`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>

                {/* Label & Badge */}
                <div className="flex flex-col">
                  <span className={`text-xs font-bold transition ${
                    isActive ? 'text-red-600' : 'text-slate-900 group-hover:text-red-600'
                  }`}>
                    {cat.label}
                  </span>
                  {cat.badge && (
                    <span className="text-[9px] font-black uppercase text-red-600 tracking-wider">
                      {cat.badge}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Scroll Right Button */}
        <button
          onClick={scrollRight}
          className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-slate-200 shadow-md text-slate-700 hover:bg-slate-50 flex items-center justify-center transition focus:outline-none cursor-pointer"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-5 h-5 text-slate-700" />
        </button>

      </div>
    </div>
  );
};
