import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Package,
  Store,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  CreditCard,
  Star,
  ChevronRight,
  SlidersHorizontal,
  Layers,
  Award
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import AppFooter from '../../components/AppFooter';
import ProductCard from '../../components/ProductCard';
import Logo from '../../components/Logo';
import { CATEGORIES } from '../../data/mockCatalog';
import { StoreService } from '../../services/storeService';
import heroImg from '../../assets/hero.png';

export default function HomePage() {
  const navigate = useNavigate();
  const allProducts = StoreService.getProducts();
  const featuredProducts = allProducts.filter((p) => p.isFeatured).slice(0, 4);
  const newArrivals = allProducts.filter((p) => p.isNewArrival).slice(0, 4);

  return (
    <div className="hub-site-wrapper">
      <Navbar />

      {/* 1. Hero Showcase */}
      <section className="home-hero-section">
        <div className="hero-backdrop-glow"></div>
        <div className="site-container hero-container">
          <div className="hero-content-col">
            <div className="badge-luxury-pill">
              <Sparkles size={14} className="pill-sparkle" />
              <span>India's Premier Integrated Ethnic Marketplace</span>
            </div>

            <h1 className="hero-headline">
              Haute Couture Silks &<br />
              <span className="gold-shimmer-text">Artisan Handlooms</span>
            </h1>

            <p className="hero-tagline-lead">
              “Your Fashion. Your Business. One Marketplace.”
            </p>

            <p className="hero-description">
              Connecting heritage weaving clusters directly with Wholesalers, Retailers and Couture Shoppers. Authentic Varanasi Brocades, Kanjeevaram Silks, and Royal Bridal Lehengas.
            </p>

            <div className="hero-action-buttons">
              <Link to="/shop" className="btn-gold-action hero-btn">
                <span>Shop Couture (B2C)</span>
                <ArrowRight size={17} />
              </Link>
              <Link to="/wholesaler/bulk-pricing" className="btn-primary-navy hero-btn">
                <span>Wholesale MOQ 12 Sets</span>
              </Link>
              <Link to="/retailer/catalogue" className="btn-outline-gold hero-btn">
                <span>Retailer Resale Hub</span>
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="hero-metrics-bar">
              <div className="metric-box">
                <span className="metric-num">50,000+</span>
                <span className="metric-lbl">Curated Designs</span>
              </div>
              <div className="metric-sep">|</div>
              <div className="metric-box">
                <span className="metric-num">12 Sets</span>
                <span className="metric-lbl">Wholesale MOQ</span>
              </div>
              <div className="metric-sep">|</div>
              <div className="metric-box">
                <span className="metric-num">5 Days</span>
                <span className="metric-lbl">Strict Damage Window</span>
              </div>
              <div className="metric-sep">|</div>
              <div className="metric-box">
                <span className="metric-num">100% UPI</span>
                <span className="metric-lbl">Zero Cash on Delivery</span>
              </div>
            </div>
          </div>

          <div className="hero-image-col">
            <div className="hero-frame-wrapper">
              <div className="hero-decorative-border"></div>
              <img
                src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80"
                alt="Royal Varanasi Silk Saree"
                className="hero-main-banner-img"
              />
              <div className="hero-floating-card top-float">
                <Award size={20} className="text-gold" />
                <div>
                  <strong>Silk Mark Certified</strong>
                  <span>Pure 100% Mulberry Weft</span>
                </div>
              </div>
              <div className="hero-floating-card bottom-float">
                <ShieldCheck size={20} className="text-gold" />
                <div>
                  <strong>Verified B2B Gateway</strong>
                  <span>Factory Direct Pricing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Three Marketplace Channels (Wholesaler, Retailer, Buyer) */}
      <section className="home-channels-section">
        <div className="site-container">
          <div className="section-title-wrap text-center">
            <span className="sub-title-accent">One Unified Marketplace</span>
            <h2 className="section-main-heading">Tailored Solutions for Every Fashion Entity</h2>
            <div className="golden-divider">
              <span className="gold-ornament-line"></span>
              <span className="gold-ornament-gem">✦</span>
              <span className="gold-ornament-line"></span>
            </div>
          </div>

          <div className="channels-grid">
            {/* Channel A: Wholesaler */}
            <div className="channel-tier-card wholesaler-card">
              <div className="channel-icon-circle">
                <Package size={30} />
              </div>
              <span className="channel-badge">B2B Bulk Sourcing</span>
              <h3 className="channel-title">Wholesaler</h3>
              <p className="channel-desc">
                Direct factory procurement for bulk textile syndicates, export houses, and master stockists.
              </p>
              <div className="channel-rule-highlight">
                <strong>Mandatory Business Rule:</strong>
                <span>Minimum Order Quantity of <strong>12 clothing sets</strong> enforced across carts and orders.</span>
              </div>
              <ul className="channel-perks-list">
                <li>✓ Tiered Pricing Slabs: 12, 24, 36+ sets</li>
                <li>✓ Commercial Bale & Pallet Freight Dispatch</li>
                <li>✓ Downloadable Tax & Export Invoices</li>
              </ul>
              <Link to="/wholesaler/catalogue" className="btn-primary-navy block-btn mt-4">
                Access Wholesale Portal
              </Link>
            </div>

            {/* Channel B: Retailer */}
            <div className="channel-tier-card retailer-card">
              <div className="channel-icon-circle">
                <Store size={30} />
              </div>
              <span className="channel-badge">B2B Resale & Boutique</span>
              <h3 className="channel-title">Retailer</h3>
              <p className="channel-desc">
                Stock replenishment for independent boutiques, multi-brand outlets, and regional bridal salons.
              </p>
              <div className="channel-rule-highlight">
                <strong>Retailer Margin Advantage:</strong>
                <span>Enjoy exclusive trade rates yielding up to <strong>35-45% resale gross margins</strong>.</span>
              </div>
              <ul className="channel-perks-list">
                <li>✓ Low Pack Sizes (from 2 sets)</li>
                <li>✓ Official GST Invoices with Input Credit</li>
                <li>✓ Real-time Consignment Logistics Tracking</li>
              </ul>
              <Link to="/retailer/catalogue" className="btn-gold-action block-btn mt-4">
                Access Retailer Portal
              </Link>
            </div>

            {/* Channel C: Buyer */}
            <div className="channel-tier-card buyer-card">
              <div className="channel-icon-circle">
                <ShoppingBag size={30} />
              </div>
              <span className="channel-badge">B2C Luxury Shopper</span>
              <h3 className="channel-title">Buyer</h3>
              <p className="channel-desc">
                Personal shopping for weddings, festive ceremonies, and individual haute ethnic couture.
              </p>
              <div className="channel-rule-highlight">
                <strong>Curated Luxury Experience:</strong>
                <span>Direct artisan silk pieces with verified Silk Mark authentication and door delivery.</span>
              </div>
              <ul className="channel-perks-list">
                <li>✓ Individual Piece Ordering</li>
                <li>✓ Online UPI & Doorstep UPI on Delivery</li>
                <li>✓ Strict 5-Day Damage Return Protection</li>
              </ul>
              <Link to="/shop" className="btn-outline-navy block-btn mt-4">
                Explore Buyer Boutique
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 12 Ethnic Categories Visual Showcase */}
      <section className="home-categories-section">
        <div className="site-container">
          <div className="section-title-wrap text-center">
            <span className="sub-title-accent">Curated Weaves</span>
            <h2 className="section-main-heading">Explore 12 Ethnic Categories</h2>
            <p className="section-lead-text">
              Handcrafted silhouettes spanning sarees, lehengas, kurtis, and men's ceremonial couture.
            </p>
          </div>

          <div className="categories-mosaic-grid">
            {CATEGORIES.map((cat) => (
              <Link to={`/shop?cat=${cat.slug}`} key={cat.id} className="category-tile-card">
                <img src={cat.image} alt={cat.name} className="cat-tile-bg" loading="lazy" />
                <div className="cat-tile-overlay">
                  <span className="cat-item-count">{cat.itemCount} Designs</span>
                  <h3 className="cat-tile-name">{cat.name}</h3>
                  <span className="cat-tile-explore">Explore Collection →</span>
                </div>
              </Link>
            ))}
          </div>

          <div className="text-center mt-6">
            <Link to="/categories" className="btn-primary-navy">
              View All 12 Categories Directory
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Featured Collections & New Arrivals */}
      <section className="home-products-section">
        <div className="site-container">
          <div className="section-title-wrap">
            <span className="sub-title-accent">Artisan Showcases</span>
            <h2 className="section-main-heading">Featured Handcrafted Silks</h2>
          </div>

          <div className="products-showcase-grid">
            {featuredProducts.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>

          {/* New Arrivals Banner */}
          <div className="festive-promo-banner mt-8">
            <div className="promo-banner-content">
              <span className="promo-tag">New Seasonal Launches</span>
              <h3>Royal Bridal & Festive Trousseau Edit</h3>
              <p>Zardozi hand-embroidery, pure gold electroplated brocades, and featherlight organza dupattas.</p>
              <Link to="/new-arrivals" className="btn-gold-action">
                Browse New Arrivals
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Wholesaler Bulk Pricing Slabs Highlight */}
      <section className="home-slabs-section">
        <div className="site-container">
          <div className="slabs-card-box">
            <div className="slabs-text-col">
              <span className="gold-sub-label">Volume Advantage</span>
              <h2>Wholesaler Bulk Pricing Slabs Matrix</h2>
              <p>
                In strict adherence to our commercial model, wholesale accounts require a minimum order quantity of <strong>12 clothing sets</strong>. Procure higher volumes to unlock automated slab price breaks.
              </p>
              <div className="slabs-table-preview">
                <div className="slab-row">
                  <span className="slab-tier">Tier 1: 12 – 23 Sets</span>
                  <span className="slab-benefit">Base Wholesale Factory Price</span>
                </div>
                <div className="slab-row">
                  <span className="slab-tier">Tier 2: 24 – 35 Sets</span>
                  <span className="slab-benefit">Extra 5% Volume Rebate</span>
                </div>
                <div className="slab-row highlighted-slab">
                  <span className="slab-tier">Tier 3: 36+ Sets</span>
                  <span className="slab-benefit">Extra 10% Super-Bulk Rebate</span>
                </div>
              </div>
              <div className="mt-4">
                <Link to="/wholesaler/bulk-pricing" className="btn-gold-action">
                  View Complete Category-Wise Slabs
                </Link>
              </div>
            </div>

            <div className="slabs-visual-col">
              <div className="slabs-info-graphic">
                <Package size={52} className="text-gold" />
                <h3>Strict MOQ: 12 Sets</h3>
                <p>1 Set = 4 to 10 Assorted Colors & Sizes</p>
                <div className="moq-badge-visual">System Enforced at Checkout</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Strict Return Policy & UPI-Only Trust Section */}
      <section className="home-policies-trust-section">
        <div className="site-container">
          <div className="policies-dual-grid">
            {/* Box 1: 5-Day Return Policy */}
            <div className="policy-feature-card">
              <div className="card-top-icon">
                <RotateCcw size={28} className="text-gold" />
              </div>
              <h3>Strict 5-Day Damage Return Policy</h3>
              <p>
                To maintain wholesale factory rates and prevent fraudulent usage, returns are accepted <strong>EXCLUSIVELY FOR DAMAGED CLOTHING</strong> reported within 5 calendar days of recorded delivery.
              </p>
              <div className="policy-points-mini">
                <span>✓ Clear damage photographs mandatory</span>
                <span>✓ Reviewed by Quality Inspectors within 24h</span>
                <span>✗ Change of mind / size selection rejected</span>
              </div>
              <Link to="/contact" className="policy-learn-more">
                Read Detailed Return Policy →
              </Link>
            </div>

            {/* Box 2: UPI-Only Payment */}
            <div className="policy-feature-card">
              <div className="card-top-icon">
                <CreditCard size={28} className="text-gold" />
              </div>
              <h3>100% Digital UPI • No Cash on Delivery</h3>
              <p>
                ETHNIC COLLECTION HUB operates on an entirely cashless infrastructure for supreme transaction integrity and immediate reconciliation.
              </p>
              <div className="policy-points-mini">
                <span>✓ Instant Online UPI (GPay, PhonePe, Paytm, BHIM)</span>
                <span>✓ Dynamic UPI QR on Delivery at Doorstep</span>
                <span className="no-cod-cross">✕ Cash on Delivery strictly prohibited</span>
              </div>
              <Link to="/contact" className="policy-learn-more">
                View Accepted Payment Options →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <AppFooter />
    </div>
  );
}
