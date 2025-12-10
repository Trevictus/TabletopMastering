/**
 * @fileoverview Store de Grupos con Zustand
 * @description Gestión de estado global de grupos
 * @module stores/groupStore
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import groupService from '../services/groupService';
import { STORAGE_KEYS } from '../constants/auth';

/**
 * Store de grupos con Zustand
 * 
 * Proporciona:
 * - Lista de grupos del usuario
 * - Grupo seleccionado actualmente
 * - Métodos CRUD de grupos
 */
const useGroupStore = create(
  devtools(
    (set, get) => ({
      // Estado
      selectedGroup: null,
      groups: [],
      loading: false,
      error: null,

      /**
       * Carga los grupos del usuario autenticado
       */
      loadGroups: async () => {
        set({ loading: true, error: null });
        try {
          const response = await groupService.getMyGroups();
          const groups = response.data || [];
          set({ groups, loading: false });
          
          // Si hay un grupo guardado en sessionStorage, intentar seleccionarlo
          const savedGroupId = sessionStorage.getItem(STORAGE_KEYS.SELECTED_GROUP);
          if (savedGroupId && groups.length > 0) {
            const savedGroup = groups.find(g => g._id === savedGroupId);
            if (savedGroup) {
              set({ selectedGroup: savedGroup });
            }
          }
          
          return groups;
        } catch (err) {
          // Solo mostrar error si no es una petición cancelada
          if (err.name !== 'CanceledError') {
            set({ error: err.response?.data?.message || 'Error al cargar grupos', loading: false });
          }
          return [];
        }
      },

      /**
       * Selecciona un grupo como activo
       */
      selectGroup: (group) => {
        set({ selectedGroup: group });
        // Guardar en sessionStorage para persistencia en esta pestaña
        if (group) {
          sessionStorage.setItem(STORAGE_KEYS.SELECTED_GROUP, group._id);
        } else {
          sessionStorage.removeItem(STORAGE_KEYS.SELECTED_GROUP);
        }
      },

      /**
       * Crea un nuevo grupo
       */
      createGroup: async (groupData) => {
        set({ loading: true, error: null });
        try {
          const response = await groupService.createGroup(groupData);
          const newGroup = response.data;
          
          // Añadir el nuevo grupo a la lista
          set((state) => ({ 
            groups: [...state.groups, newGroup],
            selectedGroup: newGroup,
            loading: false 
          }));
          
          // Guardar como grupo seleccionado
          if (newGroup?._id) {
            sessionStorage.setItem(STORAGE_KEYS.SELECTED_GROUP, newGroup._id);
          }
          
          return response;
        } catch (err) {
          const errorMessage = err.response?.data?.message || 'Error al crear grupo';
          set({ error: errorMessage, loading: false });
          throw new Error(errorMessage);
        }
      },

      /**
       * Une al usuario a un grupo mediante código de invitación
       */
      joinGroup: async (inviteCode) => {
        set({ loading: true, error: null });
        try {
          const response = await groupService.joinGroup(inviteCode);
          // Recargar grupos después de unirse
          await get().loadGroups();
          set({ loading: false });
          return response;
        } catch (err) {
          const errorMessage = err.response?.data?.message || 'Error al unirse al grupo';
          set({ error: errorMessage, loading: false });
          throw new Error(errorMessage);
        }
      },

      /**
       * Actualiza un grupo existente
       */
      updateGroup: async (groupId, groupData) => {
        set({ loading: true, error: null });
        try {
          const response = await groupService.updateGroup(groupId, groupData);
          const updatedGroup = response.data;
          
          // Actualizar el grupo en la lista
          set((state) => ({
            groups: state.groups.map(g => g._id === groupId ? updatedGroup : g),
            selectedGroup: state.selectedGroup?._id === groupId ? updatedGroup : state.selectedGroup,
            loading: false
          }));
          
          return response;
        } catch (err) {
          const errorMessage = err.response?.data?.message || 'Error al actualizar grupo';
          set({ error: errorMessage, loading: false });
          throw new Error(errorMessage);
        }
      },

      /**
       * Elimina un grupo
       */
      deleteGroup: async (groupId) => {
        set({ loading: true, error: null });
        try {
          await groupService.deleteGroup(groupId);
          
          // Remover el grupo de la lista
          set((state) => ({
            groups: state.groups.filter(g => g._id !== groupId),
            selectedGroup: state.selectedGroup?._id === groupId ? null : state.selectedGroup,
            loading: false
          }));
          
          // Limpiar sessionStorage si era el grupo seleccionado
          const savedGroupId = sessionStorage.getItem(STORAGE_KEYS.SELECTED_GROUP);
          if (savedGroupId === groupId) {
            sessionStorage.removeItem(STORAGE_KEYS.SELECTED_GROUP);
          }
        } catch (err) {
          const errorMessage = err.response?.data?.message || 'Error al eliminar grupo';
          set({ error: errorMessage, loading: false });
          throw new Error(errorMessage);
        }
      },

      /**
       * Sale de un grupo
       */
      leaveGroup: async (groupId) => {
        set({ loading: true, error: null });
        try {
          await groupService.leaveGroup(groupId);
          
          // Remover el grupo de la lista
          set((state) => ({
            groups: state.groups.filter(g => g._id !== groupId),
            selectedGroup: state.selectedGroup?._id === groupId ? null : state.selectedGroup,
            loading: false
          }));
          
          // Limpiar sessionStorage si era el grupo seleccionado
          const savedGroupId = sessionStorage.getItem(STORAGE_KEYS.SELECTED_GROUP);
          if (savedGroupId === groupId) {
            sessionStorage.removeItem(STORAGE_KEYS.SELECTED_GROUP);
          }
        } catch (err) {
          const errorMessage = err.response?.data?.message || 'Error al salir del grupo';
          set({ error: errorMessage, loading: false });
          throw new Error(errorMessage);
        }
      },

      /**
       * Obtiene un grupo por ID
       */
      getGroupById: async (groupId) => {
        try {
          const response = await groupService.getGroupById(groupId);
          return response.data;
        } catch (err) {
          console.error('Error obteniendo grupo:', err);
          return null;
        }
      },

      /**
       * Limpia el error
       */
      clearError: () => set({ error: null }),

      /**
       * Resetea el store (útil al cerrar sesión)
       */
      reset: () => set({ 
        selectedGroup: null, 
        groups: [], 
        loading: false, 
        error: null 
      }),
    }),
    { name: 'group-store' }
  )
);

export default useGroupStore;
