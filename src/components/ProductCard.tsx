'use client';

import React from 'react';
import Link from 'next/link';
import { Star, ShoppingBag, Eye, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: {
    id: string;
    slug: string;
    name: string;
    vertical: '3d-printing' | 'fashion' | 'beauty';
    category: string;
    brand: string;
    price: number;
    originalPrice?: number;
    stock: number;
    rating: number;
    reviewCount: number;
    image: string;
    description: string;
    attributes?: any;
    isFeatured?: boolean;
  };
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  const isOut = product.stock <= 0;
  const productUrl = `/${product.vertical}/${product.category.toLowerCase().replace(/\s+/g, '-')}/${product.slug}`;

  // Calculate discount percentage
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="group relative bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-2xs hover:shadow-xl hover:border-red-400 transition-all duration-300 flex flex-col justify-between">
      
      {/* Product Image Container & Badges */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-50 p-3">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-1 z-10">
          {product.isFeatured && (
            <span className="bg-red-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs">
              3DOM Assured
            </span>
          )}
          {discountPercent && discountPercent > 0 && (
            <span className="bg-emerald-600 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
          {isOut ? (
            <span className="bg-slate-800 text-white text-[10px] font-bold uppercase px-2.5 py-0.5 rounded-full">
              Out of Stock
            </span>
          ) : product.stock <= 3 ? (
            <span className="bg-amber-500 text-black text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full shadow-xs">
              Only {product.stock} Left
            </span>
          ) : null}
        </div>

        {/* Quick View Link */}
        <Link
          href={productUrl}
          className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
        >
          <span className="bg-white text-slate-900 text-xs font-bold px-4 py-2 rounded-full flex items-center space-x-1.5 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5 text-red-600" />
            <span>View Product</span>
          </span>
        </Link>
      </div>

      {/* Product Details Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Brand & Rating Badge Pill */}
          <div className="flex items-center justify-between text-[11px] mb-1.5">
            <span className="font-black uppercase tracking-wider text-red-600">
              {product.brand}
            </span>
            
            {/* Star Rating Badge Pill */}
            <div className="flex items-center space-x-1 bg-emerald-700 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md shadow-2xs">
              <span>{product.rating}</span>
              <Star className="w-2.5 h-2.5 fill-white" />
            </div>
          </div>

          {/* Product Title */}
          <Link href={productUrl}>
            <h3 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 transition group-hover:text-red-600 leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Category Pill */}
          <div className="mt-2.5 flex flex-wrap gap-1">
            {product.attributes?.material && (
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                Material: {product.attributes.material}
              </span>
            )}
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-red-50 text-red-700 border border-red-100">
              {product.category}
            </span>
          </div>
        </div>

        {/* Price & Add to Cart Action */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-base sm:text-lg font-black text-slate-900">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-slate-400 line-through font-medium">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
            <div className="text-[10px] text-emerald-600 font-bold flex items-center space-x-1">
              <Truck className="w-3 h-3 text-emerald-600" />
              <span>Express Delivery</span>
            </div>
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={isOut}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-extrabold flex items-center space-x-1.5 transition shadow-xs ${
              isOut
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                : 'bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-600/20'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isOut ? 'Sold Out' : 'Add'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
