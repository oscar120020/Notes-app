import { useState, useCallback } from 'react';
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

  // Actualizar perfil
  updateProfile: async (userData: Partial<User>): Promise<User> => {
    const response = await api.put('/auth/profile', userData);
    return response.data;
  },

  // Logout
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },
};

// Hook para servicios de usuario
// export const useUserServices = () => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Login
//   const login = useCallback(async (credentials: LoginCredentials) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const data = await userApi.login(credentials);
//       localStorage.setItem('authToken', data.token);
//       console.log(data);
      
//       setUser({...data.user, isAuthenticated: 1});
//       return data;
//     } catch (err: any) {
//       const errorMessage = err.response?.data?.message || 'Error en el login';
//       setError(errorMessage);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Register
//   const register = useCallback(async (userData: RegisterData) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const data = await userApi.register(userData);
//       localStorage.setItem('authToken', data.token);
//       setUser({...data.user, isAuthenticated: 1});
//       return data;
//     } catch (err: any) {
//       const errorMessage = err.response?.data?.message || 'Error en el registro';
//       setError(errorMessage);
//       throw err;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   // Get profile
// //   const getProfile = useCallback(async () => {
// //     setLoading(true);
// //     setError(null);
// //     try {
// //       const userData = await userApi.getProfile();
// //       setUser(userData);
// //       return userData;
// //     } catch (err: any) {
// //       const errorMessage = err.response?.data?.message || 'Error al obtener perfil';
// //       setError(errorMessage);
// //       throw err;
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, []);

//   // Update profile
// //   const updateProfile = useCallback(async (userData: Partial<User>) => {
// //     setLoading(true);
// //     setError(null);
// //     try {
// //       const updatedUser = await userApi.updateProfile(userData);
// //       setUser(updatedUser);
// //       return updatedUser;
// //     } catch (err: any) {
// //       const errorMessage = err.response?.data?.message || 'Error al actualizar perfil';
// //       setError(errorMessage);
// //       throw err;
// //     } finally {
// //       setLoading(false);
// //     }
// //   }, []);

//   // Logout
//   const logout = useCallback(async () => {
//     setLoading(true);
//     try {
//       //await userApi.logout();
//     } catch (err) {
//       console.error('Error en logout:', err);
//     } finally {
//       localStorage.removeItem('authToken');
//       setUser(null);
//       setError(null);
//       setLoading(false);
//       window.location.href = '/login';
//     }
//   }, []);

//   // Check if user is authenticated
// //   const checkAuth = useCallback(async () => {
// //     const token = localStorage.getItem('authToken');
// //     if (token && !user) {
// //       try {
// //         await getProfile();
// //       } catch (err) {
// //         localStorage.removeItem('authToken');
// //       }
// //     }
// //   }, [user, getProfile]);

//   return {
//     // State
//     user,
//     loading,
//     error,
    
//     // Actions
//     login,
//     register,
//     // getProfile,
//     // updateProfile,
//     logout,
//     // checkAuth,
    
//     // Computed
//     isAuthenticated: !!user && user.isAuthenticated === 1,
//   };
// };

// // Hook para verificar si el usuario está autenticado
// export const useAuth = () => {
//   const { user, loading, error, isAuthenticated } = useUserServices();
  
//   return {
//     user,
//     isLoading: loading,
//     isAuthenticated,
//     isError: !!error,
//     error,
//   };
// };