import React from 'react';
import { motion } from 'framer-motion';


/**
 * Common Props for Animated Icons
 */
/**
 * Animated Activity Icon
 * Features a drawing/sliding pulse effect.
 */
export const AnimatedActivity = ({ size = 24, color = "currentColor", strokeWidth = 2, className = "", animateOnHover = false }) => {
    const variants = {
        normal: { opacity: 1, pathLength: 1, pathOffset: 0 },
        animate: {
            opacity: [0.1, 1],
            pathLength: [0, 1],
            pathOffset: [1, 0],
            transition: {
                duration: 1.5,
                ease: "easeInOut",
                repeat: Infinity,
                repeatDelay: 0.5
            }
        }
    };

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <motion.path
                d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"
                initial="normal"
                animate={animateOnHover ? "normal" : "animate"}
                whileHover={animateOnHover ? "animate" : undefined}
                variants={variants}
            />
        </svg>
    );
};
/**
 * Animated Fingerprint Icon
 * Staggered manifestation of scanning lines.
 */
export const AnimatedFingerprint = ({ size = 24, color = "currentColor", strokeWidth = 2, className = "", animateOnHover = false }) => {
    const pathVariants = {
        normal: { pathLength: 1, opacity: 1 },
        animate: (i: number) => ({
            opacity: [0, 1, 1, 0.5, 1],
            pathLength: [0, 1],
            transition: {
                duration: 2,
                delay: i * 0.1,
                repeat: Infinity,
                repeatDelay: 1,
                ease: "easeInOut"
            }
        })
    };

    const paths = [
        "M12 10a2 2 0 0 0-2 2",
        "M14 10.3a2.4 2.4 0 0 0-4.8 0.1",
        "M17 14c-1.5-1.5-4.5-1.5-6 0",
        "M17 7c-2.5-2.5-7.5-2.5-10 0",
        "M2 13a10 10 0 0 1 20 0",
        "M12 15h0.1",
        "M12 18v3",
        "M9 21h6"
    ];

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            {paths.map((d, i) => (
                <motion.path
                    key={i}
                    d={d}
                    custom={i}
                    initial="normal"
                    animate={animateOnHover ? "normal" : "animate"}
                    whileHover={animateOnHover ? "animate" : undefined}
                    variants={pathVariants}
                />
            ))}
        </svg>
    );
};
/**
 * Animated Shield-Check Icon
 * Draws the shield and then scales/draws the checkmark.
 */
export const AnimatedShieldCheck = ({ size = 24, color = "currentColor", strokeWidth = 2, className = "", animateOnHover = false }) => {
    const shieldVariants = {
        normal: { pathLength: 1, opacity: 1 },
        animate: {
            pathLength: [0, 1],
            opacity: [0, 1],
            transition: { duration: 0.8, ease: "easeOut" }
        }
    };

    const checkVariants = {
        normal: { pathLength: 1, opacity: 1, scale: 1 },
        animate: {
            pathLength: [0, 1],
            opacity: [0, 1],
            scale: [0.5, 1.2, 1],
            transition: { duration: 0.5, delay: 0.8, ease: "backOut" }
        }
    };

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <motion.path
                d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"
                initial="normal"
                animate={animateOnHover ? "normal" : "animate"}
                whileHover={animateOnHover ? "animate" : undefined}
                variants={shieldVariants}
            />
            <motion.path
                d="m9 12 2 2 4-4"
                initial="normal"
                animate={animateOnHover ? "normal" : "animate"}
                whileHover={animateOnHover ? "animate" : undefined}
                variants={checkVariants}
            />
        </svg>
    );
};
/**
 * Animated CPU Icon
 * Pulsing connectors and core grid.
 */
