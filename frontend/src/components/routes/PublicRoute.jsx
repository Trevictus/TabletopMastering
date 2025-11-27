import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loading from '../common/Loading';

/**
 * Componente PublicRoute
 * Redirige a usuarios autenticados lejos de páginas públicas (login/register)
 * Útil para evitar que usuarios ya logueados vean el formulario de login
 */
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return <Loading fullScreen message="Cargando..." />;
  }

  // Si está autenticado, redirigir al inicio
  if (isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  // Si no está autenticado, mostrar el contenido (login/register)
  return children;
};

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired
};

export default PublicRoute;
