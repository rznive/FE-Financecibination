// ProtectedRoute.jsx
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

export default function ProtectedRoute({ children }) {
  const [status, setStatus] = useState("loading"); // "loading" | "auth" | "unauth"

  useEffect(() => {
    fetch(`${API_BASE_URL}/auth/me`, {
      credentials: "include",
    })
      .then((res) => {
        if (res.ok) {
          setStatus("auth");
        } else {
          setStatus("unauth");
        }
      })
      .catch(() => setStatus("unauth"));
  }, []);

  if (status === "loading") return null;
  if (status === "unauth") return <Navigate to="/login" replace />;
  return children;
}

