import React from 'react';

import { motion } from 'framer-motion';
import './CyberButton.css';

/**
 * CyberButton types
 */
type CyberButtonVariant = 'primary' | 'secondary' | 'danger';
type CyberButtonSize = 'sm' | 'md' | 'lg';
type CyberButtonType = 'button' | 'submit' | 'reset';

/**
 * Props for CyberButton component
 */
interface CyberButtonProps {
    readonly children: React.ReactNode;
    readonly onClick?: () => void;
    readonly type?: CyberButtonType;
    readonly variant?: CyberButtonVariant;
    readonly className?: string;
    readonly disabled?: boolean;
    readonly size?: CyberButtonSize;
}

/**
 * CyberButton - A high-fidelity, terminal-style button inspired by Uiverse.io
 * Features: Beveled corners (clip-path), neon glow, and haptic feedback.
 */
const CyberButton: React.FC<CyberButtonProps> = ({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    className = '',
    disabled = false,
    size = 'md'
}) => {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            type={type}
            disabled={disabled}
            className={`cyber-button cyber-button--${variant} cyber-button--${size} ${className}`}
        >
            <span className="cyber-button__content">
                {children}
            </span>
            <span className="cyber-button__glitch-layer"></span>
            <span className="cyber-button__tag">P2P_PROT_V1</span>
        </motion.button>
    );
};

export default CyberButton;
