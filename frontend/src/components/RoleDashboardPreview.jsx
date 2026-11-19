import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, ShieldCheck, ArrowRight, LogOut, Package, Store, ShoppingBag } from 'lucide-react';
import { ACCOUNT_TYPES } from '../services/authService';

export default function RoleDashboardPreview({ user, onLogout, onProceed }) {
  const navigate = useNavigate();

  if (!user) return null;

  const getRoleIcon = () => {
    switch (user.accountType) {
      case ACCOUNT_TYPES.WHOLESALER:
        return <Package size={28} className="role-preview-icon" />;
      case ACCOUNT_TYPES.RETAILER:
        return <Store size={28} className="role-preview-icon" />;
      case ACCOUNT_TYPES.BUYER:
        return <ShoppingBag size={28} className="role-preview-icon" />;
      default:
        return <Package size={28} className="role-preview-icon" />;
    }
  };

  const handleProceed = () => {
    if (onProceed) {
      onProceed();
      return;
    }
    const target = user.portalInfo?.dashboardRoute || (
      user.accountType === ACCOUNT_TYPES.WHOLESALER
        ? '/wholesaler/dashboard'
        : user.accountType === ACCOUNT_TYPES.RETAILER
        ? '/retailer/dashboard'
        : '/buyer/dashboard'
    );
    navigate(target);
  };

  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal-card modal-dashboard-preview" onClick={(e) => e.stopPropagation()}>
        <div className="preview-top-badge">
          <CheckCircle size={20} className="text-gold" />
          <span>Authentication Successful</span>
        </div>

        <div className="preview-header">
          <div className="preview-role-avatar">
            {getRoleIcon()}
          </div>
          <h2 className="preview-title">Welcome, {user.name}</h2>
          <span className="preview-role-pill">
            <ShieldCheck size={14} />
            {user.portalInfo?.badge || user.accountType}
          </span>
        </div>

        <div className="preview-portal-card">
          <div className="portal-sub-label">Authorized Access Channel</div>
          <h3 className="portal-channel-name">{user.portalInfo?.portalName}</h3>

          <div className="portal-features-list">
            <span className="features-header">Authorized Permissions:</span>
            <ul>
              {user.portalInfo?.features?.map((feat, idx) => (
                <li key={idx}>✓ {feat}</li>
              ))}
            </ul>
          </div>

          <div className="portal-session-meta">
            <span>Signed in as: <strong>{user.email}</strong></span>
            <span>Auth Mode: <strong>{user.provider ? 'Google OAuth' : 'Standard Credentials'}</strong></span>
          </div>
        </div>

        <div className="preview-actions">
          <button
            type="button"
            className="btn-primary-navy preview-portal-btn"
            onClick={handleProceed}
          >
            <span>Proceed to {user.accountType} Workspace</span>
            <ArrowRight size={17} />
          </button>

          <button
            type="button"
            className="preview-logout-btn"
            onClick={onLogout}
          >
            <LogOut size={16} />
            <span>Sign Out & Return to Login</span>
          </button>
        </div>
      </div>
    </div>
  );
}
