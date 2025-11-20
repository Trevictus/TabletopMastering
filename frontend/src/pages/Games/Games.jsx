import { useState, useEffect, useCallback } from 'react';
import { 
  MdAdd, 
  MdSearch, 
  MdFilterList,
  MdRefresh,
  MdArrowBack,
  MdArrowForward
} from 'react-icons/md';
import { GiDiceFire, GiCardPlay } from 'react-icons/gi';
import { useAuth } from '../../context/AuthContext';
import { useGroup } from '../../context/GroupContext';
import GameCard from '../../components/games/GameCard';
import AddGameModal from '../../components/games/AddGameModal';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import gameService from '../../services/gameService';
import styles from './Games.module.css';

/**
 * Página de gestión de juegos
 * Lista todos los juegos del grupo con filtros, búsqueda y paginación
 */
const Games = () => {
  const { user } = useAuth();
  const { selectedGroup, groups, loadGroups, selectGroup } = useGroup();
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  // Filtros y búsqueda
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalGames, setTotalGames] = useState(0);

  // Cargar grupos al montar (solo si no hay grupos cargados)
  useEffect(() => {
    if (groups.length === 0) {
      loadGroups();
    }
  }, []); // Sin dependencias - solo se ejecuta al montar

  // Cargar juegos (memoizado)
  const loadGames = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const params = {
        page: currentPage,
        limit: 12,
        search: searchTerm || undefined,
        source: sourceFilter !== 'all' ? sourceFilter : undefined,
        groupId: selectedGroup?._id || undefined // undefined = juegos personales
      };

      const response = await gameService.getGames(params);
      setGames(response.data || []);
      setTotalPages(response.pages || 1);
      setTotalGames(response.total || 0);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar los juegos');
    } finally {
      setLoading(false);
    }
  }, [selectedGroup, currentPage, sourceFilter, searchTerm]);

  // Cargar juegos siempre (con o sin grupo)
  useEffect(() => {
    loadGames();
  }, [selectedGroup, currentPage, sourceFilter]);

  // Búsqueda con debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (currentPage === 1) {
        loadGames();
      } else {
        setCurrentPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm, currentPage, loadGames]);

  // Handlers
  const handleGameAdded = (newGame) => {
    setGames(prev => [newGame, ...prev]);
    setTotalGames(prev => prev + 1);
  };

  const handleDelete = async (game) => {
    if (!window.confirm(`¿Estás seguro de que quieres eliminar "${game.name}"?`)) {
      return;
    }

    try {
      await gameService.deleteGame(game._id);
      setGames(prev => prev.filter(g => g._id !== game._id));
      setTotalGames(prev => prev - 1);
    } catch (err) {
      alert(err.response?.data?.message || 'Error al eliminar el juego');
    }
  };

  const handleSync = async (game) => {
    try {
      const response = await gameService.syncWithBGG(game._id);
      setGames(prev => prev.map(g => g._id === game._id ? response.data : g));
      alert('Juego sincronizado con BoardGameGeek');
    } catch (err) {
      alert(err.response?.data?.message || 'Error al sincronizar el juego');
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSourceFilter('all');
    setCurrentPage(1);
  };

  // Verificar permisos
  const canDelete = (game) => {
    if (!selectedGroup) return false;
    const userMember = selectedGroup.members?.find(m => m.user === user?._id);
    return userMember?.role === 'admin' || game.addedBy?._id === user?._id;
  };

  return (
    <div className={styles.gamesPage}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerTitle}>
            <GiCardPlay className={styles.headerIcon} />
            <div>
              <h1>Catálogo de Juegos</h1>
              <p className={styles.subtitle}>
                {selectedGroup ? (
                  <>Grupo: <strong>{selectedGroup.name}</strong> - {totalGames} {totalGames === 1 ? 'juego' : 'juegos'}</>
                ) : (
                  <>Mis Juegos Personales - {totalGames} {totalGames === 1 ? 'juego' : 'juegos'}</>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Botón añadir juego siempre visible */}
      <div className={styles.actionsBar}>
        <Button
          variant="primary"
          onClick={() => setShowAddModal(true)}
          className={styles.addButton}
        >
          <MdAdd /> Añadir Juego
        </Button>
      </div>

      {/* Selector de grupo */}
      {!loading && groups.length > 0 && (
        <Card variant="elevated" className={styles.groupSelector}>
          <div className={styles.groupSelectorHeader}>
            <h3>Cambiar Vista</h3>
          </div>
          <div className={styles.groupList}>
            <Button
              variant={!selectedGroup ? 'primary' : 'outline'}
              fullWidth
              onClick={() => selectGroup(null)}
            >
              📚 Mis Juegos Personales
              {!selectedGroup && ' ✓'}
            </Button>
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
            💡 <strong>Tip:</strong> Puedes crear grupos para compartir juegos con otros usuarios.
          </p>
          <Button
            variant="outline"
            size="small"
            onClick={() => window.location.href = '/groups'}
          >
            Crear o Unirse a Grupos
          </Button>
        </Card>
      )}

      {/* Filtros y búsqueda */}
      <Card variant="elevated" className={styles.filtersCard}>
          <div className={styles.searchBar}>
            <Input
              name="search"
              type="text"
              placeholder="Buscar juegos por nombre, categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<MdSearch />}
              className={styles.searchInput}
            />
            
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={styles.filterButton}
            >
              <MdFilterList />
              {showFilters ? 'Ocultar' : 'Filtros'}
            </Button>
          </div>

          {showFilters && (
            <div className={styles.filters}>
              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Fuente:</label>
                <div className={styles.filterButtons}>
                  <Button
                    variant={sourceFilter === 'all' ? 'primary' : 'outline'}
                    size="small"
                    onClick={() => setSourceFilter('all')}
                  >
                    Todos
                  </Button>
                  <Button
                    variant={sourceFilter === 'bgg' ? 'primary' : 'outline'}
                    size="small"
                    onClick={() => setSourceFilter('bgg')}
                  >
                    <GiDiceFire /> BGG
                  </Button>
                  <Button
                    variant={sourceFilter === 'custom' ? 'primary' : 'outline'}
                    size="small"
                    onClick={() => setSourceFilter('custom')}
                  >
                    Personalizados
                  </Button>
                </div>
              </div>

              <Button
                variant="outline"
                size="small"
                onClick={clearFilters}
                className={styles.clearButton}
              >
                <MdRefresh /> Limpiar
              </Button>
            </div>
          )}
      </Card>

      {/* Mensajes de error */}
      {error && (
        <div className={styles.error}>
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Loading */}
      {loading && <Loading message="Cargando juegos..." />}

      {/* Grid de juegos */}
      {!loading && games.length > 0 && (
        <>
          <div className={styles.gamesGrid}>
            {games.map((game) => (
              <GameCard
                key={game._id}
                game={game}
                onDelete={handleDelete}
                onSync={handleSync}
                canDelete={canDelete(game)}
              />
            ))}
          </div>

          {/* Paginación */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <Button
                variant="outline"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                <MdArrowBack /> Anterior
              </Button>

              <div className={styles.pageInfo}>
                Página {currentPage} de {totalPages}
              </div>

              <Button
                variant="outline"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
              >
                Siguiente <MdArrowForward />
              </Button>
            </div>
          )}
        </>
      )}

      {/* Empty state */}
      {!loading && games.length === 0 && (
        <Card variant="elevated" className={styles.emptyState}>
          <GiCardPlay className={styles.emptyIcon} />
          <h2 className={styles.emptyTitle}>
            {searchTerm || sourceFilter !== 'all'
              ? 'No se encontraron juegos'
              : 'No hay juegos en el catálogo'}
          </h2>
          <p className={styles.emptyDescription}>
            {searchTerm || sourceFilter !== 'all'
              ? 'Intenta con otros términos de búsqueda o limpia los filtros'
              : selectedGroup 
                ? 'Comienza añadiendo tu primer juego al grupo'
                : 'Añade tu primer juego a tu colección personal'}
          </p>
          {!searchTerm && sourceFilter === 'all' && (
            <Button
              variant="primary"
              onClick={() => setShowAddModal(true)}
              className={styles.emptyButton}
            >
              <MdAdd /> Añadir Primer Juego
            </Button>
          )}
        </Card>
      )}

      {/* Modal de añadir juego */}
      <AddGameModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onGameAdded={handleGameAdded}
        groupId={selectedGroup?._id || null}
      />
    </div>
  );
};

export default Games;
