/**
 * utilities.js
 *
 * A collection of utility functions for the project.
 */

// ----------------------------------------------------------------------------
// 1. Common Helper Functions
// ----------------------------------------------------------------------------

/**
 * Checks if a value is empty (null, undefined, empty string, or empty array).
 * @param {any} value The value to check.
 * @returns {boolean} True if the value is empty, false otherwise.
 */
const isEmpty = (value) => {
  return (
    value === null ||
    value === undefined ||
    (typeof value === 'string' && value.trim() === '') ||
    (Array.isArray(value) && value.length === 0)
  );
};

/**
 * Generates a unique ID (UUID v4).
 * @returns {string} A unique ID.
 */
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// ----------------------------------------------------------------------------
// 2. Form Validation Utilities
// ----------------------------------------------------------------------------

/**
 * Validates an email address.
 * @param {string} email The email address to validate.
 * @returns {boolean} True if the email is valid, false otherwise.
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a password based on specified criteria.
 * @param {string} password The password to validate.
 * @param {object} options Validation options (e.g., minLength, requireUppercase, requireNumber).
 * @returns {boolean} True if the password is valid, false otherwise.
 */
const isValidPassword = (password, options = {}) => {
  const { minLength = 8, requireUppercase = false, requireNumber = false } = options;

  if (password.length < minLength) {
    return false;
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    return false;
  }

  if (requireNumber && !/[0-9]/.test(password)) {
    return false;
  }

  return true;
};

/**
 * Checks if two passwords match.
 * @param {string} password The first password.
 * @param {string} confirmPassword The second password.
 * @returns {boolean} True if the passwords match, false otherwise.
 */
const passwordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

// ----------------------------------------------------------------------------
// 3. API Call Helpers
// ----------------------------------------------------------------------------

/**
 * Makes an API request.
 * @param {string} url The API endpoint URL.
 * @param {string} method The HTTP method (e.g., 'GET', 'POST', 'PUT', 'DELETE').
 * @param {object} [body] The request body (for POST, PUT, etc.).
 * @param {object} [headers] Additional headers to include in the request.
 * @returns {Promise<object>} A promise that resolves with the response data or rejects with an error.
 */
