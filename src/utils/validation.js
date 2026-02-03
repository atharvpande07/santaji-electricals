// Form validation utilities

export const validateName = (name) => {
    if (!name || name.trim().length === 0) {
        return 'Name is required';
    }
    if (name.trim().length < 2) {
        return 'Name must be at least 2 characters';
    }
    if (name.trim().length > 50) {
        return 'Name must be less than 50 characters';
    }
    return null;
};

export const validatePhone = (phone) => {
    if (!phone || phone.trim().length === 0) {
        return 'Phone number is required';
    }

    // Remove all non-digit characters for validation
    const cleaned = phone.replace(/\D/g, '');

    if (cleaned.length < 10) {
        return 'Phone number must be at least 10 digits';
    }
    if (cleaned.length > 15) {
        return 'Phone number must be less than 15 digits';
    }

    return null;
};

export const validateEmail = (email) => {
    // Email is optional, so empty is valid
    if (!email || email.trim().length === 0) {
        return null;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return 'Please enter a valid email address';
    }

    return null;
};

export const validateMessage = (message) => {
    // Message is optional
    if (!message || message.trim().length === 0) {
        return null;
    }

    if (message.trim().length > 500) {
        return 'Message must be less than 500 characters';
    }

    return null;
};

export const validateForm = (formData) => {
    const errors = {};

    const nameError = validateName(formData.name);
    if (nameError) errors.name = nameError;

    const phoneError = validatePhone(formData.phone);
    if (phoneError) errors.phone = phoneError;

    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;

    const messageError = validateMessage(formData.message);
    if (messageError) errors.message = messageError;

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
};
