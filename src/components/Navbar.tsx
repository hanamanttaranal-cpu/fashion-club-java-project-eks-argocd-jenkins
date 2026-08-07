import React, { useState } from 'react';
import { ShoppingBag, Search, User, Shield, Code2, Menu, X, Heart, Sparkles, LogOut, Check } from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  cartCount: number;
  onOpenCart: () => void;
  onOpenAdmin: () => void;
  onOpenJavaInspector: () => void;
  user: UserProfile | null;
  onOpenAuth: () => void;
  onSignOut: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  wishlistCount: number;
  onOpenWishlist: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeCategory,
  onSelectCategory,
  cartCount,
  onOpenCart,
  onOpenAdmin,
  onOpenJavaInspector,
  user,
  onOpenAuth,
  onSignOut,
  searchQuery,
  onSearchChange,
  wishlistCount,
  onOpenWishlist,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const categories = ['All', 'Outerwear', 'Dresses', 'Tops', 'Bottoms', 'Shoes', 'Accessories'];

  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 backdrop-blur-md text-stone-100 border-b border-stone-800 transition-all">
      {/* Top announcement banner with Frontend & Backend Badges */}
      <div className="bg-gradient-to-r from-stone-950 via-amber-950/40 to-stone-950 py-1.5 px-4 text-center text-[11px] font-medium tracking-wider text-amber-200/90 border-b border-stone-800/60 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center space-x-2 text-[10px] font-mono">
          <span className="bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/30">
            Frontend: React 19 + Tailwind
          </span>
          <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
            Backend: Java Spring Boot + Firebase
          </span>
        </div>
        <div className="flex items-center space-x-2 text-[11px]">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse hidden sm:inline" />
          <span>Complimentary Shipping Over $150 • Code: FASHION20</span>
        </div>
        <div className="hidden md:flex items-center space-x-1.5 text-[10px] font-mono text-stone-300">
          <span>Admin Login ID:</span>
          <span className="text-amber-400 font-bold bg-stone-900 px-1.5 py-0.5 rounded border border-stone-800">
            hanamanttaranal19@gmail.com
          </span>
          <span className="text-stone-400">/ Pass:</span>
          <span className="text-amber-400 font-bold bg-stone-900 px-1.5 py-0.5 rounded border border-stone-800">
            12345
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Left: Mobile Menu Trigger + Brand Logo */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-300 hover:text-white focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <button
              onClick={() => onSelectCategory('All')}
              className="flex items-baseline space-x-2 text-left group"
            >
              <span className="font-serif text-2xl sm:text-3xl font-semibold tracking-wider text-white group-hover:text-amber-200 transition-colors">
                ATELIER
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded border border-amber-400/20">
                HAUTE
              </span>
            </button>
          </div>

          {/* Desktop Categories */}
          <nav className="hidden lg:flex items-center space-x-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => onSelectCategory(cat)}
                className={`px-3.5 py-2 text-xs uppercase tracking-widest font-medium transition-all rounded-full ${
                  activeCategory === cat
                    ? 'bg-amber-400 text-stone-950 font-bold shadow-md shadow-amber-400/20'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search Bar Input */}
            <div className="relative hidden md:block w-48 lg:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Search collection..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-stone-800/80 text-stone-100 text-xs rounded-full pl-9 pr-8 py-2 border border-stone-700/80 focus:border-amber-400 focus:outline-none focus:ring-1 focus:ring-amber-400 transition-all placeholder:text-stone-500"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white text-xs"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Java Architecture Inspector Quick Link */}
            <button
              onClick={onOpenJavaInspector}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded-full text-xs font-mono font-medium transition-colors"
              title="View Java REST API & Entity Architecture Code"
            >
              <Code2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Java REST API</span>
            </button>

            {/* Admin Panel Button */}
            <button
              onClick={onOpenAdmin}
              className="flex items-center space-x-1 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 rounded-full text-xs font-medium transition-colors"
              title="Admin Product & Image URL Management"
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Admin</span>
            </button>

            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              className="relative p-2 text-stone-300 hover:text-amber-300 transition-colors"
              title="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-0 right-0 transform translate-x-1 -translate-y-1 bg-amber-500 text-stone-950 font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Drawer Trigger */}
            <button
              onClick={onOpenCart}
              className="relative flex items-center space-x-2 px-3 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-full text-xs transition-all shadow-md shadow-amber-400/10"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden xs:inline">Bag</span>
              {cartCount > 0 && (
                <span className="bg-stone-950 text-amber-400 font-extrabold text-[10px] px-1.5 py-0.5 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Profile / Auth */}
            <div className="relative">
              {user ? (
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none p-1 rounded-full border border-amber-400/40 hover:border-amber-400"
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      className="w-7 h-7 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-amber-400 text-stone-950 font-bold text-xs flex items-center justify-center">
                      {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                </button>
              ) : (
                <button
                  onClick={onOpenAuth}
                  className="p-2 text-stone-300 hover:text-white rounded-full hover:bg-stone-800 transition-colors"
                  title="Sign In / Register"
                >
                  <User className="w-5 h-5" />
                </button>
              )}

              {/* User Dropdown */}
              {userDropdownOpen && user && (
                <div className="absolute right-0 mt-2 w-56 bg-stone-900 border border-stone-800 rounded-xl shadow-2xl py-2 z-50 text-xs">
                  <div className="px-4 py-2 border-b border-stone-800">
                    <p className="font-semibold text-stone-100 truncate">{user.displayName || 'Fashion Shopper'}</p>
                    <p className="text-stone-400 truncate text-[11px]">{user.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onOpenAdmin();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-stone-800 text-stone-200 flex items-center space-x-2"
                  >
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    <span>Admin Dashboard</span>
                  </button>
                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      onSignOut();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-stone-800 text-rose-400 flex items-center space-x-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-stone-900 border-b border-stone-800 px-4 py-4 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search fashion..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-stone-800 text-stone-100 text-xs rounded-xl pl-9 pr-8 py-2.5 border border-stone-700 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  onSelectCategory(cat);
                  setMobileMenuOpen(false);
                }}
                className={`px-3 py-1.5 text-xs rounded-full uppercase tracking-wider font-medium ${
                  activeCategory === cat ? 'bg-amber-400 text-stone-950 font-bold' : 'bg-stone-800 text-stone-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-stone-800 flex justify-between">
            <button
              onClick={() => {
                onOpenJavaInspector();
                setMobileMenuOpen(false);
              }}
              className="text-amber-400 text-xs flex items-center space-x-1"
            >
              <Code2 className="w-4 h-4" />
              <span>Java Spring API Code</span>
            </button>
            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="text-stone-200 text-xs flex items-center space-x-1"
            >
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Admin Panel</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
