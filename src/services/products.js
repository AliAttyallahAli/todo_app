import api from './api';

export const productsAPI = {
  getAll: (limit = 20) => 
    api.get(`/products?limit=${limit}`),

  getById: (id) => 
    api.get(`/products/${id}`),

  create: (productData) => 
    api.post('/products', productData),

  search: (query, categorie) => 
    api.get('/products/search', { params: { q: query, categorie } }),
  getByVendeur: (vendeurId) =>
    api.get(`/products/vendeur/${vendeurId}`),
    
  update: (id, productData) =>
    api.put(`/products/${id}`, productData),
    
  delete: (id) =>
    api.delete(`/products/${id}`),
};