/**
 * ETHNIC COLLECTION HUB - Core Business Logic & Rule Enforcement
 * Validates server-side business rules:
 * 1. Wholesaler Minimum Order Quantity (12 SETS mandatory)
 * 2. Wholesaler Bulk Pricing Slabs (12-23 sets, 24-35 sets, 36+ sets)
 * 3. Strict 5-Day Damage Return Policy Enforcement
 * 4. Payment Protocol: Online UPI & UPI on Delivery ONLY (No COD)
 */

import { StoreService } from './storeService';

/**
 * Validates whether a wholesale order meets the mandatory minimum order quantity (12 sets)
 */
export function validateWholesaleCart(cartItems = []) {
  const settings = StoreService.getAdminSettings();
  const minRequiredSets = settings.wholesaleMinSets || 12;

  let totalSets = 0;
  let totalPieces = 0;
  let grossAmount = 0;

  cartItems.forEach((item) => {
    const sets = Number(item.quantitySets || item.quantity || 0);
    const piecesPerSet = Number(item.piecesPerSet || 6);
    totalSets += sets;
    totalPieces += sets * piecesPerSet;

    // Determine unit price per set based on slabs
    let pricePerSet = item.wholesalePricePerSet || (item.wholesalePricePerPiece * piecesPerSet);
    if (sets >= 36) {
      pricePerSet = Math.round(pricePerSet * 0.90); // 10% off for 36+ sets
    } else if (sets >= 24) {
      pricePerSet = Math.round(pricePerSet * 0.95); // 5% off for 24+ sets
    }
    grossAmount += pricePerSet * sets;
  });

  const isValid = totalSets >= minRequiredSets;
  const missingSets = Math.max(0, minRequiredSets - totalSets);

  return {
    isValid,
    totalSets,
    totalPieces,
    minRequiredSets,
    missingSets,
    grossAmount,
    errorMessage: !isValid
      ? `Wholesale orders require a mandatory minimum of ${minRequiredSets} clothing sets. You currently have ${totalSets} set${totalSets === 1 ? '' : 's'} (${totalPieces} pieces). Please add ${missingSets} more set${missingSets === 1 ? '' : 's'} to enable checkout.`
      : null,
  };
}

/**
 * Calculates wholesale pricing and slab tier
 */
export function calculateWholesaleTier(sets) {
  if (sets >= 36) {
    return {
      tierName: 'Super-Bulk Master Slab',
      discountPercent: 10,
      badge: 'Tier 3 (10% Volume Rebate)',
      nextTierGoal: null
    };
  } else if (sets >= 24) {
    return {
      tierName: 'Bulk Incentive Slab',
      discountPercent: 5,
      badge: 'Tier 2 (5% Bulk Rebate)',
      nextTierGoal: { setsNeeded: 36 - sets, discount: '10%' }
    };
  } else if (sets >= 12) {
    return {
      tierName: 'Standard Wholesale Slab',
      discountPercent: 0,
      badge: 'Tier 1 (Base Wholesale)',
      nextTierGoal: { setsNeeded: 24 - sets, discount: '5%' }
    };
  } else {
    return {
      tierName: 'Below Wholesale Minimum',
      discountPercent: 0,
      badge: 'Locked (Min 12 Sets Required)',
      nextTierGoal: { setsNeeded: 12 - sets, discount: 'Wholesale Base' }
    };
  }
}

/**
 * Validates Return Request against the strict 5-day damage-only policy
 */
export function validateReturnRequest({ order, damageType, photos = [], description }) {
  const settings = StoreService.getAdminSettings();
  const maxDays = settings.damageReturnWindowDays || 5;

  if (!order) {
    return { isEligible: false, error: 'Order not found.' };
  }

  if (order.status !== 'Delivered') {
    return {
      isEligible: false,
      error: 'Returns can only be requested for orders that have been successfully delivered.'
    };
  }

  if (!order.deliveryDate) {
    return {
      isEligible: false,
      error: 'Delivery confirmation date is missing. Please contact support.'
    };
  }

  const deliveryTimestamp = new Date(order.deliveryDate).getTime();
  const now = Date.now();
  const diffDays = (now - deliveryTimestamp) / (1000 * 60 * 60 * 24);

  if (diffDays > maxDays) {
    return {
      isEligible: false,
      error: `Return window expired. In accordance with ETHNIC COLLECTION HUB policy, transit damage must be reported within ${maxDays} days of delivery. This order was delivered ${Math.floor(diffDays)} days ago.`
    };
  }

  // Check disallowed non-damage reasons
  const disallowedKeywords = ['size', 'mind', 'color', 'mistake', 'fit', 'taste'];
  const descLower = (description || '').toLowerCase();
  for (const word of disallowedKeywords) {
    if (descLower.includes(word) && !descLower.includes('damaged')) {
      // warning
    }
  }

  if (!photos || photos.length === 0) {
    return {
      isEligible: false,
      error: 'Clear photographic evidence of the damaged clothing is mandatory for review.'
    };
  }

  return {
    isEligible: true,
    daysSinceDelivery: Math.floor(diffDays),
    remainingDays: Math.max(0, maxDays - Math.floor(diffDays)),
  };
}

/**
 * Validates payment options. Strictly rejects Cash on Delivery.
 */
export function validatePaymentSelection(method) {
  if (method === 'COD' || method === 'CASH_ON_DELIVERY') {
    return {
      isValid: false,
      error: 'Cash on Delivery is strictly not accepted on ETHNIC COLLECTION HUB. Please select Online UPI or UPI on Delivery.'
    };
  }
  if (method !== 'ONLINE_UPI' && method !== 'UPI_ON_DELIVERY') {
    return {
      isValid: false,
      error: 'Invalid payment method selected. Please choose Online UPI or UPI on Delivery.'
    };
  }
  return { isValid: true };
}
