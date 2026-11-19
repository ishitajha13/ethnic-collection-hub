import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import InvoiceModal from '../../components/InvoiceModal';
import { StoreService } from '../../services/storeService';
import { getCurrentSession } from '../../services/authService';
import { Printer, Download, FileText, CheckCircle2 } from 'lucide-react';

export default function RetailerInvoicesPage() {
  const session = getCurrentSession();
  const allOrders = StoreService.getOrders();
  const retailerOrders = allOrders.filter(
    (o) => o.accountType === 'Retailer' || o.userEmail === session?.email
  );

  const [activeInvoice, setActiveInvoice] = useState(null);

  return (
    <DashboardLayout
      title="GST Commercial Tax Invoices"
      subtitle="Download GST-compliant tax invoices with HSN classifications for Input Tax Credit (ITC)."
    >
      <div className="invoices-table-card">
        <div className="card-header-bar flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Available Tax Invoices ({retailerOrders.length})</h3>
          <span className="text-xs text-muted">All invoices carry digital signature & QR accreditation.</span>
        </div>

        <div className="dashboard-table-wrap">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Invoice No</th>
                <th>Order Ref</th>
                <th>Invoice Date</th>
                <th>Buyer GSTIN</th>
                <th>Taxable Val</th>
                <th>GST (5%)</th>
                <th>Total Value</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {retailerOrders.map((ord) => {
                const invNo = `INV-${ord.id.replace('ECH-ORD-', '')}-2026`;
                const taxable = ord.totalAmount / 1.05;
                const gst = ord.totalAmount - taxable;

                return (
                  <tr key={ord.id}>
                    <td><strong>{invNo}</strong></td>
                    <td>#{ord.id}</td>
                    <td>{new Date(ord.orderDate).toLocaleDateString('en-IN')}</td>
                    <td><code>{session?.gstin || '27BBBBB1111B1Z9'}</code></td>
                    <td>₹{taxable.toFixed(2)}</td>
                    <td>₹{gst.toFixed(2)}</td>
                    <td><strong>₹{ord.totalAmount?.toLocaleString('en-IN')}</strong></td>
                    <td>
                      <button
                        type="button"
                        className="btn-table-action"
                        onClick={() => setActiveInvoice(ord)}
                      >
                        <Printer size={14} />
                        <span>Print / PDF</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <InvoiceModal
        order={activeInvoice}
        isOpen={Boolean(activeInvoice)}
        onClose={() => setActiveInvoice(null)}
      />
    </DashboardLayout>
  );
}
