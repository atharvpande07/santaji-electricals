import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';

import ScrollToTop from './components/ScrollToTop';

function App() {
    const location = useLocation();

    return (
        <div className="flex flex-col min-h-screen">
            <ScrollToTop />
            <Navbar />

            <main className="flex-grow pt-16 md:pt-20">
                <AnimatePresence mode="wait">
                    <Routes location={location} key={location.pathname}>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/services" element={<Services />} />
                    </Routes>
                </AnimatePresence>
            </main>

            <Footer />
        </div>
    );
}

export default App;
