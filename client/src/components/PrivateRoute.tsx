import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import LoginPage from '@/pages/Login';

const PrivateRoute = ({ component: Component }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null); // Initially set to null
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        async function getToken() {
            try {
                const response = await fetch('/api/auth/token');
                const json = await response.json();
                console.log(json.access_token);

                if (json.access_token) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Error fetching token:', error);
                setIsAuthenticated(false);
            } finally {
                setLoading(false); // Set loading state to false after fetching token
            }
        }

        getToken();
    }, []);

    if (loading) {
        return <div>Loading...</div>; // Render loading state until authentication status is determined
    }

    return (isAuthenticated ? <Component /> : <LoginPage />);
};

export default PrivateRoute;