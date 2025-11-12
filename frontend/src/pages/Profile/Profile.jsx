import { useAuth } from '../../context/AuthContext';
import { GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi';
import Card from '../../components/common/Card';
import styles from './Profile.module.css';

/**
 * Página Profile - Perfil del usuario
 * Muestra información del usuario y permite editar el perfil
 */
const Profile = () => {
  const { user } = useAuth();

  return (
    <div className={styles.profilePage}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Mi Perfil</h1>

        {/* Profile Card */}
        <Card variant="elevated" className={styles.profileCard}>
          <div className={styles.avatarSection}>
            <div className={styles.avatarWrapper}>
              {user?.avatar ? (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className={styles.avatar}
                />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  <GiPerspectiveDiceSixFacesRandom />
                </div>
              )}
            </div>
          </div>

          <div className={styles.infoSection}>
            <div className={styles.infoItem}>
              <label className={styles.label}>Nombre</label>
              <p className={styles.value}>{user?.name}</p>
            </div>

            <div className={styles.infoItem}>
              <label className={styles.label}>Correo Electrónico</label>
              <p className={styles.value}>{user?.email}</p>
            </div>

            <div className={styles.infoItem}>
              <label className={styles.label}>Descripción</label>
              <p className={styles.value}>
                {user?.description || 'Sin descripción'}
              </p>
            </div>

            <div className={styles.infoItem}>
              <label className={styles.label}>Cita Favorita</label>
              <p className={styles.value}>
                {user?.quote || 'Sin cita favorita'}
              </p>
            </div>
          </div>
        </Card>

        {/* Stats Card */}
        <Card variant="elevated" className={styles.statsCard}>
          <h2 className={styles.cardTitle}>Estadísticas</h2>
          
          <div className={styles.statsGrid}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Partidas Jugadas</span>
              <span className={styles.statValue}>{user?.stats?.totalMatches || 0}</span>
            </div>

            <div className={styles.statItem}>
              <span className={styles.statLabel}>Victorias</span>
              <span className={styles.statValue}>{user?.stats?.totalWins || 0}</span>
            </div>

            <div className={styles.statItem}>
              <span className={styles.statLabel}>Puntos Totales</span>
              <span className={styles.statValue}>{user?.stats?.totalPoints || 0}</span>
            </div>

            <div className={styles.statItem}>
              <span className={styles.statLabel}>Ratio de Victoria</span>
              <span className={styles.statValue}>
                {user?.stats?.totalMatches > 0 
                  ? `${((user?.stats?.totalWins / user?.stats?.totalMatches) * 100).toFixed(1)}%`
                  : '0%'
                }
              </span>
            </div>
          </div>
        </Card>

        {/* Coming Soon */}
        <div className={styles.comingSoon}>
          <p>🚧 La edición de perfil estará disponible próximamente</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;
