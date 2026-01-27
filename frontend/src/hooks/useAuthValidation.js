/**
 * @fileoverview Hook de Validación de Autenticación
 * @description Utilidades para verificar roles y permisos de usuario
 * @module hooks/useAuthValidation
 */

import { useAuth } from '../context/AuthContext';

/**
 * Hook personalizado para validaciones de autenticación
 * Útil para verificar acceso y roles en componentes
 */
export const useAuthValidation = () => {
  const { isAuthenticated, loading, user } = useAuth();

  /**
   * Verifica si el usuario tiene un rol específico
   * @param {string} role - Rol a verificar
   * @returns {boolean}
   */
  const hasRole = (role) => {
    return user?.role === role || user?.roles?.includes(role);
  };

  /**
   * Verifica si el usuario pertenece a un grupo
   * @param {string} groupId - ID del grupo
   * @returns {boolean}
   */
  const belongsToGroup = (groupId) => {
    return user?.groups?.some(group => group.id === groupId || group._id === groupId);
  };

  return {
    hasRole,
    belongsToGroup,
    isAuthenticated,
    loading,
    user,
  };
};

export default useAuthValidation;
