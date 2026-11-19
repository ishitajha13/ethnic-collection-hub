import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { getCurrentSession, updateUserProfile } from '../../services/authService';
import { Building2, Mail, Phone, FileText, ShieldCheck, CheckCircle2, Camera } from 'lucide-react';
import AadhaarScannerModal from '../../components/AadhaarScannerModal';

export default function RetailerProfilePage() {
  const session = getCurrentSession();

  const [formData, setFormData] = useState({
    businessName: session?.businessName || 'Ananya Bridal & Couture Boutique',
    contactPerson: session?.name || 'Ananya Deshmukh',
    gstin: session?.gstin || '27BBBBB1111B1Z9',
    phone: session?.phone || '+91 98220 87654',
    email: session?.email || 'retailer@ethniccollectionhub.com',
    address: session?.address || 'Shop 12, Phoenix Marketcity, Kurla, Mumbai 400070',
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateUserProfile({
      businessName: formData.businessName,
      name: formData.contactPerson,
      gstin: formData.gstin,
      phone: formData.phone,
      address: formData.address,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAadhaarDone = (updated) => {
    setFormData((prev) => ({
      ...prev,
      contactPerson: updated.name,
      address: updated.address,
    }));
    setIsModalOpen(false);
    setSavedSuccess(true);
  };

  return (
    <DashboardLayout
      title="Retail Enterprise Profile"
      subtitle="Manage registered commercial boutique credentials, GSTIN, and tax details."
    >
      <div className="profile-layout-grid">
        <div className="profile-card">
          <div className="card-header-bar">
            <h3>Boutique Enterprise Credentials</h3>
          </div>

          {savedSuccess && (
            <div className="auth-alert-box alert-success mb-4">
              <CheckCircle2 size={18} />
              <span>Boutique credentials updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="profile-edit-form">
            <div className="form-field-unit">
              <label className="input-field-label">Store / Boutique Legal Name</label>
              <div className="input-with-icon">
                <Building2 size={18} className="input-icon" />
                <input
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  className="input-field-control"
                />
              </div>
            </div>

            <div className="form-row-dual">
              <div className="form-field-unit">
                <label className="input-field-label">Authorized Proprietor / Contact Person</label>
                <input
                  type="text"
                  required
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="input-field-control"
                />
              </div>

              <div className="form-field-unit">
                <label className="input-field-label">GSTIN (For Input Tax Credit)</label>
                <div className="input-with-icon">
                  <FileText size={18} className="input-icon" />
                  <input
                    type="text"
                    required
                    value={formData.gstin}
                    onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                    className="input-field-control"
                  />
                </div>
              </div>
            </div>

            <div className="form-row-dual">
              <div className="form-field-unit">
                <label className="input-field-label">Official Retailer Email</label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="email"
                    disabled
                    value={formData.email}
                    className="input-field-control disabled-input"
                  />
                </div>
              </div>

              <div className="form-field-unit">
                <label className="input-field-label">Business Phone Number</label>
                <div className="input-with-icon">
                  <Phone size={18} className="input-icon" />
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="input-field-control"
                  />
                </div>
              </div>
            </div>

            <div className="form-field-unit">
              <label className="input-field-label">Registered Boutique Store & Billing Address</label>
              <textarea
                rows="3"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="input-field-control"
              ></textarea>
            </div>

            <button type="submit" className="btn-primary-navy mt-4">
              Update Commercial Profile
            </button>
          </form>
        </div>

        {/* Commercial KYC & Trade Verification */}
        <div className="profile-kyc-card">
          <div className="kyc-card-header">
            <ShieldCheck size={28} className="text-gold" />
            <div>
              <h3>Verified Retail Trade Partner</h3>
              <p className="text-sm text-muted">B2B Commercial Accreditation</p>
            </div>
          </div>

          <div className="kyc-status-block">
            <span className="kyc-status-label">Trade Verification:</span>
            <span className="kyc-status-value status-verified">Verified Partner</span>
          </div>

          <div className="masked-uid-display">
            <span>Proprietor Aadhaar KYC:</span>
            <code>{session?.aadhaarMasked || 'XXXX-XXXX-4512'}</code>
          </div>

          <div className="partner-perks-box mt-4">
            <h4>Authorized Retail Benefits:</h4>
            <ul>
              <li>✓ 35-45% Margins Below Consumer MRP</li>
              <li>✓ Priority Dispatch from Central Weaving Hubs</li>
              <li>✓ Automated GST Invoices with Input Credit</li>
              <li>✓ 5-Day Transit Damage Replacement Guarantee</li>
            </ul>
          </div>

          <button
            type="button"
            className="btn-gold-action block-btn mt-6"
            onClick={() => setIsModalOpen(true)}
          >
            <Camera size={16} />
            <span>Update Aadhaar Document</span>
          </button>
        </div>
      </div>

      <AadhaarScannerModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onVerificationSuccess={handleAadhaarDone}
      />
    </DashboardLayout>
  );
}
