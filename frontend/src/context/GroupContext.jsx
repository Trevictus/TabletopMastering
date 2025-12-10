/**
 * @fileoverview Contexto de Grupos (Wrapper sobre Zustand)
 * @description Provee compatibilidad con componentes existentes que usan useGroup
 * @module context/GroupContext
 */

import PropTypes from 'prop-types';
import { createContext } from 'react';
import useGroupStore from '../stores/groupStore';

const GroupContext = createContext(null);

/**
 * Hook personalizado para acceder al contexto de grupos
 * Actúa como wrapper sobre el store de Zustand para compatibilidad
 * @returns {Object} Contexto de grupos
 */
export const useGroup = () => {
  // Usar directamente el store de Zustand
  const selectedGroup = useGroupStore((state) => state.selectedGroup);
  const groups = useGroupStore((state) => state.groups);
  const loading = useGroupStore((state) => state.loading);
  const error = useGroupStore((state) => state.error);
  const selectGroup = useGroupStore((state) => state.selectGroup);
  const loadGroups = useGroupStore((state) => state.loadGroups);
  const clearError = useGroupStore((state) => state.clearError);
  
  return {
    selectedGroup,
    groups,
    loading,
    error,
    selectGroup,
    loadGroups,
    clearError,
  };
};

/**
 * Proveedor del contexto de grupos
 * Mantiene compatibilidad con el sistema anterior
 */
export const GroupProvider = ({ children }) => {
  // El valor del contexto es solo un marcador para verificar el provider
  return (
    <GroupContext.Provider value={true}>
      {children}
    </GroupContext.Provider>
  );
};

GroupProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default GroupContext;
