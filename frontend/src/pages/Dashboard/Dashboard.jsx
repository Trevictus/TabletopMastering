import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useGroup } from '../../context/GroupContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { GiPerspectiveDiceSixFacesRandom, GiDiceFire, GiTrophy, GiTeamIdea } from 'react-icons/gi';
import { FiPlus, FiAward, FiCalendar, FiClock } from 'react-icons/fi';
import Button from '../../components/common/Button';
import matchService from '../../services/matchService';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const { user } = useAuth();
  const { groups, loadGroups } = useGroup();
  const location = useLocation();
  const navigate = useNavigate();
  const [toast, setToast] = useState('');
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [recentMatches, setRecentMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadGroups(); }, [loadGroups]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await matchService.getAllUserMatches({ limit: 10 });
        const matches = res.data || [];
        const now = new Date();
        setUpcomingMatches(matches.filter(m => m.status === 'pending' && new Date(m.scheduledDate) >= now).slice(0, 3));
        setRecentMatches(matches.filter(m => m.status === 'completed').slice(0, 3));
      } catch {
        // Error silencioso
      } finally { setLoading(false); }
    };
    load();
  }, []);

  useEffect(() => {
    if (location.state?.message) {
      setToast(location.state.message);
      setTimeout(() => setToast(''), 4000);
    }
  }, [location]);

  const stats = {
    matches: user?.stats?.totalMatches || 0,
    wins: user?.stats?.totalWins || 0,
    groups: groups.length
  };
  const winRate = stats.matches > 0 ? Math.round((stats.wins / stats.matches) * 100) : 0;

  return (
    <div className={styles.page}>
      {toast && <div className={styles.toast}>{toast}</div>}

      {/* Hero */}
      <section className={styles.hero}>
        <GiPerspectiveDiceSixFacesRandom className={styles.heroIcon} />
        <div>
          <h1>Bienvenido/a, {user?.name?.split(' ')[0]}</h1>
          <p>Gestiona tus partidas, grupos y estadísticas desde aquí</p>
        </div>
      </section>

      {/* Stats Bar */}
      <section className={styles.statsBar}>
        <div className={styles.statsLeft}>
          <div className={styles.stat}>
            <GiDiceFire style={{ color: '#8b4513' }} />
            <span>{stats.matches}</span>
            <small>Partidas</small>
          </div>
          <div className={styles.stat}>
            <GiTrophy style={{ color: '#10b981' }} />
            <span>{stats.wins}</span>
            <small>Victorias</small>
          </div>
          <div className={styles.stat}>
            <FiAward style={{ color: '#f59e0b' }} />
            <span>{winRate}%</span>
            <small>Win Rate</small>
          </div>
          <div className={styles.stat}>
            <GiTeamIdea style={{ color: '#8b5cf6' }} />
            <span>{stats.groups}</span>
            <small>Grupos</small>
          </div>
        </div>
        <Button onClick={() => navigate('/calendar', { state: { openCreateModal: true } })}>
          <FiPlus /> Nueva Partida
        </Button>
      </section>

      {/* Content */}
      <div className={styles.content}>
        <section className={styles.section}>
          <h2><FiCalendar /> Próximas Partidas</h2>
          <div className={styles.sectionContent}>
            {loading ? (
              <p className={styles.loading}>Cargando...</p>
            ) : upcomingMatches.length > 0 ? (
              <ul className={styles.matchList}>
                {upcomingMatches.map(m => (
                  <li key={m._id} onClick={() => navigate('/calendar')}>
                    <strong>{m.game?.name || 'Partida'}</strong>
                    <span>{new Date(m.scheduledDate).toLocaleDateString('es-ES')}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className={styles.empty}>
                <p>No tienes partidas programadas</p>
                <Button variant="outline" size="small" onClick={() => navigate('/calendar', { state: { openCreateModal: true } })}>
                  Programar una
                </Button>
              </div>
            )}
          </div>
        </section>

        <section className={styles.section}>
          <h2><FiClock /> Actividad Reciente</h2>
          <div className={styles.sectionContent}>
            {loading ? (
              <p className={styles.loading}>Cargando...</p>
            ) : recentMatches.length > 0 ? (
              <ul className={styles.matchList}>
                {recentMatches.map(m => (
                  <li key={m._id} onClick={() => navigate('/history')}>
                    <strong>{m.game?.name || 'Partida'}</strong>
                    <span>{new Date(m.playedAt || m.createdAt).toLocaleDateString('es-ES')}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div className={styles.empty}>
                <p>Aún no has jugado partidas</p>
                <Button variant="outline" size="small" onClick={() => navigate('/games')}>
                  Explorar juegos
                </Button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
