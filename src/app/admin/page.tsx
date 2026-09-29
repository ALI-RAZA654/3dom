'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck, Package, ShoppingCart, Tag, MessageSquare, HeartHandshake,
  TrendingUp, Plus, Edit, Trash2, CheckCircle, XCircle, ArrowLeft, RefreshCw,
  Lock, AlertTriangle, Key, LogIn, LogOut, Database, ExternalLink, Sun, Moon,
  Barcode, Printer, Sliders, Check, CreditCard, Eye, EyeOff, Globe, Save
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart, DEFAULT_DISCOUNT_TIERS, DiscountTier } from '@/context/CartContext';
import {
  fetchAdminStats, fetchAdminOrders, updateAdminOrder,
  fetchProducts, createAdminProduct, updateAdminProduct, deleteAdminProduct,
  fetchAdminCoupons, createAdminCoupon,
  fetchAdminReviews, updateAdminReview,
  fetchAdminRequests,
  fetchAdminPaymentGateways, updateAdminPaymentGateways
} from '@/lib/api';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, token, isAdmin, login, logout } = useAuth();
  const { discountTiers, setDiscountTiers } = useCart();

  // Admin Theme state (Light / Dark Mode switch)
  const [adminTheme, setAdminTheme] = useState<'dark' | 'light'>('dark');

  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'coupons' | 'reviews' | 'requests' | 'discounts' | 'gateways'>('inventory');

  // Login form state (when unauthenticated)
  const [adminEmail, setAdminEmail] = useState('admin@3dom.com');
  const [adminPassword, setAdminPassword] = useState('admin123');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);

  // Stats & Data states
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);

  // Payment Gateways state
  const [gatewaysConfig, setGatewaysConfig] = useState<any>({
    activeGateway: 'stripe',
    gateways: {
      stripe: {
        id: 'stripe',
        name: 'Stripe Payment Gateway',
        isEnabled: true,
        mode: 'test',
        publishableKey: 'pk_test_3dom_stripe_51Nz82937492',
        secretKey: 'sk_test_3dom_stripe_884920482048',
        webhookSecret: 'whsec_3dom_928492',
        currency: 'USD',
        instructions: 'Pay securely using Credit/Debit Card via Stripe.'
      },
      razorpay: {
        id: 'razorpay',
        name: 'Razorpay Gateway',
        isEnabled: true,
        mode: 'test',
        keyId: 'rzp_test_3DOM92842',
        keySecret: 'rzp_secret_991824729472',
        currency: 'INR',
        instructions: 'Pay via UPI, NetBanking, Debit/Credit Card via Razorpay.'
      },
      paypal: {
        id: 'paypal',
        name: 'PayPal Express Checkout',
        isEnabled: false,
        mode: 'sandbox',
        clientId: 'PAYPAL_CLIENT_ID_3DOM_8294',
        secretKey: 'PAYPAL_SECRET_KEY_3DOM_9912',
        currency: 'USD',
        instructions: 'Pay securely with your PayPal account or linked cards.'
      },
      cod: {
        id: 'cod',
        name: 'Cash on Delivery (COD)',
        isEnabled: true,
        mode: 'live',
        codFee: 0,
        instructions: 'Pay cash upon delivery at your doorstep.'
      },
      bank_transfer: {
        id: 'bank_transfer',
        name: 'Direct Bank Transfer / Wire',
        isEnabled: false,
        mode: 'live',
        bankName: 'Global Commerce Bank',
        accountTitle: '3DOM E-Commerce Pvt Ltd',
        accountNumber: '10928374659102',
        iban: 'US98GBCK10928374659102',
        swiftCode: 'GBCKUS33',
        instructions: 'Transfer funds to our official bank account.'
      }
    }
  });

  const [showSecretKeys, setShowSecretKeys] = useState<Record<string, boolean>>({});

  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  // Filters & Search
  const [productSearch, setProductSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // New Product Modal state
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdVertical, setNewProdVertical] = useState<'3d-printing' | 'fashion' | 'beauty'>('3d-printing');
  const [newProdCategory, setNewProdCategory] = useState('Printers');
  const [newProdBrand, setNewProdBrand] = useState('3DOM Tech');
  const [newProdPrice, setNewProdPrice] = useState('49.99');
  const [newProdStock, setNewProdStock] = useState('20');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdImage, setNewProdImage] = useState('https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80');

  // Barcode & Label Modal State
  const [selectedBarcodeProduct, setSelectedBarcodeProduct] = useState<any | null>(null);

  // Progressive Discount Tiers Editing State
  const [editableTiers, setEditableTiers] = useState<DiscountTier[]>(discountTiers);

  // New Coupon Modal state
  const [showAddCoupon, setShowAddCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponType, setCouponType] = useState<'percentage' | 'flat'>('percentage');
  const [couponValue, setCouponValue] = useState('15');
  const [couponMin, setCouponMin] = useState('40');

  // Editing Stock
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [stockInputValue, setStockInputValue] = useState<number>(0);

  // Load theme preference on mount
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('3dom_admin_theme') as 'dark' | 'light';
      if (savedTheme) setAdminTheme(savedTheme);
      
      const savedGateways = localStorage.getItem('3dom_payment_gateways');
      if (savedGateways) {
        setGatewaysConfig(JSON.parse(savedGateways));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const toggleTheme = () => {
    const next = adminTheme === 'dark' ? 'light' : 'dark';
    setAdminTheme(next);
    try {
      localStorage.setItem('3dom_admin_theme', next);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    setEditableTiers(discountTiers);
  }, [discountTiers]);

  const loadAdminData = () => {
    if (!token || !isAdmin) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setFetchError('');

    Promise.all([
      fetchAdminStats(token),
      fetchProducts(),
      fetchAdminOrders(token),
      fetchAdminCoupons(token),
      fetchAdminReviews(token),
      fetchAdminRequests(token),
      fetchAdminPaymentGateways(token).catch(() => gatewaysConfig)
    ])
      .then(([st, prods, ords, coups, revs, reqs, gtwConfig]) => {
        setStats(st);
        setProducts(prods);
        setOrders(ords);
        setCoupons(coups);
        setReviews(revs);
        setRequests(reqs);
        if (gtwConfig && gtwConfig.gateways) {
          setGatewaysConfig(gtwConfig);
          try {
            localStorage.setItem('3dom_payment_gateways', JSON.stringify(gtwConfig));
          } catch (e) {
            console.error(e);
          }
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load admin dashboard data', err);
        setFetchError('Unable to connect to 3DOM Backend Server (http://localhost:5000). Ensure backend is running.');
        setLoading(false);
      });
  };

  useEffect(() => {
    loadAdminData();
  }, [token, isAdmin]);

  // Admin Quick Login Handler
  const handleAdminLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoginError('');
    setLoggingIn(true);
    try {
      await login({ email: adminEmail, password: adminPassword });
      setLoggingIn(false);
    } catch (err: any) {
      setLoginError(err.message || 'Login failed. Verify credentials.');
      setLoggingIn(false);
    }
  };

  const handleQuickLogin = async () => {
    setAdminEmail('admin@3dom.com');
    setAdminPassword('admin123');
    setLoginError('');
    setLoggingIn(true);
    try {
      await login({ email: 'admin@3dom.com', password: 'admin123' });
      setLoggingIn(false);
    } catch (err: any) {
      try {
        await login({ email: 'admin@3dom.com', password: '99911191' });
        setLoggingIn(false);
      } catch (err2: any) {
        setLoginError(err2.message || 'Quick login failed.');
        setLoggingIn(false);
      }
    }
  };

  const handleSaveStock = async (productId: string) => {
    try {
      await updateAdminProduct(token!, productId, { stock: stockInputValue });
      setActionMsg(`Stock updated to ${stockInputValue} in real-time.`);
      setEditingStockId(null);
      loadAdminData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAdminProduct(token!, {
        name: newProdName,
        vertical: newProdVertical,
        category: newProdCategory,
        brand: newProdBrand,
        price: parseFloat(newProdPrice),
        stock: parseInt(newProdStock),
        description: newProdDesc,
        image: newProdImage,
      });
      setShowAddProduct(false);
      setActionMsg(`Product '${newProdName}' created!`);
      loadAdminData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleAddCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createAdminCoupon(token!, {
        code: couponCode,
        discountType: couponType,
        discountValue: parseFloat(couponValue),
        minOrderValue: parseFloat(couponMin),
      });
      setShowAddCoupon(false);
      setActionMsg(`Coupon code '${couponCode}' created!`);
      loadAdminData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteAdminProduct(token!, id);
      setActionMsg('Product deleted successfully');
      loadAdminData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleModerateReview = async (id: string, status: string) => {
    try {
      await updateAdminReview(token!, id, status);
      setActionMsg(`Review ${status}`);
      loadAdminData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleUpdateOrderStatus = async (orderId: string, status: string, carrier?: string, trackingNo?: string) => {
    try {
      await updateAdminOrder(token!, orderId, { orderStatus: status, carrier, trackingNumber: trackingNo });
      setActionMsg(`Order ${orderId} status updated to '${status}'.`);
      loadAdminData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleSaveDiscountTiers = () => {
    setDiscountTiers(editableTiers);
    setActionMsg('Progressive Discount Tiers updated successfully!');
  };

  // Payment Gateways Save Handler
  const handleSaveGateways = async () => {
    try {
      localStorage.setItem('3dom_payment_gateways', JSON.stringify(gatewaysConfig));
      if (token) {
        await updateAdminPaymentGateways(token, gatewaysConfig);
      }
      setActionMsg('Payment Gateway settings updated! Dynamic checkout is now using active credentials.');
    } catch (err: any) {
      setActionMsg('Gateway saved locally!');
    }
  };

  const toggleGatewayEnabled = (gwId: string) => {
    setGatewaysConfig((prev: any) => ({
      ...prev,
      gateways: {
        ...prev.gateways,
        [gwId]: {
          ...prev.gateways[gwId],
          isEnabled: !prev.gateways[gwId].isEnabled,
        },
      },
    }));
  };

  const updateGatewayField = (gwId: string, field: string, value: any) => {
    setGatewaysConfig((prev: any) => ({
      ...prev,
      gateways: {
        ...prev.gateways,
        [gwId]: {
          ...prev.gateways[gwId],
          [field]: value,
        },
      },
    }));
  };

  const toggleShowSecret = (gwId: string) => {
    setShowSecretKeys((prev) => ({ ...prev, [gwId]: !prev[gwId] }));
  };

  const renderBarcodeSVG = (sku: string) => {
    let hash = 0;
    for (let i = 0; i < sku.length; i++) {
      hash = (hash << 5) - hash + sku.charCodeAt(i);
      hash |= 0;
    }
    const width = 260;
    const numBars = 44;
    const barWidth = width / numBars;
    const bars = [];

    for (let i = 0; i < numBars; i++) {
      const isDark = (Math.abs(hash * (i + 1) * 17) % 100) > 38;
      if (isDark || i === 0 || i === 1 || i === numBars - 1 || i === numBars - 2 || i === 22) {
        bars.push(
          <rect
            key={i}
            x={i * barWidth}
            y={0}
            width={barWidth * 0.75}
            height={55}
            fill="#000"
          />
        );
      }
    }

    return (
      <svg width={width} height={55} className="mx-auto my-2">
        {bars}
      </svg>
    );
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.vertical.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredOrders = orders.filter(o => 
    orderStatusFilter === 'all' ? true : o.orderStatus?.toLowerCase() === orderStatusFilter.toLowerCase()
  );

  // RENDER UNAUTHENTICATED VIEW
  if (!token || !isAdmin) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-4 transition-colors ${
        adminTheme === 'dark' ? 'bg-zinc-950 text-white' : 'bg-slate-100 text-slate-900'
      }`}>
        <div className={`max-w-md w-full rounded-3xl p-8 shadow-2xl space-y-6 border ${
          adminTheme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
        }`}>
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-16 h-16 bg-red-600/20 text-red-500 rounded-2xl border border-red-500/30 flex items-center justify-center shadow-lg">
              <ShieldCheck className="w-9 h-9" />
            </div>
            <h1 className="text-2xl font-black tracking-tight">3DOM Admin Portal</h1>
            <p className="text-xs text-zinc-400">Sign in to manage payment gateways, inventory, barcodes & progressive discounts.</p>
          </div>

          <button
            type="button"
            onClick={handleQuickLogin}
            disabled={loggingIn}
            className="w-full py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-red-900/30 flex items-center justify-center space-x-2 transition transform active:scale-95 cursor-pointer"
          >
            <Key className="w-4 h-4" />
            <span>{loggingIn ? 'Authenticating...' : '⚡ One-Click Admin Quick Login'}</span>
          </button>

          <div className="flex items-center my-4">
            <div className="flex-1 border-t border-zinc-700/50"></div>
            <span className="px-3 text-[10px] text-zinc-400 uppercase font-bold">Or enter credentials</span>
            <div className="flex-1 border-t border-zinc-700/50"></div>
          </div>

          {loginError && (
            <div className="p-3 bg-red-950/80 border border-red-800 text-red-400 text-xs rounded-xl flex items-center space-x-2 font-medium">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="text-[10px] font-bold uppercase text-zinc-400 block mb-1">Admin Email</label>
              <input
                type="email"
                required
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-red-500 transition border ${
                  adminTheme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className="text-[10px] font-bold uppercase text-zinc-400 block mb-1">Password</label>
              <input
                type="password"
                required
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className={`w-full px-4 py-2.5 rounded-xl text-xs focus:outline-none focus:border-red-500 transition border ${
                  adminTheme === 'dark' ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-slate-50 border-slate-300 text-slate-900'
                }`}
              />
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>{loggingIn ? 'Signing in...' : 'Sign In as Administrator'}</span>
            </button>
          </form>

          <div className="pt-2 text-center">
            <Link href="/3d-printing" className="text-xs text-zinc-400 hover:text-red-500 flex items-center justify-center space-x-1">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isDark = adminTheme === 'dark';

  return (
    <div className={`min-h-screen py-8 px-4 sm:px-6 lg:px-8 transition-colors ${
      isDark ? 'bg-zinc-950 text-white' : 'bg-slate-100 text-slate-900'
    }`}>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header Bar */}
        <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-6 gap-4 ${
          isDark ? 'border-zinc-800' : 'border-slate-300'
        }`}>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-600/20 text-red-500 rounded-2xl border border-red-500/30">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl font-black">3DOM Back-Office Control Panel</h1>
                {stats?.isMongoConnected ? (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center space-x-1">
                    <Database className="w-3 h-3" />
                    <span>MongoDB Database</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-950 text-amber-400 border border-amber-800 flex items-center space-x-1">
                    <Database className="w-3 h-3" />
                    <span>Local JSON Store</span>
                  </span>
                )}
              </div>
              <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                Payment gateway management, product barcodes, orders & progressive bulk pricing.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Light / Dark Mode Switcher */}
            <button
              onClick={toggleTheme}
              className={`p-2.5 rounded-xl border transition flex items-center space-x-1.5 text-xs font-bold cursor-pointer ${
                isDark
                  ? 'bg-zinc-900 border-zinc-800 text-amber-400 hover:bg-zinc-800'
                  : 'bg-white border-slate-300 text-slate-800 hover:bg-slate-200 shadow-sm'
              }`}
              title="Toggle Light / Dark Mode"
            >
              {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-600" />}
              <span>{isDark ? '☀️ Light Mode' : '🌙 Dark Mode'}</span>
            </button>

            <button
              onClick={loadAdminData}
              className={`p-2.5 rounded-xl border transition flex items-center space-x-1 text-xs cursor-pointer ${
                isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:text-white' : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
            <Link
              href="/3d-printing"
              className="px-4 py-2.5 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 transition shadow-md"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Storefront</span>
            </Link>
            <button
              onClick={logout}
              className="px-3 py-2.5 bg-red-600/20 text-red-500 hover:bg-red-600 hover:text-white border border-red-500/30 rounded-xl text-xs font-bold transition cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Action Message Alert */}
        {actionMsg && (
          <div className="p-3 bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs rounded-xl flex items-center justify-between font-semibold">
            <span className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>{actionMsg}</span>
            </span>
            <button onClick={() => setActionMsg('')} className="text-emerald-300 hover:text-white font-bold">×</button>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className={`p-4 rounded-2xl border transition ${
            isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-extrabold uppercase ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Total Products</span>
              <Package className="w-4 h-4 text-red-500" />
            </div>
            <div className="text-2xl font-black mt-1">{products.length}</div>
          </div>

          <div className={`p-4 rounded-2xl border transition ${
            isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-extrabold uppercase ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Active Gateway</span>
              <CreditCard className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="text-xl font-black mt-1 capitalize text-emerald-500">{gatewaysConfig.activeGateway || 'Stripe'}</div>
          </div>

          <div className={`p-4 rounded-2xl border transition ${
            isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-extrabold uppercase ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Active Coupons</span>
              <Tag className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black mt-1">{coupons.length}</div>
          </div>

          <div className={`p-4 rounded-2xl border transition ${
            isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-extrabold uppercase ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Custom Requests</span>
              <HeartHandshake className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-2xl font-black mt-1">{requests.length}</div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className={`flex border-b overflow-x-auto scrollbar-none gap-2 pb-1 ${
          isDark ? 'border-zinc-800' : 'border-slate-300'
        }`}>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center space-x-2 shrink-0 cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-red-600 text-white shadow-lg'
                : isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-900' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Product Inventory ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('gateways')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center space-x-2 shrink-0 cursor-pointer ${
              activeTab === 'gateways'
                ? 'bg-red-600 text-white shadow-lg'
                : isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-900' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Payment Gateways</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center space-x-2 shrink-0 cursor-pointer ${
              activeTab === 'orders'
                ? 'bg-red-600 text-white shadow-lg'
                : isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-900' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Order Processing ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('discounts')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center space-x-2 shrink-0 cursor-pointer ${
              activeTab === 'discounts'
                ? 'bg-red-600 text-white shadow-lg'
                : isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-900' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>Progressive Discounts</span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center space-x-2 shrink-0 cursor-pointer ${
              activeTab === 'coupons'
                ? 'bg-red-600 text-white shadow-lg'
                : isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-900' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Promos & Coupons</span>
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center space-x-2 shrink-0 cursor-pointer ${
              activeTab === 'requests'
                ? 'bg-red-600 text-white shadow-lg'
                : isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-900' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Custom Sourcing Queue</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2.5 rounded-xl text-xs font-extrabold transition flex items-center space-x-2 shrink-0 cursor-pointer ${
              activeTab === 'reviews'
                ? 'bg-red-600 text-white shadow-lg'
                : isDark ? 'text-zinc-400 hover:text-white hover:bg-zinc-900' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Reviews Moderation</span>
          </button>
        </div>

        {/* ─── TAB: PAYMENT GATEWAY MANAGEMENT (ADMIN CONTROL) ─── */}
        {activeTab === 'gateways' && (
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border space-y-4 ${
              isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200 shadow-md'
            }`}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5 text-red-500" />
                    <h2 className="text-base font-extrabold">Payment Gateway Management</h2>
                  </div>
                  <p className={`text-xs mt-0.5 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                    Configure payment gateways & API credentials without changing code in the future.
                  </p>
                </div>

                <button
                  onClick={handleSaveGateways}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center space-x-2 transition cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Gateway Settings</span>
                </button>
              </div>

              {/* Active Default Gateway Selector */}
              <div className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-300'
              }`}>
                <div>
                  <span className="text-xs font-black uppercase text-red-500">Active Primary Gateway</span>
                  <p className="text-[11px] text-zinc-400">Select which gateway is loaded by default at Checkout.</p>
                </div>
                <select
                  value={gatewaysConfig.activeGateway}
                  onChange={(e) => setGatewaysConfig({ ...gatewaysConfig, activeGateway: e.target.value })}
                  className={`px-4 py-2 rounded-xl text-xs font-bold border outline-none cursor-pointer ${
                    isDark ? 'bg-zinc-900 border-zinc-700 text-white' : 'bg-white border-slate-300 text-slate-900'
                  }`}
                >
                  <option value="stripe">Stripe Payment Gateway</option>
                  <option value="razorpay">Razorpay Gateway</option>
                  <option value="paypal">PayPal Express Checkout</option>
                  <option value="cod">Cash on Delivery (COD)</option>
                  <option value="bank_transfer">Direct Bank Transfer</option>
                </select>
              </div>

              {/* Gateway Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
                
                {/* 1. Stripe Gateway */}
                <div className={`p-5 rounded-2xl border space-y-4 ${
                  gatewaysConfig.gateways?.stripe?.isEnabled
                    ? isDark ? 'bg-zinc-950 border-red-500/40' : 'bg-slate-50 border-red-300'
                    : isDark ? 'bg-zinc-950/40 border-zinc-800 opacity-60' : 'bg-slate-100 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-4 h-4 text-indigo-500" />
                      <span className="text-sm font-extrabold">Stripe Gateway</span>
                    </div>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={gatewaysConfig.gateways?.stripe?.isEnabled}
                        onChange={() => toggleGatewayEnabled('stripe')}
                        className="w-4 h-4 rounded text-red-600 focus:ring-red-500"
                      />
                      <span className="text-xs font-bold">{gatewaysConfig.gateways?.stripe?.isEnabled ? 'Enabled' : 'Disabled'}</span>
                    </label>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-zinc-400 block mb-1">Publishable Key</label>
                      <input
                        type="text"
                        value={gatewaysConfig.gateways?.stripe?.publishableKey || ''}
                        onChange={(e) => updateGatewayField('stripe', 'publishableKey', e.target.value)}
                        className={`w-full px-3 py-2 rounded-xl text-xs font-mono border outline-none ${
                          isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[10px] font-bold uppercase text-zinc-400">Secret Key</label>
                        <button
                          type="button"
                          onClick={() => toggleShowSecret('stripe')}
                          className="text-[10px] text-zinc-400 hover:text-white flex items-center space-x-1"
                        >
                          {showSecretKeys['stripe'] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          <span>{showSecretKeys['stripe'] ? 'Hide' : 'Show'}</span>
                        </button>
                      </div>
                      <input
                        type={showSecretKeys['stripe'] ? 'text' : 'password'}
                        value={gatewaysConfig.gateways?.stripe?.secretKey || ''}
                        onChange={(e) => updateGatewayField('stripe', 'secretKey', e.target.value)}
                        className={`w-full px-3 py-2 rounded-xl text-xs font-mono border outline-none ${
                          isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* 2. Razorpay Gateway */}
                <div className={`p-5 rounded-2xl border space-y-4 ${
                  gatewaysConfig.gateways?.razorpay?.isEnabled
                    ? isDark ? 'bg-zinc-950 border-blue-500/40' : 'bg-slate-50 border-blue-300'
                    : isDark ? 'bg-zinc-950/40 border-zinc-800 opacity-60' : 'bg-slate-100 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Globe className="w-4 h-4 text-blue-500" />
                      <span className="text-sm font-extrabold">Razorpay Gateway</span>
                    </div>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={gatewaysConfig.gateways?.razorpay?.isEnabled}
                        onChange={() => toggleGatewayEnabled('razorpay')}
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-xs font-bold">{gatewaysConfig.gateways?.razorpay?.isEnabled ? 'Enabled' : 'Disabled'}</span>
                    </label>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-zinc-400 block mb-1">Razorpay Key ID</label>
                      <input
                        type="text"
                        value={gatewaysConfig.gateways?.razorpay?.keyId || ''}
                        onChange={(e) => updateGatewayField('razorpay', 'keyId', e.target.value)}
                        className={`w-full px-3 py-2 rounded-xl text-xs font-mono border outline-none ${
                          isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-[10px] font-bold uppercase text-zinc-400">Key Secret</label>
                        <button
                          type="button"
                          onClick={() => toggleShowSecret('razorpay')}
                          className="text-[10px] text-zinc-400 hover:text-white flex items-center space-x-1"
                        >
                          {showSecretKeys['razorpay'] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                          <span>{showSecretKeys['razorpay'] ? 'Hide' : 'Show'}</span>
                        </button>
                      </div>
                      <input
                        type={showSecretKeys['razorpay'] ? 'text' : 'password'}
                        value={gatewaysConfig.gateways?.razorpay?.keySecret || ''}
                        onChange={(e) => updateGatewayField('razorpay', 'keySecret', e.target.value)}
                        className={`w-full px-3 py-2 rounded-xl text-xs font-mono border outline-none ${
                          isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* 3. PayPal Gateway */}
                <div className={`p-5 rounded-2xl border space-y-4 ${
                  gatewaysConfig.gateways?.paypal?.isEnabled
                    ? isDark ? 'bg-zinc-950 border-amber-500/40' : 'bg-slate-50 border-amber-300'
                    : isDark ? 'bg-zinc-950/40 border-zinc-800 opacity-60' : 'bg-slate-100 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-4 h-4 text-amber-500" />
                      <span className="text-sm font-extrabold">PayPal Express</span>
                    </div>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={gatewaysConfig.gateways?.paypal?.isEnabled}
                        onChange={() => toggleGatewayEnabled('paypal')}
                        className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                      />
                      <span className="text-xs font-bold">{gatewaysConfig.gateways?.paypal?.isEnabled ? 'Enabled' : 'Disabled'}</span>
                    </label>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-zinc-400 block mb-1">PayPal Client ID</label>
                      <input
                        type="text"
                        value={gatewaysConfig.gateways?.paypal?.clientId || ''}
                        onChange={(e) => updateGatewayField('paypal', 'clientId', e.target.value)}
                        className={`w-full px-3 py-2 rounded-xl text-xs font-mono border outline-none ${
                          isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* 4. Cash on Delivery (COD) */}
                <div className={`p-5 rounded-2xl border space-y-4 ${
                  gatewaysConfig.gateways?.cod?.isEnabled
                    ? isDark ? 'bg-zinc-950 border-emerald-500/40' : 'bg-slate-50 border-emerald-300'
                    : isDark ? 'bg-zinc-950/40 border-zinc-800 opacity-60' : 'bg-slate-100 border-slate-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4 text-emerald-500" />
                      <span className="text-sm font-extrabold">Cash on Delivery (COD)</span>
                    </div>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={gatewaysConfig.gateways?.cod?.isEnabled}
                        onChange={() => toggleGatewayEnabled('cod')}
                        className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-xs font-bold">{gatewaysConfig.gateways?.cod?.isEnabled ? 'Enabled' : 'Disabled'}</span>
                    </label>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-zinc-400 block mb-1">COD Delivery Instructions</label>
                      <input
                        type="text"
                        value={gatewaysConfig.gateways?.cod?.instructions || ''}
                        onChange={(e) => updateGatewayField('cod', 'instructions', e.target.value)}
                        className={`w-full px-3 py-2 rounded-xl text-xs border outline-none ${
                          isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* TAB 1: PRODUCT INVENTORY & BARCODE GENERATOR */}
        {activeTab === 'inventory' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <input
                type="text"
                placeholder="Search products by name, vertical, or category..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className={`px-4 py-2.5 rounded-xl text-xs w-full sm:w-80 outline-none border transition ${
                  isDark ? 'bg-zinc-900 border-zinc-800 text-white focus:border-red-500' : 'bg-white border-slate-300 text-slate-900 focus:border-red-500'
                }`}
              />
              <button
                onClick={() => setShowAddProduct(true)}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold rounded-xl transition flex items-center space-x-1.5 shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
            </div>

            {/* Product Table */}
            <div className={`rounded-2xl border overflow-hidden transition ${
              isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200 shadow-md'
            }`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className={`border-b text-[10px] font-extrabold uppercase tracking-wider ${
                    isDark ? 'bg-zinc-950/80 border-zinc-800 text-zinc-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}>
                    <tr>
                      <th className="p-3.5">Product</th>
                      <th className="p-3.5">Vertical & Category</th>
                      <th className="p-3.5">Price</th>
                      <th className="p-3.5">Stock</th>
                      <th className="p-3.5">Barcode / Label</th>
                      <th className="p-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-zinc-800 text-zinc-300' : 'divide-slate-200 text-slate-700'}`}>
                    {filteredProducts.map((prod) => (
                      <tr key={prod.id} className={`transition ${isDark ? 'hover:bg-zinc-800/40' : 'hover:bg-slate-50'}`}>
                        <td className="p-3.5">
                          <div className="flex items-center space-x-3">
                            <img src={prod.image} alt={prod.name} className="w-10 h-10 object-cover rounded-lg border bg-white" />
                            <div>
                              <p className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{prod.name}</p>
                              <p className="text-[10px] text-zinc-500">ID: {prod.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded-md bg-zinc-800 text-zinc-300 font-semibold text-[10px] uppercase mr-1">
                            {prod.vertical}
                          </span>
                          <span className="text-zinc-400">{prod.category}</span>
                        </td>
                        <td className="p-3.5 font-bold text-emerald-500">
                          ${prod.price}
                        </td>
                        <td className="p-3.5">
                          {editingStockId === prod.id ? (
                            <div className="flex items-center space-x-1">
                              <input
                                type="number"
                                value={stockInputValue}
                                onChange={(e) => setStockInputValue(parseInt(e.target.value) || 0)}
                                className="w-16 px-2 py-1 bg-zinc-950 border border-red-500 rounded text-xs text-white"
                              />
                              <button
                                onClick={() => handleSaveStock(prod.id)}
                                className="px-2 py-1 bg-emerald-600 text-white rounded text-[10px] font-bold"
                              >
                                Save
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-2">
                              <span className={`font-bold ${prod.stock <= 5 ? 'text-amber-500 font-extrabold' : ''}`}>
                                {prod.stock} units
                              </span>
                              <button
                                onClick={() => {
                                  setEditingStockId(prod.id);
                                  setStockInputValue(prod.stock);
                                }}
                                className="text-zinc-500 hover:text-white text-[10px] underline"
                              >
                                Edit
                              </button>
                            </div>
                          )}
                        </td>

                        <td className="p-3.5">
                          <button
                            onClick={() => setSelectedBarcodeProduct(prod)}
                            className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600 text-indigo-400 hover:text-white border border-indigo-500/30 rounded-xl text-[11px] font-extrabold transition flex items-center space-x-1.5 cursor-pointer"
                          >
                            <Barcode className="w-3.5 h-3.5" />
                            <span>Label & Barcode</span>
                          </button>
                        </td>

                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => handleDeleteProduct(prod.id)}
                            className="p-1.5 text-red-500 hover:bg-red-950/50 rounded-lg transition"
                            title="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDER PROCESSING */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold text-zinc-400">Filter Status:</span>
              {['all', 'pending', 'processing', 'shipped', 'delivered'].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition cursor-pointer ${
                    orderStatusFilter === st
                      ? 'bg-red-600 text-white'
                      : isDark ? 'bg-zinc-900 text-zinc-400 hover:text-white' : 'bg-white text-slate-600 border border-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <div className={`rounded-2xl border overflow-hidden ${
              isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200 shadow-md'
            }`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className={`border-b text-[10px] font-extrabold uppercase tracking-wider ${
                    isDark ? 'bg-zinc-950/80 border-zinc-800 text-zinc-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}>
                    <tr>
                      <th className="p-3.5">Order ID & Date</th>
                      <th className="p-3.5">Customer</th>
                      <th className="p-3.5">Items</th>
                      <th className="p-3.5">Total Amount</th>
                      <th className="p-3.5">Status</th>
                      <th className="p-3.5 text-right">Update</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-zinc-800 text-zinc-300' : 'divide-slate-200 text-slate-700'}`}>
                    {filteredOrders.map((ord) => (
                      <tr key={ord.id} className={`transition ${isDark ? 'hover:bg-zinc-800/40' : 'hover:bg-slate-50'}`}>
                        <td className="p-3.5">
                          <p className={`font-mono font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>{ord.id}</p>
                          <p className="text-[10px] text-zinc-500">{new Date(ord.createdAt || Date.now()).toLocaleDateString()}</p>
                        </td>
                        <td className="p-3.5">
                          <p className="font-semibold">{ord.customerName || ord.customerEmail || 'Customer'}</p>
                          <p className="text-[10px] text-zinc-500">{ord.shippingAddress || 'Standard Delivery'}</p>
                        </td>
                        <td className="p-3.5">
                          <span className="font-bold">{ord.items?.length || 1} items</span>
                        </td>
                        <td className="p-3.5 font-black text-emerald-500">
                          ${ord.totalAmount?.toFixed(2)}
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                            ord.orderStatus === 'delivered' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                            ord.orderStatus === 'shipped' ? 'bg-indigo-950 text-indigo-400 border border-indigo-800' :
                            'bg-amber-950 text-amber-400 border border-amber-800'
                          }`}>
                            {ord.orderStatus || 'pending'}
                          </span>
                        </td>
                        <td className="p-3.5 text-right">
                          <select
                            value={ord.orderStatus || 'pending'}
                            onChange={(e) => handleUpdateOrderStatus(ord.id, e.target.value)}
                            className={`px-2 py-1 rounded text-xs outline-none border ${
                              isDark ? 'bg-zinc-950 border-zinc-800 text-white' : 'bg-slate-100 border-slate-300 text-slate-900'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PROGRESSIVE BULK DISCOUNT CONFIGURATOR */}
        {activeTab === 'discounts' && (
          <div className={`p-6 rounded-2xl border space-y-6 ${
            isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200 shadow-md'
          }`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <Sliders className="w-5 h-5 text-red-500" />
                  <h2 className="text-base font-extrabold">Progressive Bulk Pricing Thresholds</h2>
                </div>
                <p className={`text-xs mt-0.5 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                  Configure quantity thresholds and dynamic discount percentages automatically applied in Cart!
                </p>
              </div>

              <button
                onClick={handleSaveDiscountTiers}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center space-x-2 transition cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Save Progressive Discount Tiers</span>
              </button>
            </div>

            {/* Editable Tiers List */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {editableTiers.map((tier, idx) => (
                <div
                  key={tier.id}
                  className={`p-4 rounded-2xl border space-y-3 ${
                    isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase text-red-500">Tier #{idx + 1}</span>
                    <span className="text-xs font-bold bg-red-600/20 text-red-400 px-2 py-0.5 rounded">
                      {tier.discountPercent}% OFF
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-zinc-400 block mb-1">
                        Min Quantity
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={tier.minQty}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 1;
                          const updated = [...editableTiers];
                          updated[idx].minQty = val;
                          setEditableTiers(updated);
                        }}
                        className={`w-full px-3 py-2 rounded-xl text-xs font-bold outline-none border ${
                          isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold uppercase text-zinc-400 block mb-1">
                        Discount %
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="90"
                        value={tier.discountPercent}
                        onChange={(e) => {
                          const val = parseInt(e.target.value) || 0;
                          const updated = [...editableTiers];
                          updated[idx].discountPercent = val;
                          setEditableTiers(updated);
                        }}
                        className={`w-full px-3 py-2 rounded-xl text-xs font-bold outline-none border ${
                          isDark ? 'bg-zinc-900 border-zinc-800 text-white' : 'bg-white border-slate-300 text-slate-900'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 text-right">
              <button
                onClick={() => setEditableTiers(DEFAULT_DISCOUNT_TIERS)}
                className="text-xs text-zinc-400 hover:text-red-400 underline font-semibold cursor-pointer"
              >
                Reset to Default Tiers (5%, 10%, 15%, 22%)
              </button>
            </div>
          </div>
        )}

        {/* TAB 4: COUPONS */}
        {activeTab === 'coupons' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={() => setShowAddCoupon(true)}
                className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold rounded-xl transition flex items-center space-x-1.5 shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create Promo Coupon</span>
              </button>
            </div>

            <div className={`rounded-2xl border overflow-hidden ${
              isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200 shadow-md'
            }`}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className={`border-b text-[10px] font-extrabold uppercase tracking-wider ${
                    isDark ? 'bg-zinc-950/80 border-zinc-800 text-zinc-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}>
                    <tr>
                      <th className="p-3.5">Code</th>
                      <th className="p-3.5">Discount</th>
                      <th className="p-3.5">Min Order</th>
                      <th className="p-3.5">Status</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-zinc-800 text-zinc-300' : 'divide-slate-200 text-slate-700'}`}>
                    {coupons.map((c) => (
                      <tr key={c.code} className={`transition ${isDark ? 'hover:bg-zinc-800/40' : 'hover:bg-slate-50'}`}>
                        <td className="p-3.5 font-mono font-bold text-amber-400">{c.code}</td>
                        <td className="p-3.5 font-bold">
                          {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `$${c.discountValue} OFF`}
                        </td>
                        <td className="p-3.5">${c.minOrderValue || 0}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-950 text-emerald-400 border border-emerald-800">
                            Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: SOURCING REQUESTS */}
        {activeTab === 'requests' && (
          <div className={`rounded-2xl border overflow-hidden ${
            isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200 shadow-md'
          }`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className={`border-b text-[10px] font-extrabold uppercase tracking-wider ${
                  isDark ? 'bg-zinc-950/80 border-zinc-800 text-zinc-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                }`}>
                  <tr>
                    <th className="p-3.5">Customer Email</th>
                    <th className="p-3.5">WhatsApp</th>
                    <th className="p-3.5">Requested Item Details</th>
                    <th className="p-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-zinc-800 text-zinc-300' : 'divide-slate-200 text-slate-700'}`}>
                  {requests.map((r) => (
                    <tr key={r.id} className={`transition ${isDark ? 'hover:bg-zinc-800/40' : 'hover:bg-slate-50'}`}>
                      <td className="p-3.5 font-semibold">{r.customerEmail}</td>
                      <td className="p-3.5 font-mono">{r.whatsappNumber}</td>
                      <td className="p-3.5 max-w-xs">{r.requestedItem}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-amber-950 text-amber-400 border border-amber-800 uppercase">
                          {r.status || 'pending'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: REVIEWS */}
        {activeTab === 'reviews' && (
          <div className={`rounded-2xl border overflow-hidden ${
            isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200 shadow-md'
          }`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className={`border-b text-[10px] font-extrabold uppercase tracking-wider ${
                  isDark ? 'bg-zinc-950/80 border-zinc-800 text-zinc-400' : 'bg-slate-100 border-slate-200 text-slate-600'
                }`}>
                  <tr>
                    <th className="p-3.5">Customer</th>
                    <th className="p-3.5">Rating</th>
                    <th className="p-3.5">Comment</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Moderate</th>
                  </tr>
                </thead>
                <tbody className={`divide-y ${isDark ? 'divide-zinc-800 text-zinc-300' : 'divide-slate-200 text-slate-700'}`}>
                  {reviews.map((rev) => (
                    <tr key={rev.id} className={`transition ${isDark ? 'hover:bg-zinc-800/40' : 'hover:bg-slate-50'}`}>
                      <td className="p-3.5 font-bold">{rev.customerName}</td>
                      <td className="p-3.5 text-amber-400 font-bold">{rev.rating} ★</td>
                      <td className="p-3.5 max-w-sm">{rev.comment}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-950 text-emerald-400 border border-emerald-800 uppercase">
                          {rev.status || 'approved'}
                        </span>
                      </td>
                      <td className="p-3.5 text-right space-x-1">
                        <button
                          onClick={() => handleModerateReview(rev.id, 'approved')}
                          className="px-2 py-1 bg-emerald-600 text-white rounded text-[10px] font-bold"
                        >
                          Approve
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* BARCODE MODAL */}
      {selectedBarcodeProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-white text-slate-900 max-w-md w-full rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in duration-200">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center space-x-2">
                <Barcode className="w-5 h-5 text-indigo-600" />
                <h3 className="text-base font-black text-slate-900">Product Label & Barcode</h3>
              </div>
              <button
                onClick={() => setSelectedBarcodeProduct(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ×
              </button>
            </div>

            <div id="printable-label" className="p-5 border-2 border-dashed border-slate-300 rounded-2xl bg-slate-50 text-center space-y-2">
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-500">
                3DOM MULTI-VERTICAL STOREFRONT
              </div>

              <h4 className="text-sm font-black text-slate-900 line-clamp-2">
                {selectedBarcodeProduct.name}
              </h4>

              <div className="flex items-center justify-center space-x-2 text-xs font-semibold text-slate-600">
                <span className="bg-slate-200 px-2 py-0.5 rounded text-[10px] uppercase">{selectedBarcodeProduct.vertical}</span>
                <span>&bull;</span>
                <span>{selectedBarcodeProduct.category}</span>
              </div>

              <div className="py-2">
                {renderBarcodeSVG(selectedBarcodeProduct.id || selectedBarcodeProduct.slug)}
                <p className="font-mono text-xs font-bold text-slate-800 tracking-widest">
                  SKU: {selectedBarcodeProduct.id?.toUpperCase() || '3DOM-8921'}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs font-black">
                <span className="text-slate-600">MSRP PRICE:</span>
                <span className="text-base font-black text-red-600">${selectedBarcodeProduct.price}</span>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setSelectedBarcodeProduct(null)}
                className="flex-1 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-xl transition"
              >
                Close
              </button>

              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold rounded-xl shadow-lg transition flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Sticker Label</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW PRODUCT MODAL */}
      {showAddProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-zinc-900 text-white max-w-lg w-full rounded-3xl p-6 shadow-2xl border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-extrabold">Add New Inventory Item</h3>
              <button onClick={() => setShowAddProduct(false)} className="text-zinc-400 hover:text-white">×</button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-zinc-400 block mb-1">Product Name</label>
                <input
                  type="text"
                  required
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-400 block mb-1">Store Vertical</label>
                  <select
                    value={newProdVertical}
                    onChange={(e: any) => setNewProdVertical(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white"
                  >
                    <option value="3d-printing">3D Printing</option>
                    <option value="fashion">Korean Fashion</option>
                    <option value="beauty">Luxury Beauty</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-400 block mb-1">Category</label>
                  <input
                    type="text"
                    required
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-400 block mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase text-zinc-400 block mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    required
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProduct(false)}
                  className="flex-1 py-2 bg-zinc-800 text-white text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold rounded-xl"
                >
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW COUPON MODAL */}
      {showAddCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-zinc-900 text-white max-w-sm w-full rounded-3xl p-6 shadow-2xl border border-zinc-800 space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-base font-extrabold">Create Promo Code</h3>
              <button onClick={() => setShowAddCoupon(false)} className="text-zinc-400 hover:text-white">×</button>
            </div>

            <form onSubmit={handleAddCouponSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-bold uppercase text-zinc-400 block mb-1">Code (e.g. VIP25)</label>
                <input
                  type="text"
                  required
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white uppercase"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-zinc-400 block mb-1">Discount Value</label>
                <input
                  type="number"
                  required
                  value={couponValue}
                  onChange={(e) => setCouponValue(e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddCoupon(false)}
                  className="flex-1 py-2 bg-zinc-800 text-white text-xs font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-red-600 text-white text-xs font-extrabold rounded-xl"
                >
                  Save Code
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
