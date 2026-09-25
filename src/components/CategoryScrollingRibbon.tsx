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
  PlusCircle,
  Zap,
  Cpu,
  Feather,
  Droplet
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
  const isFashion = pathname.startsWith('/fashion');
  const isBeauty = pathname.startsWith('/beauty');

  // Vertical 1: 3D Printing Categories ONLY
  const threeDCategories = [
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
      id: 'accessories',
      label: 'Accessories',
      icon: Sparkles,
      badge: 'PEI & Dryers',
      link: '/3d-printing',
      catFilter: 'Printer Accessories',
    },
    {
      id: 'corexy',
      label: 'CoreXY Printers',
      icon: Zap,
      badge: '600 mm/s',
      link: '/3d-printing',
      catFilter: 'Printers',
    },
    {
      id: 'engineering',
      label: 'Engineering Materials',
      icon: Cpu,
      badge: 'Nylon & CF',
      link: '/3d-printing',
      catFilter: 'Filaments',
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

  // Vertical 2: Fashion Categories ONLY
  const fashionCategories = [
    {
      id: 'korean-tops',
      label: 'GenZ Apparel',
      icon: Shirt,
      badge: 'New Fit',
      link: '/fashion',
      catFilter: 'Tops',
    },
    {
      id: 'shirts',
      label: 'Camp Shirts',
      icon: Shirt,
      badge: 'Minimalist',
      link: '/fashion',
      catFilter: 'Shirts',
    },
    {
      id: 'denim',
      label: 'Skate Denim',
      icon: Scissors,
      badge: 'Y2K Baggy',
      link: '/fashion',
      catFilter: 'Jeans',
    },
    {
      id: 'cargo-bottoms',
      label: 'Cargo Pants',
      icon: Scissors,
      badge: 'Utilitarian',
      link: '/fashion',
      catFilter: 'Bottoms',
    },
    {
      id: 'watches',
      label: 'Cyber Watches',
      icon: Watch,
      badge: 'Digital Steel',
      link: '/fashion',
      catFilter: 'Watches',
    },
    {
      id: 'hot-fashion',
      label: 'Trending Fits',
      icon: Flame,
      badge: '20% OFF',
      link: '/fashion',
      catFilter: 'all',
    },
  ];

  // Vertical 3: Beauty Categories ONLY
  const beautyCategories = [
    {
      id: 'perfumes',
      label: 'Luxury Perfumes',
      icon: Sparkles,
      badge: 'Maison 3DOM',
      link: '/beauty',
      catFilter: 'Perfumes',
    },
    {
      id: 'shampoo',
      label: 'Organic Shampoo',
      icon: Droplet,
      badge: 'Argan Oil',
      link: '/beauty',
      catFilter: 'Shampoo',
    },
    {
      id: 'hair-masks',
      label: 'Keratin Care',
      icon: Feather,
      badge: 'Restorative',
      link: '/beauty',
      catFilter: 'Masks',
    },
    {
      id: 'lip-balms',
      label: 'Lip Treatments',
      icon: Sparkles,
      badge: 'Berry Rose',
      link: '/beauty',
      catFilter: 'Lip Balms',
    },
    {
      id: 'k-glow',
      label: 'K-Glow Sheet Masks',
      icon: Sparkles,
      badge: 'Hydrating',
      link: '/beauty',
      catFilter: 'Masks',
    },
    {
      id: 'hot-beauty',
      label: 'Beauty Deals',
      icon: Flame,
      badge: 'BEST SELLERS',
      link: '/beauty',
      catFilter: 'all',
    },
  ];

  // Select categories array based on active page route
  const currentCategories = isFashion
    ? fashionCategories
    : isBeauty
    ? beautyCategories
    : threeDCategories;

  const handleCategoryClick = (item: typeof currentCategories[0]) => {
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
    <div className="w-full bg-warm-card border-b border-warm-border py-1.5 sm:py-2">
      <div className="relative max-w-7xl mx-auto px-2 sm:px-8">
        
        {/* Scroll Left Button */}
        <button
          onClick={scrollLeft}
          className="hidden sm:flex absolute left-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-warm-card border border-warm-border shadow-warm-sm text-warm-muted hover:bg-warm-surface items-center justify-center transition focus:outline-none cursor-pointer"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Horizontal Category Pill Cards Container */}
        <div
          ref={scrollContainerRef}
          className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto scrollbar-none scroll-smooth px-2 sm:px-6 py-0.5"
        >
          {currentCategories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory && selectedCategory.toLowerCase() === cat.catFilter?.toLowerCase();

            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryClick(cat)}
                className={`group flex items-center space-x-2.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border transition-all flex-shrink-0 cursor-pointer text-left focus:outline-none ${
                  isActive
                    ? 'bg-warm-accent-light border-warm-accent shadow-warm-sm'
                    : 'bg-warm-surface hover:bg-white border-warm-border hover:border-warm-accent/40 hover:shadow-warm-sm'
                }`}
              >
                {/* Category Icon */}
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl flex items-center justify-center transition-colors ${
                  isActive ? 'bg-warm-accent text-white' : 'bg-warm-accent-light text-warm-accent group-hover:bg-warm-accent group-hover:text-white'
                }`}>
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>

                {/* Label & Badge */}
                <div className="flex flex-col">
                  <span className={`text-[11px] sm:text-xs font-semibold transition ${
                    isActive ? 'text-warm-accent' : 'text-warm-text group-hover:text-warm-accent'
                  }`}>
                    {cat.label}
                  </span>
                  {cat.badge && (
                    <span className="text-[8px] sm:text-[9px] font-bold uppercase text-warm-badge-text tracking-wider">
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
          className="hidden sm:flex absolute right-1 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-warm-card border border-warm-border shadow-warm-sm text-warm-muted hover:bg-warm-surface items-center justify-center transition focus:outline-none cursor-pointer"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
};
