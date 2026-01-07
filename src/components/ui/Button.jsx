import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * Button - Atomic component for user interactions
 */
const Button = ({ 
    children, 
    onClick, 
    variant = 'primary', 
    size = 'medium', 
    disabled = false, 
    loading = false,
    className = '',
    style = {},
    type = 'button',
    ...props 
}) => {
    // Mapping variants to CSS classes (assuming buttons.css exists/will be updated)
    // or using direct styles for "vibe" if classes aren't consistent yet
    const baseClass = `btn-${variant}`; 
    
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
            {...props}
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

Button.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    variant: PropTypes.oneOf(['primary', 'secondary', 'danger', 'ghost', 'outline']),
    size: PropTypes.oneOf(['small', 'medium', 'large']),
    disabled: PropTypes.bool,
    loading: PropTypes.bool,
    className: PropTypes.string,
    style: PropTypes.object,
    type: PropTypes.string
};

export default Button;
