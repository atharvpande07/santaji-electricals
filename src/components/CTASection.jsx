import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const CTASection = () => {
    return (
        <section className="section-padding bg-gradient-to-br from-primary-600 to-accent-600 text-white relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-1/2 h-full bg-white opacity-5 transform translate-x-1/3 -skew-x-12"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-400 opacity-20 rounded-full blur-3xl"></div>

            <div className="container-custom relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="flex flex-col md:flex-row items-center justify-between bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 md:p-12 shadow-2xl"
                >
                    <div className="text-center md:text-left mb-8 md:mb-0 max-w-2xl">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                            Ready to Upgrade Your Power Infrastructure?
                        </h2>
                        <p className="text-lg md:text-xl text-blue-50 opacity-90">
                            Join thousands of satisfied customers across Maharashtra. From rooftop solar to industrial electrification, we deliver trusted, high-performance solutions.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 flex-shrink-0">
                        <Link 
                            to="/apply" 
                            className="bg-green-500 hover:bg-green-600 text-white font-bold text-lg px-8 py-4 rounded-full flex items-center justify-center gap-2 transition-all duration-200 shadow-xl hover:-translate-y-1 active:scale-95 border border-green-400/50"
                        >
                            <span className="text-xl">☀️</span> Apply Now
                        </Link>
                        <Link 
                            to="/contact" 
                            className="bg-transparent text-white border-2 border-white/80 hover:bg-white/10 hover:border-white transition-all duration-200 font-semibold text-lg px-8 py-4 rounded-full text-center flex items-center justify-center active:scale-95"
                        >
                            Contact Us
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

export default CTASection;
