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
 * Muestra tabla de ranking del grupo con avatares, nombres, puntos, posición y filtros
 */
const Rankings = () => {
  const { user } = useAuth();
  const { selectedGroup, groups, loadGroups, selectGroup } = useGroup();
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  // Filtros
  const [sortBy, setSortBy] = useState('points'); // 'points' o 'wins'

  // Cargar grupos al montar
  useEffect(() => {
    if (groups.length === 0) {
      loadGroups();
    }
  }, []);

  // Cargar ranking (memoizado)
  const loadRanking = useCallback(async () => {
    if (!selectedGroup) {
      setRanking([]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await rankingService.getGroupRanking(selectedGroup._id, {
        sortBy: sortBy,
      });
      setRanking(response.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar el ranking');
      setRanking([]);
    } finally {
      setLoading(false);
    }
  }, [selectedGroup, sortBy]);

  // Cargar ranking cuando cambia grupo o filtro
  useEffect(() => {
    loadRanking();
  }, [selectedGroup, sortBy, loadRanking]);

  // Handlers
  const handleRefresh = () => {
    loadRanking();
  };

  const clearFilters = () => {
    setSortBy('points');
  };

  return (
    <div className={styles.rankingsPage}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerTitle}>
            <GiTrophy className={styles.headerIcon} />
            <div>
              <h1>Rankings</h1>
              <p className={styles.subtitle}>
                {selectedGroup ? (
                  <>Grupo: <strong>{selectedGroup.name}</strong> - {ranking.length} {ranking.length === 1 ? 'jugador' : 'jugadores'}</>
                ) : (
                  <>Selecciona un grupo para ver el ranking</>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Selector de grupo */}
      {!loading && groups.length > 0 && (
        <Card variant="elevated" className={styles.groupSelector}>
          <div className={styles.groupSelectorHeader}>
            <h3>Cambiar Grupo</h3>
          </div>
          <div className={styles.groupList}>
            {groups.map(group => (
              <Button
                key={group._id}
                variant={selectedGroup?._id === group._id ? 'primary' : 'outline'}
                fullWidth
                onClick={() => selectGroup(group)}
              >
                👥 {group.name}
                {selectedGroup?._id === group._id && ' ✓'}
              </Button>
            ))}
          </div>
        </Card>
      )}

      {/* Loading inicial */}
      {!selectedGroup && loading && (
        <Card variant="elevated" className={styles.loadingCard}>
          <Loading message="Cargando grupos..." />
        </Card>
      )}

      {/* No hay grupos */}
      {!loading && groups.length === 0 && (
        <Card variant="elevated" className={styles.infoCard}>
          <p className={styles.infoText}>
            💡 <strong>Tip:</strong> Únete a un grupo para ver los rankings.
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

      {/* Mostrar contenido solo si hay grupo seleccionado */}
      {selectedGroup && (
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
                Aún no hay partidas registradas en este grupo. Comienza a registrar partidas para ver el ranking.
              </p>
            </Card>
          )}
        </>
      )}
    </div>
  );
};

export default Rankings;
