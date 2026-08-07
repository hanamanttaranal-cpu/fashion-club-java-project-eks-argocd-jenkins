import React, { useState } from 'react';
import { Plus, Trash2, Edit3, Image as ImageIcon, Sparkles, Check, X, Shield, RefreshCw, AlertCircle, Eye, Tag, Layers, Package, ShoppingBag } from 'lucide-react';
import { Product, Order } from '../types';

interface AdminPanelProps {
  products: Product[];
  orders: Order[];
  onAddProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  onUpdateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  onDeleteProduct: (id: string) => Promise<void>;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => Promise<void>;
  onSeedDefaults: () => Promise<void>;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  products,
  orders,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onSeedDefaults,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'products' | 'add-product' | 'orders'>('products');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Add Product Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [category, setCategory] = useState('Outerwear');
  const [imageUrls, setImageUrls] = useState<string[]>(['https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1000']);
  const [sizes, setSizes] = useState<string[]>(['S', 'M', 'L']);
  const [colors, setColors] = useState<string>('Camel, Oatmeal, Black');
  const [stockCount, setStockCount] = useState('15');
  const [featured, setFeatured] = useState(true);

  // Image URL Input Helper
  const [newImageUrl, setNewImageUrl] = useState('');

  const handleAddImageUrl = () => {
    if (newImageUrl.trim()) {
      setImageUrls([...imageUrls, newImageUrl.trim()]);
      setNewImageUrl('');
    }
  };

  const handleRemoveImageUrl = (index: number) => {
    if (imageUrls.length > 1) {
      setImageUrls(imageUrls.filter((_, i) => i !== index));
    } else {
      setMessage({ type: 'error', text: 'At least one image URL is required for the product.' });
    }
  };

  const handleToggleSize = (size: string) => {
    if (sizes.includes(size)) {
      setSizes(sizes.filter((s) => s !== size));
    } else {
      setSizes([...sizes, size]);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setOriginalPrice('');
    setCategory('Outerwear');
    setImageUrls(['https://images.unsplash.com/photo-1539533018447-63fcce2678e3?q=80&w=1000']);
    setSizes(['S', 'M', 'L']);
    setColors('Camel, Oatmeal, Black');
    setStockCount('15');
    setFeatured(false);
    setEditingProduct(null);
  };

  const handleSubmitProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || imageUrls.length === 0) {
      setMessage({ type: 'error', text: 'Please complete required fields (Title, Price, and at least 1 Image URL).' });
      return;
    }

