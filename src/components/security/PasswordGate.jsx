import React from 'react';
import { useAuth } from './AuthContext';
import { LoginPage } from './LoginPage';

export function PasswordGate({ children }) {
    const { role, loading } = useAuth();

    if (loading) {
        return <div className="loading-screen">載入中...</div>; // Could be a nicer spinner
    }

    if (!role) {
        return <LoginPage />;
    }

    return children;
}
