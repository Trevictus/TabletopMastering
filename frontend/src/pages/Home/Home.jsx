import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  GiPerspectiveDiceSixFacesRandom, 
  GiCardPlay, 
  GiTrophy,
  GiTeamIdea 
} from 'react-icons/gi';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import styles from './Home.module.css';

/**
 * Página de inicio (Home)
 * Muestra landing page para no autenticados
 * Redirige a Inicio si está autenticado
 */
const Home = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const [welcomeMessage, setWelcomeMessage] = useState('');

  useEffect(() => {
    // Si está autenticado y entra directamente a /, redirigir a inicio
    if (!loading && isAuthenticated) {
      const currentPath = location.pathname;
      // Solo redirigir si está en /, /login o /register
      if (currentPath === '/' || currentPath === '/login' || currentPath === '/register') {
        navigate('/home', { replace: true });
        return;
      }
      
      // Si viene de una ruta protegida, también redirigir
      const from = location.state?.from;
      if (from && from !== '/' && from !== '/login' && from !== '/register') {
        navigate('/home', { replace: true });
      }
    }

    // Mostrar mensaje de bienvenida si viene del registro o login
    if (location.state?.message) {
      setWelcomeMessage(location.state.message);
      
      // Limpiar el mensaje después de 5 segundos
      const timer = setTimeout(() => {
        setWelcomeMessage('');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [location, isAuthenticated, loading, navigate]);

  return (
    <div className={styles.homePage}>
      {/* Mensaje de bienvenida */}
      {welcomeMessage && (
        <div className={styles.welcomeAlert}>
          <span>🎲</span>
          <span>{welcomeMessage}</span>
        </div>
      )}

      {/* Hero Section */}
      <section className={styles.hero}>
        <GiPerspectiveDiceSixFacesRandom className={styles.heroIcon} />
        <h1 className={styles.heroTitle}>
          Bienvenido a Tabletop Mastering
        </h1>
        <p className={styles.heroDescription}>
          La plataforma definitiva para gestionar tus partidas de juegos de mesa.
          Organiza grupos, registra partidas, consulta estadísticas y mucho más.
        </p>
        <div className={styles.ctaButtons}>
          <Link to="/login">
            <Button variant="primary" size="small">
              Iniciar Sesión
            </Button>
          </Link>
          <Link to="/register">
            <Button variant="outline" size="small">
              Crear Cuenta
            </Button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <Card variant="elevated" className={styles.featureCard}>
          <GiCardPlay className={styles.featureIcon} />
          <h3 className={styles.featureTitle}>Descubre Juegos</h3>
          <p className={styles.featureDescription}>
            Explora miles de juegos de mesa, añade tus favoritos a tu colección
            y descubre nuevas experiencias para tus partidas.
          </p>
        </Card>

        <Card variant="elevated" className={styles.featureCard}>
          <GiTeamIdea className={styles.featureIcon} />
          <h3 className={styles.featureTitle}>Organiza Grupos</h3>
          <p className={styles.featureDescription}>
            Crea grupos privados, invita a tus amigos con códigos únicos
            y coordina partidas de forma sencilla.
          </p>
        </Card>

        <Card variant="elevated" className={styles.featureCard}>
          <GiTrophy className={styles.featureIcon} />
          <h3 className={styles.featureTitle}>Estadísticas y Rankings</h3>
          <p className={styles.featureDescription}>
            Registra resultados, consulta estadísticas detalladas
            y compite sanamente con tu grupo de jugadores.
          </p>
        </Card>
      </section>
    </div>
  );
};

export default Home;
