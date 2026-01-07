import React from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel, confirmText = "Confirmar", cancelText = "Cancelar" }) => {
    // FLEXBOX STRATEGY:
    // Instead of two separate fixed layers (backdrop + modal), we make ONE fixed container
    // that covers the screen and uses Flexbox to center the modal content.
    // This is mathematically more robust than `top: 50% left: 50% transform: translate...`

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 9999,
                        // Flexbox Centering Magic
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1rem' // Prevent edge touching on mobile
                    }}
                >
                    {/* Backdrop Layer (Visual Only) */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onCancel}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
                        style={{
                            position: 'absolute', // Absolute relative to the flex container
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            backgroundColor: 'rgba(0,0,0,0.8)',
                            backdropFilter: 'blur(4px)',
                            zIndex: -1 // Behind the modal
                        }}
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="glass-panel"
                        style={{
                            position: 'relative', // Relative to sit on top of backdrop
                            zIndex: 10,
                            width: '100%',
                            maxWidth: '400px',
                            padding: '2rem',
                            borderRadius: '1.5rem',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            // No margins or transforms needed, flex parent handles it
                        }}
                    >
                        <h3 className="text-xl font-bold text-white mb-2" style={{ fontSize: '1.5rem', marginBottom: '1rem', fontFamily: 'var(--font-heading)' }}>
                            {title}
                        </h3>

                        <p className="text-gray-300 mb-6" style={{ color: 'var(--text-secondary)', marginBottom: '2rem', lineHeight: 1.6 }}>
                            {message}
                        </p>

                        <div className="flex justify-end gap-3" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                            <button
                                onClick={onCancel}
                                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white transition-colors"
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    color: 'var(--text-secondary)',
                                    background: 'transparent',
                                    fontWeight: 600,
                                    cursor: 'pointer'
                                }}
                            >
                                {cancelText}
                            </button>

                            <button
                                onClick={onConfirm}
                                className="btn-primary"
                                style={{
                                    background: 'var(--color-primary)',
                                    color: 'white', // Text color fix preserved
                                    padding: '0.75rem 2rem',
                                    borderRadius: '9999px',
                                    fontWeight: 700,
                                    boxShadow: '0 0 20px rgba(255, 215, 0, 0.2)',
                                    cursor: 'pointer'
                                }}
                            >
                                {confirmText}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
};

export default ConfirmationModal;
