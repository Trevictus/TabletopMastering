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
  MdNotes
} from 'react-icons/md';
import { GiCardPlay } from 'react-icons/gi';
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
  onCancelConfirmation 
}) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  if (!match) return null;

  const isUserConfirmed = getUserConfirmationStatus(match, user?._id);
  const isCreator = match.createdBy?._id === user?._id || match.createdBy === user?._id;
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
    setLoading(true);
    try {
      await onCancelConfirmation(match._id);
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
        {match.status === 'programada' && (
          isUserConfirmed ? (
            <Button 
              variant="outline" 
              onClick={handleCancelConfirmation} 
              disabled={loading}
            >
              <MdCancel /> Cancelar Asistencia
            </Button>
          ) : (
            <Button 
              variant="primary" 
              onClick={handleConfirm} 
              disabled={loading}
            >
              <MdCheckCircle /> Confirmar Asistencia
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
                  {match.createdBy?.username || match.createdBy?.email || 'Desconocido'}
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

        {/* Lista de jugadores */}
        <div className={styles.section}>
          <h4 className={styles.sectionTitle}>
            Jugadores Invitados ({match.players?.length || 0})
          </h4>
          
          <div className={styles.playersList}>
            {match.players && match.players.length > 0 ? (
              match.players.map((player, index) => {
                const playerId = player.user?._id || player.user;
                const playerName = player.user?.username || player.user?.email || 'Usuario';
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
  onCancelConfirmation: PropTypes.func.isRequired
};

export default MatchDetailsModal;
