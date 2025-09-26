import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";

export const AuthContext = createContext();

const isMobile = () =>
  typeof navigator !== "undefined" &&
  /Mobile|Android|iPhone/i.test(navigator.userAgent);

const api = axios.create({
  baseURL: "https://uddy.onrender.com",
  withCredentials: true, // cookies for desktop
});

export const AuthProvider = ({ children }) => {
  const [userName, setUserName] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const storeTokens = ({ access, refresh }) => {
    if (isMobile()) {
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
    }
  };

  const getAccessToken = () => {
    return isMobile() ? localStorage.getItem("access") : null;
  };

  const fetchUser = async () => {
    try {
      const headers = {};
      if (isMobile()) {
        const token = getAccessToken();
        if (token) headers["Authorization"] = `Bearer ${token}`;
      }
      const { data } = await api.get("/auth/users/me/", { headers });
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

  const refreshToken = async () => {
    if (isMobile()) {
      const refresh = localStorage.getItem("refresh");
      if (!refresh) return false;
      try {
        const res = await api.post("/details/auth/jwt/refresh/", { refresh });
        if (res.data.access) {
          localStorage.setItem("access", res.data.access);
          return true;
        }
        return false;
      } catch (err) {
        console.error("Mobile refresh failed:", err.response?.data || err.message);
        logout();
        return false;
      }
    } else {
      try {
        await api.post("/details/auth/jwt/refresh/");
        return true;
      } catch {
        logout();
        return false;
      }
    }
  };

  const login = async (email, password) => {
    try {
      const res = await api.post("/details/auth/jwt/create/", { email, password });

      if (isMobile() && res.data.access && res.data.refresh) {
        storeTokens(res.data);
      }

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
      if (isMobile()) {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
      }
      setIsAuthenticated(false);
      setUserName("");
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const value = { userName, isAuthenticated, login, logout, loading, api, refreshToken };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
