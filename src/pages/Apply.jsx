import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '../components/SEO';
import { validateApplyForm, validateFile } from '../utils/applyValidation';
import { submitApplication } from '../utils/applySubmit';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '';

const FILE_FIELDS = {
    electricity_bill: { label: 'Electricity Bill', accept: '.jpg,.jpeg,.png,.pdf', required: true, isSignature: false },
    aadhar_front: { label: 'Aadhaar Front', accept: '.jpg,.jpeg,.png,.pdf', required: true, isSignature: false },
    aadhar_back: { label: 'Aadhaar Back', accept: '.jpg,.jpeg,.png,.pdf', required: true, isSignature: false },
    pan_card: { label: 'PAN Card', accept: '.jpg,.jpeg,.png,.pdf', required: true, isSignature: false },
    bank_passbook: { label: 'Bank Passbook', accept: '.jpg,.jpeg,.png,.pdf', required: true, isSignature: false },
    signature: { label: 'Signature (image)', accept: '.jpg,.jpeg,.png', required: true, isSignature: true },
};

const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
};

// ---------------------------------------------------------------------------
// Small helper components
// ---------------------------------------------------------------------------

/** Renders a per-file upload progress bar */
const ProgressBar = ({ pct }) => (
    <div className="mt-1 w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
        <motion.div
            className="bg-primary-500 h-1.5 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.2 }}
        />
    </div>
);

/** Image thumbnail shown when user picks an image file */
const Thumbnail = ({ file }) => {
    if (!file || !file.type.startsWith('image/')) return null;
    const url = URL.createObjectURL(file);
    return (
        <img
            src={url}
            alt="preview"
            onLoad={() => URL.revokeObjectURL(url)}
            className="mt-2 h-20 w-20 object-cover rounded-lg border border-gray-200 shadow-sm"
        />
    );
};

