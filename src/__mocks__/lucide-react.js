/**
 * Mock for lucide-react
 * Returns simple SVG components for testing
 */
const React = require('react');

const createIcon = (name) => {
    const IconComponent = React.forwardRef((props, ref) => {
        return React.createElement('svg', {
            ...props,
            ref,
            'data-testid': `lucide-${name.toLowerCase()}`,
            'data-lucide': name
        });
    });
    IconComponent.displayName = name;
    return IconComponent;
};

// Export all icons used in the project
module.exports = {
    // Home icons
    Zap: createIcon('Zap'),
    TrendingUp: createIcon('TrendingUp'),
    Activity: createIcon('Activity'),
    Cpu: createIcon('Cpu'),
    ShieldCheck: createIcon('ShieldCheck'),
    Fingerprint: createIcon('Fingerprint'),
    Brain: createIcon('Brain'),
    Grid3X3: createIcon('Grid3X3'),
    LayoutGrid: createIcon('LayoutGrid'),
    Sparkles: createIcon('Sparkles'),
    // Navigation icons
    Menu: createIcon('Menu'),
    X: createIcon('X'),
    ChevronDown: createIcon('ChevronDown'),
    ChevronUp: createIcon('ChevronUp'),
    // Game icons
    Coins: createIcon('Coins'),
    Dice5: createIcon('Dice5'),
    Flame: createIcon('Flame'),
    Trophy: createIcon('Trophy'),
    Timer: createIcon('Timer'),
    Clock: createIcon('Clock'),
    // Generic fallback
    LucideIcon: createIcon('LucideIcon')
};
