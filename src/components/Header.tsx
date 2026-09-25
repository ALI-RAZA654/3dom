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
  HeartHandshake,
  ShieldCheck,
  X,
  ChevronDown,
  Menu,
  Truck,
  PlusCircle,
  Zap,
  HelpCircle,
  LogOut
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { fetchProducts } from '@/lib/api';

export const Header: React.FC<{ onRequestModalOpen: () => void }> = ({ onRequestModalOpen }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { cart, setIsCartOpen } = useCart();
  const { user, isAdmin, setIsAuthModalOpen, logout } = useAuth();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchInputOpen, setIsSearchInputOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isNavHidden, setIsNavHidden] = useState(false);
  const lastScrollY = useRef(0);

  const dropdownRef = useRef<HTMLDivElement>(null);
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

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
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
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out ${
        isNavHidden ? '-translate-y-full' : 'translate-y-0'
      } ${
        isScrolled
          ? 'shadow-[0_4px_20px_rgba(0,0,0,0.12)] bg-white/98 backdrop-blur-md'
          : 'bg-warm-card/95 backdrop-blur-md'
      }`}
    >
      {/* ─── 1. MAIN BRAND HEADER — TOPMOST (Logo + Store Nav + Actions) ─── */}
      <div className="border-b border-warm-border">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2 sm:py-2.5 flex items-center justify-between gap-3 sm:gap-4">

          {/* Left: Menu Dropdown + 3DOM Brand Logo */}
          <div className="flex items-center space-x-2 sm:space-x-4">

            {/* Dropdown Navigation Menu */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs font-semibold transition border border-warm-border bg-warm-surface hover:bg-white text-warm-text shadow-warm-sm cursor-pointer"
                aria-label="Navigation Menu"
              >
                <Menu className="w-4 h-4 text-warm-muted" />
                <span className="inline text-[11px] sm:text-xs">All Stores</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 text-warm-muted ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Panel */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 max-w-[88vw] bg-warm-card text-warm-text rounded-2xl shadow-warm-lg border border-warm-border overflow-hidden z-50 p-2 space-y-1">
                  <div className="eyebrow px-3 py-2 border-b border-warm-border-light text-[10px]">
                    Select Store
                  </div>

                  {/* 1. 3D Printing */}
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

                  {/* 2. GenZ / Korean Fashion */}
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

                  {/* 3. Beauty Store */}
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

                  {/* 4. Products Catalog */}
                  <Link
                    href="/products"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center space-x-3 px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold text-warm-text hover:bg-warm-surface transition"
                  >
                    <Zap className="w-4 h-4 text-red-600" />
                    <span>View All Products</span>
                  </Link>

                  {/* 5. Order Tracking */}
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

          {/* Center: Store Navigation Links (3D Printing, Korean Fashion, Beauty) — NO CUSTOM BUTTON */}
          <nav className="hidden md:flex items-center space-x-1">
            {storeLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.id}
                  href={link.href}
                  className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition ${
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

          {/* Right: Action Buttons (Login/User + Cart) */}
          <div className="flex items-center space-x-1.5 sm:space-x-3">

            {/* User / Admin Login & Logout Buttons */}
            {user ? (
              <div className="flex items-center space-x-1.5">
                {isAdmin ? (
                  <Link
                    href="/admin"
                    className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition flex items-center space-x-1 text-xs font-semibold"
                    title="Admin Dashboard"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="hidden sm:inline">Admin</span>
                  </Link>
                ) : (
                  <span className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-warm-border bg-warm-surface text-warm-text text-xs font-semibold flex items-center space-x-1">
                    <User className="w-4 h-4 text-warm-accent" />
                    <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
                  </span>
                )}
                <button
                  onClick={logout}
                  className="px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl border border-warm-border bg-warm-surface hover:bg-warm-accent-light text-warm-muted text-xs font-semibold transition flex items-center space-x-1"
                  title="Logout"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl border border-warm-border bg-warm-surface hover:bg-white text-warm-text text-xs font-semibold transition flex items-center space-x-1.5 cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-warm-accent" />
                <span>Login</span>
              </button>
            )}

            {/* Shopping Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs transition flex items-center space-x-1.5 sm:space-x-2 shadow-md cursor-pointer"
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

      {/* ─── 2. SEARCH BAR — UNDERNEATH MAIN BRAND HEADER ─── */}
      <div className={`border-b border-warm-border transition-colors ${isScrolled ? 'bg-white' : 'bg-warm-surface'}`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-1.5 sm:py-2">
          <div className="relative" ref={searchRef}>
            <div className="relative flex items-center">
              <Search className="w-4 h-4 text-warm-muted absolute left-3.5" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search 3D printers, Korean streetwear, luxury perfumes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchInputOpen(true)}
                className="w-full py-1.5 sm:py-2 pl-10 pr-9 text-xs sm:text-sm bg-white border border-warm-border rounded-xl text-warm-text placeholder-warm-muted/60 outline-none focus:border-warm-accent focus:ring-2 focus:ring-warm-accent-light transition shadow-warm-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-warm-muted hover:text-warm-text transition"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Autocomplete Search Dropdown */}
            {isSearchInputOpen && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-warm-card text-warm-text rounded-2xl shadow-warm-lg border border-warm-border p-2.5 z-50">
                <div className="eyebrow px-2 pb-1.5 border-b border-warm-border-light text-[10px]">
                  Matching Suggestions
                </div>
                <div className="mt-1.5 space-y-1 max-h-72 overflow-y-auto">
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
                      <span className="text-xs font-bold text-warm-accent">₹{item.price.toLocaleString('en-IN')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ─── 3. SUBTLE ANNOUNCEMENT BAR ─── */}
      <div className="bg-warm-badge-bg border-b border-warm-border-light">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-1 flex items-center justify-between">
          <div className="flex items-center space-x-2 truncate">
            <span className="eyebrow bg-warm-accent text-white px-2 py-0.5 rounded-full text-[9px] tracking-wider shrink-0">
              OFFER
            </span>
            <span className="text-[11px] sm:text-xs text-warm-muted truncate">
              <span className="font-semibold text-warm-text">Flash Sale:</span> Extra 10% OFF with code <span className="font-bold text-warm-accent underline underline-offset-2">3DOM10</span> &bull; Free Shipping Over ₹999
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
  );
};
