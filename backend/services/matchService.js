const Match = require('../models/Match');
const Group = require('../models/Group');
const Game = require('../models/Game');
const User = require('../models/User');
const pointsCalculator = require('./pointsCalculator');
const rankingService = require('./rankingService');

/**
 * Constantes de populate optimizadas con proyecciones mínimas
 * NOTA: Incluimos _id para que el frontend pueda hacer comparaciones correctas
 */
const MATCH_POPULATE_OPTIONS = [
  { path: 'game', select: 'name image thumbnail', options: { lean: true } },
  { path: 'group', select: 'name', options: { lean: true } },
  { path: 'players.user', select: 'name avatar', options: { lean: true } },
  { path: 'createdBy', select: 'name email avatar', options: { lean: true } },
  { path: 'winner', select: 'name avatar', options: { lean: true } },
];

const MATCH_POPULATE_LIST = [
  { path: 'game', select: 'name image', options: { lean: true } },
  { path: 'group', select: 'name', options: { lean: true } },
  { path: 'players.user', select: 'name avatar', options: { lean: true } },
  { path: 'createdBy', select: 'name', options: { lean: true } },
];

const MATCH_POPULATE_DETAILED = [
  { path: 'game', select: 'name image description minPlayers maxPlayers playingTime', options: { lean: true } },
  { path: 'group', select: 'name avatar', options: { lean: true } },
  { path: 'players.user', select: 'name email avatar stats', options: { lean: true } },
  { path: 'createdBy', select: 'name email avatar', options: { lean: true } },
  { path: 'winner', select: 'name email avatar', options: { lean: true } },
];

/**
 * Proyecciones para consultas de Match
 */
const MATCH_LIST_PROJECTION = {
  game: 1,
  group: 1,
  scheduledDate: 1,
  status: 1,
  location: 1,
  players: 1,
  winner: 1,
  createdBy: 1,
  createdAt: 1,
};

/**
 * Validar que el usuario es miembro del grupo (optimizado con projection)
 */
