import PropTypes from 'prop-types';
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

/**
 * Hook personalizado para acceder al contexto de autenticación
 * @returns {Object} Contexto de autenticación con user, loading, isAuthenticated y métodos
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
 * Proveedor del contexto de autenticación global
 * Maneja el estado del usuario autenticado en toda la aplicación
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estado derivado - más predecible
  const isAuthenticated = useMemo(() => !!user, [user]);

  /**
   * Valida el token actual con el backend al cargar la aplicación
   * Esto asegura que el token es válido y obtiene datos actualizados del usuario
   */
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        setError(null);

        // Verificar si existe token en localStorage
        if (!authService.isAuthenticated()) {
          setLoading(false);
          return;
        }

        // Validar token con el backend y obtener datos actualizados
        const { user: currentUser } = await authService.getProfile();

        if (currentUser) {
          setUser(currentUser);
          // Sincronizar localStorage con datos del backend
          authService.syncUserData(currentUser);
        } else {
          // Token inválido o expirado
          authService.logout();
        }
      } catch (err) {
        console.error('Error al verificar autenticación:', err);
        // Si falla la validación, limpiar datos locales
        authService.logout();
        setUser(null);
        setError(err.message || 'Error al verificar autenticación');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  /**
   * Inicia sesión con credenciales
   * @param {Object} credentials - Email y contraseña
   * @returns {Promise<Object>} Datos del usuario y token
   */
  const login = useCallback(async (credentials) => {
    try {
      setLoading(true);
      setError(null);

      const data = await authService.login(credentials);

      if (data.data?.user) {
        setUser(data.data.user);
        return data;
      } else {
        throw new Error('Respuesta de login inválida');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al iniciar sesión';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Registra un nuevo usuario
   * @param {Object} userData - Datos del nuevo usuario
   * @returns {Promise<Object>} Datos del usuario y token
   */
  const register = useCallback(async (userData) => {
    try {
      setLoading(true);
      setError(null);

      const data = await authService.register(userData);

      if (data.data?.user) {
        setUser(data.data.user);
        return data;
      } else {
        throw new Error('Respuesta de registro inválida');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Error al registrarse';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Cierra la sesión del usuario
   * Limpia el estado global y localStorage
   */
  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setError(null);
  }, []);

  /**
   * Actualiza el perfil del usuario
   * @param {Object} profileData - Datos actualizados del perfil
   * @returns {Promise<Object>} Usuario actualizado
   */
  const updateProfile = useCallback(async (profileData) => {
    try {
      setLoading(true);
      setError(null);

      const data = await authService.updateProfile(profileData);

      if (data.user) {
        setUser(data.user);
        return data;
      } else {
        throw new Error('Respuesta de actualización inválida');
      }
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

  // Memoizar el valor del contexto para evitar re-renders innecesarios
  const value = useMemo(
    () => ({
      // Estado
      user,
      loading,
      error,
      isAuthenticated,

      // Métodos
      login,
      register,
      logout,
      updateProfile,
      clearError,
    }),
    [user, loading, error, isAuthenticated, login, register, logout, updateProfile, clearError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthContext;
