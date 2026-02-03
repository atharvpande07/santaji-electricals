import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const SuccessModal = ({ isOpen, onClose, name }) => {
    useEffect(() => {
        if (isOpen) {
            // Prevent body scroll when modal is open
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-8"
                    >
                        {/* Success Icon */}
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
                            <svg className="h-10 w-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>

                        {/* Content */}
                        <div className="text-center">
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                Thank You{name ? `, ${name}` : ''}!
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Your message has been received successfully. Our team will get back to you within 24 hours.
                            </p>

                            {/* Next Steps */}
                            <div className="bg-primary-50 rounded-lg p-4 mb-6 text-left">
                                <h4 className="font-semibold text-primary-900 mb-2">What happens next?</h4>
                                <ul className="text-sm text-primary-800 space-y-2">
                                    <li className="flex items-start">
                                        <svg className="h-5 w-5 text-primary-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Our team will review your inquiry
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="h-5 w-5 text-primary-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        We'll contact you via phone or email
                                    </li>
                                    <li className="flex items-start">
                                        <svg className="h-5 w-5 text-primary-600 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Discuss your needs and next steps
                                    </li>
                                </ul>
                            </div>

                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="w-full btn-primary"
                            >
                                Got it, thanks!
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default SuccessModal;
