import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const ROLES = {
    ADMIN: 'ADMIN',
    PARTICIPANT: 'PARTICIPANT',
    VIEWER: 'VIEWER'
};

// Mock passwords for now - in real app fetch from Firestore or env
const PASSWORDS = {
    'admin123': ROLES.ADMIN,
    'team2026': ROLES.PARTICIPANT,
    'viewonly': ROLES.VIEWER
};

export function AuthProvider({ children }) {
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage for persisted session
        const savedRole = localStorage.getItem('trip_role');
        if (savedRole && ROLES[savedRole]) {
            setRole(savedRole);
        }
        setLoading(false);
    }, []);

    const login = (password) => {
        const matchedRole = PASSWORDS[password];
        if (matchedRole) {
            setRole(matchedRole);
            localStorage.setItem('trip_role', matchedRole);
            return true;
        }
        return false;
    };

    const logout = () => {
        setRole(null);
        localStorage.removeItem('trip_role');
    };

    return (
        <AuthContext.Provider value={{ role, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
