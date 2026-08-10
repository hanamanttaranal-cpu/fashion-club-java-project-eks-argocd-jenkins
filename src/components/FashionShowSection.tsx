import React, { useState } from 'react';
import { Play, Pause, Sparkles, Eye, ShoppingBag, Volume2, VolumeX, ArrowRight, ChevronLeft, ChevronRight, Star, Tag, Compass } from 'lucide-react';
import { Product } from '../types';

interface FashionShowSectionProps {
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: string, quantity: number) => void;
  products: Product[];
}

interface RunwayLook {
  id: string;
  title: string;
  collection: string;
  model: string;
  designerNote: string;
  image: string;
  category: string;
  associatedProductId?: string;
  price: number;
  badge: string;
}

const RUNWAY_LOOKS: RunwayLook[] = [
  {
    id: 'look-01',
    title: 'Look 01: Midnight Silk Trench & Leather Trousers',
    collection: 'Paris Haute Couture AW26',
    model: 'Sora Kim (Paris Runway)',
    designerNote: 'Draped double-breasted Mulberry silk trench with sculpted exaggerated shoulders and hand-stitched nappa leather trousers.',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1200&auto=format&fit=crop',
    category: 'Outerwear',
    price: 680,
    badge: 'Runway Opening Look'
  },
  {
    id: 'look-02',
    title: 'Look 02: Sculpted Emerald Satin Evening Column Gown',
    collection: 'Milan Fashion Week 2026',
    model: 'Elena Rostova (Milan Runway)',
    designerNote: 'Bias-cut emerald satin column gown featuring a plunging architectural back and hand-embroidered crystal train.',
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=1200&auto=format&fit=crop',
    category: 'Dresses',
    price: 890,
    badge: 'Best in Show'
  },
  {
    id: 'look-03',
    title: 'Look 03: Cashmere Oversized Blazer & Pleated Wool Pants',
    collection: 'Tokyo Atelier Modernism',
    model: 'Kenji Sato (Tokyo Runway)',
    designerNote: 'Unstructured double-breasted Loro Piana Italian cashmere blazer paired with wide-leg pleated virgin wool trousers.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop',
    category: 'Tops',
    price: 490,
    badge: 'Editors Choice'
  },
  {
    id: 'look-04',
    title: 'Look 04: Italian Calfskin Bag & Minimalist Ankle Boots Ensemble',
    collection: 'New York Fashion Week 2026',
    model: 'Amara Diop (NYFW Runway)',
    designerNote: 'Hand-burnished Italian calfskin structured tote with custom matte champagne hardware and buttery leather boots.',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1200&auto=format&fit=crop',
    category: 'Accessories',
    price: 420,
    badge: 'Trending Accessory'
  }
];

