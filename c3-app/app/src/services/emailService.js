// API URL can point to either local backend or Lambda API Gateway endpoint
// For production, use: https://<api-id>.execute-api.<region>.amazonaws.com/<stage>
// For local dev, use: http://localhost:3001
const API_URL = import.meta.env.VITE_API_ENDPOINT || import.meta.env.VITE_API_URL || 'https://bx6zjexr3k.execute-api.ap-south-2.amazonaws.com/dev';

/**
 * Send demo request - stores in S3, sends emails via SES
 * @param {Object} formData - Form data from the demo request
 * @param {string} formData.name - User's full name
 * @param {string} formData.email - User's email
 * @param {string} formData.company - User's company
 * @param {string} formData.message - User's message (optional)
 * @returns {Promise} API response with requestId and location
 */
export const sendDemoRequestEmail = async (formData) => {
  try {
    // Determine if we're calling Lambda API Gateway or local backend
    const endpoint = API_URL.includes('execute-api') 
      ? `${API_URL}/demo-request`  // Lambda API Gateway
      : `${API_URL}/api/send-demo-request`;  // Local backend

    console.log('Sending demo request to:', endpoint);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to send demo request');
    }

    return data;
  } catch (error) {
    console.error('Email send error:', error);
    throw error;
  }
};

/**
 * Send confirmation email to user (handled by backend)
 * Note: The backend API sends both emails together
 * @param {Object} userData - User data
 * @returns {Promise} Success response
 */
export const sendConfirmationEmail = async (userData) => {
  // Confirmation email is sent by the backend along with demo request
  // This function is kept for compatibility but doesn't need to do anything
  return {
    success: true,
    message: 'Confirmation email handled by backend',
  };
};
