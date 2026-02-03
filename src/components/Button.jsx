import React from 'react';
import { motion } from 'framer-motion';

const Button = ({
    children,
    variant = 'primary',
    type = 'button',
    onClick,
    loading = false,
    disabled = false,
    className = '',
    ...props
}) => {
    const baseClasses = 'px-6 py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses = {
        primary: 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-lg',
        secondary: 'bg-white text-primary-600 border-2 border-primary-600 hover:bg-primary-50 hover:shadow-lg',
        accent: 'bg-accent-600 text-white hover:bg-accent-700 hover:shadow-lg',
        outline: 'bg-transparent text-gray-700 border-2 border-gray-300 hover:border-primary-500 hover:text-primary-600'
    };

    const classes = `${baseClasses} ${variantClasses[variant]} ${className}`;

    return (
        <motion.button
            type={type}
            onClick={onClick}
            disabled={disabled || loading}
            className={classes}
            whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
            whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
            {...props}
        >
            {loading ? (
                <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                </span>
            ) : children}
        </motion.button>
    );
};

export default Button;
