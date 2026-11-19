import React from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { StoreService } from '../../services/storeService';
import {
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  RotateCcw,
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';

export default function BuyerOrderTrackingPage() {
  const { id } = useParams();
  const orders = StoreService.getOrders();
  const order = orders.find((o) => o.id === id) || orders[0];

  const tracking = order?.tracking || {
    courier: 'BlueDart Express',
    trackingNumber: 'BD-DEL-7782193',
    currentStage: order?.status || 'Confirmed',
    estimatedDelivery: 'In 2-3 Days',
    timeline: [
      { title: 'Order Placed & Digital UPI Payment Confirmed', time: 'Day 1, 10:14', done: true },
      { title: 'Artisan Silk Mark Quality Inspection & Hologram Applied', time: 'Day 1, 16:30', done: true },
      { title: 'Dispatched via Delhi Central Fulfillment Hub', time: 'Day 2, 09:00', done: true },
      { title: 'Out for Doorstep Handover & Dynamic QR Verification', time: 'Today', done: order?.status === 'Delivered' },
      { title: 'Delivered (5-Day Transit Damage Window Active)', time: 'Pending', done: order?.status === 'Delivered' },
    ]
  };

  return (
    <DashboardLayout
      title={`Live Consignment Tracking • #${order?.id}`}
      subtitle="Real-time multi-stage logistics updates and dispatch milestones."
    >
      <div className="tracking-page-container">
        <Link to="/buyer/orders" className="back-link mb-4">
          <ArrowLeft size={16} />
          <span>Back to Order History</span>
        </Link>

        {/* Top Tracking Status Card */}
        <div className="tracking-summary-card">
          <div className="tracking-summary-left">
            <span className="courier-badge">{tracking.courier}</span>
            <h2>Tracking AWB: {tracking.trackingNumber}</h2>
            <p className="tracking-current-status">
              Current Status: <strong>{order?.status}</strong> • Expected: <strong>{tracking.estimatedDelivery}</strong>
            </p>
          </div>

          <div className="tracking-summary-right">
            <span className="pay-mode-pill">
              Payment: {order?.paymentMethod === 'ONLINE_UPI' ? 'Paid Online UPI' : 'UPI on Delivery'}
            </span>
          </div>
        </div>

        {/* Interactive Milestones Timeline */}
        <div className="tracking-timeline-card mt-6">
          <h3 className="timeline-title">Logistics Milestone Journey</h3>

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

        {/* Address and Return Notice Grid */}
        <div className="tracking-details-dual-grid mt-6">
          <div className="tracking-info-box">
            <div className="flex items-center gap-2 mb-2">
              <MapPin size={18} className="text-gold" />
              <h4>Delivery Destination</h4>
            </div>
            <p className="font-semibold">{order?.shippingAddress?.fullName}</p>
            <p className="text-sm text-muted">{order?.shippingAddress?.addressLine1}</p>
            <p className="text-sm text-muted">{order?.shippingAddress?.city}, {order?.shippingAddress?.state} - {order?.shippingAddress?.pincode}</p>
            <p className="text-xs text-muted mt-2">Mobile: {order?.shippingAddress?.phone}</p>
          </div>

          <div className="tracking-info-box border-gold">
            <div className="flex items-center gap-2 mb-2">
              <RotateCcw size={18} className="text-gold" />
              <h4>5-Day Damage Inspection Rule</h4>
            </div>
            <p className="text-sm text-muted">
              Once delivered, you have <strong>5 calendar days</strong> to report any structural transit damage. Returns are accepted exclusively for damaged clothing with photographic evidence.
            </p>
            <Link to="/buyer/returns" className="gold-text-link mt-3 inline-block">
              View Damage Claim Guidelines →
            </Link>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
