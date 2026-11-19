import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { StoreService } from '../../services/storeService';
import { CATEGORIES } from '../../data/mockCatalog';
import { Store, ShoppingBag, Eye, TrendingUp, CheckCircle2 } from 'lucide-react';

export default function RetailerCataloguePage() {
  const products = StoreService.getProducts();
  const [selectedCat, setSelectedCat] = useState('all');
  const [cartToast, setCartToast] = useState('');

  const filtered = selectedCat === 'all'
    ? products
    : products.filter((p) => p.category === selectedCat);

  const handleAddStock = (product) => {
    const cart = StoreService.getCart('Retailer');
    const existingIndex = cart.findIndex((i) => i.productId === product.id);
    const moq = product.moqRetailer || 2;

    if (existingIndex !== -1) {
      cart[existingIndex].quantity = (cart[existingIndex].quantity || 0) + moq;
      cart[existingIndex].totalPrice = cart[existingIndex].quantity * product.retailerPrice;
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        sku: product.sku,
        image: product.images[0],
        fabric: product.fabric,
        quantity: moq,
        unitPrice: product.retailerPrice,
        totalPrice: product.retailerPrice * moq,
      });
    }

    StoreService.saveCart('Retailer', cart);
    setCartToast(`Added ${moq} units of "${product.name}" to Store Cart!`);
    setTimeout(() => setCartToast(''), 2500);
  };

  return (
    <DashboardLayout
      title="Retailer Trade Catalogue & Profit Margins"
      subtitle="Procure inventory at preferential trade prices designed for boutique resale."
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

      {/* Products Table/Grid with Trade Margins */}
      <div className="retailer-trade-grid">
        {filtered.map((prod) => {
          const marginRs = prod.retailPrice - prod.retailerPrice;
          const marginPct = Math.round((marginRs / prod.retailPrice) * 100);

          return (
            <div key={prod.id} className="retailer-product-card">
              <div className="r-card-img-wrap">
                <img src={prod.images[0]} alt={prod.name} className="r-card-thumb" />
                <span className="r-moq-badge">MOQ: {prod.moqRetailer || 2} Units</span>
              </div>

              <div className="r-card-body">
                <span className="cat-accent-pill">{prod.categoryName}</span>
                <h3 className="r-card-title">
                  <Link to={`/retailer/product/${prod.id}`}>{prod.name}</Link>
                </h3>
                <p className="r-card-fabric">{prod.fabric} • SKU: {prod.sku}</p>

                {/* Price and Margin Comparison Box */}
                <div className="r-margin-box">
                  <div className="r-trade-price-row">
                    <span className="label">Retailer Trade Rate:</span>
                    <strong className="trade-price">₹{prod.retailerPrice.toLocaleString('en-IN')}</strong>
                  </div>
                  <div className="r-mrp-row">
                    <span className="label">Consumer MRP:</span>
                    <span className="mrp-strike">₹{prod.retailPrice.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="r-profit-pill">
                    <TrendingUp size={14} className="text-green" />
                    <span>Your Gross Profit: <strong>₹{marginRs.toLocaleString('en-IN')}</strong> ({marginPct}%)</span>
                  </div>
                </div>

                <div className="r-card-actions mt-4 flex gap-2">
                  <button
                    type="button"
                    className="btn-primary-navy add-cart-btn flex-1"
                    onClick={() => handleAddStock(prod)}
                  >
                    <ShoppingBag size={16} />
                    <span>Order Stock ({prod.moqRetailer || 2} Units)</span>
                  </button>
                  <Link
                    to={`/retailer/product/${prod.id}`}
                    className="btn-modal-cancel"
                    title="View Breakdown"
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
