// src/api.js
const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...options.headers,
    },
  });
  if (!res.ok) throw await res.json();
  return res.json();
};