import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const testimonials = [
    {
        quote: "Fast installation and clear pricing, Bijli bill dropped to nearby 0",
        name: "Ramesh Patil",
        location: "Yavatmal, Maharashtra",
        avatar: null,
        initials: "RP"
    },
    {
        quote: "Professional team, on-time setup and nice support.",
        name: "Sunita More",
        location: "Pusad, Maharashtra",
        avatar: null,
        initials: "SM"
    },
    {
        quote: "From survey and net-metering support everything handled they very nicely.",
        name: "Anil Deshmukh",
        location: "Umarkhed, Maharashtra",
        avatar: null,
        initials: "AD"
    }
];

const StarRating = () => (
    <div className="flex gap-0.5 mb-4" aria-label="5 out of 5 stars">
        {[1, 2, 3, 4, 5].map((star) => (
            <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))}
    </div>
);

const Avatar = ({ src, initials, name }) => {
    const [imgError, setImgError] = React.useState(false);

    if (imgError) {
        return (
            <div
                className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
                aria-hidden="true"
            >
                {initials}
            </div>
        );
    }

    return (
        <img
            src={src}
            alt={`${name} photo`}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            onError={() => setImgError(true)}
        />
    );
};

const Testimonials = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reviewForm, setReviewForm] = useState({ name: '', rating: 5, message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmitReview = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate network request to moderation backend
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
            setTimeout(() => {
                // Auto close and reset after success
                setIsModalOpen(false);
                setTimeout(() => {
                    setIsSuccess(false);
                    setReviewForm({ name: '', rating: 5, message: '' });
                }, 300);
            }, 3000);
        }, 800);
    };

    return (
        <section className="section-padding bg-white relative" aria-label="Customer testimonials">
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row items-center justify-between mb-12 text-center md:text-left"
                >
                    <div className="mb-6 md:mb-0">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            What Our Customers Say
                        </h2>
                        <p className="text-xl text-gray-600 max-w-2xl">
                            Trusted by thousands of happy customers across Maharashtra
                        </p>
                    </div>
                    <div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="btn-outline font-semibold flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            Leave a Review
                        </button>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <article className="bg-white rounded-xl shadow-lg p-8 h-full flex flex-col border border-gray-100">
                                <StarRating />
                                <blockquote className="text-gray-700 text-base leading-relaxed flex-grow mb-6">
                                    "{t.quote}"
                                </blockquote>
                                <div className="flex items-center gap-3">
                                    <Avatar src={t.avatar} initials={t.initials} name={t.name} />
                                    <div>
                                        <p className="font-semibold text-gray-900 text-sm">{t.name}</p>
                                        <p className="text-gray-500 text-xs">{t.location}</p>
                                    </div>
                                </div>
                            </article>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Leave a Review Modal Overlay */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm"
                        onClick={() => !isSubmitting && setIsModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-md relative overflow-hidden"
                        >
                            <button
                                onClick={() => setIsModalOpen(false)}
                                disabled={isSubmitting}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>

                            {isSuccess ? (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-8"
                                >
                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
                                    <p className="text-gray-600">
                                        Your review has been successfully submitted for moderation. We appreciate your feedback!
                                    </p>
                                </motion.div>
                            ) : (
                                <>
                                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Leave a Review</h3>
                                    <p className="text-gray-600 mb-6 text-sm">
                                        Share your experience with Santaji Electricals to help others choose renewable energy.
                                    </p>

                                    <form onSubmit={handleSubmitReview} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Your Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={reviewForm.name}
                                                onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                                                placeholder="e.g. Ramesh Patil"
                                                className="input-field py-2"
                                            />
                                        </div>
                                        
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Rating</label>
                                            <div className="flex gap-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                                        className="focus:outline-none hover:scale-110 transition-transform"
                                                    >
                                                        <svg
                                                            className={`w-8 h-8 ${star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-200'}`}
                                                            fill="currentColor"
                                                            viewBox="0 0 20 20"
                                                        >
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 mb-1">Your Review</label>
                                            <textarea
                                                required
                                                rows="4"
                                                value={reviewForm.message}
                                                onChange={(e) => setReviewForm({ ...reviewForm, message: e.target.value })}
                                                placeholder="Tell us about your experience..."
                                                className="input-field py-2 resize-none"
                                            ></textarea>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full btn-primary py-3 flex items-center justify-center gap-2 mt-4"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                                                    </svg>
                                                    Submitting...
                                                </>
                                            ) : (
                                                'Submit Review'
                                            )}
                                        </button>
                                    </form>
                                </>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Testimonials;
