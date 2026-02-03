import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { validateForm } from '../utils/validation';
import { submitLead } from '../utils/crm';
import { trackFormSubmission } from '../utils/analytics';
import Button from './Button';
import SuccessModal from './SuccessModal';

const LeadForm = ({ defaultService = '' }) => {
    const [formData, setFormData] = useState({
        service: defaultService,
        name: '',
        phone: '',
        email: '',
        district: '',
        message: ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [submitError, setSubmitError] = useState('');

    const maharashtraDistricts = [
        "Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana",
        "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna",
        "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded",
        "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad",
        "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha",
        "Washim", "Yavatmal"
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error for this field when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
        setSubmitError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError('');

        // Validate form
        const newErrors = {};
        if (!formData.service) newErrors.service = 'Please select a service';
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
        // Basic phone validation (10 digits)
        if (formData.phone.trim() && !/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
        }

        if (!formData.district) newErrors.district = 'Please select your district';
        else if (!maharashtraDistricts.includes(formData.district)) {
            newErrors.district = 'Please select a valid district from the list';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Submit form
        setIsSubmitting(true);
        try {
            const result = await submitLead(formData);

            if (result.success) {
                // Track successful submission
                trackFormSubmission(formData);

                // Show success modal
                setShowSuccess(true);

                // Reset form
                setFormData({
                    service: defaultService,
                    name: '',
                    phone: '',
                    email: '',
                    district: '',
                    message: ''
                });
                setErrors({});
            } else {
                setSubmitError(result.error || 'Failed to submit form. Please try again.');
            }
        } catch (error) {
            setSubmitError('An unexpected error occurred. Please try again.');
            console.error('Form submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <motion.form
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                onSubmit={handleSubmit}
                className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto"
            >
                <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Get Your Free Quote</h2>
                <p className="text-gray-600 mb-6 text-center">Fill out the form and we'll respond within 24 hours</p>

                {/* 1. Service Selection (Required First) */}
                <div className="mb-4">
                    <label htmlFor="service" className="block text-sm font-semibold text-gray-700 mb-2">
                        Select Required Service <span className="text-red-500">*</span>
                    </label>
                    <select
                        id="service"
                        name="service"
                        value={formData.service}
                        onChange={handleChange}
                        className={`input-field ${errors.service ? 'input-error' : ''}`}
                        aria-required="true"
                    >
                        <option value="">Select a service</option>
                        <option value="Solar Installation">Solar Installation</option>
                        <option value="Electrification">Electrification</option>
                        <option value="EV Charger Installation">EV Charger Installation</option>
                        <option value="Industrial Electrical Planning">Industrial Electrical Planning</option>
                        <option value="Other">Other</option>
                    </select>
                    {errors.service && (
                        <p className="mt-1 text-sm text-red-600">{errors.service}</p>
                    )}
                </div>

                {/* 2. Personal Details */}
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                        Name <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`input-field ${errors.name ? 'input-error' : ''}`}
                        placeholder="John Doe"
                        aria-required="true"
                    />
                    {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className={`input-field ${errors.phone ? 'input-error' : ''}`}
                        placeholder="+91 98765 43210"
                        aria-required="true"
                    />
                    {errors.phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                    )}
                </div>

                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                        Email / Gmail <span className="text-gray-400 text-xs">(Optional)</span>
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="input-field"
                        placeholder="john@example.com"
                    />
                </div>

                {/* 3. Location Selection */}
                <div className="mb-6">
                    <label htmlFor="district" className="block text-sm font-semibold text-gray-700 mb-2">
                        Select Your District (Maharashtra Only) <span className="text-red-500">*</span>
                    </label>
                    <input
                        list="districts"
                        id="district"
                        name="district"
                        value={formData.district}
                        onChange={handleChange}
                        className={`input-field ${errors.district ? 'input-error' : ''}`}
                        placeholder="Type to search your district..."
                        autoComplete="off"
                    />
                    <datalist id="districts">
                        {maharashtraDistricts.map(district => (
                            <option key={district} value={district} />
                        ))}
                    </datalist>
                    <p className="mt-1 text-xs text-gray-500">
                        Currently, our services are available only across Maharashtra.
                    </p>
                    {errors.district && (
                        <p className="mt-1 text-sm text-red-600">{errors.district}</p>
                    )}
                </div>

                {/* Message Field */}
                <div className="mb-6">
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                        Message <span className="text-gray-400 text-xs">(Optional)</span>
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        rows="3"
                        className="input-field resize-none"
                        placeholder="Tell us about your energy needs..."
                    />
                </div>

                {/* Privacy Notice */}
                <p className="text-xs text-gray-500 mb-4 text-center">
                    🔒 Your information is secure and will never be shared with third parties.
                </p>

                {/* Submit Error */}
                {submitError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg" role="alert">
                        <p className="text-sm text-red-800">{submitError}</p>
                    </div>
                )}

                {/* Submit Button */}
                <Button
                    type="submit"
                    variant="primary"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    className="w-full text-lg"
                >
                    Send Message
                </Button>
            </motion.form>

            {/* Success Modal */}
            <SuccessModal
                isOpen={showSuccess}
                onClose={() => setShowSuccess(false)}
                name={formData.name}
            />
        </>
    );
};

export default LeadForm;
