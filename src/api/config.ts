
// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Default headers for all requests
const defaultHeaders = {
  'Content-Type': 'application/json',
};

// Helper function to get auth token from storage
export const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Helper function to set auth token in storage
export const setAuthToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

// Helper function to remove auth token from storage
export const removeAuthToken = (): void => {
  localStorage.removeItem('auth_token');
};

// Base API request with error handling
export const apiRequest = async <T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Prepare headers with authentication if token exists
  const headers = new Headers(defaultHeaders);
  const token = getAuthToken();
  
  if (token) {
    headers.append('Authorization', `Bearer ${token}`);
  }
  
  // Merge provided options with default headers
  const requestOptions: RequestInit = {
    ...options,
    headers: {
      ...Object.fromEntries(headers.entries()),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, requestOptions);
    
    // Handle 401 Unauthorized - clear token and redirect to login
    if (response.status === 401) {
      removeAuthToken();
      window.location.href = '/login';
      throw new Error('Session expired. Please login again.');
    }
    
    // Parse JSON response or handle specific error cases
    const data = await response.json();
    
    if (!response.ok) {
      const errorMessage = data.message || 'Something went wrong';
      throw new Error(errorMessage);
    }
    
    return data;
  } catch (error: any) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// HTTP method shortcuts
export const get = <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  return apiRequest<T>(endpoint, { ...options, method: 'GET' });
};

export const post = <T>(endpoint: string, data: any, options: RequestInit = {}): Promise<T> => {
  return apiRequest<T>(endpoint, {
    ...options,
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const put = <T>(endpoint: string, data: any, options: RequestInit = {}): Promise<T> => {
  return apiRequest<T>(endpoint, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const del = <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  return apiRequest<T>(endpoint, { ...options, method: 'DELETE' });
};

// File upload helper for S3 pre-signed URLs
export const uploadFileToS3 = async (
  presignedUrl: string,
  file: File
): Promise<boolean> => {
  try {
    const response = await fetch(presignedUrl, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });
    
    return response.ok;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    return false;
  }
};
