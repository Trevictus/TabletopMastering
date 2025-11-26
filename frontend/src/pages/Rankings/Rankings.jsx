import { useState, useEffect, useCallback } from 'react';
import { MdFilterList, MdRefresh } from 'react-icons/md';
import { GiTrophy } from 'react-icons/gi';
import { useAuth } from '../../context/AuthContext';
import { useGroup } from '../../context/GroupContext';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import rankingService from '../../services/rankingService';
import styles from './Rankings.module.css';

/**
 * Página de Rankings
 * Muestra ranking general de TODOS los grupos combinados
 */
const Rankings = () => {
  const { user } = useAuth();
  const { groups, loadGroups } = useGroup();
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('points'); // 'points' o 'wins'

  // Cargar grupos al montar
  useEffect(() => {
    loadGroups();
  }, [loadGroups]);

  // Cargar ranking general (memoizado)
  const loadGeneralRanking = useCallback(async () => {
    if (!groups || groups.length === 0) {
      setRanking([]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Cargar rankings de todos los grupos
      const allRankingsPromises = groups.map(group => 
        rankingService.getGroupRanking(group._id, { sortBy })
          .catch(err => {
            console.error(`Error loading ranking for group ${group._id}:`, err);
            return { data: [] };
          })
      );

      const allRankingsResponses = await Promise.all(allRankingsPromises);
      
      // Combinar todos los rankings
      const playerMap = new Map();
      
      allRankingsResponses.forEach(response => {
        const rankingData = Array.isArray(response.data) ? response.data : response.data?.ranking || [];
        
        rankingData.forEach(playerData => {
          const userId = playerData.user._id;
          
          if (playerMap.has(userId)) {
            // Sumar estadísticas si el jugador ya existe
            const existing = playerMap.get(userId);
            existing.totalPoints = (existing.totalPoints || 0) + (playerData.totalPoints || 0);
            existing.totalWins = (existing.totalWins || 0) + (playerData.totalWins || 0);
            existing.totalMatches = (existing.totalMatches || 0) + (playerData.totalMatches || 0);
          } else {
            // Agregar nuevo jugador
            playerMap.set(userId, {
              user: playerData.user,
              totalPoints: playerData.totalPoints || 0,
              totalWins: playerData.totalWins || 0,
              totalMatches: playerData.totalMatches || 0
            });
          }
        });
      });

      // Convertir a array y ordenar
      let rankingArray = Array.from(playerMap.values());
      
      if (sortBy === 'points') {
        rankingArray.sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));
      } else {
        rankingArray.sort((a, b) => (b.totalWins || 0) - (a.totalWins || 0));
      }

      setRanking(rankingArray);
    } catch (err) {
      console.error('Error cargando ranking general:', err);
      setError('Error al cargar el ranking general');
      setRanking([]);
    } finally {
      setLoading(false);
    }
  }, [groups, sortBy]);

  // Cargar ranking cuando cambian los grupos o el filtro
  useEffect(() => {
    loadGeneralRanking();
  }, [groups, sortBy, loadGeneralRanking]);

  // Handlers
  const handleRefresh = () => {
    loadGeneralRanking();
  };

  return (
    <div className={styles.rankingsPage}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerTitle}>
            <GiTrophy className={styles.headerIcon} />
            <div>
              <h1>Ranking General</h1>
              <p className={styles.subtitle}>
                {ranking.length} {ranking.length === 1 ? 'jugador' : 'jugadores'} en total
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Loading inicial */}
      {loading && groups.length === 0 && (
        <Card variant="elevated" className={styles.loadingCard}>
          <Loading message="Cargando ranking..." />
        </Card>
      )}

      {/* No hay grupos */}
      {!loading && groups.length === 0 && (
        <Card variant="elevated" className={styles.infoCard}>
          <p className={styles.infoText}>
            💡 <strong>Tip:</strong> Únete a un grupo para aparecer en el ranking.
          </p>
          <Button
            variant="outline"
            size="small"
            onClick={() => window.location.href = '/groups'}
          >
            Ir a Grupos
          </Button>
        </Card>
      )}

      {/* Mostrar contenido si hay grupos */}
      {groups.length > 0 && (
        <>
          {/* Botones de control rápido */}
          <div className={styles.controlBar}>
            <div className={styles.sortButtons}>
              <Button
                variant={sortBy === 'points' ? 'primary' : 'outline'}
                size="small"
                onClick={() => setSortBy('points')}
              >
                Puntos
              </Button>
              <Button
                variant={sortBy === 'wins' ? 'primary' : 'outline'}
                size="small"
                onClick={() => setSortBy('wins')}
              >
                Victorias
              </Button>
            </div>
            <Button
              variant="outline"
              size="small"
              onClick={handleRefresh}
            >
              <MdRefresh /> Actualizar
            </Button>
          </div>

          {/* Mensajes de error */}
          {error && (
            <div className={styles.error}>
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Loading */}
          {loading && <Loading message="Cargando ranking..." />}

          {/* Tabla de ranking */}
          {!loading && ranking.length > 0 && (
            <Card variant="elevated" className={styles.rankingCard}>
              <table className={styles.rankingTable}>
                <thead>
                  <tr>
                    <th className={styles.positionCol}>Posición</th>
                    <th className={styles.playerCol}>Jugador</th>
                    <th className={styles.pointsCol}>Puntos</th>
                    <th className={styles.winsCol}>Victorias</th>
                    <th className={styles.matchesCol}>Partidas</th>
                  </tr>
                </thead>
                <tbody>
                  {ranking.map((player, index) => (
                    <tr
                      key={player.user._id}
                      className={`${styles.tableRow} ${
                        player.user._id === user?._id ? styles.currentUser : ''
                      }`}
                    >
                      <td className={styles.positionCell}>
                        <div className={styles.position}>
                          {index === 0 && <span className={styles.medal}>🥇</span>}
                          {index === 1 && <span className={styles.medal}>🥈</span>}
                          {index === 2 && <span className={styles.medal}>🥉</span>}
                          {index > 2 && <span className={styles.positionNumber}>#{index + 1}</span>}
                        </div>
                      </td>
                      <td className={styles.playerCell}>
                        <div className={styles.playerInfo}>
                          <div className={styles.avatar}>
                            {player.user.avatar ? (
                              <img src={player.user.avatar} alt={player.user.name} />
                            ) : (
                              <div className={styles.avatarPlaceholder}>
                                {player.user.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div className={styles.playerDetails}>
                            <span className={styles.playerName}>{player.user.name}</span>
                            {player.user._id === user?._id && (
                              <span className={styles.youBadge}>(Tú)</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className={styles.pointsCell}>
                        <span className={styles.points}>{player.totalPoints || 0}</span>
                      </td>
                      <td className={styles.winsCell}>
                        <span className={styles.wins}>{player.totalWins || 0}</span>
                      </td>
                      <td className={styles.matchesCell}>
                        <span className={styles.matches}>{player.totalMatches || 0}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          )}

          {/* Empty state */}
          {!loading && ranking.length === 0 && (
            <Card variant="elevated" className={styles.emptyState}>
              <GiTrophy className={styles.emptyIcon} />
              <h2 className={styles.emptyTitle}>No hay datos de ranking</h2>
              <p className={styles.emptyDescription}>
                Aún no hay partidas registradas en tus grupos. Comienza a registrar partidas para ver el ranking.
              </p>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default Rankings;
