import PropTypes from 'prop-types';
import { GiPerspectiveDiceSixFacesRandom } from 'react-icons/gi';
import styles from './Loading.module.css';

/**
 * Componente Loading - Spinner de carga
 * @param {Object} props
 * @param {boolean} props.fullScreen - Si debe ocupar toda la pantalla
 * @param {string} props.message - Mensaje opcional a mostrar
 */
const Loading = ({ fullScreen = false, message = 'Cargando...' }) => {
  const containerClass = fullScreen ? styles.fullScreen : styles.container;

  return (
    <div className={containerClass}>
      <div className={styles.spinner}>
        <GiPerspectiveDiceSixFacesRandom className={styles.icon} />
      </div>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );
};

Loading.propTypes = {
  fullScreen: PropTypes.bool,
  message: PropTypes.string
};

export default Loading;
