/**
 * apply-complete — Supabase Edge Function
 * POST /functions/v1/apply-complete
 *
 * Verifies each uploaded file exists in Storage, enforces:
 *   - allowed global mime types (jpg/png/pdf)
 *   - signature field: images only (no pdf)
 *   - max file size: 10 MB per file
 * Then sets status='submitted' and saves documents metadata.
 *
 * Returns: { success: true }
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const BUCKET = 'documents';
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const ALLOWED_MIMES = new Set([
    'image/jpeg', 'image/jpg', 'image/png', 'application/pdf',
]);
const SIGNATURE_MIMES = new Set(['image/jpeg', 'image/jpg', 'image/png']);

interface DocumentMeta {
    field: string;
    storage_path: string;
    filename: string;
    size: number;
    mime: string;
}

Deno.serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return cors(new Response(null));
    }
    if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

    let body: Record<string, unknown>;
    try {
        body = await req.json();
    } catch {
        return json({ error: 'Invalid JSON body' }, 400);
    }

    const { application_id, documents } = body as {
        application_id?: string;
        documents?: DocumentMeta[];
    };

    if (!application_id || typeof application_id !== 'string') {
        return json({ error: 'application_id is required' }, 400);
    }
    if (!Array.isArray(documents) || documents.length === 0) {
        return json({ error: 'documents array is required and must be non-empty' }, 400);
    }

    // Verify row exists and is still in 'created' state
    const { data: app, error: appErr } = await supabase
        .from('rooftop_applications')
        .select('id, status')
        .eq('id', application_id)
        .single();

    if (appErr || !app) return json({ error: 'Application not found' }, 404);
    if (app.status !== 'created') {
        return json({ error: `Application already in status '${app.status}'` }, 409);
    }

    // -------------------------------------------------------------------------
    // Validate each document's mime, size, and storage existence
    // -------------------------------------------------------------------------
    const fieldErrors: Record<string, string> = {};

    for (const doc of documents) {
        const { field, storage_path, filename, size, mime } = doc;

        // Server-side size enforcement (10 MB)
        if (typeof size !== 'number' || size > MAX_FILE_BYTES) {
            fieldErrors[field] = `File too large (max 10 MB). Got ${((size ?? 0) / 1024 / 1024).toFixed(1)} MB.`;
            continue;
        }

        // Mime type enforcement
        const allowedSet = field === 'signature' ? SIGNATURE_MIMES : ALLOWED_MIMES;
        if (!mime || !allowedSet.has(mime)) {
            fieldErrors[field] = field === 'signature'
                ? `Signature must be an image (JPG or PNG). Got: ${mime}`
                : `Invalid file type for ${field}: ${mime}. Allowed: jpg, png, pdf.`;
            continue;
        }

        // Verify the file was actually uploaded to Storage
        const { data: objects, error: listErr } = await supabase.storage
            .from(BUCKET)
            .list(storage_path.substring(0, storage_path.lastIndexOf('/')), {
                search: storage_path.substring(storage_path.lastIndexOf('/') + 1),
            });

        if (listErr || !objects || objects.length === 0) {
            console.warn(`[apply-complete] File not found in storage: ${storage_path}`);
            fieldErrors[field] = `File not found in storage for field '${field}'. Please re-upload.`;
        }
    }

    if (Object.keys(fieldErrors).length > 0) {
        return json({ error: 'Document validation failed', fields: fieldErrors }, 422);
    }

    // -------------------------------------------------------------------------
    // All checks passed — update the row
    // -------------------------------------------------------------------------
    const { error: updateErr, data: updatedApp } = await supabase
        .from('rooftop_applications')
        .update({
            documents: documents,
            status: 'submitted',
            submitted_at: new Date().toISOString(),
        })
        .eq('id', application_id)
        .select('name, mobile, email, consumer_no, aadhar_no, pan_no, submitted_at')
        .single();

    if (updateErr || !updatedApp) {
        console.error('[apply-complete] DB update error:', updateErr);
        return json({ error: 'Failed to finalise application. Please contact support.' }, 500);
    }

    console.log(`[apply-complete] Application ${application_id} submitted with ${documents.length} documents`);

    // -------------------------------------------------------------------------
    // Send Email Notification via Resend API
    // -------------------------------------------------------------------------
    // Do not block the application response on email sending, but execute it reliably
    try {
        await sendEmailNotification(application_id, updatedApp, documents);
    } catch (emailErr) {
        console.error(`[apply-complete] Failed to send email for ${application_id}:`, emailErr);
    }

    return json({ success: true });
});

/**
 * Downloads documents from Supabase Storage and sends them via Resend API.
 */
