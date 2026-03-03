import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute — wraps a page that requires authentication.
 *
 * Props:
 *   allowedRoles (array) — e.g. ['user'], ['lawyer'], ['admin']
 *   children — the page component to render
 *
 * Behavior:
 *   - Not logged in → redirect to /login
 *   - Logged in but wrong role → redirect to /
 */
export default function ProtectedRoute({ allowedRoles, children }) {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
}
