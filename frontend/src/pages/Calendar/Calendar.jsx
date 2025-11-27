import { useState, useEffect, useCallback } from 'react';
import { MdAdd, MdCalendarToday } from 'react-icons/md';
import { GiDiceFire } from 'react-icons/gi';
import CalendarGrid from '../../components/calendar/CalendarGrid';
import CreateEditMatchModal from '../../components/calendar/CreateEditMatchModal';
import MatchDetailsModal from '../../components/calendar/MatchDetailsModal';
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
  const { showToast } = useToast();
  
  // Estado del calendario
  const [currentDate, setCurrentDate] = useState(new Date());
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [editingMatch, setEditingMatch] = useState(null);

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
      showToast('Partida creada exitosamente', 'success');
      setShowCreateModal(false);
    } catch (err) {
      showToast(err.response?.data?.message || 'Error al crear la partida', 'error');
      throw err;
    }
  };

  const handleUpdateMatch = async (matchData, matchId) => {
    try {
      const response = await matchService.updateMatch(matchId, matchData);
      setMatches(prev => prev.map(m => m._id === matchId ? response.data : m));
      showToast('Partida actualizada exitosamente', 'success');
      setShowCreateModal(false);
      setEditingMatch(null);
      
      // Actualizar también el match seleccionado si está abierto el modal de detalles
      if (selectedMatch?._id === matchId) {
        setSelectedMatch(response.data);
      }
    } catch (err) {
      showToast(err.response?.data?.message || 'Error al actualizar la partida', 'error');
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
      showToast('Partida eliminada exitosamente', 'success');
      setShowDetailsModal(false);
      setSelectedMatch(null);
    } catch (err) {
      showToast(err.response?.data?.message || 'Error al eliminar la partida', 'error');
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
      
      showToast('Asistencia confirmada', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Error al confirmar asistencia', 'error');
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
      
      showToast('Asistencia cancelada', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Error al cancelar asistencia', 'error');
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
    // Filtrar partidas del día seleccionado
    const dateStr = date.toISOString().split('T')[0];
    const dayMatches = matches.filter(match => {
      const matchDate = new Date(match.scheduledDate);
      return matchDate.toISOString().split('T')[0] === dateStr;
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
          <span className={styles.statIcon}>📅</span>
          <span className={styles.statValue}>{matches.length}</span>
          <span className={styles.statLabel}>Total</span>
        </div>
        <div className={styles.statDivider}></div>
        <div className={styles.statItem}>
          <span className={styles.statIcon}>🎯</span>
          <span className={styles.statValue}>{upcomingMatches}</span>
          <span className={styles.statLabel}>Próximas</span>
        </div>
        {pendingConfirmations > 0 && (
          <>
            <div className={styles.statDivider}></div>
            <div className={`${styles.statItem} ${styles.warning}`}>
              <span className={styles.statIcon}>⏰</span>
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
      />
    </div>
  );
};

export default Calendar;
