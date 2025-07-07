import React, { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/auth";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(authService.getUser());
  const [token, setToken] = useState(authService.getToken());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Učitaj korisnika sa tokenom na refresh
  useEffect(() => {
    const loadProfile = async () => {
      if (token) {
        try {
          const res = await authService.fetchProfile();
          setUser(res.data.user);
          authService.saveUser(res.data.user);
        } catch (err) {
          setUser(null);
          authService.logout();
        }
      }
      setLoading(false);
    };
    loadProfile();
    // eslint-disable-next-line
  }, []);

  // Login funkcija
  const login = async (email, password) => {
    setError(null);
    const res = await authService.login(email, password);
    setToken(res.data.token);
    setUser(res.data.user);
    authService.saveToken(res.data.token);
    authService.saveUser(res.data.user);
    return res;
  };

  // Register funkcija
  const register = async (userData) => {
    setError(null);
    const res = await authService.register(userData);
    setToken(res.data.token);
    setUser(res.data.user);
    authService.saveToken(res.data.token);
    authService.saveUser(res.data.user);
    return res;
  };

  // Logout funkcija
  const logout = () => {
    setUser(null);
    setToken(null);
    authService.logout();
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, error, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
