import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const logout = useCallback(() => {
        localStorage.removeItem("user");
        setUser(null);
        if (window.logoutTimer) clearTimeout(window.logoutTimer);
    }, []);

    const startTimer = useCallback(() => {
        // Clear any existing timer
        if (window.logoutTimer) clearTimeout(window.logoutTimer);

        window.logoutTimer = setTimeout(() => {
            logout();
            alert("Session expired. You have been logged out.");
        }, 10 * 60 * 1000); // 10 minutes
    }, [logout]);

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setUser(parsedUser);
            if (parsedUser.role === 'STUDENT') {
                startTimer();
            }
        }
        setLoading(false);
    }, [startTimer]);

    const login = useCallback((userData) => {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        if (userData.role === 'STUDENT') {
            startTimer();
        }
    }, [startTimer]);

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