/** Generic file input card */
const FileInputCard = ({ fieldKey, label, accept, required, isSignature, file, error, progress, onChange }) => {
    const inputRef = useRef(null);

    const handleChange = (e) => {
        const f = e.target.files?.[0] || null;
        onChange(fieldKey, f);
    };

    const handleClear = (e) => {
        e.stopPropagation();
        if (inputRef.current) inputRef.current.value = '';
        onChange(fieldKey, null);
    };

    return (
        <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
                {label} {required && <span className="text-red-500">*</span>}
                {isSignature && (
                    <span className="ml-2 text-xs font-normal text-gray-500">(JPG / PNG only)</span>
                )}
            </label>

            <div
                className={`relative flex items-center justify-between border-2 border-dashed rounded-xl p-3 cursor-pointer transition-colors duration-200
                    ${error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-gray-50 hover:border-primary-400 hover:bg-primary-50'}`}
                onClick={() => inputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept={accept}
                    className="hidden"
                    onChange={handleChange}
                    aria-required={required}
                />

                {file ? (
                    <div className="flex items-center gap-3 min-w-0">
                        <svg className="w-5 h-5 text-primary-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm text-gray-800 truncate">{file.name}</span>
                        <span className="text-xs text-gray-500 flex-shrink-0">({(file.size / 1024 / 1024).toFixed(1)} MB)</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-2 text-gray-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                        </svg>
                        <span className="text-sm">Click to upload or drag file here</span>
                    </div>
                )}

                {file && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="ml-2 text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                        aria-label="Remove file"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            <Thumbnail file={file} />
            {typeof progress === 'number' && progress > 0 && <ProgressBar pct={progress} />}
            {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        </div>
    );
};

/** Labelled text/email/tel input */
const TextInput = ({ id, label, type = 'text', required, value, onChange, error, placeholder, hint }) => (
    <div className="mb-4">
        <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-1">
            {label}{' '}
            {required
                ? <span className="text-red-500">*</span>
                : <span className="text-xs font-normal text-gray-400">(Optional)</span>
            }
        </label>
        <input
            type={type}
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`input-field ${error ? 'input-error' : ''}`}
            aria-required={required}
            aria-describedby={error ? `${id}-err` : undefined}
        />
        {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
        {error && <p id={`${id}-err`} className="mt-1 text-xs text-red-600" role="alert">{error}</p>}
    </div>
);

// ---------------------------------------------------------------------------
// Section divider
// ---------------------------------------------------------------------------
const SectionHeader = ({ icon, title, subtitle }) => (
    <div className="flex items-start gap-3 mb-5 pb-3 border-b border-gray-100">
        <div className="w-9 h-9 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 text-primary-600">
            {icon}
        </div>
        <div>
            <h3 className="text-base font-bold text-gray-900">{title}</h3>
            {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
    </div>
);

// ---------------------------------------------------------------------------
// Confirmation screen shown after success
// ---------------------------------------------------------------------------
const SuccessScreen = ({ applicationId }) => (
    <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 px-6"
    >
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-3">Application Submitted!</h2>
        <p className="text-gray-600 mb-2">Your rooftop solar application has been received.</p>
        <div className="inline-block bg-gray-100 rounded-xl px-5 py-3 mb-6">
            <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Application ID</p>
            <p className="text-lg font-mono font-bold text-primary-700 select-all">{applicationId}</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-left max-w-md mx-auto">
            <p className="font-semibold text-blue-900 mb-2">What happens next?</p>
            <ol className="space-y-1 text-sm text-blue-800 list-decimal list-inside">
                <li>Our team will verify your documents (1–3 business days).</li>
                <li>You'll receive a call on your registered mobile number.</li>
                <li>Site survey will be scheduled after verification.</li>
                <li>Subsidy processing begins after survey approval.</li>
            </ol>
        </div>
        <p className="mt-5 text-sm text-gray-500">
            Save your Application ID for future reference. Contact us at{' '}
            <a href="tel:9422168882" className="text-primary-600 font-semibold hover:underline">9422168882</a>{' '}
            for any queries.
        </p>
    </motion.div>
);

// ---------------------------------------------------------------------------
// Main Apply component
// ---------------------------------------------------------------------------
const Apply = () => {
    // Text form fields
    const [fields, setFields] = useState({
        name: '', mobile: '', email: '',
        consumer_no: '', aadhar_no: '', pan_no: '',
        consent: false,
    });

    // File map
    const [files, setFiles] = useState({
        electricity_bill: null, aadhar_front: null, aadhar_back: null,
        pan_card: null, bank_passbook: null, signature: null,
    });

    const [errors, setErrors] = useState({});
    const [fileProgress, setFileProgress] = useState({}); // { fieldKey: 0-100 }
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitPhase, setSubmitPhase] = useState(''); // '' | 'creating' | 'uploading' | 'finalizing'
    const [submitError, setSubmitError] = useState('');
    const [successId, setSuccessId] = useState(null);
    const successRef = useRef(null);

    // -----------------------------------------------------------------------
    // Handlers
    // -----------------------------------------------------------------------
    const handleTextChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFields((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
        setSubmitError('');
    };

    const handleFileChange = useCallback((fieldKey, file) => {
        setFiles((prev) => ({ ...prev, [fieldKey]: file }));
        if (file) {
            const meta = FILE_FIELDS[fieldKey];
            const err = validateFile(file, meta.isSignature);
            setErrors((prev) => ({ ...prev, [fieldKey]: err }));
        } else {
            setErrors((prev) => ({ ...prev, [fieldKey]: null }));
        }
        setFileProgress((prev) => ({ ...prev, [fieldKey]: 0 }));
        setSubmitError('');
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');

        const validationErrors = validateApplyForm(fields, files);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            // Scroll to first error
            const firstErrKey = Object.keys(validationErrors)[0];
            document.getElementById(firstErrKey)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }

        // Collect reCAPTCHA token if configured
        let recaptcha_token = '';
        if (RECAPTCHA_SITE_KEY && window.grecaptcha) {
            try {
                recaptcha_token = await new Promise((resolve) =>
                    window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action: 'apply' }).then(resolve)
                );
            } catch {
                recaptcha_token = '';
            }
        }

        const textPayload = {
            name: fields.name.trim(),
            mobile: fields.mobile.trim(),
            email: fields.email.trim() || null,
            consumer_no: fields.consumer_no.trim(),
            aadhar_no: fields.aadhar_no.replace(/\s/g, ''),
            pan_no: fields.pan_no.trim().toUpperCase(),
            consent: fields.consent,
            recaptcha_token,
        };

        setIsSubmitting(true);
        setFileProgress({});

        try {
            setSubmitPhase('creating');
            const { application_id } = await submitApplication(
                textPayload,
                files,
                (fieldKey, pct) => {
                    setSubmitPhase('uploading');
                    setFileProgress((prev) => ({ ...prev, [fieldKey]: pct }));
                }
            );
            setSubmitPhase('finalizing');
            setSuccessId(application_id);
            
            // Scroll to the success banner instantly after react re-renders
            setTimeout(() => {
                successRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        } catch (err) {
            setSubmitError(err.message || 'An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
            setSubmitPhase('');
        }
    };

    // -----------------------------------------------------------------------
    // Phase label (shown during submission)
    // -----------------------------------------------------------------------
    const phaseLabel = {
        creating: 'Creating application…',
        uploading: 'Uploading documents…',
        finalizing: 'Finalising…',
    }[submitPhase] || 'Submitting…';

    // -----------------------------------------------------------------------
    // Render
    // -----------------------------------------------------------------------
    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
        >
            <SEO
                title="Apply for Rooftop Solar — Santaji Electricals"
                description="Apply for a government-subsidised rooftop solar installation with Santaji Electricals. Fill in your details and upload documents to get started."
                keywords="rooftop solar apply, PM Surya Ghar subsidy, solar application Maharashtra, Santaji Electricals"
            />

            {/* Hero */}
            <section className="gradient-hero text-white section-padding">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1.5 text-sm font-semibold mb-6">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                            </svg>
                            PM Surya Ghar Muft Bijli Yojana
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                            Apply for Rooftop Solar
                        </h1>
                        <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto">
                            Get up to <strong className="text-white">₹78,000</strong> government subsidy on your rooftop solar installation.
                            Fill in the form below and our team will handle the rest.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Form section */}
            <section className="section-padding bg-gray-50">
                <div className="container-custom max-w-3xl">

                    {successId ? (
                        <div ref={successRef} className="bg-white rounded-2xl shadow-xl p-6 md:p-10 scroll-mt-24">
                            <SuccessScreen applicationId={successId} />
                        </div>
                    ) : (
                        <motion.form
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            onSubmit={handleSubmit}
                            className="bg-white rounded-2xl shadow-xl p-6 md:p-10"
                            noValidate
                        >
                            <p className="text-sm text-gray-500 mb-8 flex items-center gap-2">
                                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Fields marked <span className="text-red-500 mx-1">*</span> are required. All uploaded documents are stored securely and used only for subsidy processing.
                            </p>

                            {/* ---- Section 1: Personal Details ---- */}
                            <SectionHeader
                                icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>}
                                title="Personal Details"
                                subtitle="Your basic contact information"
                            />
                            <TextInput id="name" label="Full Name" required value={fields.name} onChange={handleTextChange} error={errors.name} placeholder="e.g. Ramesh Sharma" />
                            <TextInput id="mobile" label="Mobile Number" type="tel" required value={fields.mobile} onChange={handleTextChange} error={errors.mobile} placeholder="e.g. 9876543210" hint="10-digit Indian mobile number" />
                            <TextInput id="email" label="Gmail *" type="email" required value={fields.email} onChange={handleTextChange} error={errors.email} placeholder="e.g. name@gmail.com" />

                            {/* ---- Section 2: Aadhaar ---- */}
                            <div className="mt-8">
                                <SectionHeader
                                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4z" /></svg>}
                                    title="Aadhaar Card"
                                    subtitle="Upload both sides of your Aadhaar card"
                                />
                                <TextInput id="aadhar_no" label="Aadhaar Number" required value={fields.aadhar_no} onChange={handleTextChange} error={errors.aadhar_no} placeholder="12-digit number" hint="Enter 12-digit Aadhaar number (spaces allowed)" />
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <FileInputCard fieldKey="aadhar_front" {...FILE_FIELDS.aadhar_front} file={files.aadhar_front} error={errors.aadhar_front} progress={fileProgress.aadhar_front} onChange={handleFileChange} />
                                    <FileInputCard fieldKey="aadhar_back"  {...FILE_FIELDS.aadhar_back} file={files.aadhar_back} error={errors.aadhar_back} progress={fileProgress.aadhar_back} onChange={handleFileChange} />
                                </div>
                            </div>

                            {/* ---- Section 3: PAN ---- */}
                            <div className="mt-8">
                                <SectionHeader
                                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
                                    title="PAN Card"
                                    subtitle="Required for subsidy disbursement"
                                />
                                <TextInput id="pan_no" label="PAN Number" required value={fields.pan_no} onChange={handleTextChange} error={errors.pan_no} placeholder="e.g. ABCDE1234F" hint="10-character PAN (uppercase)" />
                                <FileInputCard fieldKey="pan_card" {...FILE_FIELDS.pan_card} file={files.pan_card} error={errors.pan_card} progress={fileProgress.pan_card} onChange={handleFileChange} />
                            </div>

                            {/* ---- Section 4: Bank Passbook ---- */}
                            <div className="mt-8">
                                <SectionHeader
                                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>}
                                    title="Bank Passbook"
                                    subtitle="First page showing account details"
                                />
                                <FileInputCard fieldKey="bank_passbook" {...FILE_FIELDS.bank_passbook} file={files.bank_passbook} error={errors.bank_passbook} progress={fileProgress.bank_passbook} onChange={handleFileChange} />
                            </div>

                            {/* ---- Section 5: Electricity / Consumer ---- */}
                            <div className="mt-8">
                                <SectionHeader
                                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                                    title="Electricity Connection"
                                    subtitle="Details from your monthly electricity bill"
                                />
                                <TextInput id="consumer_no" label="Consumer Number" required value={fields.consumer_no} onChange={handleTextChange} error={errors.consumer_no} placeholder="Found on your electricity bill" />
                                <FileInputCard
                                    fieldKey="electricity_bill"
                                    {...FILE_FIELDS.electricity_bill}
                                    file={files.electricity_bill}
                                    error={errors.electricity_bill}
                                    progress={fileProgress.electricity_bill}
                                    onChange={handleFileChange}
                                />
                            </div>

                            {/* ---- Section 6: Signature ---- */}
                            <div className="mt-8">
                                <SectionHeader
                                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>}
                                    title="Signature"
                                    subtitle="Upload a clear photo of your handwritten signature on white paper"
                                />
                                <FileInputCard fieldKey="signature" {...FILE_FIELDS.signature} file={files.signature} error={errors.signature} progress={fileProgress.signature} onChange={handleFileChange} />
                            </div>

                            {/* ---- Consent Checkbox ---- */}
                            <div className="mt-8 p-5 bg-amber-50 border border-amber-200 rounded-xl">
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="consent"
                                        id="consent"
                                        checked={fields.consent}
                                        onChange={handleTextChange}
                                        className="mt-1 w-5 h-5 accent-primary-600 flex-shrink-0 cursor-pointer"
                                        aria-required="true"
                                    />
                                    <span className="text-sm text-gray-700 leading-relaxed">
                                        I, <strong>{fields.name || 'the applicant'}</strong>, hereby consent to Santaji Electricals collecting, storing, and using my personal details and uploaded documents solely for the purpose of processing my rooftop solar subsidy application under the PM Surya Ghar Muft Bijli Yojana scheme. I confirm that all information provided is accurate to the best of my knowledge.
                                        <span className="text-red-500 ml-1">*</span>
                                    </span>
                                </label>
                                {errors.consent && (
                                    <p className="mt-2 text-xs text-red-600 ml-8" role="alert">{errors.consent}</p>
                                )}
                            </div>

                            {/* ---- Global error ---- */}
                            <AnimatePresence>
                                {submitError && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0 }}
                                        className="mt-5 p-4 bg-red-50 border border-red-200 rounded-xl"
                                        role="alert"
                                    >
                                        <p className="text-sm text-red-800 font-medium">⚠ {submitError}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* ---- Upload progress summary ---- */}
                            {isSubmitting && submitPhase === 'uploading' && (
                                <div className="mt-5 p-4 bg-blue-50 border border-blue-200 rounded-xl">
                                    <p className="text-sm text-blue-800 font-semibold mb-3">Uploading documents…</p>
                                    {Object.entries(fileProgress).filter(([, pct]) => pct > 0).map(([field, pct]) => (
                                        <div key={field} className="mb-2">
                                            <div className="flex justify-between text-xs text-blue-700 mb-0.5">
                                                <span>{FILE_FIELDS[field]?.label}</span>
                                                <span>{pct}%</span>
                                            </div>
                                            <ProgressBar pct={pct} />
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* ---- Submit button ---- */}
                            <motion.button
                                type="submit"
                                whileTap={{ scale: 0.98 }}
                                disabled={isSubmitting}
                                className="btn-primary w-full mt-8 text-base flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                        </svg>
                                        {phaseLabel}
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                        Submit Application
                                    </>
                                )}
                            </motion.button>

                            <p className="text-xs text-center text-gray-400 mt-4">
                                🔒 Your documents are encrypted and stored securely. They are never shared with third parties.
                            </p>
                        </motion.form>
                    )}
                </div>
            </section>
        </motion.div>
    );
};

export default Apply;
