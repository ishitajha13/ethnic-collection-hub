import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import AppFooter from '../../components/AppFooter';
import { CATEGORIES } from '../../data/mockCatalog';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function CategoriesPage() {
  return (
    <div className="hub-site-wrapper">
      <Navbar />

      <section className="categories-hero-banner">
        <div className="site-container text-center">
          <div className="badge-luxury-pill mx-auto">
            <Sparkles size={14} className="pill-sparkle" />
            <span>Master Artisan Catalog</span>
          </div>
          <h1 className="page-hero-title">12 Ethnic Fashion Categories</h1>
          <p className="page-hero-subtitle">
            From regal handloom sarees to bridal lehengas and men's ceremonial attire.
          </p>
        </div>
      </section>

      <section className="categories-list-section">
        <div className="site-container">
          <div className="categories-directory-grid">
            {CATEGORIES.map((cat, idx) => (
              <div key={cat.id} className="category-full-card">
                <div className="cat-card-media">
                  <img src={cat.image} alt={cat.name} className="cat-card-img" loading="lazy" />
                  <span className="cat-card-index">0{idx + 1}</span>
                </div>
                <div className="cat-card-body">
                  <span className="cat-card-count">{cat.itemCount} Curated Pieces</span>
                  <h2 className="cat-card-heading">{cat.name}</h2>
                  <p className="cat-card-description">{cat.description}</p>
                  <Link to={`/shop?cat=${cat.slug}`} className="cat-card-cta">
                    <span>Explore {cat.name}</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <AppFooter />
    </div>
  );
}
