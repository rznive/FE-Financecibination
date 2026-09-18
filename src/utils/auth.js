import { API_BASE_URL } from "../config";

/**
 * Calls backend logout endpoint to invalidate the HttpOnly cookie,
 * then redirects to /login.
 */
export async function logout() {
  try {
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (err) {
    console.error("Logout error:", err);
  }
  window.location.href = "/login";
}

