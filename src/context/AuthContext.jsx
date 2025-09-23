import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

const api = axios.create({
  baseURL: "https://uddy.onrender.com",
  withCredentials: true, // send cookies with every request
});

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userName, setUserName] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // --- Refresh token ---
  const refreshToken = async () => {
    try {
      await api.post("/details/auth/jwt/refresh/");
      return true;
    } catch (err) {
      console.error("Token refresh failed:", err.response?.data || err.message);
      logout();
      return false;
    }
  };

  // --- Axios interceptor: retry once on 401 ---
  api.interceptors.response.use(
    res => res,
    async error => {
      const original = error.config;
      if (error.response?.status === 401 && !original._retry) {
        original._retry = true;
        const ok = await refreshToken();
        if (ok) return api(original);
      }
      return Promise.reject(error);
    }
  );

  // --- User info ---
  const fetchUser = async () => {
    try {
      const { data } = await api.get("/auth/users/me/");
      if (data?.username) {
        setUserName(data.username);
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

  // --- Auth actions ---
  const login = async (email, password) => {
    try {
      await api.post("/details/auth/jwt/create/", { email, password });
      await fetchUser();
      return true;
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.post("/details/auth/jwt/logout/");
    } catch (err) {
      console.error("Logout error:", err.response?.data || err.message);
    } finally {
      setIsAuthenticated(false);
      setUserName("");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const value = { userName, isAuthenticated, login, logout, loading, api };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);