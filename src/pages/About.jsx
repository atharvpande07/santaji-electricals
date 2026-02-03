import React from 'react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import LeadForm from '../components/LeadForm';

const About = () => {
    const pageVariants = {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 }
    };

    // Team image URLs
    const teamImages = {
        installation: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
        support: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
        care: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
        management: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80"
    };

    const teamMembers = [
        {
            name: 'Installation Team',
            role: 'Solar Experts',
            image: teamImages.installation,
            bio: 'Certified professionals with 5+ years experience'
        },
        {
            name: 'Technical Support',
            role: 'System Engineers',
            image: teamImages.support,
            bio: 'Expert guidance for optimal solar performance'
        },
        {
            name: 'Customer Care',
            role: 'Support Team',
            image: teamImages.care,
            bio: 'Dedicated to your satisfaction and service needs'
        },
        {
            name: 'Project Management',
            role: 'Coordinators',
            image: teamImages.management,
            bio: 'Ensuring smooth installation from start to finish'
        }
    ];

    const values = [
        {
            icon: '🎯',
            title: 'Customer-Focused',
            description: 'Your energy needs are our priority. We design every solution around your requirements.'
        },
        {
            icon: '💡',
            title: 'Quality Installation',
            description: 'We use premium solar equipment and follow best practices for lasting performance.'
        },
        {
            icon: '🤝',
            title: 'Trust & Reliability',
            description: 'Transparent pricing, honest communication, and dependable service always.'
        },
        {
            icon: '🌱',
            title: 'Sustainable Future',
            description: 'We measure success by helping you reduce costs while protecting the environment.'
        }
    ];

    const testimonials = [
        {
            name: 'Rahul Deshmukh',
            company: 'Yavatmal, Maharashtra',
            text: 'Excellent solar installation service. Our electricity bills have reduced significantly and the team provided great support throughout.',
            rating: 5
        },
        {
            name: 'Anita Patil',
            company: 'Pusad, Maharashtra',
            text: 'Professional, reliable, and honest. Santaji Electricals delivered exactly what they promised with quality workmanship.',
            rating: 5
        },
        {
            name: 'Suresh Kale',
            company: 'Digras, Maharashtra',
            text: 'The solar system works perfectly and their ongoing support is excellent. Highly recommend for any solar project.',
            rating: 5
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
                title="About Us - Santaji Electricals | Our Story & Mission"
                description="Learn about Santaji Electricals' journey in providing renewable energy solutions. 5+ years of expert solar installation across Maharashtra."
                keywords="about us, solar company, renewable energy, Maharashtra, electrical services, solar installation"
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
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">About Us</h1>
                        <p className="text-xl md:text-2xl text-blue-100">
                            We're on a mission to power homes and businesses across Maharashtra with clean,
                            sustainable solar energy solutions that deliver real, lasting benefits.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Our Story */}
            <section className="section-padding bg-white">
                <div className="container-custom">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Story</h2>
                            <div className="space-y-4 text-gray-600 text-lg">
                                <p>
                                    With over 5 years of experience, Santaji Electricals started with a vision: making
                                    renewable energy accessible and reliable for every home and business in Maharashtra.
                                </p>
                                <p>
                                    What began as a local electrical service has evolved into a trusted solar installation
                                    specialist serving residential and commercial clients. Our success is built on one principle:
                                    we don't just install and forget — we build lasting relationships.
                                </p>
                                <p>
                                    Today, we combine expert technical knowledge with quality products to help property owners
                                    transition to clean energy. From small homes to growing businesses, we bring the same level
                                    of dedication and professionalism to every solar installation project.
                                </p>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="grid grid-cols-2 gap-6"
                        >
                            {[
                                { number: '500+', label: 'Happy Clients' },
                                { number: '10+', label: 'Years Experience' },
                                { number: '95%', label: 'Client Retention' },
                                { number: '50+', label: 'Team Members' }
                            ].map((stat, index) => (
                                <div key={index} className="bg-gradient-to-br from-primary-50 to-accent-50 rounded-xl p-6 text-center">
                                    <div className="text-4xl font-bold text-primary-600 mb-2">{stat.number}</div>
                                    <div className="text-gray-700 font-medium">{stat.label}</div>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="section-padding bg-gray-50">
                <div className="container-custom">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="bg-white rounded-2xl p-8 shadow-lg"
                        >
                            <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                                <span className="text-4xl">🎯</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                To empower homes and businesses with sustainable solar energy solutions that reduce
                                electricity costs, protect the environment, and create energy independence through
                                expert installation and continuous support.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-2xl p-8 shadow-lg"
                        >
                            <div className="w-16 h-16 bg-accent-100 rounded-lg flex items-center justify-center mb-6">
                                <span className="text-4xl">🚀</span>
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
                            <p className="text-gray-600 text-lg leading-relaxed">
                                To become Maharashtra's most trusted renewable energy partner, known for
                                delivering reliable solar installations, exceptional customer service, and creating
                                lasting value for every client through clean, sustainable energy solutions.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="section-padding bg-white">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Core Values</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            The principles that guide everything we do
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="text-center p-6 rounded-xl hover:shadow-lg transition-shadow duration-300"
                            >
                                <div className="text-5xl mb-4">{value.icon}</div>
                                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                                <p className="text-gray-600">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team Section */}
            <section className="section-padding bg-gradient-to-br from-primary-50 to-accent-50">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Talented professionals dedicated to your success
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {teamMembers.map((member, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ y: -8 }}
                                className="bg-white rounded-xl p-6 text-center shadow-lg hover:shadow-2xl transition-all duration-300"
                            >
                                <div className="mb-4 h-48 overflow-hidden rounded-lg">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                    />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-1">{member.name}</h3>
                                <p className="text-primary-600 font-semibold mb-3">{member.role}</p>
                                <p className="text-gray-600 text-sm">{member.bio}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="section-padding bg-white">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            What Our Clients Say
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            Don't just take our word for it
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-gray-50 rounded-xl p-8 shadow-lg"
                            >
                                <div className="flex mb-4">
                                    {[...Array(testimonial.rating)].map((_, i) => (
                                        <svg key={i} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                        </svg>
                                    ))}
                                </div>
                                <p className="text-gray-700 mb-6 italic">"{testimonial.text}"</p>
                                <div>
                                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                                    <div className="text-gray-600 text-sm">{testimonial.company}</div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section id="contact-form" className="section-padding bg-gray-50">
                <div className="container-custom">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-8"
                    >
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">Ready to Go Solar?</h2>
                        <p className="text-xl text-gray-600">
                            Let's discuss how we can power your property with clean solar energy
                        </p>
                    </motion.div>
                    <LeadForm />
                </div>
            </section>
        </motion.div>
    );
};

export default About;
