import axios from "axios";
import { API_BASE_URL } from "../config/api";

const api = axios.create({
    baseURL: API_BASE_URL
});

api.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");

    if(token){
        config.headers.Authorization =
            `Bearer ${token}`;
    }

    return config;
});

// The backend wraps every response in an ApiResponse envelope:
//   { success, message, data, timestamp }
// Unwrap it so the rest of the app keeps reading `response.data`
// as the actual payload (arrays, objects, etc.).
api.interceptors.response.use((response) => {
    const body = response.data;
    if (body && typeof body === "object" && "success" in body && "data" in body) {
        response.data = body.data;
    }
    return response;
});

export default api;