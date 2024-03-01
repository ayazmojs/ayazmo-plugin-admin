'use server'
import { cookies } from "next/headers";

interface FetchOptions extends Omit<RequestInit, 'body'> {
  body?: BodyInit | null;
}

const defaultOptions: RequestInit = {
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json',
  },
};

function buildUrl(url: string): string {
  // Check if the URL is absolute
  if (/^https?:\/\//i.test(url)) {
    return url; // Return full URL
  }
  // Ensure there is an API_URL and prepend it to the relative URL
  if (!process.env.API_URL) {
    throw new Error('API_URL environment variable is not defined');
  }
  // Handle the case where API_URL might not have a trailing slash
  const apiUrl = process.env.API_URL.endsWith('/') ? process.env.API_URL : `${process.env.API_URL}/`;
  return `${apiUrl}${url.startsWith('/') ? url.slice(1) : url}`;
}

const fetchWrapper = (method: string) => async (url: string, options: FetchOptions = {}) => {
  const config: RequestInit = {
    ...defaultOptions,
    method,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  const cookie = cookies().getAll()

  if (cookie && cookie.length && config.headers) {
    const cookiesArray = cookie.map(cookie => `${encodeURIComponent(cookie.name)}=${encodeURIComponent(cookie.value)}`);
    (config.headers as Record<string, string>)['Cookie'] = cookiesArray.join('; ');
  }

  if (options.body != null && typeof options.body === 'object' && !(options.body instanceof FormData) && method !== 'GET') {
    config.body = JSON.stringify(options.body);
  }

  const response = await fetch(buildUrl(url), config);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'An error occurred');
  }
  return response.json();
};

export const get = fetchWrapper('GET');
export const post = fetchWrapper('POST');
export const put = fetchWrapper('PUT');
export const del = fetchWrapper('DELETE');
export const patch = fetchWrapper('PATCH');