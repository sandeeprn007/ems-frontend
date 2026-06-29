import apiClient, { API_BASE_URL } from "./AxiosConfig";

export const loginAPICall = (usernameOrEmail, password) => {
    return apiClient.post("/auth/login", { usernameOrEmail, password });
};

export const registerAPICall = (registerObj) => {
    return apiClient.post("/auth/register", registerObj);
};

export const registerAdminAPICall = (registerObj) => {
    return apiClient.post("/auth/register-admin", registerObj);
};

export const changePasswordAPICall = (changePasswordObj) => {
    return apiClient.post("/auth/change-password", changePasswordObj);
};

export const getGoogleOAuthUrl = () => {
    const backendBaseUrl = API_BASE_URL.replace(/\/api\/?$/, "");
    return `${backendBaseUrl}/oauth2/authorization/google`;
};

export const storeLoggedInUser = (token, username, roles) => {
    localStorage.setItem("token", token);
    localStorage.setItem("authenticatedUser", username);
    localStorage.setItem("roles", JSON.stringify(Array.isArray(roles) ? roles : []));
};

export const isUserLoggedIn = () => {
    return Boolean(localStorage.getItem("token"));
};

export const getLoggedInUserRoles = () => {
    try {
        return JSON.parse(localStorage.getItem("roles")) || [];
    } catch {
        return [];
    }
};

export const hasRole = (role) => {
    const expectedRole = role.startsWith("ROLE_") ? role : `ROLE_${role}`;
    return getLoggedInUserRoles().includes(expectedRole);
};

export const isAdminUser = () => {
    return hasRole("ADMIN");
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("authenticatedUser");
    localStorage.removeItem("roles");
};