export const AnimatedCPU = ({ size = 24, color = "currentColor", strokeWidth = 2, className = "", animateOnHover = false }) => {
    const pulseVariants = (isX: boolean) => ({
        normal: { scaleX: 1, scaleY: 1, opacity: 1 },
        animate: {
            [isX ? 'scaleX' : 'scaleY']: [1, 1.3, 1],
            opacity: [1, 0.4, 1],
            transition: {
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    });

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <rect x="9" y="9" width="6" height="6" />
            {/* Top/Bottom pins */}
            {[9, 12, 15].map(x => (
                <React.Fragment key={x}>
                    <motion.path d={`M${x} 2v2`} variants={pulseVariants(false)} initial="normal" animate={animateOnHover ? "normal" : "animate"} />
                    <motion.path d={`M${x} 20v2`} variants={pulseVariants(false)} initial="normal" animate={animateOnHover ? "normal" : "animate"} />
                </React.Fragment>
            ))}
            {/* Left/Right pins */}
            {[9, 12, 15].map(y => (
                <React.Fragment key={y}>
                    <motion.path d={`M2 ${y}h2`} variants={pulseVariants(true)} initial="normal" animate={animateOnHover ? "normal" : "animate"} />
                    <motion.path d={`M20 ${y}h2`} variants={pulseVariants(true)} initial="normal" animate={animateOnHover ? "normal" : "animate"} />
                </React.Fragment>
            ))}
        </svg>
    );
};
/**
 * Animated Zap Icon
 * Electric lightning strike effect.
 */
export const AnimatedZap = ({ size = 24, color = "currentColor", strokeWidth = 2, className = "", animateOnHover = false }) => {
    const variants = {
        normal: { pathLength: 1, opacity: 1, filter: "drop-shadow(0 0 0px rgba(0,0,0,0))" },
        animate: {
            pathLength: [0, 1],
            opacity: [0, 1],
            filter: [
                "drop-shadow(0 0 0px rgba(46, 92, 255, 0))",
                "drop-shadow(0 0 8px rgba(46, 92, 255, 0.8))",
                "drop-shadow(0 0 2px rgba(46, 92, 255, 0.4))"
            ],
            transition: {
                duration: 0.6,
                ease: "circOut",
                repeat: Infinity,
                repeatDelay: 2
            }
        }
    };

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <motion.path
                d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"
                initial="normal"
                animate={animateOnHover ? "normal" : "animate"}
                whileHover={animateOnHover ? "animate" : undefined}
                variants={variants}
            />
        </svg>
    );
};
/**
 * Animated Coin Icon
 * 3D-like vertical flip.
 */
export const AnimatedCoin = ({ size = 24, color = "currentColor", strokeWidth = 2, className = "", animateOnHover = false }) => {
    const variants = {
        normal: { rotateY: 0, scale: 1 },
        animate: {
            rotateY: [0, 180, 360],
            scale: [1, 1.1, 1],
            transition: {
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
                ease: "easeInOut"
            }
        }
    };

    return (
        <motion.svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            initial="normal"
            animate={animateOnHover ? "normal" : "animate"}
            whileHover={animateOnHover ? "animate" : undefined}
            variants={variants}
            style={{ perspective: 1000 }}
        >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 3v18" />
            <path d="M12 14c1.66 0 3-1.34 3-3s-1.34-3-3-3" />
            <path d="M9 12h-2" />
        </motion.svg>
    );
};
/**
 * Animated Dice Icon
 * Shake and jump effect.
 */
export const AnimatedDice = ({ size = 24, color = "currentColor", strokeWidth = 2, className = "", animateOnHover = false }) => {
    const variants = {
        normal: { rotate: 0, y: 0 },
        animate: {
            rotate: [0, -10, 10, -10, 0],
            y: [0, -4, 0],
            transition: {
                duration: 0.5,
                repeat: Infinity,
                repeatDelay: 4,
                ease: "easeInOut"
            }
        }
    };

    return (
        <motion.svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            initial="normal"
            animate={animateOnHover ? "normal" : "animate"}
            whileHover={animateOnHover ? "animate" : undefined}
            variants={variants}
        >
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <circle cx="9" cy="9" r="1" fill="currentColor" stroke="none" />
            <circle cx="15" cy="9" r="1" fill="currentColor" stroke="none" />
            <circle cx="9" cy="15" r="1" fill="currentColor" stroke="none" />
            <circle cx="15" cy="15" r="1" fill="currentColor" stroke="none" />
            <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
        </motion.svg>
    );
};
/**
 * Animated RPS Icon
 * Sequential pulse of hand symbols.
 */
