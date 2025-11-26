import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { 
  GiPerspectiveDiceSixFacesRandom, 
  GiCardPlay, 
  GiTrophy,
  GiTeamIdea,
  GiDiceFire
} from 'react-icons/gi';
import { MdGroupAdd, MdAddCircle } from 'react-icons/md';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import styles from './Dashboard.module.css';

/**
 * Página Dashboard - Panel principal del usuario autenticado
 * Muestra resumen de actividad, estadísticas y accesos rápidos
 */
const Dashboard = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [welcomeMessage, setWelcomeMessage] = useState('');

  useEffect(() => {
    // Mostrar mensaje de bienvenida si viene del login
    if (location.state?.message) {
      setWelcomeMessage(location.state.message);
      
      // Limpiar el mensaje después de 5 segundos
      const timer = setTimeout(() => {
        setWelcomeMessage('');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [location]);

  return (
    <div className={styles.dashboardPage}>
      {/* Mensaje de bienvenida */}
      {welcomeMessage && (
        <div className={styles.welcomeAlert}>
          <span>🎲</span>
          <span>{welcomeMessage}</span>
        </div>
      )}

      {/* Welcome Section */}
      <section className={styles.welcome}>
        <div className={styles.welcomeContent}>
          <GiPerspectiveDiceSixFacesRandom className={styles.welcomeIcon} />
          <div>
            <h1 className={styles.welcomeTitle}>
              ¡Bienvenido/a, {user?.name}!
            </h1>
            <p className={styles.welcomeSubtitle}>
              Gestiona tus partidas, grupos y estadísticas desde aquí
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <Card variant="elevated" className={styles.statCard}>
          <div className={styles.statIcon}>
            <GiDiceFire />
          </div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{user?.stats?.totalMatches || 0}</h3>
            <p className={styles.statLabel}>Partidas Jugadas</p>
          </div>
        </Card>

        <Card variant="elevated" className={styles.statCard}>
          <div className={styles.statIcon}>
            <GiTrophy />
          </div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{user?.stats?.totalWins || 0}</h3>
            <p className={styles.statLabel}>Victorias</p>
          </div>
        </Card>

        <Card variant="elevated" className={styles.statCard}>
          <div className={styles.statIcon}>
            <GiTeamIdea />
          </div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{user?.groups?.length || 0}</h3>
            <p className={styles.statLabel}>Grupos Activos</p>
          </div>
        </Card>

        <Card variant="elevated" className={styles.statCard}>
          <div className={styles.statIcon}>
            <GiCardPlay />
          </div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{user?.stats?.totalPoints || 0}</h3>
            <p className={styles.statLabel}>Puntos Totales</p>
          </div>
        </Card>
      </section>

      {/* Quick Actions */}
      <section className={styles.quickActions}>
        <h2 className={styles.sectionTitle}>Acciones Rápidas</h2>
        
        <div className={styles.actionsGrid}>
          <Card variant="bordered" className={styles.actionCard}>
            <MdAddCircle className={styles.actionIcon} />
            <h3 className={styles.actionTitle}>Registrar Partida</h3>
            <p className={styles.actionDescription}>
              Registra los resultados de tu última sesión de juego
            </p>
            <Link to="/matches/new">
              <Button variant="primary" fullWidth>
                Nueva Partida
              </Button>
            </Link>
          </Card>

          <Card variant="bordered" className={styles.actionCard}>
            <MdGroupAdd className={styles.actionIcon} />
            <h3 className={styles.actionTitle}>Crear Grupo</h3>
            <p className={styles.actionDescription}>
              Organiza un nuevo grupo de jugadores
            </p>
            <Link to="/groups">
              <Button variant="primary" fullWidth>
                Mis Grupos
              </Button>
            </Link>
          </Card>

          <Card variant="bordered" className={styles.actionCard}>
            <GiCardPlay className={styles.actionIcon} />
            <h3 className={styles.actionTitle}>Explorar Juegos</h3>
            <p className={styles.actionDescription}>
              Descubre nuevos juegos de mesa para tu colección
            </p>
            <Link to="/games">
              <Button variant="outline" fullWidth>
                Ver Catálogo
              </Button>
            </Link>
          </Card>
        </div>
      </section>

      {/* Recent Activity */}
      <section className={styles.recentActivity}>
        <h2 className={styles.sectionTitle}>Actividad Reciente</h2>
        
        <Card variant="elevated">
          <div className={styles.emptyState}>
            <GiPerspectiveDiceSixFacesRandom className={styles.emptyIcon} />
            <h3 className={styles.emptyTitle}>
              No hay actividad reciente
            </h3>
            <p className={styles.emptyDescription}>
              Comienza registrando tu primera partida o únete a un grupo
            </p>
          </div>
        </Card>
      </section>
    </div>
  );
};

export default Dashboard;
