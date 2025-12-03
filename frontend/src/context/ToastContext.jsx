import { createContext, useContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

/**
 * Context para sistema de notificaciones Toast
 * 
 * Proporciona funciones para mostrar notificaciones de:
 * - Éxito
 * - Error
 * - Advertencia
 * - Información
 */

const ToastContext = createContext(null);

/**
 * Hook para acceder al contexto de toasts
 * @throws {Error} Si se usa fuera del ToastProvider
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe ser usado dentro de un ToastProvider');
  }
  return context;
};

/**
 * Tipos de toast disponibles
 */
export const ToastTypes = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

/**
 * Duración por defecto según el tipo
 */
const DEFAULT_DURATIONS = {
  [ToastTypes.SUCCESS]: 3000,
  [ToastTypes.ERROR]: 5000,
  [ToastTypes.WARNING]: 4000,
  [ToastTypes.INFO]: 3000,
};

/**
 * Proveedor del contexto de toasts
 */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  /**
   * Remueve un toast por ID
   */
  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  /**
   * Añade un nuevo toast
   * @param {Object} toast - Configuración del toast
   */
  const addToast = useCallback((toast) => {
    const id = Date.now() + Math.random();
    const duration = toast.duration || DEFAULT_DURATIONS[toast.type];

    const newToast = {
      id,
      type: toast.type || ToastTypes.INFO,
      title: toast.title,
      message: toast.message,
      duration,
      action: toast.action,
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto-remover después de la duración
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, [removeToast]);

  /**
   * Remueve todos los toasts
   */
  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  /**
   * Muestra un toast de éxito
   */
  const success = useCallback((message, options = {}) => {
    return addToast({
      type: ToastTypes.SUCCESS,
      title: options.title || 'Éxito',
      message,
      ...options,
    });
  }, [addToast]);

  /**
   * Muestra un toast de error
   */
  const error = useCallback((message, options = {}) => {
    return addToast({
      type: ToastTypes.ERROR,
      title: options.title || 'Error',
      message,
      ...options,
    });
  }, [addToast]);

  /**
   * Muestra un toast de advertencia
   */
  const warning = useCallback((message, options = {}) => {
    return addToast({
      type: ToastTypes.WARNING,
      title: options.title || 'Advertencia',
      message,
      ...options,
    });
  }, [addToast]);

  /**
   * Muestra un toast de información
   */
  const info = useCallback((message, options = {}) => {
    return addToast({
      type: ToastTypes.INFO,
      title: options.title || 'Información',
      message,
      ...options,
    });
  }, [addToast]);

  /**
   * Muestra un toast de promesa
   * Útil para operaciones asíncronas
   */
  const promise = useCallback(async (
    promiseFn,
    {
      loading = 'Cargando...',
      success: successMsg = 'Operación exitosa',
      error: errorMsg = 'Ocurrió un error',
    } = {}
  ) => {
    const loadingId = info(loading, { duration: 0 });

    try {
      const result = await promiseFn;
      removeToast(loadingId);
      success(typeof successMsg === 'function' ? successMsg(result) : successMsg);
      return result;
    } catch (err) {
      removeToast(loadingId);
      error(typeof errorMsg === 'function' ? errorMsg(err) : errorMsg);
      throw err;
    }
  }, [info, success, error, removeToast]);

  const value = {
    toasts,
    success,
    error,
    warning,
    info,
    promise,
    remove: removeToast,
    clearAll,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  );
};

ToastProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ToastContext;
