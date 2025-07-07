const API_BASE_URL = "http://localhost:5000/api/auth";

// Pomocne funkcije za localStorage
const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export const saveToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const saveUser = (user) => {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const removeUser = () => {
  localStorage.removeItem(USER_KEY);
};

// API pozivi
export const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Greška pri prijavi");
  return data;
};

export const register = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(userData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Greška pri registraciji");
  return data;
};

export const logout = () => {
  removeToken();
  removeUser();
};

export const fetchProfile = async () => {
  const token = getToken();
  if (!token) throw new Error("Niste prijavljeni");
  const response = await fetch(`${API_BASE_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await response.json();
  if (!response.ok)
    throw new Error(data.message || "Greška pri dohvatanju profila");
  return data;
};

export default {
  login,
  register,
  logout,
  saveToken,
  getToken,
  removeToken,
  saveUser,
  getUser,
  removeUser,
  fetchProfile,
};
