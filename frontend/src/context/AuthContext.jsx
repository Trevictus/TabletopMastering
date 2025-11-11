import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar si hay un usuario en el localStorage al cargar
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const currentUser = authService.getCurrentUser();
          setUser(currentUser);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Error al verificar autenticación:', error);
        authService.logout();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (credentials) => {
    const data = await authService.login(credentials);
    setUser(data.user);
    setIsAuthenticated(true);
    return data;
  };

  const register = async (userData) => {
    const data = await authService.register(userData);
    setUser(data.user);
    setIsAuthenticated(true);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (profileData) => {
    const data = await authService.updateProfile(profileData);
    setUser(data.user);
    return data;
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
