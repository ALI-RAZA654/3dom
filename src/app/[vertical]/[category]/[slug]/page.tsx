'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Star, ShoppingBag, Truck, ShieldCheck, ArrowLeft, CheckCircle, AlertTriangle, Send, MessageSquare } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { fetchProductBySlug, fetchProductReviews, submitProductReview } from '@/lib/api';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { addToCart } = useCart();

  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [quantity, setQuantity] = useState<number>(1);

  // Review Form state
  const [reviewerName, setReviewerName] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMsg, setReviewMsg] = useState('');

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchProductBySlug(slug)
      .then((data) => {
        setProduct(data);
        return fetchProductReviews(data.id);
      })
      .then((revs) => {
        setReviews(revs);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [slug]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim() || !product) return;

    setSubmittingReview(true);
    setReviewMsg('');

    try {
      const newRev = await submitProductReview({
        productId: product.id,
        customerName: reviewerName.trim() || 'Verified Customer',
        rating,
        comment: reviewComment.trim(),
      });

      setReviews((prev) => [newRev, ...prev]);
      setReviewMsg('Thank you! Your review has been submitted and published.');
      setReviewComment('');
      setReviewerName('');
    } catch (err: any) {
      setReviewMsg(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center text-slate-700 text-sm font-semibold">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center text-slate-900 space-y-4">
        <h2 className="text-xl font-bold">Product Not Found</h2>
        <button onClick={() => router.back()} className="px-4 py-2 bg-red-600 text-white rounded-xl text-xs font-bold shadow">
          Go Back
        </button>
      </div>
    );
  }

  const isOut = product.stock <= 0;

  return (
    <div className="bg-[#F8FAFC] text-slate-900 min-h-screen py-8 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Back Link */}
        <button
          onClick={() => router.back()}
          className="flex items-center space-x-2 text-xs font-bold px-4 py-2 rounded-xl border border-slate-300 bg-white text-slate-700 hover:bg-slate-100 transition shadow-2xs"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </button>

        {/* Main PDP Grid */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6">
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 shadow-md">
              <img
                src={product.image}
                alt={product.name}
                className="w-full aspect-square object-cover"
              />
            </div>
          </div>

          {/* Right Column: Title, Stock, Attributes, Add to Cart */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <div className="flex items-center space-x-3 text-xs mb-2">
                <span className="font-black uppercase tracking-widest text-red-600">{product.brand}</span>
                <span className="text-slate-300">&bull;</span>
                <span className="text-slate-500 capitalize">{product.vertical} &bull; {product.category}</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{product.name}</h1>

              {/* Rating badge */}
              <div className="flex items-center space-x-3 mt-3">
                <div className="flex items-center space-x-1 bg-emerald-700 text-white text-xs font-black px-2 py-0.5 rounded-md">
                  <span>{product.rating}</span>
                  <Star className="w-3.5 h-3.5 fill-white" />
                </div>
                <span className="text-xs text-slate-500 font-semibold">({reviews.length} customer reviews)</span>
              </div>
            </div>

            {/* Price & Real-Time Stock Status */}
            <div className="p-4 rounded-2xl bg-red-50/40 border border-red-100 space-y-2">
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-black text-slate-900">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-sm text-slate-400 line-through font-semibold">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Live Real-time Stock Badge */}
              <div className="pt-2 flex items-center space-x-2 text-xs font-bold">
                {isOut ? (
                  <span className="text-red-600 flex items-center space-x-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Out of Stock</span>
                  </span>
                ) : product.stock <= 3 ? (
                  <span className="text-amber-600 flex items-center space-x-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Only {product.stock} left in stock - Order soon!</span>
                  </span>
                ) : (
                  <span className="text-emerald-700 flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>In Stock ({product.stock} available)</span>
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{product.description}</p>

            {/* Attributes Breakdown */}
            {product.attributes && Object.keys(product.attributes).length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Specifications</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(product.attributes).map(([key, val]) => (
                    <div key={key} className="p-3 rounded-xl border border-slate-200 bg-slate-50">
                      <span className="text-slate-500 font-medium capitalize">{key}: </span>
                      <span className="font-bold text-slate-900">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-slate-50">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-slate-600 hover:text-black font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 text-xs font-extrabold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="px-3 py-2 text-slate-600 hover:text-black font-bold disabled:opacity-30"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => addToCart(product, quantity)}
                  disabled={isOut}
                  className={`flex-1 py-3.5 px-6 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition shadow-md ${
                    isOut
                      ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                      : 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/20'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isOut ? 'Out of Stock' : `Add ${quantity} to Cart`}</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* CUSTOMER REVIEWS SECTION */}
        <section className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xs space-y-6">
          <div>
            <h3 className="text-xl font-black text-slate-900 flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-red-600" />
              <span>Customer Ratings & Reviews</span>
            </h3>
            <p className="text-xs text-slate-500">Verified buyer ratings & moderated reviews</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Submit Review Form */}
            <div className="lg:col-span-5">
              <form onSubmit={handleReviewSubmit} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="text-xs font-black uppercase text-slate-700">Write a Review</h4>

                {reviewMsg && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-semibold">
                    {reviewMsg}
                  </div>
                )}

                <div>
                  <label className="block text-[11px] font-bold uppercase mb-1 text-slate-500">Your Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Alex Mercer"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl outline-none text-slate-900 focus:border-red-600"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase mb-1 text-slate-500">Rating</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl text-slate-900 outline-none"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5/5 Excellent)</option>
                    <option value={4}>⭐⭐⭐⭐ (4/5 Very Good)</option>
                    <option value={3}>⭐⭐⭐ (3/5 Average)</option>
                    <option value={2}>⭐⭐ (2/5 Poor)</option>
                    <option value={1}>⭐ (1/5 Terribe)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase mb-1 text-slate-500">Written Review</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Share your experience..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-300 rounded-xl outline-none text-slate-900 focus:border-red-600 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-2xs transition disabled:opacity-50"
                >
                  {submittingReview ? 'Submitting...' : 'Post Customer Review'}
                </button>
              </form>
            </div>

            {/* Right: Published Reviews List */}
            <div className="lg:col-span-7 space-y-3">
              {reviews.length === 0 ? (
                <div className="text-center py-12 text-xs text-slate-500 bg-slate-50 rounded-2xl border border-slate-200">
                  No reviews yet for this product. Be the first to review!
                </div>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{rev.customerName}</span>
                      <div className="flex items-center space-x-1 bg-emerald-700 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        <span>{rev.rating} ★</span>
                      </div>
                    </div>
                    <p className="text-xs text-slate-700">{rev.comment}</p>
                    <span className="text-[10px] text-slate-400 block font-medium">
                      {new Date(rev.createdAt).toLocaleDateString()} &bull; Verified Purchase
                    </span>
                  </div>
                ))
              )}
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
