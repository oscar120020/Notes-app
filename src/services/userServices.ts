import api from './api';

// Tipos
export interface User {
  id: string;
  email: string;
  name: string;
  isAuthenticated: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Funciones de API
export const userApi = {
  // Login
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  // Registro
  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const response = await api.post('/users', userData);
    return response.data;
  },

  // Obtener perfil del usuario actual
  getProfile: async (): Promise<User> => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

};
