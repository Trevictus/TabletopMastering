import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loading from '../common/Loading';

/**
 * Componente ProtectedRoute
 * Protege rutas que requieren autenticación
 * Redirige a /login si el usuario no está autenticado
 * Guarda la URL de destino para redirigir después del login
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return <Loading fullScreen message="Verificando sesión..." />;
  }

  // Si no está autenticado, redirigir a login con returnUrl
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Si está autenticado, mostrar el contenido
  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
};

export default ProtectedRoute;
