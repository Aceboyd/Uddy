// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authTokens, setAuthTokens] = useState(
    localStorage.getItem("authTokens")
      ? JSON.parse(localStorage.getItem("authTokens"))
      : null
  );
  const [loading, setLoading] = useState(true);

  // Setup axios default header for authenticated requests
  useEffect(() => {
    if (authTokens) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${authTokens.access}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [authTokens]);

  // Get user profile if tokens exist
  const fetchUser = async () => {
    if (authTokens) {
      try {
        const response = await axios.get("/auth/users/me/");
        setUser(response.data);
      } catch (err) {
        console.warn("Failed to fetch user:", err.response?.status);
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, [authTokens]);

  const login = async (email, password) => {
    const response = await axios.post("/auth/jwt/create/", {
      email,
      password,
    });

    if (response.status === 200) {
      setAuthTokens(response.data);
      localStorage.setItem("authTokens", JSON.stringify(response.data));
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${response.data.access}`;
      await fetchUser();
      return true;
    }
    return false;
  };

  const logout = async () => {
    try {
      if (authTokens) {
        await axios.post("/auth/jwt/logout/", {
          refresh: authTokens.refresh,
        });
      }
    } catch (err) {
      console.warn("Logout error:", err.response?.status);
    } finally {
      setAuthTokens(null);
      setUser(null);
      localStorage.removeItem("authTokens");
      delete axios.defaults.headers.common["Authorization"];
    }
  };

  const contextData = {
    user,
    authTokens,
    login,
    logout,
    setAuthTokens,
    setUser,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};
