import React, { useState } from 'react';
import { Filter, Star, Heart, ShoppingBag, Eye, Sparkles, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { Product } from '../types';

interface ProductCatalogProps {
  products: Product[];
  activeCategory: string;
  onSelectCategory: (category: string) => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: string, quantity: number) => void;
  onToggleWishlist: (product: Product) => void;
  wishlistIds: string[];
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({
  products,
  activeCategory,
  onSelectCategory,
  onSelectProduct,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
}) => {
  const [maxPrice, setMaxPrice] = useState<number>(350);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);

  // Filter products by category & price
  let filtered = products.filter((p) => {
    const matchesCategory =
      activeCategory === 'All' || p.category.toLowerCase() === activeCategory.toLowerCase();
    const matchesPrice = p.price <= maxPrice;
    return matchesCategory && matchesPrice;
  });

  // Sort products
  if (sortBy === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (sortBy === 'featured') {
    filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Filter and Sorting Controls Bar */}
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Left: Category summary */}
        <div>
          <h2 className="font-serif text-xl text-white font-medium flex items-center space-x-2">
            <span>{activeCategory === 'All' ? 'Complete Haute Couture Collection' : activeCategory}</span>
            <span className="text-xs font-mono text-stone-400 bg-stone-800 px-2 py-0.5 rounded-full border border-stone-700">
              {filtered.length} items
            </span>
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Crafted with premium materials, available for express worldwide delivery.
          </p>
        </div>

        {/* Right Controls: Price Slider + Sort Selector */}
        <div className="flex flex-wrap items-center gap-4 text-xs">
          
          {/* Price Range Slider */}
          <div className="flex items-center space-x-3 bg-stone-950 px-3 py-2 rounded-xl border border-stone-800">
            <SlidersHorizontal className="w-4 h-4 text-amber-400" />
            <span className="text-stone-300 font-mono">Max Price: ${maxPrice}</span>
            <input
              type="range"
              min="30"
              max="400"
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-24 accent-amber-400 cursor-pointer"
            />
          </div>

          {/* Sort Selector */}
          <div className="flex items-center space-x-2 bg-stone-950 px-3 py-2 rounded-xl border border-stone-800">
            <ArrowUpDown className="w-4 h-4 text-amber-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-stone-200 focus:outline-none font-mono text-xs cursor-pointer"
            >
              <option value="featured" className="bg-stone-900 text-stone-200">Featured First</option>
              <option value="price-asc" className="bg-stone-900 text-stone-200">Price: Low to High</option>
              <option value="price-desc" className="bg-stone-900 text-stone-200">Price: High to Low</option>
              <option value="rating" className="bg-stone-900 text-stone-200">Highest Rated</option>
            </select>
          </div>

        </div>
      </div>

      {/* Product Grid */}
      {filtered.length === 0 ? (
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-16 text-center space-y-3">
          <p className="text-stone-300 font-serif text-lg">No fashion items match your filter criteria.</p>
          <p className="text-xs text-stone-500 font-mono">Try increasing the max price or selecting another category.</p>
          <button
            onClick={() => {
              onSelectCategory('All');
              setMaxPrice(400);
            }}
            className="mt-2 px-4 py-2 bg-amber-400 text-stone-950 font-bold text-xs rounded-full uppercase tracking-widest"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {filtered.map((product) => {
            const isWishlisted = wishlistIds.includes(product.id);
            const mainImage = product.images?.[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800';
            const hoverImage = product.images?.[1] || mainImage;

            return (
              <div
                key={product.id}
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
                className="group bg-stone-900 rounded-3xl border border-stone-800/80 overflow-hidden flex flex-col hover:border-stone-700 transition-all duration-300 hover:shadow-2xl hover:shadow-stone-950/80"
              >
                {/* Image Container */}
                <div
                  onClick={() => onSelectProduct(product)}
                  className="relative aspect-[3/4] bg-stone-950 overflow-hidden cursor-pointer"
                >
                  <img
                    src={hoveredProduct === product.id ? hoverImage : mainImage}
                    alt={product.name}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
                  />

                  {/* Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
                    {product.featured && (
                      <span className="px-2.5 py-1 bg-amber-400 text-stone-950 text-[10px] font-bold uppercase tracking-wider rounded-full shadow-md">
                        Featured
                      </span>
                    )}
                    {product.originalPrice && (
                      <span className="px-2.5 py-1 bg-rose-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-full shadow-md">
                        Sale
                      </span>
                    )}
                  </div>

                  {/* Wishlist Quick Toggle */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(product);
                    }}
                    className="absolute top-3 right-3 p-2.5 rounded-full bg-stone-950/60 backdrop-blur-md text-stone-200 border border-stone-800 hover:text-rose-400 transition-colors z-10"
                    title="Add to Wishlist"
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                  </button>

                  {/* Quick Action Overlay on Hover */}
                  <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProduct(product);
                      }}
                      className="flex-1 py-2.5 bg-stone-900/90 hover:bg-stone-950 text-white text-xs font-medium rounded-xl border border-stone-700 backdrop-blur-md flex items-center justify-center space-x-1.5 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View Details</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(
                          product,
                          product.sizes?.[0] || 'M',
                          product.colors?.[0] || 'Default',
                          1
                        );
                      }}
                      className="p-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-xl transition-all shadow-lg"
                      title="Quick Add to Bag"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-mono text-stone-400 mb-1">
                      <span>{product.category}</span>
                      <div className="flex items-center space-x-1 text-amber-400">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{product.rating}</span>
                      </div>
                    </div>

                    <h3
                      onClick={() => onSelectProduct(product)}
                      className="font-serif text-base text-stone-100 group-hover:text-amber-200 transition-colors line-clamp-1 cursor-pointer"
                    >
                      {product.name}
                    </h3>
                  </div>

                  <div className="flex items-baseline justify-between pt-2 border-t border-stone-800/80">
                    <div className="flex items-baseline space-x-2">
                      <span className="font-mono text-base font-bold text-amber-300">
                        ${product.price.toFixed(2)}
                      </span>
                      {product.originalPrice && (
                        <span className="font-mono text-xs text-stone-500 line-through">
                          ${product.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] font-mono text-stone-400">
                      {product.sizes?.slice(0, 3).join('/')}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
