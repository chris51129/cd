/**
 * SafetyContext - Manages navigation safety during active games
 * Provides a global modal and navigation interception mechanism.
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ConfirmationModal from '../components/ui/ConfirmationModal';
import { secureLog } from '../utils/security';
import type { SafetyContextValue, PropsWithChildren } from '../types';

const SafetyContext = createContext<SafetyContextValue | undefined>(undefined);

export const useSafety = (): SafetyContextValue => {
    const context = useContext(SafetyContext);
    if (!context) {
        throw new Error('useSafety must be used within a SafetyProvider');
    }
    return context;
};

export const SafetyProvider: React.FC<PropsWithChildren> = ({ children }) => {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
    const [isRisky, setIsRisky] = useState(false);
    const location = useLocation();

    // Reset risky state if we leave game routes entirely (safety fallback)
    useEffect(() => {
        if (!location.pathname.includes('/game/') && !location.pathname.includes('/lobby')) {
            setIsRisky(false);
        }
    }, [location.pathname]);

    /**
     * Intercepts navigation attempts.
     * @param action - The action to perform if safe or confirmed.
     */
    const handleSafeNavigation = (action: () => void): void => {
        if (isRisky) {
            secureLog.info('SafetyContext: Intercepting navigation due to risky state');
            setPendingAction(() => action); // Store the function
            setShowConfirmModal(true);
        } else {
            action();
        }
    };

    const confirmAction = (): void => {
        if (pendingAction) {
            pendingAction();
        }
        setShowConfirmModal(false);
        setPendingAction(null);
    };

    const cancelAction = (): void => {
        setShowConfirmModal(false);
        setPendingAction(null);
    };

    const value: SafetyContextValue = {
        handleSafeNavigation,
        isRisky,
        setIsRisky,
    };

    return (
        <SafetyContext.Provider value={value}>
            {children}
            <ConfirmationModal
                isOpen={showConfirmModal}
                title="⚠️ ¿Interrumpir Interacción?"
                message="Si sales ahora, se interrumpirá tu interacción actual con el protocolo. ¿Estás seguro de que quieres salir?"
                confirmText="Confirmar"
                cancelText="Mantener"
                onConfirm={confirmAction}
                onCancel={cancelAction}
            />
        </SafetyContext.Provider>
    );
};
