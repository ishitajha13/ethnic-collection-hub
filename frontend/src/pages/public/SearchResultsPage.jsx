import React, { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import AppFooter from '../../components/AppFooter';
import ProductCard from '../../components/ProductCard';
import { StoreService } from '../../services/storeService';
import { Search, SlidersHorizontal, AlertCircle } from 'lucide-react';

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [inputQuery, setInputQuery] = useState(query);

  const allProducts = StoreService.getProducts();

  const matchingProducts = allProducts.filter((p) => {
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.categoryName.toLowerCase().includes(q) ||
      p.fabric.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q)
    );
  });

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (inputQuery.trim()) {
      setSearchParams({ q: inputQuery.trim() });
    }
  };

  return (
    <div className="hub-site-wrapper">
      <Navbar />

      <section className="search-header-section">
        <div className="site-container">
          <div className="search-header-box">
            <h1 className="search-results-title">
              {query ? `Search Results for "${query}"` : 'Browse Marketplace Catalog'}
            </h1>
            <p className="search-meta-text">
              Found {matchingProducts.length} matching ethnic garments across all 12 categories.
            </p>

            <form onSubmit={handleSearchSubmit} className="search-page-bar">
              <input
                type="text"
                value={inputQuery}
                onChange={(e) => setInputQuery(e.target.value)}
                placeholder="Search by weave, fabric, saree, lehenga, kurti..."
                className="search-page-input"
              />
              <button type="submit" className="btn-primary-navy">
                <Search size={18} />
                <span>Search</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="search-results-grid-section">
        <div className="site-container">
          {matchingProducts.length > 0 ? (
            <div className="products-showcase-grid">
              {matchingProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          ) : (
            <div className="search-no-results-card">
              <AlertCircle size={44} className="text-gold" />
              <h3>No Ethnic Designs Match "{query}"</h3>
              <p>Try searching for broader keywords like "Silk", "Saree", "Bridal", "Brocade", or "Kurti".</p>
              <div className="suggested-searches mt-4">
                <span>Popular searches:</span>
                <Link to="/search?q=Saree" className="search-tag-chip">Saree</Link>
                <Link to="/search?q=Lehenga" className="search-tag-chip">Lehenga</Link>
                <Link to="/search?q=Chikankari" className="search-tag-chip">Chikankari</Link>
                <Link to="/search?q=Banarasi" className="search-tag-chip">Banarasi</Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <AppFooter />
    </div>
  );
}
