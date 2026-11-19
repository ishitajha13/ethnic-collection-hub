import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import AppFooter from '../../components/AppFooter';
import {
  Camera,
  Upload,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  FileCheck,
  UserCheck,
  ArrowRight,
  Lock,
  EyeOff
} from 'lucide-react';
import { scanAadhaarDocument, AADHAAR_STATUSES } from '../../services/aadhaarService';
import { getCurrentSession, updateUserProfile } from '../../services/authService';

export default function AadhaarScanPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const session = getCurrentSession();

  const [step, setStep] = useState('landing'); // 'landing' | 'capture' | 'processing' | 'review' | 'success'
  const [cameraActive, setCameraActive] = useState(false);
  const [processingStatus, setProcessingStatus] = useState('Initializing OCR Engine...');
  const [errorMsg, setErrorMsg] = useState('');
  const [extractedData, setExtractedData] = useState(null);
  const [editableForm, setEditableForm] = useState({
    fullName: session?.name || '',
    dob: '1992-06-14',
    gender: 'Female',
    maskedAadhaar: 'XXXX-XXXX-8921',
    fullAddress: session?.address || 'Flat 304, Royal Palms, Ring Road, Lajpat Nagar III, New Delhi 110024',
  });
  const [consentChecked, setConsentChecked] = useState(false);

  const handleSimulateCamera = () => {
    setCameraActive(true);
    setStep('processing');
    setProcessingStatus('Accessing local camera video feed...');

    setTimeout(() => {
      runOcrPipeline('camera_capture_feed.jpg');
    }, 1200);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setStep('processing');
    runOcrPipeline(file);
  };

  const runOcrPipeline = async (file) => {
    setErrorMsg('');
    try {
      setProcessingStatus('Detecting Aadhaar Card document boundaries...');
      await new Promise((r) => setTimeout(r, 600));

      setProcessingStatus('Running Indian KYC OCR parsing & character isolation...');
      await new Promise((r) => setTimeout(r, 700));

      setProcessingStatus('Enforcing DPDP UID masking: Generating XXXX-XXXX-####...');
      const res = await scanAadhaarDocument(file);

      setExtractedData(res.extractedData);
      setEditableForm({
        fullName: res.extractedData.fullName,
        dob: res.extractedData.dob,
        gender: res.extractedData.gender,
        maskedAadhaar: res.extractedData.maskedAadhaar,
        fullAddress: res.extractedData.fullAddress,
      });

      setStep('review');
    } catch (err) {
      setErrorMsg(err.message || 'Scanning failed. Please retry with a clearer document.');
      setStep('capture');
    } finally {
      setCameraActive(false);
    }
  };

  const handleConfirmProfile = () => {
    if (!consentChecked) {
      setErrorMsg('Please review and check the DPDP explicit consent confirmation.');
      return;
    }

    // Save to user session
    updateUserProfile({
      name: editableForm.fullName,
      dob: editableForm.dob,
      gender: editableForm.gender,
      aadhaarMasked: editableForm.maskedAadhaar,
      address: editableForm.fullAddress,
      aadhaarVerificationStatus: AADHAAR_STATUSES.VERIFIED,
      verifiedAt: new Date().toISOString(),
    });

    setStep('success');
  };

  return (
    <div className="hub-site-wrapper">
      <Navbar />

      <section className="aadhaar-hero-section">
        <div className="site-container text-center">
          <div className="badge-luxury-pill mx-auto">
            <ShieldCheck size={14} className="pill-sparkle" />
            <span>DPDP 2023 Compliant • UIDAI Privacy Safeguards</span>
          </div>
          <h1 className="page-hero-title">Aadhaar Assisted Profile Autofill</h1>
          <p className="page-hero-subtitle">
            Scan your Aadhaar document to automatically extract and verify your legal name and dispatch address.
          </p>
        </div>
      </section>

      <section className="aadhaar-workflow-section">
        <div className="site-container">
          <div className="aadhaar-workflow-card">
            
            {/* Step Indicators */}
            <div className="workflow-stepper-bar">
              <div className={`step-node ${step === 'landing' || step === 'capture' ? 'active' : 'completed'}`}>
                <span className="node-num">1</span>
                <span className="node-label">Document Scan</span>
              </div>
              <div className="node-line"></div>
              <div className={`step-node ${step === 'processing' ? 'active' : step === 'review' || step === 'success' ? 'completed' : ''}`}>
                <span className="node-num">2</span>
                <span className="node-label">OCR & Masking</span>
              </div>
              <div className="node-line"></div>
              <div className={`step-node ${step === 'review' ? 'active' : step === 'success' ? 'completed' : ''}`}>
                <span className="node-num">3</span>
                <span className="node-label">Review & Confirm</span>
              </div>
              <div className="node-line"></div>
              <div className={`step-node ${step === 'success' ? 'active completed' : ''}`}>
                <span className="node-num">4</span>
                <span className="node-label">Verified Profile</span>
              </div>
            </div>

            {/* STEP 1: LANDING & PRIVACY OVERVIEW */}
            {step === 'landing' && (
              <div className="aadhaar-landing-content">
                <div className="privacy-guarantee-banner">
                  <div className="banner-icon-col">
                    <Lock size={32} className="text-gold" />
                  </div>
                  <div className="banner-text-col">
                    <h3>Zero Unmasked Aadhaar Retention Policy</h3>
                    <p>
                      In strict compliance with the Digital Personal Data Protection (DPDP) Act and UIDAI guidelines, our platform <strong>never stores your 12-digit unmasked Aadhaar number</strong>. Document images are processed solely in temporary memory to autofill your name and address, and are purged immediately.
                    </p>
                  </div>
                </div>

                <div className="workflow-options-dual">
                  <div className="option-choice-box primary-choice">
                    <div className="choice-icon-wrap">
                      <Camera size={32} className="text-gold" />
                    </div>
                    <h4>Option 1: Scan Aadhaar Card (Recommended)</h4>
                    <p>Auto-populates verified name, DOB, and address via client-side OCR in under 15 seconds.</p>
                    <button
                      type="button"
                      className="btn-gold-action block-btn py-3 mt-4"
                      onClick={() => setStep('capture')}
                    >
                      Begin Aadhaar Document Scan
                    </button>
                  </div>

                  <div className="option-choice-box">
                    <div className="choice-icon-wrap">
                      <FileCheck size={32} />
                    </div>
                    <h4>Option 2: Fill Profile Manually</h4>
                    <p>Enter your details manually without scanning any identification document.</p>
                    <Link to="/buyer/profile" className="btn-primary-navy block-btn py-3 mt-4">
                      Continue to Manual Profile Entry
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: CAPTURE MODES */}
            {step === 'capture' && (
              <div className="aadhaar-capture-screen">
                <div className="capture-methods-grid">
                  <div className="capture-card">
                    <div className="capture-icon-circle">
                      <Camera size={36} />
                    </div>
                    <h3>Device Camera Viewfinder</h3>
                    <p>Hold your Aadhaar card steadily within the viewfinder boundary.</p>
                    <button
                      type="button"
                      className="btn-primary-navy block-btn py-3 mt-4"
                      onClick={handleSimulateCamera}
                    >
                      Launch Camera Scanner
                    </button>
                  </div>

                  <div className="capture-card">
                    <div className="capture-icon-circle">
                      <Upload size={36} />
                    </div>
                    <h3>Upload Scanned Document</h3>
                    <p>Upload a high-resolution JPG, PNG or PDF of your front Aadhaar card.</p>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                      className="hidden-file-input"
                    />
                    <button
                      type="button"
                      className="btn-gold-action block-btn py-3 mt-4"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      Select File from Device
                    </button>
                  </div>
                </div>

                {errorMsg && (
                  <div className="auth-alert-box alert-danger mt-4">
                    <AlertTriangle size={18} />
                    <span>{errorMsg}</span>
                  </div>
                )}
              </div>
            )}

            {/* STEP 3: PROCESSING ANIMATION */}
            {step === 'processing' && (
              <div className="aadhaar-processing-screen text-center py-10">
                <div className="processing-spinner-box mx-auto">
                  <div className="radar-scan-anim">
                    <div className="card-mock-wire">
                      <span className="scan-laser-line"></span>
                    </div>
                  </div>
                  <h3 className="mt-4">{processingStatus}</h3>
                  <p className="text-muted">Purging raw visual buffers from memory • Applying UID mask...</p>
                </div>
              </div>
            )}

            {/* STEP 4: REVIEW & CONFIRM */}
            {step === 'review' && (
              <div className="aadhaar-review-screen">
                <div className="extraction-success-badge">
                  <CheckCircle2 size={20} className="text-gold" />
                  <span>Document parsed successfully. Please verify your details before saving:</span>
                </div>

                <div className="review-fields-form mt-4">
                  <div className="form-row-dual">
                    <div className="form-field-unit">
                      <label className="input-field-label">Full Legal Name (as on Aadhaar)</label>
                      <input
                        type="text"
                        value={editableForm.fullName}
                        onChange={(e) => setEditableForm({ ...editableForm, fullName: e.target.value })}
                        className="input-field-control"
                      />
                    </div>
                    <div className="form-field-unit">
                      <label className="input-field-label">Date of Birth</label>
                      <input
                        type="date"
                        value={editableForm.dob}
                        onChange={(e) => setEditableForm({ ...editableForm, dob: e.target.value })}
                        className="input-field-control"
                      />
                    </div>
                  </div>

                  <div className="form-row-dual">
                    <div className="form-field-unit">
                      <label className="input-field-label">Gender</label>
                      <select
                        value={editableForm.gender}
                        onChange={(e) => setEditableForm({ ...editableForm, gender: e.target.value })}
                        className="input-field-control"
                      >
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="form-field-unit">
                      <label className="input-field-label">Masked Aadhaar Number (Protected)</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={editableForm.maskedAadhaar}
                          readOnly
                          className="input-field-control disabled-input"
                        />
                        <span className="masked-info-badge">Last 4 Digits Only</span>
                      </div>
                    </div>
                  </div>

                  <div className="form-field-unit">
                    <label className="input-field-label">Extracted Dispatch & Billing Address</label>
                    <textarea
                      rows="3"
                      value={editableForm.fullAddress}
                      onChange={(e) => setEditableForm({ ...editableForm, fullAddress: e.target.value })}
                      className="input-field-control"
                    ></textarea>
                  </div>

                  {/* DPDP Consent */}
                  <div className="dpdp-consent-box my-4">
                    <label className="checkbox-label" htmlFor="page-aadhaar-consent">
                      <input
                        type="checkbox"
                        id="page-aadhaar-consent"
                        checked={consentChecked}
                        onChange={(e) => setConsentChecked(e.target.checked)}
                        className="custom-checkbox"
                      />
                      <span className="checkbox-text">
                        I confirm that the above information is accurate and belongs to me. I grant explicit consent under the Digital Personal Data Protection Act to store this verified name and address for order processing, logistics dispatch, and fraud prevention. I understand that the original document image has been purged.
                      </span>
                    </label>
                  </div>

                  {errorMsg && (
                    <div className="auth-alert-box alert-danger mb-4">
                      <AlertTriangle size={18} />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-4 border-t">
                    <button
                      type="button"
                      className="btn-modal-cancel"
                      onClick={() => setStep('capture')}
                    >
                      <RotateCcw size={15} />
                      <span>Re-scan Document</span>
                    </button>

                    <button
                      type="button"
                      className="btn-primary-navy py-3 px-6"
                      onClick={handleConfirmProfile}
                    >
                      Confirm Details & Update Profile
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: SUCCESS */}
            {step === 'success' && (
              <div className="aadhaar-success-screen text-center py-8">
                <CheckCircle2 size={64} className="text-gold mx-auto mb-4" />
                <h2 className="text-2xl font-bold">Aadhaar Profile Verification Completed!</h2>
                <p className="text-muted max-w-lg mx-auto mt-2">
                  Your profile has been authenticated. A <strong>Verified Aadhaar KYC</strong> badge is now attached to your account for seamless order dispatch.
                </p>

                <div className="verified-summary-card max-w-md mx-auto my-6 text-left">
                  <div className="summary-row"><span>Name:</span> <strong>{editableForm.fullName}</strong></div>
                  <div className="summary-row"><span>Masked UID:</span> <strong>{editableForm.maskedAadhaar}</strong></div>
                  <div className="summary-row"><span>KYC Status:</span> <strong className="text-success">Verified</strong></div>
                </div>

                <div className="flex gap-4 justify-center">
                  <Link to="/buyer/dashboard" className="btn-primary-navy">
                    Go to Account Dashboard
                  </Link>
                  <Link to="/shop" className="btn-gold-action">
                    Explore Collections
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <AppFooter />
    </div>
  );
}
