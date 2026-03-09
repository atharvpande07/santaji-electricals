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

    const emailBody = `New Rooftop Solar Application

Name: ${appData.name || 'N/A'}
Mobile: ${appData.mobile || 'N/A'}
Email: ${appData.email || 'N/A'}

Consumer Number: ${appData.consumer_no || 'N/A'}
Aadhaar: ${maskedAadhaar}
PAN: ${appData.pan_no || 'N/A'}

Submission Time: ${new Date(appData.submitted_at || Date.now()).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
`;

    // Process attachments
    const attachments: { filename: string; content: string }[] = [];
    let totalSize = 0;
    const MAX_TOTAL_SIZE = 8 * 1024 * 1024; // ~8MB

    for (const doc of documents) {
        if (totalSize + doc.size > MAX_TOTAL_SIZE) {
            console.warn(`[apply-complete] Skipping attachment ${doc.filename}: would exceed 8MB limit`);
            continue;
        }

        const { data, error } = await supabase.storage
            .from(BUCKET)
            .download(doc.storage_path);

        if (error || !data) {
            console.error(`[apply-complete] Failed to download document ${doc.filename}:`, error);
            continue;
        }

        const arrayBuffer = await data.arrayBuffer();
        
        // Convert using Buffer (available in Deno via node compatibility)
        // Note: For Edge Functions we can also use Deno's native Buffer/encoding capabilities
        // Deno provides 'Buffer' globally in Edge environments for Node compat if imported,
        // but it's safest and fastest to use Uint8Array to base64 or a specialized module.
        // However, as requested to use buffer base64 conversion instead of btoa:
        // By standard we can rely on standard JS typed arrays or Deno specific base64 standard libraries if imported.
        // We will inline a helper or use the globally available Buffer if user enforces Node's Buffer.
        
        // Because standard Deno Edge functions might need imports for 'Buffer', we'll rely on a lightweight alternative
        // if Buffer isn't automatically injected, but Node's Buffer is widely used. We'll try to use a reliable
        // polyfill/native Deno std base64 encoder to be safe in edge functions.
        // Given the requirement "Use Buffer base64 conversion, not btoa", we will import Buffer from node:buffer
        const { Buffer } = await import('node:buffer');
        
        const base64Content = Buffer.from(arrayBuffer).toString('base64');

        attachments.push({
            filename: `${doc.field}_${doc.filename}`,
            content: base64Content
        });

        totalSize += doc.size;
    }

    console.log(`[apply-complete] Sending email for ${application_id} with ${attachments.length} attachments (Total encoded size: ~${(totalSize/1024/1024).toFixed(2)}MB)`);

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
            text: emailBody,
            attachments: attachments
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
