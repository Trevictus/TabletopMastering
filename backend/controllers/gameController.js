const Game = require('../models/Game');
const Group = require('../models/Group');
const bggService = require('../services/bggService');

/**
 * @desc    Buscar juegos en BoardGameGeek (sin guardar)
 * @route   GET /api/games/search-bgg
 * @access  Private
 */
exports.searchBGG = async (req, res, next) => {
  try {
    const { name, exact } = req.query;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'El parámetro "name" es obligatorio',
      });
    }

    const results = await bggService.searchGames(name, exact === 'true');

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener detalles de un juego de BGG por ID
 * @route   GET /api/games/bgg/:bggId
 * @access  Private
 */
exports.getBGGDetails = async (req, res, next) => {
  try {
    const { bggId } = req.params;

    if (!bggId || isNaN(bggId)) {
      return res.status(400).json({
        success: false,
        message: 'ID de BGG inválido',
      });
    }

    const gameDetails = await bggService.getGameDetails(parseInt(bggId));

    res.status(200).json({
      success: true,
      data: gameDetails,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Añadir un juego de BGG
 * @route   POST /api/games/add-from-bgg
 * @access  Private
 */
exports.addFromBGG = async (req, res, next) => {
  try {
    const { bggId, groupId, customNotes } = req.body;

    // Validaciones
    if (!bggId) {
      return res.status(400).json({
        success: false,
        message: 'El ID de BGG es obligatorio',
      });
    }

    // Verificar que el grupo existe y el usuario es miembro o admin (si se proporciona)
    if (groupId) {
      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).json({
          success: false,
          message: 'Grupo no encontrado',
        });
      }

      const isAdmin = group.admin.toString() === req.user._id.toString();
      const isMember = group.members.some(
        member => member.user.toString() === req.user._id.toString()
      );

      if (!isAdmin && !isMember) {
        return res.status(403).json({
          success: false,
          message: 'No eres miembro de este grupo',
        });
      }

      // Verificar si el juego ya existe en el grupo
      const existingGame = await Game.findOne({ 
        bggId: bggId, 
        group: groupId,
        isActive: true 
      });

      if (existingGame) {
        return res.status(400).json({
          success: false,
          message: 'Este juego ya está en la colección del grupo',
          data: existingGame,
        });
      }
    } else {
      // Si no hay grupo, verificar si el usuario ya tiene este juego de forma personal
      const existingGame = await Game.findOne({ 
        bggId: bggId, 
        addedBy: req.user._id,
        group: { $exists: false },
        isActive: true 
      });

      if (existingGame) {
        return res.status(400).json({
          success: false,
          message: 'Ya tienes este juego en tu colección personal',
          data: existingGame,
        });
      }
    }

    // Obtener detalles del juego desde BGG
    const bggData = await bggService.getGameDetails(parseInt(bggId));

    // Crear el juego en la base de datos
    const game = await Game.create({
      ...bggData,
      group: groupId || null,
      addedBy: req.user._id,
      customNotes: customNotes || '',
      isActive: true, // Asegurar que el juego esté activo
    });

    // Verificar que el juego se guardó correctamente y popularlo
    const savedGame = await Game.findById(game._id)
      .populate('addedBy', 'name email')
      .populate('group', 'name');

    if (!savedGame) {
      throw new Error('Error al guardar el juego en la base de datos');
    }

    res.status(201).json({
      success: true,
      message: 'Juego añadido desde BGG exitosamente',
      data: savedGame,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Crear un juego personalizado
 * @route   POST /api/games
 * @access  Private
 */
exports.createGame = async (req, res, next) => {
  try {
    const {
      name,
      description,
      image,
      minPlayers,
      maxPlayers,
      playingTime,
      categories,
      mechanics,
      difficulty,
      groupId,
      yearPublished,
      customNotes,
    } = req.body;

    // Validaciones
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'El nombre del juego es obligatorio',
      });
    }

    if (!minPlayers || !maxPlayers) {
      return res.status(400).json({
        success: false,
        message: 'El número de jugadores es obligatorio',
      });
    }

    // Verificar que el grupo existe y el usuario es miembro o admin (si se proporciona)
    if (groupId) {
      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).json({
          success: false,
          message: 'Grupo no encontrado',
        });
      }

      const isAdmin = group.admin.toString() === req.user._id.toString();
      const isMember = group.members.some(
        member => member.user.toString() === req.user._id.toString()
      );

      if (!isAdmin && !isMember) {
        return res.status(403).json({
          success: false,
          message: 'No eres miembro de este grupo',
        });
      }

      // Verificar si el juego ya existe en el grupo con el mismo nombre
      const existingGame = await Game.findOne({ 
        name: name, 
        group: groupId,
        isActive: true 
      });

      if (existingGame) {
        return res.status(400).json({
          success: false,
          message: 'Este juego ya está en la colección del grupo',
          data: existingGame,
        });
      }
    }

    // Crear juego personalizado
    const game = await Game.create({
      name,
      description: description || '',
      image: image || undefined,
      minPlayers,
      maxPlayers,
      playingTime: playingTime || 0,
      categories: categories || [],
      mechanics: mechanics || [],
      difficulty: difficulty || '',
      yearPublished,
      group: groupId || null,
      addedBy: req.user._id,
      source: 'custom',
      customNotes: customNotes || '',
      isActive: true, // Asegurar que el juego esté activo
    });

    // Verificar que el juego se guardó correctamente y popularlo
    const savedGame = await Game.findById(game._id)
      .populate('addedBy', 'name email')
      .populate('group', 'name');

    if (!savedGame) {
      throw new Error('Error al guardar el juego en la base de datos');
    }

    res.status(201).json({
      success: true,
      message: 'Juego personalizado creado exitosamente',
      data: savedGame,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Listar juegos (personales o por grupo sin duplicados)
 * @route   GET /api/games
 * @access  Private
 */
exports.getGames = async (req, res, next) => {
  try {
    const { groupId, source, search, page = 1, limit = 20 } = req.query;

    let filter = { isActive: true };
    let deduplicationField = null;

    // Obtener juegos según contexto
    if (groupId) {
      // Verificar acceso al grupo
      const group = await Group.findById(groupId);
      if (!group) {
        return res.status(404).json({
          success: false,
          message: 'Grupo no encontrado',
        });
      }

      const isAdmin = group.admin.toString() === req.user._id.toString();
      const isMember = group.members.some(
        member => member.user.toString() === req.user._id.toString()
      );

      if (!isAdmin && !isMember) {
        return res.status(403).json({
          success: false,
          message: 'No eres miembro de este grupo',
        });
      }

      // Juegos del grupo (sin duplicados por nombre/bggId)
      filter.group = groupId;
      deduplicationField = 'bggId'; // Deduplicar por bggId si existe
    } else {
      // Juegos personales (sin grupo)
      filter.addedBy = req.user._id;
      filter.group = null;
    }

    // Aplicar filtro de fuente si se proporciona
    if (source && ['bgg', 'custom'].includes(source)) {
      filter.source = source;
    }

    // Aplicar búsqueda si se proporciona
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { categories: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    // Obtener juegos
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const allGames = await Game.find(filter)
      .populate('addedBy', 'name email')
      .populate('group', 'name')
      .sort({ createdAt: -1 });

    // Deduplicar si es necesario (en grupo)
    const games = deduplicationField 
      ? deduplicateGames(allGames, deduplicationField)
      : allGames;

    // Aplicar paginación post-deduplicación
    const paginatedGames = games.slice(skip, skip + parseInt(limit));
    const total = games.length;

    res.status(200).json({
      success: true,
      count: paginatedGames.length,
      total,
      pages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      data: paginatedGames,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @helper  Eliminar duplicados manteniendo el primer registro único
 */
function deduplicateGames(games, field) {
  const seen = new Set();
  return games.filter(game => {
    // Para juegos de BGG, usar bggId
    const identifier = game[field] || `custom_${game._id}`;
    if (seen.has(identifier)) {
      return false;
    }
    seen.add(identifier);
    return true;
  });
}

/**
 * @desc    Obtener un juego por ID
 * @route   GET /api/games/:id
 * @access  Private
 */
exports.getGame = async (req, res, next) => {
  try {
    const game = await Game.findOne({ _id: req.params.id, isActive: true })
      .populate('addedBy', 'name email avatar')
      .populate('group', 'name description avatar');

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Juego no encontrado',
      });
    }

    // Verificar acceso si tiene grupo
    if (game.group) {
      const group = await Group.findById(game.group._id);
      const isAdmin = group.admin.toString() === req.user._id.toString();
      const isMember = group.members.some(
        member => member.user.toString() === req.user._id.toString()
      );

      if (!isAdmin && !isMember) {
        return res.status(403).json({
          success: false,
          message: 'No tienes acceso a este juego',
        });
      }
    }

    res.status(200).json({
      success: true,
      data: game,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Actualizar un juego
 * @route   PUT /api/games/:id
 * @access  Private
 */
exports.updateGame = async (req, res, next) => {
  try {
    let game = await Game.findOne({ _id: req.params.id, isActive: true });

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Juego no encontrado',
      });
    }

    // Verificar permisos (solo si tiene grupo)
    if (game.group) {
      const group = await Group.findById(game.group);
      const member = group.members.find(
        m => m.user.toString() === req.user._id.toString()
      );

      if (!member) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para editar este juego',
        });
      }

      // Solo admin puede editar, o el usuario que lo añadió
      if (member.role !== 'admin' && game.addedBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Solo el administrador o quien añadió el juego puede editarlo',
        });
      }
    }

    // Campos permitidos para editar según el source
    let allowedFields;
    
    if (game.source === 'bgg') {
      // Para juegos de BGG, solo permitir editar campos personalizados
      allowedFields = ['customNotes', 'difficulty', 'image'];
    } else {
      // Para juegos custom, permitir editar todo excepto source y bggId
      allowedFields = [
        'name', 'description', 'image', 'minPlayers', 'maxPlayers',
        'playingTime', 'minPlayTime', 'maxPlayTime', 'categories', 'mechanics',
        'difficulty', 'yearPublished', 'customNotes'
      ];
    }

    // Filtrar campos permitidos
    const updates = {};
    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    game = await Game.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    )
      .populate('addedBy', 'name email')
      .populate('group', 'name');

    // Verificar que la actualización fue exitosa
    if (!game) {
      throw new Error('Error al actualizar el juego en la base de datos');
    }

    res.status(200).json({
      success: true,
      message: 'Juego actualizado exitosamente',
      data: game,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Sincronizar juego de BGG (actualizar datos)
 * @route   PUT /api/games/:id/sync-bgg
 * @access  Private
 */
exports.syncBGGGame = async (req, res, next) => {
  try {
    const game = await Game.findOne({ _id: req.params.id, isActive: true });

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Juego no encontrado',
      });
    }

    if (game.source !== 'bgg') {
      return res.status(400).json({
        success: false,
        message: 'Este endpoint solo funciona con juegos de BGG',
      });
    }

    // Verificar permisos
    if (game.group) {
      const group = await Group.findById(game.group);
      const isAdmin = group.admin.toString() === req.user._id.toString();
      const isMember = group.members.some(
        m => m.user.toString() === req.user._id.toString()
      );

      if (!isAdmin && !isMember) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para sincronizar este juego',
        });
      }
    }

    // Obtener datos actualizados de BGG
    const bggData = await bggService.getGameDetails(game.bggId);

    // Actualizar el juego directamente para evitar problemas de validación cruzada
    game.name = bggData.name;
    game.description = bggData.description;
    game.image = bggData.image;
    game.thumbnail = bggData.thumbnail;
    game.yearPublished = bggData.yearPublished;
    game.minPlayers = bggData.minPlayers;
    game.maxPlayers = bggData.maxPlayers;
    game.playingTime = bggData.playingTime;
    game.minPlayTime = bggData.minPlayTime;
    game.maxPlayTime = bggData.maxPlayTime;
    game.categories = bggData.categories;
    game.mechanics = bggData.mechanics;
    game.designer = bggData.designer;
    game.publisher = bggData.publisher;
    game.rating = bggData.rating;
    game.bggLastSync = new Date();

    // Guardar y popular
    const updatedGame = await game.save();
    await updatedGame.populate('addedBy', 'name email');
    await updatedGame.populate('group', 'name');

    // Verificar que la sincronización fue exitosa
    if (!updatedGame) {
      throw new Error('Error al sincronizar el juego con BGG');
    }

    res.status(200).json({
      success: true,
      message: 'Juego sincronizado con BGG exitosamente',
      data: updatedGame,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Eliminar un juego (soft delete)
 * @route   DELETE /api/games/:id
 * @access  Private
 */
exports.deleteGame = async (req, res, next) => {
  try {
    const game = await Game.findOne({ _id: req.params.id, isActive: true });

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Juego no encontrado',
      });
    }

    // Verificar permisos
    if (game.group) {
      const group = await Group.findById(game.group);
      const member = group.members.find(
        m => m.user.toString() === req.user._id.toString()
      );

      if (!member) {
        return res.status(403).json({
          success: false,
          message: 'No tienes permisos para eliminar este juego',
        });
      }

      // Solo admin puede eliminar, o el usuario que lo añadió
      if (member.role !== 'admin' && game.addedBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Solo el administrador o quien añadió el juego puede eliminarlo',
        });
      }
    }

    // Soft delete
    game.isActive = false;
    await game.save();

    res.status(200).json({
      success: true,
      message: 'Juego eliminado exitosamente',
      data: {},
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener juegos populares de BGG
 * @route   GET /api/games/bgg/hot
 * @access  Private
 */
exports.getHotGames = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;
    const hotGames = await bggService.getHotGames(parseInt(limit));

    res.status(200).json({
      success: true,
      count: hotGames.length,
      data: hotGames,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Obtener estadísticas de juegos de un grupo
 * @route   GET /api/games/stats/:groupId
 * @access  Private
 */
exports.getGroupGameStats = async (req, res, next) => {
  try {
    const { groupId } = req.params;

    // Verificar acceso al grupo
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Grupo no encontrado',
      });
    }

    const isAdmin = group.admin.toString() === req.user._id.toString();
    const isMember = group.members.some(
      m => m.user.toString() === req.user._id.toString()
    );

    if (!isAdmin && !isMember) {
      return res.status(403).json({
        success: false,
        message: 'No eres miembro de este grupo',
      });
    }

    // Obtener estadísticas
    const totalGames = await Game.countDocuments({ group: groupId, isActive: true });
    const bggGames = await Game.countDocuments({ group: groupId, source: 'bgg', isActive: true });
    const customGames = await Game.countDocuments({ group: groupId, source: 'custom', isActive: true });
    
    const topRatedGames = await Game.find({ group: groupId, isActive: true })
      .sort({ 'rating.average': -1 })
      .limit(5)
      .select('name rating.average image');

    const mostPlayedGames = await Game.find({ group: groupId, isActive: true })
      .sort({ 'stats.timesPlayed': -1 })
      .limit(5)
      .select('name stats.timesPlayed image');

    const categoriesStats = await Game.aggregate([
      { $match: { group: group._id, isActive: true } },
      { $unwind: '$categories' },
      { $group: { _id: '$categories', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalGames: totalGames,
        total: totalGames, // Mantener retrocompatibilidad
        bySource: {
          bgg: bggGames,
          custom: customGames,
        },
        topRated: topRatedGames,
        mostPlayed: mostPlayedGames,
        topCategories: categoriesStats.map(c => ({ name: c._id, count: c.count })),
      },
    });
  } catch (error) {
    next(error);
  }
};
