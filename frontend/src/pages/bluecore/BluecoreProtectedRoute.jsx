import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getBluecoreSession, BC_ROLES } from '../../services/bluecoreAuthService';

/**
 * BluecoreProtectedRoute
 *
 * Props:
 *   children       — the route content to render
 *   allowedRoles   — array of BC_ROLES values allowed (omit = any authenticated user)
 *
 * Behaviour:
 *   • Unauthenticated → redirect to /bluecore/login (preserves intended path)
 *   • Wrong role       → redirect to their own dashboard
 */
export default function BluecoreProtectedRoute({ children, allowedRoles }) {
  const location = useLocation();
  const session = getBluecoreSession();

  // Not logged in
  if (!session || !session.token) {
    return (
      <Navigate
        to="/bluecore/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  // Role check
  if (allowedRoles && !allowedRoles.includes(session.role)) {
    // Staff trying to access admin → send to staff dashboard
    if (session.role === BC_ROLES.STAFF) {
      return <Navigate to="/bluecore/staff" replace />;
    }
    return <Navigate to="/bluecore/admin" replace />;
  }

  return children;
}
