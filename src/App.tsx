import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
  getDocs,
} from 'firebase/firestore';
import { auth, db } from './lib/firebase';
import { Product, CartItem, Order, Review, UserProfile, ShippingAddress } from './types';
import { SAMPLE_PRODUCTS } from './data/sampleProducts';

// Components
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ProductCatalog } from './components/ProductCatalog';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { AdminPanel } from './components/AdminPanel';
import { JavaBackendInspector } from './components/JavaBackendInspector';
import { EnvStoreInspector } from './components/EnvStoreInspector';
import { FashionShowSection } from './components/FashionShowSection';
import { AuthModal } from './components/AuthModal';

export default function App() {
  // Auth state
  const [user, setUser] = useState<UserProfile | null>(null);

  // Firestore Collections State
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  // UI Navigation & Filters
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Cart & Wishlist
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('atelier_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('atelier_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals state
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [checkoutDiscount, setCheckoutDiscount] = useState(0);
  const [adminOpen, setAdminOpen] = useState(false);
  const [javaInspectorOpen, setJavaInspectorOpen] = useState(false);
  const [envStoreOpen, setEnvStoreOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);

  // Sync Cart to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('atelier_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cartItems]);

  // Sync Wishlist to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('atelier_wishlist', JSON.stringify(wishlistIds));
    } catch (e) {
      console.error('Failed to save wishlist to localStorage', e);
    }
  }, [wishlistIds]);

  // Listen to Firebase Auth
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          isAdmin: true, // Enable admin management features
        });
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Listen to Firestore Products
  useEffect(() => {
    const productsRef = collection(db, 'products');
    const unsubscribe = onSnapshot(
      productsRef,
      (snapshot) => {
        if (snapshot.empty) {
          // If Firestore collection is empty, seed default sample catalog!
          seedDefaultProducts();
        } else {
          const prodsList: Product[] = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<Product, 'id'>),
          }));
          setProducts(prodsList);
        }
      },
      (error) => {
        console.error('Firestore products subscription error:', error);
      }
    );
    return () => unsubscribe();
  }, []);

  // Listen to Firestore Orders
  useEffect(() => {
    const ordersRef = collection(db, 'orders');
    const unsubscribe = onSnapshot(
      ordersRef,
      (snapshot) => {
        const orderList: Order[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<Order, 'id'>),
        }));
        setOrders(orderList);
      },
      (error) => {
        console.error('Firestore orders subscription error:', error);
      }
    );
    return () => unsubscribe();
  }, []);

  // Listen to Firestore Reviews
  useEffect(() => {
    const reviewsRef = collection(db, 'reviews');
    const unsubscribe = onSnapshot(
      reviewsRef,
      (snapshot) => {
        const revList: Review[] = snapshot.docs.map((docSnap) => ({
          id: docSnap.id,
          ...(docSnap.data() as Omit<Review, 'id'>),
        }));
        setReviews(revList);
      },
      (error) => {
        console.error('Firestore reviews subscription error:', error);
      }
    );
    return () => unsubscribe();
  }, []);

  // Seed default products
  const seedDefaultProducts = async () => {
    try {
      const productsRef = collection(db, 'products');
      const existing = await getDocs(productsRef);
      if (existing.empty) {
        for (const item of SAMPLE_PRODUCTS) {
          await addDoc(productsRef, {
            ...item,
            createdAt: serverTimestamp(),
          });
        }
      }
    } catch (err) {
      console.error('Error seeding products:', err);
    }
  };

  // Add product from Admin
  const handleAddProduct = async (productData: Omit<Product, 'id'>) => {
    try {
      const productsRef = collection(db, 'products');
      const docRef = await addDoc(productsRef, {
        ...productData,
        createdAt: serverTimestamp(),
      });
      const newProd: Product = { id: docRef.id, ...productData };
      setProducts((prev) => [newProd, ...prev]);
    } catch (err) {
      console.error('Error saving product to Firestore:', err);
      // Local fallback
      const localId = `local-${Date.now()}`;
      const newProd: Product = { id: localId, ...productData };
      setProducts((prev) => [newProd, ...prev]);
    }
  };

  // Update product from Admin
  const handleUpdateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      const prodDocRef = doc(db, 'products', id);
      await updateDoc(prodDocRef, productData);
    } catch (err) {
      console.error('Error updating product in Firestore:', err);
    }
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...productData } : p))
    );
    if (selectedProduct && selectedProduct.id === id) {
      setSelectedProduct((prev) => (prev ? { ...prev, ...productData } : null));
    }
  };

  // Delete product from Admin
  const handleDeleteProduct = async (id: string) => {
    try {
      const prodDocRef = doc(db, 'products', id);
      await deleteDoc(prodDocRef);
    } catch (err) {
      console.error('Error deleting product from Firestore:', err);
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
    if (selectedProduct?.id === id) {
      setSelectedProduct(null);
    }
  };

  // Update order status from Admin
  const handleUpdateOrderStatus = async (orderId: string, status: Order['status']) => {
    const orderDocRef = doc(db, 'orders', orderId);
    await updateDoc(orderDocRef, { status });
  };

  // Add product to cart
  const handleAddToCart = (product: Product, size: string, color: string, quantity: number) => {
    setCartItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === size && item.selectedColor === color
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }
      return [...prev, { product, selectedSize: size, selectedColor: color, quantity }];
    });
  };

  // Cart quantity adjustment
  const handleUpdateCartQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      handleRemoveCartItem(index);
      return;
    }
    setCartItems((prev) => {
      const updated = [...prev];
      updated[index].quantity = newQty;
      return updated;
    });
  };

  // Remove cart item
  const handleRemoveCartItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Wishlist toggle
  const handleToggleWishlist = (product: Product) => {
    setWishlistIds((prev) =>
      prev.includes(product.id) ? prev.filter((id) => id !== product.id) : [...prev, product.id]
    );
  };

  // Place Order into Firestore
  const handlePlaceOrder = async (address: ShippingAddress, totalAmount: number): Promise<Order | null> => {
    try {
      const ordersRef = collection(db, 'orders');
      const orderItems = cartItems.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        size: item.selectedSize,
        color: item.selectedColor,
        image: item.product.images?.[0] || '',
      }));

      const newOrderData = {
        userId: user?.uid || 'guest-user',
        userEmail: address.email,
        userName: address.fullName,
        items: orderItems,
        totalAmount,
        shippingAddress: address,
        status: 'Pending' as const,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(ordersRef, newOrderData);
      
      // Clear cart
      setCartItems([]);

      return {
        id: docRef.id,
        ...newOrderData,
      };
    } catch (err) {
      console.error('Error saving order to Firestore:', err);
      return null;
    }
  };

  // Add review to Firestore
  const handleAddReview = async (reviewData: Omit<Review, 'id' | 'createdAt'>) => {
    const reviewsRef = collection(db, 'reviews');
    await addDoc(reviewsRef, {
      ...reviewData,
      createdAt: serverTimestamp(),
    });
  };

  // Search filtering
  const displayProducts = products.filter((p) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-amber-400 selection:text-stone-950">
      
      {/* Navigation Header */}
      <Navbar
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => setCartOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
        user={user}
        onOpenAuth={() => setAuthOpen(true)}
        onSignOut={() => signOut(auth)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        wishlistCount={wishlistIds.length}
        onOpenWishlist={() => {
          if (wishlistIds.length > 0) {
            alert(`You have ${wishlistIds.length} fashion items saved in your Wishlist!`);
          } else {
            alert('Your Wishlist is empty. Click the heart icon on any product card to save items.');
          }
        }}
      />

      {/* Main Content */}
      <main className="flex-1">
        
        {/* Editorial Hero Banner */}
        <HeroBanner
          onExplore={() => {
            const el = document.getElementById('catalog-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onWatchFashionShow={() => {
            const el = document.getElementById('fashion-show-section');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          onOpenAdmin={() => setAdminOpen(true)}
        />

        {/* Live Runway Fashion Show 2026 Showcase */}
        <div id="fashion-show-section">
          <FashionShowSection
            products={products}
            onSelectProduct={setSelectedProduct}
            onAddToCart={handleAddToCart}
          />
        </div>

        {/* Product Catalog Grid */}
        <div id="catalog-section">
          <ProductCatalog
            products={displayProducts}
            activeCategory={activeCategory}
            onSelectCategory={setActiveCategory}
            onSelectProduct={setSelectedProduct}
            onAddToCart={handleAddToCart}
            onToggleWishlist={handleToggleWishlist}
            wishlistIds={wishlistIds}
          />
        </div>

      </main>

      {/* Environment Variables Store Inspector Modal Overlay */}
      {envStoreOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-lg overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto relative bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6 border-b border-stone-800 pb-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-emerald-400">Environment & DevOps Store Inspector</h2>
                <p className="text-stone-400 text-xs font-mono">Live configuration state, MySQL credentials, & EKS manifests</p>
              </div>
              <button
                onClick={() => setEnvStoreOpen(false)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-full text-xs font-bold border border-stone-700"
              >
                Close Inspector ✕
              </button>
            </div>
            <EnvStoreInspector />
          </div>
        </div>
      )}

      {/* Java Spring Boot REST Architecture Inspector Modal Overlay */}
      {javaInspectorOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/90 backdrop-blur-lg overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto relative bg-stone-900 border border-stone-800 rounded-3xl shadow-2xl p-6 sm:p-8">
            <div className="flex justify-between items-center mb-6 border-b border-stone-800 pb-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-amber-400">Java Spring Boot 21 REST API Specs</h2>
                <p className="text-stone-400 text-xs font-mono">Controllers, JPA Entities, MySQL Drivers, & Endpoint Test Runner</p>
              </div>
              <button
                onClick={() => setJavaInspectorOpen(false)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-full text-xs font-bold border border-stone-700"
              >
                Close Spec ✕
              </button>
            </div>
            <JavaBackendInspector products={products} />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-stone-900 border-t border-stone-800 text-stone-400 py-12 px-4 sm:px-6 lg:px-8 mt-16 text-xs font-mono">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="space-y-3">
            <span className="font-serif text-2xl font-bold tracking-wider text-white">ATELIER</span>
            <p className="text-stone-400 font-sans text-xs leading-relaxed">
              High fashion e-commerce storefront with custom image URL product management, Firebase Firestore integration, and Java Spring Boot REST API architectural specs.
            </p>
          </div>

          <div>
            <h4 className="text-white uppercase font-bold mb-3 tracking-wider text-[11px]">Collections</h4>
            <ul className="space-y-2">
              {['Outerwear', 'Dresses', 'Tops', 'Bottoms', 'Shoes', 'Accessories'].map((cat) => (
                <li key={cat}>
                  <button onClick={() => setActiveCategory(cat)} className="hover:text-amber-400 transition-colors">
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white uppercase font-bold mb-3 tracking-wider text-[11px]">Technology Stack</h4>
            <ul className="space-y-2 text-[11px]">
              <li>React 19 + TypeScript + Vite</li>
              <li>Tailwind CSS v4 Utilities</li>
              <li>Firebase Firestore & Auth</li>
              <li>Java 21 Spring Boot REST API</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white uppercase font-bold mb-3 tracking-wider text-[11px]">Admin & Environment Store</h4>
            <div className="space-y-2">
              <button
                onClick={() => setEnvStoreOpen(!envStoreOpen)}
                className="w-full py-2 bg-stone-800 hover:bg-stone-700 text-emerald-300 rounded-xl border border-stone-700 font-bold"
              >
                {envStoreOpen ? 'Hide Env Store' : 'Inspect Env Store Values'}
              </button>

              <button
                onClick={() => setAdminOpen(true)}
                className="w-full py-2 bg-stone-800 hover:bg-stone-700 text-amber-400 rounded-xl border border-stone-700 font-bold"
              >
                Admin Image URL Manager
              </button>

              <button
                onClick={() => setJavaInspectorOpen(!javaInspectorOpen)}
                className="w-full py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl border border-stone-700 text-xs"
              >
                {javaInspectorOpen ? 'Hide Java API Spec' : 'Inspect Java Spring Code'}
              </button>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-stone-800 flex flex-col sm:flex-row justify-between items-center text-[10px] text-stone-500">
          <p>© 2026 Atelier Haute Couture E-Commerce. All rights reserved.</p>
          <p className="mt-2 sm:mt-0">Powered by Google AI Studio Build</p>
        </div>
      </footer>

      {/* MODALS & DRAWERS */}
      
      {/* Product Detail Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          reviews={reviews.filter((r) => r.productId === selectedProduct.id)}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onToggleWishlist={handleToggleWishlist}
          isWishlisted={wishlistIds.includes(selectedProduct.id)}
          onAddReview={handleAddReview}
          userName={user?.displayName || 'Fashion Shopper'}
          userId={user?.uid || 'guest'}
        />
      )}

      {/* Cart Slide-Over Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onProceedToCheckout={(discountPercent) => {
          setCheckoutDiscount(discountPercent);
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={cartItems}
        discountPercent={checkoutDiscount}
        onPlaceOrder={handlePlaceOrder}
        userEmail={user?.email || ''}
        userName={user?.displayName || ''}
      />

      {/* Admin Panel */}
      {adminOpen && (
        <AdminPanel
          products={products}
          orders={orders}
          onAddProduct={handleAddProduct}
          onUpdateProduct={handleUpdateProduct}
          onDeleteProduct={handleDeleteProduct}
          onUpdateOrderStatus={handleUpdateOrderStatus}
          onSeedDefaults={seedDefaultProducts}
          onClose={() => setAdminOpen(false)}
        />
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onCustomLogin={(loggedInUser) => {
          setUser(loggedInUser);
        }}
      />

    </div>
  );
}
