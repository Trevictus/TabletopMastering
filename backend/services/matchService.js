const Match = require('../models/Match');
const Group = require('../models/Group');
const Game = require('../models/Game');
const User = require('../models/User');
const pointsCalculator = require('./pointsCalculator');
const rankingService = require('./rankingService');

/**
 * Constantes de populate
 */
const MATCH_POPULATE_OPTIONS = [
  { path: 'game', select: 'name image' },
  { path: 'group', select: 'name' },
  { path: 'players.user', select: 'name email avatar' },
  { path: 'createdBy', select: 'name email avatar' },
  { path: 'winner', select: 'name email avatar' },
];

const MATCH_POPULATE_DETAILED = [
  { path: 'game', select: 'name image description' },
  { path: 'group', select: 'name avatar' },
  { path: 'players.user', select: 'name email avatar' },
  { path: 'createdBy', select: 'name email avatar' },
  { path: 'winner', select: 'name email avatar' },
];

/**
 * Validar que el usuario es miembro del grupo
 */
exports.validateGroupMembership = async (groupId, userId) => {
  const group = await Group.findById(groupId);
  if (!group) {
    throw { status: 404, message: 'Grupo no encontrado' };
  }

  const isMember = group.members.some(
    member => member.user.toString() === userId.toString()
  );

  if (!isMember) {
    throw { status: 403, message: 'No eres miembro de este grupo' };
  }

  return group;
};

/**
 * Crear una partida
 */
exports.createMatch = async (gameId, groupId, scheduledDate, userId, playerIds = [], location = '', notes = '') => {
  // Validaciones
  if (!gameId || !groupId || !scheduledDate) {
    throw new Error('gameId, groupId y scheduledDate son obligatorios');
  }

  // Verificar que el juego existe
  const game = await Game.findById(gameId).populate('group');
  if (!game) {
    throw { status: 404, message: 'Juego no encontrado' };
  }

  // Verificar que el grupo existe y el usuario es miembro
  const group = await this.validateGroupMembership(groupId, userId);

  // Validar fecha
  if (new Date(scheduledDate) < new Date()) {
    throw new Error('La fecha de la partida no puede ser en el pasado');
  }

  // Preparar jugadores
  let players = [];
  const userIdStr = userId.toString();
  
  // Asegurar que el creador siempre esté incluido
  const uniquePlayerIds = new Set();
  if (playerIds && Array.isArray(playerIds) && playerIds.length > 0) {
    playerIds.forEach(id => uniquePlayerIds.add(id.toString()));
  }
  // Agregar el creador si no está en la lista
  if (!uniquePlayerIds.has(userIdStr)) {
    uniquePlayerIds.add(userIdStr);
  }
  
  // Validar que todos los jugadores existen y son miembros del grupo
  for (const playerId of uniquePlayerIds) {
    const user = await User.findById(playerId);
    if (!user) {
      throw { status: 404, message: `Usuario ${playerId} no encontrado` };
    }

    const isPlayerMember = group.members.some(
      member => member.user.toString() === playerId
    );
    if (!isPlayerMember) {
      throw { status: 403, message: `El usuario ${user.name} no es miembro del grupo` };
    }

    players.push({
      user: playerId,
      confirmed: playerId === userIdStr,
    });
  }

  // Validar mínimo 2 jugadores
  if (players.length < 2) {
    throw { status: 400, message: 'Una partida debe tener al menos 2 jugadores' };
  }

  // Crear la partida
  const match = await Match.create({
    game: gameId,
    group: groupId,
    scheduledDate,
    location,
    players,
    notes,
    createdBy: userId,
  });

  // Populate referencias
  await match.populate(MATCH_POPULATE_OPTIONS);

  return match;
};

/**
 * Listar partidas con filtros
 */