    setLoading(true);
    try {
      const productPayload: Omit<Product, 'id'> = {
        name,
        description,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
        category,
        images: imageUrls.filter((url) => url.trim().length > 0),
        sizes: sizes.length > 0 ? sizes : ['One Size'],
        colors: colors.split(',').map((c) => c.trim()).filter((c) => c.length > 0),
        inStock: parseInt(stockCount) > 0,
        stockCount: parseInt(stockCount) || 0,
        featured,
        rating: 5.0,
        reviewCount: 0,
      };

      if (editingProduct) {
        await onUpdateProduct(editingProduct.id, productPayload);
        setMessage({ type: 'success', text: `Product "${name}" updated successfully!` });
      } else {
        await onAddProduct(productPayload);
        setMessage({ type: 'success', text: `New Fashion Product "${name}" added to catalog!` });
      }

      resetForm();
      setActiveTab('products');
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to save product.' });
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (prod: Product) => {
    setEditingProduct(prod);
    setName(prod.name);
    setDescription(prod.description);
    setPrice(prod.price.toString());
    setOriginalPrice(prod.originalPrice ? prod.originalPrice.toString() : '');
    setCategory(prod.category);
    setImageUrls(prod.images && prod.images.length > 0 ? prod.images : ['']);
    setSizes(prod.sizes || []);
    setColors(prod.colors ? prod.colors.join(', ') : '');
    setStockCount(prod.stockCount.toString());
    setFeatured(prod.featured);
    setActiveTab('add-product');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-stone-100">
        
        {/* Header */}
        <div className="bg-stone-950 px-6 py-5 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-amber-400/10 text-amber-400 rounded-xl border border-amber-400/20">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h2 className="font-serif text-xl font-bold text-white tracking-wide">
                Atelier Fashion Admin Panel
              </h2>
              <p className="text-xs text-stone-400">
                Product Catalog, Image URL Manager & Order Processing (Firestore & Java Backend Model)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-white rounded-full hover:bg-stone-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-800 bg-stone-950/60 px-6 pt-2 space-x-4">
          <button
            onClick={() => {
              setActiveTab('products');
              resetForm();
            }}
            className={`flex items-center space-x-2 py-3 px-4 font-medium text-xs uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === 'products'
                ? 'border-amber-400 text-amber-400 bg-stone-900/50'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Product Catalog ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('add-product')}
            className={`flex items-center space-x-2 py-3 px-4 font-medium text-xs uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === 'add-product'
                ? 'border-amber-400 text-amber-400 bg-stone-900/50'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>{editingProduct ? 'Edit Product' : 'Add New Product & Image URLs'}</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`flex items-center space-x-2 py-3 px-4 font-medium text-xs uppercase tracking-wider border-b-2 transition-colors ${
              activeTab === 'orders'
                ? 'border-amber-400 text-amber-400 bg-stone-900/50'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Customer Orders ({orders.length})</span>
          </button>
        </div>

        {/* Alert Notifications */}
        {message && (
          <div
            className={`mx-6 mt-4 p-3 rounded-xl flex items-center justify-between text-xs font-medium ${
              message.type === 'success'
                ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/30'
                : 'bg-rose-500/10 text-rose-300 border border-rose-500/30'
            }`}
          >
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{message.text}</span>
            </div>
            <button onClick={() => setMessage(null)} className="text-stone-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* TAB 1: PRODUCT LIST */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-white">Live Store Catalog</h3>
                  <p className="text-xs text-stone-400">View and edit prices, image URLs, stock, and featured items.</p>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={onSeedDefaults}
                    className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-medium flex items-center space-x-2 border border-stone-700 transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                    <span>Reset / Seed Sample Catalog</span>
                  </button>

                  <button
                    onClick={() => {
                      resetForm();
                      setActiveTab('add-product');
                    }}
                    className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl text-xs flex items-center space-x-2 transition-all shadow-lg shadow-amber-400/10"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Product</span>
                  </button>
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-stone-950 rounded-2xl border border-stone-800 overflow-hidden">
                <table className="w-full text-left text-xs text-stone-300">
                  <thead className="bg-stone-900 text-stone-400 uppercase tracking-wider font-mono text-[10px] border-b border-stone-800">
                    <tr>
                      <th className="px-4 py-3.5">Image</th>
                      <th className="px-4 py-3.5">Product Name</th>
                      <th className="px-4 py-3.5">Category</th>
                      <th className="px-4 py-3.5">Price</th>
                      <th className="px-4 py-3.5">Stock</th>
                      <th className="px-4 py-3.5">Featured</th>
                      <th className="px-4 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-800/80">
                    {products.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-4 py-12 text-center text-stone-500 font-mono">
                          No products found in database. Click "Reset / Seed Sample Catalog" above to initialize products.
                        </td>
                      </tr>
                    ) : (
                      products.map((prod) => (
                        <tr key={prod.id} className="hover:bg-stone-900/60 transition-colors">
                          <td className="px-4 py-3">
                            <div className="w-12 h-14 rounded-lg bg-stone-800 overflow-hidden border border-stone-700 relative">
                              <img
                                src={prod.images && prod.images[0] ? prod.images[0] : 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=200'}
                                alt={prod.name}
                                className="w-full h-full object-cover"
                              />
                              {prod.images && prod.images.length > 1 && (
                                <span className="absolute bottom-0 right-0 bg-stone-950/80 text-[9px] text-amber-300 px-1 font-mono">
                                  +{prod.images.length - 1}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 font-medium text-white">
                            <div>{prod.name}</div>
                            <div className="text-[10px] text-stone-500 font-mono mt-0.5">
                              ID: {prod.id.slice(0, 8)}... • {prod.sizes?.join(', ')}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-stone-800 text-stone-300 border border-stone-700">
                              {prod.category}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-semibold text-amber-300 font-mono">
                            ${prod.price.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 font-mono">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] ${
                                prod.stockCount > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                              }`}
                            >
                              {prod.stockCount > 0 ? `${prod.stockCount} in stock` : 'Out of Stock'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              onClick={() => onUpdateProduct(prod.id, { featured: !prod.featured })}
                              className={`p-1.5 rounded-lg border transition-colors ${
                                prod.featured
                                  ? 'bg-amber-400/10 text-amber-400 border-amber-400/30'
                                  : 'bg-stone-800 text-stone-500 border-stone-700'
                              }`}
                              title="Toggle Featured on Homepage"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                            </button>
                          </td>
                          <td className="px-4 py-3 text-right space-x-2">
                            <button
                              onClick={() => handleStartEdit(prod)}
                              className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg border border-stone-700 transition-colors"
                              title="Edit Product Details & Image URLs"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete "${prod.name}"?`)) {
                                  onDeleteProduct(prod.id);
                                }
                              }}
                              className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg border border-rose-500/30 transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: ADD / EDIT PRODUCT WITH IMAGE URLS */}
          {activeTab === 'add-product' && (
            <form onSubmit={handleSubmitProduct} className="space-y-6 max-w-3xl mx-auto">
              <div className="flex items-center justify-between pb-4 border-b border-stone-800">
                <h3 className="font-semibold text-lg text-white">
                  {editingProduct ? 'Edit Fashion Item' : 'Add New Fashion Item'}
                </h3>
                <span className="text-xs text-amber-400 font-mono bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/20">
                  Image URL Manager Enabled
                </span>
              </div>

              {/* Basic Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Oversized Linen Trench Coat"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-sm text-stone-100 focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                    Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-sm text-stone-100 focus:outline-none focus:border-amber-400"
                  >
                    <option value="Outerwear">Outerwear</option>
                    <option value="Dresses">Dresses</option>
                    <option value="Tops">Tops</option>
                    <option value="Bottoms">Bottoms</option>
                    <option value="Shoes">Shoes</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="189.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-sm text-stone-100 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                    Original / Strikethrough Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="220.00"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-sm text-stone-100 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="15"
                    value={stockCount}
                    onChange={(e) => setStockCount(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-sm text-stone-100 focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              {/* DEDICATED IMAGE URL MANAGER SECTION */}
              <div className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ImageIcon className="w-5 h-5 text-amber-400" />
                    <h4 className="font-semibold text-sm text-white">Product Image URLs Manager</h4>
                  </div>
                  <span className="text-[11px] text-stone-400">
                    Add direct HTTP/HTTPS web image URLs (Unsplash, CDN, etc.)
                  </span>
                </div>

                {/* List of current image URLs with live thumbnails */}
                <div className="space-y-3">
                  {imageUrls.map((url, idx) => (
                    <div key={idx} className="flex items-center gap-3 bg-stone-900 p-2.5 rounded-xl border border-stone-800">
                      {/* Image Thumbnail Preview */}
                      <div className="w-12 h-14 bg-stone-950 rounded-lg overflow-hidden border border-stone-700 flex-shrink-0">
                        {url ? (
                          <img
                            src={url}
                            alt={`Preview ${idx + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-stone-600">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                        )}
                      </div>

                      {/* URL Edit Input */}
                      <div className="flex-1">
                        <label className="block text-[10px] font-mono text-stone-400 uppercase mb-0.5">
                          Image URL #{idx + 1} {idx === 0 ? '(Primary Main Display)' : ''}
                        </label>
                        <input
                          type="url"
                          required
                          value={url}
                          onChange={(e) => {
                            const updated = [...imageUrls];
                            updated[idx] = e.target.value;
                            setImageUrls(updated);
                          }}
                          placeholder="https://images.unsplash.com/photo-..."
                          className="w-full bg-stone-950 border border-stone-800 rounded-lg px-3 py-1.5 text-xs text-stone-200 font-mono focus:outline-none focus:border-amber-400"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveImageUrl(idx)}
                        className="p-2 text-stone-400 hover:text-rose-400 rounded-lg hover:bg-stone-800 transition-colors"
                        title="Remove image URL"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Add new Image URL row */}
                <div className="pt-2 flex gap-2">
                  <input
                    type="url"
                    placeholder="Paste additional image URL (e.g. https://...)"
                    value={newImageUrl}
                    onChange={(e) => setNewImageUrl(e.target.value)}
                    className="flex-1 bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 font-mono focus:outline-none focus:border-amber-400"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-amber-300 font-medium text-xs rounded-xl border border-stone-700 flex items-center space-x-1.5 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add URL</span>
                  </button>
                </div>
              </div>

              {/* Sizes & Colors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-2">
                    Available Sizes
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['XS', 'S', 'M', 'L', 'XL', 'XXL', 'One Size', '36', '37', '38', '39', '40'].map((sz) => (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => handleToggleSize(sz)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition-colors ${
                          sizes.includes(sz)
                            ? 'bg-amber-400 text-stone-950 font-bold border-amber-400'
                            : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                    Color Variants (comma-separated)
                  </label>
                  <input
                    type="text"
                    placeholder="Camel, Oatmeal, Midnight Black"
                    value={colors}
                    onChange={(e) => setColors(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-sm text-stone-100 focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 uppercase tracking-wider mb-1">
                  Product Description & Craft Details
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe material composition, fit advice, and styling notes..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-sm text-stone-100 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Featured checkbox */}
              <div className="flex items-center space-x-3 bg-stone-950 p-4 rounded-xl border border-stone-800">
                <input
                  type="checkbox"
                  id="featured-check"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="w-4 h-4 text-amber-400 rounded focus:ring-amber-400 bg-stone-900 border-stone-700"
                />
                <label htmlFor="featured-check" className="text-xs text-stone-200 font-medium cursor-pointer">
                  Feature this item on the main store hero spotlight & collection carousel
                </label>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end space-x-4 pt-4 border-t border-stone-800">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setActiveTab('products');
                  }}
                  className="px-6 py-2.5 text-xs text-stone-400 hover:text-stone-200 font-medium transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded-xl text-xs uppercase tracking-widest shadow-lg shadow-amber-400/10 transition-all"
                >
                  {loading ? 'Saving...' : editingProduct ? 'Update Product' : 'Save Product with Images'}
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: CUSTOMER ORDERS */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg text-white">Customer Orders</h3>
                <p className="text-xs text-stone-400">Track and update order fulfillment statuses saved in Firestore.</p>
              </div>