exports.validateGroupMembership = async (groupId, userId) => {
  const group = await Group.findById(groupId)
    .select('members')
    .lean();
    
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

  // Verificar que el juego existe (solo necesitamos saber que existe)
  const game = await Game.findById(gameId)
    .select('_id name group')
    .lean();
    
  if (!game) {
    throw { status: 404, message: 'Juego no encontrado' };
  }

  // Verificar que el grupo existe y el usuario es miembro (usando projection)
  const group = await Group.findById(groupId)
    .select('members')
    .lean();
    
  if (!group) {
    throw { status: 404, message: 'Grupo no encontrado' };
  }
  
  const memberUserIds = new Set(group.members.map(m => m.user.toString()));
  
  if (!memberUserIds.has(userId.toString())) {
    throw { status: 403, message: 'No eres miembro de este grupo' };
  }

  // Validar fecha
  if (new Date(scheduledDate) < new Date()) {
    throw new Error('La fecha de la partida no puede ser en el pasado');
  }

  // Preparar jugadores usando Set para unicidad
  const userIdStr = userId.toString();
  const uniquePlayerIds = new Set();
  
  if (playerIds && Array.isArray(playerIds) && playerIds.length > 0) {
    playerIds.forEach(id => uniquePlayerIds.add(id.toString()));
  }
  // Agregar el creador si no está en la lista
  if (!uniquePlayerIds.has(userIdStr)) {
    uniquePlayerIds.add(userIdStr);
  }
  
  // Validar que todos los jugadores son miembros del grupo (optimizado sin queries adicionales)
  const players = [];
  for (const playerId of uniquePlayerIds) {
    if (!memberUserIds.has(playerId)) {
      // Solo hacemos query si el usuario no está en el grupo
      const user = await User.findById(playerId).select('name').lean();
      const userName = user ? user.name : playerId;
      throw { status: 403, message: `El usuario ${userName} no es miembro del grupo` };
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
 * Listar partidas con filtros (optimizado con lean y projection)
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
    // Optimizado: solo obtener _id de grupos
    const userGroups = await Group.find({
      'members.user': userId
    })
      .select('_id')
      .lean();
    
    const groupIds = userGroups.map(g => g._id);
    filter.group = { $in: groupIds };
  }
  
  if (status) {
    filter.status = status;
  }

  // Paginación
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const limitNum = parseInt(limit);

  // Consultas en paralelo para mejor rendimiento
  const [matches, total] = await Promise.all([
    Match.find(filter)
      .select(MATCH_LIST_PROJECTION)
      .populate(MATCH_POPULATE_LIST)
      .sort({ scheduledDate: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Match.countDocuments(filter)
  ]);

  return {
    matches,
    count: matches.length,
    total,
    pages: Math.ceil(total / limitNum),
    currentPage: parseInt(page),
  };
};

/**
 * Obtener una partida por ID con acceso verificado (optimizado)
 */
exports.getMatchById = async (matchId, userId) => {
  const match = await Match.findById(matchId)
    .populate(MATCH_POPULATE_DETAILED)
    .lean();

  if (!match) {
    throw { status: 404, message: 'Partida no encontrada' };
  }

  // Verificar permiso de acceso (usando datos ya cargados del populate)
  const groupId = match.group._id || match.group;
  const group = await Group.findById(groupId)
    .select('members')
    .lean();
    
  const isMember = group.members.some(
    member => member.user.toString() === userId.toString()
  );

  if (!isMember) {
    throw { status: 403, message: 'No tienes permiso para ver esta partida' };
  }

  return match;
};

/**
 * Actualizar una partida (optimizado)
 */
exports.updateMatch = async (matchId, updates, userId) => {
  // Obtener el documento completo para evitar problemas con validaciones de Mongoose
  const match = await Match.findById(matchId);
    
  if (!match) {
    throw { status: 404, message: 'Partida no encontrada' };
  }

  // Solo el creador o admin del grupo puede editar
  const isCreator = match.createdBy.toString() === userId.toString();
  
  // Solo consultar grupo si no es el creador
  let isGroupAdmin = false;
  if (!isCreator) {
    const group = await Group.findById(match.group)
      .select('admin')
      .lean();
    isGroupAdmin = group.admin.toString() === userId.toString();
  }

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

  // Si se cambia la fecha, resetear las confirmaciones de los demás jugadores (excepto el creador)
  const oldScheduledDate = match.scheduledDate;
  const newScheduledDate = scheduledDate ? new Date(scheduledDate) : null;
  const dateChanged = newScheduledDate && oldScheduledDate.getTime() !== newScheduledDate.getTime();

  if (dateChanged) {
    match.players.forEach(player => {
      // Mantener la confirmación del creador, resetear las demás
      if (player.user.toString() !== userId.toString()) {
        player.confirmed = false;
      }
    });
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
 * Finalizar una partida y registrar resultados (optimizado)
 */
exports.finishMatch = async (matchId, userId, winnerId = null, results = [], duration = null, notes = null) => {
  const match = await Match.findById(matchId);
  if (!match) {
    throw { status: 404, message: 'Partida no encontrada' };
  }

  // Solo el creador o admin del grupo puede terminar
  const isCreator = match.createdBy.toString() === userId.toString();
  
  // Solo consultar grupo si no es el creador
  let isGroupAdmin = false;
  if (!isCreator) {
    const group = await Group.findById(match.group)
      .select('admin')
      .lean();
    isGroupAdmin = group.admin.toString() === userId.toString();
  }

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

  // Actualizar notas si se proporcionan
  if (notes !== null && notes !== undefined) {
    match.notes = notes;
  }

  match.status = 'finalizada';
  match.actualDate = new Date();

  await match.save();

  // Actualizar ranking automáticamente
  const rankingReport = await rankingService.updateMatchStatistics(match);

  // Actualizar estadísticas del grupo
  if (match.group) {
    await Group.findByIdAndUpdate(
      match.group,
      { $inc: { 'stats.totalMatches': 1 } }
    );
  }

  await match.populate(MATCH_POPULATE_OPTIONS);

  return { match, rankingReport };
};

/**
 * Confirmar asistencia a partida (optimizado)
 */
exports.confirmAttendance = async (matchId, userId) => {
  // No usamos select() para obtener todos los campos y poder devolverlos completos
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
  await match.populate(MATCH_POPULATE_DETAILED);

  return match;
};

/**
 * Cancelar asistencia a partida (abandonar partida)
 * Si el usuario no es el creador, se elimina de la partida
 * Si solo queda 1 jugador, la partida se elimina
 */
exports.cancelAttendance = async (matchId, userId) => {
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

  // No cancelar si la partida ya finalizó o está cancelada
  if (match.status === 'finalizada' || match.status === 'cancelada') {
    throw new Error(`No puedes cancelar asistencia a una partida ${match.status}`);
  }

  const isCreator = match.createdBy.toString() === userId.toString();

  if (isCreator) {
    // El creador solo cancela su confirmación, no puede abandonar
    match.players[playerIndex].confirmed = false;
  } else {
    // Los demás jugadores abandonan la partida (se eliminan)
    match.players.splice(playerIndex, 1);
    
    // Si solo queda 1 jugador (el creador), eliminar la partida
    if (match.players.length < 2) {
      await Match.findByIdAndDelete(matchId);
      return { deleted: true, message: 'Partida eliminada por falta de jugadores' };
    }
  }

  await match.save();
  await match.populate(MATCH_POPULATE_DETAILED);

  return match;
};

/**
 * Eliminar una partida (optimizado)
 */
exports.deleteMatch = async (matchId, userId) => {
  const match = await Match.findById(matchId)
    .select('createdBy group status');
    
  if (!match) {
    throw { status: 404, message: 'Partida no encontrada' };
  }

  // Solo el creador o admin del grupo puede eliminar
  const isCreator = match.createdBy.toString() === userId.toString();
  
  // Solo consultar grupo si no es el creador
  let isGroupAdmin = false;
  if (!isCreator) {
    const group = await Group.findById(match.group)
      .select('admin')
      .lean();
    isGroupAdmin = group.admin.toString() === userId.toString();
  }

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
 * Obtener ranking de un grupo (optimizado)
 */
exports.getGroupRanking = async (groupId, userId) => {
  // Verificar que el grupo existe y el usuario es miembro en una sola query
  const group = await Group.findById(groupId)
    .select('members')
    .lean();
    
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
