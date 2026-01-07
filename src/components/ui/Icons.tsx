import {
    Flame,
    ShieldCheck,
    HandCoins,
    CircleDollarSign,
    TrendingUp,
    Activity,
    Brain,
    LayoutGrid,
    Sparkles
} from 'lucide-react';
import {
    AnimatedActivity,
    AnimatedFingerprint,
    AnimatedShieldCheck,
    AnimatedCPU,
    AnimatedZap,
    AnimatedCoin,
    AnimatedDice,
    AnimatedRPS,
    AnimatedBrain,
    AnimatedGrid
} from './AnimatedLucideIcons';
import AnimatedIcon from './AnimatedIcon';

/**
 * Animated Icons
 * Premium animated versions using Lucide + Framer Motion
 */
export const AnimatedFlame = (props) => (
    <AnimatedIcon icon={Flame} preset="flame" color="#D64933" strokeWidth={1.5} {...props} />
);


export const AnimatedCoins = (props) => (
    <AnimatedIcon icon={HandCoins} preset="pulse" color="#D4AF37" strokeWidth={1.5} {...props} />
);

export const AnimatedBalance = (props) => (
    <AnimatedIcon icon={CircleDollarSign} preset="pulse" color="#F5F5F7" strokeWidth={1.5} {...props} />
);

export const AnimatedTrend = (props) => (
    <AnimatedIcon icon={TrendingUp} preset="bounce" color="currentColor" strokeWidth={1.5} {...props} />
);


/**
 * Original Game Icons (Manual SVGs for custom consistency)
 */
export const CoinIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="9" />
        <path d="M12 3v18" />
        <path d="M12 14c1.66 0 3-1.34 3-3s-1.34-3-3-3" />
        <path d="M9 12h-2" />
    </svg>
);

export const DiceIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M9 9H9.01" />
        <path d="M15 9H15.01" />
        <path d="M9 15H9.01" />
        <path d="M15 15H15.01" />
        <path d="M12 12H12.01" />
    </svg>
);

export const RPSIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <g transform="translate(12, 12)">
            <g transform="rotate(-30) translate(-8, -4)">
                <path d="M0 2l3 1.5 1.5 3-1.5 3-3 1.5-3-1.5-1.5-3 1.5-3z" fill="currentColor" opacity="0.4" stroke="none" transform="scale(1.2)" />
                <path d="M0 2l3 1.5 1.5 3-1.5 3-3 1.5-3-1.5-1.5-3 1.5-3z" fill="none" strokeWidth="1.5" transform="scale(1.2)" />
            </g>
            <g transform="translate(-3, -10)">
                <path d="M0 0h6v8h-6z" fill="currentColor" opacity="0.2" stroke="none" />
                <path d="M0 0h6v8h-6z" fill="none" strokeWidth="1.5" />
                <path d="M1.5 2h3 M1.5 4h3 M1.5 6h2" strokeWidth="1" />
            </g>
            <g transform="rotate(30) translate(2, -4)">
                <g transform="scale(1.2)">
                    <circle cx="1" cy="6" r="1.5" strokeWidth="1.5" />
                    <circle cx="5" cy="6" r="1.5" strokeWidth="1.5" />
                    <path d="M2.5 5L6 -2 M3.5 5L0 -2" strokeWidth="1.5" />
                    <circle cx="3" cy="1.5" r="0.5" fill="currentColor" stroke="none" />
                </g>
            </g>
        </g>
    </svg>
);

export const BrainIcon = ({ size = 32 }) => (
    <Brain size={size} strokeWidth={1.5} />
);

export const LightningIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
    </svg>
);

export const GridIcon = () => (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="5" height="5" rx="1" />
        <rect x="10" y="3" width="5" height="5" rx="1" />
        <rect x="17" y="3" width="5" height="5" rx="1" />
        <rect x="3" y="10" width="5" height="5" rx="1" />
        <rect x="10" y="10" width="5" height="5" rx="1" />
        <rect x="17" y="10" width="5" height="5" rx="1" />
        <rect x="3" y="17" width="5" height="5" rx="1" />
        <rect x="10" y="17" width="5" height="5" rx="1" />
        <rect x="17" y="17" width="5" height="5" rx="1" />
    </svg>
);

/**
 * Wrapped Lucide Icons
 * Filter out animateOnHover prop to prevent React DOM warnings
 * Pattern: Prop filtering wrapper for third-party components
 */
const withAnimateOnHoverFilter = (LucideIcon) => {
    const WrappedIcon = ({ animateOnHover, ...rest }) => <LucideIcon {...rest} />;
    WrappedIcon.displayName = `Wrapped${LucideIcon.displayName || LucideIcon.name || 'Icon'}`;
    return WrappedIcon;
};

const SafeLayoutGrid = withAnimateOnHoverFilter(LayoutGrid);
const SafeSparkles = withAnimateOnHoverFilter(Sparkles);

// Unified access object
export const Icons = {
    Coin: AnimatedCoin,
    Dice: AnimatedDice,
    RPS: AnimatedRPS,
    Brain: AnimatedBrain,
    Lightning: LightningIcon,
    Grid: AnimatedGrid,
    Flame: AnimatedFlame,
    Shield: AnimatedShieldCheck,
    Coins: AnimatedCoins,
    Balance: AnimatedBalance,
    Trend: AnimatedTrend,
    Activity: AnimatedActivity,
    Fingerprint: AnimatedFingerprint,
    ShieldCheck: AnimatedShieldCheck,
    CPU: AnimatedCPU,
    Zap: AnimatedZap,
    Layout: SafeLayoutGrid,
    Probability: SafeSparkles
};
