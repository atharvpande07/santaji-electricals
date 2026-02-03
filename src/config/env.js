// Environment variables configuration
export const config = {
    // CRM Integration
    crmEmbedCode: import.meta.env.VITE_CRM_EMBED_CODE || '',
    crmWebhookUrl: import.meta.env.VITE_CRM_WEBHOOK_URL || '',
    crmApiEndpoint: import.meta.env.VITE_CRM_API_ENDPOINT || '',
    crmApiKey: import.meta.env.VITE_CRM_API_KEY || '',

    // Analytics
    gtmId: import.meta.env.VITE_GTM_ID || '',

    // WhatsApp
    whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || '',
};

// Determine which CRM method is configured
export const getCRMMethod = () => {
    if (config.crmEmbedCode) return 'embed';
    if (config.crmWebhookUrl) return 'webhook';
    if (config.crmApiEndpoint && config.crmApiKey) return 'serverless';
    return null;
};

// Validate configuration
export const validateConfig = () => {
    const method = getCRMMethod();
    if (!method) {
        console.warn('No CRM integration configured. Please set up environment variables.');
        return false;
    }
    return true;
};
