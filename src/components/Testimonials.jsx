import React from 'react';
import { motion } from 'framer-motion';

const testimonials = [
    {
        quote: "Fast installation and clear pricing, Bijli bill dropped to nearby 0",
        name: "Ramesh Patil",
        location: "Yavatmal, Maharashtra",
        avatar: `${import.meta.env.BASE_URL}images/testimonial-avatar-1.png`,
        initials: "RP"
    },
    {
        quote: "Professional team, on-time setup and nice support.",
        name: "Sunita More",
        location: "Pusad, Maharashtra",
        avatar: `${import.meta.env.BASE_URL}images/testimonial-avatar-2.png`,
        initials: "SM"
    },
    {
        quote: "From survey and net-metering support everything handled they very nicely.",
        name: "Anil Deshmukh",
        location: "Umarkhed, Maharashtra",
        avatar: `${import.meta.env.BASE_URL}images/testimonial-avatar-3.png`,
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
    return (
        <section className="section-padding bg-white" aria-label="Customer testimonials">
            <div className="container-custom">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        What Our Customers Say
                    </h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Trusted by hundreds of happy customers across Maharashtra
                    </p>
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
        </section>
    );
};

export default Testimonials;
