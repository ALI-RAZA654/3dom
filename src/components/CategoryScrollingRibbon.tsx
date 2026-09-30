'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  ChevronDown,
  Printer,
  Layers,
  Wrench,
  Sparkles,
  Watch,
  Zap,
  Cpu,
  Feather,
  Droplet,
  Shirt,
  Scissors,
  LayoutGrid,
  Flame,
  Tag,
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Determine active vertical context
  const isFashion = pathname.startsWith('/fashion');
  const isBeauty = pathname.startsWith('/beauty');

  // ─── 3D Printing Categories ───
  const threeDCategories = [
    { id: '3d-printers', label: '3D Printers', catFilter: 'Printers', icon: Printer },
    { id: 'filaments', label: 'Filament', catFilter: 'Filaments', icon: Layers },
    { id: 'parts', label: 'Printer Parts', catFilter: '3D Printer Parts', icon: Wrench },
    { id: 'accessories', label: 'Accessories', catFilter: 'Printer Accessories', icon: Sparkles },
    { id: 'corexy', label: 'CoreXY Printers', catFilter: 'Printers', icon: Zap },
    { id: 'engineering', label: 'Engineering Materials', catFilter: 'Filaments', icon: Cpu },
  ];

  // ─── Fashion Categories ───
  const fashionCategories = [
    { id: 'korean-tops', label: 'GenZ Apparel', catFilter: 'Tops', icon: Shirt },
    { id: 'shirts', label: 'Camp Shirts', catFilter: 'Shirts', icon: Shirt },
    { id: 'denim', label: 'Skate Denim', catFilter: 'Jeans', icon: Scissors },
    { id: 'cargo-bottoms', label: 'Cargo Pants', catFilter: 'Bottoms', icon: Scissors },
    { id: 'watches', label: 'Cyber Watches', catFilter: 'Watches', icon: Watch },
  ];

  // ─── Beauty Categories ───
  const beautyCategories = [
    { id: 'perfumes', label: 'Luxury Perfumes', catFilter: 'Perfumes', icon: Sparkles },
    { id: 'shampoo', label: 'Organic Shampoo', catFilter: 'Shampoo', icon: Droplet },
    { id: 'hair-masks', label: 'Keratin Care', catFilter: 'Masks', icon: Feather },
    { id: 'lip-balms', label: 'Lip Treatments', catFilter: 'Lip Balms', icon: Sparkles },
    { id: 'k-glow', label: 'K-Glow Masks', catFilter: 'Masks', icon: Sparkles },
  ];

  const allCategories = isFashion
    ? fashionCategories
    : isBeauty
    ? beautyCategories
    : threeDCategories;

  // Quick nav links (shown as simple text in the bar)
  const quickLinks = allCategories.slice(0, 6);

  // Full category list for the dropdown
  const dropdownCategories = allCategories;

  const handleCategoryClick = (catFilter: string) => {
    if (onSelectCategory) {
      onSelectCategory(catFilter);
    }
    const vertical = isFashion ? 'fashion' : isBeauty ? 'beauty' : '3d-printing';
    router.push(`/products?category=${encodeURIComponent(catFilter)}&vertical=${vertical}`);
  };

  const verticalLabel = isFashion ? 'Fashion' : isBeauty ? 'Beauty' : '3D Printing';

  return (
    <div className="w-full bg-white border-b border-warm-border pt-[68px] sm:pt-[72px]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[40px] sm:h-[44px]">

          {/* ─── LEFT: Shop Categories Dropdown ─── */}
          <div ref={dropdownRef} className="relative shrink-0">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className={`flex items-center space-x-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-[13px] font-bold transition cursor-pointer ${
                isDropdownOpen
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-900 text-white hover:bg-black'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Shop categories</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Panel */}
            {isDropdownOpen && (
              <div className="absolute left-0 top-full mt-1.5 w-64 bg-white rounded-2xl shadow-2xl border border-warm-border overflow-hidden z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-4 py-2 border-b border-warm-border-light">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-warm-muted">
                    {verticalLabel} Categories
                  </span>
                </div>
                {dropdownCategories.map((cat) => {
                  const Icon = cat.icon;
                  const isActive = selectedCategory?.toLowerCase() === cat.catFilter?.toLowerCase();
                  return (
                    <button
                      key={cat.id}
                      onClick={() => {
                        handleCategoryClick(cat.catFilter);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center space-x-3 px-4 py-2.5 text-xs sm:text-[13px] font-semibold transition text-left cursor-pointer ${
                        isActive
                          ? 'bg-warm-accent-light text-warm-accent'
                          : 'text-warm-text hover:bg-warm-surface hover:text-warm-accent'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-warm-accent' : 'text-warm-muted'}`} />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* ─── CENTER: Quick Category Text Links ─── */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 overflow-x-auto scrollbar-none mx-4">
            {quickLinks.map((cat) => {
              const isActive = selectedCategory?.toLowerCase() === cat.catFilter?.toLowerCase();
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.catFilter)}
                  className={`relative px-2.5 lg:px-3 py-1.5 text-xs sm:text-[13px] font-semibold whitespace-nowrap transition cursor-pointer rounded-md ${
                    isActive
                      ? 'text-warm-accent'
                      : 'text-warm-text hover:text-warm-accent'
                  }`}
                >
                  {cat.label}
                  {/* Active underline indicator */}
                  {isActive && (
                    <span className="absolute bottom-0 left-2.5 right-2.5 h-[2px] bg-warm-accent rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* ─── RIGHT: Deals of the Week ─── */}
          <button
            onClick={() => {
              router.push('/products?quickPick=onsale');
            }}
            className="hidden sm:flex items-center space-x-1.5 text-xs sm:text-[13px] font-bold text-warm-accent hover:text-red-700 transition cursor-pointer shrink-0"
          >
            <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Deals of the week</span>
          </button>

        </div>
      </div>
    </div>
  );
};
