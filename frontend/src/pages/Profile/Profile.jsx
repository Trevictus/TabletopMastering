import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useGroup } from '../../context/GroupContext';
import { FiEdit2, FiSave, FiX, FiUser, FiMail, FiCalendar, FiCamera } from 'react-icons/fi';
import { FaUserCircle } from 'react-icons/fa';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import styles from './Profile.module.css';

/**
 * Página Profile - Perfil elegante del usuario
 * Muestra información del usuario, edición de perfil y estadísticas
 */
const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { groups } = useGroup();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    avatar: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        avatar: user.avatar || ''
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          avatar: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error actualizando perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <Loading message="Cargando perfil..." />;
  }

  return (
    <div className={styles.profilePage}>
      {/* Header de Perfil */}
      <div className={styles.profileHeader}>
        <div className={styles.profileHeaderBg}></div>
        
        <div className={styles.profileContent}>
          <div className={styles.avatarContainer} onClick={handleAvatarClick}>
            {formData.avatar ? (
              <img src={formData.avatar} alt={user.name} className={styles.avatar} />
            ) : (
              <div className={styles.avatarPlaceholder}>
                <FaUserCircle className={styles.defaultAvatar} />
              </div>
            )}
            <div className={styles.avatarOverlay}>
              <FiCamera className={styles.cameraIcon} />
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className={styles.fileInput}
          />

          <div className={styles.profileInfo}>
            <h1>{user.name}</h1>
            <p className={styles.memberSince}>
              Miembro desde {new Date(user.createdAt).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          <div className={styles.headerActions}>
            {!isEditing ? (
              <Button
                variant="primary"
                size="small"
                onClick={() => setIsEditing(true)}
              >
                <FiEdit2 />
              </Button>
            ) : (
              <>
                <Button
                  variant="primary"
                  size="small"
                  onClick={handleSave}
                  disabled={loading}
                >
                  <FiSave />
                </Button>
                <Button
                  variant="outline"
                  size="small"
                  onClick={() => setIsEditing(false)}
                >
                  <FiX />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className={styles.profileContainer}>
        {/* Sección de Edición */}
        {isEditing && (
          <Card variant="elevated" className={styles.editCard}>
            <h2>Editar Información Personal</h2>
            
            <div className={styles.formGroup}>
              <label htmlFor="name">Nombre</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={styles.input}
              />
            </div>
          </Card>
        )}

        {/* Estadísticas */}
        <Card variant="elevated" className={styles.statsCard}>
          <h2>Estadísticas</h2>
          <div className={styles.statsList}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Grupos</span>
              <span className={styles.statValue}>{groups.length}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Juegos Personales</span>
              <span className={styles.statValue}>-</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Partidas Jugadas</span>
              <span className={styles.statValue}>{user.stats?.totalMatches || 0}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Victorias</span>
              <span className={styles.statValue}>{user.stats?.totalWins || 0}</span>
            </div>
          </div>
        </Card>

        {/* Información de Cuenta */}
        <Card variant="elevated" className={styles.accountCard}>
          <h2>Información de Cuenta</h2>
          <div className={styles.accountInfo}>
            <div className={styles.infoItem}>
              <FiUser className={styles.infoIcon} />
              <div>
                <span className={styles.infoLabel}>Nombre de Usuario</span>
                <span className={styles.infoValue}>{user.name}</span>
              </div>
            </div>
            <div className={styles.infoItem}>
              <FiMail className={styles.infoIcon} />
              <div>
                <span className={styles.infoLabel}>Correo Electrónico</span>
                <span className={styles.infoValue}>{user.email}</span>
              </div>
            </div>
            <div className={styles.infoItem}>
              <FiCalendar className={styles.infoIcon} />
              <div>
                <span className={styles.infoLabel}>Miembro Desde</span>
                <span className={styles.infoValue}>
                  {new Date(user.createdAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
