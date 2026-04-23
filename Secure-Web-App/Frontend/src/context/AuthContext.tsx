import React, { createContext, useContext, useState, useEffect } from "react";
import API_BASE from "../config";

// Basic user profile structure
interface UserProfile {
    id: number;
    email: string;
    role: string;
}

interface AuthContextType {
    user: UserProfile | null;
    loading: boolean;
    logout: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// This provider wraps the app to handle user session state globally
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch the current user's profile from the backend
    const refreshProfile = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/users/secure`, {
                method: "GET",
                credentials: "include" // Important for session cookies
            });

            if (res.ok) {
                const data = await res.json();
                setUser(data);
            } else {
                // If not authorized, just clear the user state
                setUser(null);
            }
        } catch (err) {
            console.error("Session check failed:", err);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    // Handle session termination
    const logout = async () => {
        try {
            await fetch(`${API_BASE}/api/auth/secure/logout`, {
                method: "POST",
                credentials: "include"
            });
            setUser(null);
            window.location.href = "/login";
        } catch (err) {
            console.error("Error during logout:", err);
        }
    };

    // Check for existing session on initial load
    useEffect(() => {
        refreshProfile();
    }, []);

    return (
        <AuthContext.Provider value={{ user, loading, logout, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

// Helper hook to access auth state easily in components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

