// ProfileCompleteRoute.jsx
// Redirects to /complete-profile if the user has a token but wa_number is not set
import { Navigate } from "react-router-dom";

export default function ProfileCompleteRoute({ children }) {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!user || !user.wa_number) {
    return <Navigate to="/complete-profile" replace />;
  }

  return children;
}
