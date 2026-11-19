import React from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { StoreService } from '../../services/storeService';
import { Truck, CheckCircle2, Clock, MapPin, ArrowLeft, ShieldCheck } from 'lucide-react';

export default function RetailerOrderTrackingPage() {
  const { id } = useParams();
  const orders = StoreService.getOrders();
  const order = orders.find((o) => o.id === id) || orders.find((o) => o.accountType === 'Retailer') || orders[0];

  const tracking = order?.tracking || {
    courier: 'Delhivery Express B2B',
    trackingNumber: 'DLV-B2B-440192',
    currentStage: order?.status || 'Dispatched',
    estimatedDelivery: 'In 2 Days',
    timeline: [
      { title: 'B2B Consignment Created & GST Verified', time: 'Day 1, 11:00', done: true },
      { title: 'Boutique Security Packaging & Hologram Sealing', time: 'Day 1, 17:45', done: true },
      { title: 'Dispatched from Central Warehouse via Dedicated Cargo Truck', time: 'Day 2, 08:00', done: true },
      { title: 'Regional Delivery Hub Sorting (B2B Bay)', time: 'Today', done: true },
      { title: 'Out for Store Delivery & Verified UPI Gateway Handover', time: 'Tomorrow 10:00', done: false },
    ]
  };

  return (
    <DashboardLayout
      title={`B2B Consignment Tracking • #${order?.id}`}
      subtitle="Heavy cargo logistics updates, truck manifest, and store arrival milestones."
    >
      <Link to="/retailer/orders" className="back-link mb-4">
        <ArrowLeft size={16} />
        <span>Back to Consignment List</span>
      </Link>

      <div className="tracking-summary-card">
        <div className="tracking-summary-left">
          <span className="courier-badge">{tracking.courier}</span>
          <h2>Cargo Consignment: {tracking.trackingNumber}</h2>
          <p className="tracking-current-status">
            Status: <strong>{order?.status}</strong> • Expected Store Delivery: <strong>{tracking.estimatedDelivery}</strong>
          </p>
        </div>
        <div className="tracking-summary-right">
          <span className="pay-mode-pill">
            Payment: {order?.paymentMethod === 'ONLINE_UPI' ? 'Paid via Online UPI' : 'Awaiting Doorstep UPI'}
          </span>
        </div>
      </div>

      <div className="tracking-timeline-card mt-6">
        <h3 className="timeline-title">Commercial Dispatch Milestones</h3>
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
