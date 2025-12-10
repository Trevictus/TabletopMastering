/**
 * @fileoverview Contexto de Autenticación (Wrapper sobre Zustand)
 * @description Provee compatibilidad con componentes existentes que usan useAuth
 * @module context/AuthContext
 */

import PropTypes from 'prop-types';
import { createContext, useEffect, useRef } from 'react';
import useAuthStore from '../stores/authStore';

const AuthContext = createContext(null);

/**
 * Hook personalizado para acceder al contexto de autenticación
 * Actúa como wrapper sobre el store de Zustand para compatibilidad
 * @returns {Object} Contexto de autenticación
 */
export const useAuth = () => {
  // Usar directamente el store de Zustand
  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);
  const error = useAuthStore((state) => state.error);
  const initializing = useAuthStore((state) => state.initializing);
  const login = useAuthStore((state) => state.login);
  const register = useAuthStore((state) => state.register);
  const logout = useAuthStore((state) => state.logout);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const clearError = useAuthStore((state) => state.clearError);
  const refreshUser = useAuthStore((state) => state.refreshUser);
  
  // Estado derivado
  const isAuthenticated = !!user;
  
  return {
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
  };
};

/**
 * Proveedor del contexto de autenticación
 * Inicializa el store y provee compatibilidad con el sistema anterior
 */
export const AuthProvider = ({ children }) => {
  const hasCheckedAuth = useRef(false);
  const initAuth = useAuthStore((state) => state.initAuth);

  // Inicializar autenticación al montar
  useEffect(() => {
    if (hasCheckedAuth.current) return;
    hasCheckedAuth.current = true;
    initAuth();
  }, [initAuth]);

  // El valor del contexto es solo un marcador para verificar el provider
  return (
    <AuthContext.Provider value={true}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default AuthContext;
