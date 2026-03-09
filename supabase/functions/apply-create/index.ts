/**
 * apply-create — Supabase Edge Function
 * POST /functions/v1/apply-create
 *
 * Validates fields, checks reCAPTCHA, enforces rate-limiting, inserts DB row.
 * Returns: { application_id: string }
 */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const RECAPTCHA_SECRET = Deno.env.get('RECAPTCHA_SECRET') ?? '';
const RATE_LIMIT_MAX = 5;   // max submissions per IP per hour

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

// ---------------------------------------------------------------------------
// Validators (mirrors client-side)
// ---------------------------------------------------------------------------
const isValidMobile = (v: string) => /^[6-9]\d{9}$/.test(v.trim());
const isValidAadhaar = (v: string) => /^\d{12}$/.test(v.replace(/\s/g, ''));
const isValidPAN = (v: string) => /^[A-Z]{5}[0-9]{4}[A-Z]$/.test(v.trim().toUpperCase());
const isValidEmail = (v: string) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

// ---------------------------------------------------------------------------
// reCAPTCHA verification
// ---------------------------------------------------------------------------
async function verifyRecaptcha(token: string): Promise<boolean> {
    if (!RECAPTCHA_SECRET || !token) return !RECAPTCHA_SECRET; // skip if not configured
    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${encodeURIComponent(RECAPTCHA_SECRET)}&response=${encodeURIComponent(token)}`,
    });
    const json = await res.json();
    return json.success === true;
}

// ---------------------------------------------------------------------------
// Rate limiting: count per IP per rolling hour
// ---------------------------------------------------------------------------
async function checkRateLimit(ip: string): Promise<{ allowed: boolean; retryAfter: number }> {
    const windowStart = new Date();
    windowStart.setMinutes(0, 0, 0); // truncate to current hour

    // Upsert increments the counter atomically via INSERT ... ON CONFLICT
    const { error } = await supabase.rpc('increment_rate_limit', {
        p_ip: ip,
        p_window: windowStart.toISOString(),
    });

    if (error) {
        // If RPC not available fall back to a simple select+insert approach
        const { data } = await supabase
            .from('rate_limits')
            .select('count')
            .eq('ip', ip)
            .eq('window_start', windowStart.toISOString())
            .maybeSingle();

        const currentCount = (data?.count ?? 0) as number;

        if (currentCount === 0) {
            await supabase.from('rate_limits').insert({ ip, window_start: windowStart.toISOString(), count: 1 });
        } else {
            await supabase.from('rate_limits').update({ count: currentCount + 1 })
                .eq('ip', ip).eq('window_start', windowStart.toISOString());
        }

        if (currentCount >= RATE_LIMIT_MAX) {
            const nextHour = new Date(windowStart.getTime() + 3600_000);
            return { allowed: false, retryAfter: Math.ceil((nextHour.getTime() - Date.now()) / 1000) };
        }
    }

    return { allowed: true, retryAfter: 0 };
}

// ---------------------------------------------------------------------------
// Handler
// ---------------------------------------------------------------------------
Deno.serve(async (req: Request) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, {
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
            },
        });
    }

    if (req.method !== 'POST') {
        return json({ error: 'Method not allowed' }, 405);
    }

    // --- Rate limiting ---
    const clientIp =
        req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
        req.headers.get('x-real-ip') ??
        'unknown';

    const { allowed, retryAfter } = await checkRateLimit(clientIp);
    if (!allowed) {
        return json({ error: 'Too many submissions. Please try again later.' }, 429, {
            'Retry-After': String(retryAfter),
        });
    }

    // --- Parse body ---
    let body: Record<string, unknown>;
    try {
        body = await req.json();
    } catch {
        return json({ error: 'Invalid JSON body' }, 400);
    }

    const {
        name, mobile, email, consumer_no,
        aadhar_no, pan_no, consent, recaptcha_token,
    } = body as Record<string, string | boolean>;

    // --- Field validation ---
    const errs: Record<string, string> = {};
    if (!name || !(name as string).trim()) errs.name = 'Name is required';
    if (!isValidMobile(mobile as string ?? '')) errs.mobile = 'Invalid Indian mobile number';
    if (!isValidEmail(email as string ?? '')) errs.email = 'Invalid email format';
    if (!consumer_no || !(consumer_no as string).trim()) errs.consumer_no = 'Consumer number is required';
    if (!isValidAadhaar(aadhar_no as string ?? '')) errs.aadhar_no = 'Invalid Aadhaar (12 digits required)';
    if (!isValidPAN(pan_no as string ?? '')) errs.pan_no = 'Invalid PAN format';
    if (!consent) errs.consent = 'Consent is required';

    if (Object.keys(errs).length > 0) {
        return json({ error: 'Validation failed', fields: errs }, 422);
    }

    // --- reCAPTCHA ---
    const captchaOk = await verifyRecaptcha(recaptcha_token as string ?? '');
    if (!captchaOk) {
        return json({ error: 'reCAPTCHA verification failed. Please refresh and try again.' }, 422);
    }

    // --- Insert row ---
    const { data, error: dbError } = await supabase
        .from('rooftop_applications')
        .insert({
            name: (name as string).trim(),
            mobile: (mobile as string).trim(),
            email: (email as string)?.trim() || null,
            consumer_no: (consumer_no as string).trim(),
            aadhar_no: (aadhar_no as string).replace(/\s/g, ''),
            pan_no: (pan_no as string).trim().toUpperCase(),
            consent: true,
            consent_at: new Date().toISOString(),
            status: 'created',
        })
        .select('id')
        .single();

    if (dbError) {
        console.error('[apply-create] DB insert error:', dbError);
        return json({ error: 'Failed to create application. Please try again.' }, 500);
    }

    console.log(`[apply-create] Created application ${data.id} from IP ${clientIp}`);
    return json({ application_id: data.id }, 201);
});

// ---------------------------------------------------------------------------
// Helper
// ---------------------------------------------------------------------------
function json(body: unknown, status = 200, extraHeaders: Record<string, string> = {}) {
    return new Response(JSON.stringify(body), {
        status,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            ...extraHeaders,
        },
    });
}
