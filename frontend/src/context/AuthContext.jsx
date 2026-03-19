import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        try {
            const stored = localStorage.getItem("user");
            if (stored) {
                let userData = JSON.parse(stored);
                // Migration: Update old demo name to new name
                if (userData.name === "Akshat Jain") {
                    userData.name = "Akshat Jain";
                    localStorage.setItem("user", JSON.stringify(userData));
                }
                setUser(userData);
            }
        } catch {
            setUser(null);
        }
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.clear();
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
