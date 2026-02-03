import { config, getCRMMethod } from '../config/env';

// Maximum retry attempts for failed submissions
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

// Helper function to delay execution
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Submit via embedded CRM form
const submitViaEmbed = async (formData) => {
    // For embedded forms, we typically don't programmatically submit
    // Instead, the CRM widget handles it
    // This is a placeholder for any custom logic needed
    throw new Error('Embedded form submission should be handled by the CRM widget');
};

// Submit via direct webhook
const submitViaWebhook = async (formData) => {
    const response = await fetch(config.crmWebhookUrl, {
        method: 'POST',
        mode: 'no-cors', // This bypasses CORS restrictions
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            email: formData.email || '',
            service: formData.service,
            district: formData.district,
            message: formData.message || '',
            timestamp: new Date().toISOString(),
            source: 'website'
        })
    });

    // With no-cors mode, we can't read the response
    // But if the request completes without error, it was successful
    return { success: true, message: 'Data submitted successfully' };
};

// Submit via serverless function
const submitViaServerless = async (formData) => {
    const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            name: formData.name,
            phone: formData.phone,
            email: formData.email || '',
            service: formData.service,
            message: formData.message || '',
            timestamp: new Date().toISOString(),
            source: 'website'
        })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Serverless submission failed: ${response.statusText}`);
    }

    return response.json();
};

// Main submission function with retry logic
export const submitLead = async (formData, retryCount = 0) => {
    const method = getCRMMethod();

    if (!method) {
        throw new Error('No CRM integration configured. Please contact the administrator.');
    }

    try {
        let result;

        switch (method) {
            case 'embed':
                result = await submitViaEmbed(formData);
                break;
            case 'webhook':
                result = await submitViaWebhook(formData);
                break;
            case 'serverless':
                result = await submitViaServerless(formData);
                break;
            default:
                throw new Error('Invalid CRM method');
        }

        return { success: true, data: result };
    } catch (error) {
        console.error('CRM submission error:', error);

        // Retry logic
        if (retryCount < MAX_RETRIES) {
            console.log(`Retrying... Attempt ${retryCount + 1} of ${MAX_RETRIES}`);
            await delay(RETRY_DELAY * (retryCount + 1)); // Exponential backoff
            return submitLead(formData, retryCount + 1);
        }

        // All retries failed
        return {
            success: false,
            error: error.message || 'Failed to submit form. Please try again later.'
        };
    }
};

// Load embedded CRM code if configured
export const loadEmbeddedCRM = () => {
    if (!config.crmEmbedCode) {
        return;
    }

    // Create a container for the embedded code
    const container = document.createElement('div');
    container.innerHTML = config.crmEmbedCode;

    // Append to body (you may want to append to a specific element)
    document.body.appendChild(container);
};
