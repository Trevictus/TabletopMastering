import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GiScrollUnfurled, GiTrophy } from 'react-icons/gi';
import { FiCalendar, FiUsers, FiClock } from 'react-icons/fi';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import matchService from '../../services/matchService';
import styles from './History.module.css';

const History = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      try {
        const response = await matchService.getMatches({ status: 'completed', limit: 100 });
        const sorted = (response.data || []).sort((a, b) => 
          new Date(b.playedAt || b.createdAt) - new Date(a.playedAt || a.createdAt)
        );
        setMatches(sorted);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user]);

  const { stats, filtered } = useMemo(() => {
    const wins = matches.filter(m => m.results?.find(r => r.player?._id === user?._id)?.placement === 1).length;
    const stats = { total: matches.length, wins, losses: matches.length - wins };
    
    let filtered = matches;
    if (filter === 'won') filtered = matches.filter(m => m.results?.find(r => r.player?._id === user?._id)?.placement === 1);
    if (filter === 'lost') filtered = matches.filter(m => m.results?.find(r => r.player?._id === user?._id)?.placement !== 1);
    
    return { stats, filtered };
  }, [matches, filter, user]);

  if (loading) return <Loading message="Cargando historial..." />;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <GiScrollUnfurled className={styles.icon} />
        <div>
          <h1>Historial de Partidas</h1>
          <p>Revisa todas tus partidas completadas</p>
        </div>
      </header>

      <div className={styles.stats}>
        <StatCard label="Partidas" value={stats.total} />
        <StatCard label="Victorias" value={stats.wins} color="#10b981" />
        <StatCard label="Derrotas" value={stats.losses} color="#ef4444" />
        <StatCard label="Win Rate" value={`${stats.total ? Math.round((stats.wins / stats.total) * 100) : 0}%`} color="#d4af37" />
      </div>

      <div className={styles.filters}>
        {['all', 'won', 'lost'].map(f => (
          <button
            key={f}
            className={`${styles.filterBtn} ${filter === f ? styles.active : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? `Todas (${stats.total})` : f === 'won' ? `Ganadas (${stats.wins})` : `Perdidas (${stats.losses})`}
          </button>
        ))}
      </div>

      <div className={styles.list}>
        {filtered.length === 0 ? (
          <Card variant="elevated" className={styles.empty}>
            <GiScrollUnfurled />
            <h3>No hay partidas</h3>
            <p>Las partidas completadas aparecerán aquí</p>
          </Card>
        ) : (
          filtered.map(match => <MatchCard key={match._id} match={match} userId={user?._id} />)
        )}
      </div>
    </div>
  );
};

const StatCard = ({ label, value, color }) => (
  <Card variant="outlined" className={styles.stat}>
    <span className={styles.statLabel}>{label}</span>
    <span className={styles.statValue} style={color ? { color } : undefined}>{value}</span>
  </Card>
);

const MatchCard = ({ match, userId }) => {
  const userResult = match.results?.find(r => r.player?._id === userId);
  const isWinner = userResult?.placement === 1;
  const date = new Date(match.playedAt || match.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <Card variant="elevated" className={`${styles.match} ${isWinner ? styles.won : ''}`}>
      <div className={styles.matchHeader}>
        <div>
          <h3>{match.game?.name || 'Juego desconocido'}</h3>
          <div className={styles.meta}>
            <span><FiCalendar /> {date}</span>
            <span><FiUsers /> {match.results?.length || 0}</span>
            {match.duration && <span><FiClock /> {match.duration}min</span>}
          </div>
        </div>
        {isWinner && <div className={styles.winBadge}><GiTrophy /> Victoria</div>}
      </div>

      <div className={styles.results}>
        {match.results?.sort((a, b) => (a.placement || 99) - (b.placement || 99)).map((r, i) => (
          <div key={i} className={`${styles.result} ${r.player?._id === userId ? styles.me : ''}`}>
            <span className={styles.place}>
              {r.placement === 1 ? '🥇' : r.placement === 2 ? '🥈' : r.placement === 3 ? '🥉' : `${r.placement}º`}
            </span>
            <span className={styles.playerName}>
              {r.player?.name || 'Jugador'}{r.player?._id === userId && ' (Tú)'}
            </span>
            {r.points !== undefined && <span className={styles.pts}>{r.points} pts</span>}
          </div>
        ))}
      </div>

      {match.group && <span className={styles.group}>Grupo: {match.group.name}</span>}
    </Card>
  );
};

export default History;
