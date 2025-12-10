/**
 * @fileoverview Utilidades de Grupos
 * @description Funciones auxiliares para gestión de grupos y miembros
 * @module utils/groupHelpers
 * @requires ../models/Group
 * @requires ../models/User
 */

const Group = require('../models/Group');
const User = require('../models/User');

/**
 * Genera un código de invitación único (optimizado con exists)
 * @returns {Promise<string>} Código de invitación único
 */
const generateUniqueInviteCode = async () => {
  let inviteCode;
  let isUnique = false;
  let attempts = 0;
  const maxAttempts = 10;

  while (!isUnique && attempts < maxAttempts) {
    inviteCode = Group.generateInviteCode();
    // Usar exists en lugar de findOne (más eficiente)
    const exists = await Group.exists({ inviteCode });
    if (!exists) {
      isUnique = true;
    }
    attempts++;
  }

  if (!isUnique) {
    throw new Error('No se pudo generar un código de invitación único');
  }

  return inviteCode;
};

/**
 * Añade un grupo al array de grupos del usuario (ya optimizado con $addToSet)
 * @param {ObjectId} userId - ID del usuario
 * @param {ObjectId} groupId - ID del grupo
 */
const addGroupToUser = async (userId, groupId) => {
  await User.updateOne(
    { _id: userId },
    { $addToSet: { groups: groupId } }
  );
};

/**
 * Remueve un grupo del array de grupos del usuario
 * @param {ObjectId} userId - ID del usuario
 * @param {ObjectId} groupId - ID del grupo
 */
const removeGroupFromUser = async (userId, groupId) => {
  await User.updateOne(
    { _id: userId },
    { $pull: { groups: groupId } }
  );
};

/**
 * Remueve un grupo del array de grupos de todos los miembros
 * @param {Array} memberIds - Array de IDs de usuarios
 * @param {ObjectId} groupId - ID del grupo
 */
const removeGroupFromAllMembers = async (memberIds, groupId) => {
  await User.updateMany(
    { _id: { $in: memberIds } },
    { $pull: { groups: groupId } }
  );
};

/**
 * Añade un miembro al grupo
 * @param {Object} group - Instancia del grupo
 * @param {ObjectId} userId - ID del usuario a añadir
 * @param {string} role - Rol del usuario (opcional, por defecto 'member')
 */
const addMemberToGroup = async (group, userId, role = 'member') => {
  if (group.isMember(userId)) {
    throw new Error('El usuario ya es miembro del grupo');
  }

  if (!group.canAcceptMoreMembers()) {
    throw new Error('El grupo ha alcanzado el límite de miembros');
  }

  group.members.push({
    user: userId,
    role,
  });

  await group.save();
  await addGroupToUser(userId, group._id);

  return group;
};

/**
 * Remueve un miembro del grupo
 * @param {Object} group - Instancia del grupo
 * @param {ObjectId} userId - ID del usuario a remover
 */
const removeMemberFromGroup = async (group, userId) => {
  if (group.isAdmin(userId)) {
    throw new Error('No se puede expulsar al administrador del grupo');
  }

  const memberIndex = group.members.findIndex((member) => member.user.equals(userId));

  if (memberIndex === -1) {
    throw new Error('El usuario no es miembro del grupo');
  }

  group.members.splice(memberIndex, 1);
  await group.save();
  await removeGroupFromUser(userId, group._id);

  return group;
};

/**
 * Opciones de populate estándar para grupos (incluye datos completos de miembros)
 */
const groupPopulateOptions = [
  { path: 'admin', select: '_id name email avatar stats' },
  { path: 'members.user', select: '_id name email avatar stats' },
];

/**
 * Opciones de populate simplificadas para listados (incluye _id para comparaciones)
 */
const groupPopulateOptionsSimple = [
  { path: 'admin', select: '_id name avatar' },
  { path: 'members.user', select: '_id name avatar' },
];

/**
 * Opciones de populate para listados (mínimo necesario)
 */
const groupPopulateOptionsList = [
  { path: 'admin', select: '_id name' },
];

module.exports = {
  generateUniqueInviteCode,
  addGroupToUser,
  removeGroupFromUser,
  removeGroupFromAllMembers,
  addMemberToGroup,
  removeMemberFromGroup,
  groupPopulateOptions,
  groupPopulateOptionsSimple,
  groupPopulateOptionsList,
};
