import React from 'react';
import { Printer, Download, CheckCircle2, ShieldCheck } from 'lucide-react';
import Logo from './Logo';

export default function InvoiceModal({ order, isOpen, onClose }) {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceNo = `INV-${order.id.replace('ECH-ORD-', '')}-2026`;
  const isWholesale = order.accountType === 'Wholesaler';

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card modal-invoice-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header no-print">
          <div className="modal-title-with-icon">
            <ShieldCheck size={20} className="text-gold" />
            <h3 className="modal-title">GST Tax Invoice • {invoiceNo}</h3>
          </div>
          <div className="invoice-header-actions">
            <button type="button" className="btn-print-action" onClick={handlePrint}>
              <Printer size={15} />
              <span>Print / Save PDF</span>
            </button>
            <button type="button" className="modal-close-button" onClick={onClose}>✕</button>
          </div>
        </div>

        <div className="modal-body-scroll invoice-printable-area">
          {/* Printable Invoice Header */}
          <div className="invoice-top-branding">
            <div className="inv-brand-left">
              <Logo size="compact" />
              <p className="inv-firm-name">ETHNIC COLLECTION HUB PRIVATE LIMITED</p>
              <p className="inv-firm-address">Heritage Couture Plaza, Connaught Place, New Delhi 110001, India</p>
              <p className="inv-gstin"><strong>GSTIN:</strong> 07AAACE0099P1Z3 • <strong>State Code:</strong> 07 (Delhi)</p>
            </div>

            <div className="inv-meta-right">
              <h2 className="tax-inv-badge">TAX INVOICE</h2>
              <div className="inv-meta-table">
                <div className="inv-meta-row"><span>Invoice No:</span> <strong>{invoiceNo}</strong></div>
                <div className="inv-meta-row"><span>Invoice Date:</span> <strong>{new Date(order.orderDate).toLocaleDateString('en-IN')}</strong></div>
                <div className="inv-meta-row"><span>Order ID:</span> <strong>{order.id}</strong></div>
                <div className="inv-meta-row"><span>Account Role:</span> <strong>{order.accountType}</strong></div>
                <div className="inv-meta-row"><span>Payment Status:</span> <strong className="text-success">{order.paymentStatus}</strong></div>
              </div>
            </div>
          </div>

          <div className="invoice-divider"></div>

          {/* Bill To & Ship To */}
          <div className="inv-parties-grid">
            <div className="inv-party-col">
              <h4>Billed To (Customer / Entity)</h4>
              <p className="party-name">{order.shippingAddress?.fullName || order.userName}</p>
              <p className="party-phone">{order.shippingAddress?.phone}</p>
              <p className="party-address">
                {order.shippingAddress?.addressLine1}, {order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}
              </p>
              {isWholesale && <p className="party-gst"><strong>Buyer GSTIN:</strong> 07AAAAA0000A1Z5</p>}
            </div>

            <div className="inv-party-col">
              <h4>Dispatched From (Fulfillment Hub)</h4>
              <p className="party-name">ETHNIC COLLECTION HUB Central Logistics Depot</p>
              <p className="party-address">Weavers Park, NH-8 Industrial Corridor, Gurugram, Haryana 122001</p>
              <p className="party-gst"><strong>Supply Place:</strong> {order.shippingAddress?.state || 'Delhi'}</p>
            </div>
          </div>

          {/* Items Table */}
          <table className="invoice-items-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Item Description</th>
                <th>HSN Code</th>
                <th>{isWholesale ? 'Sets Ordered' : 'Qty'}</th>
                <th>Rate (₹)</th>
                <th>Taxable Val (₹)</th>
                <th>CGST (2.5%)</th>
                <th>SGST (2.5%)</th>
                <th>Total (₹)</th>
              </tr>
            </thead>
            <tbody>
              {order.items?.map((item, idx) => {
                const qty = isWholesale ? (item.quantitySets || 12) : (item.quantity || 1);
                const rate = isWholesale ? item.unitPricePerSet : item.unitPrice;
                const total = isWholesale ? item.totalPrice : (rate * qty);
                const taxable = total / 1.05;
                const gstHalf = (total - taxable) / 2;

                return (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>
                      <strong>{item.name}</strong>
                      <div className="item-sub-meta">SKU: {item.sku} {isWholesale ? `(${item.piecesPerSet || 6} pcs/set)` : ''}</div>
                    </td>
                    <td>{item.hsnCode || '50072010'}</td>
                    <td>{qty} {isWholesale ? 'Sets' : 'pcs'}</td>
                    <td>₹{rate?.toLocaleString('en-IN')}</td>
                    <td>₹{taxable.toFixed(2)}</td>
                    <td>₹{gstHalf.toFixed(2)}</td>
                    <td>₹{gstHalf.toFixed(2)}</td>
                    <td><strong>₹{total?.toLocaleString('en-IN')}</strong></td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Financial Calculation Summary */}
          <div className="invoice-financial-summary">
            <div className="summary-col-left">
              <div className="inv-payment-stamp">
                <CheckCircle2 size={18} className="text-success" />
                <div>
                  <strong>{order.paymentMethod === 'ONLINE_UPI' ? 'Paid via Online UPI' : 'UPI on Delivery Confirmed'}</strong>
                  <p>Transaction Ref: {order.upiTransactionId || 'Awaiting Delivery UPI Handover'}</p>
                </div>
              </div>
              <p className="inv-legal-note">
                Returns accepted strictly for damaged clothing reported within 5 days of delivery.
              </p>
            </div>

            <div className="summary-col-right">
              <div className="calc-row"><span>Subtotal:</span> <strong>₹{order.subtotal?.toLocaleString('en-IN')}</strong></div>
              {order.discount > 0 && <div className="calc-row text-success"><span>Volume / Promo Discount:</span> <strong>-₹{order.discount?.toLocaleString('en-IN')}</strong></div>}
              <div className="calc-row"><span>Freight & Handling:</span> <strong>{order.deliveryFee === 0 ? 'FREE' : `₹${order.deliveryFee}`}</strong></div>
              <div className="calc-row grand-total-row">
                <span>Grand Total (INR):</span>
                <strong>₹{order.totalAmount?.toLocaleString('en-IN')}</strong>
              </div>
            </div>
          </div>

          <div className="invoice-signatory-row">
            <div className="sign-block">
              <p className="auth-sign-label">Authorized Signatory</p>
              <p className="sign-firm-name">ETHNIC COLLECTION HUB PVT LTD</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
