/**
 * SafetyContext - Manages navigation safety during active games
 * Provides a global modal and navigation interception mechanism.
 */
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ConfirmationModal from '../components/ui/ConfirmationModal';
import { secureLog } from '../utils/security';

const SafetyContext = createContext();

export const useSafety = () => {
    const context = useContext(SafetyContext);
    if (!context) {
        throw new Error('useSafety must be used within a SafetyProvider');
    }
    return context;
};

export const SafetyProvider = ({ children }) => {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [pendingAction, setPendingAction] = useState(null);
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
     * @param {Function} action - The action to perform if safe or confirmed.
     */
    const handleSafeNavigation = (action) => {
        if (isRisky) {
            secureLog.info('SafetyContext: Intercepting navigation due to risky state');
            setPendingAction(() => action); // Store the function
            setShowConfirmModal(true);
        } else {
            action();
        }
    };

    const confirmAction = () => {
        if (pendingAction) {
            pendingAction();
        }
        setShowConfirmModal(false);
        setPendingAction(null);
    };

    const cancelAction = () => {
        setShowConfirmModal(false);
        setPendingAction(null);
    };

    return (
        <SafetyContext.Provider value={{ handleSafeNavigation, isRisky, setIsRisky }}>
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