async function sendEmailNotification(
    application_id: string,
    appData: any,
    documents: DocumentMeta[]
) {
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
        throw new Error('RESEND_API_KEY is not set');
    }

    // Mask Aadhaar (last 4 digits visible)
    const maskedAadhaar = appData.aadhar_no 
        ? `****${appData.aadhar_no.slice(-4)}`
        : 'N/A';

    let emailHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
        <div style="background-color: #0369a1; color: #ffffff; padding: 20px; text-align: center;">
            <h2 style="margin: 0; font-size: 24px;">New Rooftop Solar Application</h2>
            <p style="margin: 5px 0 0; opacity: 0.9;">Application ID: ${application_id.substring(0, 8)}</p>
        </div>
        
        <div style="padding: 20px;">
            <h3 style="color: #333; margin-top: 0; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">Applicant Details</h3>
            <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; width: 40%; color: #555;">Name</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; color: #222;">${appData.name || 'N/A'}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Mobile</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; color: #222;">${appData.mobile || 'N/A'}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Email</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; color: #222;">${appData.email || 'N/A'}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Consumer Number</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; color: #222;">${appData.consumer_no || 'N/A'}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Aadhaar</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; color: #222;">${maskedAadhaar}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">PAN</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; color: #222;">${appData.pan_no || 'N/A'}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold; color: #555;">Submission Time</td>
                    <td style="padding: 10px; border-bottom: 1px solid #eee; color: #222;">${new Date(appData.submitted_at || Date.now()).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
                </tr>
            </table>

            <h3 style="color: #333; margin-top: 30px; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">Documents Submitted</h3>
            <div style="margin-top: 20px;">
`;

    const URL_EXPIRATION_SECONDS = 48 * 60 * 60; 

    for (const doc of documents) {
        const { data, error } = await supabase.storage
            .from(BUCKET)
            .createSignedUrl(doc.storage_path, URL_EXPIRATION_SECONDS);

        // Format field nicely (e.g. "aadhar_front" -> "Aadhaar Front")
        let formattedField = doc.field
            .split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
            
        // standardize Aadhaar spelling visually in the email
        formattedField = formattedField.replace(/Aadhar/i, 'Aadhaar');

        if (error || !data) {
            console.error(`[apply-complete] Failed to generate signed URL for document ${doc.filename}:`, error);
            emailHtml += `
                <div style="margin-bottom: 15px;">
                    <span style="display: block; padding: 12px 20px; background-color: #fee2e2; color: #991b1b; border-radius: 6px; font-weight: bold; border: 1px solid #fca5a5; text-align: center;">
                        Error: Could not link ${formattedField}
                    </span>
                </div>`;
        } else {
            emailHtml += `
                <div style="margin-bottom: 15px;">
                    <a href="${data.signedUrl}" target="_blank" style="display: block; padding: 12px 20px; background-color: #f0f9ff; color: #0284c7; text-decoration: none; border-radius: 6px; font-weight: bold; border: 1px solid #bae6fd; text-align: center; font-size: 16px;">
                        View ${formattedField}
                    </a>
                </div>`;
        }
    }
    
    emailHtml += `
            </div>
        </div>
        <div style="background-color: #f8fafc; padding: 15px; text-align: center; color: #64748b; font-size: 12px; border-top: 1px solid #e2e8f0;">
            This is an automated notification from the Santaji Electricals backend.
        </div>
    </div>`;

    console.log(`[apply-complete] Sending HTML email for ${application_id}`);

    const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${RESEND_API_KEY}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            from: 'Santaji Electricals <onboarding@resend.dev>',
            to: ['santaji.solar@gmail.com'],
            subject: `New Rooftop Solar Application - [App ${application_id.substring(0, 8)}]`,
            html: emailHtml
        })
    });

    if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Resend API Error: ${res.status} ${errText}`);
    }
}

function json(body: unknown, status = 200) {
    return cors(new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json' },
    }));
}

function cors(res: Response) {
    res.headers.set('Access-Control-Allow-Origin', '*');
    res.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    res.headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    return res;
}
