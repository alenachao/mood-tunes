import React, { createContext, useContext, useState, useEffect } from 'react';

// Create AuthContext
const AuthContext = createContext();

interface AuthContextType {
    isAuthenticated: boolean;
}

// AuthProvider Component
export const AuthProvider = ({ children }) => {
    const isAuthenticated = getToken();

    async function getToken() {
        try {
            const response = await fetch('/api/auth/token');
            const json = await response.json();
            console.log(json.access_token);

            if (json.access_token) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            console.error('Error fetching token:', error);
            return false;
    }

        ;
    }


    return (
        <AuthContext.Provider value={{ isAuthenticated }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use auth context
export const useAuth = () => useContext(AuthContext);