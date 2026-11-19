import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { StoreService } from '../../services/storeService';
import { CATEGORIES } from '../../data/mockCatalog';
import { Package, ShoppingBag, Eye, Layers, CheckCircle2 } from 'lucide-react';

export default function WholesaleCataloguePage() {
  const products = StoreService.getProducts();
  const [selectedCat, setSelectedCat] = useState('all');
  const [cartToast, setCartToast] = useState('');

  const filtered = selectedCat === 'all'
    ? products
    : products.filter((p) => p.category === selectedCat);

  const handleAddWholesaleSets = (product, setsToAdd = 12) => {
    const cart = StoreService.getCart('Wholesaler');
    const existingIndex = cart.findIndex((i) => i.productId === product.id);

    // Calculate slab discount if applicable
    let unitPrice = product.wholesalePricePerSet;
    if (setsToAdd >= 36) unitPrice = Math.round(unitPrice * 0.90);
    else if (setsToAdd >= 24) unitPrice = Math.round(unitPrice * 0.95);

    if (existingIndex !== -1) {
      cart[existingIndex].quantitySets = (cart[existingIndex].quantitySets || 0) + setsToAdd;
      cart[existingIndex].totalPrice = cart[existingIndex].quantitySets * unitPrice;
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        sku: product.sku,
        image: product.images[0],
        fabric: product.fabric,
        piecesPerSet: product.piecesPerSet,
        quantitySets: setsToAdd,
        unitPricePerSet: unitPrice,
        totalPrice: unitPrice * setsToAdd,
      });
    }

    StoreService.saveCart('Wholesaler', cart);
    setCartToast(`Added ${setsToAdd} Sets (${setsToAdd * product.piecesPerSet} pieces) of "${product.name}" to Wholesale Cart!`);
    setTimeout(() => setCartToast(''), 3000);
  };

  return (
    <DashboardLayout
      title="Wholesale Factory Direct Catalogue"
      subtitle="Procure full clothing sets at manufacturer rates • Strict Minimum Order: 12 Sets"
    >
      {cartToast && (
        <div className="auth-alert-box alert-success mb-6">
          <CheckCircle2 size={18} />
          <span>{cartToast}</span>
        </div>
      )}

      {/* Category Pills */}
      <div className="catalogue-category-chips-row mb-6">
        <button
          type="button"
          className={`chip-filter-btn ${selectedCat === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCat('all')}
        >
          All Collections ({products.length})
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`chip-filter-btn ${selectedCat === cat.slug ? 'active' : ''}`}
            onClick={() => setSelectedCat(cat.slug)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Wholesale Product Grid */}
      <div className="retailer-trade-grid">
        {filtered.map((prod) => {
          return (
            <div key={prod.id} className="retailer-product-card wholesale-border">
              <div className="r-card-img-wrap">
                <img src={prod.images[0]} alt={prod.name} className="r-card-thumb" />
                <span className="badge-pill wholesale-moq-badge">MOQ: 12 Sets</span>
              </div>

              <div className="r-card-body">
                <span className="cat-accent-pill">{prod.categoryName}</span>
                <h3 className="r-card-title">
                  <Link to={`/wholesaler/product/${prod.id}`}>{prod.name}</Link>
                </h3>
                <p className="r-card-fabric">{prod.fabric} • SKU: {prod.sku}</p>

                {/* Wholesale Pricing Breakdown */}
                <div className="wholesale-pricing-box p-3 bg-warm-ivory rounded border my-3">
                  <div className="price-main-line">
                    <span className="currency-symbol">₹</span>
                    <strong className="text-xl font-bold text-navy">{prod.wholesalePricePerSet.toLocaleString('en-IN')}</strong>
                    <span className="price-unit">/ Set ({prod.piecesPerSet} pieces)</span>
                  </div>

                  <div className="wholesale-piece-equiv mt-1 text-xs text-muted flex justify-between">
                    <span>≈ ₹{prod.wholesalePricePerPiece.toLocaleString('en-IN')} per piece</span>
                    <span className="text-gold font-semibold">1 Set = {prod.piecesPerSet} pcs</span>
                  </div>

                  {/* Slab preview */}
                  <div className="slab-chips-row mt-2 flex gap-1 text-xs">
                    <span className="slab-badge">12 Sets: Base</span>
                    <span className="slab-badge">24 Sets: -5%</span>
                    <span className="slab-badge">36+ Sets: -10%</span>
                  </div>
                </div>

                <div className="r-card-actions mt-4 flex gap-2">
                  <button
                    type="button"
                    className="btn-primary-navy add-cart-btn flex-1"
                    onClick={() => handleAddWholesaleSets(prod, 12)}
                  >
                    <ShoppingBag size={16} />
                    <span>Add 12 Sets (MOQ)</span>
                  </button>
                  <Link
                    to={`/wholesaler/product/${prod.id}`}
                    className="btn-modal-cancel"
                    title="View Slab Details"
                  >
                    <Eye size={16} />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
}
