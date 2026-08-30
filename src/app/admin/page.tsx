'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck, Package, ShoppingCart, Tag, MessageSquare, HeartHandshake,
  TrendingUp, Plus, Edit, Trash2, CheckCircle, XCircle, ArrowLeft, RefreshCw
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import {
  fetchAdminStats, fetchAdminOrders, updateAdminOrder,
  fetchProducts, createAdminProduct, updateAdminProduct, deleteAdminProduct,
  fetchAdminCoupons, createAdminCoupon,
  fetchAdminReviews, updateAdminReview,
  fetchAdminRequests
} from '@/lib/api';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, token, isAdmin } = useAuth();

  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'coupons' | 'reviews' | 'requests' | 'reports'>('inventory');

  // Stats
  const [stats, setStats] = useState<any>(null);

  // Data states
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [coupons, setCoupons] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [requests, setRequests] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

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

  // New Coupon Modal state
  const [showAddCoupon, setShowAddCoupon] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [couponType, setCouponType] = useState<'percentage' | 'flat'>('percentage');
  const [couponValue, setCouponValue] = useState('15');
  const [couponMin, setCouponMin] = useState('40');

  // Editing Stock
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [stockInputValue, setStockInputValue] = useState<number>(0);

  const loadAdminData = () => {
    if (!token) return;
    setLoading(true);
    Promise.all([
      fetchAdminStats(token),
      fetchProducts(),
      fetchAdminOrders(token),
      fetchAdminCoupons(token),
      fetchAdminReviews(token),
      fetchAdminRequests(token)
    ])
      .then(([st, prods, ords, coups, revs, reqs]) => {
        setStats(st);
        setProducts(prods);
        setOrders(ords);
        setCoupons(coups);
        setReviews(revs);
        setRequests(reqs);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadAdminData();
  }, [token]);

  // Handle Stock Live Edit
  const handleSaveStock = async (productId: string) => {
    try {
      await updateAdminProduct(token!, productId, { stock: stockInputValue });
      setActionMsg(`Stock for product updated to ${stockInputValue} in real-time.`);
      setEditingStockId(null);
      loadAdminData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Handle Add Product
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
      setActionMsg(`Product '${newProdName}' added successfully!`);
      loadAdminData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Handle Add Coupon
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
      setActionMsg(`Coupon '${couponCode}' created successfully!`);
      loadAdminData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Handle Delete Product
  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteAdminProduct(token!, id);
      loadAdminData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Handle Review Moderation
  const handleModerateReview = async (id: string, status: string) => {
    try {
      await updateAdminReview(token!, id, status);
      loadAdminData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  // Handle Order Carrier / Status Update
  const handleUpdateOrderStatus = async (orderId: string, status: string, carrier?: string, trackingNo?: string) => {
    try {
      await updateAdminOrder(token!, orderId, { orderStatus: status, carrier, trackingNumber: trackingNo });
      setActionMsg(`Order ${orderId} status updated to ${status}.`);
      loadAdminData();
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (!isAdmin && token) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex flex-col items-center justify-center p-4 space-y-4">
        <ShieldCheck className="w-12 h-12 text-red-500" />
        <h2 className="text-xl font-bold">Admin Privileges Required</h2>
        <p className="text-xs text-zinc-400">Please sign in using the Admin account (admin@3dom.com / 99911191).</p>
        <Link href="/3d-printing" className="px-6 py-2 bg-red-600 rounded-xl font-bold text-xs">
          Return to Store
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-zinc-800 pb-6 gap-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-600/20 text-red-500 rounded-2xl border border-red-500/30">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-black">3DOM Back-Office Admin Control Panel</h1>
              <p className="text-xs text-zinc-400">Manage 3 Verticals: 3D Printing, GenZ Fashion & Beauty Stores</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={loadAdminData}
              className="p-2.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl text-zinc-300 hover:text-white transition"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <Link
              href="/3d-printing"
              className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl flex items-center space-x-1.5 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Storefront</span>
            </Link>
          </div>
        </div>

        {actionMsg && (
          <div className="p-4 bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs rounded-xl font-semibold flex items-center justify-between">
            <span>{actionMsg}</span>
            <button onClick={() => setActionMsg('')} className="text-emerald-300 hover:text-white">&times;</button>
          </div>
        )}

        {/* Analytics Summary Cards */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl">
              <span className="text-[10px] font-bold uppercase text-zinc-500">Total Store Revenue</span>
              <div className="text-2xl font-black text-emerald-400 mt-1">${stats.totalRevenue.toFixed(2)}</div>
            </div>
            <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl">
              <span className="text-[10px] font-bold uppercase text-zinc-500">Orders Processed</span>
              <div className="text-2xl font-black text-white mt-1">{stats.totalOrders}</div>
            </div>
            <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl">
              <span className="text-[10px] font-bold uppercase text-zinc-500">Active Inventory SKU</span>
              <div className="text-2xl font-black text-red-500 mt-1">{stats.totalProducts}</div>
            </div>
            <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl">
              <span className="text-[10px] font-bold uppercase text-zinc-500">Sourcing Requests</span>
              <div className="text-2xl font-black text-amber-400 mt-1">{stats.pendingRequests}</div>
            </div>
          </div>
        )}

        {/* Admin Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-zinc-800 pb-3">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2.5 text-xs font-extrabold rounded-xl transition flex items-center space-x-2 ${
              activeTab === 'inventory' ? 'bg-red-600 text-white' : 'bg-zinc-900 text-zinc-400 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Inventory Management ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-2.5 text-xs font-extrabold rounded-xl transition flex items-center space-x-2 ${
              activeTab === 'orders' ? 'bg-red-600 text-white' : 'bg-zinc-900 text-zinc-400 hover:text-white'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Orders & Shipping ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-4 py-2.5 text-xs font-extrabold rounded-xl transition flex items-center space-x-2 ${
              activeTab === 'coupons' ? 'bg-red-600 text-white' : 'bg-zinc-900 text-zinc-400 hover:text-white'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Discounts & Coupons ({coupons.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2.5 text-xs font-extrabold rounded-xl transition flex items-center space-x-2 ${
              activeTab === 'reviews' ? 'bg-red-600 text-white' : 'bg-zinc-900 text-zinc-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Reviews Moderation ({reviews.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2.5 text-xs font-extrabold rounded-xl transition flex items-center space-x-2 ${
              activeTab === 'requests' ? 'bg-red-600 text-white' : 'bg-zinc-900 text-zinc-400 hover:text-white'
            }`}
          >
            <HeartHandshake className="w-4 h-4" />
            <span>Sourcing Requests Queue ({requests.length})</span>
          </button>
        </div>

        {/* TAB 1: INVENTORY MANAGEMENT */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">Product Stock & Catalog Control</h3>
              <button
                onClick={() => setShowAddProduct(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
            </div>

            <div className="overflow-x-auto bg-zinc-900 rounded-2xl border border-zinc-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="p-4">Product</th>
                    <th className="p-4">Vertical</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Real-time Stock</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-zinc-800/40">
                      <td className="p-4 flex items-center space-x-3">
                        <img src={p.image} alt={p.name} className="w-10 h-10 object-cover rounded-lg border border-zinc-800" />
                        <div>
                          <div className="font-bold text-white truncate max-w-xs">{p.name}</div>
                          <div className="text-[10px] text-zinc-500">{p.brand}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                          p.vertical === '3d-printing' ? 'bg-red-950 text-red-400 border border-red-800' :
                          p.vertical === 'fashion' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                          'bg-rose-950 text-rose-400 border border-rose-800'
                        }`}>
                          {p.vertical}
                        </span>
                      </td>
                      <td className="p-4 text-zinc-300 font-semibold">{p.category}</td>
                      <td className="p-4 font-bold text-white">${p.price.toFixed(2)}</td>
                      <td className="p-4">
                        {editingStockId === p.id ? (
                          <div className="flex items-center space-x-2">
                            <input
                              type="number"
                              value={stockInputValue}
                              onChange={(e) => setStockInputValue(parseInt(e.target.value) || 0)}
                              className="w-16 px-2 py-1 bg-zinc-950 border border-zinc-700 rounded text-xs font-bold text-white"
                            />
                            <button
                              onClick={() => handleSaveStock(p.id)}
                              className="px-2 py-1 bg-emerald-600 text-white rounded text-[10px] font-bold"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center space-x-2">
                            <span className={`font-extrabold ${p.stock <= 0 ? 'text-red-500' : p.stock <= 3 ? 'text-amber-400' : 'text-emerald-400'}`}>
                              {p.stock} units
                            </span>
                            <button
                              onClick={() => {
                                setEditingStockId(p.id);
                                setStockInputValue(p.stock);
                              }}
                              className="text-zinc-500 hover:text-white p-1"
                              title="Edit live stock"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
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
        )}

        {/* TAB 2: ORDERS & SHIPPING LOGISTICS */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold">Orders & Shipping Carrier Controls</h3>
            <div className="overflow-x-auto bg-zinc-900 rounded-2xl border border-zinc-800">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 uppercase font-bold text-[10px]">
                  <tr>
                    <th className="p-4">Order ID</th>
                    <th className="p-4">Customer</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Carrier & Tracking</th>
                    <th className="p-4 text-right">Update Logistics</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-zinc-800/40">
                      <td className="p-4 font-mono font-bold text-red-400">{o.id}</td>
                      <td className="p-4">
                        <div className="font-bold text-white">{o.customer?.name}</div>
                        <div className="text-[10px] text-zinc-500">{o.customer?.email}</div>
                      </td>
                      <td className="p-4 font-black text-white">${o.finalAmount.toFixed(2)}</td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-red-950 text-red-400 border border-red-800">
                          {o.orderStatus}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="font-bold text-white">{o.carrier}</div>
                        <div className="font-mono text-[10px] text-zinc-400">{o.trackingNumber}</div>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        <button
                          onClick={() => handleUpdateOrderStatus(o.id, 'Shipped', 'Bluedart', 'BD' + Math.floor(100000 + Math.random()*900000) + 'IN')}
                          className="px-2.5 py-1 bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-bold rounded-lg"
                        >
                          Mark Shipped
                        </button>
                        <button
                          onClick={() => handleUpdateOrderStatus(o.id, 'Delivered')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold rounded-lg"
                        >
                          Mark Delivered
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: COUPONS ENGINE */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">Discount & Coupon Code Engine</h3>
              <button
                onClick={() => setShowAddCoupon(true)}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Create Promo Code</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {coupons.map((c) => (
                <div key={c.code} className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-black text-lg text-red-500">{c.code}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                      Active
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 font-semibold">
                    {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `$${c.discountValue} FLAT OFF`}
                  </p>
                  <p className="text-[11px] text-zinc-500">Min Order: ${c.minOrderValue} &bull; Used: {c.usedCount} times</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: REVIEWS MODERATION */}
        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold">Customer Reviews Moderation Queue</h3>
            <div className="space-y-4">
              {reviews.map((r) => (
                <div key={r.id} className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 text-xs">
                      <span className="font-bold text-white">{r.customerName}</span>
                      <span className="text-amber-400">⭐ {r.rating}/5</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        r.status === 'approved' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'
                      }`}>
                        {r.status}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-300">{r.comment}</p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => handleModerateReview(r.id, 'approved')}
                      className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition"
                      title="Approve"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleModerateReview(r.id, 'rejected')}
                      className="p-2 bg-red-600 hover:bg-red-500 text-white rounded-lg transition"
                      title="Reject"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: SOURCING REQUESTS QUEUE */}
        {activeTab === 'requests' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold">Custom Sourcing Requests Queue ("Can't Find What You Need?")</h3>
            <div className="space-y-4">
              {requests.map((req) => (
                <div key={req.id} className="p-5 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-xs text-red-400 font-bold">{req.id}</span>
                      <h4 className="text-sm font-bold text-white mt-1">{req.requestedItem}</h4>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-amber-950 text-amber-400 border border-amber-800">
                      {req.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-zinc-400 pt-2 border-t border-zinc-800">
                    <div>Email: <span className="text-white font-bold">{req.customerEmail}</span></div>
                    <div>WhatsApp: <span className="text-white font-bold">{req.whatsappNumber}</span></div>
                    <div>Required Date: <span className="text-white font-bold">{req.requiredDate}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Modal: Add Product */}
        {showAddProduct && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl max-w-md w-full space-y-4 text-white">
              <h3 className="text-lg font-bold">Add New Product to Inventory</h3>
              <form onSubmit={handleAddProductSubmit} className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Product Name"
                  value={newProdName}
                  onChange={(e) => setNewProdName(e.target.value)}
                  className="w-full p-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg"
                />
                <select
                  value={newProdVertical}
                  onChange={(e) => setNewProdVertical(e.target.value as any)}
                  className="w-full p-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white"
                >
                  <option value="3d-printing">3D Printing Vertical</option>
                  <option value="fashion">GenZ Fashion Vertical</option>
                  <option value="beauty">Beauty Vertical</option>
                </select>
                <input
                  type="text"
                  required
                  placeholder="Category (e.g. Printers, Filaments, Tops...)"
                  value={newProdCategory}
                  onChange={(e) => setNewProdCategory(e.target.value)}
                  className="w-full p-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="Price ($)"
                    value={newProdPrice}
                    onChange={(e) => setNewProdPrice(e.target.value)}
                    className="p-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg"
                  />
                  <input
                    type="number"
                    required
                    placeholder="Stock Qty"
                    value={newProdStock}
                    onChange={(e) => setNewProdStock(e.target.value)}
                    className="p-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg"
                  />
                </div>
                <textarea
                  rows={2}
                  placeholder="Description"
                  value={newProdDesc}
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  className="w-full p-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg resize-none"
                />
                <div className="flex space-x-2 pt-2">
                  <button type="button" onClick={() => setShowAddProduct(false)} className="flex-1 py-2 bg-zinc-800 text-xs font-bold rounded-lg">Cancel</button>
                  <button type="submit" className="flex-1 py-2 bg-emerald-600 text-xs font-bold rounded-lg">Create SKU</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Add Coupon */}
        {showAddCoupon && (
          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl max-w-md w-full space-y-4 text-white">
              <h3 className="text-lg font-bold">Create Discount Promo Code</h3>
              <form onSubmit={handleAddCouponSubmit} className="space-y-3">
                <input
                  type="text"
                  required
                  placeholder="Promo Code (e.g. FLASH30)"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="w-full p-2.5 text-xs uppercase bg-zinc-950 border border-zinc-800 rounded-lg"
                />
                <select
                  value={couponType}
                  onChange={(e) => setCouponType(e.target.value as any)}
                  className="w-full p-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg"
                >
                  <option value="percentage">Percentage OFF (%)</option>
                  <option value="flat">Flat Amount OFF ($)</option>
                </select>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    required
                    placeholder="Discount Value"
                    value={couponValue}
                    onChange={(e) => setCouponValue(e.target.value)}
                    className="p-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg"
                  />
                  <input
                    type="number"
                    required
                    placeholder="Min Order ($)"
                    value={couponMin}
                    onChange={(e) => setCouponMin(e.target.value)}
                    className="p-2.5 text-xs bg-zinc-950 border border-zinc-800 rounded-lg"
                  />
                </div>
                <div className="flex space-x-2 pt-2">
                  <button type="button" onClick={() => setShowAddCoupon(false)} className="flex-1 py-2 bg-zinc-800 text-xs font-bold rounded-lg">Cancel</button>
                  <button type="submit" className="flex-1 py-2 bg-emerald-600 text-xs font-bold rounded-lg">Launch Coupon</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
