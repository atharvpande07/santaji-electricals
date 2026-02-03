import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Lottie from 'lottie-react';
import SEO from '../components/SEO';
import LeadForm from '../components/LeadForm';
import ServiceCard from '../components/ServiceCard';
import Button from '../components/Button';

// Placeholder Lottie animation data
// Replace this with actual Lottie JSON from LottieFiles.com
// Hero image URL
const heroImage = "/images/home-hero.jpg";

// Service image URLs
const serviceImages = {
    solar: "https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80",
    electrical: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80",
    ev: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80",
    outdoor: "/images/outdoor-lighting.jpg"
};

const Home = () => {
    const navigate = useNavigate();
    const [isPaused, setIsPaused] = useState(false);

    // Slider State
    const [currentSlide, setCurrentSlide] = React.useState(0);

    const slides = [
        {
            title: 'Powering Your Future with Solar Energy',
            subtitle: 'Harness the sun\'s energy with our reliable and efficient solar panel installations.',
            image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?auto=format&fit=crop&w=800&q=80'
        },
        {
            title: 'Expert Electrical Solutions for Every Need',
            subtitle: 'From wiring to industrial panels, we ensure safe and robust electrical systems.',
            image: '/images/electrification.jpg'
        },
        {
            title: 'Charge Ahead with Modern EV Charger Installations',
            subtitle: 'Convenient and fast charging solutions for your electric vehicle at home or business.',
            image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=800&q=80'
        },
        {
            title: 'Industrial Electrical Excellence',
            subtitle: 'Robust large-scale systems designed for maximum efficiency and uptime.',
            image: '/images/industrial-hero-new.jpg'
        },
        {
            title: 'Outdoor Lighting Solutions',
            subtitle: 'High-performance AC and Solar street lighting for public and private spaces.',
            image: '/images/outdoor-lighting.jpg'
        }
    ];

    // Auto-slide logic
    React.useEffect(() => {
        if (!isPaused) {
            const timer = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % slides.length);
            }, 3000); // 3 seconds
            return () => clearInterval(timer);
        }
    }, [isPaused, slides.length]);

    // Swipe logic
    const handleDragEnd = (event, info) => {
        if (info.offset.x > 50) {
            setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
        } else if (info.offset.x < -50) {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }
    };

    // Page Transitions
    const pageVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
    };

    const services = [
        {
            icon: <img src={serviceImages.solar} alt="Solar Installation" className="w-full h-full object-cover rounded-lg" />,
            title: 'Solar Installation',
            description: 'Complete Rooftop/Open Land Installation for Residential & Commercial Property',
            features: ['Site Assessment', 'Custom Design', 'Professional Installation']
        },
        {
            icon: <img src={serviceImages.electrical} alt="Electrification" className="w-full h-full object-cover rounded-lg" />,
            title: 'Electrification',
            description: 'Comprehensive electrical services for all your power infrastructure needs.',
            features: [
                'All Type of Electrical Wiring & Cabling',
                'Power Distribution Systems',
                'HT, LT, DTC Solutions For Your Property'
            ]
        },
        {
            icon: <img src={serviceImages.ev} alt="EV Charger" className="w-full h-full object-cover rounded-lg" />,
            title: 'EV Charger',
            description: 'Modern electric vehicle charging solutions for homes and businesses.',
            features: ['Fast Charging', 'Smart Integration', 'Energy Efficient']
        },
        {
            icon: <img src={serviceImages.outdoor} alt="Outdoor Lighting" className="w-full h-full object-cover rounded-lg" />,
            title: 'Outdoor Lighting Solutions',
            description: 'Professional outdoor lighting for streets, campuses, and industrial areas.',
            features: ['AC Street Lighting', 'Solar Street Lighting', 'High Mast (Hi-Mast) Lighting']
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
                title="Santaji Electricals | Expert Solar Installation & Electrical Services"
                description="Your trusted partner for rooftop solar, electrical wiring, EV chargers, and industrial panels in Maharashtra. Get a free quote today!"
                keywords="solar installation, electrician, EV charger, industrial electrical, Maharashtra, renewable energy"
            />

            {/* Hero Section */}
            <section
                className="relative bg-gradient-to-br from-gray-50 to-blue-50 pt-10 pb-20 overflow-hidden"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                {/* Background Decorations */}
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary-100/30 to-transparent pointer-events-none"></div>
                <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-tr from-accent-100/30 to-transparent rounded-full blur-3xl pointer-events-none"></div>

                <div className="container-custom relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[500px]">
                        {/* Text Content Slider */}
                        <div className="relative">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentSlide}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    transition={{ duration: 0.5 }}
                                    className="text-center lg:text-left"
                                >
                                    <div className="inline-block px-4 py-1.5 bg-white border border-primary-100 rounded-full text-primary-600 font-semibold text-sm mb-6 shadow-sm">
                                        Trusted by 500+ Happy Customers
                                    </div>
                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
                                        {slides[currentSlide].title}
                                    </h1>
                                    <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0 h-16">
                                        {slides[currentSlide].subtitle}
                                    </p>

                                    {/* Static Buttons (Persistent) */}
                                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                        <Button
                                            onClick={() => document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth' })}
                                            variant="primary"
                                            size="lg"
                                            className="shadow-lg hover:shadow-primary-500/30"
                                        >
                                            Get Free Quote
                                        </Button>
                                        <Button
                                            onClick={() => navigate('/services')}
                                            variant="outline"
                                            size="lg"
                                        >
                                            View Services
                                        </Button>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {/* Image Slider */}
                        <div className="relative flex justify-center items-center">
                            <div className="w-full max-w-lg relative z-10 aspect-[4/3]">
                                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl opacity-30 blur-xl"></div>
                                <AnimatePresence mode="wait">
                                    <motion.img
                                        key={currentSlide}
                                        src={slides[currentSlide].image}
                                        alt={slides[currentSlide].title}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.05 }}
                                        transition={{ duration: 0.5 }}
                                        drag="x"
                                        dragConstraints={{ left: 0, right: 0 }}
                                        dragElastic={1}
                                        onDragEnd={handleDragEnd}
                                        className="absolute inset-0 w-full h-full rounded-2xl shadow-2xl object-cover border-4 border-white/10 touch-pan-y"
                                    />
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    {/* Slide Indicators */}
                    <div className="flex justify-center mt-8 space-x-2">
                        {slides.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentSlide(index)}
                                className={`w-3 h-3 rounded-full transition-all duration-300 ${currentSlide === index ? 'bg-primary-600 w-8' : 'bg-gray-300 hover:bg-primary-400'
                                    }`}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Trust Indicators */}
            <section className="bg-gray-50 py-12">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
                    >
                        <div>
                            <div className="text-4xl font-bold text-primary-600 mb-2">100+</div>
                            <div className="text-gray-600">Projects Completed</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-primary-600 mb-2">95%</div>
                            <div className="text-gray-600">Customer Satisfaction</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-primary-600 mb-2">24/7</div>
                            <div className="text-gray-600">Support Available</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-primary-600 mb-2">5+</div>
                            <div className="text-gray-600">Years Experience</div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Services Preview */}
            <section className="section-padding bg-white">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Our Services
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Complete renewable energy and electrical solutions tailored to your needs
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {services.slice(0, 3).map((service, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <ServiceCard
                                    icon={service.icon}
                                    title={service.title}
                                    description={service.description}
                                    features={service.features}
                                    onCTAClick={() => navigate('/services')}
                                />
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-center mt-12"
                    >
                        <Link to="/services">
                            <Button variant="primary" className="text-lg">
                                View All Services
                            </Button>
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="section-padding bg-gradient-to-br from-primary-50 to-accent-50">
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
                                        title: 'Proven Expertise',
                                        description: '5+ years of successful solar installation projects across residential and commercial properties.'
                                    },
                                    {
                                        title: 'Expert Installation',
                                        description: 'Certified technicians with deep knowledge in solar energy and electrical systems.'
                                    },
                                    {
                                        title: 'Custom Solutions',
                                        description: 'Tailored solar energy systems designed specifically for your property and energy needs.'
                                    },
                                    {
                                        title: 'Ongoing Support',
                                        description: 'We build lasting relationships, providing continuous support and maintenance for your systems.'
                                    }
                                ].map((item, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: index * 0.1 }}
                                        className="flex items-start"
                                    >
                                        <div className="flex-shrink-0 w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-xl mr-4">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                                            <p className="text-gray-600">{item.description}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-2xl shadow-2xl p-8"
                        >
                            <div className="text-center mb-6">
                                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
                                    <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">Quality & Reliability Guarantee</h3>
                                <p className="text-gray-600">
                                    We're committed to delivering exceptional solar solutions. Our installations come with industry-leading
                                    warranties and our dedicated support team is always here for you.
                                </p>
                            </div>
                            <div className="border-t border-gray-200 pt-6">
                                <ul className="space-y-3">
                                    {[
                                        'Quality installation guarantee',
                                        'Transparent pricing',
                                        'Free site assessment',
                                        'Ongoing maintenance support'
                                    ].map((feature, index) => (
                                        <li key={index} className="flex items-center text-gray-700">
                                            <svg className="w-5 h-5 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                            {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Contact Form Section */}
            <section id="contact-form" className="section-padding bg-white">
                <div className="container-custom">
                    <LeadForm />
                </div>
            </section>
        </motion.div>
    );
};

export default Home;
