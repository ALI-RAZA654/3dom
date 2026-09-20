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
    <div className="premium-card group relative overflow-hidden flex flex-col justify-between">
      
      {/* Product Image Container & Badges */}
      <div className="relative aspect-square w-full overflow-hidden bg-warm-surface p-3">
        <img
          src={product.image}
          alt={product.name}
          onError={(e) => {
            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80';
          }}
          className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
          {product.isFeatured && (
            <span className="bg-warm-accent text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-full shadow-warm-sm tracking-wide">
              3DOM Assured
            </span>
          )}
          {discountPercent && discountPercent > 0 && (
            <span className="bg-emerald-600 text-white text-[10px] font-bold uppercase px-2.5 py-1 rounded-full shadow-warm-sm">
              {discountPercent}% OFF
            </span>
          )}
          {isOut ? (
            <span className="bg-warm-text text-white text-[10px] font-semibold uppercase px-2.5 py-1 rounded-full">
              Out of Stock
            </span>
          ) : product.stock <= 3 ? (
            <span className="bg-warm-badge-bg text-warm-badge-text text-[10px] font-bold uppercase px-2.5 py-1 rounded-full">
              Only {product.stock} Left
            </span>
          ) : null}
        </div>

        {/* Quick View Link */}
        <Link
          href={productUrl}
          className="absolute inset-0 bg-warm-text/15 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
        >
          <span className="bg-warm-card text-warm-text text-xs font-semibold px-4 py-2.5 rounded-full flex items-center space-x-1.5 shadow-warm-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5 text-warm-accent" />
            <span>View Product</span>
          </span>
        </Link>
      </div>

      {/* Product Details Section */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Brand & Rating Badge Pill */}
          <div className="flex items-center justify-between text-[11px] mb-2">
            <span className="eyebrow text-warm-accent">
              {product.brand}
            </span>
            
            {/* Star Rating Badge */}
            <div className="flex items-center space-x-1 bg-emerald-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
              <span>{product.rating}</span>
              <Star className="w-2.5 h-2.5 fill-white" />
            </div>
          </div>

          {/* Product Title */}
          <Link href={productUrl}>
            <h3 className="text-sm font-semibold text-warm-text line-clamp-2 transition group-hover:text-warm-accent leading-snug">
              {product.name}
            </h3>
          </Link>

          {/* Category Pill */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {product.attributes?.material && (
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-warm-surface text-warm-muted border border-warm-border-light">
                Material: {product.attributes.material}
              </span>
            )}
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-warm-accent-light text-warm-accent border border-warm-accent/15">
              {product.category}
            </span>
          </div>
        </div>

        {/* Price & Add to Cart Action */}
        <div className="pt-3 border-t border-warm-border-light flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-lg font-bold text-warm-text">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && (
                <span className="text-xs text-warm-muted line-through font-medium">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
            </div>
            <div className="text-[10px] text-emerald-600 font-medium flex items-center space-x-1 mt-0.5">
              <Truck className="w-3 h-3 text-emerald-600" />
              <span>Express Delivery</span>
            </div>
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            disabled={isOut}
            className={`px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition ${
              isOut
                ? 'bg-warm-surface text-warm-muted cursor-not-allowed border border-warm-border'
                : 'bg-warm-accent hover:bg-warm-accent-hover text-white shadow-warm-sm'
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
