import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userName, setUserName] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Axios instance
  const api = axios.create({
    baseURL: "https://uddy.onrender.com",
    withCredentials: true, // 🔥 ensure cookies are always sent
  });

  // 🔄 Refresh token (cookie-based)
  const refreshToken = async () => {
    try {
      await api.post("/details/auth/jwt/refresh/"); 
      return true; // cookie updated by backend
    } catch (err) {
      console.error("Token refresh failed:", err.response?.data || err.message);
      logout();
      return false;
    }
  };

  // Axios interceptor: auto-refresh on 401
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshed = await refreshToken();
        if (refreshed) {
          return api(originalRequest); // retry with new cookie
        }
      }
      return Promise.reject(error);
    }
  );

  // Fetch current user
  const fetchUser = async () => {
    try {
      const response = await api.get("/auth/users/me/");
      console.log("fetchUser response:", response.data);

      if (response.data?.username) {
        setUserName(response.data.username);
        setIsAuthenticated(true);
      } else {
        logout();
      }
    } catch (err) {
      console.error("Fetch user error:", err.response?.data || err.message);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      await api.post("/details/auth/jwt/create/", { email, password });
      // ✅ Backend sets cookies, nothing to store
      await fetchUser();
      return true;
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      return false;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await api.post("/details/auth/jwt/logout/");
      console.log("Logout successful");
    } catch (err) {
      console.error("Logout error:", err.response?.data || err.message);
    } finally {
      setIsAuthenticated(false);
      setUserName("");
    }
  };

  // On mount, try fetching user (if cookies exist)
  useEffect(() => {
    fetchUser();
  }, []);

  const value = {
    userName,
    isAuthenticated,
    login,
    logout,
    loading,
    api,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
