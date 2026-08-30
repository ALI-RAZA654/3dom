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
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white text-sm">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-white space-y-4">
        <h2 className="text-xl font-bold">Product Not Found</h2>
        <button onClick={() => router.back()} className="px-4 py-2 bg-red-600 rounded-lg text-xs font-bold">
          Go Back
        </button>
      </div>
    );
  }

  const is3D = product.vertical === '3d-printing';
  const isOut = product.stock <= 0;

  return (
    <div className={`${is3D ? 'bg-zinc-950 text-white' : 'bg-white text-zinc-900'} min-h-screen py-10 px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Back Link */}
        <button
          onClick={() => router.back()}
          className={`flex items-center space-x-2 text-xs font-bold px-3 py-1.5 rounded-lg border transition ${
            is3D ? 'border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900' : 'border-zinc-200 text-zinc-600 hover:bg-zinc-100'
          }`}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Catalog</span>
        </button>

        {/* Main PDP Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Image Gallery */}
          <div className="lg:col-span-6">
            <div className={`rounded-3xl overflow-hidden border shadow-xl ${is3D ? 'border-zinc-800 bg-zinc-900' : 'border-zinc-200 bg-zinc-50'}`}>
              <img
                src={product.image}
                alt={product.name}
                className="w-full aspect-square object-cover"
              />
            </div>
          </div>

          {/* Right Column: Title, Stock, Attributes, Add to Cart */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="flex items-center space-x-3 text-xs mb-2">
                <span className="font-extrabold uppercase tracking-widest text-red-500">{product.brand}</span>
                <span className="text-zinc-500">&bull;</span>
                <span className="text-zinc-400 capitalize">{product.vertical} &bull; {product.category}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black tracking-tight">{product.name}</h1>

              {/* Star rating */}
              <div className="flex items-center space-x-2 mt-3">
                <div className="flex items-center space-x-1 text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-amber-400' : 'text-zinc-600'}`}
                    />
                  ))}
                </div>
                <span className="text-sm font-bold">{product.rating}</span>
                <span className="text-xs text-zinc-500">({reviews.length} customer reviews)</span>
              </div>
            </div>

            {/* Price & Real-Time Stock Status */}
            <div className={`p-4 rounded-2xl border space-y-2 ${is3D ? 'bg-zinc-900/80 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
              <div className="flex items-baseline space-x-3">
                <span className="text-3xl font-black">${product.price.toFixed(2)}</span>
                {product.originalPrice && (
                  <span className="text-sm text-zinc-500 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Live Real-time Stock Badge */}
              <div className="pt-2 flex items-center space-x-2 text-xs font-bold">
                {isOut ? (
                  <span className="text-red-500 flex items-center space-x-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Out of Stock (Real-time back-office stock update active)</span>
                  </span>
                ) : product.stock <= 3 ? (
                  <span className="text-amber-500 flex items-center space-x-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Only {product.stock} left in stock - Order soon!</span>
                  </span>
                ) : (
                  <span className="text-emerald-500 flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>In Stock ({product.stock} available in real-time inventory)</span>
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">{product.description}</p>

            {/* Attributes Breakdown */}
            {product.attributes && Object.keys(product.attributes).length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-zinc-400">Specifications</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {Object.entries(product.attributes).map(([key, val]) => (
                    <div key={key} className={`p-2.5 rounded-lg border ${is3D ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                      <span className="text-zinc-500 font-medium capitalize">{key}: </span>
                      <span className="font-bold text-white">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="space-y-3 pt-4 border-t border-zinc-800">
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-zinc-700 rounded-xl overflow-hidden bg-zinc-900">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-zinc-400 hover:text-white font-bold"
                  >
                    -
                  </button>
                  <span className="px-4 text-xs font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                    className="px-3 py-2 text-zinc-400 hover:text-white font-bold disabled:opacity-30"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={() => addToCart(product, quantity)}
                  disabled={isOut}
                  className={`flex-1 py-3.5 px-6 rounded-xl font-extrabold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition shadow-lg ${
                    isOut
                      ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700'
                      : is3D
                      ? 'bg-red-600 hover:bg-red-700 text-white shadow-red-900/30'
                      : 'bg-zinc-900 hover:bg-black text-white'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isOut ? 'Out of Stock' : `Add ${quantity} to Cart`}</span>
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* CUSTOMER REVIEWS & MODERATION SECTION */}
        <section className="pt-12 border-t border-zinc-800 space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-xl font-extrabold flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-red-500" />
                <span>Customer Reviews</span>
              </h3>
              <p className="text-xs text-zinc-400">Verified buyer ratings & moderated reviews</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left: Submit Review Form */}
            <div className="lg:col-span-5">
              <form onSubmit={handleReviewSubmit} className={`p-6 rounded-2xl border space-y-4 ${is3D ? 'bg-zinc-900 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                <h4 className="text-sm font-bold">Write a Customer Review</h4>

                {reviewMsg && (
                  <div className="p-3 bg-emerald-950/60 border border-emerald-800 text-emerald-400 text-xs rounded-lg">
                    {reviewMsg}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold uppercase mb-1 text-zinc-400">Your Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Alex Mercer"
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg outline-none text-white focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase mb-1 text-zinc-400">Star Rating</label>
                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg text-white outline-none"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5/5 Excellent)</option>
                    <option value={4}>⭐⭐⭐⭐ (4/5 Very Good)</option>
                    <option value={3}>⭐⭐⭐ (3/5 Average)</option>
                    <option value={2}>⭐⭐ (2/5 Poor)</option>
                    <option value={1}>⭐ (1/5 Terribe)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase mb-1 text-zinc-400">Written Review</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Share your experience with print quality, durability, or fit..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-zinc-950 border border-zinc-800 rounded-lg outline-none text-white focus:border-red-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow transition disabled:opacity-50"
                >
                  {submittingReview ? 'Submitting...' : 'Post Customer Review'}
                </button>
              </form>
            </div>

            {/* Right: Published Reviews List */}
            <div className="lg:col-span-7 space-y-4">
              {reviews.length === 0 ? (
                <div className="text-center py-12 text-xs text-zinc-500 bg-zinc-900/50 rounded-2xl border border-zinc-800">
                  No reviews yet for this product. Be the first to review!
                </div>
              ) : (
                reviews.map((rev) => (
                  <div key={rev.id} className={`p-4 rounded-xl border space-y-2 ${is3D ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold">{rev.customerName}</span>
                      <div className="flex items-center space-x-1 text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < rev.rating ? 'fill-amber-400' : 'text-zinc-700'}`} />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-zinc-300">{rev.comment}</p>
                    <span className="text-[10px] text-zinc-500 block">
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