exports.getMatches = async (groupId, userId, status = null, page = 1, limit = 20) => {
  // Construir filtro
  const filter = {};
  
  // Si se proporciona groupId, validar membresía y filtrar por grupo
  if (groupId) {
    await this.validateGroupMembership(groupId, userId);
    filter.group = groupId;
  } else {
    // Si no hay groupId, obtener todas las partidas donde el usuario es jugador
    // Primero obtener todos los grupos del usuario
    const userGroups = await Group.find({
      'members.user': userId
    }).select('_id');
    
    const groupIds = userGroups.map(g => g._id);
    filter.group = { $in: groupIds };
  }
  
  if (status) {
    filter.status = status;
  }

  // Paginación
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Consulta
  const matches = await Match.find(filter)
    .populate(MATCH_POPULATE_OPTIONS)
    .sort({ scheduledDate: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  // Total de documentos
  const total = await Match.countDocuments(filter);

  return {
    matches,
    count: matches.length,
    total,
    pages: Math.ceil(total / parseInt(limit)),
    currentPage: parseInt(page),
  };
};

/**
 * Obtener una partida por ID con acceso verificado
 */
exports.getMatchById = async (matchId, userId) => {
  const match = await Match.findById(matchId).populate(MATCH_POPULATE_DETAILED);

  if (!match) {
    throw { status: 404, message: 'Partida no encontrada' };
  }

  // Verificar permiso de acceso
  const group = await Group.findById(match.group._id);
  const isMember = group.members.some(
    member => member.user.toString() === userId.toString()
  );

  if (!isMember) {
    throw { status: 403, message: 'No tienes permiso para ver esta partida' };
  }

  return match;
};

/**
 * Actualizar una partida
 */
exports.updateMatch = async (matchId, updates, userId) => {
  const match = await Match.findById(matchId);
  if (!match) {
    throw { status: 404, message: 'Partida no encontrada' };
  }

  // Solo el creador o admin del grupo puede editar
  const isCreator = match.createdBy.toString() === userId.toString();
  const group = await Group.findById(match.group);
  const isGroupAdmin = group.admin.toString() === userId.toString();

  if (!isCreator && !isGroupAdmin) {
    throw { status: 403, message: 'No tienes permiso para editar esta partida' };
  }

  // No actualizar durante partida en curso
  if (match.status === 'en_curso') {
    throw new Error('No puedes editar una partida en curso');
  }

  // Validar fecha si se proporciona
  const { scheduledDate, location, notes } = updates;
  if (scheduledDate && new Date(scheduledDate) < new Date()) {
    throw new Error('La fecha de la partida no puede ser en el pasado');
  }

  // Actualizar campos permitidos
  if (scheduledDate) match.scheduledDate = scheduledDate;
  if (location !== undefined) match.location = location;
  if (notes !== undefined) match.notes = notes;

  await match.save();
  await match.populate(MATCH_POPULATE_OPTIONS);

  return match;
};

/**
 * Finalizar una partida y registrar resultados
 */
exports.finishMatch = async (matchId, userId, winnerId = null, results = [], duration = null) => {
  const match = await Match.findById(matchId);
  if (!match) {
    throw { status: 404, message: 'Partida no encontrada' };
  }

  // Solo el creador o admin del grupo puede terminar
  const isCreator = match.createdBy.toString() === userId.toString();
  const group = await Group.findById(match.group);
  const isGroupAdmin = group.admin.toString() === userId.toString();

  if (!isCreator && !isGroupAdmin) {
    throw { status: 403, message: 'No tienes permiso para terminar esta partida' };
  }

  // Validar que la partida no esté ya finalizada
  if (match.status === 'finalizada') {
    throw new Error('Esta partida ya ha sido finalizada');
  }

  // Validar winner si se proporciona
  if (winnerId) {
    const winnerExists = match.players.some(p => p.user.toString() === winnerId);
    if (!winnerExists) {
      throw new Error('El ganador debe ser uno de los jugadores de la partida');
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
      }
    }
  }

  // Validar posiciones si existen
  const positionsToValidate = match.players.filter(p => p.position !== undefined && p.position !== null);
  if (positionsToValidate.length > 0) {
    if (!pointsCalculator.validatePositions(match.players)) {
      throw new Error('No puede haber posiciones duplicadas');
    }

    // Calcular puntos automáticamente basado en posiciones
    const pointsData = pointsCalculator.calculatePointsForAllPlayers(match.players);
    pointsData.forEach(data => {
      const playerIndex = match.players.findIndex(
        p => p.user.toString() === data.userId.toString()
      );
      if (playerIndex !== -1) {
        match.players[playerIndex].pointsEarned = data.points;
      }
    });
  }

  // Actualizar duración y estado
  if (duration) {
    match.duration = duration;
  }

  match.status = 'finalizada';
  match.actualDate = new Date();

  await match.save();

  // Actualizar ranking automáticamente
  const rankingReport = await rankingService.updateMatchStatistics(match);

  await match.populate(MATCH_POPULATE_OPTIONS);

  return { match, rankingReport };
};

/**
 * Confirmar asistencia a partida
 */
exports.confirmAttendance = async (matchId, userId) => {
  const match = await Match.findById(matchId);
  if (!match) {
    throw { status: 404, message: 'Partida no encontrada' };
  }

  // El usuario debe ser uno de los jugadores
  const playerIndex = match.players.findIndex(
    p => p.user.toString() === userId.toString()
  );

  if (playerIndex === -1) {
    throw { status: 403, message: 'No estás invitado a esta partida' };
  }

  // No confirmar si la partida ya finalizó
  if (match.status === 'finalizada' || match.status === 'cancelada') {
    throw new Error(`No puedes confirmar una partida ${match.status}`);
  }

  // Confirmar asistencia
  match.players[playerIndex].confirmed = true;

  await match.save();
  await match.populate(MATCH_POPULATE_OPTIONS);

  return match;
};

/**
 * Eliminar una partida
 */
exports.deleteMatch = async (matchId, userId) => {
  const match = await Match.findById(matchId);
  if (!match) {
    throw { status: 404, message: 'Partida no encontrada' };
  }

  // Solo el creador o admin del grupo puede eliminar
  const isCreator = match.createdBy.toString() === userId.toString();
  const group = await Group.findById(match.group);
  const isGroupAdmin = group.admin.toString() === userId.toString();

  if (!isCreator && !isGroupAdmin) {
    throw { status: 403, message: 'No tienes permiso para eliminar esta partida' };
  }

  // No eliminar partidas finalizadas
  if (match.status === 'finalizada') {
    throw new Error('No puedes eliminar una partida finalizada');
  }

  await Match.findByIdAndDelete(matchId);

  return match;
};

/**
 * Obtener ranking global
 */
exports.getGlobalRanking = async () => {
  return await rankingService.getGlobalRanking();
};

/**
 * Obtener ranking de un grupo
 */
exports.getGroupRanking = async (groupId, userId) => {
  // Verificar que el grupo existe
  const group = await Group.findById(groupId);
  if (!group) {
    throw { status: 404, message: 'Grupo no encontrado' };
  }

  // Verificar que el usuario es miembro del grupo
  const isMember = group.members.some(
    member => member.user.toString() === userId.toString()
  );

  if (!isMember) {
    throw { status: 403, message: 'No eres miembro de este grupo' };
  }

  return await rankingService.getGroupRanking(groupId);
};
