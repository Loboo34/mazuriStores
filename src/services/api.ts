const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:5000/api';

class ApiService {
  private getHeaders(includeAuth = true): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (includeAuth) {
      const token = localStorage.getItem('bakery_token');
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
    }

    return headers;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Network error');
    }
    return response.json();
  }

  // Auth
  async login(username: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify({ username, password }),
    });
    return this.handleResponse(response);
  }

  async getMe() {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // Products
  async getProducts() {
    const response = await fetch(`${API_BASE_URL}/products`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async createProduct(product: Partial<Product>) {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(product),
    });
    return this.handleResponse(response);
  }

  async updateProduct(id: string, product: Partial<Product>) {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(product),
    });
    return this.handleResponse(response);
  }

  async deleteProduct(id: string) {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // Ingredients
  async getIngredients(location?: 'store' | 'kitchen') {
    const url = location 
      ? `${API_BASE_URL}/ingredients?location=${location}`
      : `${API_BASE_URL}/ingredients`;
    
    const response = await fetch(url, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  async createIngredient(ingredient: Partial<Ingredient>) {
    const response = await fetch(`${API_BASE_URL}/ingredients`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(ingredient),
    });
    return this.handleResponse(response);
  }

  async updateIngredient(id: string, ingredient: Partial<Ingredient>) {
    const response = await fetch(`${API_BASE_URL}/ingredients/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(),
      body: JSON.stringify(ingredient),
    });
    return this.handleResponse(response);
  }

  // Orders
  async createOrder(order: Partial<Order>) {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(order),
    });
    return this.handleResponse(response);
  }

  async getOrders(filters?: {
    startDate?: string;
    endDate?: string;
    buyerType?: string;
    category?: string;
  }) {
    const queryParams = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.append(key, value);
      });
    }

    const response = await fetch(`${API_BASE_URL}/orders?${queryParams}`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }

  // Transfers
  async createTransfer(transfer: Partial<Transfer>) {
    const response = await fetch(`${API_BASE_URL}/transfers`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(transfer),
    });
    return this.handleResponse(response);
  }

  async getTransfers() {
    const response = await fetch(`${API_BASE_URL}/transfers`, {
      headers: this.getHeaders(),
    });
    return this.handleResponse(response);
  }
}

export const apiService = new ApiService();