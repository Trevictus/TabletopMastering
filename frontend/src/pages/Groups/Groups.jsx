import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGroup } from '../../context/GroupContext';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { MdAddCircle, MdPersonAdd, MdContentCopy, MdCheckCircle, MdClose } from 'react-icons/md';
import { GiTeamIdea } from 'react-icons/gi';
import groupService from '../../services/groupService';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import Modal from '../../components/common/Modal';
import Input from '../../components/common/Input';
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
  const [expandedGroup, setExpandedGroup] = useState(null);
  const [inviteEmails, setInviteEmails] = useState({});
  const [invitingGroupId, setInvitingGroupId] = useState(null);
  const [copiedCode, setCopiedCode] = useState(null);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [joiningGroup, setJoiningGroup] = useState(false);

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
    navigate('/rankings', {
      state: { message: `Grupo "${group.name}" seleccionado` }
    });
  };

  const handleInviteUser = async (groupId) => {
    const email = inviteEmails[groupId]?.trim();
    
    if (!email) {
      toast.error('Por favor ingresa un email');
      return;
    }

    setInvitingGroupId(groupId);
    try {
      await groupService.inviteUserToGroup(groupId, email);
      toast.success('Invitación enviada correctamente');
      setInviteEmails({ ...inviteEmails, [groupId]: '' });
      setExpandedGroup(null);
      setError('');
      // Recargar grupos después de invitar
      await loadGroups();
    } catch (err) {
      const message = err.response?.data?.message || 'Error al invitar usuario';
      toast.error(message);
      setError(message);
    } finally {
      setInvitingGroupId(null);
    }
  };

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    toast.success('Código copiado al portapapeles');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleJoinGroup = async () => {
    const code = joinCode.trim();
    
    if (!code) {
      toast.error('Por favor ingresa un código de invitación');
      return;
    }

    setJoiningGroup(true);
    try {
      await groupService.joinGroup(code);
      toast.success('Te has unido al grupo exitosamente');
      setJoinCode('');
      setShowJoinModal(false);
      await loadGroups();
    } catch (err) {
      const message = err.response?.data?.message || 'Error al unirse al grupo';
      toast.error(message);
    } finally {
      setJoiningGroup(false);
    }
  };

  const joinModalFooter = (
    <>
      <Button variant="outline" onClick={() => setShowJoinModal(false)} disabled={joiningGroup}>
        <MdClose /> Cancelar
      </Button>
      <Button variant="primary" onClick={handleJoinGroup} disabled={joiningGroup || !joinCode.trim()}>
        <MdPersonAdd /> {joiningGroup ? 'Uniéndose...' : 'Unirse al Grupo'}
      </Button>
    </>
  );

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
          <Button variant="outline" onClick={() => setShowJoinModal(true)}>
            <MdPersonAdd /> Unirse a Grupo
          </Button>
          <Link to="/groups/new">
            <Button variant="primary">
              <MdAddCircle /> Crear Grupo
            </Button>
          </Link>
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
              {/* Header */}
              <div className={styles.cardHeader}>
                <h3 className={styles.groupName}>{group.name}</h3>
                {group.description && (
                  <p className={styles.groupDescription}>{group.description}</p>
                )}
              </div>

              {/* Body */}
              <div className={styles.cardBody}>
                {/* Invite Code - Visual Focus */}
                <div className={styles.inviteCodeBox}>
                  <button
                    className={styles.codeButton}
                    onClick={() => handleCopyCode(group.inviteCode)}
                  >
                    <div className={styles.codeBadge}>{group.inviteCode}</div>
                    <div className={styles.copyIndicator}>
                      {copiedCode === group.inviteCode ? '✓ Copiado' : '📋 Copiar'}
                    </div>
                  </button>
                </div>

                {/* Stats */}
                <div className={styles.statsCompact}>
                  <div className={styles.statCompact}>
                    <span className={styles.statNum}>{(group.members?.length || 0) + 1}</span>
                    <span className={styles.statLabel}>Miembros</span>
                  </div>
                  <div className={styles.statCompact}>
                    <span className={styles.statNum}>{group.totalMatches || 0}</span>
                    <span className={styles.statLabel}>Partidas</span>
                  </div>
                </div>

                {/* Members */}
                <div className={styles.membersCompact}>
                  {user && (
                    <div className={styles.memberBadge}>
                      👤 {user.name} <span className={styles.badgeLabel}>Admin</span>
                    </div>
                  )}
                  {group.members && group.members.length > 0 && (
                    group.members.map((member, idx) => (
                      <div key={idx} className={styles.memberBadge}>
                        👤 {member.name || member.email}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className={styles.cardFooter}>
                <button
                  className={styles.rankingsButton}
                  onClick={() => handleSelectGroup(group)}
                >
                  Ver Rankings →
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
          <Link to="/groups/new">
            <Button variant="primary" size="large">
              <MdAddCircle /> Crear Primer Grupo
            </Button>
          </Link>
        </div>
      )}

      {/* Modal para unirse a un grupo */}
      <Modal
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        title="Unirse a un Grupo"
        footer={joinModalFooter}
        size="small"
      >
        <div className={styles.joinModalContent}>
          <p className={styles.joinModalDescription}>
            Ingresa el código de invitación que te compartieron para unirte a un grupo existente.
          </p>
          <Input
            label="Código de Invitación"
            name="joinCode"
            type="text"
            placeholder="Ej: ABC123XYZ"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            maxLength={20}
            autoFocus
          />
          <div className={styles.joinModalHelper}>
            💡 El código lo puedes obtener del administrador del grupo
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Groups;
