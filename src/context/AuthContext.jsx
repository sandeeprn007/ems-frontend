import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { loginAPICall, logout, storeLoggedInUser } from "../services/AuthService";

const AuthContext = createContext(null);

const readStoredRoles = () => {
    try {
        return JSON.parse(localStorage.getItem("roles")) || [];
    } catch {
        return [];
    }
};

const normalizeRoles = (roles) => {
    if (Array.isArray(roles)) {
        return roles;
    }

    if (typeof roles === "string") {
        return roles.split(",").map((role) => role.trim()).filter(Boolean);
    }

    return [];
};

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem("token"));
    const [username, setUsername] = useState(localStorage.getItem("authenticatedUser"));
    const [roles, setRoles] = useState(readStoredRoles);

    const isAuthenticated = Boolean(token);

    const login = useCallback(async (usernameOrEmail, password) => {
        const response = await loginAPICall(usernameOrEmail, password);
        const { accessToken, username: loggedInUsername, roles: responseRoles } = response.data;
        const normalizedRoles = normalizeRoles(responseRoles);

        storeLoggedInUser(accessToken, loggedInUsername, normalizedRoles);
        setToken(accessToken);
        setUsername(loggedInUsername);
        setRoles(normalizedRoles);

        return response;
    }, []);

    const completeOAuthLogin = useCallback((accessToken, loggedInUsername, responseRoles) => {
        const normalizedRoles = normalizeRoles(responseRoles);

        storeLoggedInUser(accessToken, loggedInUsername, normalizedRoles);
        setToken(accessToken);
        setUsername(loggedInUsername);
        setRoles(normalizedRoles);
    }, []);

    const logoutUser = useCallback(() => {
        logout();
        setToken(null);
        setUsername(null);
        setRoles([]);
    }, []);

    const hasRole = useCallback((role) => {
        const expectedRole = role.startsWith("ROLE_") ? role : `ROLE_${role}`;
        return roles.includes(expectedRole);
    }, [roles]);

    const value = useMemo(() => ({
        token,
        username,
        roles,
        isAuthenticated,
        login,
        completeOAuthLogin,
        logoutUser,
        hasRole
    }), [token, username, roles, isAuthenticated, login, completeOAuthLogin, logoutUser, hasRole]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
};
