import { createPortal } from 'react-dom';
import { useToast } from '../../../context/ToastContext';
import Toast from './Toast';
import styles from './ToastContainer.module.css';

/**
 * Contenedor de toasts
 * Renderiza todos los toasts activos en un portal
 */
const ToastContainer = () => {
  const { toasts, remove } = useToast();

  // Renderizar en el body usando portal
  return createPortal(
    <div className={styles.container} aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={remove}
        />
      ))}
    </div>,
    document.body
  );
};

export default ToastContainer;
