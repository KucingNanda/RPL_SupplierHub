const API_URL = "http://localhost:8000/api";

export const api = {
  async login(username, password) {
    const res = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || "Terjadi kesalahan");
    }
    return res.json();
  },

  async getProducts() {
    const res = await fetch(`${API_URL}/products`);
    return res.json();
  },

  async getStats(role, userId) {
    const res = await fetch(`${API_URL}/stats/${role}/${userId}`);
    return res.json();
  },

  async getOrders(role, userId) {
    const url = role === "admin" 
      ? `${API_URL}/orders?role=admin` 
      : `${API_URL}/orders?role=user&user_id=${userId}`;
    const res = await fetch(url);
    return res.json();
  }
};
