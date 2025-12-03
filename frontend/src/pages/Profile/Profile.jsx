import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useGroup } from '../../context/GroupContext';
import { useNavigate } from 'react-router-dom';
import { FiEdit2, FiSave, FiX, FiCamera, FiAward, FiUsers, FiTarget, FiTrendingUp } from 'react-icons/fi';
import { GiTrophy, GiDiceFire, GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi';
import { FaUserCircle } from 'react-icons/fa';
import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import gameService from '../../services/gameService';
import { isValidAvatar } from '../../utils/validators';
import styles from './Profile.module.css';

const compressImage = (file, maxSize = 400, quality = 0.8) => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (e) => {
    const img = new Image();
    img.src = e.target.result;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;
      if (width > height) {
        if (width > maxSize) { height = Math.round((height * maxSize) / width); width = maxSize; }
      } else {
        if (height > maxSize) { width = Math.round((width * maxSize) / height); height = maxSize; }
      }
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', quality));
    };
    img.onerror = reject;
  };
  reader.onerror = reject;
});

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { groups } = useGroup();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [gamesCount, setGamesCount] = useState(0);
  const [formData, setFormData] = useState({ name: '', avatar: '' });

  useEffect(() => {
    if (user) setFormData({ name: user.name || '', avatar: user.avatar || '' });
  }, [user]);

  useEffect(() => {
    if (!user) return;
    gameService.getGames({ limit: 1 }).then(r => setGamesCount(r.total || 0)).catch(() => {});
  }, [user]);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const compressed = await compressImage(file);
        setFormData(prev => ({ ...prev, avatar: compressed }));
      } catch { /* silencioso */ }
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({ name: user.name || '', avatar: user.avatar || '' });
    setIsEditing(false);
  };

  if (!user) return <Loading message="Cargando perfil..." />;

  const stats = {
    matches: user.stats?.totalMatches || 0,
    wins: user.stats?.totalWins || 0,
    points: user.stats?.totalPoints || 0,
  };
  const winRate = stats.matches > 0 ? Math.round((stats.wins / stats.matches) * 100) : 0;
  
  const achievements = [
    stats.matches >= 10 && { icon: '🎲', label: 'Jugador Veterano' },
    stats.wins >= 5 && { icon: '🏆', label: 'Campeón' },
    groups.length >= 3 && { icon: '👥', label: 'Social' },
    gamesCount >= 5 && { icon: '📚', label: 'Coleccionista' },
    winRate >= 50 && stats.matches >= 5 && { icon: '⭐', label: 'Estratega' },
  ].filter(Boolean);

  return (
    <div className={styles.profilePage}>
      <div className={styles.header}>
        <div className={styles.headerBg} />
        <div className={styles.headerContent}>
          <div className={styles.avatarSection}>
            <div className={styles.avatarWrapper}>
              {isValidAvatar(formData.avatar) ? (
                <img src={formData.avatar} alt={user.name} className={styles.avatar} />
              ) : (
                <FaUserCircle className={styles.avatarIcon} />
              )}
              {isEditing && (
                <button className={styles.changeAvatarBtn} onClick={() => fileInputRef.current?.click()}>
                  <FiCamera />
                </button>
              )}
            </div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className={styles.fileInput} />
          </div>

          <div className={styles.userInfo}>
            {isEditing ? (
              <input type="text" name="name" value={formData.name} onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))} className={styles.nameInput} placeholder="Tu nombre" />
            ) : (
              <h1>{user.name}</h1>
            )}
            <div className={styles.memberBadge}>
              <GiPerspectiveDiceSixFacesRandom />
              <span>
                {user.createdAt && !isNaN(new Date(user.createdAt).getTime())
                  ? `Miembro desde ${new Date(user.createdAt).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}`
                  : 'Nuevo jugador'}
              </span>
            </div>
          </div>

          <div className={styles.headerActions}>
            {isEditing ? (
              <>
                <Button variant="primary" size="small" onClick={handleSave} disabled={loading}><FiSave /> Guardar</Button>
                <Button variant="outline" size="small" onClick={handleCancel}><FiX /> Cancelar</Button>
              </>
            ) : (
              <Button variant="outline" size="small" onClick={() => setIsEditing(true)}><FiEdit2 /> Editar</Button>
            )}
          </div>
        </div>
      </div>

      <div className={styles.content}>
        <section className={styles.statsSection}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}><GiDiceFire /></div>
            <div className={styles.statInfo}><span className={styles.statValue}>{stats.matches}</span><span className={styles.statLabel}>Partidas</span></div>
          </div>
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.gold}`}><GiTrophy /></div>
            <div className={styles.statInfo}><span className={styles.statValue}>{stats.wins}</span><span className={styles.statLabel}>Victorias</span></div>
          </div>
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.green}`}><FiTarget /></div>
            <div className={styles.statInfo}><span className={styles.statValue}>{winRate}%</span><span className={styles.statLabel}>Win Rate</span></div>
          </div>
          <div className={styles.statCard}>
            <div className={`${styles.statIcon} ${styles.purple}`}><FiTrendingUp /></div>
            <div className={styles.statInfo}><span className={styles.statValue}>{stats.points}</span><span className={styles.statLabel}>Puntos</span></div>
          </div>
        </section>

        <div className={styles.cardsGrid}>
          <div className={styles.card} onClick={() => navigate('/groups')}>
            <div className={styles.cardHeader}><FiUsers className={styles.cardIcon} /><h3>Mis Grupos</h3></div>
            <div className={styles.cardValue}>{groups.length}</div>
            <p className={styles.cardDesc}>{groups.length > 0 ? `Activo en ${groups.length} grupo${groups.length > 1 ? 's' : ''}` : 'Únete a un grupo'}</p>
          </div>
          <div className={styles.card} onClick={() => navigate('/games')}>
            <div className={styles.cardHeader}><GiPerspectiveDiceSixFacesRandom className={styles.cardIcon} /><h3>Mi Colección</h3></div>
            <div className={styles.cardValue}>{gamesCount}</div>
            <p className={styles.cardDesc}>{gamesCount > 0 ? `${gamesCount} juego${gamesCount > 1 ? 's' : ''} en tu colección` : 'Añade juegos'}</p>
          </div>
          <div className={`${styles.card} ${styles.progressCard}`}>
            <div className={styles.cardHeader}><FiAward className={styles.cardIcon} /><h3>Progreso</h3></div>
            <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: `${winRate}%` }} /></div>
            <p className={styles.cardDesc}>{stats.matches > 0 ? `${stats.wins} de ${stats.matches} partidas ganadas` : 'Juega tu primera partida'}</p>
          </div>
        </div>

        <section className={styles.achievementsSection}>
          <h2><FiAward /> Destacados</h2>
          <div className={styles.achievementsList}>
            {achievements.length > 0 ? achievements.map((a, i) => (
              <div key={i} className={styles.achievement}>
                <span className={styles.achievementIcon}>{a.icon}</span>
                <span>{a.label}</span>
              </div>
            )) : (
              <p className={styles.noAchievements}>¡Juega partidas para desbloquear logros!</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
