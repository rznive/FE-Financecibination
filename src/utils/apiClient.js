import { API_BASE_URL } from "../config";

/**
 * Wrapper around fetch that:
 * - Automatically attaches Authorization: Bearer <token> from localStorage
 * - Auto-redirects to /login on 401 or 403 responses
 */
async function apiClient(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401 || response.status === 403) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
    return;
  }

  return response;
}

export default apiClient;
