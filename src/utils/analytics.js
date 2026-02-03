import { config } from '../config/env';

// Google Tag Manager integration
export const initializeGTM = () => {
    if (!config.gtmId) {
        console.warn('Google Tag Manager ID not configured');
        return;
    }

    // Initialize GTM
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        'gtm.start': new Date().getTime(),
        event: 'gtm.js'
    });

    // Load GTM script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtm.js?id=${config.gtmId}`;
    document.head.appendChild(script);
};

// Track custom events
export const trackEvent = (eventName, eventData = {}) => {
    if (typeof window === 'undefined' || !window.dataLayer) {
        console.warn('Analytics not initialized');
        return;
    }

    window.dataLayer.push({
        event: eventName,
        ...eventData
    });
};

// Track form submission
export const trackFormSubmission = (formData) => {
    trackEvent('form_submission', {
        form_name: 'lead_form',
        service: formData.service || 'not_specified',
        timestamp: new Date().toISOString()
    });
};

// Track page view
export const trackPageView = (pageName, pagePath) => {
    trackEvent('page_view', {
        page_name: pageName,
        page_path: pagePath
    });
};

// Track button clicks
export const trackButtonClick = (buttonName, buttonLocation) => {
    trackEvent('button_click', {
        button_name: buttonName,
        button_location: buttonLocation
    });
};
