/**
 * applySubmit.js — Orchestrates the 4-step solar application submission flow.
 *
 *  1. POST /apply-create  → { application_id }
 *  2. POST /apply-presign → { uploads: [{ field, uploadUrl, storagePath, allowedMimes }] }
 *  3. PUT each file to its presigned URL (XHR, with progress + 1-retry)
 *  4. POST /apply-complete → { success: true }
 */

const SUPABASE_FUNCTIONS_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

/**
 * Upload a single file to a presigned URL via XHR so we can track progress.
 * Retries once on 5xx errors.
 * @param {string} url          Presigned PUT URL
 * @param {File}   file         File to upload
 * @param {function(number)} onProgress  Called with percent 0-100
 * @returns {Promise<void>}
 */
async function uploadFileWithProgress(url, file, onProgress) {
    const doUpload = () =>
        new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open('PUT', url);
            xhr.setRequestHeader('Content-Type', file.type);
            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable) {
                    onProgress(Math.round((e.loaded / e.total) * 100));
                }
            };
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    onProgress(100);
                    resolve();
                } else {
                    reject(new Error(`Upload failed (HTTP ${xhr.status})`));
                }
            };
            xhr.onerror = () => reject(new Error('Network error during upload'));
            xhr.send(file);
        });

    try {
        await doUpload();
    } catch (err) {
        // Retry once for transient server errors (5xx)
        if (err.message.includes('HTTP 5')) {
            await new Promise((r) => setTimeout(r, 1500));
            await doUpload();
        } else {
            throw err;
        }
    }
}

/**
 * Full submission orchestrator.
 *
 * @param {object} textFields    — { name, mobile, email, consumer_no, aadhar_no, pan_no, recaptcha_token }
 * @param {object} fileMap       — { electricity_bill: File, aadhar_front: File, ... }
 * @param {function(string, number)} onFileProgress — (fieldName, percent) callback
 * @returns {Promise<{ application_id: string }>}
 */
export async function submitApplication(textFields, fileMap, onFileProgress = () => { }) {
    // -----------------------------------------------------------------------
    // Step 1 — Create application row
    // -----------------------------------------------------------------------
    const createRes = await fetch(`${SUPABASE_FUNCTIONS_URL}/apply-create`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(textFields),
    });

    if (!createRes.ok) {
        const body = await createRes.json().catch(() => ({}));
        const msg = body?.error || `Server error (${createRes.status})`;
        if (createRes.status === 429) {
            throw new Error('Too many submissions. Please wait an hour and try again.');
        }
        throw new Error(msg);
    }

    const { application_id } = await createRes.json();

    // -----------------------------------------------------------------------
    // Step 2 — Request presigned upload URLs for all files
    // -----------------------------------------------------------------------
    const fields = Object.keys(fileMap).filter((k) => fileMap[k]); // only non-null files

    const presignRes = await fetch(`${SUPABASE_FUNCTIONS_URL}/apply-presign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ application_id, fields }),
    });

    if (!presignRes.ok) {
        const body = await presignRes.json().catch(() => ({}));
        throw new Error(body?.error || `Failed to get upload URLs (${presignRes.status})`);
    }

    const { uploads } = await presignRes.json();
    // uploads: [{ field, uploadUrl, storagePath, allowedMimes }]

    // -----------------------------------------------------------------------
    // Step 3 — Upload each file directly to Storage via presigned URL
    // -----------------------------------------------------------------------
    const documents = [];

    for (const { field, uploadUrl, storagePath } of uploads) {
        const file = fileMap[field];
        if (!file) continue;

        await uploadFileWithProgress(uploadUrl, file, (pct) =>
            onFileProgress(field, pct)
        );

        documents.push({
            field,
            storage_path: storagePath,
            filename: file.name,
            size: file.size,
            mime: file.type,
        });
    }

    // -----------------------------------------------------------------------
    // Step 4 — Complete the application
    // -----------------------------------------------------------------------
    const completeRes = await fetch(`${SUPABASE_FUNCTIONS_URL}/apply-complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ application_id, documents }),
    });

    if (!completeRes.ok) {
        const body = await completeRes.json().catch(() => ({}));
        throw new Error(body?.error || `Finalization failed (${completeRes.status})`);
    }

    return { application_id };
}
