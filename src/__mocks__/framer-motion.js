/**
 * Global mock for framer-motion
 * Auto-mocked in all tests via Jest moduleNameMapper
 */
const React = require('react');

const createMotionComponent = (tag) => {
    const Component = React.forwardRef(({ children, ...props }, ref) => {
        // Filter out framer-motion specific props that would cause React warnings
        const {
            initial, animate, exit, variants, transition,
            whileHover, whileTap, whileFocus, whileInView,
            layoutId, layout, custom, ...domProps
        } = props;
        return React.createElement(tag, { ...domProps, ref }, children);
    });
    Component.displayName = `motion.${tag}`;
    return Component;
};

module.exports = {
    motion: {
        // HTML elements
        div: createMotionComponent('div'),
        span: createMotionComponent('span'),
        button: createMotionComponent('button'),
        nav: createMotionComponent('nav'),
        section: createMotionComponent('section'),
        h1: createMotionComponent('h1'),
        h2: createMotionComponent('h2'),
        p: createMotionComponent('p'),
        a: createMotionComponent('a'),
        // SVG elements (for AnimatedLucideIcons)
        svg: createMotionComponent('svg'),
        path: createMotionComponent('path'),
        circle: createMotionComponent('circle'),
        rect: createMotionComponent('rect'),
        g: createMotionComponent('g'),
        line: createMotionComponent('line'),
        polyline: createMotionComponent('polyline'),
        polygon: createMotionComponent('polygon'),
    },
    AnimatePresence: ({ children }) => React.createElement(React.Fragment, null, children),
    useScroll: () => ({ scrollY: { get: () => 0 } }),
    useTransform: () => 0,
};
