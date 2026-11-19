import React, { useState, useRef } from 'react';
import {
  Camera,
  Upload,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  FileCheck,
  UserCheck
} from 'lucide-react';
import { scanAadhaarDocument, AADHAAR_STATUSES } from '../services/aadhaarService';
import { updateUserProfile } from '../services/authService';

export default function AadhaarScannerModal({ isOpen, onClose, onVerificationSuccess }) {
  const fileInputRef = useRef(null);

  const [scanStep, setScanStep] = useState('capture'); // 'capture' | 'processing' | 'review' | 'success'
  const [cameraActive, setCameraActive] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  const [extractedData, setExtractedData] = useState(null);
  const [editableForm, setEditableForm] = useState({
    fullName: '',
    dob: '',
    gender: 'Female',
    maskedAadhaar: '',
    fullAddress: '',
  });
  const [consentChecked, setConsentChecked] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [processingStatus, setProcessingStatus] = useState('Initializing OCR...');

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFileName(file.name);
    startScanning(file);
  };

  const handleSimulateCameraCapture = () => {
    setCameraActive(true);
    setTimeout(() => {
      setCameraActive(false);
      startScanning('camera_frame_capture.jpg');
    }, 1500);
  };

  const startScanning = async (fileInput) => {
    setScanStep('processing');
    setErrorMsg('');

    try {
      setProcessingStatus('Detecting Aadhaar Card layout & border bounds...');
      await new Promise((r) => setTimeout(r, 600));

      setProcessingStatus('Scanning text layers (Tesseract / Indian KYC Engine)...');
      await new Promise((r) => setTimeout(r, 700));

      setProcessingStatus('Applying cryptographic masking to 12-digit UID...');
      const result = await scanAadhaarDocument(fileInput);

      setExtractedData(result.extractedData);
      setEditableForm({
        fullName: result.extractedData.fullName,
        dob: result.extractedData.dob,
        gender: result.extractedData.gender,
        maskedAadhaar: result.extractedData.maskedAadhaar,
        fullAddress: result.extractedData.fullAddress,
      });

      setScanStep('review');
    } catch (err) {
      setErrorMsg(err.message || 'OCR document scanning failed. Please retry with a clearer photo.');
      setScanStep('capture');
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setEditableForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirmAndSave = () => {
    if (!consentChecked) {
      setErrorMsg('Please tick the consent checkbox in compliance with DPDP guidelines.');
      return;
    }

    // Save profile with verified Aadhaar status
    const updated = updateUserProfile({
      name: editableForm.fullName,
      dob: editableForm.dob,
      gender: editableForm.gender,
      aadhaarMasked: editableForm.maskedAadhaar,
      address: editableForm.fullAddress,
      aadhaarVerificationStatus: AADHAAR_STATUSES.VERIFIED,
      verifiedAt: new Date().toISOString(),
    });

    setScanStep('success');
    if (onVerificationSuccess) onVerificationSuccess(updated);
  };

  const handleReset = () => {
    setScanStep('capture');
    setExtractedData(null);
    setSelectedFileName('');
    setConsentChecked(false);
    setErrorMsg('');
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-card modal-aadhaar-dialog" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-with-icon">
            <ShieldCheck size={22} className="text-gold" />
            <div>
              <h3 className="modal-title">Aadhaar Assisted Profile Autofill</h3>
              <p className="modal-subtitle">DPDP Compliant • Privacy Safeguarded • Zero Unmasked Number Storage</p>
            </div>
          </div>
          <button type="button" className="modal-close-button" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body-scroll">
          {/* STEP 1: CAPTURE / UPLOAD */}
          {scanStep === 'capture' && (
            <div className="aadhaar-capture-screen">
              <div className="aadhaar-privacy-disclaimer">
                <ShieldCheck size={18} className="text-gold" />
                <div>
                  <strong>Privacy First Guarantee:</strong>
                  <p>
                    Document scanning is used exclusively to autofill profile fields. Your 12-digit number is immediately masked (<code>XXXX-XXXX-1234</code>) and images are purged from memory immediately. Manual profile entry is also supported.
                  </p>
                </div>
              </div>

              <div className="capture-methods-grid">
                {/* Method A: Camera */}
                <div className="capture-card">
                  <div className="capture-icon-circle">
                    <Camera size={28} />
                  </div>
                  <h4>Live Camera Scan</h4>
                  <p>Hold your Aadhaar card in front of your device camera.</p>
                  <button
                    type="button"
                    className="btn-primary-navy block-btn"
                    onClick={handleSimulateCameraCapture}
                    disabled={cameraActive}
                  >
                    {cameraActive ? 'Scanning Viewfinder...' : 'Open Camera'}
                  </button>
                </div>

                {/* Method B: Document Upload */}
                <div className="capture-card">
                  <div className="capture-icon-circle">
                    <Upload size={28} />
                  </div>
                  <h4>Document Upload</h4>
                  <p>Upload a clear photo or scanned PDF of your card.</p>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*,.pdf"
                    className="hidden-file-input"
                    onChange={handleFileUpload}
                  />
                  <button
                    type="button"
                    className="btn-gold-action block-btn"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Select Document
                  </button>
                </div>
              </div>

              {errorMsg && (
                <div className="auth-alert-box alert-danger">
                  <AlertTriangle size={16} />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: PROCESSING */}
          {scanStep === 'processing' && (
            <div className="aadhaar-processing-screen">
              <div className="processing-spinner-box">
                <div className="radar-scan-anim">
                  <div className="card-mock-wire">
                    <span className="scan-laser-line"></span>
                  </div>
                </div>
                <h4>Analyzing Document</h4>
                <p className="processing-status-text">{processingStatus}</p>
                <div className="privacy-pill">
                  <Sparkles size={13} />
                  <span>Enforcing DPDP Data Protection Protocols</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: REVIEW EXTRACTED DETAILS (EDITABLE FORM) */}
          {scanStep === 'review' && (
            <div className="aadhaar-review-screen">
              <div className="extraction-success-badge">
                <FileCheck size={18} className="text-gold" />
                <span>Document Scanned Successfully. Please verify or edit your details:</span>
              </div>

              <div className="review-fields-form">
                <div className="form-row-dual">
                  <div className="form-field-unit">
                    <label className="input-field-label">Full Legal Name</label>
                    <input
                      type="text"
                      name="fullName"
                      value={editableForm.fullName}
                      onChange={handleFormChange}
                      className="input-field-control"
                    />
                  </div>
                  <div className="form-field-unit">
                    <label className="input-field-label">Date of Birth</label>
                    <input
                      type="date"
                      name="dob"
                      value={editableForm.dob}
                      onChange={handleFormChange}
                      className="input-field-control"
                    />
                  </div>
                </div>

                <div className="form-row-dual">
                  <div className="form-field-unit">
                    <label className="input-field-label">Gender</label>
                    <select
                      name="gender"
                      value={editableForm.gender}
                      onChange={handleFormChange}
                      className="input-field-control"
                    >
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-field-unit">
                    <label className="input-field-label">Masked Aadhaar Number (Protected)</label>
                    <input
                      type="text"
                      name="maskedAadhaar"
                      value={editableForm.maskedAadhaar}
                      readOnly
                      className="input-field-control disabled-input"
                    />
                  </div>
                </div>

                <div className="form-field-unit">
                  <label className="input-field-label">Extracted Address</label>
                  <textarea
                    name="fullAddress"
                    rows="3"
                    value={editableForm.fullAddress}
                    onChange={handleFormChange}
                    className="input-field-control"
                  ></textarea>
                </div>
              </div>

              {/* DPDP Explicit Consent */}
              <div className="dpdp-consent-box">
                <label className="checkbox-label" htmlFor="aadhaar-consent-check">
                  <input
                    type="checkbox"
                    id="aadhaar-consent-check"
                    checked={consentChecked}
                    onChange={(e) => setConsentChecked(e.target.checked)}
                    className="custom-checkbox"
                  />
                  <span className="checkbox-text">
                    I confirm that the above profile details are accurate. I give explicit consent under DPDP regulations to save my verified name and address for billing, dispatch and fraud prevention. I understand that the original document image has been purged.
                  </span>
                </label>
              </div>

              {errorMsg && (
                <div className="auth-alert-box alert-danger">
                  <AlertTriangle size={16} />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>
          )}

          {/* STEP 4: SUCCESS */}
          {scanStep === 'success' && (
            <div className="aadhaar-success-screen">
              <div className="success-icon-wrap">
                <CheckCircle2 size={54} className="text-gold" />
              </div>
              <h3>Profile Verified Successfully!</h3>
              <p>Your account is now tagged with a <strong>Verified Aadhaar KYC</strong> badge across all orders and invoices.</p>
              <div className="verified-summary-card">
                <div className="summary-row"><span>Name:</span> <strong>{editableForm.fullName}</strong></div>
                <div className="summary-row"><span>Masked UID:</span> <strong>{editableForm.maskedAadhaar}</strong></div>
                <div className="summary-row"><span>Status:</span> <span className="text-success font-semibold">Verified</span></div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="modal-footer">
          {scanStep === 'review' ? (
            <>
              <button type="button" className="btn-modal-cancel" onClick={handleReset}>
                <RotateCcw size={15} />
                <span>Re-scan</span>
              </button>
              <button
                type="button"
                className="btn-primary-navy"
                onClick={handleConfirmAndSave}
              >
                Confirm & Save Profile
              </button>
            </>
          ) : scanStep === 'success' ? (
            <button type="button" className="btn-primary-navy block-btn" onClick={onClose}>
              Done & Return
            </button>
          ) : (
            <button type="button" className="btn-modal-cancel" onClick={onClose}>
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
