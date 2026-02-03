import React from 'react';
import { motion } from 'framer-motion';

const ServiceCard = ({
    icon,
    title,
    description,
    features = [],
    onCTAClick
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ y: -8 }}
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 border border-gray-100"
        >
            {/* Icon */}
            <div className="mb-6">
                {typeof icon === 'string' ? (
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center text-white text-3xl font-bold">
                        {icon}
                    </div>
                ) : (
                    <div className="w-16 h-16">
                        {icon}
                    </div>
                )}
            </div>

            {/* Content */}
            <h3 className="text-2xl font-bold text-gray-900 mb-3">{title}</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">{description}</p>

            {/* Features */}
            {features.length > 0 && (
                <ul className="space-y-2 mb-6">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-start text-gray-700">
                            <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm">{feature}</span>
                        </li>
                    ))}
                </ul>
            )}

            {/* CTA Button */}
            <motion.button
                onClick={onCTAClick}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200"
            >
                Learn More
            </motion.button>
        </motion.div>
    );
};

export default ServiceCard;
