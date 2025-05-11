const isDev = import.meta.env.VITE_DEVELOPMENT_AREA === "true";

export const API_BASE_URL = isDev
  ? "http://localhost:3000/api"
  : "https://financecibination.vercel.app/api";