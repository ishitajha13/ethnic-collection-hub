import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import AppFooter from '../../components/AppFooter';
import ProductCard from '../../components/ProductCard';
import { StoreService } from '../../services/storeService';
import { Award, Sparkles, ArrowRight } from 'lucide-react';

export default function FeaturedCollectionsPage() {
  const allProducts = StoreService.getProducts();
  const featured = allProducts.filter((p) => p.isFeatured);

  return (
    <div className="hub-site-wrapper">
      <Navbar />

      <section className="featured-hero-section">
        <div className="site-container text-center">
          <div className="badge-luxury-pill mx-auto">
            <Award size={14} className="pill-sparkle" />
            <span>Master Artisan Masterpieces</span>
          </div>
          <h1 className="page-hero-title">Featured Royal Collections</h1>
          <p className="page-hero-subtitle">
            Heirloom Kadhwa brocades, gold electroplated temple borders, and zardozi bridal trousseaus.
          </p>
        </div>
      </section>

      <section className="featured-grid-section">
        <div className="site-container">
          <div className="collection-count-strip">
            <span>Showing {featured.length} curated collector pieces</span>
            <span className="gold-text-hint">Artisan Silk Mark & GI Verified</span>
          </div>

          <div className="products-showcase-grid">
            {featured.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </section>

      <AppFooter />
    </div>
  );
}
