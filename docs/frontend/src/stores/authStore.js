/**
 * @fileoverview Store de Autenticación con Zustand
 * @description Gestión de estado global de autenticación
 * @module stores/authStore
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import authService from '../services/authService';
import { STORAGE_KEYS } from '../constants/auth';

/**
 * Obtiene el usuario inicial de sessionStorage de forma segura
 */
const getInitialUser = () => {
  try {
    const storedUser = sessionStorage.getItem(STORAGE_KEYS.USER);
    const storedToken = sessionStorage.getItem(STORAGE_KEYS.TOKEN);
    if (storedUser && storedToken) {
      return JSON.parse(storedUser);
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * Verifica si hay token en sessionStorage
 */
const hasStoredToken = () => {
  return !!sessionStorage.getItem(STORAGE_KEYS.TOKEN);
};

/**
 * Store de autenticación con Zustand
 * 
 * Proporciona:
 * - Estado del usuario autenticado
 * - Métodos de login, register, logout
 * - Actualización de perfil
 * - Validación de sesión
 */
const useAuthStore = create(
  devtools(
    (set, get) => ({
      // Estado
      user: getInitialUser(),
      loading: false,
      error: null,
      initializing: hasStoredToken(),
      
      // Estado derivado (getter)
      get isAuthenticated() {
        return !!get().user;
      },

      /**
       * Inicializa la autenticación validando el token con el backend
       */
      initAuth: async () => {
        const token = sessionStorage.getItem(STORAGE_KEYS.TOKEN);
        
        if (!token) {
          set({ user: null, initializing: false });
          return;
        }

        try {
          const { user: currentUser } = await authService.getProfile();
          if (currentUser) {
            set({ user: currentUser });
            authService.syncUserData(currentUser);
          }
        } catch (err) {
          // Solo cerrar sesión si el token es explícitamente inválido
          if (err.response?.status === 401) {
            authService.logout();
            set({ 
              user: null, 
              error: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.' 
            });
          }
          // En caso de error de red, mantener la sesión local
        } finally {
          set({ initializing: false });
        }
      },

      /**
       * Inicia sesión con credenciales
       */
      login: async (credentials) => {
        set({ loading: true, error: null });
        try {
          const data = await authService.login(credentials);
          
          if (data.data?.user) {
            set({ user: data.data.user, loading: false });
            return data;
          }
          throw new Error('Respuesta de inicio de sesión inválida');
        } catch (err) {
          const errorMessage = err.response?.data?.message || err.message || 'Error al iniciar sesión';
          set({ error: errorMessage, loading: false });
          throw new Error(errorMessage);
        }
      },

      /**
       * Registra un nuevo usuario
       */
      register: async (userData) => {
        set({ loading: true, error: null });
        try {
          const data = await authService.register(userData);
          
          if (data.data?.user) {
            set({ user: data.data.user, loading: false });
            return data;
          }
          throw new Error('Respuesta de registro inválida');
        } catch (err) {
          const errorMessage = err.response?.data?.message || err.message || 'Error al registrarse';
          set({ error: errorMessage, loading: false });
          throw new Error(errorMessage);
        }
      },

      /**
       * Cierra la sesión del usuario
       */
      logout: () => {
        authService.logout();
        set({ user: null, error: null });
      },

      /**
       * Actualiza el perfil del usuario
       */
      updateProfile: async (profileData) => {
        set({ loading: true, error: null });
        try {
          const data = await authService.updateProfile(profileData);
          
          if (data.user) {
            set({ user: data.user, loading: false });
            return data;
          }
          throw new Error('Respuesta de actualización inválida');
        } catch (err) {
          const errorMessage = err.response?.data?.message || err.message || 'Error al actualizar perfil';
          set({ error: errorMessage, loading: false });
          throw new Error(errorMessage);
        }
      },

      /**
       * Refresca los datos del usuario desde el backend
       */
      refreshUser: async () => {
        try {
          const { user: updatedUser } = await authService.getProfile();
          if (updatedUser) {
            set({ user: updatedUser });
            authService.syncUserData(updatedUser);
          }
          return updatedUser;
        } catch (err) {
          console.error('Error refrescando usuario:', err);
          return null;
        }
      },

      /**
       * Limpia mensajes de error
       */
      clearError: () => set({ error: null }),

      /**
       * Setea el usuario manualmente (útil para actualizaciones externas)
       */
      setUser: (user) => set({ user }),
    }),
    { name: 'auth-store' }
  )
);

export default useAuthStore;
