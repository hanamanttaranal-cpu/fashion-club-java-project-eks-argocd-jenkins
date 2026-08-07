import { Product } from '../types';

export const SAMPLE_PRODUCTS: Omit<Product, 'id'>[] = [
  {
    name: 'Oversized Double-Breasted Wool Coat',
    description: 'Crafted from a premium wool blend, this structured trench coat features tailored lapels, tortoise buttons, and an elegant long silhouette. Perfect for transitional weather layering.',
    price: 245.00,
    originalPrice: 295.00,
    category: 'Outerwear',
    images: [
      'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Camel', 'Oatmeal', 'Midnight Black'],
    inStock: true,
    stockCount: 18,
    featured: true,
    rating: 4.9,
    reviewCount: 38
  },
  {
    name: 'Silk Blend Satin Wrap Dress',
    description: 'A luxurious liquid satin wrap dress designed with subtle bishop sleeves, a waist tie accent, and a flowing asymmetrical hemline.',
    price: 168.00,
    originalPrice: 198.00,
    category: 'Dresses',
    images: [
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Emerald Green', 'Champagne', 'Black'],
    inStock: true,
    stockCount: 24,
    featured: true,
    rating: 4.8,
    reviewCount: 52
  },
  {
    name: 'Minimalist Relaxed Fit Blazer',
    description: 'Structured yet lightweight, this tailored blazer elevates casual denim or tailored trousers with ease. Fully lined with internal pockets.',
    price: 145.00,
    originalPrice: 175.00,
    category: 'Outerwear',
    images: [
      'https://images.unsplash.com/photo-1584273143981-41c073dfe8f8?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Ivory', 'Sage Green', 'Charcoal'],
    inStock: true,
    stockCount: 15,
    featured: true,
    rating: 4.7,
    reviewCount: 29
  },
  {
    name: 'Ribbed Knit Cotton Crewneck Sweater',
    description: 'Ultra-soft organic cotton sweater featuring micro-ribbed textures, dropped shoulders, and relaxed sleeves for effortless everyday chic.',
    price: 88.00,
    originalPrice: 110.00,
    category: 'Tops',
    images: [
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Cream', 'Soft Clay', 'Navy'],
    inStock: true,
    stockCount: 30,
    featured: false,
    rating: 4.6,
    reviewCount: 44
  },
  {
    name: 'High-Waisted Tailored Pleated Trousers',
    description: 'Designed with deep front pleats, hidden hook closures, and a fluid straight-leg silhouette that pairs beautifully with crop tops or blazers.',
    price: 120.00,
    originalPrice: 140.00,
    category: 'Bottoms',
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Sand', 'Mocha', 'Black'],
    inStock: true,
    stockCount: 20,
    featured: true,
    rating: 4.9,
    reviewCount: 61
  },
  {
    name: 'Handcrafted Italian Leather Chelsea Boots',
    description: 'Sleek leather ankle boots built with elastic side gussets, stacked wooden heel, and cushioned memory foam footbeds for all-day elegance.',
    price: 210.00,
    originalPrice: 250.00,
    category: 'Shoes',
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1608256246200-53e635b5b65f?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['36', '37', '38', '39', '40', '41'],
    colors: ['Tan Leather', 'Polished Black'],
    inStock: true,
    stockCount: 12,
    featured: true,
    rating: 4.9,
    reviewCount: 78
  },
  {
    name: 'Sculptural Gold Plated Hoop Earrings',
    description: 'Lightweight 18k gold vermeil hoops featuring a modern organic molten curve. Hypoallergenic posts.',
    price: 48.00,
    originalPrice: 60.00,
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1630019852942-f89202989a59?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['One Size'],
    colors: ['18K Gold', 'Silver'],
    inStock: true,
    stockCount: 45,
    featured: false,
    rating: 4.8,
    reviewCount: 33
  },
  {
    name: 'Structured Pebble Leather Shoulder Bag',
    description: 'Timeless shoulder handbag crafted from full-grain leather, featuring gold-tone hardware, suede interior lining, and magnetic snap closure.',
    price: 185.00,
    originalPrice: 220.00,
    category: 'Accessories',
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?q=80&w=1000&auto=format&fit=crop'
    ],
    sizes: ['One Size'],
    colors: ['Cognac', 'Burgundy', 'Black'],
    inStock: true,
    stockCount: 16,
    featured: true,
    rating: 5.0,
    reviewCount: 41
  }
];
