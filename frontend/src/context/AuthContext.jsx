import PropTypes from 'prop-types';
import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import authService from '../services/authService';
import { STORAGE_KEYS } from '../constants/auth';

const AuthContext = createContext(null);

/**
 * Hook personalizado para acceder al contexto de autenticación
 * @returns {Object} Contexto de autenticación con user, loading, isAuthenticated, initializing y métodos
 * @throws {Error} Si se usa fuera del AuthProvider
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

/**
 * Obtiene el usuario inicial de sessionStorage de forma segura
 * Usamos sessionStorage para aislar sesiones por pestaña
 */
const getInitialUser = () => {
  try {
    const storedUser = sessionStorage.getItem(STORAGE_KEYS.USER);
    const storedToken = sessionStorage.getItem(STORAGE_KEYS.TOKEN);
    if (storedUser && storedToken) {
      return JSON.parse(storedUser);
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * Verifica si hay token en sessionStorage
 */
const hasStoredToken = () => {
  return !!sessionStorage.getItem(STORAGE_KEYS.TOKEN);
};

/**
 * Proveedor del contexto de autenticación global
 * Maneja el estado del usuario autenticado en toda la aplicación
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(getInitialUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  // initializing = true mientras validamos el token con el backend
  const [initializing, setInitializing] = useState(hasStoredToken);
  const hasCheckedAuth = useRef(false);

  // Estado derivado
  const isAuthenticated = useMemo(() => !!user, [user]);

  /**
   * Valida el token actual con el backend al cargar la aplicación
   * Solo hace logout si el token es explícitamente inválido (401)
   * En caso de error de red, mantiene la sesión local
   */
  useEffect(() => {
    if (hasCheckedAuth.current) return;
    hasCheckedAuth.current = true;

    const checkAuth = async () => {
      const token = sessionStorage.getItem(STORAGE_KEYS.TOKEN);
      
      if (!token) {
        setUser(null);
        setInitializing(false);
        return;
      }

      try {
        const { user: currentUser } = await authService.getProfile();
        if (currentUser) {
          setUser(currentUser);
          authService.syncUserData(currentUser);
        }
      } catch (err) {
        // Solo cerrar sesión si el token es explícitamente inválido
        if (err.response?.status === 401) {
          authService.logout();
          setUser(null);
          setError('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
        }
        // En caso de error de red u otro, mantener la sesión local
      } finally {
        setInitializing(false);
      }
    };

    checkAuth();
  }, []);

  /**
   * Ejecuta una operación de autenticación con manejo de errores unificado
   */
  const executeAuthOperation = useCallback(async (operation, errorPrefix) => {
    try {
      setLoading(true);
      setError(null);
      const data = await operation();
      
      if (data.data?.user) {
        setUser(data.data.user);
        return data;
      }
      throw new Error(`Respuesta de ${errorPrefix} inválida`);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || `Error al ${errorPrefix}`;
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Inicia sesión con credenciales
   */
  const login = useCallback(async (credentials) => {
    return executeAuthOperation(
      () => authService.login(credentials),
      'iniciar sesión'
    );
  }, [executeAuthOperation]);

  /**
   * Registra un nuevo usuario
   */
  const register = useCallback(async (userData) => {
    return executeAuthOperation(
      () => authService.register(userData),
      'registrarse'
    );
  }, [executeAuthOperation]);

  /**
   * Cierra la sesión del usuario
   */
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setError(null);
  }, []);

  /**
   * Actualiza el perfil del usuario
   */
  const updateProfile = useCallback(async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      const data = await authService.updateProfile(profileData);
      
      if (data.user) {
        setUser(data.user);
        return data;
      }
      throw new Error('Respuesta de actualización inválida');
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al actualizar perfil';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Limpia mensajes de error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Refresca los datos del usuario desde el backend
   * Útil para actualizar stats después de finalizar partidas
   */
  const refreshUser = useCallback(async () => {
    try {
      const { user: updatedUser } = await authService.getProfile();
      if (updatedUser) {
        setUser(updatedUser);
        authService.syncUserData(updatedUser);
      }
      return updatedUser;
    } catch (err) {
      console.error('Error refrescando usuario:', err);
      return null;
    }
  }, []);

  // Memoizar el valor del contexto
  const value = useMemo(
    () => ({
      user,
      loading,
      error,
      isAuthenticated,
      initializing,
      login,
      register,
      logout,
      updateProfile,
      clearError,
      refreshUser,
    }),
    [user, loading, error, isAuthenticated, initializing, login, register, logout, updateProfile, clearError, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthContext;
