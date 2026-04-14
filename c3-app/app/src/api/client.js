// API utility functions
const getApiBaseUrl = () => {
  return (
    import.meta.env.VITE_API_ENDPOINT ||
    import.meta.env.VITE_API_URL ||
    'https://bx6zjexr3k.execute-api.ap-south-2.amazonaws.com/dev'
  );
};

export const apiClient = {
  baseURL: getApiBaseUrl(),

  async get(endpoint) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  },

  async post(endpoint, data) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  },

  async put(endpoint, data) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  },

  async delete(endpoint) {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    return response.json();
  },
};

export default apiClient;