export const AnimatedRPS = ({ size = 24, color = "currentColor", strokeWidth = 2, className = "", animateOnHover = false }) => {
    const itemVariants = {
        normal: { opacity: 0.4, scale: 1 },
        animate: (i: number) => ({
            opacity: [0.4, 1, 0.4],
            scale: [1, 1.2, 1],
            transition: {
                duration: 1.5,
                delay: i * 0.5,
                repeat: Infinity,
                repeatDelay: 2,
                ease: "easeInOut"
            }
        })
    };

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <g transform="translate(12, 12)">
                <motion.g
                    custom={0}
                    initial="normal"
                    animate={animateOnHover ? "normal" : "animate"}
                    variants={itemVariants}
                >
                    <g transform="rotate(-30) translate(-8, -4) scale(1.2)">
                        <path d="M0 2l3 1.5 1.5 3-1.5 3-3 1.5-3-1.5-1.5-3 1.5-3z" />
                    </g>
                </motion.g>
                <motion.g
                    custom={1}
                    initial="normal"
                    animate={animateOnHover ? "normal" : "animate"}
                    variants={itemVariants}
                >
                    <g transform="translate(-3, -10)">
                        <path d="M0 0h6v8h-6z" />
                        <path d="M1.5 2h3 M1.5 4h3 M1.5 6h2" strokeWidth={1} />
                    </g>
                </motion.g>
                <motion.g
                    custom={2}
                    initial="normal"
                    animate={animateOnHover ? "normal" : "animate"}
                    variants={itemVariants}
                >
                    <g transform="rotate(30) translate(2, -4) scale(1.2)">
                        <circle cx="1" cy="6" r="1.5" />
                        <circle cx="5" cy="6" r="1.5" />
                        <path d="M2.5 5L6 -2 M3.5 5L0 -2" />
                    </g>
                </motion.g>
            </g>
        </svg>
    );
};
/**
 * Animated Brain Icon (Memory)
 * Tech pulse of the brain core.
 */
