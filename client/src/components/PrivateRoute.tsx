import React, { useState, useEffect } from 'react';
import LoginPage from '@/pages/Login';

const PrivateRoute = ({ component: Component }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        async function getToken() {
            try {
                const response = await fetch('/api/auth/token');
                const json = await response.json();
                if (json.access_token) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error('Error fetching token:', error);
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        }

        getToken();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (isAuthenticated ? <Component /> : <LoginPage />);
};

export default PrivateRoute;