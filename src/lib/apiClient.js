// Simplified API client - no external calls
class ApiClient {
  constructor() {
    this.baseURL = '';
  }

  async request(endpoint, options = {}) {
    // Always return demo data - no external calls
    return this.getMockResponse(endpoint, options.method || 'GET');
  }

  getMockResponse(endpoint, method) {
    console.log(`Demo mode: ${method} ${endpoint}`);
    
    if (endpoint.includes('/requests') && method === 'POST') {
      return {
        id: 'demo_request_' + Date.now(),
        status: 'submitted',
        message: 'Request submitted successfully (demo mode)'
      };
    }
    
    return { success: true, data: [], message: 'Demo response' };
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