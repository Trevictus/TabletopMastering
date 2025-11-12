import api from './api';

const groupService = {
  // Obtener todos los grupos del usuario
  getMyGroups: async () => {
    const response = await api.get('/groups');
    return response.data;
  },

  // Obtener detalles de un grupo específico
  getGroupById: async (groupId) => {
    const response = await api.get(`/groups/${groupId}`);
    return response.data;
  },

  // Crear un nuevo grupo
  createGroup: async (groupData) => {
    const response = await api.post('/groups', groupData);
    return response.data;
  },

  // Unirse a un grupo usando código de invitación
  joinGroup: async (inviteCode) => {
    const response = await api.post('/groups/join', { inviteCode });
    return response.data;
  },

  // Obtener miembros de un grupo
  getGroupMembers: async (groupId) => {
    const response = await api.get(`/groups/${groupId}/members`);
    return response.data;
  },

  // Actualizar grupo (solo admin)
  updateGroup: async (groupId, groupData) => {
    const response = await api.put(`/groups/${groupId}`, groupData);
    return response.data;
  },

  // Eliminar grupo (solo admin)
  deleteGroup: async (groupId) => {
    const response = await api.delete(`/groups/${groupId}`);
    return response.data;
  },
};

export default groupService;
