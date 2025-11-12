const Group = require('../models/Group');
const User = require('../models/User');

/**
 * @desc    Crear un nuevo grupo
 * @route   POST /api/groups
 * @access  Private
 */
const createGroup = async (req, res, next) => {
  try {
    const { name, description, avatar, settings } = req.body;

    // Generar código de invitación único
    let inviteCode;
    let isUnique = false;

    while (!isUnique) {
      inviteCode = Group.generateInviteCode();
      const existingGroup = await Group.findOne({ inviteCode });
      if (!existingGroup) {
        isUnique = true;
      }
    }

    // Crear el grupo
    const group = await Group.create({
      name,
      description,
      avatar,
      inviteCode,
      admin: req.user._id,
      settings,
    });

    // Añadir el grupo al array de grupos del usuario
    await User.findByIdAndUpdate(req.user._id, {
      $push: { groups: group._id },
    });

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
      .populate('admin', 'name email avatar')
      .populate('members.user', 'name email avatar')
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
    const group = await Group.findById(req.params.id)
      .populate('admin', 'name email avatar')
      .populate('members.user', 'name email avatar stats');

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Grupo no encontrado',
      });
    }

    // Verificar que el usuario sea miembro del grupo
    const isMember = group.members.some((member) => member.user._id.equals(req.user._id));

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'No tienes acceso a este grupo',
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

/**
 * @desc    Unirse a un grupo mediante código de invitación
 * @route   POST /api/groups/join
 * @access  Private
 */
const joinGroup = async (req, res, next) => {
  try {
    const { inviteCode } = req.body;

    const group = await Group.findOne({ inviteCode, isActive: true });

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Código de invitación inválido',
      });
    }

    // Verificar si ya es miembro
    const isMember = group.members.some((member) => member.user.equals(req.user._id));

    if (isMember) {
      return res.status(400).json({
        success: false,
        message: 'Ya eres miembro de este grupo',
      });
    }

    // Verificar límite de miembros
    if (group.members.length >= group.settings.maxMembers) {
      return res.status(400).json({
        success: false,
        message: 'El grupo ha alcanzado el límite de miembros',
      });
    }

    // Añadir al usuario al grupo
    group.members.push({
      user: req.user._id,
      role: 'member',
    });

    await group.save();

    // Añadir el grupo al array de grupos del usuario
    await User.findByIdAndUpdate(req.user._id, {
      $push: { groups: group._id },
    });

    res.status(200).json({
      success: true,
      message: 'Te has unido al grupo exitosamente',
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
  joinGroup,
};
