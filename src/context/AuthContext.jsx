import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userName, setUserName] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [refresh, setRefresh] = useState(localStorage.getItem("refresh") || null);

  // Create axios instance
  const api = axios.create({
    baseURL: "https://uddy.onrender.com",
    withCredentials: true,
  });

  // 🔄 Refresh token function
  const refreshToken = async () => {
    if (!refresh) return false;
    try {
      const response = await api.post("/details/auth/jwt/refresh/", { refresh });
      const newAccess = response.data.access;
      localStorage.setItem("token", newAccess);
      setToken(newAccess);
      return newAccess;
    } catch (err) {
      console.error("Token refresh failed:", err.response?.data || err.message);
      logout();
      return false;
    }
  };

  // Axios interceptor for handling 401 automatically
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const newAccess = await refreshToken();
        if (newAccess) {
          originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;
          return api(originalRequest); // retry request
        }
      }
      return Promise.reject(error);
    }
  );

  // Fetch current user
  const fetchUser = async () => {
    try {
      const response = await api.get("/auth/users/me/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("fetchUser response:", JSON.stringify(response.data, null, 2));

      if (response.data?.username) {
        setUserName(response.data.username);
        setIsAuthenticated(true);
      } else {
        logout();
      }
    } catch (err) {
      console.error("Fetch user error:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Login
  const login = async (email, password) => {
    try {
      const response = await api.post("/details/auth/jwt/create/", { email, password });
      console.log("Login response:", JSON.stringify(response.data, null, 2));

      // Save both access & refresh tokens
      setToken(response.data.access);
      setRefresh(response.data.refresh);
      localStorage.setItem("token", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);

      await fetchUser();
      return true;
    } catch (err) {
      console.error("Login error:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      return false;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await api.post("/details/auth/jwt/logout/");
      console.log("Logout successful");
    } catch (err) {
      console.error("Logout error:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
    } finally {
      setIsAuthenticated(false);
      setUserName("");
      setToken(null);
      setRefresh(null);
      localStorage.removeItem("token");
      localStorage.removeItem("refresh");
    }
  };

  // Run once on mount
  useEffect(() => {
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const value = {
    userName,
    isAuthenticated,
    login,
    logout,
    loading,
    api,
    token,
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
