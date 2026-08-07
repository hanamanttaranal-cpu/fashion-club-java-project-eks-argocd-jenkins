import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, Tag, Truck, Check, Sparkles } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onProceedToCheckout: (discountPercent: number) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}) => {
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const rawSubtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = (rawSubtotal * appliedDiscount) / 100;
  const subtotal = Math.max(0, rawSubtotal - discountAmount);
  
  const freeShippingThreshold = 150;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const shippingCost = subtotal >= freeShippingThreshold || items.length === 0 ? 0 : 15;
  const estimatedTax = subtotal * 0.08; // 8% sales tax
  const total = subtotal + shippingCost + estimatedTax;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'FASHION20') {
      setAppliedDiscount(20);
      setPromoMessage('20% Haute Couture Promo Applied!');
    } else {
      setPromoMessage('Invalid code. Try "FASHION20" for 20% off.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/80 backdrop-blur-md">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-stone-900 text-stone-100 border-l border-stone-800 flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-6 bg-stone-950 border-b border-stone-800 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              <h2 className="font-serif text-lg font-bold text-white tracking-wide">
                Your Shopping Bag ({items.reduce((sum, i) => sum + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-stone-950/80 px-6 py-3 border-b border-stone-800 text-xs font-mono space-y-1">
            <div className="flex justify-between text-stone-300">
              <span className="flex items-center space-x-1">
                <Truck className="w-3.5 h-3.5 text-amber-400" />
                <span>Express Worldwide Shipping</span>
              </span>
              <span>
                {amountToFreeShipping > 0
                  ? `Add $${amountToFreeShipping.toFixed(2)} for FREE Shipping`
                  : 'FREE Express Shipping Unlocked!'}
              </span>
            </div>
            <div className="w-full h-1.5 bg-stone-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-500"
                style={{ width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 bg-stone-800 rounded-full flex items-center justify-center mx-auto text-stone-500">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="font-serif text-lg text-stone-300">Your bag is currently empty.</p>
                <p className="text-xs text-stone-500 font-mono">Explore our autumn collection to add garments.</p>
              </div>
            ) : (
              items.map((item, index) => (
                <div
                  key={index}
                  className="bg-stone-950 p-3.5 rounded-2xl border border-stone-800/80 flex gap-3 relative group"
                >
                  <img
                    src={item.product.images?.[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200'}
                    alt={item.product.name}
                    className="w-20 h-24 object-cover rounded-xl bg-stone-900 border border-stone-800 flex-shrink-0"
                  />

                  <div className="flex-1 flex flex-col justify-between pr-6">
                    <div>
                      <span className="text-[10px] font-mono text-stone-400 uppercase">{item.product.category}</span>
                      <h4 className="font-serif text-xs sm:text-sm text-white line-clamp-1">{item.product.name}</h4>
                      <div className="text-[11px] text-stone-400 font-mono mt-0.5">
                        Size: <strong className="text-stone-200">{item.selectedSize}</strong> • Color:{' '}
                        <strong className="text-stone-200">{item.selectedColor}</strong>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-stone-800 rounded-lg bg-stone-900 px-2 py-0.5">
                        <button
                          onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                          className="text-stone-400 hover:text-white text-xs px-1"
                        >
                          -
                        </button>
                        <span className="text-xs font-mono font-bold px-2 text-white">{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                          className="text-stone-400 hover:text-white text-xs px-1"
                        >
                          +
                        </button>
                      </div>

                      <span className="font-mono text-xs font-bold text-amber-300">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => onRemoveItem(index)}
                    className="absolute top-3 right-3 text-stone-500 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="p-6 bg-stone-950 border-t border-stone-800 space-y-4">
              {/* Promo Code Input */}
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Promo Code (FASHION20)"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-8 pr-3 py-2 text-xs font-mono text-stone-100 focus:outline-none focus:border-amber-400 uppercase"
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-mono font-medium rounded-xl border border-stone-700"
                >
                  Apply
                </button>
              </form>

              {promoMessage && (
                <p className={`text-[11px] font-mono ${appliedDiscount > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {promoMessage}
                </p>
              )}

              {/* Order Breakdown */}
              <div className="space-y-1.5 text-xs font-mono text-stone-400 border-t border-stone-800/80 pt-3">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-stone-200">${rawSubtotal.toFixed(2)}</span>
                </div>

                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount (20% Off)</span>
                    <span>-${discountAmount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Estimated Tax (8%)</span>
                  <span className="text-stone-200">${estimatedTax.toFixed(2)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className="text-stone-200">
                    {shippingCost === 0 ? <strong className="text-emerald-400">FREE</strong> : `$${shippingCost.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between text-sm font-bold text-white pt-2 border-t border-stone-800 font-mono">
                  <span>Estimated Total</span>
                  <span className="text-amber-400">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Proceed to Checkout */}
              <button
                onClick={() => onProceedToCheckout(appliedDiscount)}
                className="w-full py-4 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs uppercase tracking-widest rounded-xl flex items-center justify-center space-x-2 transition-all shadow-xl shadow-amber-400/20"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
