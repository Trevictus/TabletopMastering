import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { GiScrollUnfurled, GiTrophy, GiSandsOfTime } from 'react-icons/gi';
import { FiCalendar, FiUsers } from 'react-icons/fi';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import matchService from '../../services/matchService';
import styles from './History.module.css';

/**
 * Página History - Historial de partidas jugadas
 * Muestra todas las partidas completadas del usuario con detalles
 */
const History = () => {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, won, lost
  const [sortBy, setSortBy] = useState('date'); // date, game

  useEffect(() => {
    const loadMatches = async () => {
      try {
        setLoading(true);
        const response = await matchService.getMatches({ 
          status: 'completed',
          limit: 100 
        });
        
        // Ordenar por fecha (más recientes primero)
        const sortedMatches = (response.data || []).sort((a, b) => 
          new Date(b.playedAt || b.createdAt) - new Date(a.playedAt || a.createdAt)
        );
        
        setMatches(sortedMatches);
      } catch (error) {
        console.error('Error loading matches:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadMatches();
    }
  }, [user]);

  // Filtrar partidas
  const filteredMatches = matches.filter(match => {
    if (filter === 'all') return true;
    
    const userResult = match.results?.find(r => r.player?._id === user?._id);
    if (filter === 'won') return userResult?.placement === 1;
    if (filter === 'lost') return userResult?.placement !== 1;
    
    return true;
  });

  // Ordenar partidas
  const sortedMatches = [...filteredMatches].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.playedAt || b.createdAt) - new Date(a.playedAt || a.createdAt);
    } else if (sortBy === 'game') {
      return (a.game?.name || '').localeCompare(b.game?.name || '');
    }
    return 0;
  });

  // Calcular estadísticas
  const stats = {
    total: matches.length,
    wins: matches.filter(m => m.results?.find(r => r.player?._id === user?._id)?.placement === 1).length,
    losses: matches.filter(m => m.results?.find(r => r.player?._id === user?._id)?.placement !== 1).length,
  };

  if (loading) {
    return <Loading message="Cargando historial..." />;
  }

  return (
    <div className={styles.historyPage}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerTitle}>
            <GiScrollUnfurled className={styles.headerIcon} />
            <div>
              <h1>Historial de Partidas</h1>
              <p className={styles.subtitle}>
                Revisa todas tus partidas completadas
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className={styles.statsGrid}>
        <Card variant="outlined" className={styles.statCard}>
          <div className={styles.statIcon}>
            <GiScrollUnfurled />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Total Partidas</span>
            <span className={styles.statValue}>{stats.total}</span>
          </div>
        </Card>
        
        <Card variant="outlined" className={styles.statCard}>
          <div className={styles.statIcon} style={{ color: '#10b981' }}>
            <GiTrophy />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Victorias</span>
            <span className={styles.statValue}>{stats.wins}</span>
          </div>
        </Card>
        
        <Card variant="outlined" className={styles.statCard}>
          <div className={styles.statIcon} style={{ color: '#ef4444' }}>
            <GiSandsOfTime />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Derrotas</span>
            <span className={styles.statValue}>{stats.losses}</span>
          </div>
        </Card>

        <Card variant="outlined" className={styles.statCard}>
          <div className={styles.statIcon} style={{ color: '#d4af37' }}>
            <GiTrophy />
          </div>
          <div className={styles.statContent}>
            <span className={styles.statLabel}>Win Rate</span>
            <span className={styles.statValue}>
              {stats.total > 0 ? Math.round((stats.wins / stats.total) * 100) : 0}%
            </span>
          </div>
        </Card>
      </div>

      {/* Filters and Sort */}
      <Card variant="elevated" className={styles.controlsCard}>
        <div className={styles.controls}>
          <div className={styles.filterGroup}>
            <label>Filtrar:</label>
            <div className={styles.filterButtons}>
              <button
                className={`${styles.filterBtn} ${filter === 'all' ? styles.active : ''}`}
                onClick={() => setFilter('all')}
              >
                Todas ({matches.length})
              </button>
              <button
                className={`${styles.filterBtn} ${filter === 'won' ? styles.active : ''}`}
                onClick={() => setFilter('won')}
              >
                Ganadas ({stats.wins})
              </button>
              <button
                className={`${styles.filterBtn} ${filter === 'lost' ? styles.active : ''}`}
                onClick={() => setFilter('lost')}
              >
                Perdidas ({stats.losses})
              </button>
            </div>
          </div>

          <div className={styles.sortGroup}>
            <label>Ordenar por:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className={styles.sortSelect}
            >
              <option value="date">Fecha</option>
              <option value="game">Juego</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Matches List */}
      <div className={styles.matchesList}>
        {sortedMatches.length === 0 ? (
          <Card variant="elevated" className={styles.emptyState}>
            <GiScrollUnfurled className={styles.emptyIcon} />
            <h3>No hay partidas en el historial</h3>
            <p>Las partidas completadas aparecerán aquí</p>
          </Card>
        ) : (
          sortedMatches.map((match) => {
            const userResult = match.results?.find(r => r.player?._id === user?._id);
            const isWinner = userResult?.placement === 1;

            return (
              <Card 
                key={match._id} 
                variant="elevated" 
                className={`${styles.matchCard} ${isWinner ? styles.won : ''}`}
              >
                <div className={styles.matchHeader}>
                  <div className={styles.gameInfo}>
                    <h3 className={styles.gameName}>{match.game?.name || 'Juego desconocido'}</h3>
                    <div className={styles.matchMeta}>
                      <span className={styles.metaItem}>
                        <FiCalendar />
                        {new Date(match.playedAt || match.createdAt).toLocaleDateString('es-ES', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                      <span className={styles.metaItem}>
                        <FiUsers />
                        {match.results?.length || 0} jugadores
                      </span>
                      {match.duration && (
                        <span className={styles.metaItem}>
                          <GiSandsOfTime />
                          {match.duration} min
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {isWinner && (
                    <div className={styles.winBadge}>
                      <GiTrophy />
                      Victoria
                    </div>
                  )}
                </div>

                <div className={styles.matchDetails}>
                  <div className={styles.resultSection}>
                    <h4>Resultados:</h4>
                    <div className={styles.playersList}>
                      {match.results?.sort((a, b) => (a.placement || 999) - (b.placement || 999)).map((result, index) => (
                        <div 
                          key={index} 
                          className={`${styles.playerResult} ${result.player?._id === user?._id ? styles.currentUser : ''}`}
                        >
                          <span className={styles.placement}>
                            {result.placement === 1 && '🥇'}
                            {result.placement === 2 && '🥈'}
                            {result.placement === 3 && '🥉'}
                            {result.placement > 3 && `${result.placement}º`}
                          </span>
                          <span className={styles.playerName}>
                            {result.player?.name || 'Jugador'}
                            {result.player?._id === user?._id && ' (Tú)'}
                          </span>
                          {result.points !== undefined && (
                            <span className={styles.points}>{result.points} pts</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {match.group && (
                    <div className={styles.groupBadge}>
                      Grupo: {match.group.name}
                    </div>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
};

export default History;
