// Dynamic API and WebSocket configuration for local dev and production (Vercel)
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/uptime/api";
export const WS_BASE_URL = import.meta.env.VITE_WS_URL || "http://localhost:8000/ws";
