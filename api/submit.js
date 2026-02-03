// Serverless Function for Netlify/Vercel
// This forwards form submissions to your CRM

export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({
            success: false,
            message: 'Method not allowed'
        });
    }

    try {
        const formData = req.body;

        // Validate required fields
        if (!formData.name || !formData.phone) {
            return res.status(400).json({
                success: false,
                message: 'Name and phone number are required'
            });
        }

        // Get CRM credentials from environment variables
        const crmApiEndpoint = process.env.VITE_CRM_API_ENDPOINT;
        const crmApiKey = process.env.VITE_CRM_API_KEY;

        if (!crmApiEndpoint || !crmApiKey) {
            console.error('CRM configuration missing');
            return res.status(500).json({
                success: false,
                message: 'CRM integration not configured properly'
            });
        }

        // Forward to CRM
        const response = await fetch(crmApiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${crmApiKey}`,
                // Add other headers as required by your CRM
            },
            body: JSON.stringify({
                name: formData.name,
                phone: formData.phone,
                email: formData.email || '',
                service: formData.service || 'Not specified',
                district: formData.district,
                message: formData.message || '',
                timestamp: formData.timestamp,
                source: formData.source || 'website'
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('CRM API Error:', errorText);
            throw new Error(`CRM API returned ${response.status}`);
        }

        const data = await response.json();

        // Return success response
        return res.status(200).json({
            success: true,
            message: 'Form submitted successfully',
            data: data
        });

    } catch (error) {
        console.error('Serverless function error:', error);

        return res.status(500).json({
            success: false,
            message: 'Failed to submit form. Please try again later.',
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
}

// Alternative export for Netlify Functions
// Uncomment if deploying to Netlify
/*
exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, message: 'Method not allowed' })
    };
  }

  try {
    const formData = JSON.parse(event.body);
    
    // Same logic as above...
    
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Form submitted successfully' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: error.message })
    };
  }
};
*/
