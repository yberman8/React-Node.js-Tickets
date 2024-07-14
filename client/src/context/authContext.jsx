import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';

// Create a context
const AuthContext = createContext();

// Custom hook to use the Auth context
export const useAuth = () => useContext(AuthContext);

// Provider component to wrap around the part of your app that needs access to the context
export const AuthProvider = ({ children }) => {
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();

    const isAuth = () => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken = jwtDecode(token);
            if (decodedToken.exp * 1000 < Date.now()) {
                // Token has expired
                logout();
                return false;
            } else {
                return true;
            }
        } else {
            console.log(location.pathname);
            if (location.pathname !== '/login') {
                logout();    
            }
            return false;
        }
    }

    const loginAuth = (token) => {
        localStorage.setItem('token', token);
        setToken(token);
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsAdmin(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ isAdmin, setIsAdmin, isAuth, loginAuth, logout }}>
            {children}
        </AuthContext.Provider>
    );
};


