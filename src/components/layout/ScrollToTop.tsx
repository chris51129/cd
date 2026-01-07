import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * ScrollToTop - Utility component that resets scroll position on navigation
 */
const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant' // Reset immediately on page change
        });
    }, [pathname]);

    return null;
};

export default ScrollToTop;
