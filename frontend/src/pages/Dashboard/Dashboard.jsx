import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useGroup } from '../../context/GroupContext';
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
import gameService from '../../services/gameService';
import styles from './Dashboard.module.css';

/**
 * Página Inicio - Panel principal del usuario autenticado
 * Muestra resumen de actividad, estadísticas y accesos rápidos
 */
const Dashboard = () => {
  const { user } = useAuth();
  const { groups, loadGroups } = useGroup();
  const location = useLocation();
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [stats, setStats] = useState({
    totalMatches: 0,
    totalWins: 0,
    groupsCount: 0,
    totalPoints: 0,
    gamesCount: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cargar grupos
    loadGroups();
  }, []);

  useEffect(() => {
    // Cargar estadísticas reales del usuario
    const loadUserStats = async () => {
      try {
        // Contar juegos personales del usuario (sin grupo)
        let gamesCount = 0;
        try {
          const gamesResponse = await gameService.getGames({ 
            groupId: undefined, // Solo juegos personales
            limit: 1 
          });
          gamesCount = gamesResponse.total || 0;
        } catch (error) {
          // Solo mostrar error si no es una petición cancelada
          if (error.name !== 'CanceledError') {
            console.error('Error loading games:', error);
          }
        }
        
        // Usar datos del contexto de usuario si están disponibles
        if (user) {
          setStats({
            totalMatches: user.stats?.totalMatches || 0,
            totalWins: user.stats?.totalWins || 0,
            groupsCount: groups.length || 0,
            totalPoints: user.stats?.totalPoints || 0,
            gamesCount: gamesCount
          });
        }
      } catch (error) {
        console.error('Error loading stats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadUserStats();
    }
  }, [user, groups]);

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
            <h3 className={styles.statValue}>{stats.totalMatches}</h3>
            <p className={styles.statLabel}>Partidas Jugadas</p>
          </div>
        </Card>

        <Card variant="elevated" className={styles.statCard}>
          <div className={styles.statIcon}>
            <GiTrophy />
          </div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{stats.totalWins}</h3>
            <p className={styles.statLabel}>Victorias</p>
          </div>
        </Card>

        <Card variant="elevated" className={styles.statCard}>
          <div className={styles.statIcon}>
            <GiTeamIdea />
          </div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{stats.groupsCount}</h3>
            <p className={styles.statLabel}>Grupos Activos</p>
          </div>
        </Card>

        <Card variant="elevated" className={styles.statCard}>
          <div className={styles.statIcon}>
            <GiCardPlay />
          </div>
          <div className={styles.statContent}>
            <h3 className={styles.statValue}>{stats.totalPoints}</h3>
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
    </div>
  );
};

export default Dashboard;
