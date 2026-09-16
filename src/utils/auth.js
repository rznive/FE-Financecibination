/**
 * Removes token and user from localStorage and redirects to /login
 */
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
}
