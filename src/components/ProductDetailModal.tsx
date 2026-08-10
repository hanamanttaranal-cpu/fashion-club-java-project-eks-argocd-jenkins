import React, { useState } from 'react';
import { X, Star, Heart, ShoppingBag, ShieldCheck, Truck, RefreshCw, Check, MessageSquare } from 'lucide-react';
import { Product, Review } from '../types';

interface ProductDetailModalProps {
  product: Product;
  reviews: Review[];
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: string, quantity: number) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  onAddReview: (review: Omit<Review, 'id' | 'createdAt'>) => Promise<void>;
  userName?: string;
  userId?: string;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  reviews,
  onClose,
  onAddToCart,
  onToggleWishlist,
  isWishlisted,
  onAddReview,
  userName = 'Fashion Lover',
  userId = 'guest',
}) => {
  const images = product.images && product.images.length > 0
    ? product.images
    : ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000'];

  const [selectedImage, setSelectedImage] = useState(images[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'M');
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || 'Default');
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Review Form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;

    setSubmittingReview(true);
    try {
      await onAddReview({
        productId: product.id,
        userId,
        userName,
        rating: reviewRating,
        comment: reviewComment.trim(),
      });
      setReviewComment('');
    } catch (err) {
      console.error('Error posting review:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-stone-100 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-stone-950/80 hover:bg-stone-800 text-stone-300 hover:text-white rounded-full transition-colors border border-stone-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="overflow-y-auto flex-1 p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left: Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-[3/4] bg-stone-950 rounded-2xl overflow-hidden border border-stone-800 relative group">
                <img
                  src={selectedImage}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1000';
                  }}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <button
                  onClick={() => onToggleWishlist(product)}
                  className="absolute top-3 right-3 p-2.5 rounded-full bg-stone-950/70 backdrop-blur-md text-stone-200 border border-stone-800 hover:text-rose-400 transition-colors"
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>
              </div>

              {/* Thumbnails list */}
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {images.map((imgUrl, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(imgUrl)}
                      className={`w-16 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${
                        selectedImage === imgUrl ? 'border-amber-400 scale-105' : 'border-stone-800 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={imgUrl} alt={`Thumbnail ${i}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Meta & Purchase Form */}
            <div className="space-y-6">
              <div>
                <span className="text-xs uppercase tracking-widest font-mono text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                  {product.category}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-normal text-white mt-3">
                  {product.name}
                </h2>

                <div className="flex items-center space-x-3 mt-2">
                  <span className="font-mono text-2xl font-bold text-amber-300">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.originalPrice && (
                    <span className="font-mono text-sm text-stone-500 line-through">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-2 mt-2">
                  <div className="flex text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs text-stone-400 font-mono">
                    {product.rating} ({product.reviewCount + reviews.length} reviews)
                  </span>
                </div>
              </div>

              <p className="text-stone-300 text-xs sm:text-sm leading-relaxed font-light border-y border-stone-800/80 py-4">
                {product.description}
              </p>

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-300 mb-2">
                    Color: <span className="text-amber-300 font-normal">{selectedColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c}
                        onClick={() => setSelectedColor(c)}
                        className={`px-3 py-1.5 text-xs rounded-lg border font-mono transition-all ${
                          selectedColor === c
                            ? 'bg-amber-400 text-stone-950 font-bold border-amber-400'
                            : 'bg-stone-950 text-stone-300 border-stone-800 hover:border-stone-700'
                        }`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-stone-300">
                      Select Size
                    </label>
                    <span className="text-[11px] text-amber-400 cursor-pointer hover:underline">Size Guide</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() => setSelectedSize(sz)}
                        className={`w-11 h-11 rounded-xl text-xs font-mono border flex items-center justify-center transition-all ${
                          selectedSize === sz
                            ? 'bg-amber-400 text-stone-950 font-bold border-amber-400'
                            : 'bg-stone-950 text-stone-300 border-stone-800 hover:border-stone-700'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Stepper & Add to Cart Button */}
              <div className="flex gap-3 pt-2">
                <div className="flex items-center bg-stone-950 border border-stone-800 rounded-xl px-3 py-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1 text-stone-400 hover:text-white"
                  >
                    -
                  </button>
                  <span className="px-3 text-xs font-mono font-bold text-white">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1 text-stone-400 hover:text-white"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={`flex-1 py-3.5 px-6 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center space-x-2 transition-all shadow-xl ${
                    addedAnimation
                      ? 'bg-emerald-500 text-stone-950'
                      : 'bg-amber-400 hover:bg-amber-300 text-stone-950 shadow-amber-400/10'
                  }`}
                >
                  {addedAnimation ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Shopping Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to Shopping Bag • ${(product.price * quantity).toFixed(2)}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Value Props */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-stone-800 text-[11px] text-stone-400 font-mono">
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-amber-400" />
                  <span>Free Express Delivery</span>
                </div>
                <div className="flex items-center space-x-2">
                  <RefreshCw className="w-4 h-4 text-amber-400" />
                  <span>30-Day Easy Returns</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reviews & Ratings Section */}
          <div className="mt-12 pt-8 border-t border-stone-800 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-amber-400" />
                <h3 className="font-serif text-lg text-white font-semibold">
                  Customer Reviews & Feedback
                </h3>
              </div>
              <span className="text-xs text-stone-400 font-mono">
                {reviews.length} Verified Reviews
              </span>
            </div>

            {/* Post review form */}
            <form onSubmit={handleReviewSubmit} className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-3">
              <div className="flex items-center space-x-3">
                <span className="text-xs font-semibold text-stone-300 uppercase">Your Rating:</span>
                <div className="flex text-amber-400 cursor-pointer">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="p-0.5 focus:outline-none"
                    >
                      <Star className={`w-4 h-4 ${star <= reviewRating ? 'fill-current text-amber-400' : 'text-stone-700'}`} />
                    </button>
                  ))}
                </div>
              </div>

              <textarea
                rows={2}
                placeholder="Share your thoughts on fit, fabric quality, and finish..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 focus:outline-none focus:border-amber-400"
              />

              <button
                type="submit"
                disabled={submittingReview || !reviewComment.trim()}
                className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold rounded-xl disabled:opacity-50 transition-all"
              >
                {submittingReview ? 'Submitting...' : 'Post Review'}
              </button>
            </form>

            {/* Review List */}
            <div className="space-y-3">
              {reviews.map((rev, i) => (
                <div key={rev.id || i} className="bg-stone-950/60 p-4 rounded-xl border border-stone-800/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-stone-200">{rev.userName}</span>
                    <div className="flex text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className={`w-3 h-3 ${s <= rev.rating ? 'fill-current' : 'text-stone-700'}`} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-stone-300 font-light">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
