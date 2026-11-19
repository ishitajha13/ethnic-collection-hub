/**
 * ETHNIC COLLECTION HUB - Authentication & Identity Service
 * Manages authentication, multi-role routing, session persistence,
 * and profile verification workflows for Wholesalers, Retailers, Buyers, and Admin.
 */

import { StoreService } from './storeService';

const STORAGE_KEY = 'ethnic_hub_auth_session';
const REMEMBERED_EMAIL_KEY = 'ethnic_hub_remembered_email';

export const ACCOUNT_TYPES = {
  WHOLESALER: 'Wholesaler',
  RETAILER: 'Retailer',
  BUYER: 'Buyer',
  ADMIN: 'Admin'
};

// Role-specific routing and badge configurations
export const ROLE_PORTALS = {
  Wholesaler: {
    portalName: 'Wholesale B2B Bulk Commerce Portal',
    badge: 'Verified Wholesaler',
    dashboardRoute: '/wholesaler/dashboard',
    features: ['MOQ 12-Set Pricing Slabs', 'Factory Direct Sourcing', 'Tax Invoices & Commercial Bale Tracking']
  },
  Retailer: {
    portalName: 'Retailer Resale & Procurement Hub',
    badge: 'Verified Retail Partner',
    dashboardRoute: '/retailer/dashboard',
    features: ['Trade Margin Pricing', 'Stock Replenishment', 'Instant Tax Invoices (GSTIN)']
  },
  Buyer: {
    portalName: 'Ethnic Couture Exclusive Boutique',
    badge: 'Prestige Member',
    dashboardRoute: '/buyer/dashboard',
    features: ['Artisan Silk Collections', 'Order Tracking & 5-Day Damage Claims', 'Online UPI & UPI on Delivery']
  },
  Admin: {
    portalName: 'Executive Operations & Control Center',
    badge: 'System Administrator',
    dashboardRoute: '/admin',
    features: ['Catalog & MOQ Control', 'Order Verification & UPI Reconcile', 'Return Claims & Damage Review']
  }
};

/**
 * Validates login input fields
 */
