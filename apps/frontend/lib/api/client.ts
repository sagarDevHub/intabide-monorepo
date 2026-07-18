const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

type RequestBody = Record<string, unknown> | null;
type RequestOptions = RequestInit & { headers?: Record<string, string> };

interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  status?: number;
}

export const api = {
  get: async <T = unknown>(endpoint: string, options?: RequestOptions): Promise<ApiResponse<T>> => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'GET',
      ...options,
      headers: {
        'Content-type': 'application/json',
        ...options?.headers,
      },
    });
    const data = await response.json();

    return {
      data: data as T,
      status: response.status,
      error: response.status >= 400 ? 'Request failed' : undefined,
    };
  },

  post: async <T = unknown>(
    endpoint: string,
    body?: RequestBody,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      ...options,
      headers: {
        'Content-type': 'application/json',
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await response.json();
    return {
      data: data as T,
      status: response.status,
      error: response.status >= 400 ? 'Request failed' : undefined,
    };
  },

  put: async <T = unknown>(
    endpoint: string,
    body?: RequestBody,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> => {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      ...options,
      headers: {
        'Content-type': 'application/json',
        ...options?.headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    const data = await response.json();
    return {
      data: data as T,
      status: response.status,
      error: response.status >= 400 ? 'Request failed' : undefined,
    };
  },

  delete: async <T = unknown>(
    endpoint: string,
    options?: RequestOptions
  ): Promise<ApiResponse<T>> => {
    const response = await fetch(`${API_URL},${endpoint}`, {
      method: 'DELETE',
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    });
    const data = await response.json();
    return {
      data: data as T,
      status: response.status,
      error: response.status >= 400 ? 'Request failed' : undefined,
    };
  },
};