const apiRequest = async (url, method, body = null, headers = {}) => {
  try {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json', // Default content type
        ...headers, // Merge additional headers
      },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);

    if (!response.ok) {
      const errorData = await response.json(); // Attempt to parse error JSON
      throw new Error(`API request failed with status ${response.status}: ${errorData.message || response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request error:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

/**
 * Helper function for making a GET request.
 * @param {string} url The API endpoint URL.
 * @param {object} [headers] Additional headers to include in the request.
 * @returns {Promise<object>} A promise that resolves with the response data or rejects with an error.
 */
const get = (url, headers = {}) => apiRequest(url, 'GET', null, headers);

/**
 * Helper function for making a POST request.
 * @param {string} url The API endpoint URL.
 * @param {object} body The request body.
 * @param {object} [headers] Additional headers to include in the request.
 * @returns {Promise<object>} A promise that resolves with the response data or rejects with an error.
 */
const post = (url, body, headers = {}) => apiRequest(url, 'POST', body, headers);

/**
 * Helper function for making a PUT request.
 * @param {string} url The API endpoint URL.
 * @param {object} body The request body.
 * @param {object} [headers] Additional headers to include in the request.
 * @returns {Promise<object>} A promise that resolves with the response data or rejects with an error.
 */
const put = (url, body, headers = {}) => apiRequest(url, 'PUT', body, headers);

/**
 * Helper function for making a DELETE request.
 * @param {string} url The API endpoint URL.
 * @param {object} [headers] Additional headers to include in the request.
 * @returns {Promise<object>} A promise that resolves with the response data or rejects with an error.
 */
const del = (url, headers = {}) => apiRequest(url, 'DELETE', null, headers); // Use del to avoid shadowing reserved word.

// ----------------------------------------------------------------------------
// 4. Date/Time Utilities
// ----------------------------------------------------------------------------

/**
 * Formats a date object into a string.
 * @param {Date} date The date object to format.
 * @param {string} [format='YYYY-MM-DD HH:mm:ss'] The desired format string.  Uses moment.js style formatting.
 * @returns {string} The formatted date string.
 */
const formatDate = (date, format = 'YYYY-MM-DD HH:mm:ss') => {
  if (!date) return ''; // Handle null or undefined dates

  try {
    return moment(date).format(format);  // Requires moment.js library
  } catch (error) {
    console.error("Error formatting date (moment.js required):", error);
    return date.toString(); // Fallback to default string representation
  }

};

/**
 * Calculates the time difference between two dates in human-readable format (e.g., "2 hours ago").
 * @param {Date} date1 The first date.
 * @param {Date} date2 The second date (optional, defaults to current time).
 * @returns {string} The time difference in human-readable format.
 */
const getTimeDifference = (date1, date2 = new Date()) => {
  try {
    return moment(date1).from(date2); // Requires moment.js library
  } catch (error) {
    console.error("Error calculating time difference (moment.js required):", error);
    return "Invalid Date";
  }
};

// ----------------------------------------------------------------------------
// 5. Local Storage Helpers
// ----------------------------------------------------------------------------

/**
 * Gets an item from local storage.
 * @param {string} key The key of the item to retrieve.
 * @returns {any} The value of the item, or null if not found.
 */
const getFromLocalStorage = (key) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (error) {
    console.error('Error getting item from local storage:', error);
    return null;
  }
};

/**
 * Sets an item in local storage.
 * @param {string} key The key of the item to set.
 * @param {any} value The value to set.
 */
const setInLocalStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error setting item in local storage:', error);
  }
};

/**
 * Removes an item from local storage.
 * @param {string} key The key of the item to remove.
 */
const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error('Error removing item from local storage:', error);
  }
};

// ----------------------------------------------------------------------------
// 6. DOM Manipulation Utilities
// ----------------------------------------------------------------------------

/**
 * Adds a class to an element.
 * @param {HTMLElement} element The element to add the class to.
 * @param {string} className The class to add.
 */
const addClass = (element, className) => {
  if (element && className) {
    element.classList.add(className);
  }
};

/**
 * Removes a class from an element.
 * @param {HTMLElement} element The element to remove the class from.
 * @param {string} className The class to remove.
 */
const removeClass = (element, className) => {
  if (element && className) {
    element.classList.remove(className);
  }
};

/**
 * Toggles a class on an element.
 * @param {HTMLElement} element The element to toggle the class on.
 * @param {string} className The class to toggle.
 */
const toggleClass = (element, className) => {
  if (element && className) {
    element.classList.toggle(className);
  }
};

/**
 * Gets an element by its ID.  Returns null if not found.
 * @param {string} id The ID of the element to get.
 * @returns {HTMLElement | null} The element, or null if not found.
 */
const getElementById = (id) => {
  return document.getElementById(id);
};

/**
 * Sets the text content of an element.
 * @param {HTMLElement} element The element to set the text content of.
 * @param {string} text The text content to set.
 */
const setTextContent = (element, text) => {
  if (element) {
    element.textContent = text;
  }
};

// ----------------------------------------------------------------------------
// 7. Error Handling Functions
// ----------------------------------------------------------------------------

/**
 * Logs an error message to the console.
 * @param {string} message The error message to log.
 * @param {Error} [error] The error object (optional).
 */
const logError = (message, error) => {
  console.error(`ERROR: ${message}`);
  if (error) {
    console.error(error);
  }
};

/**
 * Displays an error message to the user (e.g., in an alert or on the page).
 * @param {string} message The error message to display.
 */
const displayErrorMessage = (message) => {
  // Implement your preferred method of displaying error messages to the user
  // (e.g., using an alert, a modal, or a dedicated error display area).
  alert(message); // Example: Displaying an alert
};

/**
 * Handles API errors by logging them and displaying a user-friendly message.
 * @param {Error} error The error object.
 * @param {string} [defaultMessage='An error occurred. Please try again.'] A default message to display to the user.
 */
const handleApiError = (error, defaultMessage = 'An error occurred. Please try again.') => {
  logError('API Error:', error);
  displayErrorMessage(error.message || defaultMessage);
};

// Export all functions
export {
  isEmpty,
  generateUUID,
  isValidEmail,
  isValidPassword,
  passwordsMatch,
  apiRequest,
  get,
  post,
  put,
  del,
  formatDate,
  getTimeDifference,
  getFromLocalStorage,
  setInLocalStorage,
  removeFromLocalStorage,
  addClass,
  removeClass,
  toggleClass,
  getElementById,
  setTextContent,
  logError,
  displayErrorMessage,
  handleApiError,
};