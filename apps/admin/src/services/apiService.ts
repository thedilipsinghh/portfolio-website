import { Alert } from "react-native";

interface RequestConfig extends RequestInit {
  timeoutMs?: number;
}

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  status?: number;
}

/**
 * Custom error class for API failures
 */
class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

/**
 * Handles executing fetch requests with a timeout and centralized logging
 */
const executeRequest = async (url: string, options: RequestConfig): Promise<ApiResponse> => {
  const { timeoutMs = 15000, ...fetchOptions } = options;
  
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  
  const method = fetchOptions.method || "GET";
  
  try {
    console.log(`[API Request] ${method} ${url}`);
    
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    
    clearTimeout(id);
    
    // Attempt to parse JSON response, fallback to text if parsing fails
    let parsedData = null;
    let rawText = await response.text();
    
    try {
      parsedData = rawText ? JSON.parse(rawText) : null;
    } catch (e) {
      console.warn(`[API Response] Failed to parse JSON for ${url}`);
    }

    if (!response.ok) {
      const errorMessage = parsedData?.message || parsedData?.error || `HTTP Error ${response.status}`;
      console.error(`[API Error] ${method} ${url} - ${response.status} ${errorMessage}`);
      return { success: false, status: response.status, error: errorMessage };
    }

    console.log(`[API Success] ${method} ${url} - ${response.status} OK`);
    return { success: true, status: response.status, data: parsedData };
    
  } catch (error: any) {
    clearTimeout(id);
    
    let errorMessage = error.message;
    if (error.name === "AbortError") {
      errorMessage = "Request timed out. Please check your internet connection.";
    } else if (error.message === "Network request failed") {
      errorMessage = "Network request failed. Ensure the server is running and accessible.";
    }
    
    console.error(`[API Network Failure] ${method} ${url} - ${errorMessage}`);
    return { success: false, error: errorMessage };
  }
};

/**
 * Centralized API Service for consistent data fetching
 */
export const apiService = {
  
  get: async (url: string, token?: string | null): Promise<ApiResponse> => {
    const headers: Record<string, string> = { "Accept": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    
    return executeRequest(url, { method: "GET", headers });
  },

  post: async (url: string, body: any, token?: string | null): Promise<ApiResponse> => {
    const isFormData = body instanceof FormData;
    const headers: Record<string, string> = {};
    
    if (!isFormData) headers["Content-Type"] = "application/json";
    if (token) headers["Authorization"] = `Bearer ${token}`;
    
    return executeRequest(url, {
      method: "POST",
      headers,
      body: isFormData ? body : JSON.stringify(body),
    });
  },

  put: async (url: string, body: any, token?: string | null): Promise<ApiResponse> => {
    const isFormData = body instanceof FormData;
    const headers: Record<string, string> = {};
    
    if (!isFormData) headers["Content-Type"] = "application/json";
    if (token) headers["Authorization"] = `Bearer ${token}`;
    
    return executeRequest(url, {
      method: "PUT",
      headers,
      body: isFormData ? body : JSON.stringify(body),
    });
  },

  delete: async (url: string, token?: string | null): Promise<ApiResponse> => {
    const headers: Record<string, string> = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    
    return executeRequest(url, { method: "DELETE", headers });
  },

};