export const FashionShowSection: React.FC<FashionShowSectionProps> = ({
  onSelectProduct,
  onAddToCart,
  products
}) => {
  const [activeLookIndex, setActiveLookIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  const currentLook = RUNWAY_LOOKS[activeLookIndex];

  // Try matching look with actual catalog product or construct a fallback product
  const matchingProduct: Product = products.find(p => p.category === currentLook.category) || {
    id: `runway-prod-${currentLook.id}`,
    name: currentLook.title,
    price: currentLook.price,
    category: currentLook.category,
    description: currentLook.designerNote,
    images: [currentLook.image],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Black', 'Emerald', 'Gold', 'Nude'],
    inStock: true,
    rating: 5.0,
    reviewsCount: 24,
    tags: ['Runway 2026', 'Haute Couture', 'Featured']
  };

  const handleNextLook = () => {
    setActiveLookIndex((prev) => (prev + 1) % RUNWAY_LOOKS.length);
  };

  const handlePrevLook = () => {
    setActiveLookIndex((prev) => (prev - 1 + RUNWAY_LOOKS.length) % RUNWAY_LOOKS.length);
  };

  return (
    <section className="relative my-12 mx-4 sm:mx-6 lg:mx-8 bg-stone-900 border border-stone-800 rounded-3xl overflow-hidden shadow-2xl">
      {/* Runway ambient lighting header */}
      <div className="bg-gradient-to-r from-stone-950 via-amber-950/60 to-stone-950 px-6 py-4 border-b border-stone-800/80 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-400">
            <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
          </div>
          <div>
            <h2 className="font-serif text-lg sm:text-xl font-bold tracking-wide text-stone-100 flex items-center gap-2">
              <span>ATELIER RUNWAY & FASHION SHOW 2026</span>
              <span className="text-[10px] bg-amber-400 text-stone-950 px-2 py-0.5 rounded-full font-sans font-extrabold uppercase">
                LIVE
              </span>
            </h2>
            <p className="text-stone-400 text-xs font-mono">
              Autumn / Winter Haute Couture • Paris, Milan, Tokyo, New York
            </p>
          </div>
        </div>

        {/* Audio / Auto Play Controls */}
        <div className="flex items-center space-x-2 bg-stone-950/80 p-1.5 rounded-2xl border border-stone-800 text-xs text-stone-300">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`px-3 py-1.5 rounded-xl flex items-center space-x-1.5 font-medium transition-colors ${
              isPlaying ? 'bg-amber-400 text-stone-950 font-bold' : 'hover:bg-stone-800'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="text-[11px]">{isPlaying ? 'Show Playing' : 'Paused'}</span>
          </button>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-1.5 hover:bg-stone-800 rounded-xl text-stone-400 hover:text-amber-300 transition-colors"
            title={isMuted ? 'Unmute Runway Beats' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400 animate-pulse" />}
          </button>
        </div>
      </div>

      {/* Main Fashion Show Stage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
        
        {/* Visual Runway Stage (7 cols) */}
        <div className="lg:col-span-7 relative bg-stone-950 overflow-hidden flex items-center justify-center min-h-[400px]">
          {/* Main Runway Look Image with Smooth Animation */}
          <img
            src={currentLook.image}
            alt={currentLook.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-top max-h-[600px] transition-all duration-700 transform scale-100 hover:scale-105"
          />

          {/* Runway Spotlight Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-transparent opacity-80" />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-950/40 via-transparent to-stone-950/40" />

          {/* Badge */}
          <div className="absolute top-4 left-4 z-10 flex items-center space-x-2">
            <span className="bg-amber-400/90 text-stone-950 font-bold text-xs px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
              {currentLook.badge}
            </span>
            <span className="bg-stone-900/90 text-stone-200 border border-stone-700 text-xs px-3 py-1 rounded-full font-mono">
              {currentLook.collection}
            </span>
          </div>

          {/* Navigation Controls Overlay */}
          <div className="absolute bottom-6 left-6 right-6 z-10 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevLook}
                className="p-3 bg-stone-900/80 hover:bg-amber-400 hover:text-stone-950 text-stone-200 rounded-full border border-stone-700 backdrop-blur-md transition-all shadow-xl"
                aria-label="Previous Look"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNextLook}
                className="p-3 bg-stone-900/80 hover:bg-amber-400 hover:text-stone-950 text-stone-200 rounded-full border border-stone-700 backdrop-blur-md transition-all shadow-xl"
                aria-label="Next Look"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Look Indicators */}
            <div className="flex items-center space-x-1.5 bg-stone-900/80 px-3 py-1.5 rounded-full border border-stone-700/80 backdrop-blur-md">
              {RUNWAY_LOOKS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveLookIndex(idx)}
                  className={`h-2 rounded-full transition-all ${
                    idx === activeLookIndex ? 'w-6 bg-amber-400' : 'w-2 bg-stone-600 hover:bg-stone-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Runway Look Details & Direct Shop Actions (5 cols) */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-stone-900/90 space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-amber-400">
              <span className="flex items-center space-x-1">
                <Compass className="w-3.5 h-3.5" />
                <span>Model: {currentLook.model}</span>
              </span>
              <span>Look #{activeLookIndex + 1} of {RUNWAY_LOOKS.length}</span>
            </div>

            <h3 className="font-serif text-2xl sm:text-3xl font-light tracking-tight text-stone-100 leading-snug">
              {currentLook.title}
            </h3>

            <div className="p-4 rounded-2xl bg-stone-950/60 border border-stone-800 space-y-2">
              <h4 className="text-xs uppercase tracking-widest text-amber-300 font-mono flex items-center space-x-1">
                <Tag className="w-3 h-3" />
                <span>Designer Notes</span>
              </h4>
              <p className="text-stone-300 text-xs sm:text-sm font-sans leading-relaxed italic">
                "{currentLook.designerNote}"
              </p>
            </div>

            {/* Price & Rating */}
            <div className="flex items-baseline justify-between pt-2">
              <div>
                <span className="text-stone-400 text-xs font-mono uppercase block">Runway Ensemble</span>
                <span className="font-serif text-3xl font-bold text-amber-300">${currentLook.price}</span>
              </div>
              <div className="flex items-center space-x-1 text-amber-400 text-xs font-bold">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>5.0 (Runway Approved)</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4 border-t border-stone-800">
            <button
              onClick={() => onAddToCart(matchingProduct, 'M', 'Default', 1)}
              className="w-full py-3.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-2xl text-xs uppercase tracking-widest flex items-center justify-center space-x-2 transition-all shadow-xl shadow-amber-400/20"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Shop This Runway Look (${currentLook.price})</span>
            </button>

            <button
              onClick={() => onSelectProduct(matchingProduct)}
              className="w-full py-3 bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium rounded-2xl text-xs flex items-center justify-center space-x-2 border border-stone-700 transition-colors"
            >
              <Eye className="w-4 h-4 text-amber-400" />
              <span>View Haute Couture Details</span>
            </button>
          </div>

          {/* Bottom Runway Thumbnail Reel */}
          <div className="pt-2 grid grid-cols-4 gap-2">
            {RUNWAY_LOOKS.map((look, idx) => (
              <button
                key={look.id}
                onClick={() => setActiveLookIndex(idx)}
                className={`relative rounded-xl overflow-hidden border-2 transition-all h-16 ${
                  idx === activeLookIndex ? 'border-amber-400 scale-105' : 'border-stone-800 opacity-60 hover:opacity-100'
                }`}
              >
                <img src={look.image} alt={look.title} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
};
