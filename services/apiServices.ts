import { API_URL } from '../constants/apiConstants';
import NetInfo from '@react-native-community/netinfo';

interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number | null;
}

export const checkNetwork = async (): Promise<boolean> => {
  try {
    const netInfo = await NetInfo.fetch();
    return netInfo.isConnected === true;
  } catch (error) {
    console.error('Network check error:', error);
    return false;
  }
};

export async function apiRequest<T>(
  endpoint: string, 
  method: string = 'GET', 
  body: any = null, 
  customHeaders: Record<string, string> = {}
): Promise<ApiResponse<T>> {
  try {
    // Check for network connectivity
    const isConnected = await checkNetwork();
    if (!isConnected) {
      console.log('No network connection available');
      return {
        data: null,
        error: 'No internet connection available. Please check your network settings.',
        status: null
      };
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...customHeaders
    };

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seconds timeout

    const options: RequestInit = {
      method,
      headers,
      signal: controller.signal
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;
    console.log(`🌐 API Request: ${method} ${url}`);
    console.log('Request options:', { headers, method, bodySize: body ? JSON.stringify(body).length : 0 });

    const response = await fetch(url, options);
    clearTimeout(timeoutId);

    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      try {
        data = JSON.parse(text);
      } catch {
        data = { text };
      }
    }

    console.log(`🌐 API Response for ${endpoint}:`, {
      status: response.status,
      ok: response.ok,
      contentType
    });

    return {
      data: response.ok ? data : null,
      error: !response.ok ? (data?.message || `Error: ${response.status}`) : null,
      status: response.status
    };
  } catch (error: any) {
    console.error(`🔴 API Error for ${endpoint}:`, error);
    return {
      data: null,
      error: error.name === 'AbortError' 
        ? 'Request timed out. Please check your connection.'
        : (error.message || 'Network error occurred'),
      status: null
    };
  }
}