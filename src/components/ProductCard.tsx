'use client';

import React from 'react';
import Link from 'next/link';
import { Star, ShoppingBag, CheckCircle, AlertTriangle, Eye } from 'lucide-react';
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
  const is3D = product.vertical === '3d-printing';
  const isFashion = product.vertical === 'fashion';
  const isBeauty = product.vertical === 'beauty';

  const productUrl = `/${product.vertical}/${product.category.toLowerCase().replace(/\s+/g, '-')}/${product.slug}`;

  return (
    <div className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col justify-between ${
      is3D
        ? 'bg-zinc-900 border-zinc-800 hover:border-red-500/50 hover:shadow-xl hover:shadow-red-950/20 text-white'
        : isFashion
        ? 'bg-white border-zinc-200 hover:border-zinc-400 hover:shadow-lg text-zinc-900'
        : 'bg-white border-rose-100 hover:border-rose-300 hover:shadow-lg hover:shadow-rose-100/50 text-zinc-900'
    }`}>
      
      {/* Product Image & Badges */}
      <div className="relative aspect-square w-full overflow-hidden bg-zinc-100 dark:bg-zinc-950">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Featured / Stock Badge */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.isFeatured && (
            <span className="bg-red-600 text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow-md">
              Featured
            </span>
          )}
          {isOut ? (
            <span className="bg-zinc-800 text-zinc-300 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border border-zinc-700">
              Out of Stock
            </span>
          ) : product.stock <= 3 ? (
            <span className="bg-amber-500 text-black text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full shadow">
              Only {product.stock} Left
            </span>
          ) : null}
        </div>

        {/* Quick View Link */}
        <Link
          href={productUrl}
          className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
        >
          <span className="bg-white text-black text-xs font-bold px-4 py-2 rounded-full flex items-center space-x-1 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5" />
            <span>View Product</span>
          </span>
        </Link>
      </div>

      {/* Product Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className={`font-semibold uppercase tracking-wider ${
              is3D ? 'text-red-400' : isFashion ? 'text-zinc-500' : 'text-rose-600'
            }`}>
              {product.brand}
            </span>
            
            {/* Star Rating */}
            <div className="flex items-center space-x-1 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span className="text-xs font-bold text-zinc-400">{product.rating}</span>
              <span className="text-[10px] text-zinc-500">({product.reviewCount})</span>
            </div>
          </div>

          <Link href={productUrl}>
            <h3 className={`text-sm font-bold line-clamp-2 transition hover:underline ${
              is3D ? 'text-white' : 'text-zinc-900'
            }`}>
              {product.name}
            </h3>
          </Link>

          {/* Special category one-liner / attributes */}
          {product.attributes?.material && (
            <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
              Material: {product.attributes.material}
            </span>
          )}
          {product.attributes?.partType && (
            <span className="inline-block mt-2 text-[10px] font-bold px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
              Type: {product.attributes.partType}
            </span>
          )}
        </div>

        {/* Price & Add to Cart Button */}
        <div className="pt-2 border-t border-zinc-800/40 flex items-center justify-between">
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className={`text-base font-extrabold ${is3D ? 'text-white' : 'text-zinc-900'}`}>
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-zinc-500 line-through">
                  ${product.originalPrice.toFixed(2)}
                </span>
              )}
            </div>
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={isOut}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition shadow-sm ${
              isOut
                ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                : is3D
                ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-900/30'
                : isFashion
                ? 'bg-zinc-900 hover:bg-black text-white'
                : 'bg-rose-900 hover:bg-rose-950 text-white shadow-rose-900/20'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isOut ? 'Out of Stock' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
