// ProfileCompleteRoute.jsx
// Redirects to /complete-profile if user is authenticated but wa_number is not set
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

export default function ProfileCompleteRoute({ children }) {
  const [status, setStatus] = useState("loading"); // "loading" | "ok" | "incomplete" | "unauth"

  useEffect(() => {
    fetch(`${API_BASE_URL}/auth/me`, {
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) {
          setStatus("unauth");
          return;
        }
        const data = await res.json();
        // Support both data.data.wa_number and data.wa_number depending on backend shape
        const user = data.data || data;
        if (!user || !user.wa_number) {
          setStatus("incomplete");
        } else {
          setStatus("ok");
        }
      })
      .catch(() => setStatus("unauth"));
  }, []);

  if (status === "loading") return null;
  if (status === "unauth") return <Navigate to="/login" replace />;
  if (status === "incomplete") return <Navigate to="/complete-profile" replace />;
  return children;
}

