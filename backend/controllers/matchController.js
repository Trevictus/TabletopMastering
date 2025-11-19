const Match = require('../models/Match');
const Group = require('../models/Group');
const Game = require('../models/Game');
const User = require('../models/User');

/**
 * @desc    Crear una partida
 * @route   POST /api/matches
 * @access  Private
 */
exports.createMatch = async (req, res, next) => {
  try {
    const { gameId, groupId, scheduledDate, location, playerIds, notes } = req.body;

    // Validaciones
    if (!gameId || !groupId || !scheduledDate) {
      return res.status(400).json({
        success: false,
        message: 'gameId, groupId y scheduledDate son obligatorios',
      });
    }

    // Verificar que el juego existe
    const game = await Game.findById(gameId).populate('group');
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Juego no encontrado',
      });
    }

    // Verificar que el grupo existe
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Grupo no encontrado',
      });
    }

    // Verificar que el usuario es miembro del grupo
    const isMember = group.members.some(
      member => member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'No eres miembro de este grupo',
      });
    }

    // Validar fecha
    if (new Date(scheduledDate) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'La fecha de la partida no puede ser en el pasado',
      });
    }

    // Preparar jugadores
    let players = [];
    if (playerIds && Array.isArray(playerIds) && playerIds.length > 0) {
      // Validar que todos los jugadores existen y son miembros del grupo
      for (const playerId of playerIds) {
        const user = await User.findById(playerId);
        if (!user) {
          return res.status(404).json({
            success: false,
            message: `Usuario ${playerId} no encontrado`,
          });
        }

        const isPlayerMember = group.members.some(
          member => member.user.toString() === playerId
        );
        if (!isPlayerMember) {
          return res.status(403).json({
            success: false,
            message: `El usuario ${user.name} no es miembro del grupo`,
          });
        }

        players.push({
          user: playerId,
          confirmed: playerId === req.user._id.toString(), // El creador está confirmado
        });
      }
    } else {
      // Al menos el creador de la partida
      players.push({
        user: req.user._id,
        confirmed: true,
      });
    }

    // Validar mínimo 2 jugadores
    if (players.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Una partida debe tener al menos 2 jugadores',
      });
    }

    // Crear la partida
    const match = await Match.create({
      game: gameId,
      group: groupId,
      scheduledDate,
      location: location || '',
      players,
      notes: notes || '',
      createdBy: req.user._id,
    });

    // Populate referencias
    await match.populate([
      { path: 'game', select: 'name image' },
      { path: 'group', select: 'name' },
      { path: 'players.user', select: 'name email avatar' },
      { path: 'createdBy', select: 'name email avatar' },
      { path: 'winner', select: 'name email avatar' },
    ]);

    res.status(201).json({
      success: true,
      message: 'Partida creada exitosamente',
      data: match,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Listar partidas (con filtros)
 * @route   GET /api/matches
 * @access  Private
 */
exports.getMatches = async (req, res, next) => {
  try {
    const { groupId, status, page = 1, limit = 20 } = req.query;

    // El usuario solo puede ver partidas de grupos a los que pertenece
    if (!groupId) {
      return res.status(400).json({
        success: false,
        message: 'groupId es obligatorio',
      });
    }

    // Verificar que el usuario es miembro del grupo
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Grupo no encontrado',
      });
    }

    const isMember = group.members.some(
      member => member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'No eres miembro de este grupo',
      });
    }

    // Construir filtro
    const filter = { group: groupId };
    if (status) {
      filter.status = status;
    }

    // Paginación
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Consulta
    const matches = await Match.find(filter)
      .populate([
        { path: 'game', select: 'name image' },
        { path: 'group', select: 'name' },
        { path: 'players.user', select: 'name email avatar' },
        { path: 'createdBy', select: 'name email avatar' },
        { path: 'winner', select: 'name email avatar' },
      ])
      .sort({ scheduledDate: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Total de documentos
    const total = await Match.countDocuments(filter);

    res.status(200).json({
      success: true,
      count: matches.length,
      total,
      pages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: matches,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener una partida por ID
 * @route   GET /api/matches/:id
 * @access  Private
 */
exports.getMatch = async (req, res, next) => {
  try {
    const { id } = req.params;

    const match = await Match.findById(id).populate([
      { path: 'game', select: 'name image description' },
      { path: 'group', select: 'name avatar' },
      { path: 'players.user', select: 'name email avatar' },
      { path: 'createdBy', select: 'name email avatar' },
      { path: 'winner', select: 'name email avatar' },
    ]);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Partida no encontrada',
      });
    }

    // Verificar permiso de acceso
    const group = await Group.findById(match.group._id);
    const isMember = group.members.some(
      member => member.user.toString() === req.user._id.toString()
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para ver esta partida',
      });
    }

    res.status(200).json({
      success: true,
      data: match,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Actualizar partida
 * @route   PUT /api/matches/:id
 * @access  Private
 */
exports.updateMatch = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { scheduledDate, location, notes } = req.body;

    const match = await Match.findById(id);
    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Partida no encontrada',
      });
    }

    // Solo el creador o admin del grupo puede editar
    const isCreator = match.createdBy.toString() === req.user._id.toString();
    const group = await Group.findById(match.group);
    const isGroupAdmin = group.admin.toString() === req.user._id.toString();

    if (!isCreator && !isGroupAdmin) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para editar esta partida',
      });
    }

    // Validar fecha si se proporciona
    if (scheduledDate && new Date(scheduledDate) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'La fecha de la partida no puede ser en el pasado',
      });
    }

    // Actualizar campos permitidos (no actualizar durante partida en curso)
    if (match.status === 'en_curso') {
      return res.status(400).json({
        success: false,
        message: 'No puedes editar una partida en curso',
      });
    }

    if (scheduledDate) match.scheduledDate = scheduledDate;
    if (location !== undefined) match.location = location;
    if (notes !== undefined) match.notes = notes;

    await match.save();

    await match.populate([
      { path: 'game', select: 'name image' },
      { path: 'group', select: 'name' },
      { path: 'players.user', select: 'name email avatar' },
      { path: 'createdBy', select: 'name email avatar' },
      { path: 'winner', select: 'name email avatar' },
    ]);

    res.status(200).json({
      success: true,
      message: 'Partida actualizada exitosamente',
      data: match,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Registrar resultados de partida
 * @route   POST /api/matches/:id/finish
 * @access  Private
 */
exports.finishMatch = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { winnerId, results, duration } = req.body;

    const match = await Match.findById(id);
    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Partida no encontrada',
      });
    }

    // Solo el creador o admin del grupo puede terminar
    const isCreator = match.createdBy.toString() === req.user._id.toString();
    const group = await Group.findById(match.group);
    const isGroupAdmin = group.admin.toString() === req.user._id.toString();

    if (!isCreator && !isGroupAdmin) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para terminar esta partida',
      });
    }

    // Validar que la partida no esté ya finalizada
    if (match.status === 'finalizada') {
      return res.status(400).json({
        success: false,
        message: 'Esta partida ya ha sido finalizada',
      });
    }

    // Validar winner si se proporciona
    if (winnerId) {
      const winnerExists = match.players.some(p => p.user.toString() === winnerId);
      if (!winnerExists) {
        return res.status(400).json({
          success: false,
          message: 'El ganador debe ser uno de los jugadores de la partida',
        });
      }
      match.winner = winnerId;
    }

    // Actualizar resultados si se proporcionan
    if (results && Array.isArray(results)) {
      for (const result of results) {
        const playerIndex = match.players.findIndex(
          p => p.user.toString() === result.userId
        );

        if (playerIndex !== -1) {
          if (result.score !== undefined) {
            match.players[playerIndex].score = result.score;
          }
          if (result.position !== undefined) {
            match.players[playerIndex].position = result.position;
          }
          if (result.pointsEarned !== undefined) {
            match.players[playerIndex].pointsEarned = result.pointsEarned;
          }
        }
      }
    }

    // Actualizar duración y estado
    if (duration) {
      match.duration = duration;
    }

    match.status = 'finalizada';
    match.actualDate = new Date();

    await match.save();

    await match.populate([
      { path: 'game', select: 'name image' },
      { path: 'group', select: 'name' },
      { path: 'players.user', select: 'name email avatar' },
      { path: 'createdBy', select: 'name email avatar' },
      { path: 'winner', select: 'name email avatar' },
    ]);

    res.status(200).json({
      success: true,
      message: 'Partida finalizada y resultados registrados',
      data: match,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Confirmar asistencia a partida
 * @route   POST /api/matches/:id/confirm
 * @access  Private
 */
exports.confirmAttendance = async (req, res, next) => {
  try {
    const { id } = req.params;

    const match = await Match.findById(id);
    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Partida no encontrada',
      });
    }

    // El usuario debe ser uno de los jugadores
    const playerIndex = match.players.findIndex(
      p => p.user.toString() === req.user._id.toString()
    );

    if (playerIndex === -1) {
      return res.status(403).json({
        success: false,
        message: 'No estás invitado a esta partida',
      });
    }

    // No confirmar si la partida ya finalizó
    if (match.status === 'finalizada' || match.status === 'cancelada') {
      return res.status(400).json({
        success: false,
        message: `No puedes confirmar una partida ${match.status}`,
      });
    }

    // Confirmar asistencia
    match.players[playerIndex].confirmed = true;

    await match.save();

    await match.populate([
      { path: 'game', select: 'name image' },
      { path: 'group', select: 'name' },
      { path: 'players.user', select: 'name email avatar' },
      { path: 'createdBy', select: 'name email avatar' },
      { path: 'winner', select: 'name email avatar' },
    ]);

    res.status(200).json({
      success: true,
      message: 'Asistencia confirmada',
      data: match,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Eliminar partida
 * @route   DELETE /api/matches/:id
 * @access  Private
 */
exports.deleteMatch = async (req, res, next) => {
  try {
    const { id } = req.params;

    const match = await Match.findById(id);
    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Partida no encontrada',
      });
    }

    // Solo el creador o admin del grupo puede eliminar
    const isCreator = match.createdBy.toString() === req.user._id.toString();
    const group = await Group.findById(match.group);
    const isGroupAdmin = group.admin.toString() === req.user._id.toString();

    if (!isCreator && !isGroupAdmin) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para eliminar esta partida',
      });
    }

    // No eliminar partidas finalizadas
    if (match.status === 'finalizada') {
      return res.status(400).json({
        success: false,
        message: 'No puedes eliminar una partida finalizada',
      });
    }

    await Match.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: 'Partida eliminada exitosamente',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};