export const AnimatedBrain = ({ size = 24, color = "currentColor", strokeWidth = 2, className = "", animateOnHover = false }) => {
    const variants = {
        normal: { scale: 1, filter: "drop-shadow(0 0 0px rgba(0,0,0,0))" },
        animate: {
            scale: [1, 1.05, 1],
            filter: [
                "drop-shadow(0 0 0px rgba(46, 92, 255, 0))",
                "drop-shadow(0 0 8px rgba(46, 92, 255, 0.6))",
                "drop-shadow(0 0 2px rgba(46, 92, 255, 0.3))"
            ],
            transition: {
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const pulseVariants = (i: number) => ({
        normal: { opacity: 1 },
        animate: {
            opacity: [0.3, 1, 0.3],
            transition: {
                duration: 2,
                delay: i * 0.3,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    });

    return (
        <motion.svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            initial="normal"
            animate={animateOnHover ? "normal" : "animate"}
            whileHover={animateOnHover ? "animate" : undefined}
            variants={variants}
        >
            <motion.path d="M12 18V5" variants={pulseVariants(0)} />
            <motion.path d="M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4" variants={pulseVariants(1)} />
            <motion.path d="M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5" variants={pulseVariants(2)} />
            <motion.path d="M17.997 5.125a4 4 0 0 1 2.526 5.77" variants={pulseVariants(3)} />
            <motion.path d="M18 18a4 4 0 0 0 2-7.464" variants={pulseVariants(4)} />
            <motion.path d="M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517" variants={pulseVariants(5)} />
            <motion.path d="M6 18a4 4 0 0 1-2-7.464" variants={pulseVariants(6)} />
            <motion.path d="M6.003 5.125a4 4 0 0 0-2.526 5.77" variants={pulseVariants(7)} />
        </motion.svg>
    );
};
/**
 * Animated Grid Icon
 * Scanning flash effect on individual tiles.
 */
export const AnimatedGrid = ({ size = 24, color = "currentColor", strokeWidth = 2, className = "", animateOnHover = false }) => {
    const tileVariants = {
        normal: { opacity: 1, scale: 1 },
        animate: (i: number) => ({
            opacity: [1, 0.3, 1],
            scale: [1, 0.9, 1],
            transition: {
                duration: 0.8,
                delay: i * 0.1,
                repeat: Infinity,
                repeatDelay: 5,
                ease: "easeInOut"
            }
        })
    };

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            {[
                { x: 3, y: 3 }, { x: 10, y: 3 }, { x: 17, y: 3 },
                { x: 3, y: 10 }, { x: 10, y: 10 }, { x: 17, y: 10 },
                { x: 3, y: 17 }, { x: 10, y: 17 }, { x: 17, y: 17 }
            ].map((pos, i) => (
                <motion.rect
                    key={i}
                    x={pos.x}
                    y={pos.y}
                    width={5}
                    height={5}
                    rx={1}
                    custom={i}
                    initial="normal"
                    animate={animateOnHover ? "normal" : "animate"}
                    variants={tileVariants}
                />
            ))}
        </svg>
    );
};
/**
 * Animated Dollar Icon
 * Tech pulse of the dollar sign.
 */
export const AnimatedDollar = ({ size = 24, color = "currentColor", strokeWidth = 2, className = "", animateOnHover = false }) => {
    const variants = {
        normal: { scale: 1, filter: "drop-shadow(0 0 0px rgba(0,0,0,0))" },
        animate: {
            scale: [1, 1.1, 1],
            filter: [
                "drop-shadow(0 0 0px rgba(46, 92, 255, 0))",
                "drop-shadow(0 0 8px rgba(46, 92, 255, 0.6))",
                "drop-shadow(0 0 2px rgba(46, 92, 255, 0.3))"
            ],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <motion.svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            initial="normal"
            animate={animateOnHover ? "normal" : "animate"}
            whileHover={animateOnHover ? "animate" : undefined}
            variants={variants}
        >
            <line x1="12" y1="1" x2="12" y2="23" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </motion.svg>
    );
};
/**
 * Animated Hourglass Icon
 * Rotation and sand pulse effect.
 */
export const AnimatedHourglass = ({ size = 24, color = "currentColor", strokeWidth = 2, className = "", animateOnHover = false }) => {
    const variants = {
        normal: { rotate: 0 },
        animate: {
            rotate: [0, 180, 180, 360, 360],
            transition: {
                duration: 4,
                repeat: Infinity,
                times: [0, 0.4, 0.5, 0.9, 1],
                ease: "easeInOut"
            }
        }
    };

    return (
        <motion.svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            initial="normal"
            animate={animateOnHover ? "normal" : "animate"}
            whileHover={animateOnHover ? "animate" : undefined}
            variants={variants}
        >
            <path d="M5 22h14" />
            <path d="M5 2h14" />
            <path d="M17 22c0-4-3-7-3-7V9c0 0 3-3 3-7H7c0 4 3 7 3 7v6s-3 3-3 7" />
        </motion.svg>
    );
};
/**
 * Animated Gamepad Icon
 * Button pulse effect.
 */
export const AnimatedGamepad = ({ size = 24, color = "currentColor", strokeWidth = 2, className = "", animateOnHover = false }) => {
    const variants = {
        normal: { y: 0 },
        animate: {
            y: [0, -2, 0],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const pulseVariants = {
        normal: { opacity: 1 },
        animate: {
            opacity: [0.4, 1, 0.4],
            transition: { duration: 1, repeat: Infinity }
        }
    };

    return (
        <motion.svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            initial="normal"
            animate={animateOnHover ? "normal" : "animate"}
            whileHover={animateOnHover ? "animate" : undefined}
            variants={variants}
        >
            <line x1="6" y1="12" x2="10" y2="12" />
            <line x1="8" y1="10" x2="8" y2="14" />
            <motion.circle cx="15" cy="13" r="1" variants={pulseVariants} initial="normal" animate="animate" />
            <motion.circle cx="18" cy="11" r="1" variants={pulseVariants} initial="normal" animate="animate" />
            <rect x="2" y="6" width="20" height="12" rx="2" />
        </motion.svg>
    );
};
/**
 * Animated Diamond Icon
 * Geometric pulse effect.
 */
export const AnimatedDiamond = ({ size = 24, color = "currentColor", strokeWidth = 2, className = "", animateOnHover = false }) => {
    const variants = {
        normal: { scale: 1, filter: "drop-shadow(0 0 0px rgba(0,0,0,0))" },
        animate: {
            scale: [1, 1.05, 1],
            filter: [
                "drop-shadow(0 0 0px rgba(46, 92, 255, 0))",
                "drop-shadow(0 0 8px rgba(185, 242, 255, 0.4))",
                "drop-shadow(0 0 2px rgba(185, 242, 255, 0.2))"
            ],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    return (
        <motion.svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            initial="normal"
            animate={animateOnHover ? "normal" : "animate"}
            whileHover={animateOnHover ? "animate" : undefined}
            variants={variants}
        >
            <path d="M6 3h12l4 6-10 12L2 9z" />
            <path d="M11 3 8 9l4 12 4-12-3-6" />
            <path d="M2 9h20" />
        </motion.svg>
    );
};
/**
 * Animated Trophy Icon
 * Victory pulse effect.
 */
export const AnimatedTrophy = ({ size = 24, color = "currentColor", strokeWidth = 2, className = "", animateOnHover = false }) => {
    const variants = {
        normal: { y: 0, scale: 1 },
        animate: {
            y: [0, -2, 0],
            scale: [1, 1.05, 1],
            transition: { duration: 2, repeat: Infinity, ease: "easeInOut" }
        }
    };

    return (
        <motion.svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            initial="normal"
            animate={animateOnHover ? "normal" : "animate"}
            whileHover={animateOnHover ? "animate" : undefined}
            variants={variants}
        >
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 22v-4" />
            <path d="M14 22v-4" />
            <path d="M12 15a6 6 0 0 0 6-6V4H6v5a6 6 0 0 0 6 6z" />
        </motion.svg>
    );
};
/**
 * Animated Banknote Icon
 * Floating effect.
 */
export const AnimatedBanknote = ({ size = 24, color = "currentColor", strokeWidth = 2, className = "", animateOnHover = false }) => {
    const variants = {
        normal: { rotate: 0, scale: 1 },
        animate: {
            rotate: [-1, 1, -1],
            scale: [1, 1.02, 1],
            transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }
    };

    return (
        <motion.svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            initial="normal"
            animate={animateOnHover ? "normal" : "animate"}
            whileHover={animateOnHover ? "animate" : undefined}
            variants={variants}
        >
            <rect width="20" height="12" x="2" y="6" rx="2" />
            <circle cx="12" cy="12" r="2" />
            <path d="M6 12h.01M18 12h.01" />
        </motion.svg>
    );
};
/**
 * Animated Crown Icon
 * Majestic shine effect.
 */
export const AnimatedCrown = ({ size = 24, color = "currentColor", strokeWidth = 2, className = "", animateOnHover = false }) => {
    const variants = {
        normal: { scale: 1, filter: "none" },
        animate: {
            scale: [1, 1.1, 1],
            filter: [
                "drop-shadow(0 0 0px rgba(212, 175, 55, 0))",
                "drop-shadow(0 0 10px rgba(212, 175, 55, 0.6))",
                "drop-shadow(0 0 2px rgba(212, 175, 55, 0.3))"
            ],
            transition: { duration: 2.5, repeat: Infinity, ease: "easeInOut" }
        }
    };

    return (
        <motion.svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
            initial="normal"
            animate={animateOnHover ? "normal" : "animate"}
            whileHover={animateOnHover ? "animate" : undefined}
            variants={variants}
        >
            <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7z" />
            <path d="M12 22H2v-2c0-1.1.9-2 2-2h16c1.1 0 2 .9 2 2v2H12z" />
        </motion.svg>
    );
};
/**
 * Animated Money Bag Icon (Wallet)
 * Clean, centered official Lucide Wallet.
 */
export const AnimatedMoneyBag = ({ size = 24, color = "currentColor", strokeWidth = 2, className = "", animateOnHover = false }) => {
    const variants = {
        normal: { scale: 1 },
        animate: {
            scale: [1, 1.05, 1],
            transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }
    };

    return (
        <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.svg
                width={size * 0.9}
                height={size * 0.9}
                viewBox="0 0 24 24"
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={className}
                initial="normal"
                animate={animateOnHover ? "normal" : "animate"}
                whileHover={animateOnHover ? "animate" : undefined}
                variants={variants}
            >
                <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                <path d="M16 17a2 2 0 0 1 2-2h4v4h-4a2 2 0 0 1-2-2Z" />
            </motion.svg>
        </div>
    );
};
/**
 * Animated Multiple Banknotes Icon
 * Explícitamente 3 billetes en abanico (Izq, Centro, Der)
 */
export const AnimatedMultipleBanknotes = ({ size = 24, color = "currentColor", strokeWidth = 2, className = "", animateOnHover = false }) => {
    const variants = {
        normal: { scale: 1 },
        animate: {
            scale: [1, 1.05, 1],
            transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }
    };

    return (
        <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={className}
                initial="normal"
                animate={animateOnHover ? "normal" : "animate"}
                whileHover={animateOnHover ? "animate" : undefined}
                variants={variants}
            >
                {/* Bill Left */}
                <g transform="translate(6, 12) rotate(-25) translate(-6, -6) scale(0.7)">
                    <rect width="20" height="12" x="2" y="6" rx="2" />
                    <circle cx="12" cy="12" r="2" />
                </g>
                {/* Bill Right */}
                <g transform="translate(18, 12) rotate(25) translate(-14, -6) scale(0.7)">
                    <rect width="20" height="12" x="2" y="6" rx="2" />
                    <circle cx="12" cy="12" r="2" />
                </g>
                {/* Bill Center (Front) */}
                <g transform="translate(12, 14) translate(-10, -8) scale(0.85)">
                    <rect width="20" height="12" x="2" y="6" rx="2" strokeWidth={strokeWidth + 0.5} />
                    <circle cx="12" cy="12" r="2" />
                    <path d="M6 12h.01M18 12h.01" />
                </g>
            </motion.svg>
        </div>
    );
};
/**
 * Animated Multiple Diamonds Icon
 * Explícitamente 3 diamantes en abanico (Izq, Centro, Der)
 */
export const AnimatedMultipleDiamonds = ({ size = 24, color = "currentColor", strokeWidth = 2, className = "", animateOnHover = false }) => {
    const variants = {
        normal: { scale: 1 },
        animate: {
            scale: [1, 1.05, 1],
            transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }
    };

    const diamondPath = "M6 3h12l4 6-10 12L2 9z";

    return (
        <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <motion.svg
                width={size}
                height={size}
                viewBox="0 0 24 24"
                fill="none"
                stroke={color}
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={className}
                initial="normal"
                animate={animateOnHover ? "normal" : "animate"}
                whileHover={animateOnHover ? "animate" : undefined}
                variants={variants}
            >
                {/* Diamond Left */}
                <path
                    d={diamondPath}
                    transform="translate(4, 12) rotate(-25) translate(-12, -10) scale(0.6)"
                    opacity="0.6"
                />
                {/* Diamond Right */}
                <path
                    d={diamondPath}
                    transform="translate(20, 12) rotate(25) translate(-12, -10) scale(0.6)"
                    opacity="0.6"
                />
                {/* Diamond Center (Front) */}
                <path
                    d={diamondPath}
                    transform="translate(12, 12) translate(-12, -10) scale(0.85)"
                    strokeWidth={strokeWidth + 0.5}
                />
            </motion.svg>
        </div>
    );
};
