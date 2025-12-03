import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MdRefresh } from 'react-icons/md';
import { GiTrophy, GiPodium } from 'react-icons/gi';
import { useAuth } from '../../context/AuthContext';
import { useGroup } from '../../context/GroupContext';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import rankingService from '../../services/rankingService';
import { isValidAvatar } from '../../utils/validators';
import styles from './Rankings.module.css';

/**
 * Página de Rankings - Global y por grupo
 */
const Rankings = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { groups, loadGroups } = useGroup();
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState(searchParams.get('group') || null);
  const [sortBy, setSortBy] = useState('points');

  // Cargar grupos al montar
  useEffect(() => {
    if (groups.length === 0) loadGroups();
  }, [groups.length, loadGroups]);

  // Cargar ranking
  const loadRanking = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      let response;
      if (selectedGroupId) {
        response = await rankingService.getGroupRanking(selectedGroupId);
        const data = response.data?.ranking || response.data || [];
        setRanking(data.map(item => ({
          id: item.user?._id || item.userId,
          name: item.user?.name || item.name,
          avatar: item.user?.avatar || item.avatar,
          totalPoints: item.totalPoints || 0,
          totalWins: item.totalWins || 0,
          totalMatches: item.totalMatches || 0,
        })));
      } else {
        response = await rankingService.getGlobalRanking();
        const data = response.data || [];
        setRanking(data.map(item => ({
          id: item.userId || item._id,
          name: item.name,
          avatar: item.avatar,
          totalPoints: item.totalPoints || 0,
          totalWins: item.totalWins || 0,
          totalMatches: item.totalMatches || 0,
        })));
      }
    } catch {
      setError('Error al cargar el ranking');
      setRanking([]);
    } finally {
      setLoading(false);
    }
  }, [selectedGroupId]);

  useEffect(() => { loadRanking(); }, [loadRanking]);

  // Ordenar ranking
  const sortedRanking = useMemo(() => {
    const sorted = [...ranking];
    if (sortBy === 'points') sorted.sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));
    else if (sortBy === 'wins') sorted.sort((a, b) => (b.totalWins || 0) - (a.totalWins || 0));
    return sorted;
  }, [ranking, sortBy]);

  // Info de vista actual
  const groupName = selectedGroupId 
    ? groups.find(g => g._id === selectedGroupId)?.name || 'Grupo'
    : 'Global';

  return (
    <div className={styles.rankingsPage}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerTitle}>
          <GiTrophy className={styles.headerIcon} />
          <div>
            <h1>Ranking {groupName}</h1>
            <p className={styles.subtitle}>{sortedRanking.length} jugadores</p>
          </div>
        </div>
        <Button variant="outline" size="small" onClick={loadRanking} disabled={loading}>
          <MdRefresh className={loading ? styles.spinning : ''} />
        </Button>
      </div>

      {/* Nav de grupos */}
      <div className={styles.groupNav}>
        <button
          className={`${styles.navBtn} ${!selectedGroupId ? styles.active : ''}`}
          onClick={() => setSelectedGroupId(null)}
        >
          Global
        </button>
        {groups.map(g => (
          <button
            key={g._id}
            className={`${styles.navBtn} ${selectedGroupId === g._id ? styles.active : ''}`}
            onClick={() => setSelectedGroupId(g._id)}
          >
            {g.name}
          </button>
        ))}
      </div>      {/* Ordenación */}
      <div className={styles.sortBar}>
        <span>Ordenar:</span>
        <Button variant={sortBy === 'points' ? 'primary' : 'outline'} size="small" onClick={() => setSortBy('points')}>
          Puntos
        </Button>
        <Button variant={sortBy === 'wins' ? 'primary' : 'outline'} size="small" onClick={() => setSortBy('wins')}>
          Victorias
        </Button>
      </div>

      {error && <div className={styles.error}>⚠️ {error}</div>}

      {/* Tabla */}
      <Card variant="elevated" className={styles.tableCard}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th>
              <th>Jugador</th>
              <th>Puntos</th>
              <th>Victorias</th>
              <th>Partidas</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i} className={styles.skeleton}>
                  <td><div className={styles.skelBox} /></td>
                  <td><div className={styles.skelPlayer}><div className={styles.skelAvatar} /><div className={styles.skelName} /></div></td>
                  <td><div className={styles.skelBox} /></td>
                  <td><div className={styles.skelBox} /></td>
                  <td><div className={styles.skelBox} /></td>
                </tr>
              ))
            ) : sortedRanking.length > 0 ? (
              sortedRanking.map((p, i) => {
                const isMe = p.id && user?._id && String(p.id) === String(user._id);
                const pos = i + 1;
                return (
                  <tr key={p.id || i} className={`${isMe ? styles.me : ''} ${pos <= 3 ? styles[`top${pos}`] : ''}`}>
                    <td className={styles.pos}>
                      {pos <= 3 ? <span className={styles[`medal${pos}`]}>{pos}</span> : `#${pos}`}
                    </td>
                    <td>
                      <div className={styles.player}>
                        <div className={styles.avatar}>
                          {isValidAvatar(p.avatar) ? (
                            <img src={p.avatar} alt="" />
                          ) : (
                            <span>{p.name?.charAt(0).toUpperCase() || '?'}</span>
                          )}
                        </div>
                        <span className={styles.name}>{p.name}</span>
                        {isMe && <span className={styles.badge}>Tú</span>}
                      </div>
                    </td>
                    <td className={styles.points}>{p.totalPoints || 0}</td>
                    <td className={styles.wins}>{p.totalWins || 0}</td>
                    <td>{p.totalMatches || 0}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={5} className={styles.empty}>
                  <GiPodium className={styles.emptyIcon} />
                  <p>No hay datos de ranking</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default Rankings;
