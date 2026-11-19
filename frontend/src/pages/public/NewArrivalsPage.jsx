import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import AppFooter from '../../components/AppFooter';
import ProductCard from '../../components/ProductCard';
import { StoreService } from '../../services/storeService';
import { Sparkles, Calendar, ArrowRight } from 'lucide-react';

export default function NewArrivalsPage() {
  const allProducts = StoreService.getProducts();
  const newArrivals = allProducts.filter((p) => p.isNewArrival);

  return (
    <div className="hub-site-wrapper">
      <Navbar />

      <section className="new-arrivals-hero">
        <div className="site-container text-center">
          <div className="badge-luxury-pill mx-auto">
            <Sparkles size={14} className="pill-sparkle" />
            <span>Winter / Festive 2026 Collection</span>
          </div>
          <h1 className="page-hero-title">New Arrivals in Haute Ethnic Couture</h1>
          <p className="page-hero-subtitle">
            Freshly off the looms of Varanasi, Jaipur and Lucknow. Limited artisan production runs.
          </p>
        </div>
      </section>

      <section className="new-arrivals-grid-section">
        <div className="site-container">
          <div className="collection-count-strip">
            <span>Showing {newArrivals.length} freshly debuted designs</span>
            <Link to="/wholesaler/bulk-pricing" className="bulk-link-btn">
              View Wholesale Bulk Sets & Slabs
            </Link>
          </div>

          <div className="products-showcase-grid">
            {newArrivals.map((prod) => (
              <ProductCard key={prod.id} product={prod} />
            ))}
          </div>
        </div>
      </section>

      <AppFooter />
    </div>
  );
}
