/**
 * Punto de entrada centralizado para el sistema de autenticación
 * Exporta todos los elementos necesarios para usar la autenticación en la app
 *
 * @example
 * // Importar todo lo necesario desde un solo lugar
 * import { useAuth, AuthProvider, AUTH_ROUTES, STORAGE_KEYS } from './auth';
 */

// Context y Hooks
export { useAuth, AuthProvider } from './context/AuthContext';
export { useAuthValidation } from './hooks/useAuthValidation';

// Servicios
export { default as authService } from './services/authService';
export { default as api } from './services/api';

// Constantes
export {
  STORAGE_KEYS,
  AUTH_ERRORS,
  AUTH_SUCCESS,
  AUTH_ROUTES,
  AUTH_CONFIG,
  USER_ROLES,
} from './constants/auth';

// Componentes de utilidad (si existen)
// export { default as ProtectedRoute } from './components/routes/ProtectedRoute';
// export { default as PublicRoute } from './components/routes/PublicRoute';
// export { default as UserInfo } from './components/common/UserInfo';

