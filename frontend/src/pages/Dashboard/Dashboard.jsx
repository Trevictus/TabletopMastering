import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useGroup } from '../../context/GroupContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { GiPerspectiveDiceSixFacesRandom, GiDiceFire, GiTrophy, GiTeamIdea } from 'react-icons/gi';
import { FiPlus, FiAward, FiCalendar, FiClock } from 'react-icons/fi';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import matchService from '../../services/matchService';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { user } = useAuth();
  const { groups, loadGroups } = useGroup();
  const location = useLocation();
  const navigate = useNavigate();
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);

  useEffect(() => { loadGroups(); }, []);

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const response = await matchService.getAllUserMatches({ limit: 10 });
        const matches = response.data || [];
        const now = new Date();
        
        // Próximas partidas (pendientes, futuras)
        const upcoming = matches
          .filter(m => m.status === 'pending' && new Date(m.scheduledDate) >= now)
          .sort((a, b) => new Date(a.scheduledDate) - new Date(b.scheduledDate))
          .slice(0, 3);
        
        // Partidas recientes (completadas)
        const recent = matches
          .filter(m => m.status === 'completed')
          .sort((a, b) => new Date(b.playedAt || b.createdAt) - new Date(a.playedAt || a.createdAt))
          .slice(0, 3);
        
        setUpcomingMatches(upcoming);
        setRecentMatches(recent);
      } catch (err) {
        console.error('Error loading matches:', err);
      }
    };
    loadMatches();
  }, []);

  useEffect(() => {
    if (location.state?.message) {
      setWelcomeMessage(location.state.message);
      const timer = setTimeout(() => setWelcomeMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [location]);

  const stats = {
    matches: user?.stats?.totalMatches || 0,
    wins: user?.stats?.totalWins || 0,
    groups: groups.length || 0,
  };
  const winRate = stats.matches > 0 ? Math.round((stats.wins / stats.matches) * 100) : 0;

  const formatDate = (date) => {
    const d = new Date(date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (d.toDateString() === today.toDateString()) return 'Hoy';
    if (d.toDateString() === tomorrow.toDateString()) return 'Mañana';
    return d.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  return (
    <div className={styles.page}>
      {welcomeMessage && <div className={styles.toast}>{welcomeMessage}</div>}

      {/* Hero */}
      <section className={styles.hero}>
        <GiPerspectiveDiceSixFacesRandom className={styles.diceIcon} />
        <div className={styles.heroText}>
          <h1>Bienvenido/a, {user?.name}</h1>
          <p>Gestiona tus partidas, grupos y estadísticas desde aquí</p>
        </div>
      </section>

      {/* Stats + Acción */}
      <section className={styles.statsBar}>
        <div className={styles.statsGroup}>
          <div className={styles.stat}>
            <GiDiceFire />
            <span>{stats.matches}</span>
            <small>Partidas</small>
          </div>
          <div className={styles.stat}>
            <GiTrophy style={{ color: '#10b981' }} />
            <span>{stats.wins}</span>
            <small>Victorias</small>
          </div>
          <div className={styles.stat}>
            <FiAward style={{ color: '#d4af37' }} />
            <span>{winRate}%</span>
            <small>Win Rate</small>
          </div>
          <div className={styles.stat}>
            <GiTeamIdea />
            <span>{stats.groups}</span>
            <small>Grupos</small>
          </div>
        </div>
        <Button variant="primary" onClick={() => navigate('/calendar', { state: { openCreateModal: true } })}>
          <FiPlus /> Nueva Partida
        </Button>
      </section>

      {/* Contenido principal en 2 columnas */}
      <div className={styles.content}>
        {/* Próximas partidas */}
        <section className={styles.section}>
          <h2><FiCalendar /> Próximas Partidas</h2>
          {upcomingMatches.length > 0 ? (
            <div className={styles.matchList}>
              {upcomingMatches.map(match => (
                <div key={match._id} className={styles.matchItem} onClick={() => navigate('/calendar')}>
                  <div className={styles.matchDate}>{formatDate(match.scheduledDate)}</div>
                  <div className={styles.matchInfo}>
                    <span className={styles.matchGame}>{match.game?.name || 'Sin juego'}</span>
                    <span className={styles.matchGroup}>{match.group?.name}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Card variant="outlined" className={styles.emptyCard}>
              <p>No tienes partidas programadas</p>
              <Button variant="outline" size="small" onClick={() => navigate('/calendar', { state: { openCreateModal: true } })}>
                Programar una
              </Button>
            </Card>
          )}
        </section>

        {/* Actividad reciente */}
        <section className={styles.section}>
          <h2><FiClock /> Actividad Reciente</h2>
          {recentMatches.length > 0 ? (
            <div className={styles.matchList}>
              {recentMatches.map(match => {
                const userResult = match.results?.find(r => r.player?._id === user?._id);
                const isWin = userResult?.placement === 1;
                return (
                  <div key={match._id} className={`${styles.matchItem} ${isWin ? styles.won : ''}`}>
                    <div className={styles.matchResult}>{isWin ? '🥇' : `#${userResult?.placement || '-'}`}</div>
                    <div className={styles.matchInfo}>
                      <span className={styles.matchGame}>{match.game?.name || 'Sin juego'}</span>
                      <span className={styles.matchGroup}>{formatDate(match.playedAt || match.createdAt)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <Card variant="outlined" className={styles.emptyCard}>
              <p>Aún no has jugado partidas</p>
              <Button variant="outline" size="small" onClick={() => navigate('/games')}>
                Explorar juegos
              </Button>
            </Card>
          )}
        </section>
      </div>

      {/* Grupos */}
      {groups.length > 0 && (
        <section className={styles.groupsSection}>
          <h2><GiTeamIdea /> Tus Grupos</h2>
          <div className={styles.groupsGrid}>
            {groups.slice(0, 4).map(g => (
              <div key={g._id} className={styles.groupCard} onClick={() => navigate(`/groups/${g._id}`)}>
                <span className={styles.groupInitial}>{g.name.charAt(0)}</span>
                <div>
                  <span className={styles.groupName}>{g.name}</span>
                  <span className={styles.groupCount}>{g.members?.length || 0} miembros</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Dashboard;
