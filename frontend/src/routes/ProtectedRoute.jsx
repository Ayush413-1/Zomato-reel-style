import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";

const ProtectedRoute = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
            withCredentials: true
        })
        .then(() => {
            setAuthenticated(true);
        })
        .catch(() => {
            setAuthenticated(false);
        })
        .finally(() => {
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <h2>Loading...</h2>;
    }

    return authenticated ? children : <Navigate to="/user/login" />;
};

export default ProtectedRoute;