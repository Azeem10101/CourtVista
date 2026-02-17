import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

// Hardcoded admin account
const ADMIN_ACCOUNT = {
    id: 'admin-001',
    name: 'Admin',
    email: 'admin@courtvista.com',
    password: 'admin123',
    role: 'admin',
};

// Helper: get all registered users from localStorage
function getStoredUsers() {
    try {
        return JSON.parse(localStorage.getItem('courtvista_users')) || [];
    } catch {
        return [];
    }
}

// Helper: get currently logged-in user from localStorage
function getStoredCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem('courtvista_user')) || null;
    } catch {
        return null;
    }
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(getStoredCurrentUser);

    // Keep localStorage in sync whenever user changes
    useEffect(() => {
        if (user) {
            localStorage.setItem('courtvista_user', JSON.stringify(user));
        } else {
            localStorage.removeItem('courtvista_user');
        }
    }, [user]);

    // Register a new user (role = 'user' or 'lawyer')
    function register({ name, email, password, role }) {
        const users = getStoredUsers();

        // Check if email already taken (also check admin)
        if (email.toLowerCase() === ADMIN_ACCOUNT.email) {
            return { success: false, message: 'This email is already registered.' };
        }
        if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
            return { success: false, message: 'This email is already registered.' };
        }

        const newUser = {
            id: 'user-' + Date.now(),
            name,
            email: email.toLowerCase(),
            role,
        };

        // Save to users list
        localStorage.setItem('courtvista_users', JSON.stringify([...users, { ...newUser, password }]));

        // Auto-login
        setUser(newUser);
        return { success: true };
    }

    // Login with email + password
    function login(email, password) {
        // Check admin first
        if (
            email.toLowerCase() === ADMIN_ACCOUNT.email &&
            password === ADMIN_ACCOUNT.password
        ) {
            const adminUser = {
                id: ADMIN_ACCOUNT.id,
                name: ADMIN_ACCOUNT.name,
                email: ADMIN_ACCOUNT.email,
                role: ADMIN_ACCOUNT.role,
            };
            setUser(adminUser);
            return { success: true };
        }

        // Check registered users
        const users = getStoredUsers();
        const found = users.find(
            (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (!found) {
            return { success: false, message: 'Invalid email or password.' };
        }

        // Don't store password in session
        const { password: _, ...safeUser } = found;
        setUser(safeUser);
        return { success: true };
    }

    // Logout
    function logout() {
        setUser(null);
    }

    // Get dashboard path based on role
    function getDashboardPath() {
        if (!user) return '/login';
        switch (user.role) {
            case 'admin': return '/dashboard/admin';
            case 'lawyer': return '/dashboard/lawyer';
            default: return '/dashboard/user';
        }
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout, getDashboardPath }}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook for easy access
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
