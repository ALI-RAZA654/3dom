'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Search,
  User,
  Sparkles,
  Box,
  Shirt,
  ShieldCheck,
  X,
  ChevronDown,
  Menu,
  Truck,
  Zap,
  LogOut,
  Gift,
  Share2,
  Trophy,
  Tag,
  Lock
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { fetchProducts } from '@/lib/api';
import { RewardsModal } from '@/components/RewardsModal';

export const Header: React.FC<{ onRequestModalOpen: () => void }> = ({ onRequestModalOpen }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { cart, setIsCartOpen } = useCart();
  const { user, isAdmin, setIsAuthModalOpen, logout } = useAuth();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLoginHoverDropdownOpen, setIsLoginHoverDropdownOpen] = useState(false);
  const [isSearchInputOpen, setIsSearchInputOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavHidden, setIsNavHidden] = useState(false);
  const lastScrollY = useRef(0);

  // Rewards modal state
  const [isRewardsModalOpen, setIsRewardsModalOpen] = useState(false);
  const [rewardsDefaultTab, setRewardsDefaultTab] = useState<'rewards' | 'referrals'>('rewards');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const loginDropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Active store determination
  const is3D = pathname.startsWith('/3d-printing') || pathname === '/';
  const isFashion = pathname.startsWith('/fashion');
  const isBeauty = pathname.startsWith('/beauty');

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Scroll detection — hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 10);
      if (currentScrollY > lastScrollY.current && currentScrollY > 80) {
        setIsNavHidden(true);
      } else {
        setIsNavHidden(false);
      }
      lastScrollY.current = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
      }
      if (loginDropdownRef.current && !loginDropdownRef.current.contains(e.target as Node)) {
        setIsLoginHoverDropdownOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchInputOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Autocomplete fetch
  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      fetchProducts({ search: searchQuery })
        .then((res) => {
          setSearchResults(res.slice(0, 5));
        })
        .catch((err) => console.error(err));
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  // Focus search input on toggle
  useEffect(() => {
    if (isSearchInputOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchInputOpen]);

  // Store Navigation Items
  const storeLinks = [
    {
      id: '3d-printing',
      title: '3D Printing',
      icon: Box,
      href: '/3d-printing',
      active: is3D,
    },
    {
      id: 'fashion',
      title: 'Korean Fashion',
      icon: Shirt,
      href: '/fashion',
      active: isFashion,
    },
    {
      id: 'beauty',
      title: 'Beauty',
      icon: Sparkles,
      href: '/beauty',
      active: isBeauty,
    },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out ${
          isNavHidden ? '-translate-y-full' : 'translate-y-0'
        } ${
          isScrolled
            ? 'shadow-[0_4px_20px_rgba(0,0,0,0.12)] bg-white/98 backdrop-blur-md'
            : 'bg-warm-card/95 backdrop-blur-md'
        }`}
      >
        {/* ─── 1. MAIN BRAND HEADER (Logo + Store Nav + Actions) ─── */}
        <div className="border-b border-warm-border">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-2 sm:gap-4">

            {/* Left: Menu Dropdown + 3DOM Brand Logo */}
            <div className="flex items-center space-x-2 sm:space-x-3">

              {/* Dropdown Navigation Menu */}
              <div ref={dropdownRef} className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition border border-warm-border bg-warm-surface hover:bg-white text-warm-text shadow-warm-sm cursor-pointer"
                  aria-label="Navigation Menu"
                >
                  <Menu className="w-4 h-4 text-warm-muted" />
                  <span className="inline text-[11px] sm:text-xs font-bold">All Stores</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 text-warm-muted ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown Panel */}
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-64 max-w-[88vw] bg-warm-card text-warm-text rounded-2xl shadow-warm-lg border border-warm-border overflow-hidden z-50 p-2 space-y-1">
                    <div className="eyebrow px-3 py-2 border-b border-warm-border-light text-[10px]">
                      Select Store
                    </div>

                    <Link
                      href="/3d-printing"
                      onClick={() => setIsDropdownOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                        is3D ? 'bg-warm-accent-light text-warm-accent border border-warm-accent/20' : 'hover:bg-warm-surface text-warm-text'
                      }`}
                    >
                      <Box className="w-4 h-4 text-warm-accent" />
                      <span>3D Printing Store</span>
                    </Link>

                    <Link
                      href="/fashion"
                      onClick={() => setIsDropdownOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                        isFashion ? 'bg-warm-accent-light text-warm-accent border border-warm-accent/20' : 'hover:bg-warm-surface text-warm-text'
                      }`}
                    >
                      <Shirt className="w-4 h-4 text-warm-accent" />
                      <span>GenZ / Korean Fashion</span>
                    </Link>

                    <Link
                      href="/beauty"
                      onClick={() => setIsDropdownOpen(false)}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                        isBeauty ? 'bg-warm-accent-light text-warm-accent border border-warm-accent/20' : 'hover:bg-warm-surface text-warm-text'
                      }`}
                    >
                      <Sparkles className="w-4 h-4 text-warm-accent" />
                      <span>Luxury Beauty Store</span>
                    </Link>

                    <div className="my-1 border-t border-warm-border-light" />

                    <Link
                      href="/products"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-warm-text hover:bg-warm-surface transition"
                    >
                      <Zap className="w-4 h-4 text-red-600" />
                      <span>View All Products</span>
                    </Link>

                    <Link
                      href="/orders"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-warm-text hover:bg-warm-surface transition"
                    >
                      <Truck className="w-4 h-4 text-emerald-600" />
                      <span>Track Your Order</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* 3DOM Brand Logo */}
              <Link href={isFashion ? '/fashion' : isBeauty ? '/beauty' : '/3d-printing'} className="flex items-center group shrink-0">
                <span className="logo-wordmark text-xl sm:text-2xl text-warm-text group-hover:text-warm-accent transition font-extrabold tracking-tight">
                  3DOM
                </span>
                <span className="ml-2 eyebrow px-2 py-0.5 rounded-md bg-warm-badge-bg text-warm-badge-text border border-warm-border-light hidden sm:inline-block text-[10px]">
                  Storefront
                </span>
              </Link>
            </div>

            {/* Center: Store Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              {storeLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.id}
                    href={link.href}
                    className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                      link.active
                        ? 'bg-warm-text text-white'
                        : 'text-warm-muted hover:text-warm-text hover:bg-warm-surface'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${link.active ? 'text-white' : 'text-warm-accent'}`} />
                    <span>{link.title}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Right: Action Buttons (Search Icon + Login Dropdown + Cart) */}
            <div className="flex items-center space-x-2 sm:space-x-3">

              {/* 🔍 1. SEARCH ICON BUTTON & POPUP SEARCH BAR */}
              <div ref={searchRef} className="relative">
                <button
                  onClick={() => setIsSearchInputOpen(!isSearchInputOpen)}
                  className={`p-2 rounded-xl border transition flex items-center justify-center cursor-pointer ${
                    isSearchInputOpen
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'border-warm-border bg-warm-surface hover:bg-white text-warm-text shadow-warm-sm'
                  }`}
                  title="Search products"
                  aria-label="Search"
                >
                  <Search className="w-4 h-4" />
                </button>

                {/* Popover Inline Search Bar */}
                {isSearchInputOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 sm:w-96 bg-warm-card text-warm-text rounded-2xl shadow-2xl border border-warm-border p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="relative flex items-center">
                      <Search className="w-4 h-4 text-warm-muted absolute left-3" />
                      <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search products, filament, streetwear..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full py-2 pl-9 pr-8 text-xs sm:text-sm bg-white border border-warm-border rounded-xl text-warm-text placeholder-warm-muted outline-none focus:border-warm-accent focus:ring-2 focus:ring-warm-accent-light"
                      />
                      {searchQuery && (
                        <button
                          onClick={() => setSearchQuery('')}
                          className="absolute right-2.5 text-warm-muted hover:text-warm-text"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Autocomplete Results */}
                    {searchResults.length > 0 && (
                      <div className="mt-2.5 space-y-1 max-h-64 overflow-y-auto border-t border-warm-border-light pt-2">
                        <div className="eyebrow px-1 pb-1 text-[9px]">Matching Products</div>
                        {searchResults.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => {
                              setIsSearchInputOpen(false);
                              setSearchQuery('');
                              router.push(`/${item.vertical}/${item.category.toLowerCase().replace(/\s+/g, '-')}/${item.slug}`);
                            }}
                            className="flex items-center space-x-3 p-2 hover:bg-warm-accent-light rounded-xl cursor-pointer transition"
                          >
                            <img src={item.image} alt={item.name} className="w-9 h-9 object-cover rounded-lg border border-warm-border" />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-warm-text truncate">{item.name}</p>
                              <p className="text-[10px] text-warm-muted capitalize">{item.vertical} &bull; {item.category}</p>
                            </div>
                            <span className="text-xs font-bold text-warm-accent">${item.price}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* 👤 2. LOGIN BUTTON WITH HOVER DROPDOWN (Admin Login, Rewards, Referrals) */}
              <div
                ref={loginDropdownRef}
                className="relative"
                onMouseEnter={() => setIsLoginHoverDropdownOpen(true)}
                onMouseLeave={() => setIsLoginHoverDropdownOpen(false)}
              >
                <button
                  onClick={() => {
                    if (user) {
                      setIsLoginHoverDropdownOpen(!isLoginHoverDropdownOpen);
                    } else {
                      setIsAuthModalOpen(true);
                    }
                  }}
                  className="px-3 py-1.5 sm:py-2 rounded-xl border border-warm-border bg-warm-surface hover:bg-white text-warm-text text-xs font-bold transition flex items-center space-x-1.5 cursor-pointer shadow-warm-sm"
                >
                  <User className="w-3.5 h-3.5 text-warm-accent" />
                  <span>{user ? user.name.split(' ')[0] : 'Login'}</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 text-warm-muted ${isLoginHoverDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Hover Dropdown Panel */}
                {isLoginHoverDropdownOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-60 bg-warm-card text-warm-text rounded-2xl shadow-2xl border border-warm-border overflow-hidden z-50 p-2 space-y-1 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-3 py-2 border-b border-warm-border-light flex items-center justify-between">
                      <span className="eyebrow text-[9px]">Account Navigation</span>
                      <span className="text-[9px] font-bold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">3DOM Club</span>
                    </div>

                    {/* 1. Admin Login Option */}
                    <Link
                      href="/admin"
                      onClick={() => setIsLoginHoverDropdownOpen(false)}
                      className="flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 hover:bg-emerald-50 hover:text-emerald-700 transition"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <div className="flex-1">
                        <p className="font-bold">Admin Portal Login</p>
                        <p className="text-[9px] text-warm-muted">Inventory & Orders</p>
                      </div>
                    </Link>

                    {/* 2. Rewards Option */}
                    <button
                      onClick={() => {
                        setIsLoginHoverDropdownOpen(false);
                        setRewardsDefaultTab('rewards');
                        setIsRewardsModalOpen(true);
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 hover:bg-amber-50 hover:text-amber-700 transition text-left cursor-pointer"
                    >
                      <Trophy className="w-4 h-4 text-amber-500" />
                      <div className="flex-1">
                        <p className="font-bold">Rewards & Points</p>
                        <p className="text-[9px] text-warm-muted">Generate Discount Coupons</p>
                      </div>
                    </button>

                    {/* 3. Referrals Option */}
                    <button
                      onClick={() => {
                        setIsLoginHoverDropdownOpen(false);
                        setRewardsDefaultTab('referrals');
                        setIsRewardsModalOpen(true);
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-semibold text-slate-800 hover:bg-red-50 hover:text-warm-accent transition text-left cursor-pointer"
                    >
                      <Share2 className="w-4 h-4 text-warm-accent" />
                      <div className="flex-1">
                        <p className="font-bold">Referral Program</p>
                        <p className="text-[9px] text-warm-muted">Invite friends for 20% OFF</p>
                      </div>
                    </button>

                    {/* Auth Action Footer */}
                    <div className="pt-1 border-t border-warm-border-light">
                      {user ? (
                        <button
                          onClick={() => {
                            setIsLoginHoverDropdownOpen(false);
                            logout();
                          }}
                          className="w-full flex items-center space-x-2 px-3 py-1.5 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 transition cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            setIsLoginHoverDropdownOpen(false);
                            setIsAuthModalOpen(true);
                          }}
                          className="w-full py-1.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition text-center"
                        >
                          Sign In / Register
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* 🛒 3. SHOPPING CART BUTTON */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs transition flex items-center space-x-1.5 sm:space-x-2 shadow-md cursor-pointer shrink-0"
                title="View Shopping Cart"
              >
                <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="inline text-xs">Cart</span>
                {cartCount > 0 && (
                  <span className="bg-white text-slate-900 font-extrabold text-[10px] w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full flex items-center justify-center border border-slate-900/20 ml-0.5">
                    {cartCount}
                  </span>
                )}
              </button>

            </div>
          </div>
        </div>

        {/* ─── 2. SUBTLE ANNOUNCEMENT BAR ─── */}
        <div className="bg-warm-badge-bg border-b border-warm-border-light">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-1 flex items-center justify-between">
            <div className="flex items-center space-x-2 truncate">
              <span className="eyebrow bg-warm-accent text-white px-2 py-0.5 rounded-full text-[9px] tracking-wider shrink-0">
                OFFER
              </span>
              <span className="text-[11px] sm:text-xs text-warm-muted truncate">
                <span className="font-semibold text-warm-text">Flash Sale:</span> Extra 10% OFF with code <span className="font-bold text-warm-accent underline underline-offset-2">3DOM10</span> &bull; Free Shipping Over $99
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-4 text-[11px] font-medium text-warm-muted shrink-0">
              <Link href="/orders" className="flex items-center space-x-1 hover:text-warm-accent transition">
                <Truck className="w-3.5 h-3.5" />
                <span>Track Orders</span>
              </Link>
            </div>
          </div>
        </div>

      </header>

      {/* Rewards & Referrals Modal */}
      <RewardsModal
        isOpen={isRewardsModalOpen}
        onClose={() => setIsRewardsModalOpen(false)}
        defaultTab={rewardsDefaultTab}
      />
    </>
  );
};
