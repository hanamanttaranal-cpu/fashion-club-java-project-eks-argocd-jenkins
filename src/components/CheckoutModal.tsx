import React, { useState } from 'react';
import { X, CheckCircle, CreditCard, ShieldCheck, Truck, Lock, ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { CartItem, Order, ShippingAddress } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  discountPercent: number;
  onPlaceOrder: (address: ShippingAddress, totalAmount: number) => Promise<Order | null>;
  userEmail?: string;
  userName?: string;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  discountPercent,
  onPlaceOrder,
  userEmail = '',
  userName = '',
}) => {
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping');
  const [loading, setLoading] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Form State
  const [fullName, setFullName] = useState(userName || 'Hanamant Taranal');
  const [email, setEmail] = useState(userEmail || 'hanamanttaranal19@gmail.com');
  const [street, setStreet] = useState('124 Fifth Avenue, Suite 400');
  const [city, setCity] = useState('New York');
  const [state, setState] = useState('NY');
  const [zipCode, setZipCode] = useState('10001');
  const [country, setCountry] = useState('United States');

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'applepay' | 'cod'>('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');

  if (!isOpen) return null;

  const rawSubtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discountAmount = (rawSubtotal * discountPercent) / 100;
  const subtotal = rawSubtotal - discountAmount;
  const shippingCost = subtotal >= 150 ? 0 : 15;
  const tax = subtotal * 0.08;
  const totalAmount = subtotal + shippingCost + tax;

  const handleCompleteOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const address: ShippingAddress = {
        fullName,
        email,
        street,
        city,
        state,
        zipCode,
        country,
      };

      const orderResult = await onPlaceOrder(address, totalAmount);
      if (orderResult) {
        setCompletedOrder(orderResult);
        setStep('confirmation');
      }
    } catch (err) {
      console.error('Checkout error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-3xl overflow-hidden text-stone-100 shadow-2xl relative">
        
        {/* Header */}
        <div className="bg-stone-950 px-6 py-5 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <h2 className="font-serif text-lg font-bold text-white tracking-wide">
              {step === 'confirmation' ? 'Order Confirmed!' : 'Secure Express Checkout'}
            </h2>
          </div>

          {step !== 'confirmation' && (
            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Step Indicator */}
        {step !== 'confirmation' && (
          <div className="flex border-b border-stone-800 bg-stone-950/50 px-6 py-3 text-xs font-mono justify-center space-x-8">
            <span className={`flex items-center space-x-2 ${step === 'shipping' ? 'text-amber-400 font-bold' : 'text-stone-500'}`}>
              <span className="w-5 h-5 rounded-full bg-stone-800 flex items-center justify-center text-[10px]">1</span>
              <span>Shipping Address</span>
            </span>
            <span className={`flex items-center space-x-2 ${step === 'payment' ? 'text-amber-400 font-bold' : 'text-stone-500'}`}>
              <span className="w-5 h-5 rounded-full bg-stone-800 flex items-center justify-center text-[10px]">2</span>
              <span>Payment Details</span>
            </span>
          </div>
        )}

        {/* Body Content */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto">
          
          {/* STEP 1: SHIPPING */}
          {step === 'shipping' && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setStep('payment');
              }}
              className="space-y-4"
            >
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-2">
                1. Shipping Address & Contact Information
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-stone-400 uppercase font-mono mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-stone-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 uppercase font-mono mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-stone-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-stone-400 uppercase font-mono mb-1">Street Address *</label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-stone-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 uppercase font-mono mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-stone-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 uppercase font-mono mb-1">State / Province *</label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-stone-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 uppercase font-mono mb-1">Postal / Zip Code *</label>
                  <input
                    type="text"
                    required
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-stone-100 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-stone-400 uppercase font-mono mb-1">Country *</label>
                  <input
                    type="text"
                    required
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2.5 text-stone-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-stone-800">
                <button
                  type="submit"
                  className="px-8 py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs uppercase tracking-widest rounded-xl flex items-center space-x-2 transition-all shadow-lg"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: PAYMENT */}
          {step === 'payment' && (
            <form onSubmit={handleCompleteOrder} className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                  2. Payment Selection & Review
                </h3>
                <span className="text-xs font-mono text-amber-400">Total: ${totalAmount.toFixed(2)}</span>
              </div>

              <div className="space-y-3">
                <label className="block text-xs font-mono text-stone-400 uppercase">Payment Method</label>
                
                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-3 rounded-xl border text-xs font-medium flex flex-col items-center space-y-1.5 transition-colors ${
                      paymentMethod === 'card'
                        ? 'bg-amber-400/10 border-amber-400 text-amber-300'
                        : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span>Credit Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('applepay')}
                    className={`p-3 rounded-xl border text-xs font-medium flex flex-col items-center space-y-1.5 transition-colors ${
                      paymentMethod === 'applepay'
                        ? 'bg-amber-400/10 border-amber-400 text-amber-300'
                        : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <ShieldCheck className="w-5 h-5" />
                    <span>Express Pay</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-xl border text-xs font-medium flex flex-col items-center space-y-1.5 transition-colors ${
                      paymentMethod === 'cod'
                        ? 'bg-amber-400/10 border-amber-400 text-amber-300'
                        : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <Truck className="w-5 h-5" />
                    <span>Cash on Delivery</span>
                  </button>
                </div>
              </div>

              {paymentMethod === 'card' && (
                <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 space-y-3 text-xs">
                  <div>
                    <label className="block text-stone-400 uppercase font-mono mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2 text-stone-100 font-mono focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-400 uppercase font-mono mb-1">Expiry Date</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2 text-stone-100 font-mono focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-stone-400 uppercase font-mono mb-1">CVC / CVV</label>
                      <input
                        type="text"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2 text-stone-100 font-mono focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Order Summary Recap */}
              <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800 text-xs font-mono space-y-2">
                <div className="flex justify-between text-stone-400">
                  <span>Shipping to:</span>
                  <span className="text-stone-200 truncate max-w-[200px]">{street}, {city}</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Items Count:</span>
                  <span className="text-stone-200">{items.reduce((s, i) => s + i.quantity, 0)} items</span>
                </div>
                <div className="flex justify-between text-white font-bold text-sm pt-2 border-t border-stone-800">
                  <span>Total Amount Due:</span>
                  <span className="text-amber-400">${totalAmount.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => setStep('shipping')}
                  className="px-4 py-2 text-xs text-stone-400 hover:text-stone-200 flex items-center space-x-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Address</span>
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-amber-400/20"
                >
                  {loading ? 'Processing Order...' : `Pay $${totalAmount.toFixed(2)} & Place Order`}
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: CONFIRMATION */}
          {step === 'confirmation' && completedOrder && (
            <div className="text-center py-8 space-y-6">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-10 h-10" />
              </div>

              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20">
                  Order Successfully Saved to Firestore
                </span>
                <h3 className="font-serif text-2xl text-white mt-3">Thank You For Your Order!</h3>
                <p className="text-xs text-stone-400 mt-1 font-mono">
                  Order ID: <strong className="text-stone-200">{completedOrder.id}</strong>
                </p>
              </div>

              <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 max-w-md mx-auto text-left text-xs font-mono space-y-2">
                <div className="flex justify-between text-stone-400">
                  <span>Recipient:</span>
                  <span className="text-white">{completedOrder.shippingAddress?.fullName}</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Destination:</span>
                  <span className="text-white">{completedOrder.shippingAddress?.street}, {completedOrder.shippingAddress?.city}</span>
                </div>
                <div className="flex justify-between text-stone-400">
                  <span>Status:</span>
                  <span className="text-emerald-400 font-bold">{completedOrder.status}</span>
                </div>
                <div className="flex justify-between text-stone-400 pt-2 border-t border-stone-800">
                  <span>Amount Paid:</span>
                  <span className="text-amber-400 font-bold">${completedOrder.totalAmount?.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={onClose}
                className="px-8 py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg"
              >
                Continue Shopping
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
