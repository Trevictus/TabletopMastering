/**
 * @fileoverview Contexto de Grupos
 * @description Provee estado y métodos de gestión de grupos global
 * @module context/GroupContext
 */

import PropTypes from 'prop-types';
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import groupService from '../services/groupService';
import { STORAGE_KEYS } from '../constants/auth';

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
      
      // Si hay un grupo guardado en sessionStorage, intentar seleccionarlo
      const savedGroupId = sessionStorage.getItem(STORAGE_KEYS.SELECTED_GROUP);
      if (savedGroupId && response.data?.length > 0) {
        const savedGroup = response.data.find(g => g._id === savedGroupId);
        if (savedGroup) {
          setSelectedGroup(savedGroup);
        }
      }
      // No seleccionar automáticamente el primer grupo
      // El usuario debe elegir explícitamente
    } catch (err) {
      // Solo mostrar error si no es una petición cancelada
      if (err.name !== 'CanceledError') {
        setError(err.response?.data?.message || 'Error al cargar grupos');
      }
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
    // Guardar en sessionStorage para persistencia en esta pestaña
    if (group) {
      sessionStorage.setItem(STORAGE_KEYS.SELECTED_GROUP, group._id);
    } else {
      sessionStorage.removeItem(STORAGE_KEYS.SELECTED_GROUP);
    }
  }, []);

  /**
   * Restaura el grupo seleccionado desde sessionStorage
   */
  useEffect(() => {
    const savedGroupId = sessionStorage.getItem(STORAGE_KEYS.SELECTED_GROUP);
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
