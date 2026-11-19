import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Eye, Star, CheckCircle, Package } from 'lucide-react';
import { getCurrentSession, ACCOUNT_TYPES } from '../services/authService';
import { StoreService } from '../services/storeService';

export default function ProductCard({ product, onAddToCart, onToggleWishlist }) {
  const session = getCurrentSession();
  const role = session?.accountType || 'Buyer';

  const [isWishlisted, setIsWishlisted] = useState(() => {
    const list = StoreService.getWishlist(session?.id || 'current');
    return list.includes(product.id);
  });
  const [addedToast, setAddedToast] = useState(false);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const list = StoreService.getWishlist(session?.id || 'current');
    let updated;
    if (list.includes(product.id)) {
      updated = list.filter((id) => id !== product.id);
      setIsWishlisted(false);
    } else {
      updated = [...list, product.id];
      setIsWishlisted(true);
    }
    StoreService.saveWishlist(session?.id || 'current', updated);
    if (onToggleWishlist) onToggleWishlist(product.id, !isWishlisted);
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const currentCart = StoreService.getCart(role);
    const existingIndex = currentCart.findIndex((item) => item.productId === product.id);

    if (role === ACCOUNT_TYPES.WHOLESALER) {
      // For Wholesaler: default to minimum 12 sets if new, or increment sets
      if (existingIndex !== -1) {
        currentCart[existingIndex].quantitySets = (currentCart[existingIndex].quantitySets || 12) + 1;
      } else {
        currentCart.push({
          productId: product.id,
          name: product.name,
          sku: product.sku,
          image: product.images[0],
          fabric: product.fabric,
          piecesPerSet: product.piecesPerSet,
          quantitySets: 12, // Strict minimum wholesale set prompt
          unitPricePerSet: product.wholesalePricePerSet,
          totalPrice: product.wholesalePricePerSet * 12,
        });
      }
    } else {
      // For Buyer / Retailer
      const unitPrice = role === ACCOUNT_TYPES.RETAILER ? product.retailerPrice : product.retailPrice;
      if (existingIndex !== -1) {
        currentCart[existingIndex].quantity = (currentCart[existingIndex].quantity || 1) + 1;
        currentCart[existingIndex].totalPrice = currentCart[existingIndex].quantity * unitPrice;
      } else {
        currentCart.push({
          productId: product.id,
          name: product.name,
          sku: product.sku,
          image: product.images[0],
          fabric: product.fabric,
          quantity: role === ACCOUNT_TYPES.RETAILER ? product.moqRetailer || 2 : 1,
          unitPrice,
          totalPrice: unitPrice * (role === ACCOUNT_TYPES.RETAILER ? product.moqRetailer || 2 : 1),
        });
      }
    }

    StoreService.saveCart(role, currentCart);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
    if (onAddToCart) onAddToCart(product);
  };

  return (
    <div className="ethnic-product-card">
      <div className="card-image-wrap">
        <Link to={`/product/${product.id}`} className="card-image-link">
          <img
            src={product.images[0]}
            alt={product.name}
            className="product-main-thumb"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="card-floating-badges">
          {product.isNewArrival && <span className="badge-pill new-badge">New</span>}
          {role === ACCOUNT_TYPES.WHOLESALER && (
            <span className="badge-pill wholesale-moq-badge">MOQ: 12 Sets</span>
          )}
          {product.isFeatured && <span className="badge-pill featured-badge">Couture</span>}
        </div>

        {/* Quick Action Buttons */}
        <div className="card-quick-actions">
          <button
            type="button"
            className={`quick-action-btn ${isWishlisted ? 'active-wish' : ''}`}
            onClick={handleWishlistClick}
            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            aria-label="Wishlist"
          >
            <Heart size={18} fill={isWishlisted ? '#D6A12B' : 'none'} color={isWishlisted ? '#D6A12B' : '#FFFFFF'} />
          </button>
          <Link
            to={`/product/${product.id}`}
            className="quick-action-btn"
            title="Quick View Specifications"
            aria-label="View Product"
          >
            <Eye size={18} color="#FFFFFF" />
          </Link>
        </div>
      </div>

      <div className="card-details-wrap">
        <div className="card-category-rating-row">
          <span className="card-category-tag">{product.categoryName}</span>
          <div className="card-rating-star">
            <Star size={13} fill="#D6A12B" color="#D6A12B" />
            <span>{product.rating}</span>
            <span className="rating-count">({product.reviewCount})</span>
          </div>
        </div>

        <h3 className="product-title-link">
          <Link to={`/product/${product.id}`} title={product.name}>
            {product.name}
          </Link>
        </h3>

        <p className="product-fabric-meta">{product.fabric} • SKU: {product.sku}</p>

        {/* Dynamic Pricing according to Account Type */}
        <div className="product-price-section">
          {role === ACCOUNT_TYPES.WHOLESALER ? (
            <div className="wholesale-pricing-box">
              <div className="price-main-line">
                <span className="currency-symbol">₹</span>
                <span className="price-num">{product.wholesalePricePerSet.toLocaleString('en-IN')}</span>
                <span className="price-unit">/ Set ({product.piecesPerSet} pcs)</span>
              </div>
              <div className="wholesale-piece-equiv">
                <span>≈ ₹{product.wholesalePricePerPiece.toLocaleString('en-IN')}/piece</span>
                <span className="slab-tag">12+ Sets MOQ</span>
              </div>
            </div>
          ) : role === ACCOUNT_TYPES.RETAILER ? (
            <div className="retailer-pricing-box">
              <div className="price-main-line">
                <span className="currency-symbol">₹</span>
                <span className="price-num">{product.retailerPrice.toLocaleString('en-IN')}</span>
                <span className="mrp-strikethrough">₹{product.retailPrice.toLocaleString('en-IN')}</span>
              </div>
              <span className="margin-pill">
                Resale Margin: ₹{(product.retailPrice - product.retailerPrice).toLocaleString('en-IN')} ({Math.round(((product.retailPrice - product.retailerPrice) / product.retailPrice) * 100)}%)
              </span>
            </div>
          ) : (
            <div className="buyer-pricing-box">
              <div className="price-main-line">
                <span className="currency-symbol">₹</span>
                <span className="price-num">{product.retailPrice.toLocaleString('en-IN')}</span>
                <span className="tax-inclusive-tag">incl. of all taxes</span>
              </div>
            </div>
          )}
        </div>

        {/* Add to Cart button */}
        <button
          type="button"
          className="btn-add-cart-action"
          onClick={handleQuickAdd}
        >
          <ShoppingBag size={16} />
          <span>
            {addedToast
              ? 'Added to Cart!'
              : role === ACCOUNT_TYPES.WHOLESALER
              ? 'Add 12 Sets to Cart'
              : 'Add to Cart'}
          </span>
        </button>
      </div>
    </div>
  );
}
