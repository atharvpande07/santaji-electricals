import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView } from '../utils/analytics';

const SEO = ({
    title = 'Santaji Electricals - RoofTop Solar Installation',
    description = 'Professional rooftop solar installation across households and commercial buildings in Maharashtra. Expert renewable energy solutions.',
    keywords = 'solar installation, rooftop solar, renewable energy, electrical services, Maharashtra',
    ogImage = '/og-image.jpg',
    ogType = 'website'
}) => {
    const location = useLocation();

    useEffect(() => {
        // Update document title
        document.title = title;

        // Update meta tags
        updateMetaTag('name', 'description', description);
        updateMetaTag('name', 'keywords', keywords);

        // Open Graph tags
        updateMetaTag('property', 'og:title', title);
        updateMetaTag('property', 'og:description', description);
        updateMetaTag('property', 'og:image', ogImage);
        updateMetaTag('property', 'og:type', ogType);
        updateMetaTag('property', 'og:url', window.location.href);

        // Twitter Card tags
        updateMetaTag('name', 'twitter:card', 'summary_large_image');
        updateMetaTag('name', 'twitter:title', title);
        updateMetaTag('name', 'twitter:description', description);
        updateMetaTag('name', 'twitter:image', ogImage);

        // Track page view
        trackPageView(title, location.pathname);
    }, [title, description, keywords, ogImage, ogType, location]);

    return null;
};

const updateMetaTag = (attributeName, attributeValue, content) => {
    let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);

    if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
    }

    element.setAttribute('content', content);
};

export default SEO;
