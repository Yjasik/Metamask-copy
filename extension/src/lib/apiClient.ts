// extension/src/lib/apiClient.ts

const BASE_URL = 'http://localhost:3001/api';
declare const chrome: any;

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
  auth?: boolean;
}

async function getToken(): Promise<string | null> {
  const result = await chrome.storage.local.get('authToken');
  return result.authToken || null;
}

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = 'GET', headers = {}, body, auth = false } = options;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  if (auth) {
    const token = await getToken();
    if (token) {
      requestHeaders['Authorization'] = `Bearer ${token}`;
    } else {
      throw new Error('Не авторизован');
    }
  }

  const config: RequestInit = {
    method,
    headers: requestHeaders,
  };

  if (body && method !== 'GET') {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `API error: ${response.status}`);
  }

  return response.json();
}

// Утилиты для аутентификации
export async function registerUser(email: string, password: string) {
  return apiRequest<{ accessToken: string; refreshToken: string }>('/users/register', {
    method: 'POST',
    body: { email, password },
  });
}

export async function loginUser(email: string, password: string) {
  return apiRequest<{ accessToken: string; refreshToken: string }>('/users/login', {
    method: 'POST',
    body: { email, password },
  });
}