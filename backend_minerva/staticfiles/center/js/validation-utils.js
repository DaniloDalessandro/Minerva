/**
 * Center App Frontend Validation Utilities
 * 
 * This module provides reusable validation components and utilities
 * for the center app forms with modern UI/UX patterns.
 */

// =============================================================================
// VALIDATION ERROR HANDLER
// =============================================================================

class ValidationErrorHandler {
    constructor() {
        this.errors = {};
        this.onErrorChange = null;
    }

    /**
     * Set multiple errors from server response
     */
    setErrors(serverErrors) {
        this.errors = {};
        
        if (typeof serverErrors === 'object') {
            Object.keys(serverErrors).forEach(key => {
                const errorValue = serverErrors[key];
                
                if (Array.isArray(errorValue)) {
                    this.errors[key] = errorValue[0];
                } else if (typeof errorValue === 'string') {
                    this.errors[key] = errorValue;
                } else {
                    this.errors[key] = 'Erro de validação';
                }
            });
        } else if (typeof serverErrors === 'string') {
            this.errors.non_field_errors = serverErrors;
        }

        // Handle special cases for unique constraint errors
        if (serverErrors.non_field_errors && 
            Array.isArray(serverErrors.non_field_errors) &&
            serverErrors.non_field_errors[0]?.includes('unique')) {
            this.errors.name = 'Este nome já está em uso';
            delete this.errors.non_field_errors;
        }

        if (this.onErrorChange) {
            this.onErrorChange(this.errors);
        }
    }

    /**
     * Clear specific field error
     */
    clearError(fieldName) {
        if (this.errors[fieldName]) {
            delete this.errors[fieldName];
            if (this.onErrorChange) {
                this.onErrorChange(this.errors);
            }
        }
    }

    /**
     * Clear all errors
     */
    clearAll() {
        this.errors = {};
        if (this.onErrorChange) {
            this.onErrorChange(this.errors);
        }
    }

    /**
     * Get error for specific field
     */
    getError(fieldName) {
        return this.errors[fieldName] || null;
    }

    /**
     * Check if field has error
     */
    hasError(fieldName) {
        return !!this.errors[fieldName];
    }

    /**
     * Get all errors
     */
    getAllErrors() {
        return { ...this.errors };
    }

    /**
     * Scroll to first error
     */
    scrollToFirstError() {
        const firstErrorField = Object.keys(this.errors)[0];
        if (firstErrorField) {
            setTimeout(() => {
                const errorElement = document.querySelector(`[x-show="errors.${firstErrorField}"], #${firstErrorField}`);
                if (errorElement) {
                    errorElement.scrollIntoView({ 
                        behavior: 'smooth', 
                        block: 'center' 
                    });
                }
            }, 100);
        }
    }
}

// =============================================================================
// FIELD VALIDATORS
// =============================================================================

const FieldValidators = {
    /**
     * Validate name field (management and requesting centers)
     */
    validateName(value, options = {}) {
        const { minLength = 3, maxLength = 100, alphaOnly = true } = options;
        
        if (!value || value.trim().length === 0) {
            return 'Nome é obrigatório';
        }
        
        if (value.trim().length < minLength) {
            return `Nome deve ter pelo menos ${minLength} caracteres`;
        }
        
        if (value.length > maxLength) {
            return `Nome deve ter no máximo ${maxLength} caracteres`;
        }
        
        if (alphaOnly && !/^[a-zA-ZÀ-ÿ\s]+$/.test(value)) {
            return 'Nome deve conter apenas letras';
        }
        
        return null;
    },

    /**
     * Validate description field
     */
    validateDescription(value, options = {}) {
        const { maxLength = 500 } = options;
        
        if (value && value.length > maxLength) {
            return `Descrição deve ter no máximo ${maxLength} caracteres`;
        }
        
        return null;
    },

    /**
     * Validate management center selection
     */
    validateManagementCenter(value) {
        if (!value) {
            return 'Centro gestor é obrigatório';
        }
        
        return null;
    },

    /**
     * Validate email field
     */
    validateEmail(value, required = false) {
        if (!value && !required) {
            return null;
        }
        
        if (!value && required) {
            return 'E-mail é obrigatório';
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            return 'E-mail deve ter um formato válido';
        }
        
        return null;
    }
};

// =============================================================================
// FORM VALIDATOR CLASS
// =============================================================================

class FormValidator {
    constructor(formData, validationRules) {
        this.formData = formData;
        this.rules = validationRules;
        this.errors = {};
    }

    /**
     * Validate all fields according to rules
     */
    validateAll() {
        this.errors = {};
        let isValid = true;

        Object.keys(this.rules).forEach(fieldName => {
            const rule = this.rules[fieldName];
            const value = this.formData[fieldName];
            
            let error = null;
            
            if (typeof rule === 'function') {
                error = rule(value);
            } else if (rule.validator) {
                error = rule.validator(value, rule.options || {});
            }
            
            if (error) {
                this.errors[fieldName] = error;
                isValid = false;
            }
        });

        return isValid;
    }

