import React from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { StoreService } from '../../services/storeService';
import { Truck, CheckCircle2, Clock, MapPin, ArrowLeft, Package } from 'lucide-react';

export default function WholesaleOrderTrackingPage() {
  const { id } = useParams();
  const orders = StoreService.getOrders();
  const order = orders.find((o) => o.id === id) || orders.find((o) => o.accountType === 'Wholesaler') || orders[0];

  const tracking = order?.tracking || {
    courier: 'V-Trans Logistics Heavy Freight',
    trackingNumber: 'VT-CON-902188',
    currentStage: order?.status || 'In Transit',
    estimatedDelivery: 'Tomorrow afternoon',
    timeline: [
      { title: 'Bulk Order Created & Minimum 12 Sets Validated', time: 'Day 1, 09:30', done: true },
      { title: 'Bale Packing & Master Carton Heavy Strapping', time: 'Day 1, 15:00', done: true },
      { title: 'Loaded onto Commercial Freight Carrier Truck', time: 'Day 2, 06:00', done: true },
      { title: 'In Transit to Regional Logistics Hub', time: 'Today', done: true },
      { title: 'Out for Bulk Commercial Delivery & Dynamic UPI QR Collection', time: 'Tomorrow', done: false },
    ]
  };

  return (
    <DashboardLayout
      title={`Freight Consignment Tracking • #${order?.id}`}
      subtitle="Heavy bale logistics milestones, carrier airway bill, and depot arrival schedule."
    >
      <Link to="/wholesaler/orders" className="back-link mb-4">
        <ArrowLeft size={16} />
        <span>Back to Wholesale Orders</span>
      </Link>

      <div className="tracking-summary-card">
        <div className="tracking-summary-left">
          <span className="courier-badge">{tracking.courier}</span>
          <h2>Airway Freight Bill: {tracking.trackingNumber}</h2>
          <p className="tracking-current-status">
            Consignment Status: <strong>{order?.status}</strong> • Expected Depot Unloading: <strong>{tracking.estimatedDelivery}</strong>
          </p>
        </div>
        <div className="tracking-summary-right">
          <span className="pay-mode-pill">
            Payment: {order?.paymentMethod === 'ONLINE_UPI' ? 'Paid Online UPI' : 'Awaiting Doorstep UPI'}
          </span>
        </div>
      </div>

      <div className="tracking-timeline-card mt-6">
        <h3 className="timeline-title">Heavy Freight Transit Progression</h3>
        <div className="tracking-stepper-visual mt-6">
          {tracking.timeline?.map((step, idx) => (
            <div key={idx} className={`timeline-milestone-item ${step.done ? 'milestone-done' : 'milestone-pending'}`}>
              <div className="milestone-icon-circle">
                {step.done ? <CheckCircle2 size={18} className="text-gold" /> : <Clock size={16} />}
              </div>
              <div className="milestone-text-block">
                <h4 className="milestone-step-name">{step.title}</h4>
                <span className="milestone-step-time">{step.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
