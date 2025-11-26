import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useGroup } from '../../context/GroupContext';
import { FiEdit2, FiSave, FiCalendar, FiCamera, FiAward } from 'react-icons/fi';
import { FaUserCircle } from 'react-icons/fa';
import { GiTrophy } from 'react-icons/gi';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Loading from '../../components/common/Loading';
import gameService from '../../services/gameService';
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
  const [gamesCount, setGamesCount] = useState(0);
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

  // Cargar contador de juegos personales
  useEffect(() => {
    const loadGamesCount = async () => {
      try {
        const response = await gameService.getGames({ 
          groupId: undefined, // Solo juegos personales
          limit: 1 
        });
        setGamesCount(response.total || 0);
      } catch (error) {
        // Solo mostrar error si no es una petición cancelada
        if (error.name !== 'CanceledError') {
          console.error('Error loading games count:', error);
        }
      }
    };

    if (user) {
      loadGamesCount();
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

  // Función para comprimir imagen
  const compressImage = (file, maxWidth = 400, maxHeight = 400, quality = 0.8) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          // Calcular nuevas dimensiones manteniendo aspect ratio
          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          // Convertir a base64 con compresión
          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        // Comprimir la imagen antes de guardarla
        const compressedImage = await compressImage(file, 400, 400, 0.8);
        setFormData(prev => ({
          ...prev,
          avatar: compressedImage
        }));
      } catch (error) {
        console.error('Error comprimiendo imagen:', error);
      }
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
          <div className={styles.avatarContainer}>
            {formData.avatar && formData.avatar.startsWith('data:image') ? (
              <img src={formData.avatar} alt={user.name} className={styles.avatar} />
            ) : (
              <FaUserCircle className={styles.avatar} />
            )}
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
            <p className={styles.userEmail}>{user.email}</p>
            <div className={styles.memberBadge}>
              <FiCalendar className={styles.badgeIcon} />
              <span>
                {user.createdAt && !isNaN(new Date(user.createdAt).getTime()) 
                  ? `Miembro desde ${new Date(user.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long'
                    })}`
                  : 'Nuevo miembro'
                }
              </span>
            </div>
          </div>

          <div className={styles.headerActions}>
            {!isEditing ? (
              <Button
                variant="primary"
                size="small"
                onClick={() => setIsEditing(true)}
              >
                <FiEdit2 />
                <span>Editar Perfil</span>
              </Button>
            ) : (
              <Button
                variant="primary"
                size="small"
                onClick={handleSave}
                disabled={loading}
              >
                <FiSave />
                <span>Guardar Cambios</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className={styles.profileContainer}>
        {/* Sección de Edición - Solo visible cuando isEditing es true */}
        {isEditing && (
          <Card variant="elevated" className={styles.editCard}>
            <h2>Configuración del Perfil</h2>
            
            {/* Cambiar Avatar */}
            <div className={styles.formGroup}>
              <label>Foto de Perfil</label>
              <div className={styles.avatarUpload}>
                <div className={styles.avatarPreview}>
                  {formData.avatar && formData.avatar.startsWith('data:image') ? (
                    <img src={formData.avatar} alt="Preview" className={styles.previewImage} />
                  ) : (
                    <FaUserCircle className={styles.previewIcon} />
                  )}
                </div>
                <Button
                  variant="outline"
                  size="small"
                  onClick={handleAvatarClick}
                >
                  <FiCamera />
                  Cambiar Foto
                </Button>
              </div>
            </div>

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
              <span className={styles.statValue}>{gamesCount}</span>
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

        {/* Destacados y Progreso */}
        <Card variant="elevated" className={styles.highlightsCard}>
          <h2>
            <FiAward className={styles.sectionIcon} />
            <span>Destacados</span>
          </h2>
          <div className={styles.highlightsList}>
            <div className={styles.highlightItem}>
              <div className={styles.highlightIcon}>
                <GiTrophy />
              </div>
              <div className={styles.highlightContent}>
                <h4>Ratio de Victoria</h4>
                <div className={styles.progressBarContainer}>
                  <div 
                    className={styles.progressBarFill} 
                    style={{
                      width: `${user.stats?.totalMatches > 0 
                        ? ((user.stats?.totalWins || 0) / user.stats.totalMatches * 100).toFixed(0) 
                        : 0}%`
                    }}
                  />
                </div>
                <p className={styles.highlightStats}>
                  {user.stats?.totalMatches > 0 
                    ? `${((user.stats?.totalWins || 0) / user.stats.totalMatches * 100).toFixed(1)}% de victorias`
                    : 'A\u00fan no has jugado partidas'}
                </p>
              </div>
            </div>

            <div className={styles.highlightItem}>
              <div className={styles.highlightIcon}>
                <FiCalendar />
              </div>
              <div className={styles.highlightContent}>
                <h4>Actividad</h4>
                <p className={styles.highlightDescription}>
                  {groups.length > 0 
                    ? `Participas en ${groups.length} grupo${groups.length > 1 ? 's' : ''}`
                    : 'A\u00fan no est\u00e1s en ning\u00fan grupo'}
                </p>
                <p className={styles.highlightStats}>
                  {gamesCount > 0 
                    ? `${gamesCount} juego${gamesCount > 1 ? 's' : ''} en tu colecci\u00f3n`
                    : 'Empieza a a\u00f1adir juegos'}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
