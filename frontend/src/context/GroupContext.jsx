import PropTypes from 'prop-types';
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import groupService from '../services/groupService';

const GroupContext = createContext(null);

/**
 * Hook personalizado para acceder al contexto de grupos
 * @returns {Object} Contexto de grupos con selectedGroup, grupos y métodos
 * @throws {Error} Si se usa fuera del GroupProvider
 */
export const useGroup = () => {
  const context = useContext(GroupContext);
  if (!context) {
    throw new Error('useGroup debe ser usado dentro de un GroupProvider');
  }
  return context;
};

/**
 * Proveedor del contexto de grupos global
 * Maneja el grupo seleccionado actualmente y la lista de grupos del usuario
 */
export const GroupProvider = ({ children }) => {
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Carga los grupos del usuario autenticado
   */
  const loadGroups = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await groupService.getMyGroups();
      setGroups(response.data || []);
      
      // Si hay un grupo guardado en localStorage, intentar seleccionarlo
      const savedGroupId = localStorage.getItem('selectedGroupId');
      if (savedGroupId && response.data?.length > 0) {
        const savedGroup = response.data.find(g => g._id === savedGroupId);
        if (savedGroup) {
          setSelectedGroup(savedGroup);
        }
      }
      // No seleccionar automáticamente el primer grupo
      // El usuario debe elegir explícitamente
    } catch (err) {
      console.error('Error al cargar grupos:', err);
      setError(err.response?.data?.message || 'Error al cargar grupos');
    } finally {
      setLoading(false);
    }
  }, []); // Sin dependencias - es estable

  /**
   * Selecciona un grupo como activo
   * @param {Object} group - Grupo a seleccionar
   */
  const selectGroup = useCallback((group) => {
    setSelectedGroup(group);
    // Guardar en localStorage para persistencia
    if (group) {
      localStorage.setItem('selectedGroupId', group._id);
    } else {
      localStorage.removeItem('selectedGroupId');
    }
  }, []);

  /**
   * Restaura el grupo seleccionado desde localStorage
   */
  useEffect(() => {
    const savedGroupId = localStorage.getItem('selectedGroupId');
    if (savedGroupId && groups.length > 0 && !selectedGroup) {
      const group = groups.find(g => g._id === savedGroupId);
      if (group) {
        setSelectedGroup(group);
      }
    }
  }, [groups, selectedGroup]);

  /**
   * Limpia el error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Memoizar el valor del contexto
  const value = useMemo(
    () => ({
      selectedGroup,
      groups,
      loading,
      error,
      selectGroup,
      loadGroups,
      clearError,
    }),
    [selectedGroup, groups, loading, error, selectGroup, loadGroups, clearError]
  );

  return <GroupContext.Provider value={value}>{children}</GroupContext.Provider>;
};

GroupProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default GroupContext;
