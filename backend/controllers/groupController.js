const Group = require('../models/Group');
const User = require('../models/User');
const Match = require('../models/Match');
const {
  generateUniqueInviteCode,
  addGroupToUser,
  removeGroupFromUser,
  removeGroupFromAllMembers,
  addMemberToGroup,
  removeMemberFromGroup,
  groupPopulateOptions,
  groupPopulateOptionsSimple,
} = require('../utils/groupHelpers');

// Límite máximo de grupos por usuario
const MAX_GROUPS_PER_USER = 7;

/**
 * @desc    Crear un nuevo grupo
 * @route   POST /api/groups
 * @access  Private
 */
const createGroup = async (req, res, next) => {
  try {
    const { name, description, avatar, settings } = req.body;

    // Verificar límite de grupos del usuario
    const userGroupCount = await Group.countDocuments({
      'members.user': req.user._id,
      isActive: true
    });

    if (userGroupCount >= MAX_GROUPS_PER_USER) {
      return res.status(400).json({
        success: false,
        message: `Has alcanzado el límite máximo de ${MAX_GROUPS_PER_USER} grupos`,
      });
    }

    // Generar código de invitación único
    const inviteCode = await generateUniqueInviteCode();

    // Crear el grupo (el middleware pre-save añade automáticamente al admin como miembro)
    const group = await Group.create({
      name,
      description,
      avatar,
      inviteCode,
      admin: req.user._id,
      settings,
    });

    // Añadir el grupo al array de grupos del usuario
    await addGroupToUser(req.user._id, group._id);

    // Populate para devolver datos completos
    await group.populate(groupPopulateOptions);

    res.status(201).json({
      success: true,
      message: 'Grupo creado exitosamente',
      data: group,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener todos los grupos del usuario
 * @route   GET /api/groups
 * @access  Private
 */
const getMyGroups = async (req, res, next) => {
  try {
    const groups = await Group.find({
      'members.user': req.user._id,
      isActive: true,
    })
      .populate(groupPopulateOptionsSimple)
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: groups.length,
      data: groups,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener un grupo por ID
 * @route   GET /api/groups/:id
 * @access  Private
 */
const getGroup = async (req, res, next) => {
  try {
    // El grupo ya viene del middleware isGroupMember
    const group = req.group || await Group.findById(req.params.id)
      .populate(groupPopulateOptions);

    res.status(200).json({
      success: true,
      data: group,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Unirse a un grupo mediante código de invitación
 * @route   POST /api/groups/join
 * @access  Private
 */
const joinGroup = async (req, res, next) => {
  try {
    const { inviteCode } = req.body;

    const group = await Group.findOne({ inviteCode: inviteCode.toUpperCase(), isActive: true });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Código de invitación inválido',
      });
    }

    // Verificar si ya es miembro
    if (group.isMember(req.user._id)) {
      return res.status(400).json({
        success: false,
        message: 'Ya eres miembro de este grupo',
      });
    }

    // Verificar límite de grupos del usuario
    const userGroupCount = await Group.countDocuments({
      'members.user': req.user._id,
      isActive: true
    });

    if (userGroupCount >= MAX_GROUPS_PER_USER) {
      return res.status(400).json({
        success: false,
        message: `Has alcanzado el límite máximo de ${MAX_GROUPS_PER_USER} grupos`,
      });
    }

    // Verificar límite de miembros
    if (!group.canAcceptMoreMembers()) {
      return res.status(400).json({
        success: false,
        message: 'El grupo ha alcanzado el límite de miembros',
      });
    }

    // Añadir al usuario al grupo
    await addMemberToGroup(group, req.user._id);

    // Populate para devolver datos completos
    await group.populate(groupPopulateOptions);

    res.status(200).json({
      success: true,
      message: 'Te has unido al grupo exitosamente',
      data: group,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Actualizar información del grupo
 * @route   PUT /api/groups/:id
 * @access  Private (Admin del grupo)
 */
const updateGroup = async (req, res, next) => {
  try {
    const { name, description, avatar, settings } = req.body;

    // El grupo ya viene del middleware isGroupAdmin
    const group = req.group || await Group.findById(req.params.id);

    // Actualizar campos
    if (name) group.name = name;
    if (description !== undefined) group.description = description;
    if (avatar !== undefined) group.avatar = avatar;
    if (settings) {
      if (settings.isPrivate !== undefined) group.settings.isPrivate = settings.isPrivate;
      if (settings.maxMembers !== undefined) {
        // Validar que el nuevo límite no sea menor que el número actual de miembros
        if (settings.maxMembers < group.memberCount) {
          return res.status(400).json({
            success: false,
            message: `No puedes establecer un límite menor al número actual de miembros (${group.memberCount})`,
          });
        }
        group.settings.maxMembers = settings.maxMembers;
      }
      if (settings.requireApproval !== undefined) {
        group.settings.requireApproval = settings.requireApproval;
      }
    }

    await group.save();
    await group.populate(groupPopulateOptions);

    res.status(200).json({
      success: true,
      message: 'Grupo actualizado exitosamente',
      data: group,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Regenerar código de invitación
 * @route   PUT /api/groups/:id/invite-code
 * @access  Private (Admin del grupo)
 */
const regenerateInviteCode = async (req, res, next) => {
  try {
    // El grupo ya viene del middleware isGroupAdmin
    const group = req.group || await Group.findById(req.params.id);

    // Generar nuevo código único
    group.inviteCode = await generateUniqueInviteCode();
    await group.save();

    res.status(200).json({
      success: true,
      message: 'Código de invitación regenerado exitosamente',
      data: {
        inviteCode: group.inviteCode,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener miembros del grupo
 * @route   GET /api/groups/:id/members
 * @access  Private (Miembro del grupo)
 */
const getMembers = async (req, res, next) => {
  try {
    // El grupo ya viene del middleware isGroupMember
    let group = req.group;
    
    if (!group) {
      group = await Group.findById(req.params.id)
        .populate('members.user', 'name email avatar stats createdAt');
    } else if (!group.members[0].user.name) {
      // Si el grupo no tiene los miembros populados, popular
      await group.populate('members.user', 'name email avatar stats createdAt');
    }

    res.status(200).json({
      success: true,
      count: group.memberCount,
      data: group.members,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Expulsar miembro del grupo
 * @route   DELETE /api/groups/:id/members/:userId
 * @access  Private (Admin del grupo)
 */
const removeMember = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // El grupo ya viene del middleware isGroupAdmin
    const group = req.group || await Group.findById(req.params.id);

    try {
      await removeMemberFromGroup(group, userId);

      res.status(200).json({
        success: true,
        message: 'Miembro expulsado exitosamente',
      });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Salir del grupo
 * @route   DELETE /api/groups/:id/leave
 * @access  Private (Miembro del grupo)
 */
const leaveGroup = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id).populate('members.user', 'name');

    if (!group || !group.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Grupo no encontrado',
      });
    }

    // Verificar que el usuario sea miembro
    if (!group.isMember(req.user._id)) {
      return res.status(404).json({
        success: false,
        message: 'No eres miembro de este grupo',
      });
    }

    // Si es admin y hay más miembros, transferir admin al miembro más antiguo
    if (group.isAdmin(req.user._id)) {
      const otherMembers = group.members.filter(
        m => m.user._id.toString() !== req.user._id.toString()
      );
      
      if (otherMembers.length > 0) {
        // Ordenar por fecha de unión y asignar al más antiguo
        otherMembers.sort((a, b) => new Date(a.joinedAt) - new Date(b.joinedAt));
        const newAdmin = otherMembers[0];
        
        group.admin = newAdmin.user._id;
        newAdmin.role = 'admin';
        await group.save();
      }
      // Si no hay otros miembros, el grupo quedará sin admin (o se podría eliminar)
    }

    // Eliminar miembro
    await removeMemberFromGroup(group, req.user._id);

    res.status(200).json({
      success: true,
      message: 'Has salido del grupo exitosamente',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Eliminar grupo
 * @route   DELETE /api/groups/:id
 * @access  Private (Admin del grupo)
 */
const deleteGroup = async (req, res, next) => {
  try {
    // El grupo ya viene del middleware isGroupAdmin
    const group = req.group || await Group.findById(req.params.id);

    // Marcar como inactivo en lugar de eliminar (soft delete)
    group.isActive = false;
    await group.save();

    // Remover el grupo del array de grupos de todos los usuarios
    const memberIds = group.members.map((member) => member.user);
    await removeGroupFromAllMembers(memberIds, group._id);

    res.status(200).json({
      success: true,
      message: 'Grupo eliminado exitosamente',
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Invitar usuario a un grupo por email
 * @route   POST /api/groups/:id/invite
 * @access  Private (Admin del grupo)
 */
const inviteUserToGroup = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Validar que el email esté presente
    if (!email || !email.trim()) {
      return res.status(400).json({
        success: false,
        message: 'El email es obligatorio',
      });
    }

    // El grupo ya viene del middleware isGroupAdmin
    const group = req.group || await Group.findById(req.params.id);

    if (!group || !group.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Grupo no encontrado',
      });
    }

    // Buscar el usuario por email
    const userToInvite = await User.findOne({ email: email.toLowerCase() });

    if (!userToInvite) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado con ese email',
      });
    }

    // Verificar si ya es miembro
    if (group.isMember(userToInvite._id)) {
      return res.status(400).json({
        success: false,
        message: 'Este usuario ya es miembro del grupo',
      });
    }

    // Verificar límite de miembros
    if (!group.canAcceptMoreMembers()) {
      return res.status(400).json({
        success: false,
        message: 'El grupo ha alcanzado el límite de miembros',
      });
    }

    // Añadir al usuario al grupo
    await addMemberToGroup(group, userToInvite._id);

    // Populate para devolver datos completos
    await group.populate(groupPopulateOptions);

    res.status(200).json({
      success: true,
      message: `Usuario ${userToInvite.name} invitado al grupo exitosamente`,
      data: group,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener información pública de un grupo por ID (sin requerir ser miembro)
 * @route   GET /api/groups/public/:id
 * @access  Public
 */
const getGroupPublic = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate(groupPopulateOptions);

    if (!group || !group.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Grupo no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      data: group,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createGroup,
  getMyGroups,
  getGroup,
  getGroupPublic,
  joinGroup,
  updateGroup,
  regenerateInviteCode,
  getMembers,
  removeMember,
  leaveGroup,
  deleteGroup,
  inviteUserToGroup,
};
