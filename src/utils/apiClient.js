import { API_BASE_URL } from "../config";

/**
 * Wrapper around fetch that:
 * - Sends credentials (HttpOnly cookie) automatically via credentials: "include"
 * - Auto-redirects to /login on 401 or 403 responses
 */
async function apiClient(endpoint, options = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
  });

  if (response.status === 401 || response.status === 403) {
    window.location.href = "/login";
    return;
  }

  return response;
}

export default apiClient;
