import { Link, useLocation, useNavigate } from 'react-router-dom';
import { GiPerspectiveDiceSixFacesRandom, GiCardPlay, GiTrophy, GiTeamIdea, GiScrollUnfurled } from 'react-icons/gi';
import { MdPerson, MdExitToApp, MdHome, MdCalendarToday } from 'react-icons/md';
import { FaUserCircle } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import { isValidAvatar } from '../../utils/validators';
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
        <Link to={isAuthenticated ? "/home" : "/"} className={styles.brand}>
          <GiPerspectiveDiceSixFacesRandom className={styles.brandIcon} />
          <span>Tabletop Mastering</span>
        </Link>

        {/* Usuario NO autenticado */}
        {!isAuthenticated && (
          <ul className={styles.nav}>
            <li>
              <Link to="/" className={`${styles.navLink} ${isActive('/')}`}>
                <span className={styles.linkText}>Inicio</span>
              </Link>
            </li>
            <li>
              <Link to="/login" className={styles.authButton}>
                Iniciar Sesión
              </Link>
            </li>
            <li>
              <Link to="/register" className={`${styles.authButton} ${styles.authButtonPrimary}`}>
                Registrarse
              </Link>
            </li>
          </ul>
        )}

        {/* Usuario autenticado */}
        {isAuthenticated && (
          <ul className={styles.nav}>
            <li>
              <Link to="/home" className={`${styles.navLink} ${isActive('/home')}`} title="Inicio">
                <MdHome className={styles.linkIcon} />
                <span className={styles.linkText}>Inicio</span>
              </Link>
            </li>
            <li>
              <Link to="/groups" className={`${styles.navLink} ${isActive('/groups')}`} title="Grupos">
                <GiTeamIdea className={styles.linkIcon} />
                <span className={styles.linkText}>Grupos</span>
              </Link>
            </li>
            <li>
              <Link to="/calendar" className={`${styles.navLink} ${isActive('/calendar')}`} title="Calendario">
                <MdCalendarToday className={styles.linkIcon} />
                <span className={styles.linkText}>Calendario</span>
              </Link>
            </li>
            <li>
              <Link to="/games" className={`${styles.navLink} ${isActive('/games')}`} title="Juegos">
                <GiCardPlay className={styles.linkIcon} />
                <span className={styles.linkText}>Juegos</span>
              </Link>
            </li>
            <li>
              <Link to="/rankings" className={`${styles.navLink} ${isActive('/rankings')}`} title="Rankings">
                <GiTrophy className={styles.linkIcon} />
                <span className={styles.linkText}>Rankings</span>
              </Link>
            </li>
            <li>
              <Link to="/history" className={`${styles.navLink} ${isActive('/history')}`} title="Historial">
                <GiScrollUnfurled className={styles.linkIcon} />
                <span className={styles.linkText}>Historial</span>
              </Link>
            </li>
            <li>
              <Link to="/profile" className={`${styles.navLink} ${styles.profileLink} ${isActive('/profile')}`} title="Perfil">
                {isValidAvatar(user?.avatar) ? (
                  <img src={user.avatar} alt={user.name} className={styles.userAvatar} />
                ) : (
                  <FaUserCircle className={styles.linkIcon} />
                )}
                <span className={styles.linkText}>{user?.name || 'Perfil'}</span>
              </Link>
            </li>
            
            {/* Logout Button */}
            <li>
              <button 
                onClick={handleLogout}
                className={styles.logoutButton}
                title="Cerrar sesión"
              >
                <MdExitToApp className={styles.linkIcon} />
              </button>
            </li>
          </ul>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
