import { useState } from 'react';
import PropTypes from 'prop-types';
import { 
  MdClose, 
  MdEdit, 
  MdDelete, 
  MdCheckCircle, 
  MdCancel,
  MdPerson,
  MdPlace,
  MdAccessTime,
  MdNotes,
  MdEmojiEvents,
  MdTimer,
  MdLeaderboard
} from 'react-icons/md';
import { GiCardPlay, GiTrophy } from 'react-icons/gi';
import Modal from '../common/Modal';
import Button from '../common/Button';
import { useAuth } from '../../context/AuthContext';
import styles from './MatchDetailsModal.module.css';

/**
 * Obtiene el estado de confirmación del usuario actual
 */
const getUserConfirmationStatus = (match, userId) => {
  const player = match.players?.find(p => {
    const playerId = p.user?._id || p.user;
    return playerId === userId;
  });
  return player?.confirmed || false;
};

/**
 * Modal para ver detalles de una partida
 */
const MatchDetailsModal = ({ 
  isOpen, 
  onClose, 
  match, 
  onEdit, 
  onDelete, 
  onConfirm,
  onCancelConfirmation,
  onRegisterResults
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  if (!match) return null;

  // Obtener ID del usuario actual (puede estar en _id o id)
  const currentUserId = user?._id?.toString() || user?.id?.toString();
  
  // Obtener ID del creador (puede venir como objeto o string)
  const creatorId = match.createdBy?._id?.toString() || match.createdBy?.id?.toString() || match.createdBy?.toString();
  
  const isUserConfirmed = getUserConfirmationStatus(match, currentUserId);
  const isCreator = !!(currentUserId && creatorId && creatorId === currentUserId);
  
  const canEdit = isCreator;
  const canDelete = isCreator;

  // Verificar si la partida está próxima (en las próximas 24h)
  const isUpcoming = () => {
    const matchDate = new Date(match.scheduledDate);
    const now = new Date();
    const hoursDiff = (matchDate - now) / (1000 * 60 * 60);
    return hoursDiff > 0 && hoursDiff <= 24;
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm(match._id);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelConfirmation = async () => {
    // Si no es el creador, confirmar antes de abandonar
    if (!isCreator) {
      if (!window.confirm('¿Estás seguro de que quieres abandonar esta partida?')) {
        return;
      }
    }
    setLoading(true);
    try {
      await onCancelConfirmation(match._id);
      // Si no es el creador, el modal se cerrará desde el padre cuando la partida sea actualizada/eliminada
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta partida?')) {
      setLoading(true);
      try {
        await onDelete(match._id);
        onClose();
      } finally {
        setLoading(false);
      }
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      programada: { text: 'Programada', className: styles.statusProgramada },
      en_curso: { text: 'En Curso', className: styles.statusEnCurso },
      finalizada: { text: 'Finalizada', className: styles.statusFinalizada },
      cancelada: { text: 'Cancelada', className: styles.statusCancelada }
    };
    return badges[status] || badges.programada;
  };

  const statusBadge = getStatusBadge(match.status);

  // Verificar si se puede registrar resultados (creador/admin y partida programada o en_curso)
  const canRegisterResults = isCreator && (match.status === 'programada' || match.status === 'en_curso');
  
  // Verificar si TODOS los jugadores han confirmado asistencia
  const allPlayersConfirmed = match.players?.length > 0 && match.players.every(p => p.confirmed);

  const footer = (
    <div className={styles.footerActions}>
      <div className={styles.leftActions}>
        {canEdit && match.status === 'programada' && (
          <Button variant="outline" size="small" onClick={() => onEdit(match)} disabled={loading}>
            <MdEdit /> Editar
          </Button>
        )}
        {canDelete && (
          <Button variant="danger" size="small" onClick={handleDelete} disabled={loading}>
            <MdDelete /> Eliminar
          </Button>
        )}
      </div>
      <div className={styles.rightActions}>
        {/* Mensaje si faltan confirmaciones */}
        {canRegisterResults && !allPlayersConfirmed && (
          <span className={styles.warningText}>
            Faltan confirmaciones
          </span>
        )}
        {/* Botón Registrar Resultados - Solo visible si TODOS confirmaron */}
        {canRegisterResults && allPlayersConfirmed && (
          <Button 
            variant="secondary" 
            onClick={() => onRegisterResults(match)} 
            disabled={loading}
          >
            <MdEmojiEvents /> Registrar Resultados
          </Button>
        )}
        {match.status === 'programada' && (
          isUserConfirmed ? (
            <Button 
              variant="outline" 
              onClick={handleCancelConfirmation} 
              disabled={loading}
            >
              <MdCancel /> {isCreator ? 'Cancelar' : 'Abandonar'}
            </Button>
          ) : (
            <Button 
              variant="primary" 
              onClick={handleConfirm} 
              disabled={loading}
            >
              <MdCheckCircle /> Confirmar
            </Button>
          )
        )}
        <Button variant="outline" onClick={onClose}>
          <MdClose /> Cerrar
        </Button>
      </div>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalles de la Partida"
      footer={footer}
      size="medium"
    >
      <div className={styles.content}>
        {/* Header con juego y estado */}
        <div className={styles.header}>
          <div className={styles.gameInfo}>
            {match.game?.image ? (
              <img 
                src={match.game.image} 
                alt={match.game.name} 
                className={styles.gameImage}
              />
            ) : (
              <div className={styles.gameImagePlaceholder}>
                <GiCardPlay />
              </div>
            )}
            <div>
              <h3 className={styles.gameName}>{match.game?.name || 'Sin juego'}</h3>
              <span className={`${styles.statusBadge} ${statusBadge.className}`}>
                {statusBadge.text}
              </span>
              {isUpcoming() && <span className={styles.upcomingBadge}>🔔 Próxima (24h)</span>}
            </div>
          </div>
        </div>

        {/* Información de la partida */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>Información</h4>
          
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <MdAccessTime className={styles.icon} />
              <div>
                <span className={styles.label}>Fecha y hora:</span>
                <span className={styles.value}>
                  {new Date(match.scheduledDate).toLocaleDateString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                  {' a las '}
                  {new Date(match.scheduledDate).toLocaleTimeString('es-ES', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>

            {match.location && (
              <div className={styles.infoItem}>
                <MdPlace className={styles.icon} />
                <div>
                  <span className={styles.label}>Ubicación:</span>
                  <span className={styles.value}>{match.location}</span>
                </div>
              </div>
            )}

            <div className={styles.infoItem}>
              <MdPerson className={styles.icon} />
              <div>
                <span className={styles.label}>Creado por:</span>
                <span className={styles.value}>
                  {match.createdBy?.name || match.createdBy?.email || 'Desconocido'}
                  {isCreator && ' (Tú)'}
                </span>
              </div>
            </div>
          </div>

          {match.notes && (
            <div className={styles.notesSection}>
              <div className={styles.notesHeader}>
                <MdNotes className={styles.icon} />
                <span className={styles.label}>Notas:</span>
              </div>
              <p className={styles.notes}>{match.notes}</p>
            </div>
          )}
        </div>

        {/* Resultados finales - Solo si la partida está finalizada */}
        {match.status === 'finalizada' && (
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>
              <MdLeaderboard className={styles.titleIcon} /> Resultados Finales
            </h4>
            
            {/* Posiciones finales */}
            <div className={styles.resultsGrid}>
              {match.players
                ?.filter(p => p.position)
                .sort((a, b) => a.position - b.position)
                .map((player, index) => {
                  const playerName = player.user?.name || player.user?.email || 'Usuario';
                  const isWinner = player.position === 1;
                  const winnerId = match.winner?._id || match.winner;
                  const isMatchWinner = winnerId && (player.user?._id || player.user) === winnerId;
                  
                  return (
                    <div 
                      key={player.user?._id || index} 
                      className={`${styles.resultItem} ${isWinner ? styles.winner : ''}`}
                    >
                      <div className={styles.positionBadge}>
                        {isWinner ? <GiTrophy className={styles.trophyIcon} /> : `#${player.position}`}
                      </div>
                      <div className={styles.resultPlayerInfo}>
                        <span className={styles.resultPlayerName}>
                          {playerName}
                          {isMatchWinner && <span className={styles.winnerBadge}>Ganador</span>}
                        </span>
                        {player.score > 0 && (
                          <span className={styles.resultScore}>{player.score} pts</span>
                        )}
                      </div>
                      {player.pointsEarned > 0 && (
                        <span className={styles.pointsEarned}>+{player.pointsEarned} ranking</span>
                      )}
                    </div>
                  );
                })}
            </div>

            {/* Duración */}
            {match.duration?.value && (
              <div className={styles.durationInfo}>
                <MdTimer className={styles.icon} />
                <span className={styles.label}>Duración:</span>
                <span className={styles.value}>
                  {match.duration.value} {match.duration.unit || 'minutos'}
                </span>
              </div>
            )}
          </div>
        )}

        {/* Lista de jugadores */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>
            Jugadores Invitados ({match.players?.length || 0})
          </h4>
          
          <div className={styles.playersList}>
            {match.players && match.players.length > 0 ? (
              match.players.map((player, index) => {
                const playerId = player.user?._id || player.user;
                const playerName = player.user?.name || player.user?.email || 'Usuario';
                const isCurrentUser = playerId === user?._id;
                
                return (
                  <div key={playerId || index} className={styles.playerItem}>
                    <div className={styles.playerInfo}>
                      <div className={styles.playerAvatar}>
                        {playerName.charAt(0).toUpperCase()}
                      </div>
                      <div className={styles.playerDetails}>
                        <span className={styles.playerName}>
                          {playerName}
                          {isCurrentUser && <span className={styles.youBadge}>(Tú)</span>}
                        </span>
                      </div>
                    </div>
                    <div className={styles.playerStatus}>
                      {player.confirmed ? (
                        <span className={styles.confirmed}>
                          <MdCheckCircle /> Confirmado
                        </span>
                      ) : (
                        <span className={styles.pending}>
                          Pendiente
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <p className={styles.noPlayers}>No hay jugadores invitados</p>
            )}
          </div>

          {/* Contador de confirmaciones */}
          <div className={styles.confirmationCount}>
            {match.players?.filter(p => p.confirmed).length || 0} de {match.players?.length || 0} jugadores confirmados
          </div>
        </div>
      </div>
    </Modal>
  );
};

MatchDetailsModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  match: PropTypes.object,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancelConfirmation: PropTypes.func.isRequired,
  onRegisterResults: PropTypes.func.isRequired
};

export default MatchDetailsModal;
