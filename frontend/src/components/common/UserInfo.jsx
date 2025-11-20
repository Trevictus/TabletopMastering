import { useAuth } from '../../context/AuthContext';
import { AUTH_SUCCESS } from '../../constants/auth';
import './UserInfo.css';

/**
 * Componente de ejemplo que muestra información del usuario autenticado
 * Demuestra el uso del contexto de autenticación global
 */
const UserInfo = () => {
  const { user, isAuthenticated, loading, logout, error } = useAuth();

  const handleLogout = () => {
    logout();
    // Opcional: mostrar notificación
    console.log(AUTH_SUCCESS.LOGOUT);
  };

  if (loading) {
    return (
      <div className="user-info-loading">
        <span className="spinner"></span>
        <p>Cargando información del usuario...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="user-info-guest">
        <p>No has iniciado sesión</p>
      </div>
    );
  }

  return (
    <div className="user-info">
      {error && (
        <div className="user-info-error">
          <p>{error}</p>
        </div>
      )}

      <div className="user-info-content">
        <div className="user-avatar">
          {user?.name?.charAt(0).toUpperCase() || 'U'}
        </div>

        <div className="user-details">
          <h3>{user?.name || 'Usuario'}</h3>
          <p className="user-email">{user?.email}</p>

          {user?.role && (
            <span className="user-role">{user.role}</span>
          )}

          {user?.groups && user.groups.length > 0 && (
            <div className="user-groups">
              <p className="groups-title">Grupos:</p>
              <ul>
                {user.groups.map((group) => (
                  <li key={group.id || group._id}>{group.name}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <button
        className="logout-button"
        onClick={handleLogout}
        type="button"
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default UserInfo;

