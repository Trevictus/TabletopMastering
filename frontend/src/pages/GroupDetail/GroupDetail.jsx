import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdArrowBack, MdPersonAdd, MdContentCopy, MdCheckCircle } from 'react-icons/md';
import { GiTeamIdea } from 'react-icons/gi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import groupService from '../../services/groupService';
import Loading from '../../components/common/Loading';
import styles from './GroupDetail.module.css';

/**
 * Componente de Avatar de Miembro con fallback a iniciales
 */
const MemberAvatar = ({ member, isAdmin, getInitials, isValidAvatar, styles }) => {
  const [imgError, setImgError] = useState(false);
  const memberUser = member.user;
  const hasValidAvatar = isValidAvatar(memberUser?.avatar) && !imgError;

  return (
    <div className={styles.memberAvatarContainer}>
      {hasValidAvatar ? (
        <img 
          src={memberUser.avatar} 
          alt={memberUser?.name || 'Miembro'} 
          className={styles.memberAvatarImg}
          onError={() => setImgError(true)}
        />
      ) : (
        <div className={`${styles.memberAvatar} ${isAdmin ? styles.memberAvatarAdmin : ''}`}>
          {getInitials(memberUser?.name)}
        </div>
      )}
      {isAdmin && (
        <span className={styles.adminCrown}>👑</span>
      )}
    </div>
  );
};

/**
 * Página de detalle del grupo
 * Muestra toda la información del grupo, miembros, juegos, etc.
 */
const GroupDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toast = useToast();
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copiedCode, setCopiedCode] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    
    const loadGroupDetail = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await groupService.getGroupById(id);
        // Solo actualizar estado si el componente sigue montado
        if (isMountedRef.current) {
          setGroup(response.data);
        }
      } catch (err) {
        // Ignorar errores de cancelación (peticiones duplicadas o componente desmontado)
        if (err.name === 'CanceledError' || err.message?.includes('cancelada') || err.message?.includes('canceled')) {
          return;
        }
        if (isMountedRef.current) {
          const message = err.response?.data?.message || 'Error al cargar el grupo';
          setError(message);
          toast.error(message);
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    loadGroupDetail();

    return () => {
      isMountedRef.current = false;
    };
  }, [id, toast]);

  const handleCopyCode = () => {
    if (group?.inviteCode) {
      navigator.clipboard.writeText(group.inviteCode);
      setCopiedCode(true);
      toast.success('Código copiado al portapapeles');
      setTimeout(() => setCopiedCode(false), 2000);
    }
  };

  if (loading) {
    return <Loading message="Cargando grupo..." />;
  }

  if (error || !group) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorContent}>
          <h2>Error al cargar el grupo</h2>
          <p>{error || 'El grupo no existe'}</p>
          <button onClick={() => navigate('/groups')} className={styles.backButton}>
            <MdArrowBack /> Volver a Mis Grupos
          </button>
        </div>
      </div>
    );
  }

  // Determinar si el usuario actual es admin
  const adminUser = group.admin;
  const isAdmin = user?._id === adminUser?._id || user?._id === group.createdBy;
  const memberCount = (group.members?.length || 0);

  // Función helper para formatear fecha de unión
  const formatJoinDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Función helper para obtener iniciales
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  // Función helper para verificar si es una URL de avatar válida
  const isValidAvatar = (avatar) => {
    if (!avatar) return false;
    // Aceptar data URLs (base64), URLs http/https, y excluir placeholders
    const isDataUrl = avatar.startsWith('data:image');
    const isHttpUrl = avatar.startsWith('http://') || avatar.startsWith('https://');
    const isPlaceholder = avatar.includes('placeholder');
    return (isDataUrl || isHttpUrl) && !isPlaceholder;
  };

  return (
    <div className={styles.groupDetailPage}>
      {/* Header */}
      <div className={styles.header}>
        <button onClick={() => navigate('/groups')} className={styles.backNav}>
          <MdArrowBack /> Volver
        </button>
        <div className={styles.headerContent}>
          <GiTeamIdea className={styles.headerIcon} />
          <div>
            <h1>{group.name}</h1>
            {group.description && <p className={styles.subtitle}>{group.description}</p>}
          </div>
        </div>
      </div>

      <div className={styles.container}>
        {/* Main Content */}
        <div className={styles.mainContent}>
          {/* Info Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Información del Grupo</h2>
            <div className={styles.infoGrid}>
              <div className={styles.infoCard}>
                <span className={styles.infoLabel}>Miembros</span>
                <span className={styles.infoValue}>{memberCount}</span>
              </div>
              <div className={styles.infoCard}>
                <span className={styles.infoLabel}>Partidas</span>
                <span className={styles.infoValue}>{group.stats?.totalMatches || 0}</span>
              </div>
              <div className={styles.infoCard}>
                <span className={styles.infoLabel}>Estado</span>
                <span className={styles.infoValue}>{group.isActive ? 'Activo' : 'Inactivo'}</span>
              </div>
            </div>
          </section>

          {/* Members Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Integrantes del Grupo ({memberCount})</h2>
            <div className={styles.membersList}>
              {/* Renderizar todos los miembros */}
              {group.members && group.members.length > 0 && (
                group.members.map((member) => {
                  const memberUser = member.user;
                  const memberRole = member.role;
                  const isCurrentUser = user?._id === memberUser?._id;
                  const isMemberAdmin = memberRole === 'admin';
                  const isMemberModerator = memberRole === 'moderator';
                  
                  return (
                    <div 
                      key={member._id} 
                      className={`${styles.memberCard} ${isMemberAdmin ? styles.memberCardAdmin : ''}`}
                    >
                      {/* Avatar con fallback */}
                      <MemberAvatar 
                        member={member}
                        isAdmin={isMemberAdmin}
                        getInitials={getInitials}
                        isValidAvatar={isValidAvatar}
                        styles={styles}
                      />

                      {/* Info del miembro */}
                      <div className={styles.memberContent}>
                        <div className={styles.memberHeader}>
                          <h3 className={styles.memberName}>
                            {memberUser?.name || 'Usuario'}
                            {isCurrentUser && <span className={styles.youBadge}>Tú</span>}
                          </h3>
                          <span className={`${styles.roleBadge} ${
                            isMemberAdmin ? styles.roleBadgeAdmin : 
                            isMemberModerator ? styles.roleBadgeMod : styles.roleBadgeMember
                          }`}>
                            {isMemberAdmin ? 'Admin' : isMemberModerator ? 'Moderador' : 'Miembro'}
                          </span>
                        </div>
                        
                        {/* Estadísticas del miembro */}
                        <div className={styles.memberStats}>
                          <div className={styles.memberStat}>
                            <span className={styles.statIcon}>🎮</span>
                            <span className={styles.statValue}>{memberUser?.stats?.totalMatches || 0}</span>
                            <span className={styles.statLabel}>partidas</span>
                          </div>
                          <div className={styles.memberStat}>
                            <span className={styles.statIcon}>🏆</span>
                            <span className={styles.statValue}>{memberUser?.stats?.totalWins || 0}</span>
                            <span className={styles.statLabel}>victorias</span>
                          </div>
                          <div className={styles.memberStat}>
                            <span className={styles.statIcon}>⭐</span>
                            <span className={styles.statValue}>{memberUser?.stats?.totalPoints || 0}</span>
                            <span className={styles.statLabel}>puntos</span>
                          </div>
                        </div>

                        {/* Fecha de unión */}
                        {member.joinedAt && (
                          <p className={styles.memberJoined}>
                            Se unió el {formatJoinDate(member.joinedAt)}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })
              )}

              {/* Mensaje si no hay miembros */}
              {(!group.members || group.members.length === 0) && (
                <div className={styles.noMembers}>
                  <p>No hay miembros en este grupo aún.</p>
                  <p className={styles.noMembersHint}>¡Comparte el código de invitación para añadir miembros!</p>
                </div>
              )}
            </div>
          </section>

          {/* Invite Code Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Código de Invitación</h2>
            <button className={styles.inviteCodeButton} onClick={handleCopyCode}>
              <div className={styles.codeContent}>
                <span className={styles.codeLabel}>{group.inviteCode || 'N/A'}</span>
                <span className={styles.copyHint}>
                  {copiedCode ? '✓ Copiado' : '📋 Click para copiar'}
                </span>
              </div>
            </button>
          </section>
        </div>

        {/* Sidebar (Optional) */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebarCard}>
            <h3>Acciones</h3>
            {isAdmin && (
              <button className={styles.actionButton}>
                <MdPersonAdd /> Gestionar Miembros
              </button>
            )}
            <button className={styles.actionButton} onClick={() => navigate('/rankings')}>
              👑 Ver Rankings
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default GroupDetail;
