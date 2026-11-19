import React from 'react';
import { Package, Store, ShoppingBag, Check } from 'lucide-react';
import { ACCOUNT_TYPES } from '../services/authService';

/**
 * Single Selectable Account Card Component
 */
export default function AccountCard({
  type,
  title,
  description,
  isSelected,
  onSelect,
}) {
  const getIcon = () => {
    switch (type) {
      case ACCOUNT_TYPES.WHOLESALER:
        return <Package className="card-role-icon" size={24} strokeWidth={1.8} />;
      case ACCOUNT_TYPES.RETAILER:
        return <Store className="card-role-icon" size={24} strokeWidth={1.8} />;
      case ACCOUNT_TYPES.BUYER:
        return <ShoppingBag className="card-role-icon" size={24} strokeWidth={1.8} />;
      default:
        return <Package className="card-role-icon" size={24} strokeWidth={1.8} />;
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelect(type);
    }
  };

  return (
    <div
      role="radio"
      aria-checked={isSelected}
      tabIndex={0}
      onClick={() => onSelect(type)}
      onKeyDown={handleKeyDown}
      className={`account-card ${isSelected ? 'account-card-selected' : ''}`}
    >
      {/* Selected Indicator Checkmark */}
      {isSelected && (
        <div className="card-checkmark-badge" aria-label="Selected">
          <Check size={13} strokeWidth={3} className="check-icon-svg" />
        </div>
      )}

      {/* Role Icon Wrapper */}
      <div className={`card-icon-container ${isSelected ? 'icon-active' : ''}`}>
        {getIcon()}
      </div>

      {/* Card Details */}
      <div className="card-content">
        <h4 className="card-title">{title}</h4>
        <p className="card-description">{description}</p>
      </div>
    </div>
  );
}
