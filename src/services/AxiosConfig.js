import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
        const publicPaths = ["/login", "/register", "/oauth2/redirect"];

        if (error.response?.status === 401 && !publicPaths.includes(window.location.pathname)) {
            localStorage.removeItem("token");
            localStorage.removeItem("authenticatedUser");
            localStorage.removeItem("roles");
            window.location.href = "/login";
        }

        return Promise.reject(error);
    }
);

export default apiClient;
