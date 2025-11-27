import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Hook personalizado para validaciones de autenticación
 * Útil para redirigir o verificar acceso en componentes
 */
export const useAuthValidation = () => {
  const { isAuthenticated, loading, user } = useAuth();
  const navigate = useNavigate();

  /**
   * Requiere que el usuario esté autenticado
   * Redirige a login si no lo está
   */
  const requireAuth = (redirectTo = '/login') => {
    useEffect(() => {
      if (!loading && !isAuthenticated) {
        navigate(redirectTo, { replace: true });
      }
    }, [loading, isAuthenticated, navigate, redirectTo]);
  };

  /**
   * Requiere que el usuario NO esté autenticado
   * Redirige a inicio si ya lo está
   */
  const requireGuest = (redirectTo = '/home') => {
    useEffect(() => {
      if (!loading && isAuthenticated) {
        navigate(redirectTo, { replace: true });
      }
    }, [loading, isAuthenticated, navigate, redirectTo]);
  };

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
    requireAuth,
    requireGuest,
    hasRole,
    belongsToGroup,
    isAuthenticated,
    loading,
    user,
  };
};

export default useAuthValidation;

