# Rooftop Solar Apply — Setup & Deploy Guide

Complete guide to set up the Supabase backend, deploy Edge Functions, and publish the site.

---

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) → **New project**.
2. Note your **Project URL** (e.g. `https://abcxyz.supabase.co`) and **anon public key**.
3. Under **Project Settings → API**, copy the **service_role** key — keep it secret.

---

## 2. Run the SQL Schema

In the Supabase Dashboard → **SQL Editor**, paste and run the entire contents of:
```
db/create_rooftop_applications.sql
```
This creates:
- `rooftop_applications` table with RLS (service_role only).
- `rate_limits` table for spam protection.
- Indexes and a `submitted_applications` view for admins.

---

## 3. Create the Storage Bucket

1. **Storage → New bucket** → Name: `documents` → **Private** (uncheck "Public bucket").
2. Under **Storage → Policies**, ensure no public SELECT policy exists.

Storage path pattern used:
```
applications/{application_id}/{field}_{uuid}
```

---

## 4. Set Environment Variables

### Frontend (`c:\Games\Santaji Electricals Web\.env`)
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_RECAPTCHA_SITE_KEY=your_recaptcha_v2_site_key
```
> ⚠ **Never** put `SUPABASE_SERVICE_ROLE` in `.env`. It must stay server-side only.

### Edge Function Secrets (Supabase Dashboard → Edge Functions → Secrets)
| Secret Name           | Value                              |
|-----------------------|------------------------------------|
| `SUPABASE_URL`        | Your Supabase project URL          |
| `SUPABASE_SERVICE_ROLE` | Your service_role key           |
| `RECAPTCHA_SECRET`    | Google reCAPTCHA v2 secret key     |

---

## 5. Get reCAPTCHA Keys

1. Go to [google.com/recaptcha](https://www.google.com/recaptcha/admin) → **Create**.
2. Type: **reCAPTCHA v2** ("I'm not a robot").
3. Add your GitHub Pages domain (e.g. `yourusername.github.io`).
4. Copy **Site Key** → `VITE_RECAPTCHA_SITE_KEY` in `.env`.
5. Copy **Secret Key** → `RECAPTCHA_SECRET` in Supabase Edge Function Secrets.

> If you skip reCAPTCHA (leave `RECAPTCHA_SECRET` empty), the server-side check is bypassed automatically — useful for local dev.

---

## 6. Deploy Edge Functions

Install the [Supabase CLI](https://supabase.com/docs/guides/cli):
```bash
npm install -g supabase
supabase login
supabase link --project-ref your-project-ref
```

Deploy all three functions:
```bash
supabase functions deploy apply-create  --project-ref your-project-ref
supabase functions deploy apply-presign --project-ref your-project-ref
supabase functions deploy apply-complete --project-ref your-project-ref
```

> The functions are in `edge-functions/`. Supabase CLI expects them in `supabase/functions/` by default; create symlinks or copy them there before deploying.

Verify deployment:
```bash
supabase functions list
```

---

## 7. Publish to GitHub Pages

```bash
npm run deploy
```
This runs `vite build` → copies `dist/404.html` → pushes `dist/` to the `gh-pages` branch.

Make sure `vite.config.js` has `base: '/'` (already set).

---

## 8. Admin: Retrieve Applications & Download Files

### List submitted applications (SQL)
```sql
select * from submitted_applications;
```

### Generate a signed download URL (Edge Function or Supabase Dashboard)
```typescript
// In your admin Edge Function or dashboard SQL:
const { data } = await supabase.storage
  .from('documents')
  .createSignedUrl('applications/{app_id}/{field}_{uuid}', 3600); // 1-hour URL
// data.signedUrl — share this with admin/sales
```

### Example: list all docs for one application
```sql
select id, name, mobile, jsonb_array_elements(documents) as doc
from rooftop_applications
where id = 'your-application-uuid';
```

---

## 9. Security Checklist (Before Going Live)

- [ ] `SUPABASE_SERVICE_ROLE` is **not** in `.env` or any committed file.
- [ ] `.env` is in `.gitignore` (already listed).
- [ ] Storage bucket `documents` is set to **Private**.
- [ ] RLS is enabled on `rooftop_applications` and `rate_limits` tables.
- [ ] Presigned URL TTL is ≤ 10 minutes (set to 600 s in `apply-presign.ts`).
- [ ] reCAPTCHA secret is set in Supabase Edge Function Secrets.
- [ ] Site is served over HTTPS (GitHub Pages enforces this automatically).
- [ ] Supabase project has email alerts enabled for Edge Function errors.
- [ ] Rotate `SUPABASE_SERVICE_ROLE` key periodically (Supabase: Settings → API → Regenerate).

---

## 10. Data Retention

**Recommendation: delete applications older than 24 months.**

Enable `pg_cron` in Supabase (Dashboard → Extensions → pg_cron):
```sql
select cron.schedule(
  'delete_old_applications',
  '0 2 * * *',
  $$delete from rooftop_applications
    where submitted_at < now() - interval '24 months'$$
);
```

> Storage files are NOT deleted automatically. Write a scheduled Edge Function or use the Supabase dashboard to periodically delete orphaned objects under `applications/`.

---

## 11. End-to-End Test (Staging)

1. `npm run dev` → open `http://localhost:5173/apply`.
2. Fill all fields with test data:
   - Mobile: `9876543210`
   - Aadhaar: `123456789012`
   - PAN: `ABCDE1234F`
3. Attach small test images (< 1 MB).
4. Check browser Network tab → confirm 3 calls: `apply-create`, `apply-presign`, `apply-complete`.
5. In Supabase Dashboard → Table Editor → `rooftop_applications` → confirm `status = 'submitted'`.
6. In Supabase Dashboard → Storage → `documents/applications/{id}/` → confirm files appear.

---

## 12. Key Rotation

1. **Supabase service_role**: Settings → API → Regenerate → update Supabase Edge Function Secrets immediately.
2. **reCAPTCHA secret**: Generate new keys at [google.com/recaptcha](https://www.google.com/recaptcha/admin) → update `RECAPTCHA_SECRET` Edge Function Secret.
3. **anon key rotation**: Update `VITE_SUPABASE_ANON_KEY` in `.env`, rebuild, and redeploy to GitHub Pages.

---

## How Documents Are Stored and Retrieved

**Storage:** Each uploaded file is stored in the private Supabase Storage bucket `documents` under the path `applications/{application_id}/{field}_{uuid}`. The `rooftop_applications` DB row holds a `documents` JSONB array with `{ field, storage_path, filename, size, mime }` for every file.

**Admin retrieval:** Admins use the Supabase Dashboard (Storage tab) or call `supabase.storage.from('documents').createSignedUrl(storagePath, 3600)` from a privileged Edge Function to get a short-lived (1-hour) signed download URL. Files are never publicly accessible. The admin downloads the file via that URL before it expires.
