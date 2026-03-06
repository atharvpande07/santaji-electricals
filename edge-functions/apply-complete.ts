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
const SERVICE_ROLE_KEY = Deno.env.get('SERVICE_ROLE_KEY')!;
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
    const { error: updateErr } = await supabase
        .from('rooftop_applications')
        .update({
            documents: documents,
            status: 'submitted',
            submitted_at: new Date().toISOString(),
        })
        .eq('id', application_id);

    if (updateErr) {
        console.error('[apply-complete] DB update error:', updateErr);
        return json({ error: 'Failed to finalise application. Please contact support.' }, 500);
    }

    console.log(`[apply-complete] Application ${application_id} submitted with ${documents.length} documents`);
    return json({ success: true });
});

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
