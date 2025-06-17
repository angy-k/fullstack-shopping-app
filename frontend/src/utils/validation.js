/**
 * Form validation rules
 * Reusable validation rules for form inputs
 */

/**
 * Required field validation
 * @param {string} message - Custom error message (optional)
 * @returns {function} Validation function
 */
export const required = (message = 'This field is required') => {
  return (value) => !!value || message;
};

/**
 * Email validation
 * @param {string} message - Custom error message (optional)
 * @returns {function} Validation function
 */
export const email = (message = 'Please enter a valid email address') => {
  return (value) => {
    const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return !value || pattern.test(value) || message;
  };
};

/**
 * Minimum length validation
 * @param {number} length - Minimum length required
 * @param {string} message - Custom error message (optional)
 * @returns {function} Validation function
 */
export const minLength = (length, message = `Must be at least ${length} characters`) => {
  return (value) => !value || value.length >= length || message;
};

/**
 * Maximum length validation
 * @param {number} length - Maximum length allowed
 * @param {string} message - Custom error message (optional)
 * @returns {function} Validation function
 */
export const maxLength = (length, message = `Cannot exceed ${length} characters`) => {
  return (value) => !value || value.length <= length || message;
};

/**
 * Password match validation
 * @param {string|function} compareValue - Value or function returning value to compare against
 * @param {string} message - Custom error message (optional)
 * @returns {function} Validation function
 */
export const passwordMatch = (compareValue, message = 'Passwords do not match') => {
  return (value) => {
    const valueToCompare = typeof compareValue === 'function' ? compareValue() : compareValue;
    return value === valueToCompare || message;
  };
};

/**
 * Numeric validation
 * @param {string} message - Custom error message (optional)
 * @returns {function} Validation function
 */
export const numeric = (message = 'Must contain only numbers') => {
  return (value) => !value || /^\d+$/.test(value) || message;
};

/**
 * URL validation
 * @param {string} message - Custom error message (optional)
 * @returns {function} Validation function
 */
export const url = (message = 'Please enter a valid URL') => {
  return (value) => {
    const pattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
    return !value || pattern.test(value) || message;
  };
};

export default {
  required,
  email,
  minLength,
  maxLength,
  passwordMatch,
  numeric,
  url,
};
