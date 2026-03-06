/**
 * applyValidation.js — Client-side validators for the Rooftop Solar Apply form.
 * All validators return null (valid) or an error string.
 */

/** Indian mobile: starts with 6-9, 10 digits total */
export const validateMobile = (v) => {
    if (!v || !v.trim()) return 'Mobile number is required';
    if (!/^[6-9]\d{9}$/.test(v.trim())) return 'Enter a valid 10-digit Indian mobile number (starts with 6–9)';
    return null;
};

/** Aadhaar: exactly 12 digits */
export const validateAadhaar = (v) => {
    if (!v || !v.trim()) return 'Aadhaar number is required';
    if (!/^\d{12}$/.test(v.replace(/\s/g, ''))) return 'Aadhaar number must be exactly 12 digits';
    return null;
};

/** PAN: 5 uppercase letters, 4 digits, 1 uppercase letter */
export const validatePAN = (v) => {
    if (!v || !v.trim()) return 'PAN number is required';
    if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(v.trim().toUpperCase())) {
        return 'Enter a valid PAN (e.g. ABCDE1234F)';
    }
    return null;
};

/** Email: standard format (mandatory now) */
export const validateEmail = (v) => {
    if (!v || !v.trim()) return 'Gmail  is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())) return 'Enter a valid email address';
    return null;
};

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']);
const SIGNATURE_MIME_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png']); // no PDF for signature
const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB

/**
 * Validate a single file attachment.
 * @param {File} file
 * @param {boolean} isSignature — if true, restricts to image types only (no PDF)
 * @returns {string|null} error message or null
 */
export const validateFile = (file, isSignature = false) => {
    if (!file) return null;
    const allowed = isSignature ? SIGNATURE_MIME_TYPES : ALLOWED_MIME_TYPES;
    if (!allowed.has(file.type)) {
        if (isSignature) return 'Signature must be a JPG or PNG image';
        return 'File must be JPG, PNG, or PDF';
    }
    if (file.size > MAX_FILE_BYTES) return `File too large (max 10 MB, got ${(file.size / 1024 / 1024).toFixed(1)} MB)`;
    return null;
};

/**
 * Validate the full form and return an errors object.
 * @param {object} fields — text fields
 * @param {object} files  — file objects keyed by field name
 * @returns {{ [fieldName]: string }} — empty object means all valid
 */
export const validateApplyForm = (fields, files) => {
    const errors = {};

    // Text fields
    if (!fields.name?.trim()) errors.name = 'Full name is required';
    const mobileErr = validateMobile(fields.mobile);
    if (mobileErr) errors.mobile = mobileErr;
    const emailErr = validateEmail(fields.email);
    if (emailErr) errors.email = emailErr;
    if (!fields.consumer_no?.trim()) errors.consumer_no = 'Consumer number is required';
    const aadhaarErr = validateAadhaar(fields.aadhar_no);
    if (aadhaarErr) errors.aadhar_no = aadhaarErr;
    const panErr = validatePAN(fields.pan_no);
    if (panErr) errors.pan_no = panErr;

    // Required file attachments
    const FILE_FIELDS = {
        electricity_bill: { label: 'Electricity bill', required: true },
        aadhar_front: { label: 'Aadhaar front', required: true },
        aadhar_back: { label: 'Aadhaar back', required: true },
        pan_card: { label: 'PAN card', required: true },
        bank_passbook: { label: 'Bank passbook', required: true },
        signature: { label: 'Signature', required: true, isSignature: true },
    };

    for (const [field, meta] of Object.entries(FILE_FIELDS)) {
        const file = files[field];
        if (meta.required && !file) {
            errors[field] = `${meta.label} is required`;
        } else if (file) {
            const fileErr = validateFile(file, meta.isSignature);
            if (fileErr) errors[field] = fileErr;
        }
    }

    if (!fields.consent) errors.consent = 'You must accept the consent declaration to proceed';

    return errors;
};
