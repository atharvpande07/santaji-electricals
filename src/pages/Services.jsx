import React from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import ServiceCard from '../components/ServiceCard';
import LeadForm from '../components/LeadForm';

const Services = () => {
    const pageVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
    };

    // Service image URLs
    const serviceImages = {
        solar: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80",
        electrical: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
        ev: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80",
        industrial: `${import.meta.env.BASE_URL}images/industrial-service.jpg`,
        outdoor: `${import.meta.env.BASE_URL}images/outdoor-lighting.jpg`
    };

    const services = [
        {
            icon: <img src={serviceImages.solar} alt="Solar Installation" className="w-full h-full object-cover rounded-lg" />,
            title: 'Solar Installation',
            description: 'Complete Rooftop/Open Land Installation for Residential & Commercial Property',
            features: [
                'Site Survey & Assessment',
                'Custom System Design',
                'Professional Installation',
                'Grid Connection Support',
                'Performance Monitoring Setup'
            ],
            price: 'Custom Quote'
        },
        {
            icon: <img src={serviceImages.electrical} alt="Electrification" className="w-full h-full object-cover rounded-lg" />,
            title: 'Electrification',
            description: 'Complete electrical wiring and power distribution solutions for all property types.',
            features: [
                'All Type of Electrical Wiring & Cabling',
                'Power Distribution Systems',
                'HT, LT, DTC Solutions For Your Property',
                'Load Calculation & Planning',
                'Safety Certification',
                'Energy Efficiency Upgrades'
            ],
            price: 'Based on Project'
        },
        {
            icon: <img src={serviceImages.ev} alt="EV Charger" className="w-full h-full object-cover rounded-lg" />,
            title: 'EV Charger',
            description: 'Modern electric vehicle charging station installation for homes and commercial properties.',
            features: [
                'Home EV Charger Setup',
                'Commercial Charging Stations',
                'Fast Charging Solutions',
                'Smart Integration',
                'Maintenance & Support'
            ],
            price: 'Custom Quote'
        },
        {
            icon: <img src={serviceImages.industrial} alt="Industrial Electrical Panelling" className="w-full h-full object-cover rounded-lg" />,
            title: 'Industrial Electrical Panelling',
            description: 'Professional electrical panel design and installation for industrial and commercial facilities.',
            features: [
                'Control Panel Design',
                'Distribution Board Installation',
                'Circuit Protection Systems',
                'Industrial Automation',
                'Compliance & Safety Testing'
            ],
            price: 'Based on Requirements'
        },
        {
            icon: <img src={serviceImages.outdoor} alt="Outdoor Lighting" className="w-full h-full object-cover rounded-lg" />,
            title: 'Outdoor Lighting Solutions',
            description: 'Professional outdoor lighting for streets, campuses, and industrial areas.',
            features: [
                'AC Street Lighting',
                'Solar Street Lighting',
                'High Mast (Hi-Mast) Lighting'
            ],
            price: 'Custom Quote'
        }
    ];

    const process = [
        {
            step: 1,
            title: 'Site Assessment',
            description: 'We visit your property to evaluate energy needs, structural requirements, and design the optimal solution.'
        },
        {
            step: 2,
            title: 'Custom Design',
            description: 'Our team creates a detailed plan with equipment specifications and transparent pricing tailored to you.'
        },
        {
            step: 3,
            title: 'Professional Installation',
            description: 'We execute the installation with precision and quality, keeping you informed throughout the project.'
        },
        {
            step: 4,
            title: 'Ongoing Support',
            description: 'Continuous maintenance, monitoring assistance, and dedicated support to ensure optimal performance.'
        }
    ];

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.3 }}
        >
            <SEO
                title="Our Services - Solar & Electrical Solutions | Santaji Electricals"
                description="Complete solar installation, electrification, EV charger, and industrial electrical panelling services across Maharashtra. Expert renewable energy solutions."
                keywords="solar installation, electrical services, EV charger, industrial panels, rooftop solar, renewable energy"
            />

            {/* Hero Section */}
            <section className="gradient-hero text-white section-padding">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-center max-w-4xl mx-auto"
                    >
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">Our Services</h1>
                        <p className="text-xl md:text-2xl text-blue-100">
                            Complete renewable energy and electrical solutions designed for your property
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Services Grid */}
            <section className="section-padding bg-white">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">What We Offer</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            End-to-end renewable energy and electrical solutions tailored to your property
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {services.map((service, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 h-full flex flex-col border border-gray-100">
                                    {/* Icon */}
                                    <div className="mb-6">
                                        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center text-white text-3xl font-bold">
                                            {service.icon}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                                    <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>

                                    {/* Features */}
                                    <ul className="space-y-2 mb-6 flex-grow">
                                        {service.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start text-gray-700">
                                                <svg className="w-5 h-5 text-primary-600 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                <span className="text-sm">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Price */}
                                    <div className="border-t border-gray-200 pt-4 mb-4">
                                        <p className="text-primary-600 font-bold text-lg">{service.price}</p>
                                    </div>

                                    {/* CTA Button */}
                                    <motion.button
                                        onClick={() => {
                                            document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
                                        }}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full bg-primary-600 text-white py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors duration-200"
                                    >
                                        Get Started
                                    </motion.button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="section-padding bg-gradient-to-br from-primary-50 to-accent-50">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Process</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            A proven approach from assessment to ongoing support
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {process.map((item, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center"
                            >
                                <div className="relative mb-6">
                                    <div className="w-20 h-20 bg-gradient-to-br from-primary-600 to-accent-600 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto shadow-lg">
                                        {item.step}
                                    </div>
                                    {index < process.length - 1 && (
                                        <div className="hidden lg:block absolute top-10 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary-300 to-accent-300" />
                                    )}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                                <p className="text-gray-600">{item.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Why Choose Our Services */}
            <section className="section-padding bg-white">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl font-bold text-gray-900 mb-6">
                                Why Choose Santaji Electricals?
                            </h2>
                            <div className="space-y-6">
                                {[
                                    {
                                        icon: '✅',
                                        title: 'Proven Track Record',
                                        description: '5+ years of successful solar and electrical installations across Maharashtra'
                                    },
                                    {
                                        icon: '🌟',
                                        title: 'Quality Equipment',
                                        description: 'Premium solar panels and electrical components for lasting performance'
                                    },
                                    {
                                        icon: '💰',
                                        title: 'Cost Savings',
                                        description: 'Reduce your electricity bills significantly with our efficient solar solutions'
                                    },
                                    {
                                        icon: '🤝',
                                        title: 'Ongoing Support',
                                        description: '24/7 support and maintenance services for complete peace of mind'
                                    }
                                ].map((benefit, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-start bg-gray-50 rounded-lg p-4"
                                    >
                                        <div className="text-3xl mr-4 flex-shrink-0">{benefit.icon}</div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                                            <p className="text-gray-600">{benefit.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-gradient-to-br from-primary-600 to-accent-600 rounded-2xl p-8 text-white shadow-2xl"
                        >
                            <h3 className="text-3xl font-bold mb-6">Ready to Switch to Solar Energy?</h3>
                            <div className="space-y-4 mb-8">
                                <div className="flex items-center">
                                    <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>Free site assessment & consultation</span>
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>Transparent pricing & detailed quote</span>
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>Premium quality solar equipment</span>
                                </div>
                                <div className="flex items-center">
                                    <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>Dedicated ongoing support</span>
                                </div>
                            </div>
                            <motion.button
                                onClick={() => {
                                    document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' });
                                }}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full bg-white text-primary-600 py-4 rounded-lg font-bold text-lg hover:shadow-xl transition-all duration-200"
                            >
                                Get Your Free Quote Today
                            </motion.button>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Contact Form */}
            <section id="contact-form" className="section-padding bg-gray-50">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-8"
                    >
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Get Your Free Quote</h2>
                        <p className="text-xl text-gray-600">
                            Tell us about your solar or electrical needs and we'll respond within 24 hours
                        </p>
                    </motion.div>
                    <LeadForm />
                </div>
            </section>
        </motion.div>
    );
};

export default Services;
