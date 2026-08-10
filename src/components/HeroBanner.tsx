import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Image as ImageIcon } from 'lucide-react';

interface HeroBannerProps {
  onExplore: () => void;
  onOpenAdmin: () => void;
  onWatchFashionShow?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ onExplore, onOpenAdmin, onWatchFashionShow }) => {
  return (
    <div className="relative bg-stone-950 text-white overflow-hidden rounded-3xl my-6 mx-4 sm:mx-6 lg:mx-8 border border-stone-800 shadow-2xl">
      {/* Background imagery with gradient overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2000&auto=format&fit=crop"
          alt="Fashion Hero Runway"
          className="w-full h-full object-cover object-center opacity-30 transform scale-105 hover:scale-100 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-transparent" />
      </div>

      <div className="relative z-10 max-w-3xl px-8 py-16 sm:py-24 lg:py-28 space-y-6">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono tracking-widest uppercase">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Autumn / Winter Haute Couture</span>
        </div>

        <h1 className="font-serif text-4xl sm:text-6xl font-light tracking-tight text-stone-100 leading-none">
          Timeless Elegance, <br />
          <span className="font-semibold italic text-amber-200">Redefined Today</span>
        </h1>

        <p className="text-stone-300 text-sm sm:text-base max-w-xl font-sans font-light leading-relaxed">
          Discover handpicked artisanal coats, silk wrap silhouettes, and Italian leather accessories. Built with React.js, Tailwind CSS, Firebase Firestore, and Java Spring Boot API specifications.
        </p>

        <div className="flex flex-wrap gap-4 pt-2">
          <button
            onClick={onExplore}
            className="px-8 py-3.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-full text-xs uppercase tracking-widest flex items-center space-x-2 transition-all shadow-xl shadow-amber-400/20"
          >
            <span>Explore Store Collection</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {onWatchFashionShow && (
            <button
              onClick={onWatchFashionShow}
              className="px-6 py-3.5 bg-stone-900/90 hover:bg-amber-400 hover:text-stone-950 text-amber-300 font-bold rounded-full text-xs border border-amber-400/40 flex items-center space-x-2 transition-all backdrop-blur-md shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Watch Fashion Show 2026</span>
            </button>
          )}

          <button
            onClick={onOpenAdmin}
            className="px-6 py-3.5 bg-stone-900/80 hover:bg-stone-800 text-stone-200 font-medium rounded-full text-xs border border-stone-700 flex items-center space-x-2 transition-all backdrop-blur-md"
          >
            <ImageIcon className="w-4 h-4 text-amber-400" />
            <span>Admin Image URL Manager</span>
          </button>
        </div>

        {/* Feature Pill indicators */}
        <div className="pt-8 grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-stone-800/80 text-xs text-stone-400 font-mono">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>100% Authentic Leather & Silk</span>
          </div>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>Admin URL Image Management</span>
          </div>
          <div className="flex items-center space-x-2 hidden sm:flex">
            <Sparkles className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>Java REST API Architecture</span>
          </div>
        </div>
      </div>
    </div>
  );
};
