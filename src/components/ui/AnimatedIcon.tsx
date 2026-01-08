import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';

/**
 * Animation preset types
 */
type AnimationPreset = 'flame' | 'pulse' | 'draw' | 'spin' | 'bounce';

/**
 * Props for AnimatedIcon component
 */
interface AnimatedIconProps {
    readonly icon: LucideIcon;
    readonly size?: number;
    readonly color?: string;
    readonly strokeWidth?: number;
    readonly preset?: AnimationPreset;
    readonly className?: string;
}

/**
 * AnimatedIcon Component
 * A wrapper to animate Lucide icons with Framer Motion presets.
 */
const AnimatedIcon: React.FC<AnimatedIconProps> = ({
    icon: Icon,
    size = 24,
    color = "currentColor",
    strokeWidth = 2,
    preset = "pulse",
    className = ""
}) => {
    // Animation variants based on presets
    const variants = {
        flame: {
            animate: {
                scale: [1, 1.1, 1],
                rotate: [-2, 2, -2],
                filter: [
                    'drop-shadow(0 0 2px rgba(249, 115, 22, 0.4))',
                    'drop-shadow(0 0 8px rgba(249, 115, 22, 0.8))',
                    'drop-shadow(0 0 2px rgba(249, 115, 22, 0.4))'
                ],
                transition: {
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                }
            }
        },
        pulse: {
            animate: {
                scale: [1, 1.05, 1],
                opacity: [0.8, 1, 0.8],
                transition: {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                }
            }
        },
        draw: {
            initial: { pathLength: 0, opacity: 0 },
            animate: {
                pathLength: 1,
                opacity: 1,
                transition: {
                    duration: 1,
                    ease: "easeInOut"
                }
            }
        },
        spin: {
            animate: {
                rotate: 360,
                transition: {
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear"
                }
            }
        },
        bounce: {
            animate: {
                y: [0, -2, 0],
                transition: {
                    duration: 0.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeOut"
                }
            }
        }
    };

    const currentVariant = variants[preset] || variants.pulse;

    return (
        <motion.div
            className={`animated-icon-wrapper ${className}`}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
            initial={'initial' in currentVariant ? currentVariant.initial : undefined}
            animate={currentVariant.animate as { scale?: number[]; opacity?: number[]; rotate?: number[]; filter?: string[] }}
        >
            <Icon
                size={size}
                color={color}
                strokeWidth={strokeWidth}
            />
        </motion.div>
    );
};

export default AnimatedIcon;
