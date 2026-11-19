import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { StoreService } from '../../services/storeService';
import { getCurrentSession } from '../../services/authService';
import { MapPin, Plus, Trash2, CheckCircle2, Home, Building2 } from 'lucide-react';

export default function BuyerAddressPage() {
  const session = getCurrentSession();
  const userId = session?.id || 'current';

  const [addresses, setAddresses] = useState(() => StoreService.getAddresses(userId));
  const [isAdding, setIsAdding] = useState(false);
  const [newAddr, setNewAddr] = useState({
    fullName: session?.name || '',
    phone: session?.phone || '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: 'Delhi',
    pincode: '',
    type: 'Home',
    isDefault: false
  });

  const handleSetDefault = (id) => {
    const updated = addresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    setAddresses(updated);
    StoreService.saveAddresses(userId, updated);
  };

  const handleDelete = (id) => {
    const updated = addresses.filter((a) => a.id !== id);
    setAddresses(updated);
    StoreService.saveAddresses(userId, updated);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    const created = {
      ...newAddr,
      id: 'addr-' + Date.now(),
      isDefault: addresses.length === 0 || newAddr.isDefault,
    };
    const updated = [created, ...addresses];
    setAddresses(updated);
    StoreService.saveAddresses(userId, updated);
    setIsAdding(false);
    setNewAddr({
      fullName: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      state: 'Delhi',
      pincode: '',
      type: 'Home',
      isDefault: false
    });
  };

  return (
    <DashboardLayout
      title="Saved Delivery Addresses"
      subtitle="Manage shipping destinations for your ethnic fashion orders."
    >
      <div className="addresses-header-actions mb-6 flex justify-between items-center">
        <p className="text-muted">You have {addresses.length} saved delivery destinations.</p>
        <button
          type="button"
          className="btn-primary-navy"
          onClick={() => setIsAdding(!isAdding)}
        >
          <Plus size={16} />
          <span>{isAdding ? 'Close Form' : 'Add New Address'}</span>
        </button>
      </div>

      {isAdding && (
        <div className="add-address-card mb-6">
          <h3>Add Shipping Destination</h3>
          <form onSubmit={handleAddSubmit} className="mt-4">
            <div className="form-row-dual">
              <div className="form-field-unit">
                <label className="input-field-label">Recipient Full Name</label>
                <input
                  type="text"
                  required
                  value={newAddr.fullName}
                  onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                  className="input-field-control"
                />
              </div>
              <div className="form-field-unit">
                <label className="input-field-label">Mobile Number</label>
                <input
                  type="tel"
                  required
                  value={newAddr.phone}
                  onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                  className="input-field-control"
                />
              </div>
            </div>

            <div className="form-field-unit">
              <label className="input-field-label">Address Line 1 (House/Flat, Street)</label>
              <input
                type="text"
                required
                value={newAddr.addressLine1}
                onChange={(e) => setNewAddr({ ...newAddr, addressLine1: e.target.value })}
                className="input-field-control"
              />
            </div>

            <div className="form-row-triple">
              <div className="form-field-unit">
                <label className="input-field-label">City</label>
                <input
                  type="text"
                  required
                  value={newAddr.city}
                  onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                  className="input-field-control"
                />
              </div>
              <div className="form-field-unit">
                <label className="input-field-label">State</label>
                <input
                  type="text"
                  required
                  value={newAddr.state}
                  onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                  className="input-field-control"
                />
              </div>
              <div className="form-field-unit">
                <label className="input-field-label">Pincode</label>
                <input
                  type="text"
                  required
                  value={newAddr.pincode}
                  onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                  className="input-field-control"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-4">
              <button type="submit" className="btn-primary-navy">
                Save Address
              </button>
              <button type="button" className="btn-modal-cancel" onClick={() => setIsAdding(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Address Cards Grid */}
      <div className="addresses-cards-grid">
        {addresses.map((addr) => (
          <div key={addr.id} className={`address-card ${addr.isDefault ? 'default-border' : ''}`}>
            <div className="address-card-top">
              <div className="flex items-center gap-2">
                {addr.type === 'Commercial' ? <Building2 size={16} /> : <Home size={16} />}
                <span className="address-type-tag">{addr.type}</span>
              </div>
              {addr.isDefault && (
                <span className="default-pill">
                  <CheckCircle2 size={12} /> Default Destination
                </span>
              )}
            </div>

            <h4 className="addr-recipient-name">{addr.fullName}</h4>
            <p className="addr-street">{addr.addressLine1}</p>
            {addr.addressLine2 && <p className="addr-street">{addr.addressLine2}</p>}
            <p className="addr-city">{addr.city}, {addr.state} - <strong>{addr.pincode}</strong></p>
            <p className="addr-phone">Phone: {addr.phone}</p>

            <div className="address-card-bottom-actions">
              {!addr.isDefault && (
                <button
                  type="button"
                  className="btn-set-default"
                  onClick={() => handleSetDefault(addr.id)}
                >
                  Set as Default
                </button>
              )}
              {addresses.length > 1 && (
                <button
                  type="button"
                  className="btn-delete-addr"
                  onClick={() => handleDelete(addr.id)}
                  title="Remove Address"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
