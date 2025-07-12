import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, dbService } from '../db/database';
import { AuthResponse, LoginCredentials, userApi } from '../services/userServices';
import { noteApi } from '../services/noteServices';

interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar usuario al iniciar la aplicación
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (token) {
          // Intentar obtener el perfil del usuario desde el backend
          try {
            const userData = await userApi.getProfile();
            setUser(userData);
          } catch (error) {
            // Si falla, limpiar el token y cargar desde la base de datos local
            console.error('Error loading user from backend:', error);
            localStorage.removeItem('authToken');
            const localUser = await dbService.getCurrentUser();
            if (localUser) {
              setUser(localUser);
            }
          }
        } else {
          // Si no hay token, intentar cargar desde la base de datos local
          const localUser = await dbService.getCurrentUser();
          if (localUser) {
            setUser(localUser);
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Login usando los servicios de userServices
  const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setIsLoading(true);
    try {
      const response = await userApi.login(credentials);
      
      // Guardar token y usuario
      localStorage.setItem('authToken', response.token);
      setUser(response.user);

      const notes = await noteApi.getNotes();
      console.log(notes);
      await dbService.saveServerNotes(notes.map(n => ({...n, userId: response.user.id, synced: 1})));
      
      // También guardar en la base de datos local para modo offline
      await dbService.setCurrentUser(response.user);
      
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout
  const logout = async () => {
    setIsLoading(true);
    try {
      // Intentar logout en el backend
      try {
        await userApi.logout();
      } catch (error) {
        console.error('Backend logout error:', error);
      }
      
      // Limpiar estado local
      localStorage.removeItem('authToken');
      await dbService.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    isAuthenticated: !!user && user.isAuthenticated === 1
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 