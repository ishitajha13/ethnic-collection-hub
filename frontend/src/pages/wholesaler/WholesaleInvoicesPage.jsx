import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import InvoiceModal from '../../components/InvoiceModal';
import { StoreService } from '../../services/storeService';
import { getCurrentSession } from '../../services/authService';
import { Printer, Download, FileText, CheckCircle2 } from 'lucide-react';

export default function WholesaleInvoicesPage() {
  const session = getCurrentSession();
  const allOrders = StoreService.getOrders();
  const wholesaleOrders = allOrders.filter(
    (o) => o.accountType === 'Wholesaler' || o.userEmail === session?.email
  );

  const [activeInvoice, setActiveInvoice] = useState(null);

  return (
    <DashboardLayout
      title="B2B Commercial Tax Invoices"
      subtitle="Corporate GST-compliant tax invoices with HSN classifications and reverse-charge data."
    >
      <div className="invoices-table-card">
        <div className="card-header-bar flex justify-between items-center mb-4">
          <h3 className="font-bold text-lg">Wholesale Tax Invoices ({wholesaleOrders.length})</h3>
          <span className="text-xs text-muted">All invoices comply with Rule 46 of CGST Rules 2017.</span>
        </div>

        <div className="dashboard-table-wrap">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Invoice No</th>
                <th>Order Ref</th>
                <th>Invoice Date</th>
                <th>Firm GSTIN</th>
                <th>Taxable Val</th>
                <th>GST (5%)</th>
                <th>Total Value</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {wholesaleOrders.map((ord) => {
                const invNo = `INV-${ord.id.replace('ECH-ORD-', '')}-2026`;
                const taxable = ord.totalAmount / 1.05;
                const gst = ord.totalAmount - taxable;

                return (
                  <tr key={ord.id}>
                    <td><strong>{invNo}</strong></td>
                    <td>#{ord.id}</td>
                    <td>{new Date(ord.orderDate).toLocaleDateString('en-IN')}</td>
                    <td><code>{session?.gstin || '07AAAAA0000A1Z5'}</code></td>
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
