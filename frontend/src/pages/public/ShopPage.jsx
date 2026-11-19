import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import AppFooter from '../../components/AppFooter';
import ProductCard from '../../components/ProductCard';
import { StoreService } from '../../services/storeService';
import { CATEGORIES } from '../../data/mockCatalog';
import { Filter, SlidersHorizontal, X, Search, Check } from 'lucide-react';
import { getCurrentSession } from '../../services/authService';

export default function ShopPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const session = getCurrentSession();
  const role = session?.accountType || 'Buyer';

  const initialCat = searchParams.get('cat') || 'all';
  const initialQuery = searchParams.get('q') || '';

  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedFabric, setSelectedFabric] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [priceMax, setPriceMax] = useState(30000);
  const [sortBy, setSortBy] = useState('featured');
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const itemsPerPage = 8;
  const products = StoreService.getProducts();

  // Extract unique fabrics and sizes
  const fabrics = useMemo(() => {
    const set = new Set();
    products.forEach((p) => p.fabric && set.add(p.fabric));
    return Array.from(set);
  }, [products]);

  const sizes = ['S', 'M', 'L', 'XL', 'XXL', 'Free Size', 'Unstitched'];

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      // Fabric filter
      if (selectedFabric !== 'all' && !p.fabric.toLowerCase().includes(selectedFabric.toLowerCase())) {
        return false;
      }
      // Size filter
      if (selectedSize !== 'all' && !p.sizes.some((s) => s.toLowerCase().includes(selectedSize.toLowerCase()))) {
        return false;
      }
      // Price filter (based on retail or role price)
      const priceToCheck = role === 'Wholesaler' ? p.wholesalePricePerPiece : p.retailPrice;
      if (priceToCheck > priceMax) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesSku = p.sku.toLowerCase().includes(q);
        const matchesCat = p.categoryName.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesSku && !matchesCat) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') {
        const priceA = role === 'Wholesaler' ? a.wholesalePricePerPiece : a.retailPrice;
        const priceB = role === 'Wholesaler' ? b.wholesalePricePerPiece : b.retailPrice;
        return priceA - priceB;
      }
      if (sortBy === 'price-high') {
        const priceA = role === 'Wholesaler' ? a.wholesalePricePerPiece : a.retailPrice;
        const priceB = role === 'Wholesaler' ? b.wholesalePricePerPiece : b.retailPrice;
        return priceB - priceA;
      }
      if (sortBy === 'rating') {
        return b.rating - a.rating;
      }
      if (sortBy === 'newest') {
        return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      }
      return 0; // featured default
    });
  }, [products, selectedCategory, selectedFabric, selectedSize, priceMax, searchQuery, sortBy, role]);

  // Pagination slice
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const handleCategoryChange = (catSlug) => {
    setSelectedCategory(catSlug);
    setCurrentPage(1);
    if (catSlug === 'all') {
      searchParams.delete('cat');
    } else {
      searchParams.set('cat', catSlug);
    }
    setSearchParams(searchParams);
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedFabric('all');
    setSelectedSize('all');
    setPriceMax(30000);
    setSearchQuery('');
    setSortBy('featured');
    setCurrentPage(1);
    setSearchParams({});
  };

  return (
    <div className="hub-site-wrapper">
      <Navbar />

      {/* Hero Strip */}
      <section className="shop-header-strip">
        <div className="site-container">
          <div className="shop-header-flex">
            <div>
              <h1 className="shop-main-title">
                {selectedCategory !== 'all'
                  ? CATEGORIES.find((c) => c.slug === selectedCategory)?.name || 'Ethnic Wear'
                  : 'Shop All Ethnic Collections'}
              </h1>
              <p className="shop-meta-subtitle">
                Showing {filteredProducts.length} haute couture designs • Role Pricing: <strong>{role}</strong>
                {role === 'Wholesaler' && ' (Strict Min 12 Sets per order)'}
              </p>
            </div>

            <div className="shop-controls-top">
              {/* Sort selector */}
              <div className="sort-dropdown-wrap">
                <label htmlFor="sort-select" className="sort-label">Sort by:</label>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select-control"
                >
                  <option value="featured">Featured Curations</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                  <option value="newest">New Arrivals</option>
                </select>
              </div>

              {/* Mobile filter toggle */}
              <button
                type="button"
                className="mobile-filter-trigger-btn"
                onClick={() => setMobileFilterOpen(true)}
              >
                <Filter size={16} />
                <span>Filters ({selectedCategory !== 'all' ? 1 : 0})</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Shop Layout: Sidebar + Grid */}
      <section className="shop-main-section">
        <div className="site-container">
          <div className="shop-layout-grid">
            {/* Desktop Filters Sidebar */}
            <aside className={`shop-sidebar-filters ${mobileFilterOpen ? 'mobile-visible' : ''}`}>
              <div className="sidebar-filter-header">
                <div className="filter-title-box">
                  <SlidersHorizontal size={18} className="text-gold" />
                  <h3>Refine Selection</h3>
                </div>
                <div className="filter-header-actions">
                  <button type="button" className="btn-reset-filters" onClick={handleResetFilters}>
                    Reset All
                  </button>
                  <button
                    type="button"
                    className="close-mobile-filters"
                    onClick={() => setMobileFilterOpen(false)}
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Category Filter */}
              <div className="filter-widget-group">
                <h4 className="widget-title">Categories (12)</h4>
                <div className="category-filter-list">
                  <button
                    type="button"
                    className={`cat-filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
                    onClick={() => handleCategoryChange('all')}
                  >
                    <span>All Collections</span>
                    <span className="count-pill">{products.length}</span>
                  </button>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      className={`cat-filter-btn ${selectedCategory === cat.slug ? 'active' : ''}`}
                      onClick={() => handleCategoryChange(cat.slug)}
                    >
                      <span>{cat.name}</span>
                      <span className="count-pill">{cat.itemCount}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Filter */}
              <div className="filter-widget-group">
                <div className="widget-title-row">
                  <h4 className="widget-title">Max Price</h4>
                  <span className="price-val-tag">₹{priceMax.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="35000"
                  step="500"
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="price-slider-input"
                />
                <div className="slider-labels-row">
                  <span>₹1,000</span>
                  <span>₹35,000</span>
                </div>
              </div>

              {/* Fabric Filter */}
              <div className="filter-widget-group">
                <h4 className="widget-title">Handloom Fabric</h4>
                <div className="fabric-chips-grid">
                  <button
                    type="button"
                    className={`chip-filter-btn ${selectedFabric === 'all' ? 'active' : ''}`}
                    onClick={() => setSelectedFabric('all')}
                  >
                    All Fabrics
                  </button>
                  {fabrics.map((fab, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`chip-filter-btn ${selectedFabric === fab ? 'active' : ''}`}
                      onClick={() => setSelectedFabric(fab)}
                    >
                      {fab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Filter */}
              <div className="filter-widget-group">
                <h4 className="widget-title">Available Sizes</h4>
                <div className="size-chips-grid">
                  <button
                    type="button"
                    className={`size-chip-btn ${selectedSize === 'all' ? 'active' : ''}`}
                    onClick={() => setSelectedSize('all')}
                  >
                    Any
                  </button>
                  {sizes.map((sz, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`size-chip-btn ${selectedSize === sz ? 'active' : ''}`}
                      onClick={() => setSelectedSize(sz)}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Policy Reminder */}
              <div className="filter-policy-box">
                <strong>Return Eligibility:</strong>
                <p>Strictly for transit/manufacturing damage reported within 5 days of delivery with photo proof.</p>
              </div>
            </aside>

            {/* Products Grid Column */}
            <main className="shop-products-column">
              {/* Active Filter Pills Bar */}
              {(selectedCategory !== 'all' || selectedFabric !== 'all' || selectedSize !== 'all' || searchQuery) && (
                <div className="active-filters-chips-bar">
                  <span className="active-label">Active:</span>
                  {selectedCategory !== 'all' && (
                    <span className="filter-crumb-pill">
                      Category: {selectedCategory}
                      <X size={12} onClick={() => handleCategoryChange('all')} />
                    </span>
                  )}
                  {selectedFabric !== 'all' && (
                    <span className="filter-crumb-pill">
                      Fabric: {selectedFabric}
                      <X size={12} onClick={() => setSelectedFabric('all')} />
                    </span>
                  )}
                  {selectedSize !== 'all' && (
                    <span className="filter-crumb-pill">
                      Size: {selectedSize}
                      <X size={12} onClick={() => setSelectedSize('all')} />
                    </span>
                  )}
                  {searchQuery && (
                    <span className="filter-crumb-pill">
                      Query: "{searchQuery}"
                      <X size={12} onClick={() => setSearchQuery('')} />
                    </span>
                  )}
                  <button type="button" className="clear-all-text-btn" onClick={handleResetFilters}>
                    Clear
                  </button>
                </div>
              )}

              {/* Product Cards */}
              {paginatedProducts.length > 0 ? (
                <div className="shop-products-grid">
                  {paginatedProducts.map((prod) => (
                    <ProductCard key={prod.id} product={prod} />
                  ))}
                </div>
              ) : (
                <div className="shop-empty-state-box">
                  <Search size={44} className="empty-search-icon" />
                  <h3>No Ethnic Designs Match Your Criteria</h3>
                  <p>Try clearing filters or broadening your search terms.</p>
                  <button type="button" className="btn-primary-navy mt-4" onClick={handleResetFilters}>
                    Show All Collections
                  </button>
                </div>
              )}

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="shop-pagination-wrap">
                  <button
                    type="button"
                    className="pagination-arrow-btn"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </button>

                  <div className="pagination-pages-list">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        className={`page-num-btn ${currentPage === i + 1 ? 'active' : ''}`}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="pagination-arrow-btn"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Next
                  </button>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>

      <AppFooter />
    </div>
  );
}
