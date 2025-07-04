// Enhanced API client with better error handling and fallbacks
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://sourcing-platform-api-jake.onrender.com';
const PROXY_BASE_URL = '/api/proxy';

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.proxyURL = PROXY_BASE_URL;
    this.useProxy = true; // Use proxy by default to avoid CORS
  }

  async request(endpoint, options = {}) {
    // Try proxy first, then direct API
    const url = this.useProxy ? `${this.proxyURL}${endpoint}` : `${this.baseURL}${endpoint}`;
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        ...options.headers,
      },
      mode: this.useProxy ? 'same-origin' : 'cors',
      credentials: this.useProxy ? 'same-origin' : 'omit',
    };

    const config = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        // If proxy fails, try direct API
        if (this.useProxy && response.status >= 400) {
          console.log('Proxy failed, trying direct API...');
          this.useProxy = false;
          return this.request(endpoint, options);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }
      
      return await response.text();
    } catch (error) {
      console.error('API request failed:', error);
      
      // If using proxy and it fails, try direct API
      if (this.useProxy && !endpoint.startsWith('/api/proxy')) {
        console.log('Proxy request failed, trying direct API...');
        this.useProxy = false;
        return this.request(endpoint, options);
      }
      
      // Return mock data for development
      if (process.env.NODE_ENV === 'development') {
        return this.getMockResponse(endpoint, options.method || 'GET');
      }
      
      throw error;
    }
  }

  getMockResponse(endpoint, method) {
    console.log(`Returning mock response for ${method} ${endpoint}`);
    
    if (endpoint.includes('/auth/login')) {
      return {
        access_token: 'mock_token_' + Date.now(),
        refresh_token: 'mock_refresh_' + Date.now(),
        user: { id: 'mock_user', email: 'user@example.com' }
      };
    }
    
    if (endpoint.includes('/requests') && method === 'POST') {
      return {
        id: 'mock_request_' + Date.now(),
        status: 'submitted',
        message: 'Request submitted successfully'
      };
    }
    
    return { success: true, data: [], message: 'Mock response' };
  }

  async get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  }

  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
export default apiClient;