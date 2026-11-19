import React, { useState } from 'react';
import { X, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { requestPasswordReset } from '../services/authService';

export default function ForgotPasswordModal({ isOpen, onClose, defaultEmail = '' }) {
  const [email, setEmail] = useState(defaultEmail);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { success: boolean, message: string }

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await requestPasswordReset(email);
      setStatus({ success: true, message: res.message });
    } catch (err) {
      setStatus({ success: false, message: err.message || 'Failed to request reset.' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStatus(null);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleClose} role="dialog" aria-modal="true">
      <div className="modal-card modal-compact" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Reset Your Password</h3>
          <button
            type="button"
            className="modal-close-btn"
            onClick={handleClose}
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <p className="modal-lead-text">
            Enter the email address associated with your <strong>Ethnic Collection Hub</strong> account and we will send you a verification link to reset your credentials.
          </p>

          {status && (
            <div
              className={`status-message-banner ${
                status.success ? 'status-success' : 'status-error'
              }`}
            >
              {status.success ? (
                <CheckCircle2 size={18} className="status-icon" />
              ) : (
                <AlertCircle size={18} className="status-icon" />
              )}
              <span>{status.message}</span>
            </div>
          )}

          {!status?.success && (
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-field-group">
                <label htmlFor="reset-email" className="form-field-label">
                  Email Address
                </label>
                <div className="input-control-wrapper">
                  <span className="input-icon-left" aria-hidden="true">
                    <Mail size={18} />
                  </span>
                  <input
                    id="reset-email"
                    type="email"
                    required
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-element has-left-icon"
                  />
                </div>
              </div>

              <div className="modal-form-actions">
                <button
                  type="button"
                  className="modal-secondary-btn"
                  onClick={handleClose}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="modal-action-btn"
                  disabled={loading}
                >
                  {loading ? 'Sending Link...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          )}

          {status?.success && (
            <div className="modal-form-actions modal-actions-center">
              <button
                type="button"
                className="modal-action-btn"
                onClick={handleClose}
              >
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
