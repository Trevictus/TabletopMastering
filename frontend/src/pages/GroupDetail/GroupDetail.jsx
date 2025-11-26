import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MdArrowBack, MdPersonAdd, MdContentCopy, MdCheckCircle } from 'react-icons/md';
import { GiTeamIdea } from 'react-icons/gi';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import groupService from '../../services/groupService';
import Loading from '../../components/common/Loading';
import styles from './GroupDetail.module.css';

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

  useEffect(() => {
    loadGroupDetail();
  }, [id]);

  const loadGroupDetail = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await groupService.getGroupById(id);
      setGroup(response.data);
    } catch (err) {
      const message = err.response?.data?.message || 'Error al cargar el grupo';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

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

  const isAdmin = user?._id === group.createdBy;
  const memberCount = (group.members?.length || 0) + 1;

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
                <span className={styles.infoValue}>{group.totalMatches || 0}</span>
              </div>
              <div className={styles.infoCard}>
                <span className={styles.infoLabel}>Estado</span>
                <span className={styles.infoValue}>{group.status || 'Activo'}</span>
              </div>
            </div>
          </section>

          {/* Members Section */}
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Integrantes del Grupo</h2>
            <div className={styles.membersList}>
              {/* Admin */}
              {group.createdBy && (
                <div className={styles.memberCard}>
                  <div className={styles.memberAvatar}>
                    {user?.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div className={styles.memberContent}>
                    <h3 className={styles.memberName}>{user?.name}</h3>
                    <p className={styles.memberRole}>Administrador</p>
                  </div>
                  {isAdmin && <span className={styles.adminBadge}>Tú</span>}
                </div>
              )}
              {/* Other Members */}
              {group.members && group.members.length > 0 && (
                group.members.map((member) => (
                  <div key={member._id} className={styles.memberCard}>
                    <div className={styles.memberAvatar}>
                      {member.name?.charAt(0).toUpperCase() || member.email?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div className={styles.memberContent}>
                      <h3 className={styles.memberName}>{member.name || member.email}</h3>
                      <p className={styles.memberRole}>Miembro</p>
                    </div>
                  </div>
                ))
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
