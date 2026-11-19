import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import AppFooter from '../../components/AppFooter';
import ProductCard from '../../components/ProductCard';
import { StoreService } from '../../services/storeService';
import { getCurrentSession, ACCOUNT_TYPES } from '../../services/authService';
import {
  Star,
  ShieldCheck,
  RotateCcw,
  ShoppingBag,
  Heart,
  Truck,
  AlertTriangle,
  CheckCircle2,
  Package,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';

export default function ProductDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const session = getCurrentSession();
  const role = session?.accountType || 'Buyer';

  const products = StoreService.getProducts();
  const product = products.find((p) => p.id === id) || products[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  // For wholesaler default to 12 sets, else 1
  const [quantity, setQuantity] = useState(role === ACCOUNT_TYPES.WHOLESALER ? 12 : 1);
  const [activeTab, setActiveTab] = useState('specs'); // 'specs' | 'return-policy' | 'slabs' | 'reviews'
  const [isWishlisted, setIsWishlisted] = useState(() => {
    const list = StoreService.getWishlist(session?.id || 'current');
    return list.includes(product.id);
  });
  const [toastMessage, setToastMessage] = useState('');

  // Wholesaler slab calculations
  const getWholesaleSetPrice = (sets) => {
    let base = product.wholesalePricePerSet;
    if (sets >= 36) return Math.round(base * 0.90);
    if (sets >= 24) return Math.round(base * 0.95);
    return base;
  };

  const currentWholesalePrice = getWholesaleSetPrice(quantity);
  const totalPrice = role === ACCOUNT_TYPES.WHOLESALER
    ? currentWholesalePrice * quantity
    : (role === ACCOUNT_TYPES.RETAILER ? product.retailerPrice : product.retailPrice) * quantity;

  const handleWishlistToggle = () => {
    const list = StoreService.getWishlist(session?.id || 'current');
    let updated;
    if (list.includes(product.id)) {
      updated = list.filter((pid) => pid !== product.id);
      setIsWishlisted(false);
      setToastMessage('Removed from wishlist');
    } else {
      updated = [...list, product.id];
      setIsWishlisted(true);
      setToastMessage('Saved to wishlist!');
    }
    StoreService.saveWishlist(session?.id || 'current', updated);
    setTimeout(() => setToastMessage(''), 2500);
  };

  const handleAddToCart = () => {
    if (role === ACCOUNT_TYPES.WHOLESALER && quantity < 12) {
      alert('Wholesale accounts require a mandatory minimum of 12 sets per order.');
      return;
    }

    const currentCart = StoreService.getCart(role);
    const existingIndex = currentCart.findIndex((item) => item.productId === product.id);

    if (role === ACCOUNT_TYPES.WHOLESALER) {
      if (existingIndex !== -1) {
        currentCart[existingIndex].quantitySets = (currentCart[existingIndex].quantitySets || 0) + quantity;
        currentCart[existingIndex].unitPricePerSet = currentWholesalePrice;
        currentCart[existingIndex].totalPrice = currentCart[existingIndex].quantitySets * currentWholesalePrice;
      } else {
        currentCart.push({
          productId: product.id,
          name: product.name,
          sku: product.sku,
          image: product.images[0],
          fabric: product.fabric,
          piecesPerSet: product.piecesPerSet,
          quantitySets: quantity,
          unitPricePerSet: currentWholesalePrice,
          totalPrice: currentWholesalePrice * quantity,
          color: selectedColor,
          size: selectedSize,
        });
      }
    } else {
      const unitPrice = role === ACCOUNT_TYPES.RETAILER ? product.retailerPrice : product.retailPrice;
      if (existingIndex !== -1) {
        currentCart[existingIndex].quantity = (currentCart[existingIndex].quantity || 0) + quantity;
        currentCart[existingIndex].totalPrice = currentCart[existingIndex].quantity * unitPrice;
      } else {
        currentCart.push({
          productId: product.id,
          name: product.name,
          sku: product.sku,
          image: product.images[0],
          fabric: product.fabric,
          quantity,
          unitPrice,
          totalPrice: unitPrice * quantity,
          color: selectedColor,
          size: selectedSize,
        });
      }
    }

    StoreService.saveCart(role, currentCart);
    setToastMessage(`Added ${quantity} ${role === ACCOUNT_TYPES.WHOLESALER ? 'Sets' : 'item(s)'} to cart!`);
    setTimeout(() => setToastMessage(''), 2500);
  };

  // Related products
  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);

  return (
    <div className="hub-site-wrapper">
      <Navbar />

      {/* Breadcrumbs */}
      <div className="breadcrumbs-bar">
        <div className="site-container">
          <div className="breadcrumbs-nav">
            <Link to="/">Home</Link>
            <span className="crumb-sep">/</span>
            <Link to="/shop">Shop</Link>
            <span className="crumb-sep">/</span>
            <Link to={`/shop?cat=${product.category}`}>{product.categoryName}</Link>
            <span className="crumb-sep">/</span>
            <span className="active-crumb">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Product Main Display */}
      <section className="product-details-main-section">
        <div className="site-container">
          <div className="product-details-grid">
            
            {/* Column 1: Gallery */}
            <div className="product-gallery-column">
              <div className="main-zoom-image-wrapper">
                <img
                  src={product.images[activeImageIndex] || product.images[0]}
                  alt={product.name}
                  className="main-view-image"
                />
                <button
                  type="button"
                  className={`gallery-wish-button ${isWishlisted ? 'active' : ''}`}
                  onClick={handleWishlistToggle}
                  title="Save to Wishlist"
                >
                  <Heart size={20} fill={isWishlisted ? '#D6A12B' : 'none'} color={isWishlisted ? '#D6A12B' : '#062945'} />
                </button>
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="gallery-thumbs-row">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`thumb-button ${activeImageIndex === idx ? 'active-thumb' : ''}`}
                      onClick={() => setActiveImageIndex(idx)}
                    >
                      <img src={img} alt={`Thumb ${idx + 1}`} className="thumb-img" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Column 2: Information & Purchase Controls */}
            <div className="product-info-column">
              <div className="product-header-badge-row">
                <span className="cat-accent-pill">{product.categoryName}</span>
                <span className="sku-tag">SKU: {product.sku}</span>
                <div className="rating-pill">
                  <Star size={13} fill="#D6A12B" color="#D6A12B" />
                  <span>{product.rating}</span>
                  <span className="reviews-num">({product.reviewCount} reviews)</span>
                </div>
              </div>

              <h1 className="product-main-name">{product.name}</h1>
              <p className="product-fabric-highlight">Fabric: <strong>{product.fabric}</strong></p>
              <p className="product-lead-description">{product.description}</p>

              {/* Role-Specific Pricing Panel */}
              <div className="product-pricing-card">
                {role === ACCOUNT_TYPES.WHOLESALER ? (
                  <div className="wholesale-pricing-details">
                    <div className="pricing-primary-row">
                      <span className="currency-label">₹</span>
                      <span className="main-price-num">{currentWholesalePrice.toLocaleString('en-IN')}</span>
                      <span className="price-suffix">/ Set ({product.piecesPerSet} pieces)</span>
                    </div>

                    <div className="wholesale-piece-breakdown">
                      <span>Equates to: <strong>₹{Math.round(currentWholesalePrice / product.piecesPerSet).toLocaleString('en-IN')}</strong> per individual garment</span>
                    </div>

                    <div className="wholesale-moq-alert">
                      <Package size={18} className="text-gold" />
                      <div>
                        <strong>Mandatory Wholesaler MOQ: 12 Clothing Sets</strong>
                        <p>1 Set contains {product.piecesPerSet} assorted colors/sizes. Checkout is locked if total cart sets &lt; 12.</p>
                      </div>
                    </div>
                  </div>
                ) : role === ACCOUNT_TYPES.RETAILER ? (
                  <div className="retailer-pricing-details">
                    <div className="pricing-primary-row">
                      <span className="currency-label">₹</span>
                      <span className="main-price-num">{product.retailerPrice.toLocaleString('en-IN')}</span>
                      <span className="mrp-strikethrough-lg">₹{product.retailPrice.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="margin-benefit-pill">
                      <span>Store Resale Margin: <strong>₹{(product.retailPrice - product.retailerPrice).toLocaleString('en-IN')}</strong> per unit ({Math.round(((product.retailPrice - product.retailerPrice) / product.retailPrice) * 100)}% Gross Margin)</span>
                    </div>
                  </div>
                ) : (
                  <div className="buyer-pricing-details">
                    <div className="pricing-primary-row">
                      <span className="currency-label">₹</span>
                      <span className="main-price-num">{product.retailPrice.toLocaleString('en-IN')}</span>
                      <span className="price-tax-note">(Inclusive of all GST & taxes)</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Color Options */}
              <div className="selector-group">
                <label className="selector-label">Available Colors / Wefts:</label>
                <div className="color-chips-row">
                  {product.colors.map((c, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`color-chip-btn ${selectedColor === c ? 'active' : ''}`}
                      onClick={() => setSelectedColor(c)}
                    >
                      {selectedColor === c && <CheckCircle2 size={13} className="chip-check" />}
                      <span>{c}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Options */}
              <div className="selector-group">
                <label className="selector-label">Available Sizes / Cuts:</label>
                <div className="size-chips-row">
                  {product.sizes.map((s, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`size-chip-btn ${selectedSize === s ? 'active' : ''}`}
                      onClick={() => setSelectedSize(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity / Sets Selector */}
              <div className="quantity-order-row">
                <div className="qty-control-box">
                  <label className="qty-label">
                    {role === ACCOUNT_TYPES.WHOLESALER ? 'Order Sets (Min 12):' : 'Quantity (Pieces):'}
                  </label>
                  <div className="qty-stepper">
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(role === ACCOUNT_TYPES.WHOLESALER ? 12 : 1, q - 1))}
                      disabled={role === ACCOUNT_TYPES.WHOLESALER ? quantity <= 12 : quantity <= 1}
                      className="stepper-btn"
                    >
                      -
                    </button>
                    <span className="stepper-value">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      className="stepper-btn"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="total-calculation-box">
                  <span className="total-label">Subtotal:</span>
                  <span className="total-amount">₹{totalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Wholesaler MOQ Warning if modified */}
              {role === ACCOUNT_TYPES.WHOLESALER && quantity < 12 && (
                <div className="auth-alert-box alert-danger">
                  <AlertTriangle size={16} />
                  <span>Wholesalers cannot order less than 12 sets. Minimum 12 sets has been restored.</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="product-cta-buttons-row">
                <button
                  type="button"
                  className="btn-primary-navy add-cart-btn-large"
                  onClick={handleAddToCart}
                >
                  <ShoppingBag size={18} />
                  <span>
                    {role === ACCOUNT_TYPES.WHOLESALER
                      ? `Add ${quantity} Sets to Wholesale Cart`
                      : `Add ${quantity} to Cart`}
                  </span>
                </button>

                <button
                  type="button"
                  className={`btn-wishlist-large ${isWishlisted ? 'active' : ''}`}
                  onClick={handleWishlistToggle}
                >
                  <Heart size={18} fill={isWishlisted ? '#D6A12B' : 'none'} color={isWishlisted ? '#D6A12B' : '#062945'} />
                  <span>{isWishlisted ? 'Saved' : 'Wishlist'}</span>
                </button>
              </div>

              {toastMessage && (
                <div className="toast-notification-banner">
                  <CheckCircle2 size={16} className="text-gold" />
                  <span>{toastMessage}</span>
                </div>
              )}

              {/* Trust Badges */}
              <div className="details-trust-grid">
                <div className="trust-item">
                  <Truck size={18} className="text-gold" />
                  <div>
                    <strong>Express Dispatch</strong>
                    <span>Inspected & dispatched in 24h</span>
                  </div>
                </div>
                <div className="trust-item">
                  <RotateCcw size={18} className="text-gold" />
                  <div>
                    <strong>5-Day Damage Claims</strong>
                    <span>Returns only for transit damage</span>
                  </div>
                </div>
                <div className="trust-item">
                  <ShieldCheck size={18} className="text-gold" />
                  <div>
                    <strong>100% Digital UPI</strong>
                    <span>No cash handling on delivery</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Specifications, Return Policy & Slabs Tabs */}
          <div className="product-tabs-section mt-10">
            <div className="tabs-header-nav">
              <button
                type="button"
                className={`tab-nav-btn ${activeTab === 'specs' ? 'active' : ''}`}
                onClick={() => setActiveTab('specs')}
              >
                Specifications & Provenance
              </button>

              <button
                type="button"
                className={`tab-nav-btn ${activeTab === 'return-policy' ? 'active' : ''}`}
                onClick={() => setActiveTab('return-policy')}
              >
                Strict 5-Day Return Policy
              </button>

              {role === ACCOUNT_TYPES.WHOLESALER && (
                <button
                  type="button"
                  className={`tab-nav-btn ${activeTab === 'slabs' ? 'active' : ''}`}
                  onClick={() => setActiveTab('slabs')}
                >
                  Wholesale Slabs Matrix
                </button>
              )}

              <button
                type="button"
                className={`tab-nav-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                Customer Reviews ({product.reviewCount})
              </button>
            </div>

            <div className="tabs-content-body">
              {/* Tab 1: Specs */}
              {activeTab === 'specs' && (
                <div className="specs-table-wrap">
                  <table className="specs-table">
                    <tbody>
                      <tr>
                        <th>Origin & Cluster</th>
                        <td>{product.specifications?.origin || 'Varanasi, Uttar Pradesh'}</td>
                      </tr>
                      <tr>
                        <th>Weave & Technique</th>
                        <td>{product.specifications?.weave || product.specifications?.work || 'Authentic Handcrafted Weave'}</td>
                      </tr>
                      <tr>
                        <th>Zari / Thread Composition</th>
                        <td>{product.specifications?.zariType || 'Tested Pure Metallic Zari'}</td>
                      </tr>
                      <tr>
                        <th>Wash & Fabric Care</th>
                        <td>{product.specifications?.washCare || 'Strictly Dry Clean Only'}</td>
                      </tr>
                      <tr>
                        <th>HSN Classification Code</th>
                        <td>{product.specifications?.hsnCode || '50072010'}</td>
                      </tr>
                      <tr>
                        <th>GST Rate</th>
                        <td>{product.specifications?.gstRate || '5%'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {/* Tab 2: Return Policy */}
              {activeTab === 'return-policy' && (
                <div className="return-policy-tab-content">
                  <div className="alert-important-box">
                    <strong>CRITICAL RETURN POLICY NOTICE:</strong> Returns are accepted <u>EXCLUSIVELY FOR DAMAGED CLOTHING</u> reported within 5 calendar days of recorded delivery.
                  </div>
                  <h4>Strict Return Conditions:</h4>
                  <ul>
                    <li>The damage must be reported within <strong>5 calendar days</strong> from the delivery timestamp.</li>
                    <li>The customer must provide clear, high-resolution photographs showing the defect.</li>
                    <li>Valid Order ID and description of damage are required.</li>
                    <li>Non-acceptable reasons: Change of mind, wrong size chosen by customer, color preference changes, or undamaged items.</li>
                  </ul>
                  <p className="mt-3">
                    Approved damage claims are eligible for free replacement or refund to original UPI source within 48 hours of verification.
                  </p>
                </div>
              )}

              {/* Tab 3: Wholesale Slabs */}
              {activeTab === 'slabs' && (
                <div className="slabs-tab-content">
                  <h4>Wholesale Volume Pricing Slabs for {product.name}</h4>
                  <p>1 Set = {product.piecesPerSet} pieces assorted colors and sizes.</p>
                  <table className="slabs-table">
                    <thead>
                      <tr>
                        <th>Volume Tier</th>
                        <th>Order Range</th>
                        <th>Price Per Set</th>
                        <th>Piece Equiv.</th>
                        <th>Applicable Incentive</th>
                      </tr>
                    </thead>
                    <tbody>
                      {product.wholesaleSlabs?.map((slab, i) => (
                        <tr key={i} className={quantity >= slab.minSets && quantity <= slab.maxSets ? 'active-slab-row' : ''}>
                          <td><strong>Tier {i + 1}</strong></td>
                          <td>{slab.minSets} – {slab.maxSets === 999 ? 'Above' : slab.maxSets} Sets</td>
                          <td>₹{slab.pricePerSet.toLocaleString('en-IN')}</td>
                          <td>≈ ₹{Math.round(slab.pricePerSet / product.piecesPerSet).toLocaleString('en-IN')}</td>
                          <td><span className="incentive-tag">{slab.discountNote}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Tab 4: Reviews */}
              {activeTab === 'reviews' && (
                <div className="reviews-tab-content">
                  <div className="reviews-header-row">
                    <div>
                      <h3>Overall Rating: {product.rating} / 5.0</h3>
                      <p>Based on {product.reviewCount} verified purchases</p>
                    </div>
                  </div>
                  <div className="reviews-list">
                    <div className="review-card">
                      <div className="review-card-top">
                        <span className="reviewer-name">Priya Sharma</span>
                        <span className="verified-badge">✓ Verified Buyer</span>
                        <span className="review-stars">★★★★★</span>
                      </div>
                      <p className="review-comment">
                        “The gold zari kadhwa work is breathtaking. The drape is heavy yet fluid, exactly what I sought for my sister’s sangeet. Truly royal quality!”
                      </p>
                    </div>
                    <div className="review-card">
                      <div className="review-card-top">
                        <span className="reviewer-name">Rajesh Singhania</span>
                        <span className="verified-badge">✓ Verified Wholesaler</span>
                        <span className="review-stars">★★★★★</span>
                      </div>
                      <p className="review-comment">
                        “Procured 24 sets for our Delhi showroom. The bale packaging was pristine and every saree was individually tagged with Silk Mark. High-velocity seller for bridal season.”
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Collections */}
          {related.length > 0 && (
            <div className="related-products-section mt-12">
              <h2 className="related-title">Complementary {product.categoryName}</h2>
              <div className="products-showcase-grid">
                {related.map((prod) => (
                  <ProductCard key={prod.id} product={prod} />
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <AppFooter />
    </div>
  );
}
