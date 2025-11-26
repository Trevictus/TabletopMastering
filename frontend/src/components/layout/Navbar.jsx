import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GiPerspectiveDiceSixFacesRandom, GiCardPlay, GiTrophy, GiTeamIdea } from 'react-icons/gi';
import { MdPerson, MdExitToApp, MdDashboard } from 'react-icons/md';
import { FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';
import styles from './Navbar.module.css';

/**
 * Componente Navbar - Barra de navegación principal
 * Muestra diferentes opciones según el estado de autenticación
 */
const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  
  const isActive = (path) => {
    return location.pathname === path ? styles.active : '';
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <Link to={isAuthenticated ? "/dashboard" : "/"} className={styles.brand}>
          <GiPerspectiveDiceSixFacesRandom className={styles.brandIcon} />
          <span>Tabletop Mastering</span>
        </Link>

        {/* Usuario NO autenticado */}
        {!isAuthenticated && (
          <ul className={styles.nav}>
            <li>
              <Link to="/" className={`${styles.navLink} ${isActive('/')}`}>
                Inicio
              </Link>
            </li>
            <li>
              <Link to="/login">
                <Button variant="outline" size="small">
                  Iniciar Sesión
                </Button>
              </Link>
            </li>
            <li>
              <Link to="/register">
                <Button variant="primary" size="small">
                  Registrarse
                </Button>
              </Link>
            </li>
          </ul>
        )}

        {/* Usuario autenticado */}
        {isAuthenticated && (
          <ul className={styles.nav}>
            <li>
              <Link to="/dashboard" className={`${styles.navLink} ${isActive('/dashboard')}`}>
                <MdDashboard className={styles.linkIcon} />
                Inicio
              </Link>
            </li>
            <li>
              <Link to="/groups" className={`${styles.navLink} ${isActive('/groups')}`}>
                <GiTeamIdea className={styles.linkIcon} />
                Grupos
              </Link>
            </li>
            <li>
              <Link to="/games" className={`${styles.navLink} ${isActive('/games')}`}>
                <GiCardPlay className={styles.linkIcon} />
                Juegos
              </Link>
            </li>
            <li>
              <Link to="/rankings" className={`${styles.navLink} ${isActive('/rankings')}`}>
                <GiTrophy className={styles.linkIcon} />
                Rankings
              </Link>
            </li>
            <li>
              <Link to="/profile" className={`${styles.navLink} ${isActive('/profile')}`}>
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className={styles.userAvatar} />
                ) : (
                  <FaUserCircle className={styles.linkIcon} />
                )}
                {user?.name || 'Perfil'}
              </Link>
            </li>
            
            {/* Logout Button */}
            <li>
              <Button 
                variant="outline" 
                size="small"
                onClick={handleLogout}
                className={styles.logoutButton}
              >
                <MdExitToApp className={styles.linkIcon} />
              </Button>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
