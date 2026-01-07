import React from 'react';
import { motion } from 'framer-motion';


/**
 * Card - Atomic component for containers
 */
const Card = ({
    children,
    variant = 'default',
    className = '',
    onClick,
    interactive = false,
    style = {},
    ...props
}) => {
    // If interactive or has onClick, use motion logic
    const isInteractive = interactive || !!onClick;

    const Component = isInteractive ? motion.div : 'div';

    // Animation props only if interactive
    const animationProps = isInteractive ? {
        whileHover: { y: -5, transition: { duration: 0.2 } },
        whileTap: { scale: 0.98 }
    } : {};

    return (
        <Component
            className={`card card-${variant} ${className} ${isInteractive ? 'cursor-pointer' : ''}`}
            onClick={onClick}
            style={{
                position: 'relative',
                overflow: 'hidden',
                ...style
            }}
            {...animationProps}
            {...props}
        >
            {children}

            {/* Subtle glass effect overlay for interactive cards */}
            {isInteractive && (
                <div
                    className="hover-overlay"
                    style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)',
                        opacity: 0,
                        transition: 'opacity 0.2s ease',
                        pointerEvents: 'none'
                    }}
                />
            )}
        </Component>
    );
};
export default Card;
