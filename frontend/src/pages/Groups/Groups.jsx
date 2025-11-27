import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGroup } from '../../context/GroupContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { MdAddCircle, MdPersonAdd, MdContentCopy, MdCheckCircle } from 'react-icons/md';
import { GiTeamIdea } from 'react-icons/gi';
import groupService from '../../services/groupService';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import styles from './Groups.module.css';

/**
 * Página de Grupos - Lista y gestión de grupos
 */
const Groups = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { groups, loadGroups, selectGroup } = useGroup();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [joiningLoading, setJoiningLoading] = useState(false);

  useEffect(() => {
    const loadInitialGroups = async () => {
      setLoading(true);
      try {
        await loadGroups();
      } catch (err) {
        setError('Error al cargar los grupos');
      } finally {
        setLoading(false);
      }
    };

    loadInitialGroups();
  }, []);

  const handleSelectGroup = (group) => {
    selectGroup(group);
    navigate(`/groups/${group._id}`);
  };

  const handleJoinGroup = async (e) => {
    e.preventDefault();
    
    if (!inviteCode.trim()) {
      toast.error('Por favor ingresa un código de invitación');
      return;
    }

    setJoiningLoading(true);
    try {
      const response = await groupService.joinGroup(inviteCode);
      
      if (response.success) {
        toast.success('¡Te has unido al grupo exitosamente!');
        setInviteCode('');
        setShowJoinModal(false);
        
        // Recargar los grupos
        await loadGroups();
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Error al unirse al grupo';
      toast.error(message);
    } finally {
      setJoiningLoading(false);
    }
  };

  return (
    <div className={styles.groupsPage}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <GiTeamIdea className={styles.headerIcon} />
          <div>
            <h1>Mis Grupos</h1>
            <p className={styles.subtitle}>
              Gestiona tus grupos de juego y participa en partidas
            </p>
          </div>
        </div>
        <div className={styles.headerActions}>
          <Link to="/groups/new">
            <Button variant="primary" size="small">
              <MdAddCircle /> Crear Grupo
            </Button>
          </Link>
          <Button 
            variant="secondary"
            size="small"
            onClick={() => setShowJoinModal(true)}
          >
            <MdPersonAdd /> Unirse
          </Button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className={styles.error}>
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Loading */}
      {loading && <Loading message="Cargando grupos..." />}

      {/* Grupos */}
      {!loading && groups.length > 0 && (
        <div className={styles.groupsGrid}>
          {groups.map(group => (
            <div key={group._id} className={styles.groupCard}>
              {/* Header con nombre y descripción */}
              <div className={styles.cardHeader}>
                <h3 className={styles.groupName}>{group.name}</h3>
                {group.description && (
                  <p className={styles.groupDescription}>{group.description}</p>
                )}
                {group.inviteCode && (
                  <div className={styles.inviteCodeDisplay}>
                    <span className={styles.inviteCodeLabel}>Código de invitación:</span>
                    <span className={styles.inviteCodeValue}>{group.inviteCode}</span>
                  </div>
                )}
              </div>

              {/* Members Quick View */}
              <div className={styles.cardBody}>
                <div className={styles.membersList}>
                  <div className={styles.membersHeader}>
                    <span className={styles.membersLabel}>Integrantes ({(group.members?.length || 0) + 1})</span>
                  </div>
                  <div className={styles.memberItems}>
                    {user && (
                      <div className={styles.memberItem}>
                        <div className={styles.memberAvatar}>
                          {user.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div className={styles.memberInfo}>
                          <p className={styles.memberName}>{user.name}</p>
                          <p className={styles.memberRole}>Admin</p>
                        </div>
                      </div>
                    )}
                    {group.members && group.members.length > 0 && (
                      group.members.map((member, idx) => (
                        <div key={idx} className={styles.memberItem}>
                          <div className={styles.memberAvatar}>
                            {member.name?.charAt(0).toUpperCase() || member.email?.charAt(0).toUpperCase() || '?'}
                          </div>
                          <div className={styles.memberInfo}>
                            <p className={styles.memberName}>{member.name || member.email}</p>
                            <p className={styles.memberRole}>Miembro</p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>

              {/* Footer con botón de ver grupo */}
              <div className={styles.cardFooter}>
                <button
                  className={styles.viewGroupButton}
                  onClick={() => navigate(`/groups/${group._id}`)}
                >
                  Ver Grupo Completo →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && groups.length === 0 && (
        <div className={styles.emptyState}>
          <GiTeamIdea className={styles.emptyIcon} />
          <h2 className={styles.emptyTitle}>No tienes grupos</h2>
          <p className={styles.emptyDescription}>
            Crea tu primer grupo o únete a uno existente para comenzar
          </p>
          <div className={styles.emptyActions}>
            <Link to="/groups/new">
              <Button variant="primary" size="large">
                <MdAddCircle /> Crear Primer Grupo
              </Button>
            </Link>
            <Button 
              variant="secondary" 
              size="large"
              onClick={() => setShowJoinModal(true)}
            >
              <MdPersonAdd /> Unirse a Grupo
            </Button>
          </div>
        </div>
      )}

      {/* Modal Unirse a Grupo */}
      {showJoinModal && (
        <div className={styles.modalOverlay} onClick={() => setShowJoinModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>Unirse a un Grupo</h2>
              <button
                className={styles.closeButton}
                onClick={() => setShowJoinModal(false)}
              >
                ✕
              </button>
            </div>

            <form className={styles.joinForm} onSubmit={handleJoinGroup}>
              <div className={styles.formGroup}>
                <label htmlFor="inviteCode">Código de Invitación</label>
                <input
                  id="inviteCode"
                  type="text"
                  className={styles.input}
                  placeholder="Ej: ABC12345"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  maxLength="8"
                  disabled={joiningLoading}
                  autoFocus
                />
                <small className={styles.hint}>
                  Solicita el código de invitación al administrador del grupo
                </small>
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setShowJoinModal(false)}
                  disabled={joiningLoading}
                >
                  Cancelar
                </button>
                <Button
                  variant="primary"
                  type="submit"
                  disabled={joiningLoading || !inviteCode.trim()}
                >
                  {joiningLoading ? 'Uniéndome...' : 'Unirme'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Groups;
