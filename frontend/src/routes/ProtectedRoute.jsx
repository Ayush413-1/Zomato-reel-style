import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import axios from "axios";
import "../styles/auth-shared.css";

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
        return (
            <div className="auth-shell">
                <div className="auth-card" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "220px" }}>
                    <div className="loading-spinner" aria-label="Loading" />
                </div>
            </div>
        );
    }

    return authenticated ? children : <Navigate to="/user/login" />;
};

export default ProtectedRoute;