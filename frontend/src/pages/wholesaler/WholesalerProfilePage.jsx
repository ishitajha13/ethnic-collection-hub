import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { getCurrentSession, updateUserProfile } from '../../services/authService';
import { Building2, Mail, Phone, FileText, ShieldCheck, CheckCircle2, Camera } from 'lucide-react';
import AadhaarScannerModal from '../../components/AadhaarScannerModal';

export default function WholesalerProfilePage() {
  const session = getCurrentSession();

  const [formData, setFormData] = useState({
    businessName: session?.businessName || 'Singhania Silk & Sarees Syndicate',
    contactPerson: session?.name || 'Rajesh Singhania',
    gstin: session?.gstin || '07AAAAA0000A1Z5',
    phone: session?.phone || '+91 98110 23456',
    email: session?.email || 'wholesaler@ethniccollectionhub.com',
    address: session?.address || 'Bale Depot 4, Gali Paranthe Wali, Chandni Chowk, Delhi 110006',
    licenseNo: 'WHL-DL-2026-90412',
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
      title="Wholesale Enterprise Profile"
      subtitle="Corporate credentials, export code, and commercial tax accreditation."
    >
      <div className="profile-layout-grid">
        <div className="profile-card">
          <div className="card-header-bar">
            <h3>Wholesale Firm Credentials</h3>
          </div>

          {savedSuccess && (
            <div className="auth-alert-box alert-success mb-4">
              <CheckCircle2 size={18} />
              <span>Wholesale firm details updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="profile-edit-form">
            <div className="form-field-unit">
              <label className="input-field-label">Firm / Mill Syndicate Legal Name</label>
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
                <label className="input-field-label">Authorized Signatory Name</label>
                <input
                  type="text"
                  required
                  value={formData.contactPerson}
                  onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                  className="input-field-control"
                />
              </div>
              <div className="form-field-unit">
                <label className="input-field-label">Wholesale Trade License No</label>
                <input
                  type="text"
                  value={formData.licenseNo}
                  onChange={(e) => setFormData({ ...formData, licenseNo: e.target.value })}
                  className="input-field-control"
                />
              </div>
            </div>

            <div className="form-row-dual">
              <div className="form-field-unit">
                <label className="input-field-label">Firm GSTIN (For ITC Tax Credit)</label>
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
              <div className="form-field-unit">
                <label className="input-field-label">Official Business Contact</label>
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
              <label className="input-field-label">Master Bale Depot / Commercial Dispatch Address</label>
              <textarea
                rows="3"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="input-field-control"
              ></textarea>
            </div>

            <button type="submit" className="btn-primary-navy mt-4">
              Save Wholesale Credentials
            </button>
          </form>
        </div>

        {/* Commercial KYC & Trade Verification */}
        <div className="profile-kyc-card">
          <div className="kyc-card-header">
            <ShieldCheck size={28} className="text-gold" />
            <div>
              <h3>Verified Wholesaler Partner</h3>
              <p className="text-sm text-muted">Tier 1 Commercial Account</p>
            </div>
          </div>

          <div className="kyc-status-block">
            <span className="kyc-status-label">B2B Trade Status:</span>
            <span className="kyc-status-value status-verified">Active Wholesale License</span>
          </div>

          <div className="masked-uid-display">
            <span>Proprietor Aadhaar KYC:</span>
            <code>{session?.aadhaarMasked || 'XXXX-XXXX-8921'}</code>
          </div>

          <div className="partner-perks-box mt-4">
            <h4>Commercial Wholesale Privileges:</h4>
            <ul>
              <li>✓ Mandatory MOQ: 12 Clothing Sets per Order</li>
              <li>✓ Tier 2 Bulk Rebate: 5% Off on 24+ Sets</li>
              <li>✓ Tier 3 Super-Bulk Rebate: 10% Off on 36+ Sets</li>
              <li>✓ Commercial Freight & Master Bale Logistics</li>
              <li>✓ B2B Tax Invoices with Reverse Charge Tracking</li>
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
