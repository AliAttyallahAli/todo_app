import api from './api';

export const authAPI = {
  login: (email, password) => 
    api.post('/auth/login', { email, password }),

  register: (userData) => 
    api.post('/auth/register', userData),

  upgradeToVendeur: (vendeurData) => 
    api.post('/auth/upgrade-vendeur', vendeurData),
};

export const userAPI = {
  getProfile: () => 
    api.get('/users/profile'),

  updateProfile: (profileData) => 
    api.put('/users/profile', profileData),
};