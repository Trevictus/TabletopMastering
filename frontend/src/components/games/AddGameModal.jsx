import { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  MdSearch, 
  MdAdd,
  MdPeople,
  MdTimer,
  MdStar,
  MdArrowBack
} from 'react-icons/md';
import { GiDiceFire } from 'react-icons/gi';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import Loading from '../common/Loading';
import gameService from '../../services/gameService';
import styles from './AddGameModal.module.css';

/**
 * Modal para añadir juegos desde BGG o crear uno personalizado
 */
const AddGameModal = ({ isOpen, onClose, onGameAdded, groupId }) => {
  const [mode, setMode] = useState('search'); // 'search', 'preview', 'custom'
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [gamePreview, setGamePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Estado para juego personalizado
  const [customGame, setCustomGame] = useState({
    name: '',
    description: '',
    minPlayers: 1,
    maxPlayers: 4,
    playingTime: 60,
    yearPublished: new Date().getFullYear(),
    image: '',
    categories: '',
    mechanics: ''
  });

  const resetModal = () => {
    setMode('search');
    setSearchQuery('');
    setSearchResults([]);
    setGamePreview(null);
    setError('');
    setCustomGame({
      name: '',
      description: '',
      minPlayers: 1,
      maxPlayers: 4,
      playingTime: 60,
      yearPublished: new Date().getFullYear(),
      image: '',
      categories: '',
      mechanics: ''
    });
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  // Buscar juegos en BGG
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError('');
    setSearchResults([]);

    try {
      const response = await gameService.searchBGG(searchQuery);
      setSearchResults(response.data || []);
      if (response.data?.length === 0) {
        setError('No se encontraron juegos con ese nombre');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al buscar juegos');
    } finally {
      setLoading(false);
    }
  };

  // Ver preview de juego BGG
  const handlePreview = async (game) => {
    setLoading(true);
    setError('');

    try {
      const response = await gameService.getBGGDetails(game.bggId);
      setGamePreview(response.data);
      setMode('preview');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al obtener detalles del juego');
    } finally {
      setLoading(false);
    }
  };

  // Añadir juego desde BGG
  const handleAddFromBGG = async () => {
    if (!gamePreview) return;

    setLoading(true);
    setError('');

    try {
      const response = await gameService.addFromBGG(
        gamePreview.bggId,
        groupId || null,
        ''
      );
      onGameAdded(response.data);
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al añadir juego');
    } finally {
      setLoading(false);
    }
  };

  // Crear juego personalizado
  const handleCreateCustom = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError('');

    try {
      const gameData = {
        ...customGame,
        groupId: groupId || null,
        categories: customGame.categories 
          ? customGame.categories.split(',').map(c => c.trim()) 
          : [],
        mechanics: customGame.mechanics 
          ? customGame.mechanics.split(',').map(m => m.trim()) 
          : []
      };

      const response = await gameService.createCustomGame(gameData);
      onGameAdded(response.data);
      handleClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error al crear juego');
    } finally {
      setLoading(false);
    }
  };

  // Renderizar contenido según modo
  const renderContent = () => {
    if (mode === 'search') {
      return (
        <>
          <div className={styles.modeSelector}>
            <Button
              variant="primary"
              fullWidth
              onClick={() => setMode('search')}
            >
              <GiDiceFire /> Buscar en BoardGameGeek
            </Button>
            <Button
              variant="outline"
              fullWidth
              onClick={() => setMode('custom')}
            >
              <MdAdd /> Crear Juego Personalizado
            </Button>
          </div>

          <form onSubmit={handleSearch} className={styles.searchForm}>
            <Input
              name="search"
              type="text"
              placeholder="Ej: Catan, Wingspan, Terraforming Mars..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              icon={<MdSearch />}
            />
            <Button type="submit" disabled={loading || !searchQuery.trim()}>
              Buscar
            </Button>
          </form>

          {error && <div className={styles.error}>{error}</div>}

          {loading && <Loading message="Buscando juegos..." />}

          {searchResults.length > 0 && (
            <div className={styles.searchResults}>
              <h3 className={styles.resultsTitle}>
                Resultados ({searchResults.length})
              </h3>
              <div className={styles.resultsList}>
                {searchResults.map((game) => (
                  <div
                    key={game.bggId}
                    className={styles.resultItem}
                    onClick={() => handlePreview(game)}
                  >
                    <div className={styles.resultInfo}>
                      <h4>{game.name}</h4>
                      {game.yearPublished && (
                        <span className={styles.year}>({game.yearPublished})</span>
                      )}
                    </div>
                    <Button variant="outline" size="small">
                      Ver detalles
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      );
    }

    if (mode === 'preview' && gamePreview) {
      return (
        <>
          <Button
            variant="outline"
            size="small"
            onClick={() => setMode('search')}
            className={styles.backButton}
          >
            <MdArrowBack /> Volver a resultados
          </Button>

          <div className={styles.preview}>
            {gamePreview.image && (
              <img
                src={gamePreview.image}
                alt={gamePreview.name}
                className={styles.previewImage}
              />
            )}

            <h3 className={styles.previewTitle}>{gamePreview.name}</h3>
            {gamePreview.yearPublished && (
              <p className={styles.previewYear}>({gamePreview.yearPublished})</p>
            )}

            <div className={styles.previewStats}>
              {gamePreview.rating?.average && (
                <div className={styles.previewStat}>
                  <MdStar />
                  <span>{gamePreview.rating.average.toFixed(1)}/10</span>
                </div>
              )}
              <div className={styles.previewStat}>
                <MdPeople />
                <span>
                  {gamePreview.minPlayers === gamePreview.maxPlayers
                    ? `${gamePreview.minPlayers}`
                    : `${gamePreview.minPlayers}-${gamePreview.maxPlayers}`}{' '}
                  jugadores
                </span>
              </div>
              {gamePreview.playingTime > 0 && (
                <div className={styles.previewStat}>
                  <MdTimer />
                  <span>{gamePreview.playingTime} min</span>
                </div>
              )}
            </div>

            {gamePreview.description && (
              <div className={styles.previewDescription}>
                <h4>Descripción</h4>
                <p>{gamePreview.description}</p>
              </div>
            )}

            {gamePreview.categories?.length > 0 && (
              <div className={styles.previewTags}>
                <h4>Categorías</h4>
                <div className={styles.tags}>
                  {gamePreview.categories.map((cat, idx) => (
                    <span key={idx} className={styles.tag}>
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {gamePreview.mechanics?.length > 0 && (
              <div className={styles.previewTags}>
                <h4>Mecánicas</h4>
                <div className={styles.tags}>
                  {gamePreview.mechanics.map((mech, idx) => (
                    <span key={idx} className={styles.tag}>
                      {mech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {error && <div className={styles.error}>{error}</div>}
          </div>
        </>
      );
    }

    if (mode === 'custom') {
      return (
        <>
          <Button
            variant="outline"
            size="small"
            onClick={() => setMode('search')}
            className={styles.backButton}
          >
            <MdArrowBack /> Volver
          </Button>

          <form onSubmit={handleCreateCustom} className={styles.customForm}>
            <Input
              label="Nombre del juego"
              name="name"
              type="text"
              value={customGame.name}
              onChange={(e) => setCustomGame({ ...customGame, name: e.target.value })}
              required
            />

            <Input
              label="Descripción"
              name="description"
              type="text"
              value={customGame.description}
              onChange={(e) => setCustomGame({ ...customGame, description: e.target.value })}
            />

            <div className={styles.formRow}>
              <Input
                label="Jugadores mín."
                name="minPlayers"
                type="number"
                min="1"
                value={customGame.minPlayers}
                onChange={(e) => setCustomGame({ ...customGame, minPlayers: parseInt(e.target.value) })}
                required
              />
              <Input
                label="Jugadores máx."
                name="maxPlayers"
                type="number"
                min="1"
                value={customGame.maxPlayers}
                onChange={(e) => setCustomGame({ ...customGame, maxPlayers: parseInt(e.target.value) })}
                required
              />
            </div>

            <div className={styles.formRow}>
              <Input
                label="Duración (min)"
                name="playingTime"
                type="number"
                min="0"
                value={customGame.playingTime}
                onChange={(e) => setCustomGame({ ...customGame, playingTime: parseInt(e.target.value) })}
              />
              <Input
                label="Año publicación"
                name="yearPublished"
                type="number"
                min="1900"
                max={new Date().getFullYear() + 5}
                value={customGame.yearPublished}
                onChange={(e) => setCustomGame({ ...customGame, yearPublished: parseInt(e.target.value) })}
              />
            </div>

            <Input
              label="URL de imagen"
              name="image"
              type="url"
              value={customGame.image}
              onChange={(e) => setCustomGame({ ...customGame, image: e.target.value })}
              helpText="URL de una imagen del juego"
            />

            <Input
              label="Categorías (separadas por comas)"
              name="categories"
              type="text"
              value={customGame.categories}
              onChange={(e) => setCustomGame({ ...customGame, categories: e.target.value })}
              helpText="Ej: Estrategia, Familiar, Cartas"
            />

            <Input
              label="Mecánicas (separadas por comas)"
              name="mechanics"
              type="text"
              value={customGame.mechanics}
              onChange={(e) => setCustomGame({ ...customGame, mechanics: e.target.value })}
              helpText="Ej: Gestión de mano, Colocación de trabajadores"
            />

            {error && <div className={styles.error}>{error}</div>}
          </form>
        </>
      );
    }
  };

  const renderFooter = () => {
    if (mode === 'preview') {
      return (
        <>
          <Button variant="outline" onClick={() => setMode('search')}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleAddFromBGG} disabled={loading}>
            {loading ? 'Añadiendo...' : 'Añadir al Grupo'}
          </Button>
        </>
      );
    }

    if (mode === 'custom') {
      return (
        <>
          <Button variant="outline" onClick={() => setMode('search')}>
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={handleCreateCustom} 
            disabled={loading || !customGame.name.trim()}
          >
            {loading ? 'Creando...' : 'Crear Juego'}
          </Button>
        </>
      );
    }

    return null;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={
        mode === 'search'
          ? groupId ? 'Añadir Juego al Grupo' : 'Añadir Juego Personal'
          : mode === 'preview'
          ? 'Vista Previa del Juego'
          : groupId ? 'Crear Juego para el Grupo' : 'Crear Juego Personal'
      }
      size="large"
      footer={renderFooter()}
    >
      <div className={styles.modalContent}>
        {renderContent()}
      </div>
    </Modal>
  );
};

AddGameModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onGameAdded: PropTypes.func.isRequired,
  groupId: PropTypes.string // Opcional: null = juegos personales
};

export default AddGameModal;
