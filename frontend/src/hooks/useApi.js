import { useState, useCallback, useRef, useEffect } from 'react';
import { formatError, logError } from '../services/apiErrorHandler';
import { useToast } from '../context/ToastContext';

/**
 * Hook personalizado para manejar peticiones a la API
 * 
 * Proporciona:
 * - Estado de loading/error/data
 * - Manejo automático de errores con toasts
 * - Cancelación automática al desmontar
 * - Retry manual
 * - Cache opcional
 * 
 * @param {Function} apiFunction - Función que retorna una promesa de Axios
 * @param {Object} options - Opciones de configuración
 * @returns {Object} Estado y funciones de la petición
 * 
 * @example
 * const { data, loading, error, execute, retry } = useApi(
 *   () => gameService.getGames({ page: 1 }),
 *   { immediate: true, showErrorToast: true }
 * );
 */
const useApi = (apiFunction, options = {}) => {
  const {
    immediate = false,
    onSuccess = null,
    onError = null,
    initialData = null,
    cache = false,
    logErrors = true,
    showErrorToast = true,
    showSuccessToast = false,
    successMessage = 'Operación exitosa',
  } = options;

  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState(null);
  const [executionCount, setExecutionCount] = useState(0);

  const abortControllerRef = useRef(null);
  const cacheRef = useRef(null);
  const isMountedRef = useRef(true);
  const toast = useToast();

  // Cleanup al desmontar
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  /**
   * Ejecuta la petición a la API
   */
  const execute = useCallback(
    async (...args) => {
      try {
        // Cancelar petición anterior si existe
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }

        // Crear nuevo AbortController
        abortControllerRef.current = new AbortController();

        // Verificar cache
        if (cache && cacheRef.current) {
          setData(cacheRef.current);
          return cacheRef.current;
        }

        // Iniciar loading
        if (isMountedRef.current) {
          setLoading(true);
          setError(null);
        }

        // Ejecutar función de API
        const response = await apiFunction(...args, {
          signal: abortControllerRef.current.signal,
        });

        // Actualizar estado solo si el componente sigue montado
        if (isMountedRef.current) {
          const responseData = response.data;
          setData(responseData);
          setLoading(false);
          setExecutionCount(prev => prev + 1);

          // Guardar en cache si está habilitado
          if (cache) {
            cacheRef.current = responseData;
          }

          // Mostrar toast de éxito si está habilitado
          if (showSuccessToast) {
            toast.success(
              typeof successMessage === 'function' 
                ? successMessage(responseData) 
                : successMessage
            );
          }

          // Callback de éxito
          if (onSuccess) {
            onSuccess(responseData);
          }

          return responseData;
        }
      } catch (err) {
        // Ignorar errores de cancelación
        if (err.name === 'AbortError' || err.message?.includes('cancel')) {
          return;
        }

        if (isMountedRef.current) {
          const formattedError = formatError(err);
          setError(formattedError);
          setLoading(false);

          // Logging
          if (logErrors) {
            logError(err, apiFunction.name || 'useApi');
          }

          // Mostrar toast de error si está habilitado
          if (showErrorToast) {
            toast.error(formattedError.userMessage, {
              title: formattedError.type === 'VALIDATION' 
                ? 'Error de validación' 
                : 'Error',
            });
          }

          // Callback de error
          if (onError) {
            onError(formattedError);
          }

          throw formattedError;
        }
      }
    },
    [apiFunction, cache, onSuccess, onError, logErrors, showErrorToast, showSuccessToast, successMessage, toast]
  );

  /**
   * Reintentar la última petición
   */
  const retry = useCallback(() => {
    return execute();
  }, [execute]);

  /**
   * Limpiar el estado
   */
  const reset = useCallback(() => {
    setData(initialData);
    setError(null);
    setLoading(false);
    cacheRef.current = null;
  }, [initialData]);

  /**
   * Invalidar cache
   */
  const invalidateCache = useCallback(() => {
    cacheRef.current = null;
  }, []);

  // Ejecutar inmediatamente si immediate === true
  useEffect(() => {
    if (immediate) {
      execute();
    }
  }, []); // Solo al montar

  return {
    data,
    loading,
    error,
    execute,
    retry,
    reset,
    invalidateCache,
    executionCount,
    isSuccess: !loading && !error && data !== null,
    isError: !loading && error !== null,
    isIdle: !loading && !error && data === null,
  };
};

export default useApi;
