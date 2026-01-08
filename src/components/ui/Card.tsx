import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode, CSSProperties, HTMLAttributes } from 'react';

/**
 * Card props interface
 * Extends HTMLDivElement attributes to support tabIndex, role, onKeyDown, aria-*, data-*, etc.
 */
interface CardProps extends HTMLAttributes<HTMLDivElement> {
    readonly children?: ReactNode;
    readonly variant?: 'default' | 'primary' | 'secondary';
    readonly className?: string;
    readonly interactive?: boolean;
    readonly style?: CSSProperties;
}

/**
 * Overlay component for interactive cards
 */
const HoverOverlay = () => (
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
);

/**
 * Card - Atomic component for containers
 * 
 * Uses conditional rendering to properly type motion.div vs regular div.
 * This avoids type conflicts between framer-motion and React DOM types.
 */
const Card = ({
    children,
    variant = 'default',
    className = '',
    onClick,
    interactive = false,
    style = {},
    ...props
}: CardProps) => {
    const isInteractive = interactive || !!onClick;
    const baseClassName = `card card-${variant} ${className} ${isInteractive ? 'cursor-pointer' : ''}`;
    const baseStyle: CSSProperties = {
        position: 'relative',
        overflow: 'hidden',
        ...style
    };

    // Separate rendering for proper type safety
    if (isInteractive) {
        return (
            <motion.div
                className={baseClassName}
                onClick={onClick as HTMLMotionProps<'div'>['onClick']}
                style={baseStyle}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                whileTap={{ scale: 0.98 }}
                tabIndex={props.tabIndex}
                role={props.role}
                onKeyDown={props.onKeyDown as HTMLMotionProps<'div'>['onKeyDown']}
                aria-label={props['aria-label']}
                data-testid={(props as Record<string, unknown>)['data-testid'] as string | undefined}
            >
                {children}
                <HoverOverlay />
            </motion.div>
        );
    }

    return (
        <div
            className={baseClassName}
            onClick={onClick}
            style={baseStyle}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
