import { createContext, useContext, useState, useEffect, useCallback } from 'react';

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

// Helper: build a searchable lawyer object from a user record
function userToLawyerProfile(u, index) {
    const languages = u.languages
        ? u.languages.split(',').map((l) => l.trim()).filter(Boolean)
        : ['English'];
    const specializations = u.specializations
        ? (Array.isArray(u.specializations) ? u.specializations : u.specializations.split(',').map((s) => s.trim()).filter(Boolean))
        : [];
    return {
        id: u.id,
        name: u.name,
        photo: u.profilePicture || null,
        gender: u.gender || '',
        specializations,
        experience: Number(u.experience) || 0,
        rating: Number(u.rating) || 0,
        reviewCount: 0,
        verified: false,
        city: u.city || u.jurisdiction || '',
        jurisdiction: u.jurisdiction || '',
        languages,
        feesRange: u.feesRange || null,
        consultationFee: Number(u.consultationFee) || 0,
        education: u.education || '',
        barCouncilNumber: u.barCouncilNumber || '',
        bio: u.bio || '',
        totalCases: 0,
        pendingCases: 0,
        awards: [],
        reviews: [],
        isDynamic: true,  // flag to distinguish from static profiles
    };
}

// Helper: get all dynamic lawyer profiles built from registered users
export function getDynamicLawyers() {
    try {
        const users = JSON.parse(localStorage.getItem('courtvista_users')) || [];
        return users
            .filter((u) => u.role === 'lawyer')
            .map((u, i) => userToLawyerProfile(u, i));
    } catch {
        return [];
    }
}

// Helper: get currently logged-in user from sessionStorage
function getStoredCurrentUser() {
    try {
        return JSON.parse(sessionStorage.getItem('courtvista_user')) || null;
    } catch {
        return null;
    }
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(getStoredCurrentUser);

    // Keep sessionStorage in sync whenever user changes
    useEffect(() => {
        if (user) {
            sessionStorage.setItem('courtvista_user', JSON.stringify(user));
        } else {
            sessionStorage.removeItem('courtvista_user');
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
        return { success: true, user: newUser };
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
            return { success: true, user: adminUser };
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
        const { password: _unused, ...safeUser } = found;
        setUser(safeUser);
        return { success: true, user: safeUser };
    }

    // Logout
    function logout() {
        setUser(null);
    }

    // Update user profile
    function updateProfile(updates) {
        if (!user) return { success: false, message: 'Not logged in.' };

        const updatedUser = { ...user, ...updates };
        setUser(updatedUser);

        // Also update in the users list
        const users = getStoredUsers();
        const updatedUsers = users.map((u) =>
            u.id === user.id ? { ...u, ...updates } : u
        );
        localStorage.setItem('courtvista_users', JSON.stringify(updatedUsers));

        return { success: true, user: updatedUser };
    }

    // Get the current lawyer's dynamic profile (for search listing)
    const getLawyerProfile = useCallback(() => {
        if (!user || user.role !== 'lawyer') return null;
        const users = getStoredUsers();
        const found = users.find((u) => u.id === user.id);
        return found ? userToLawyerProfile(found, 0) : null;
    }, [user]);

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
        <AuthContext.Provider value={{ user, login, register, logout, updateProfile, getDashboardPath, getLawyerProfile }}>
            {children}
        </AuthContext.Provider>
    );
}

// Custom hook for easy access
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
