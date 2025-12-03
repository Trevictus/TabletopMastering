import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { MdAdd, MdCalendarToday } from 'react-icons/md';
import { GiSandsOfTime } from 'react-icons/gi';
import { FiClock, FiLayers } from 'react-icons/fi';
import CalendarGrid from '../../components/calendar/CalendarGrid';
import CreateEditMatchModal from '../../components/calendar/CreateEditMatchModal';
import MatchDetailsModal from '../../components/calendar/MatchDetailsModal';
import RegisterResultsModal from '../../components/calendar/RegisterResultsModal';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import { useToast } from '../../context/ToastContext';
import matchService from '../../services/matchService';
import styles from './Calendar.module.css';

/**
 * Página de Calendario de Partidas
 */
const Calendar = () => {
  const toast = useToast();
  const location = useLocation();
  
  // Estado del calendario
  const [currentDate, setCurrentDate] = useState(new Date());
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState('');

  // Modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [editingMatch, setEditingMatch] = useState(null);

  // Abrir modal si viene del Dashboard con state
  useEffect(() => {
    if (location.state?.openCreateModal) {
      setShowCreateModal(true);
      // Limpiar el state para que no se abra de nuevo al navegar
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Cargar partidas
  const loadMatches = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      // Obtener todas las partidas del usuario sin filtro de grupo
      const response = await matchService.getAllUserMatches({
        page: 1,
        limit: 1000 // Cargar todas las partidas
      });
      
      // La respuesta tiene estructura { success, count, total, pages, currentPage, data }
      // donde 'data' es el array de partidas
      setMatches(response.data || []);
    } catch (err) {
      console.error('Error al cargar partidas:', err);
      // Si el endpoint no existe (404), mostrar mensaje informativo
      if (err.response?.status === 404) {
        setError('El módulo de partidas aún no está disponible. Próximamente podrás gestionar tu calendario.');
      } else {
        setError(err.response?.data?.message || 'Error al cargar las partidas');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar partidas al montar
  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  // Handlers
  const handleCreateMatch = async (matchData) => {
    try {
      const response = await matchService.createMatch(matchData);
      setMatches(prev => [...prev, response.data]);
      toast.success('Partida creada exitosamente');
      setShowCreateModal(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al crear la partida');
      throw err;
    }
  };

  const handleUpdateMatch = async (matchData, matchId) => {
    try {
      const response = await matchService.updateMatch(matchId, matchData);
      setMatches(prev => prev.map(m => m._id === matchId ? response.data : m));
      toast.success('Partida actualizada exitosamente');
      setShowCreateModal(false);
      setEditingMatch(null);
      
      // Actualizar también el match seleccionado si está abierto el modal de detalles
      if (selectedMatch?._id === matchId) {
        setSelectedMatch(response.data);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al actualizar la partida');
      throw err;
    }
  };

  const handleSaveMatch = async (matchData, matchId) => {
    if (matchId) {
      await handleUpdateMatch(matchData, matchId);
    } else {
      await handleCreateMatch(matchData);
    }
  };

  const handleDeleteMatch = async (matchId) => {
    try {
      await matchService.deleteMatch(matchId);
      setMatches(prev => prev.filter(m => m._id !== matchId));
      toast.success('Partida eliminada exitosamente');
      setShowDetailsModal(false);
      setSelectedMatch(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al eliminar la partida');
      throw err;
    }
  };

  const handleConfirmAttendance = async (matchId) => {
    try {
      const response = await matchService.confirmAttendance(matchId);
      
      // Actualizar la partida en la lista
      setMatches(prev => prev.map(m => m._id === matchId ? response.data : m));
      
      // Actualizar también el match seleccionado
      if (selectedMatch?._id === matchId) {
        setSelectedMatch(response.data);
      }
      
      toast.success('Asistencia confirmada');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al confirmar asistencia');
      throw err;
    }
  };

  const handleCancelConfirmation = async (matchId) => {
    try {
      const response = await matchService.cancelAttendance(matchId);
      
      // Actualizar la partida en la lista
      setMatches(prev => prev.map(m => m._id === matchId ? response.data : m));
      
      // Actualizar también el match seleccionado
      if (selectedMatch?._id === matchId) {
        setSelectedMatch(response.data);
      }
      
      toast.success('Asistencia cancelada');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al cancelar asistencia');
      throw err;
    }
  };

  const handleMatchClick = (match) => {
    setSelectedMatch(match);
    setShowDetailsModal(true);
  };

  const handleEditMatch = (match) => {
    setEditingMatch(match);
    setShowDetailsModal(false);
    setShowCreateModal(true);
  };

  const handleDayClick = (date) => {
    // Función para formatear fecha a YYYY-MM-DD
    // Para fechas de la base de datos (strings ISO), extrae directamente la parte de la fecha
    // para evitar problemas de conversión de zona horaria
    const formatDateLocal = (d) => {
      // Si es un string ISO (de la base de datos), extraer la fecha directamente
      if (typeof d === 'string' && d.includes('T')) {
        return d.split('T')[0];
      }
      
      const dateObj = new Date(d);
      const year = dateObj.getFullYear();
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // Filtrar partidas del día seleccionado usando hora local
    const dateStr = formatDateLocal(date);
    const dayMatches = matches.filter(match => {
      return formatDateLocal(match.scheduledDate) === dateStr;
    });

    if (dayMatches.length === 1) {
      handleMatchClick(dayMatches[0]);
    } else if (dayMatches.length > 1) {
      // Si hay múltiples partidas, mostrar la primera
      handleMatchClick(dayMatches[0]);
    }
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setEditingMatch(null);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedMatch(null);
  };

  // Handler para abrir modal de registro de resultados
  const handleOpenResultsModal = (match) => {
    setSelectedMatch(match);
    setShowDetailsModal(false);
    setShowResultsModal(true);
  };

  // Handler para cerrar modal de resultados
  const handleCloseResultsModal = () => {
    setShowResultsModal(false);
    setSelectedMatch(null);
  };

  // Handler para guardar resultados de la partida
  const handleSaveResults = async (matchId, resultData) => {
    try {
      const response = await matchService.finishMatch(matchId, resultData);
      
      // Actualizar la partida en la lista con el nuevo estado
      setMatches(prev => prev.map(m => m._id === matchId ? response.data : m));
      
      // Cerrar modal de resultados
      setShowResultsModal(false);
      setSelectedMatch(null);
      
      // Mostrar mensaje de éxito con info de ranking si está disponible
      if (response.ranking?.updatedPlayers?.length > 0) {
        const winnerInfo = response.ranking.updatedPlayers.find(p => p.isWinner);
        if (winnerInfo) {
          toast.success(`¡Partida finalizada! ${winnerInfo.stats?.name || 'Ganador'} suma ${winnerInfo.points} puntos al ranking.`);
        } else {
          toast.success('¡Resultados guardados correctamente!');
        }
      } else {
        toast.success('¡Resultados guardados correctamente!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error al guardar los resultados');
      throw err;
    }
  };

  // Estadísticas rápidas
  const upcomingMatches = matches.filter(m => {
    const matchDate = new Date(m.scheduledDate);
    const now = new Date();
    return matchDate > now && m.status === 'programada';
  }).length;

  const pendingConfirmations = matches.filter(m => {
    const userPlayer = m.players?.find(p => p.user?._id);
    return m.status === 'programada' && userPlayer && !userPlayer.confirmed;
  }).length;

  return (
    <div className={styles.calendarPage}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.headerTitle}>
            <MdCalendarToday className={styles.headerIcon} />
            <h1>Calendario</h1>
          </div>
          <Button
            variant="primary"
            size="small"
            onClick={() => setShowCreateModal(true)}
          >
            <MdAdd /> Nueva Partida
          </Button>
        </div>
      </div>

      {/* Estadísticas compactas */}
      <div className={styles.statsBar}>
        <div className={styles.statItem}>
          <FiLayers className={styles.statIcon} />
          <span className={styles.statValue}>{matches.length}</span>
          <span className={styles.statLabel}>Total</span>
        </div>
        <div className={styles.statDivider}></div>
        <div className={styles.statItem}>
          <GiSandsOfTime className={styles.statIcon} />
          <span className={styles.statValue}>{upcomingMatches}</span>
          <span className={styles.statLabel}>Próximas</span>
        </div>
        {pendingConfirmations > 0 && (
          <>
            <div className={styles.statDivider}></div>
            <div className={`${styles.statItem} ${styles.warning}`}>
              <FiClock className={styles.statIcon} />
              <span className={styles.statValue}>{pendingConfirmations}</span>
              <span className={styles.statLabel}>Pendientes</span>
            </div>
          </>
        )}
      </div>

      {/* Calendario */}
      {!loading ? (
        <Card variant="elevated" className={styles.calendarCard}>
          <CalendarGrid
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            matches={matches}
            onDayClick={handleDayClick}
            onMatchClick={handleMatchClick}
          />
        </Card>
      ) : (
        <Loading message="Cargando..." />
      )}

      {/* Modal de crear/editar partida */}
      <CreateEditMatchModal
        isOpen={showCreateModal}
        onClose={handleCloseCreateModal}
        onSave={handleSaveMatch}
        match={editingMatch}
      />

      {/* Modal de detalles de partida */}
      <MatchDetailsModal
        isOpen={showDetailsModal}
        onClose={handleCloseDetailsModal}
        match={selectedMatch}
        onEdit={handleEditMatch}
        onDelete={handleDeleteMatch}
        onConfirm={handleConfirmAttendance}
        onCancelConfirmation={handleCancelConfirmation}
        onRegisterResults={handleOpenResultsModal}
      />

      {/* Modal de registro de resultados */}
      <RegisterResultsModal
        isOpen={showResultsModal}
        onClose={handleCloseResultsModal}
        match={selectedMatch}
        onSave={handleSaveResults}
      />
    </div>
  );
};

export default Calendar;
