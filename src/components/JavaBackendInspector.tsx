import React, { useState } from 'react';
import { Code, Terminal, Server, Check, Copy, Play, Cpu, Database, ShieldCheck, ExternalLink, Layers } from 'lucide-react';
import { Product } from '../types';

interface JavaBackendInspectorProps {
  products: Product[];
}

export const JavaBackendInspector: React.FC<JavaBackendInspectorProps> = ({ products }) => {
  const [activeTab, setActiveTab] = useState<'controller' | 'entity' | 'service' | 'repository' | 'security' | 'api-playground'>('controller');
  const [copied, setCopied] = useState(false);
  const [simulatedResponse, setSimulatedResponse] = useState<string | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('GET /api/v1/products');

  const javaCodeSnippets = {
    controller: `package com.fashionstore.controller;

import com.fashionstore.entity.Product;
import com.fashionstore.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/products")
@CrossOrigin(origins = "*") // Allows React frontend requests
public class ProductController {

    private final ProductService productService;

    @Autowired
    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // GET /api/v1/products - Fetch all active products
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Boolean featured) {
        if (category != null) {
            return ResponseEntity.ok(productService.getProductsByCategory(category));
        }
        if (featured != null && featured) {
            return ResponseEntity.ok(productService.getFeaturedProducts());
        }
        return ResponseEntity.ok(productService.getAllProducts());
    }

    // GET /api/v1/products/{id} - Get single product
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable String id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST /api/v1/products - Admin add new product with image URLs
    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        // Validate image URLs list
        if (product.getImages() == null || product.getImages().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        Product savedProduct = productService.saveProduct(product);
        return new ResponseEntity<>(savedProduct, HttpStatus.CREATED);
    }

    // PUT /api/v1/products/{id} - Admin update product details & image URLs
    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(
            @PathVariable String id, 
            @RequestBody Product productDetails) {
        return ResponseEntity.ok(productService.updateProduct(id, productDetails));
    }

    // DELETE /api/v1/products/{id} - Admin remove product
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable String id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}`,

    entity: `package com.fashionstore.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "products")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(precision = 10, scale = 2)
    private BigDecimal originalPrice;

    @Column(nullable = false, length = 50)
    private String category;

    // Image URLs list stored in child collection table
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url", length = 1000)
    @Builder.Default
    private List<String> images = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "product_sizes", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "size_name")
    @Builder.Default
    private List<String> sizes = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "product_colors", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "color_name")
    @Builder.Default
    private List<String> colors = new ArrayList<>();

    @Column(nullable = false)
    private boolean inStock = true;

    @Column(nullable = false)
    private Integer stockCount = 0;

    @Column(nullable = false)
    private boolean featured = false;

    private Double rating = 5.0;

    private Integer reviewCount = 0;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}`,

    service: `package com.fashionstore.service;

import com.fashionstore.entity.Product;
import com.fashionstore.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProductService {

    private final ProductRepository productRepository;

    @Autowired
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategoryIgnoreCase(category);
    }

    public List<Product> getFeaturedProducts() {
        return productRepository.findByFeaturedTrue();
    }

    public Optional<Product> getProductById(String id) {
        return productRepository.findById(id);
    }

    public Product saveProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(String id, Product details) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id));
        
        existing.setName(details.getName());
        existing.setDescription(details.getDescription());
        existing.setPrice(details.getPrice());
        existing.setOriginalPrice(details.getOriginalPrice());
        existing.setCategory(details.getCategory());
        existing.setImages(details.getImages()); // Updates image URLs
        existing.setSizes(details.getSizes());
        existing.setColors(details.getColors());
        existing.setInStock(details.isInStock());
        existing.setStockCount(details.getStockCount());
        existing.setFeatured(details.isFeatured());

        return productRepository.save(existing);
    }

    public void deleteProduct(String id) {
        productRepository.deleteById(id);
    }
}`,

    repository: `package com.fashionstore.repository;

import com.fashionstore.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, String> {

    List<Product> findByCategoryIgnoreCase(String category);

    List<Product> findByFeaturedTrue();

    List<Product> findByNameContainingIgnoreCase(String keyword);

    @Query("SELECT p FROM Product p WHERE p.price BETWEEN :minPrice AND :maxPrice")
    List<Product> findProductsByPriceRange(@Param("minPrice") Double minPrice, @Param("maxPrice") Double maxPrice);
}`,

    security: `package com.fashionstore.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configure(http))
            .authorizeHttpRequests(auth -> auth
                // Public endpoints for customers
                .requestMatchers(HttpMethod.GET, "/api/v1/products/**").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/v1/orders/**").permitAll()
                // Admin secured endpoints
                .requestMatchers(HttpMethod.POST, "/api/v1/products/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/v1/products/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/v1/products/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            );
        return http.build();
    }
}`
  };

  const handleCopyCode = () => {
    if (activeTab !== 'api-playground') {
      navigator.clipboard.writeText(javaCodeSnippets[activeTab]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const runSimulatedRequest = () => {
    setIsRequesting(true);
    setTimeout(() => {
      let data: any = {};
      if (selectedEndpoint === 'GET /api/v1/products') {
        data = {
          status: 200,
          message: 'OK',
          timestamp: new Date().toISOString(),
          count: products.length,
          data: products.map(p => ({
            id: p.id,
            name: p.name,
            category: p.category,
            price: p.price,
            imagesCount: p.images.length,
            sampleImageUrl: p.images[0] || null,
            inStock: p.inStock
          }))
        };
      } else if (selectedEndpoint === 'GET /api/v1/products/featured') {
        const feat = products.filter(p => p.featured);
        data = {
          status: 200,
          message: 'OK',
          count: feat.length,
          data: feat
        };
      } else if (selectedEndpoint === 'POST /api/v1/products (Admin Add Image URL)') {
        data = {
          status: 201,
          message: 'Created',
          timestamp: new Date().toISOString(),
          data: {
            id: 'prod-java-999',
            name: 'Silk Linen Midi Shirt Dress',
            price: 185.00,
            category: 'Dresses',
            images: [
              'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800'
            ],
            sizes: ['S', 'M', 'L'],
            colors: ['Sage', 'Cream'],
            inStock: true,
            stockCount: 25,
            createdAt: new Date().toISOString()
          }
        };
      }
      setSimulatedResponse(JSON.stringify(data, null, 2));
      setIsRequesting(false);
    }, 400);
  };

  return (
    <div className="bg-slate-900 text-slate-100 rounded-2xl shadow-2xl border border-slate-800 overflow-hidden my-8">
      {/* Header bar */}
      <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2.5 bg-amber-500/10 rounded-xl text-amber-400 border border-amber-500/20">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="font-bold text-lg text-white">Java Spring Boot REST API Architecture</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-400/10 text-amber-400 border border-amber-400/20">
                Java 21 + Spring Boot 3
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Backend Controller, JPA Entity (Image URL collection), Repository, Service & Security Specs
            </p>
          </div>
        </div>

        {activeTab !== 'api-playground' && (
          <button
            onClick={handleCopyCode}
            className="flex items-center space-x-2 px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-700 self-start md:self-auto"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Java Code' : 'Copy Code'}</span>
          </button>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex overflow-x-auto bg-slate-950/60 border-b border-slate-800 scrollbar-none px-4 pt-2">
        <button
          onClick={() => setActiveTab('controller')}
          className={`flex items-center space-x-2 px-4 py-3 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'controller'
              ? 'border-amber-400 text-amber-400 bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Code className="w-4 h-4" />
          <span>ProductController.java</span>
        </button>

        <button
          onClick={() => setActiveTab('entity')}
          className={`flex items-center space-x-2 px-4 py-3 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'entity'
              ? 'border-amber-400 text-amber-400 bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Product.java (JPA Entity)</span>
        </button>

        <button
          onClick={() => setActiveTab('service')}
          className={`flex items-center space-x-2 px-4 py-3 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'service'
              ? 'border-amber-400 text-amber-400 bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>ProductService.java</span>
        </button>

        <button
          onClick={() => setActiveTab('repository')}
          className={`flex items-center space-x-2 px-4 py-3 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'repository'
              ? 'border-amber-400 text-amber-400 bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>ProductRepository.java</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex items-center space-x-2 px-4 py-3 text-xs font-medium border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'security'
              ? 'border-amber-400 text-amber-400 bg-slate-900/60'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>SecurityConfig.java</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('api-playground');
            if (!simulatedResponse) runSimulatedRequest();
          }}
          className={`flex items-center space-x-2 px-4 py-3 text-xs font-semibold border-b-2 whitespace-nowrap transition-colors ${
            activeTab === 'api-playground'
              ? 'border-emerald-400 text-emerald-400 bg-slate-900/60'
              : 'border-transparent text-emerald-400/70 hover:text-emerald-300'
          }`}
        >
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span>Live API Tester Sandbox</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'api-playground' ? (
          <div className="space-y-6">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Simulate Java REST Request
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={selectedEndpoint}
                  onChange={(e) => setSelectedEndpoint(e.target.value)}
                  className="bg-slate-900 border border-slate-700 text-slate-100 text-sm rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-emerald-500 focus:outline-none flex-1 font-mono"
                >
                  <option value="GET /api/v1/products">GET /api/v1/products - Fetch All Fashion Products</option>
                  <option value="GET /api/v1/products/featured">GET /api/v1/products/featured - Filter Featured Collections</option>
                  <option value="POST /api/v1/products (Admin Add Image URL)">POST /api/v1/products - Admin Add Product + Custom Image URLs</option>
                </select>
                <button
                  onClick={runSimulatedRequest}
                  disabled={isRequesting}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-sm rounded-lg flex items-center justify-center space-x-2 transition-all shadow-lg shadow-emerald-950/50"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{isRequesting ? 'Executing Java Request...' : 'Send HTTP Request'}</span>
                </button>
              </div>
            </div>

            {/* Output terminal */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-slate-400">Response Output (JSON)</span>
                <span className="text-xs font-mono text-emerald-400">HTTP 200 OK</span>
              </div>
              <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto max-h-96 leading-relaxed">
                {simulatedResponse || '// Click Send HTTP Request to execute Java REST API call'}
              </pre>
            </div>
          </div>
        ) : (
          <div className="relative">
            <pre className="bg-slate-950 p-5 rounded-xl border border-slate-800 text-xs font-mono text-slate-200 overflow-x-auto max-h-[500px] leading-relaxed">
              <code>{javaCodeSnippets[activeTab]}</code>
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