    /**
     * Validate single field
     */
    validateField(fieldName) {
        const rule = this.rules[fieldName];
        if (!rule) return true;

        const value = this.formData[fieldName];
        let error = null;
        
        if (typeof rule === 'function') {
            error = rule(value);
        } else if (rule.validator) {
            error = rule.validator(value, rule.options || {});
        }
        
        if (error) {
            this.errors[fieldName] = error;
            return false;
        } else {
            delete this.errors[fieldName];
            return true;
        }
    }

    /**
     * Get validation errors
     */
    getErrors() {
        return { ...this.errors };
    }

    /**
     * Check if field has error
     */
    hasError(fieldName) {
        return !!this.errors[fieldName];
    }

    /**
     * Get specific field error
     */
    getFieldError(fieldName) {
        return this.errors[fieldName] || null;
    }
}

// =============================================================================
// DUPLICATE CHECKER UTILITY
// =============================================================================

class DuplicateChecker {
    constructor(apiEndpoint, delay = 500) {
        this.apiEndpoint = apiEndpoint;
        this.delay = delay;
        this.timeoutId = null;
        this.onResult = null;
    }

    /**
     * Check for duplicates with debouncing
     */
    check(fieldValue, compareField, excludeId = null) {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }

        this.timeoutId = setTimeout(async () => {
            try {
                const response = await fetch(this.apiEndpoint);
                if (response.ok) {
                    const data = await response.json();
                    const items = data.results || data || [];
                    
                    const duplicate = items.find(item => {
                        const itemValue = item[compareField];
                        return itemValue && 
                               itemValue.toLowerCase() === fieldValue.toLowerCase() &&
                               (!excludeId || item.id != excludeId);
                    });

                    if (this.onResult) {
                        this.onResult(!!duplicate, duplicate);
                    }
                }
            } catch (error) {
                console.error('Error checking duplicates:', error);
                if (this.onResult) {
                    this.onResult(false, null, error);
                }
            }
        }, this.delay);
    }

    /**
     * Cancel pending check
     */
    cancel() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
    }
}

// =============================================================================
// API UTILITIES
// =============================================================================

const ApiUtils = {
    /**
     * Make API request with proper error handling
     */
    async makeRequest(url, method = 'GET', data = null) {
        const config = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        // Add CSRF token if available
        const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]')?.value;
        if (csrfToken) {
            config.headers['X-CSRFToken'] = csrfToken;
        }

        if (data) {
            config.body = JSON.stringify(data);
        }

        const response = await fetch(url, config);
        const result = await response.json().catch(() => null);

        return {
            ok: response.ok,
            status: response.status,
            data: result,
            response
        };
    },

    /**
     * Handle API response with standard error processing
     */
    handleResponse(response, onSuccess, onError) {
        if (response.ok) {
            if (onSuccess) {
                onSuccess(response.data);
            }
        } else {
            if (onError) {
                onError(response.data, response.status);
            }
        }
    }
};

// =============================================================================
// UI UTILITIES
// =============================================================================

const UiUtils = {
    /**
     * Show toast notification
     */
    showToast(message, type = 'success', duration = 5000) {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
        const icon = type === 'success' ? '✓' : '✕';
        
        toast.innerHTML = `
            <div class="${bgColor} text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 transform transition-all duration-300 translate-x-full opacity-0">
                <span class="text-xl">${icon}</span>
                <span class="font-medium">${message}</span>
                <button onclick="this.parentElement.remove()" class="ml-4 text-white hover:text-gray-200">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        `;
        
        container.appendChild(toast);
        
        // Animate in
        setTimeout(() => {
            toast.firstElementChild.classList.remove('translate-x-full', 'opacity-0');
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            toast.firstElementChild.classList.add('translate-x-full', 'opacity-0');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },

    /**
     * Format date for display
     */
    formatDate(dateString, options = {}) {
        if (!dateString) return '';
        
        const defaultOptions = {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        };
        
        return new Date(dateString).toLocaleDateString('pt-BR', {
            ...defaultOptions,
            ...options
        });
    },

    /**
     * Debounce function calls
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// =============================================================================
// EXPORTS
// =============================================================================

// Make utilities globally available
window.ValidationErrorHandler = ValidationErrorHandler;
window.FieldValidators = FieldValidators;
window.FormValidator = FormValidator;
window.DuplicateChecker = DuplicateChecker;
window.ApiUtils = ApiUtils;
window.UiUtils = UiUtils;

// Legacy support for existing functions
window.showToast = UiUtils.showToast;
window.makeAPIRequest = ApiUtils.makeRequest;