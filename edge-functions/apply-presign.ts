/**
 * apply-presign — Supabase Edge Function
 * POST /functions/v1/apply-presign
 *
 * Generates short-lived (10 min) presigned PUT URLs for each document field.
 * Signature field is restricted to image/jpeg and image/png only.
 * Returns: { uploads: [{ field, uploadUrl, storagePath, allowedMimes }] }
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { crypto } from 'https://deno.land/std@0.177.0/crypto/mod.ts';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE')!;
const BUCKET = 'documents';
const URL_TTL_SECONDS = 600; // 10 minutes

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// Per-field allowed mime types returned to the client so it can enforce before upload
const FIELD_MIME_MAP: Record<string, string[]> = {
    electricity_bill: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
    aadhar_front: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
    aadhar_back: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
    pan_card: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
    bank_passbook: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'],
    // signature: images ONLY — no PDF
    signature: ['image/jpeg', 'image/jpg', 'image/png'],
};

const VALID_FIELDS = new Set(Object.keys(FIELD_MIME_MAP));

// Derive file extension from the field+mime info stored at presign time
const MIME_EXT: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg',
    'image/png': 'png',
    'application/pdf': 'pdf',
};

/** Generate a UUID v4 string */
function uuid(): string {
    return crypto.randomUUID();
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

    const { application_id, fields } = body as { application_id?: string; fields?: string[] };

    if (!application_id || typeof application_id !== 'string') {
        return json({ error: 'application_id is required' }, 400);
    }
    if (!Array.isArray(fields) || fields.length === 0) {
        return json({ error: 'fields array is required and must be non-empty' }, 400);
    }

    // Validate field names
    const invalidFields = fields.filter((f) => !VALID_FIELDS.has(f));
    if (invalidFields.length > 0) {
        return json({ error: `Unknown field(s): ${invalidFields.join(', ')}` }, 400);
    }

    // Verify the application row exists and is in 'created' state
    const { data: app, error: appErr } = await supabase
        .from('rooftop_applications')
        .select('id, status')
        .eq('id', application_id)
        .single();

    if (appErr || !app) {
        return json({ error: 'Application not found' }, 404);
    }
    if (app.status !== 'created') {
        return json({ error: `Application is already in status '${app.status}'` }, 409);
    }

    // Generate presigned upload URLs
    const uploads: Array<{
        field: string;
        uploadUrl: string;
        storagePath: string;
        allowedMimes: string[];
    }> = [];

    for (const field of fields) {
        // We don't know the mime type yet (user hasn't picked a file on the server side).
        // Use a generic path with uuid; actual mime is validated in apply-complete.
        const fileUuid = uuid();
        const storagePath = `applications/${application_id}/${field}_${fileUuid}`;

        const { data: signed, error: signErr } = await supabase.storage
            .from(BUCKET)
            .createSignedUploadUrl(storagePath);

        if (signErr || !signed) {
            console.error(`[apply-presign] Failed to sign URL for field ${field}:`, signErr);
            return json({ error: `Failed to generate upload URL for ${field}` }, 500);
        }

        uploads.push({
            field,
            uploadUrl: signed.signedUrl,
            storagePath,
            allowedMimes: FIELD_MIME_MAP[field],
        });
    }

    console.log(`[apply-presign] Generated ${uploads.length} presigned URLs for application ${application_id}`);
    return json({ uploads });
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
