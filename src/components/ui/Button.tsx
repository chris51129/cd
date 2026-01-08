import React from 'react';
import { motion } from 'framer-motion';

/**
 * Button variant types
 */
type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'small' | 'medium' | 'large';
type ButtonType = 'button' | 'submit' | 'reset';

/**
 * Props for Button component
 */
interface ButtonProps {
    readonly children: React.ReactNode;
    readonly onClick?: () => void;
    readonly variant?: ButtonVariant;
    readonly size?: ButtonSize;
    readonly disabled?: boolean;
    readonly loading?: boolean;
    readonly className?: string;
    readonly style?: React.CSSProperties;
    readonly type?: ButtonType;
}

/**
 * Button - Atomic component for user interactions
 */
const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    loading = false,
    className = '',
    style = {},
    type = 'button'
}) => {
    // Mapping variants to CSS classes (assuming buttons.css exists/will be updated)
    // or using direct styles for "vibe" if classes aren't consistent yet
    const baseClass = `btn-${variant} btn-${size}`;

    return (
        <motion.button
            type={type}
            className={`${baseClass} ${className} ${disabled ? 'disabled' : ''}`}
            onClick={!disabled && !loading ? onClick : undefined}
            disabled={disabled || loading}
            initial={false}
            whileHover={!disabled && !loading ? { scale: 1.05 } : {}}
            whileTap={!disabled && !loading ? { scale: 0.95 } : {}}
            style={{
                ...style,
                opacity: disabled ? 0.6 : 1,
                cursor: disabled || loading ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
            }}
        >
            {loading ? (
                <>
                    <span className="spinner" style={{
                        width: '1em',
                        height: '1em',
                        border: '2px solid currentColor',
                        borderRightColor: 'transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }} />
                    <span>Cargando...</span>
                </>
            ) : children}
        </motion.button>
    );
};

export default Button;
