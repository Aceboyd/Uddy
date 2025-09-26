import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

const api = axios.create({
  baseURL: "https://uddy.onrender.com",
  withCredentials: !/Mobile|Android|iPhone/i.test(navigator.userAgent)
// cookies only for desktop/web
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Store tokens locally for mobile ---
  const storeTokens = ({ access, refresh }) => {
    if (/Mobile|Android|iPhone/i.test(navigator.userAgent)) {
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);
    }
  };

  // --- Add Authorization header automatically on mobile ---
  api.interceptors.request.use((config) => {
    if (/Mobile|Android|iPhone/i.test(navigator.userAgent)) {
      const token = localStorage.getItem("access");
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // --- Refresh logic with guard to avoid loops ---
  api.interceptors.response.use(
    res => res,
    async (error) => {
      const original = error.config;
      const isAuthCall =
        original.url.includes("/jwt/refresh/") ||
        original.url.includes("/jwt/logout/");

      if (!isAuthCall && error.response?.status === 401 && !original._retry) {
        original._retry = true;
        const ok = await refreshToken();
        if (ok) return api(original);
      }
      return Promise.reject(error);
    }
  );

  const login = async (email, password) => {
    const res = await api.post("/details/auth/jwt/create/", { email,
password });
    // Mobile: tokens in body; Web: cookies only
    if (res.data.access && res.data.refresh) storeTokens(res.data);
    await fetchUser();
  };

  const refreshToken = async () => {
    // Mobile: refresh from localStorage; Web: cookie
    if (/Mobile|Android|iPhone/i.test(navigator.userAgent)) {
      const refresh = localStorage.getItem("refresh");
      if (!refresh) return false;
      try {
        const res = await api.post("/details/auth/jwt/refresh/", { refresh });
        localStorage.setItem("access", res.data.access);
        return true;
      } catch (err) {
        console.error("Token refresh failed:", err);
        return false;
      }
    } else {
      try {
        await api.post("/details/auth/jwt/refresh/");
        return true;
      } catch {
        return false;
      }
    }
  };

  const fetchUser = async () => {
    try {
      const res = await api.get("/details/auth/users/me/");
      setUser(res.data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.post("/details/auth/jwt/logout/");
    } catch (err) {
      console.warn("Logout error:", err);
    }
    // Always clear mobile tokens
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(null);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
