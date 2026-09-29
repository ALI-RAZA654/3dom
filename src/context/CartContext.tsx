'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  vertical: '3d-printing' | 'fashion' | 'beauty';
  stock: number;
  category: string;
}

export interface DiscountTier {
  id: string;
  minQty: number;
  discountPercent: number;
  label: string;
}

export const DEFAULT_DISCOUNT_TIERS: DiscountTier[] = [
  { id: 'tier-1', minQty: 3, discountPercent: 5, label: '5% OFF (3+ items)' },
  { id: 'tier-2', minQty: 5, discountPercent: 10, label: '10% OFF (5+ items)' },
  { id: 'tier-3', minQty: 8, discountPercent: 15, label: '15% OFF (8+ items)' },
  { id: 'tier-4', minQty: 12, discountPercent: 22, label: '22% OFF (12+ items)' },
];

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: any, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  cartSubtotal: number;
  appliedCoupon: any;
  setAppliedCoupon: (coupon: any) => void;
  discountAmount: number;
  cartTotal: number;
  // Progressive discount additions
  discountTiers: DiscountTier[];
  setDiscountTiers: (tiers: DiscountTier[]) => void;
  activeTier: DiscountTier | null;
  nextTier: DiscountTier | null;
  itemsNeededForNextTier: number;
  progressiveDiscountPercent: number;
  progressiveDiscountAmount: number;
  totalSavedAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [discountTiers, setDiscountTiersState] = useState<DiscountTier[]>(DEFAULT_DISCOUNT_TIERS);

  // Load cart and tiers from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('3dom_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      const savedTiers = localStorage.getItem('3dom_discount_tiers');
      if (savedTiers) {
        setDiscountTiersState(JSON.parse(savedTiers));
      }
    } catch (e) {
      console.error('Error loading cart state', e);
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('3dom_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Error saving cart', e);
    }
  }, [cart]);

  // Save tiers to localStorage
  const setDiscountTiers = (tiers: DiscountTier[]) => {
    setDiscountTiersState(tiers);
    try {
      localStorage.setItem('3dom_discount_tiers', JSON.stringify(tiers));
    } catch (e) {
      console.error('Error saving discount tiers', e);
    }
  };

  const addToCart = (product: any, quantity: number = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock || 99);
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: Math.min(quantity, product.stock || 99),
          vertical: product.vertical,
          stock: product.stock || 99,
          category: product.category,
        },
      ];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === productId) {
          const validQty = Math.min(quantity, item.stock);
          return { ...item, quantity: validQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const cartSubtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Progressive Tier Calculations
  const sortedTiers = [...discountTiers].sort((a, b) => a.minQty - b.minQty);
  
  // Find active tier
  let activeTier: DiscountTier | null = null;
  for (let i = sortedTiers.length - 1; i >= 0; i--) {
    if (cartItemCount >= sortedTiers[i].minQty) {
      activeTier = sortedTiers[i];
      break;
    }
  }

  // Find next tier
  const nextTier = sortedTiers.find((t) => t.minQty > cartItemCount) || null;
  const itemsNeededForNextTier = nextTier ? nextTier.minQty - cartItemCount : 0;

  const progressiveDiscountPercent = activeTier ? activeTier.discountPercent : 0;
  const progressiveDiscountAmount = (cartSubtotal * progressiveDiscountPercent) / 100;

  let couponDiscountAmount = 0;
  if (appliedCoupon) {
    couponDiscountAmount = appliedCoupon.discountAmount || 0;
  }

  const discountAmount = progressiveDiscountAmount + couponDiscountAmount;
  const cartTotal = Math.max(0, cartSubtotal - discountAmount);
  const totalSavedAmount = discountAmount;

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        cartSubtotal,
        appliedCoupon,
        setAppliedCoupon,
        discountAmount,
        cartTotal,
        discountTiers: sortedTiers,
        setDiscountTiers,
        activeTier,
        nextTier,
        itemsNeededForNextTier,
        progressiveDiscountPercent,
        progressiveDiscountAmount,
        totalSavedAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};
