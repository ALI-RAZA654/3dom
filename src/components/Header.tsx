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
  Truck
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

  // Determine current active vertical
  const is3D = pathname.startsWith('/3d-printing') || pathname === '/';
  const isFashion = pathname.startsWith('/fashion');
  const isBeauty = pathname.startsWith('/beauty');

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Close dropdowns on click outside
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

  // Focus search input when toggled open
  useEffect(() => {
    if (isSearchInputOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchInputOpen]);

  const getVerticalColor = () => {
    if (is3D) return 'border-b border-zinc-800 bg-zinc-950 text-white';
    if (isFashion) return 'border-b border-zinc-200 bg-[#FAF9F6] text-zinc-900';
    if (isBeauty) return 'border-b border-rose-100 bg-[#FDF5F3] text-zinc-900';
    return 'bg-zinc-950 text-white border-b border-zinc-800';
  };

  return (
    <header className="sticky top-0 z-40 shadow-sm transition-colors duration-300">
      <div className={`${getVerticalColor()} transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4">
          
          {/* Left Corner: Dropdown Menu & Website Name */}
          <div className="flex items-center space-x-3 sm:space-x-5">
            {/* Dropdown Menu */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-bold transition border ${
                  is3D
                    ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-white'
                    : isFashion
                    ? 'bg-white hover:bg-zinc-100 border-zinc-300 text-zinc-900'
                    : 'bg-white hover:bg-rose-50 border-rose-200 text-zinc-900'
                }`}
                aria-label="Navigation Menu"
              >
                <Menu className="w-4.5 h-4.5" />
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Panel */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-zinc-900 text-white rounded-2xl shadow-2xl border border-zinc-800 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150 p-1.5 space-y-1">
                  <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-zinc-400 border-b border-zinc-800/60">
                    Store Navigation
                  </div>

                  {/* 1. 3D Printing */}
                  <Link
                    href="/3d-printing"
                    onClick={() => setIsDropdownOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                      is3D ? 'bg-red-600/20 text-red-400 border border-red-500/30' : 'hover:bg-zinc-800 text-zinc-200'
                    }`}
                  >
                    <Box className="w-4 h-4 text-red-500" />
                    <span>3D Printing</span>
                  </Link>

                  {/* 2. GenZ / Korean Fashion */}
                  <Link
                    href="/fashion"
                    onClick={() => setIsDropdownOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                      isFashion ? 'bg-zinc-800 text-amber-400 border border-amber-500/30' : 'hover:bg-zinc-800 text-zinc-200'
                    }`}
                  >
                    <Shirt className="w-4 h-4 text-amber-400" />
                    <span>GenZ / Korean Fashion</span>
                  </Link>

                  {/* 3. Beauty Store */}
                  <Link
                    href="/beauty"
                    onClick={() => setIsDropdownOpen(false)}
                    className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                      isBeauty ? 'bg-rose-950/50 text-rose-400 border border-rose-500/30' : 'hover:bg-zinc-800 text-zinc-200'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-rose-400" />
                    <span>Beauty Store</span>
                  </Link>

                  <div className="my-1 border-t border-zinc-800/80" />

                  {/* 4. Can't find what you need? */}
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onRequestModalOpen();
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-red-400 hover:bg-red-950/30 transition text-left"
                  >
                    <HeartHandshake className="w-4 h-4 text-red-400" />
                    <span>Can't find what you need?</span>
                  </button>

                  {/* 5. Order Tracking */}
                  <Link
                    href="/orders"
                    onClick={() => setIsDropdownOpen(false)}
                    className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-emerald-400 hover:bg-emerald-950/30 transition"
                  >
                    <Truck className="w-4 h-4 text-emerald-400" />
                    <span>Order Tracking</span>
                  </Link>
                </div>
              )}
            </div>

            {/* Website Name / Logo right next to dropdown */}
            <Link href={isFashion ? '/fashion' : isBeauty ? '/beauty' : '/3d-printing'} className="flex items-center group">
              <span className={`logo-wordmark text-2xl sm:text-3xl font-extrabold tracking-tighter ${is3D ? 'text-white' : 'text-black'}`}>
                3DOM
              </span>
              <span className={`text-xs ml-2 uppercase font-semibold tracking-widest px-2 py-0.5 rounded border ${
                is3D ? 'bg-red-600/20 text-red-500 border-red-500/30' : 
                isFashion ? 'bg-amber-100 text-amber-900 border-amber-300' : 
                'bg-rose-100 text-rose-800 border-rose-200'
              }`}>
                {is3D ? '3D Lab' : isFashion ? 'Korean' : 'Luxury'}
              </span>
            </Link>
          </div>

          {/* Right Corner Icons: Search Icon, Admin Icon, Add to Cart Icon */}
          <div className="flex items-center space-x-2 sm:space-x-3" ref={searchRef}>
            
            {/* Search Icon / Toggle */}
            <div className="relative">
              <button
                onClick={() => setIsSearchInputOpen(!isSearchInputOpen)}
                className={`p-2.5 rounded-full transition flex items-center justify-center ${
                  is3D
                    ? 'hover:bg-zinc-800 text-zinc-200'
                    : 'hover:bg-zinc-200 text-zinc-800'
                } ${isSearchInputOpen ? (is3D ? 'bg-zinc-800 text-red-400' : 'bg-zinc-200 text-black') : ''}`}
                title="Search Products"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Popup / Expandable Search Bar */}
              {isSearchInputOpen && (
                <div className="absolute top-full right-0 mt-3 w-80 sm:w-96 bg-zinc-900 text-white rounded-2xl shadow-2xl border border-zinc-800 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="relative flex items-center">
                    <input
                      ref={searchInputRef}
                      type="text"
                      placeholder="Search products across verticals..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full py-2 pl-9 pr-8 text-xs bg-zinc-950 border border-zinc-800 rounded-xl text-white placeholder-zinc-500 outline-none focus:border-red-500 transition"
                    />
                    <Search className="w-4 h-4 text-zinc-500 absolute left-3" />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 text-zinc-400 hover:text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Autocomplete Suggestions */}
                  {searchResults.length > 0 && (
                    <div className="mt-2 border-t border-zinc-800 pt-2 space-y-1 max-h-64 overflow-y-auto">
                      <div className="text-[10px] font-bold uppercase text-zinc-500 px-2 pb-1">
                        Search Suggestions
                      </div>
                      {searchResults.map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            setIsSearchInputOpen(false);
                            setSearchQuery('');
                            router.push(`/${item.vertical}/${item.category.toLowerCase().replace(/\s+/g, '-')}/${item.slug}`);
                          }}
                          className="flex items-center space-x-3 p-2 hover:bg-zinc-800 rounded-xl cursor-pointer transition"
                        >
                          <img src={item.image} alt={item.name} className="w-9 h-9 object-cover rounded-lg border border-zinc-800" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-white truncate">{item.name}</p>
                            <p className="text-[10px] text-zinc-400 capitalize">{item.vertical} &bull; {item.category}</p>
                          </div>
                          <span className="text-xs font-bold text-red-400">${item.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Admin Icon */}
            {isAdmin ? (
              <Link
                href="/admin"
                className={`p-2.5 rounded-full transition flex items-center justify-center ${
                  is3D ? 'hover:bg-zinc-800 text-emerald-400' : 'hover:bg-zinc-200 text-emerald-600'
                }`}
                title="Admin Panel"
              >
                <ShieldCheck className="w-5 h-5" />
              </Link>
            ) : user ? (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className={`p-2.5 rounded-full transition flex items-center justify-center ${
                  is3D ? 'hover:bg-zinc-800 text-zinc-200' : 'hover:bg-zinc-200 text-zinc-800'
                }`}
                title={`Account: ${user.name}`}
              >
                <User className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className={`p-2.5 rounded-full transition flex items-center justify-center ${
                  is3D ? 'hover:bg-zinc-800 text-zinc-200' : 'hover:bg-zinc-200 text-zinc-800'
                }`}
                title="Admin / Login"
              >
                <ShieldCheck className="w-5 h-5" />
              </button>
            )}

            {/* Add to Cart Icon */}
            <button
              onClick={() => setIsCartOpen(true)}
              className={`relative p-2.5 rounded-full transition flex items-center justify-center ${
                is3D
                  ? 'bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-900/40'
                  : isFashion
                  ? 'bg-zinc-900 hover:bg-black text-white shadow-md'
                  : 'bg-rose-900 hover:bg-rose-950 text-white shadow-md shadow-rose-900/20'
              }`}
              title="Add to Cart / View Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-400 text-black font-extrabold text-[11px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow">
                  {cartCount}
                </span>
              )}
            </button>

          </div>

        </div>
      </div>
    </header>
  );
};
