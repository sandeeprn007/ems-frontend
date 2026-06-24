import axios from "axios";

// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ||
//     ((window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
//         ? "http://localhost:8080/api"
//         : "https://ems-backend-1dv9.onrender.com/api");


// const API_BASE_URL = "https://ems-backend-1dv9.onrender.com/api";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const apiClient = axios.create({
    baseURL: API_BASE_URL
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 && window.location.pathname !== "/login") {
            localStorage.removeItem("token");
            localStorage.removeItem("authenticatedUser");
            localStorage.removeItem("roles");
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default apiClient;
