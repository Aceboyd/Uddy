import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";


export const AuthContext = createContext();

const api = axios.create({
  baseURL: "https://uddy.onrender.com",
});

// Request interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  console.log("➡️ Request:", config.method?.toUpperCase(), config.url, config.data);
  return config;
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      error.response?.data?.code === "token_not_valid" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const refresh = localStorage.getItem("refresh");
      if (refresh) {
        try {
          const res = await api.post("/details/auth/jwt/refresh/", { refresh });
          if (res.data.access) {
            localStorage.setItem("access", res.data.access);
            api.defaults.headers.Authorization = `Bearer ${res.data.access}`;
            originalRequest.headers.Authorization = `Bearer ${res.data.access}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
        }
      }
    }
    return Promise.reject(error);
  }
);

export const AuthProvider = ({ children }) => {
  const [userName, setUserName] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("access") || null);

  const storeTokens = ({ access, refresh }) => {
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
    setToken(access);
  };

  const fetchUser = async () => {
    try {
      const { data } = await api.get("/auth/users/me/");
      if (data?.username || data?.email) {
        setUserName(data.username || data.email);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUserName("");
      }
    } catch {
      setIsAuthenticated(false);
      setUserName("");
    } finally {
      setLoading(false);
    }
  };

  const login = async (identifier, password) => {
    try {
      const res = await api.post("/details/auth/jwt/create/", {
        email: identifier,
        password,
      });
      if (res.data.access && res.data.refresh) {
        storeTokens(res.data);
      }
      await fetchUser();
      return true;
    } catch {
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.post("/details/auth/jwt/logout/", {
        refresh: localStorage.getItem("refresh"),
      });
    } catch {}
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setToken(null);
    setIsAuthenticated(false);
    setUserName("");
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const value = { userName, isAuthenticated, token, login, logout, loading, api };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
