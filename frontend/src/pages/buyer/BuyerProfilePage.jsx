import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { getCurrentSession, updateUserProfile } from '../../services/authService';
import { User, Mail, Phone, MapPin, ShieldCheck, CheckCircle2, Camera } from 'lucide-react';
import AadhaarScannerModal from '../../components/AadhaarScannerModal';

export default function BuyerProfilePage() {
  const session = getCurrentSession();

  const [formData, setFormData] = useState({
    name: session?.name || 'Priya Sharma',
    email: session?.email || 'buyer@ethniccollectionhub.com',
    phone: session?.phone || '+91 98765 43210',
    address: session?.address || 'B-402, Godrej Woods, Sector 43, Noida 201301',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUserProfile({
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAadhaarSuccess = (updated) => {
    setFormData((prev) => ({
      ...prev,
      name: updated.name,
      address: updated.address,
    }));
    setIsModalOpen(false);
    setSavedSuccess(true);
  };

  return (
    <DashboardLayout
      title="Personal Profile & Identity"
      subtitle="Manage your personal details and verified identity accreditation."
    >
      <div className="profile-layout-grid">
        {/* Left Column: Form */}
        <div className="profile-card">
          <div className="card-header-bar">
            <h3>Contact & Billing Credentials</h3>
          </div>

          {savedSuccess && (
            <div className="auth-alert-box alert-success mb-4">
              <CheckCircle2 size={18} />
              <span>Profile details updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="profile-edit-form">
            <div className="form-field-unit">
              <label className="input-field-label">Full Legal Name</label>
              <div className="input-with-icon">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field-control"
                  required
                />
              </div>
            </div>

            <div className="form-field-unit">
              <label className="input-field-label">Registered Email</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  value={formData.email}
                  disabled
                  className="input-field-control disabled-input"
                />
              </div>
            </div>

            <div className="form-field-unit">
              <label className="input-field-label">Mobile Number</label>
              <div className="input-with-icon">
                <Phone size={18} className="input-icon" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-field-control"
                />
              </div>
            </div>

            <div className="form-field-unit">
              <label className="input-field-label">Default Delivery & Billing Address</label>
              <textarea
                rows="3"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="input-field-control"
              ></textarea>
            </div>

            <button type="submit" className="btn-primary-navy mt-4">
              Save Profile Changes
            </button>
          </form>
        </div>

        {/* Right Column: Aadhaar Verification Card */}
        <div className="profile-kyc-card">
          <div className="kyc-card-header">
            <ShieldCheck size={28} className="text-gold" />
            <div>
              <h3>Aadhaar KYC Verification</h3>
              <p className="text-sm text-muted">DPDP Act 2023 Identity Accreditation</p>
            </div>
          </div>

          <div className="kyc-status-block">
            <span className="kyc-status-label">Verification Status:</span>
            <span className="kyc-status-value status-verified">
              {session?.aadhaarVerificationStatus || 'Verified'}
            </span>
          </div>

          <div className="masked-uid-display">
            <span>Masked Aadhaar Number:</span>
            <code>{session?.aadhaarMasked || 'XXXX-XXXX-1984'}</code>
          </div>

          <p className="kyc-info-note">
            Your identity is verified in accordance with UIDAI privacy standards. Unmasked numbers are never stored on platform databases.
          </p>

          <button
            type="button"
            className="btn-gold-action block-btn mt-4"
            onClick={() => setIsModalOpen(true)}
          >
            <Camera size={16} />
            <span>Re-scan Aadhaar Document</span>
          </button>
        </div>
      </div>

      <AadhaarScannerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onVerificationSuccess={handleAadhaarSuccess}
      />
    </DashboardLayout>
  );
}