              {orders.length === 0 ? (
                <div className="bg-stone-950 p-12 rounded-2xl border border-stone-800 text-center text-stone-500 font-mono text-xs">
                  No customer orders have been placed yet. Place a test order through the shopping cart!
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div key={ord.id} className="bg-stone-950 p-5 rounded-2xl border border-stone-800 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800/80 pb-3">
                        <div>
                          <div className="flex items-center space-x-3">
                            <span className="font-mono text-xs text-amber-400 font-semibold">
                              Order #{ord.id.slice(0, 10)}
                            </span>
                            <span className="text-[11px] text-stone-400 font-mono">
                              {ord.createdAt?.toDate ? ord.createdAt.toDate().toLocaleString() : 'Recent'}
                            </span>
                          </div>
                          <div className="text-xs text-stone-300 mt-1">
                            Customer: <strong className="text-white">{ord.shippingAddress?.fullName || ord.userName}</strong> ({ord.userEmail})
                          </div>
                        </div>

                        {/* Order status dropdown */}
                        <div className="flex items-center space-x-2">
                          <label className="text-xs text-stone-400 font-mono">Status:</label>
                          <select
                            value={ord.status}
                            onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as Order['status'])}
                            className="bg-stone-900 border border-stone-700 text-stone-100 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-amber-400 font-mono"
                          >
                            <option value="Pending">Pending</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>

                      {/* Items List */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {ord.items?.map((item, i) => (
                          <div key={i} className="flex items-center space-x-3 bg-stone-900 p-2.5 rounded-xl border border-stone-800">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-10 h-12 rounded object-cover bg-stone-950 flex-shrink-0"
                            />
                            <div className="text-xs">
                              <p className="font-medium text-stone-200 truncate">{item.name}</p>
                              <p className="text-[11px] text-stone-400">
                                Size: {item.size} • Color: {item.color} • Qty: {item.quantity}
                              </p>
                              <p className="text-amber-300 font-mono font-semibold text-[11px]">
                                ${(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Total */}
                      <div className="flex justify-between items-center pt-2 text-xs border-t border-stone-800/80">
                        <span className="text-stone-400">
                          Ship to: {ord.shippingAddress?.street}, {ord.shippingAddress?.city}, {ord.shippingAddress?.zipCode}
                        </span>
                        <span className="text-sm font-bold text-white font-mono">
                          Total: <span className="text-amber-400">${ord.totalAmount?.toFixed(2)}</span>
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
