const Group = require('../models/Group');

/**
 * Middleware para verificar que el usuario sea miembro del grupo
 */
const isGroupMember = async (req, res, next) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Grupo no encontrado',
      });
    }

    if (!group.isActive) {
      return res.status(404).json({
        success: false,
        message: 'Grupo no encontrado',
      });
    }

    if (!group.isMember(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes acceso a este grupo',
      });
    }

    // Adjuntar el grupo al request para evitar búsquedas duplicadas
    req.group = group;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware para verificar que el usuario sea admin del grupo
 */
const isGroupAdmin = async (req, res, next) => {
  try {
    // Si ya tenemos el grupo del middleware anterior, usarlo
    let group = req.group;

    if (!group) {
      group = await Group.findById(req.params.id);

      if (!group) {
        return res.status(404).json({
          success: false,
          message: 'Grupo no encontrado',
        });
      }

      if (!group.isActive) {
        return res.status(404).json({
          success: false,
          message: 'Grupo no encontrado',
        });
      }
    }

    if (!group.isAdmin(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'Solo el administrador puede realizar esta acción',
      });
    }

    req.group = group;
    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware para verificar que el usuario sea admin o moderador del grupo
 */
const isGroupAdminOrModerator = async (req, res, next) => {
  try {
    // Si ya tenemos el grupo del middleware anterior, usarlo
    let group = req.group;

    if (!group) {
      group = await Group.findById(req.params.id);

      if (!group) {
        return res.status(404).json({
          success: false,
          message: 'Grupo no encontrado',
        });
      }

      if (!group.isActive) {
        return res.status(404).json({
          success: false,
          message: 'Grupo no encontrado',
        });
      }
    }

    if (!group.isAdminOrModerator(req.user._id)) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para realizar esta acción',
      });
    }

    req.group = group;
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  isGroupMember,
  isGroupAdmin,
  isGroupAdminOrModerator,
};
