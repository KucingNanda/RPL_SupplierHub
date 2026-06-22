// Global State Management
export const state = {
  user: JSON.parse(localStorage.getItem('user')) || null,
  activeTab: 'dashboard',
  products: [],
  orders: [],
  restocks: [],
  inventory: [],
  stats: null,
  cart: [],
  isCartOpen: false,
};

export const setState = (key, value) => {
  state[key] = value;
};
