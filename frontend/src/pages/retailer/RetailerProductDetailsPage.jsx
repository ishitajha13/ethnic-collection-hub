import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { StoreService } from '../../services/storeService';
import { ShoppingBag, TrendingUp, CheckCircle2, ShieldCheck, ArrowLeft, RotateCcw } from 'lucide-react';

export default function RetailerProductDetailsPage() {
  const { id } = useParams();
  const products = StoreService.getProducts();
  const product = products.find((p) => p.id === id) || products[0];

  const [activeImg, setActiveImg] = useState(0);
  const [quantity, setQuantity] = useState(product.moqRetailer || 2);
  const [toastMsg, setToastMsg] = useState('');

  const marginRs = product.retailPrice - product.retailerPrice;
  const marginPct = Math.round((marginRs / product.retailPrice) * 100);
  const totalCost = product.retailerPrice * quantity;
  const totalRevenue = product.retailPrice * quantity;
  const totalProfit = marginRs * quantity;

  const handleAddStock = () => {
    const cart = StoreService.getCart('Retailer');
    const existingIndex = cart.findIndex((i) => i.productId === product.id);

    if (existingIndex !== -1) {
      cart[existingIndex].quantity = (cart[existingIndex].quantity || 0) + quantity;
      cart[existingIndex].totalPrice = cart[existingIndex].quantity * product.retailerPrice;
    } else {
      cart.push({
        productId: product.id,
        name: product.name,
        sku: product.sku,
        image: product.images[0],
        fabric: product.fabric,
        quantity,
        unitPrice: product.retailerPrice,
        totalPrice: totalCost,
      });
    }

    StoreService.saveCart('Retailer', cart);
    setToastMsg(`Added ${quantity} units of "${product.name}" to Store Cart!`);
    setTimeout(() => setToastMsg(''), 2500);
  };

  return (
    <DashboardLayout
      title={`Stock Procurement • ${product.name}`}
      subtitle={`SKU: ${product.sku} • Preferential Boutique Pricing`}
    >
      <Link to="/retailer/catalogue" className="back-link mb-4">
        <ArrowLeft size={16} />
        <span>Back to Trade Catalogue</span>
      </Link>

      {toastMsg && (
        <div className="auth-alert-box alert-success mb-4">
          <CheckCircle2 size={18} />
          <span>{toastMsg}</span>
        </div>
      )}

      <div className="product-details-grid">
        {/* Left Column: Media */}
        <div className="product-gallery-column">
          <div className="main-zoom-image-wrapper">
            <img src={product.images[activeImg] || product.images[0]} alt={product.name} className="main-view-image" />
          </div>
          {product.images.length > 1 && (
            <div className="gallery-thumbs-row">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  className={`thumb-button ${activeImg === i ? 'active-thumb' : ''}`}
                  onClick={() => setActiveImg(i)}
                >
                  <img src={img} alt="" className="thumb-img" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Pricing & Margins */}
        <div className="product-info-column">
          <span className="cat-accent-pill">{product.categoryName}</span>
          <h1 className="product-main-name">{product.name}</h1>
          <p className="product-fabric-highlight">Fabric: <strong>{product.fabric}</strong></p>
          <p className="product-lead-description">{product.description}</p>

          {/* Resale Margins Card */}
          <div className="product-pricing-card border-gold">
            <div className="r-trade-price-row mb-2">
              <span className="text-sm">Retailer Trade Price:</span>
              <strong className="text-2xl font-bold text-navy">₹{product.retailerPrice.toLocaleString('en-IN')}</strong>
              <span className="text-sm text-muted">/ unit</span>
            </div>
            <div className="r-mrp-row mb-3">
              <span className="text-sm">Suggested Consumer MRP:</span>
              <span className="mrp-strikethrough">₹{product.retailPrice.toLocaleString('en-IN')}</span>
            </div>

            <div className="resale-margin-analysis-box p-3 bg-warm-ivory rounded border">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp size={16} className="text-gold" />
                <strong className="text-sm">Store Profitability Projection ({quantity} units):</strong>
              </div>
              <p className="text-xs text-muted">Procurement Cost: ₹{totalCost.toLocaleString('en-IN')} • Expected Sales: ₹{totalRevenue.toLocaleString('en-IN')}</p>
              <p className="text-sm font-bold text-success mt-1">Projected Boutique Profit: ₹{totalProfit.toLocaleString('en-IN')} ({marginPct}% Gross Margin)</p>
            </div>
          </div>

          {/* Quantity Stepper */}
          <div className="quantity-order-row mt-4">
            <div className="qty-control-box">
              <label className="qty-label">Procure Units (Min {product.moqRetailer || 2}):</label>
              <div className="qty-stepper">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(product.moqRetailer || 2, q - 1))}
                  disabled={quantity <= (product.moqRetailer || 2)}
                  className="stepper-btn"
                >
                  -
                </button>
                <span className="stepper-value">{quantity}</span>
                <button type="button" onClick={() => setQuantity((q) => q + 1)} className="stepper-btn">
                  +
                </button>
              </div>
            </div>

            <div className="total-calculation-box">
              <span className="total-label">Payable Total:</span>
              <span className="total-amount">₹{totalCost.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            type="button"
            className="btn-primary-navy block-btn py-3 mt-6"
            onClick={handleAddStock}
          >
            <ShoppingBag size={18} />
            <span>Add {quantity} Units to Store Bulk Bag</span>
          </button>

          {/* Policy */}
          <div className="details-trust-grid mt-6">
            <div className="trust-item">
              <ShieldCheck size={18} className="text-gold" />
              <div>
                <strong>GST Input Tax Credit</strong>
                <span>Tax invoices with HSN codes</span>
              </div>
            </div>
            <div className="trust-item">
              <RotateCcw size={18} className="text-gold" />
              <div>
                <strong>5-Day Transit Damage</strong>
                <span>Direct replacement for transit defects</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
