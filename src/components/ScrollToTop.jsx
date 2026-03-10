import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname } = useLocation();

    useEffect(() => {
        // A slight timeout ensures Framer Motion's page transitions resolve before snapping to top
        const timer = setTimeout(() => {
            window.scrollTo({ top: 0, behavior: 'instant' });
        }, 50);
        return () => clearTimeout(timer);
    }, [pathname]);

    return null;
};

export default ScrollToTop;
