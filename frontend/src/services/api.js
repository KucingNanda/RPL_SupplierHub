const API_BASE_URL = "http://127.0.0.1:8080/api";

export const authHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : ''
  };
};

export const api = {
  login: async (username, password) => {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    return { ok: res.ok, data: await res.json() };
  },

  fetchAllData: async (userRole, userId) => {
    const opts = { headers: authHeaders() };
    const reqs = [
      fetch(`${API_BASE_URL}/products`, opts),
      fetch(`${API_BASE_URL}/stats/${userRole}/${userId}`, opts),
      fetch(`${API_BASE_URL}/orders?user_id=${userId}&role=${userRole}`, opts),
      fetch(`${API_BASE_URL}/inventory`, opts)
    ];

    if (userRole === 'admin' || userRole === 'distributor') {
      reqs.push(fetch(`${API_BASE_URL}/restocks`, opts));
    }

    const responses = await Promise.all(reqs);
    if (!responses[0].ok) {
      if (responses[0].status === 401) throw new Error("Unauthorized");
    }

    const data = {
      products: await responses[0].json(),
      stats: await responses[1].json(),
      orders: await responses[2].json(),
      inventory: await responses[3].json(),
    };

    if (userRole === 'admin' || userRole === 'distributor') {
      data.restocks = await responses[4].json();
    }

    return data;
  },

  checkoutCart: async (userId, items, notes) => {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ user_id: userId, items, notes })
    });
    return { ok: res.ok, data: await res.json() };
  },

  updateOrderStatus: async (orderId, status) => {
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ status })
    });
    return { ok: res.ok, data: await res.json() };
  },

  payOrder: async (orderId) => {
    const res = await fetch(`${API_BASE_URL}/orders/${orderId}/pay`, {
      method: 'PUT',
      headers: authHeaders(),
    });
    return { ok: res.ok, data: await res.json() };
  },

  requestRestock: async (productId, quantity) => {
    const res = await fetch(`${API_BASE_URL}/restocks`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ product_id: productId, quantity })
    });
    return { ok: res.ok, data: await res.json() };
  },

  approveRestock: async (id) => {
    const res = await fetch(`${API_BASE_URL}/restocks/${id}/approve`, {
      method: 'PUT',
      headers: authHeaders(),
    });
    return { ok: res.ok, data: await res.json() };
  },

  transferInventory: async (productId, quantity) => {
    const res = await fetch(`${API_BASE_URL}/inventory/transfer`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ product_id: productId, quantity })
    });
    return { ok: res.ok, data: await res.json() };
  }
};
