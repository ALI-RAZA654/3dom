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
  HelpCircle
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { fetchProducts } from '@/lib/api';

export const Header: React.FC<{ onRequestModalOpen: () => void }> = ({ onRequestModalOpen }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { cart, setIsCartOpen } = useCart();
  const { user, isAdmin, setIsAuthModalOpen } = useAuth();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSearchInputOpen, setIsSearchInputOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Active store determination
  const is3D = pathname.startsWith('/3d-printing') || pathname === '/';
  const isFashion = pathname.startsWith('/fashion');
  const isBeauty = pathname.startsWith('/beauty');

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

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

  // 3+1 Store Tab Definitions (Segmented Control Pills)
  const storeTabs = [
    {
      id: '3d-printing',
      title: '3D Printing Store',
      shortTitle: '3D Printing',
      icon: Box,
      href: '/3d-printing',
      active: is3D,
    },
    {
      id: 'fashion',
      title: 'GenZ Korean Fashion',
      shortTitle: 'Korean Fashion',
      icon: Shirt,
      href: '/fashion',
      active: isFashion,
    },
    {
      id: 'beauty',
      title: 'Luxury Beauty',
      shortTitle: 'Beauty Store',
      icon: Sparkles,
      href: '/beauty',
      active: isBeauty,
    },
    {
      id: 'request-custom',
      title: '+1 Custom Order',
      shortTitle: '+1 Request Custom',
      icon: PlusCircle,
      isAction: true,
      onClick: onRequestModalOpen,
      active: false,
    },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs">
      
      {/* 1. TOP ELEGANT ANNOUNCEMENT TICKER (Red Brand Accent) */}
      <div className="bg-red-600 text-white text-xs font-semibold py-2 px-4 shadow-inner">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 truncate">
            <span className="bg-white text-red-700 text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs">
              3DOM EXCLUSIVE
            </span>
            <span className="truncate text-red-50 text-xs">
              ⚡ <b>FLASH SALE:</b> Extra 10% OFF on 3D Printers & Accessories with Code <span className="underline font-bold text-white">3DOM10</span> &bull; Free Shipping Over $49
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-6 text-xs text-red-100 font-medium">
            <Link href="/orders" className="flex items-center space-x-1.5 hover:text-white transition">
              <Truck className="w-3.5 h-3.5" />
              <span>Track Orders</span>
            </Link>
            <span className="text-red-400">&bull;</span>
            <button onClick={onRequestModalOpen} className="flex items-center space-x-1.5 hover:text-white transition cursor-pointer">
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>24-Hr Custom Print Sourcing</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN BRAND HEADER BAR (Spacious, Uncluttered, Professional) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
        
        {/* Left: Menu & Red 3DOM Logo */}
        <div className="flex items-center space-x-4">
          
          {/* Dropdown Navigation Menu */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold transition border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 shadow-xs"
              aria-label="Navigation Menu"
            >
              <Menu className="w-4 h-4 text-slate-700" />
              <span className="hidden sm:inline">All Stores</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 text-slate-500 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Panel */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150 p-2 space-y-1">
                <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100">
                  Select Respective Store
                </div>

                {/* 1. 3D Printing */}
                <Link
                  href="/3d-printing"
                  onClick={() => setIsDropdownOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                    is3D ? 'bg-red-50 text-red-600 border border-red-200' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <Box className="w-4 h-4 text-red-600" />
                  <span>3D Printing Store</span>
                </Link>

                {/* 2. GenZ / Korean Fashion */}
                <Link
                  href="/fashion"
                  onClick={() => setIsDropdownOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                    isFashion ? 'bg-red-50 text-red-600 border border-red-200' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <Shirt className="w-4 h-4 text-amber-600" />
                  <span>GenZ / Korean Fashion</span>
                </Link>

                {/* 3. Beauty Store */}
                <Link
                  href="/beauty"
                  onClick={() => setIsDropdownOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                    isBeauty ? 'bg-red-50 text-red-600 border border-red-200' : 'hover:bg-slate-100 text-slate-700'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-rose-600" />
                  <span>Luxury Beauty Store</span>
                </Link>

                <div className="my-1 border-t border-slate-100" />

                {/* 4. Custom Request (+1) */}
                <button
                  onClick={() => {
                    setIsDropdownOpen(false);
                    onRequestModalOpen();
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 transition text-left border border-amber-200"
                >
                  <HeartHandshake className="w-4 h-4 text-amber-700" />
                  <span>+1 Request Custom Order</span>
                </button>

                {/* 5. Order Tracking */}
                <Link
                  href="/orders"
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-100 transition"
                >
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span>Track Your Order</span>
                </Link>
              </div>
            )}
          </div>

          {/* 3DOM Red Brand Logo */}
          <Link href={isFashion ? '/fashion' : isBeauty ? '/beauty' : '/3d-printing'} className="flex items-center group">
            <span className="logo-wordmark text-2xl sm:text-3xl font-black tracking-tighter text-red-600 group-hover:text-red-700 transition">
              3DOM
            </span>
            <span className="ml-2 text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-red-50 text-red-600 border border-red-200 hidden sm:inline-block">
              Storefront
            </span>
          </Link>
        </div>

        {/* Center: Search Input Bar */}
        <div className="flex-1 max-w-xl hidden md:block relative" ref={searchRef}>
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search 3D printers, Korean streetwear, luxury perfumes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchInputOpen(true)}
              className="w-full py-2.5 pl-10 pr-8 text-xs bg-slate-50 border border-slate-300 rounded-xl text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-red-600 focus:ring-2 focus:ring-red-100 transition shadow-2xs"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Autocomplete Search Dropdown */}
          {isSearchInputOpen && searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white text-slate-900 rounded-2xl shadow-2xl border border-slate-200 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="text-[10px] font-bold uppercase text-slate-400 px-2 pb-1.5 border-b border-slate-100">
                Matching Suggestions
              </div>
              <div className="mt-1 space-y-1 max-h-72 overflow-y-auto">
                {searchResults.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setIsSearchInputOpen(false);
                      setSearchQuery('');
                      router.push(`/${item.vertical}/${item.category.toLowerCase().replace(/\s+/g, '-')}/${item.slug}`);
                    }}
                    className="flex items-center space-x-3 p-2 hover:bg-red-50 rounded-xl cursor-pointer transition"
                  >
                    <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg border border-slate-200" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{item.name}</p>
                      <p className="text-[10px] text-slate-500 capitalize">{item.vertical} &bull; {item.category}</p>
                    </div>
                    <span className="text-xs font-black text-red-600">${item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Action Icons: Login / Admin & Red Cart Button */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Mobile Search Toggle */}
          <div className="md:hidden">
            <button
              onClick={() => setIsSearchInputOpen(!isSearchInputOpen)}
              className="p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* User / Admin Login Icon */}
          {isAdmin ? (
            <Link
              href="/admin"
              className="px-3.5 py-2 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition flex items-center space-x-1.5 text-xs font-bold shadow-2xs"
              title="Admin Dashboard"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="hidden sm:inline">Admin</span>
            </Link>
          ) : user ? (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100 transition flex items-center space-x-1.5 text-xs font-bold shadow-2xs"
              title={`Account: ${user.name}`}
            >
              <User className="w-4 h-4 text-red-600" />
              <span className="hidden sm:inline">{user.name.split(' ')[0]}</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="px-4 py-2 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold transition shadow-2xs flex items-center space-x-1.5"
            >
              <User className="w-4 h-4 text-red-600" />
              <span>Login</span>
            </button>
          )}

          {/* Premium Red Shopping Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs transition flex items-center space-x-2 shadow-md shadow-red-600/20 cursor-pointer"
            title="View Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 && (
              <span className="bg-white text-red-600 font-black text-[11px] w-5 h-5 rounded-full flex items-center justify-center border border-red-200 shadow-xs ml-0.5">
                {cartCount}
              </span>
            )}
          </button>

        </div>

      </div>

      {/* 3. TOP 3+1 STORE TAB BUTTONS BAR (Clean Segmented Control with Generous Padding) */}
      <div className="bg-slate-50 border-t border-b border-slate-200/80 px-4 sm:px-8 py-2.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Segmented Control Pill Group */}
          <div className="flex items-center space-x-2 overflow-x-auto scrollbar-none py-0.5 w-full sm:w-auto">
            
            {storeTabs.map((tab) => {
              const TabIcon = tab.icon;
              if (tab.isAction) {
                return (
                  <button
                    key={tab.id}
                    onClick={tab.onClick}
                    className="flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-extrabold bg-amber-400 hover:bg-amber-500 text-slate-900 transition-all flex-shrink-0 cursor-pointer shadow-xs border border-amber-300 transform hover:-translate-y-0.5"
                  >
                    <TabIcon className="w-4 h-4 text-slate-900" />
                    <span>{tab.shortTitle}</span>
                  </button>
                );
              }

              return (
                <Link
                  key={tab.id}
                  href={tab.href!}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 border ${
                    tab.active
                      ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-600/20'
                      : 'bg-white text-slate-700 hover:text-red-600 hover:bg-slate-100 border-slate-200 shadow-2xs'
                  }`}
                >
                  <TabIcon className={`w-4 h-4 ${tab.active ? 'text-white' : 'text-red-600'}`} />
                  <span>{tab.shortTitle}</span>
                </Link>
              );
            })}

          </div>

          {/* Sourcing Guarantee Pill */}
          <div className="hidden lg:flex items-center space-x-2 text-xs font-semibold text-slate-600">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Multi-Store Unified Cart Sourcing</span>
          </div>

        </div>
      </div>

    </header>
  );
};
