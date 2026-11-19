import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { StoreService } from '../../services/storeService';
import { Layers, Package, TrendingUp, Calculator, CheckCircle2 } from 'lucide-react';

export default function BulkPricingMatrixPage() {
  const products = StoreService.getProducts();
  const [calcSets, setCalcSets] = useState(24);

  // Calculate rebate
  let rebatePct = 0;
  if (calcSets >= 36) rebatePct = 10;
  else if (calcSets >= 24) rebatePct = 5;

  return (
    <DashboardLayout
      title="Wholesale Bulk Pricing & Slab Architecture"
      subtitle="Complete volume price matrix across all categories • Minimum 12 Sets Mandatory"
    >
      {/* Policy Notice */}
      <div className="wholesale-rule-banner mb-6">
        <div className="flex items-center gap-3">
          <Package size={24} className="text-gold" />
          <div>
            <h4>Mandatory Rule: 12 Sets Minimum per Wholesale Order</h4>
            <p>
              Wholesale accounts purchase in full clothing sets. Orders below 12 sets are not eligible for checkout. Volume rebates are automatically computed across your cumulative cart sets.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Slab Calculator */}
      <div className="slab-calculator-card mb-8">
        <div className="calc-header flex items-center gap-2 mb-4">
          <Calculator size={22} className="text-gold" />
          <h3 className="font-bold text-lg">Interactive Bulk Volume Simulator</h3>
        </div>

        <div className="calc-input-row flex items-center gap-4 mb-4">
          <label className="font-semibold text-sm">Select Planned Volume:</label>
          <div className="flex gap-2">
            {[12, 18, 24, 30, 36, 48, 60].map((s) => (
              <button
                key={s}
                type="button"
                className={`calc-chip-btn ${calcSets === s ? 'active' : ''}`}
                onClick={() => setCalcSets(s)}
              >
                {s} Sets
              </button>
            ))}
          </div>
          <span className="text-xs text-muted">(Custom: {calcSets} sets)</span>
        </div>

        <div className="calc-results-strip p-4 bg-warm-ivory rounded border flex justify-between items-center">
          <div>
            <span className="text-xs text-muted block">Qualifying Volume Slab:</span>
            <strong className="text-navy text-base">
              {calcSets >= 36 ? 'Tier 3 (Super-Bulk Master)' : calcSets >= 24 ? 'Tier 2 (Bulk Incentive)' : 'Tier 1 (Base Wholesale)'}
            </strong>
          </div>
          <div>
            <span className="text-xs text-muted block">Applicable Volume Rebate:</span>
            <strong className="text-green text-lg">{rebatePct}% Extra Discount</strong>
          </div>
          <div>
            <span className="text-xs text-muted block">Average Total Garments:</span>
            <strong className="text-navy text-base">≈ {calcSets * 6} Pieces</strong>
          </div>
        </div>
      </div>

      {/* Complete Matrix Table */}
      <div className="pricing-matrix-table-card">
        <h3 className="font-bold text-lg mb-4">Category-Wise Wholesale Price Matrix</h3>
        <div className="dashboard-table-wrap">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Design / Category</th>
                <th>Pieces / Set</th>
                <th>Tier 1 (12-23 Sets)</th>
                <th>Tier 2 (24-35 Sets, -5%)</th>
                <th>Tier 3 (36+ Sets, -10%)</th>
                <th>Approx Per Piece</th>
              </tr>
            </thead>
            <tbody>
              {products.map((prod) => {
                const base = prod.wholesalePricePerSet;
                const tier2 = Math.round(base * 0.95);
                const tier3 = Math.round(base * 0.90);
                const pieceCost = Math.round(base / prod.piecesPerSet);

                return (
                  <tr key={prod.id}>
                    <td>
                      <strong>{prod.name}</strong>
                      <div className="text-xs text-muted">{prod.categoryName} • SKU: {prod.sku}</div>
                    </td>
                    <td><strong>{prod.piecesPerSet} pcs/set</strong></td>
                    <td>₹{base.toLocaleString('en-IN')}</td>
                    <td><strong className="text-green">₹{tier2.toLocaleString('en-IN')}</strong></td>
                    <td><strong className="text-gold">₹{tier3.toLocaleString('en-IN')}</strong></td>
                    <td>≈ ₹{pieceCost.toLocaleString('en-IN')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