export function validateLoginForm({ email, password }) {
  const errors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email || !email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!emailRegex.test(email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!password) {
    errors.password = 'Password is required.';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters long.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validates registration input fields
 */
export function validateRegistrationForm({ fullName, email, password, accountType, businessName, gstin }) {
  const errors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!fullName || !fullName.trim()) {
    errors.fullName = 'Full legal name is required.';
  }

  if (!email || !email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!emailRegex.test(email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!password) {
    errors.password = 'Password is required.';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters long.';
  }

  if (accountType === ACCOUNT_TYPES.WHOLESALER || accountType === ACCOUNT_TYPES.RETAILER) {
    if (!businessName || !businessName.trim()) {
      errors.businessName = 'Registered firm / boutique name is required for commercial accounts.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Authenticates user according to the selected account type
 */
export async function loginUser({ email, password, accountType, rememberMe }) {
  await new Promise((resolve) => setTimeout(resolve, 350));

  const validation = validateLoginForm({ email, password });
  if (!validation.isValid) {
    throw new Error(Object.values(validation.errors)[0]);
  }

  const cleanEmail = email.trim().toLowerCase();

  // Handle Remember Me persistence
  if (rememberMe) {
    localStorage.setItem(REMEMBERED_EMAIL_KEY, cleanEmail);
  } else {
    localStorage.removeItem(REMEMBERED_EMAIL_KEY);
  }

  // Check against StoreService users
  const allUsers = StoreService.getUsers();
  let matchedUser = allUsers.find(
    (u) => u.email.toLowerCase() === cleanEmail
  );

  // If user does not exist in seed, create user record dynamically
  if (!matchedUser) {
    matchedUser = {
      id: 'usr_' + Date.now(),
      email: cleanEmail,
      name: cleanEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
      accountType: accountType || ACCOUNT_TYPES.BUYER,
      businessName: accountType !== ACCOUNT_TYPES.BUYER ? `${accountType} Enterprises` : null,
      phone: '+91 98' + Math.floor(10000000 + Math.random() * 90000000),
      aadhaarVerificationStatus: 'Not Verified',
      aadhaarMasked: null,
      createdAt: new Date().toISOString()
    };
    StoreService.setUsers([...allUsers, matchedUser]);
  }

  const role = matchedUser.accountType || accountType || ACCOUNT_TYPES.BUYER;
  const userSession = {
    ...matchedUser,
    accountType: role,
    portalInfo: ROLE_PORTALS[role] || ROLE_PORTALS.Buyer,
    token: 'jwt_' + Math.random().toString(36).substring(2) + Date.now(),
    authenticatedAt: new Date().toISOString(),
  };

  const storage = rememberMe ? localStorage : sessionStorage;
  storage.setItem(STORAGE_KEY, JSON.stringify(userSession));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(userSession)); // keep sync
  window.dispatchEvent(new CustomEvent('ech_auth_change', { detail: userSession }));

  return userSession;
}

/**
 * Registers new user according to account type
 */
export async function registerUser(formData) {
  await new Promise((resolve) => setTimeout(resolve, 450));

  const validation = validateRegistrationForm(formData);
  if (!validation.isValid) {
    throw new Error(Object.values(validation.errors)[0]);
  }

  const cleanEmail = formData.email.trim().toLowerCase();
  const allUsers = StoreService.getUsers();

  const existing = allUsers.find((u) => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    throw new Error('An account with this email address already exists. Please log in.');
  }

  const newUser = {
    id: 'usr_' + Date.now(),
    email: cleanEmail,
    name: formData.fullName.trim(),
    accountType: formData.accountType,
    businessName: formData.businessName ? formData.businessName.trim() : null,
    gstin: formData.gstin ? formData.gstin.trim() : null,
    phone: formData.phone || '+91 98765 00000',
    aadhaarVerificationStatus: formData.aadhaarMasked ? 'Verified' : 'Not Verified',
    aadhaarMasked: formData.aadhaarMasked || null,
    address: formData.address || '',
    portalInfo: ROLE_PORTALS[formData.accountType],
    token: 'jwt_reg_' + Math.random().toString(36).substring(2) + Date.now(),
    authenticatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString()
  };

  StoreService.setUsers([...allUsers, newUser]);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
  window.dispatchEvent(new CustomEvent('ech_auth_change', { detail: newUser }));

  return newUser;
}

/**
 * Updates an authenticated user profile
 */
export function updateUserProfile(updatedFields) {
  const current = getCurrentSession();
  if (!current) return null;

  const allUsers = StoreService.getUsers();
  const index = allUsers.findIndex((u) => u.id === current.id || u.email === current.email);

  const merged = { ...current, ...updatedFields };
  if (index !== -1) {
    allUsers[index] = { ...allUsers[index], ...updatedFields };
    StoreService.setUsers(allUsers);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
  window.dispatchEvent(new CustomEvent('ech_auth_change', { detail: merged }));
  return merged;
}

/**
 * Simulates Google OAuth flow
 */
export async function googleSignIn(accountType) {
  await new Promise((resolve) => setTimeout(resolve, 400));

  const sampleAccounts = [
    { email: 'priya.sharma@gmail.com', name: 'Priya Sharma' },
    { email: 'rajesh.exports@gmail.com', name: 'Rajesh Exports & Textiles' },
    { email: 'ananya.boutique@gmail.com', name: 'Ananya Boutique' }
  ];

  const selected = sampleAccounts[Math.floor(Math.random() * sampleAccounts.length)];
  const user = {
    id: 'usr_g_' + Date.now(),
    email: selected.email,
    name: selected.name,
    accountType,
    provider: 'google',
    aadhaarVerificationStatus: 'Not Verified',
    portalInfo: ROLE_PORTALS[accountType],
    token: 'google_oauth_' + Math.random().toString(36).substring(2),
    authenticatedAt: new Date().toISOString(),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  window.dispatchEvent(new CustomEvent('ech_auth_change', { detail: user }));
  return user;
}

/**
 * Initiates Forgot Password reset link
 */
export async function requestPasswordReset(email) {
  await new Promise((resolve) => setTimeout(resolve, 300));
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    throw new Error('Please provide a valid registered email address.');
  }
  return {
    success: true,
    message: `A secure password reset link has been dispatched to ${email.trim()}. Please check your inbox.`,
  };
}

/**
 * Retrieve saved email from Remember Me
 */
export function getRememberedEmail() {
  return localStorage.getItem(REMEMBERED_EMAIL_KEY) || '';
}

/**
 * Retrieve active session
 */
export function getCurrentSession() {
  const local = localStorage.getItem(STORAGE_KEY);
  if (local) {
    try {
      return JSON.parse(local);
    } catch {
      // fallback
    }
  }
  const session = sessionStorage.getItem(STORAGE_KEY);
  if (session) {
    try {
      return JSON.parse(session);
    } catch {
      // fallback
    }
  }
  return null;
}

/**
 * Logout
 */
export function logoutUser() {
  localStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(STORAGE_KEY);
  window.dispatchEvent(new CustomEvent('ech_auth_change', { detail: null }));
}
