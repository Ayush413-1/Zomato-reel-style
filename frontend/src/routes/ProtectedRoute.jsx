import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {

    const token = document.cookie.includes("token");

    if (!token) {
        return <Navigate to="/user/login" />;
    }

    return children;
};

export default ProtectedRoute;