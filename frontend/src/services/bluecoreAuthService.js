/**
 * BLUECORE — Employer & Staff Management System
 * Authentication Service
 *
 * Roles:
 *   Admin   → Full access: employee management, payroll, reports
 *   Staff   → Limited access: own profile, attendance, tasks
 *
 * Storage: localStorage with namespaced key to avoid collision with ECH auth.
 */

const BLUECORE_SESSION_KEY = 'bluecore_auth_session';
const BLUECORE_RESET_TOKENS_KEY = 'bluecore_reset_tokens';

// ─── Role constants ───────────────────────────────────────────────────────────
export const BC_ROLES = {
  ADMIN: 'Admin',
  STAFF: 'Staff',
};

// ─── Dashboard routes per role ────────────────────────────────────────────────
export const BC_DASHBOARD_ROUTES = {
  [BC_ROLES.ADMIN]: '/bluecore/admin',
  [BC_ROLES.STAFF]: '/bluecore/staff',
};

// ─── Seed credential store ────────────────────────────────────────────────────
// In production this lives server-side. Here it is demo-only localStorage seed.
const SEED_ACCOUNTS = [
  {
    id: 'bc_admin_01',
    email: 'admin@bluecore.com',
    passwordHash: 'Admin@2026!',          // plain for demo; hash in production
    name: 'Arjun Mehta',
    role: BC_ROLES.ADMIN,
    department: 'Executive Management',
    employeeId: 'BC-EMP-001',
    phone: '+91 98100 00001',
    joinedAt: '2024-01-15',
    avatar: null,
  },
  {
    id: 'bc_staff_01',
    email: 'staff@bluecore.com',
    passwordHash: 'Staff@2026!',
    name: 'Priya Verma',
    role: BC_ROLES.STAFF,
    department: 'Operations',
    employeeId: 'BC-EMP-042',
    phone: '+91 98200 00042',
    joinedAt: '2024-06-01',
    avatar: null,
  },
  {
    id: 'bc_staff_02',
    email: 'ravi.kumar@bluecore.com',
    passwordHash: 'Ravi@2026!',
    name: 'Ravi Kumar',
    role: BC_ROLES.STAFF,
    department: 'Sales & Distribution',
    employeeId: 'BC-EMP-078',
    phone: '+91 98300 00078',
    joinedAt: '2025-02-10',
    avatar: null,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getBluecoreAccounts() {
  try {
    const raw = localStorage.getItem('bluecore_accounts');
    if (!raw) {
      localStorage.setItem('bluecore_accounts', JSON.stringify(SEED_ACCOUNTS));
      return [...SEED_ACCOUNTS];
    }
    const stored = JSON.parse(raw);
    // Merge: ensure seed accounts are always present
    const ids = stored.map((u) => u.id);
    const merged = [...stored];
    for (const seed of SEED_ACCOUNTS) {
      if (!ids.includes(seed.id)) merged.push(seed);
    }
    return merged;
  } catch {
    return [...SEED_ACCOUNTS];
  }
}

function saveBluecoreAccounts(accounts) {
  localStorage.setItem('bluecore_accounts', JSON.stringify(accounts));
}

// ─── Validation ───────────────────────────────────────────────────────────────

export function validateBluecoreLoginForm({ email, password }) {
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
    errors.password = 'Password must be at least 6 characters.';
  }

  return { isValid: Object.keys(errors).length === 0, errors };
}

// ─── Login ────────────────────────────────────────────────────────────────────

export async function bluecoreLogin({ email, password }) {
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 600));

  const validation = validateBluecoreLoginForm({ email, password });
  if (!validation.isValid) {
    throw new Error(Object.values(validation.errors)[0]);
  }

  const accounts = getBluecoreAccounts();
  const account = accounts.find(
    (a) => a.email.toLowerCase() === email.trim().toLowerCase()
  );

  if (!account) {
    throw new Error('No account found with this email address. Please contact your administrator.');
  }

  if (account.passwordHash !== password) {
    throw new Error('Incorrect password. Please try again or use "Forgot Password."');
  }

  const session = {
    ...account,
    token: 'bc_jwt_' + Math.random().toString(36).substring(2) + Date.now(),
    authenticatedAt: new Date().toISOString(),
  };
  // Remove sensitive field from session
  delete session.passwordHash;

  localStorage.setItem(BLUECORE_SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new CustomEvent('bluecore_auth_change', { detail: session }));
  return session;
}

// ─── Session ──────────────────────────────────────────────────────────────────

export function getBluecoreSession() {
  try {
    const raw = localStorage.getItem(BLUECORE_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function bluecoreLogout() {
  localStorage.removeItem(BLUECORE_SESSION_KEY);
  window.dispatchEvent(new CustomEvent('bluecore_auth_change', { detail: null }));
}

// ─── Forgot Password ──────────────────────────────────────────────────────────

export async function bluecoreRequestPasswordReset(email) {
  await new Promise((r) => setTimeout(r, 400));
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email.trim())) {
    throw new Error('Please provide a valid registered email address.');
  }

  const accounts = getBluecoreAccounts();
  const account = accounts.find((a) => a.email.toLowerCase() === email.trim().toLowerCase());
  if (!account) {
    // Security: don't reveal whether email exists; show generic success
    return { success: true, message: `If this email is registered, a reset link has been sent to ${email.trim()}.` };
  }

  const token = 'bc_reset_' + Math.random().toString(36).substring(2) + Date.now();
  const tokens = JSON.parse(localStorage.getItem(BLUECORE_RESET_TOKENS_KEY) || '{}');
  tokens[token] = { email: account.email, expiresAt: Date.now() + 15 * 60 * 1000 };
  localStorage.setItem(BLUECORE_RESET_TOKENS_KEY, JSON.stringify(tokens));

  return { success: true, message: `Password reset link sent to ${email.trim()}. (Demo token: ${token})` };
}

// ─── Admin-only: Create Employee Account ─────────────────────────────────────

export function bluecoreCreateEmployee({ name, email, password, role, department, phone }) {
  const session = getBluecoreSession();
  if (!session || session.role !== BC_ROLES.ADMIN) {
    throw new Error('Unauthorized: Only Admins can create employee accounts.');
  }

  const accounts = getBluecoreAccounts();
  if (accounts.find((a) => a.email.toLowerCase() === email.trim().toLowerCase())) {
    throw new Error('An account with this email already exists.');
  }

  const newEmployee = {
    id: 'bc_staff_' + Date.now(),
    email: email.trim().toLowerCase(),
    passwordHash: password,
    name: name.trim(),
    role: role || BC_ROLES.STAFF,
    department: department || 'General',
    employeeId: 'BC-EMP-' + String(accounts.length + 1).padStart(3, '0'),
    phone: phone || '',
    joinedAt: new Date().toISOString().split('T')[0],
    avatar: null,
  };

  saveBluecoreAccounts([...accounts, newEmployee]);
  return newEmployee;
}

// ─── Get all employees (Admin only) ──────────────────────────────────────────

export function bluecoreGetAllEmployees() {
  const session = getBluecoreSession();
  if (!session || session.role !== BC_ROLES.ADMIN) {
    throw new Error('Unauthorized: Admin access required.');
  }
  return getBluecoreAccounts().map(({ passwordHash, ...rest }) => rest);
}
