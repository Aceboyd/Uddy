import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userName, setUserName] = useState("Guest");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Create axios instance
  const api = axios.create({
    baseURL: "https://uddy.onrender.com",
    withCredentials: true,
  });

  // Axios interceptor for 401 handling
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        // const refreshed = await refreshToken();
        // if (refreshed) {
        //   return api(originalRequest);
        // }
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
        setUserName("Guest");
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.error("Fetch user error:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      setUserName("Guest");
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

//   // Refresh token
//   const refreshToken = async () => {
//     try {
//       const response = await api.post("/auth/jwt/refresh/");
//       console.log("Token refresh response:", response.data);
//       await fetchUser();
//       return true;
//     } catch (err) {
//       console.error("Token refresh error:", {
//         message: err.message,
//         status: err.response?.status,
//         data: err.response?.data,
//       });
//       setIsAuthenticated(false);
//       setUserName("Guest");
//       return false;
//     }
//   };

  // Login
  const login = async (email, password) => {
    try {
      const response = await api.post("/details/auth/jwt/create/ ", { email, password });
      console.log("Login response:", response.data);
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
      await api.post("/details/auth/jwt/logout/ ");
      console.log("Logout successful");
    } catch (err) {
      console.error("Logout error:", {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
    } finally {
      setIsAuthenticated(false);
      setUserName("Guest");
    }
  };

  // Run once on mount
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{ userName, isAuthenticated, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};