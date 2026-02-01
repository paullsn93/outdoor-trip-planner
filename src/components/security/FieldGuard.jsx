import React from 'react';
import { useAuth, ROLES } from './AuthContext';

/**
 * Protects its children so they are only visible to specific roles.
 * @param {Array<string>} restrictedTo - List of ROLES allowed to view.
 * @param {ReactNode} fallback - Content to show if access denied (optional).
 */
export function FieldGuard({ children, restrictedTo = [], fallback = null }) {
    const { role } = useAuth();

    if (!role || !restrictedTo.includes(role)) {
        return fallback;
    }

    return children;
}

// Helper presets for common patterns
export const AdminOnly = ({ children, fallback }) => (
    <FieldGuard restrictedTo={[ROLES.ADMIN]} fallback={fallback}>{children}</FieldGuard>
);

export const ParticipantOnly = ({ children, fallback }) => (
    <FieldGuard restrictedTo={[ROLES.ADMIN, ROLES.PARTICIPANT]} fallback={fallback}>{children}</FieldGuard>
);
